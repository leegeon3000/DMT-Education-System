import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { query } from '../utils/database';
import { ResponseHelper } from '../utils/response';
import { authenticateToken, requireRole, ROLES } from '../middleware/auth';
import { validateBody, validateParams, validateQuery, PaginationSchema, IdParamSchema } from '../middleware/validation';

const CreateCourseSchema = z.object({
  subject_id: z.number().int().positive(),
  code: z.string().min(1).max(50),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  duration_weeks: z.number().int().positive().default(12),
  total_sessions: z.number().int().positive().default(24),
  price: z.number().positive().optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
  is_active: z.boolean().default(true),
});

const UpdateCourseSchema = z.object({
  subject_id: z.number().int().positive().optional(),
  code: z.string().min(1).max(50).optional(),
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  duration_weeks: z.number().int().positive().optional(),
  total_sessions: z.number().int().positive().optional(),
  price: z.number().positive().optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  is_active: z.boolean().optional(),
});

const CourseQuerySchema = PaginationSchema.extend({
  subject_id: z.coerce.number().int().positive().optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  is_active: z.coerce.boolean().optional(),
});

export async function coursesRoutes(app: FastifyInstance) {
  // GET /courses - List courses with filters (PUBLIC - no auth required)
  app.get('/courses', {
    preHandler: [validateQuery(CourseQuerySchema)]
  }, async (req: any, reply: any) => {
    try {
      const { page, limit, search, subject_id, level, is_active } = req.query;
      const offset = (page - 1) * limit;

      let conditions: string[] = [];
      let params: any[] = [];
      let paramIndex = 1;

      if (search) {
        conditions.push(`(c.name ILIKE $${paramIndex} OR c.code ILIKE $${paramIndex} OR c.description ILIKE $${paramIndex})`);
        params.push(`%${search}%`);
        paramIndex++;
      }

      if (subject_id) {
        conditions.push(`c.subject_id = $${paramIndex}`);
        params.push(subject_id);
        paramIndex++;
      }

      if (level) {
        conditions.push(`c.level = $${paramIndex}`);
        params.push(level);
        paramIndex++;
      }

      if (is_active !== undefined) {
        conditions.push(`c.is_active = $${paramIndex}`);
        params.push(is_active);
        paramIndex++;
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      // Count query
      const countQuery = `
        SELECT COUNT(*) as total
        FROM courses c
        ${whereClause}
      `;
      const countResult = await query(countQuery, params);
      const total = parseInt(countResult.rows[0].total);

      // Data query (SQL Server syntax with OFFSET/FETCH)
      const dataQuery = `
        SELECT 
          c.id, c.subject_id, c.code, c.name, c.description,
          c.duration_weeks, c.total_sessions, c.price, c.level,
          c.is_active, c.created_at, c.thumbnail_url, c.students_count,
          s.id as subject_id_ref,
          s.name as subject_name,
          s.code as subject_code,
          s.description as subject_description
        FROM courses c
        INNER JOIN subjects s ON c.subject_id = s.id
        ${whereClause}
        ORDER BY c.created_at DESC
        OFFSET $${paramIndex} ROWS
        FETCH NEXT $${paramIndex + 1} ROWS ONLY
      `;
      const dataResult = await query(dataQuery, [...params, offset, limit]);
      
      // Transform to match expected structure
      const transformedData = dataResult.rows.map((row: any) => ({
        ...row,
        thumbnail: row.thumbnail_url,
        students: row.students_count,
        subjects: {
          id: row.subject_id_ref,
          name: row.subject_name,
          code: row.subject_code,
          description: row.subject_description
        }
      }));

      return ResponseHelper.successWithPagination(
        reply,
        transformedData,
        { page, limit, total }
      );
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // GET /courses/:id - Get course details (PUBLIC - no auth required)
  app.get('/courses/:id', {
    preHandler: [validateParams(IdParamSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { id } = req.params;
      const sql = `
        SELECT 
          c.id, c.subject_id, c.code, c.name, c.description,
          c.duration_weeks, c.total_sessions, c.price, c.level,
          c.is_active, c.created_at, c.thumbnail_url, c.students_count,
          s.id as subject_id_ref,
          s.name as subject_name,
          s.code as subject_code,
          s.description as subject_description
        FROM courses c
        INNER JOIN subjects s ON c.subject_id = s.id
        WHERE c.id = $1
      `;
      const result = await query(sql, [id]);

      if (result.rows.length === 0) {
        return ResponseHelper.notFound(reply, 'Course');
      }

      const course = {
        ...result.rows[0],
        thumbnail: result.rows[0].thumbnail_url,
        students: result.rows[0].students_count,
        subjects: {
          id: result.rows[0].subject_id_ref,
          name: result.rows[0].subject_name,
          code: result.rows[0].subject_code,
          description: result.rows[0].subject_description
        }
      };

      return ResponseHelper.success(reply, course);
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // POST /courses - Create new course
  app.post('/courses', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN, ROLES.STAFF])],
    preHandler: [validateBody(CreateCourseSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { subject_id, code, name, description, duration_weeks, total_sessions, price, level, is_active } = req.body;
      
      const insertSql = `
        INSERT INTO courses (subject_id, code, name, description, duration_weeks, total_sessions, price, level, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id
      `;
      const insertResult = await query(insertSql, [
        subject_id, code, name, description, duration_weeks, total_sessions, price, level, is_active
      ]);

      const courseId = insertResult.rows[0].id;

      // Fetch the created course with subject info
      const selectSql = `
        SELECT 
          c.*,
          json_build_object(
            'id', s.id,
            'name', s.name,
            'code', s.code
          ) as subjects
        FROM courses c
        INNER JOIN subjects s ON c.subject_id = s.id
        WHERE c.id = $1
      `;
      const selectResult = await query(selectSql, [courseId]);

      return ResponseHelper.success(reply, selectResult.rows[0], 'Course created successfully', 201);
    } catch (error: any) {
      if (error.code === '23505') {
        return ResponseHelper.error(reply, 'Course code already exists', 409);
      }
      if (error.code === '23503') {
        return ResponseHelper.error(reply, 'Invalid subject ID', 400);
      }
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // PUT /courses/:id - Update course
  app.put('/courses/:id', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN, ROLES.STAFF])],
    preHandler: [validateParams(IdParamSchema), validateBody(UpdateCourseSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const setClauses: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      Object.entries(updates).forEach(([key, value]) => {
        setClauses.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      });

      if (setClauses.length === 0) {
        return ResponseHelper.error(reply, 'No fields to update', 400);
      }

      values.push(id);
      const updateSql = `
        UPDATE courses
        SET ${setClauses.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING id
      `;
      const updateResult = await query(updateSql, values);

      if (updateResult.rows.length === 0) {
        return ResponseHelper.notFound(reply, 'Course');
      }

      // Fetch updated course with subject info
      const selectSql = `
        SELECT 
          c.*,
          json_build_object(
            'id', s.id,
            'name', s.name,
            'code', s.code
          ) as subjects
        FROM courses c
        INNER JOIN subjects s ON c.subject_id = s.id
        WHERE c.id = $1
      `;
      const selectResult = await query(selectSql, [id]);

      return ResponseHelper.success(reply, selectResult.rows[0], 'Course updated successfully');
    } catch (error: any) {
      if (error.code === '23503') {
        return ResponseHelper.error(reply, 'Invalid subject ID', 400);
      }
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // DELETE /courses/:id - Delete course
  app.delete('/courses/:id', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN])],
    preHandler: [validateParams(IdParamSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { id } = req.params;

      // Check if course is used in classes
      const checkSql = `SELECT id FROM classes WHERE course_id = $1 LIMIT 1`;
      const checkResult = await query(checkSql, [id]);

      if (checkResult.rows.length > 0) {
        return ResponseHelper.error(reply, 'Cannot delete course that has classes', 409);
      }

      const deleteSql = `DELETE FROM courses WHERE id = $1 RETURNING id`;
      const deleteResult = await query(deleteSql, [id]);

      if (deleteResult.rows.length === 0) {
        return ResponseHelper.notFound(reply, 'Course');
      }

      return ResponseHelper.success(reply, null, 'Course deleted successfully');
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // GET /courses/:id/classes - Get classes for a course
  app.get('/courses/:id/classes', {
    preValidation: [authenticateToken],
    preHandler: [validateParams(IdParamSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { id } = req.params;
      
      const sql = `
        SELECT 
          c.*,
          json_build_object(
            'id', t.id,
            'teacher_code', t.teacher_code,
            'users', json_build_object('full_name', u.full_name)
          ) as teachers
        FROM classes c
        INNER JOIN teachers t ON c.teacher_id = t.id
        INNER JOIN users u ON t.user_id = u.id
        WHERE c.course_id = $1
        ORDER BY c.start_date DESC
      `;
      const result = await query(sql, [id]);

      return ResponseHelper.success(reply, result.rows);
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });
}