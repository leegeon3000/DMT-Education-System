import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { query } from '../utils/database';
import { ResponseHelper } from '../utils/response';
import { authenticateToken, requireRole, ROLES } from '../middleware/auth';
import { validateBody, validateParams, validateQuery, PaginationSchema, IdParamSchema } from '../middleware/validation';

const CreateSubjectSchema = z.object({
  name: z.string().min(1).max(120),
  code: z.string().min(1).max(50),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
});

const UpdateSubjectSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  code: z.string().min(1).max(50).optional(),
  description: z.string().optional(),
  is_active: z.boolean().optional(),
});

const SubjectQuerySchema = PaginationSchema.extend({
  is_active: z.coerce.boolean().optional(),
});

export async function subjectsRoutes(app: FastifyInstance) {
  // GET /subjects - List subjects
  app.get('/subjects', {
    preValidation: [authenticateToken],
    preHandler: [validateQuery(SubjectQuerySchema)]
  }, async (req: any, reply: any) => {
    try {
      const { page, limit, search, is_active } = req.query;
      const offset = (page - 1) * limit;

      let conditions: string[] = [];
      let params: any[] = [];
      let paramIndex = 1;

      if (search) {
        conditions.push(`(name ILIKE $${paramIndex} OR code ILIKE $${paramIndex})`);
        params.push(`%${search}%`);
        paramIndex++;
      }

      if (is_active !== undefined) {
        conditions.push(`is_active = $${paramIndex}`);
        params.push(is_active);
        paramIndex++;
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      // Count query
      const countSql = `SELECT COUNT(*) as total FROM subjects ${whereClause}`;
      const countResult = await query(countSql, params);
      const total = parseInt(countResult.rows[0].total);

      // Data query
      const dataSql = `
        SELECT * FROM subjects
        ${whereClause}
        ORDER BY name
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;
      const dataResult = await query(dataSql, [...params, limit, offset]);

      return ResponseHelper.successWithPagination(
        reply,
        dataResult.rows,
        { page, limit, total }
      );
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // GET /subjects/:id
  app.get('/subjects/:id', {
    preValidation: [authenticateToken],
    preHandler: [validateParams(IdParamSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { id } = req.params;
      const sql = `SELECT * FROM subjects WHERE id = $1`;
      const result = await query(sql, [id]);

      if (result.rows.length === 0) {
        return ResponseHelper.notFound(reply, 'Subject');
      }

      return ResponseHelper.success(reply, result.rows[0]);
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // POST /subjects
  app.post('/subjects', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN, ROLES.STAFF])],
    preHandler: [validateBody(CreateSubjectSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { name, code, description, is_active } = req.body;
      const sql = `
        INSERT INTO subjects (name, code, description, is_active)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      const result = await query(sql, [name, code, description, is_active]);

      return ResponseHelper.success(reply, result.rows[0], 'Subject created successfully', 201);
    } catch (error: any) {
      if (error.code === '23505') {
        return ResponseHelper.error(reply, 'Subject code already exists', 409);
      }
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // PUT /subjects/:id
  app.put('/subjects/:id', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN, ROLES.STAFF])],
    preHandler: [validateParams(IdParamSchema), validateBody(UpdateSubjectSchema)]
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
      const sql = `
        UPDATE subjects
        SET ${setClauses.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `;
      const result = await query(sql, values);

      if (result.rows.length === 0) {
        return ResponseHelper.notFound(reply, 'Subject');
      }

      return ResponseHelper.success(reply, result.rows[0], 'Subject updated successfully');
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // DELETE /subjects/:id
  app.delete('/subjects/:id', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN])],
    preHandler: [validateParams(IdParamSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { id } = req.params;

      // Check if subject is used in courses
      const checkSql = `SELECT id FROM courses WHERE subject_id = $1 LIMIT 1`;
      const checkResult = await query(checkSql, [id]);

      if (checkResult.rows.length > 0) {
        return ResponseHelper.error(reply, 'Cannot delete subject that is used in courses', 409);
      }

      const deleteSql = `DELETE FROM subjects WHERE id = $1 RETURNING id`;
      const deleteResult = await query(deleteSql, [id]);

      if (deleteResult.rows.length === 0) {
        return ResponseHelper.notFound(reply, 'Subject');
      }

      return ResponseHelper.success(reply, null, 'Subject deleted successfully');
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });
}