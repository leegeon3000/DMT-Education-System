import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { query } from '../utils/database';

const StudentQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  school_level: z.enum(['ELEMENTARY', 'MIDDLE_SCHOOL', 'HIGH_SCHOOL']).optional(),
  status: z.string().optional(),
});

export async function studentsRoutes(app: FastifyInstance) {
  // GET /students - List students with filters
  app.get('/students', async (req, reply) => {
    try {
      const parsed = StudentQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        return reply.code(400).send({ 
          success: false, 
          error: 'Query validation error: ' + parsed.error.errors[0].message 
        });
      }

      const { page, limit, search, school_level, status } = parsed.data;
      const offset = (page - 1) * limit;

      // Build WHERE conditions
      const conditions: string[] = ['1=1'];
      const params: any[] = [];
      let paramIndex = 1;

      if (search) {
        conditions.push(`(u.full_name LIKE @p${paramIndex} OR u.email LIKE @p${paramIndex} OR s.student_code LIKE @p${paramIndex})`);
        params.push(`%${search}%`);
        paramIndex++;
      }

      if (school_level) {
        conditions.push(`s.school_level = @p${paramIndex}`);
        params.push(school_level);
        paramIndex++;
      }

      if (status) {
        conditions.push(`u.status = @p${paramIndex}`);
        params.push(status === 'active' ? 1 : 0);
        paramIndex++;
      }

      const whereClause = conditions.join(' AND ');

      // Get students with user info
      const sql_query = `
        SELECT 
          s.*,
          u.email,
          u.full_name,
          u.phone,
          u.address,
          u.birth_date,
          u.status,
          u.created_at
        FROM STUDENTS s
        INNER JOIN USERS u ON s.user_id = u.id
        WHERE ${whereClause}
        ORDER BY s.created_at DESC
        OFFSET @p${paramIndex} ROWS FETCH NEXT @p${paramIndex + 1} ROWS ONLY
      `;
      
      params.push(offset, limit);

      const result = await query(sql_query, params);

      // Get total count
      const countQuery = `
        SELECT COUNT(*) as total
        FROM STUDENTS s
        INNER JOIN USERS u ON s.user_id = u.id
        WHERE ${whereClause}
      `;
      const countResult = await query(countQuery, params.slice(0, paramIndex - 1));
      const total = countResult.rows[0]?.TOTAL || countResult.rows[0]?.total || 0;

      return reply.send({
        success: true,
        data: result.rows,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });

    } catch (error: any) {
      console.error('Get students error:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Failed to fetch students'
      });
    }
  });

  // GET /students/:id - Get student details
  app.get('/students/:id', async (req: any, reply) => {
    try {
      const { id } = req.params;

      const sql_query = `
        SELECT 
          s.*,
          u.email,
          u.full_name,
          u.phone,
          u.address,
          u.birth_date,
          u.avatar_url,
          u.status,
          u.created_at,
          u.updated_at
        FROM STUDENTS s
        INNER JOIN USERS u ON s.user_id = u.id
        WHERE s.id = @p1
      `;

      const result = await query(sql_query, [id]);

      if (result.rows.length === 0) {
        return reply.code(404).send({
          success: false,
          error: 'Student not found'
        });
      }

      // Get enrollments for this student
      const enrollQuery = `
        SELECT 
          e.*,
          c.name as class_name,
          c.code as class_code,
          co.name as course_name
        FROM ENROLLMENTS e
        LEFT JOIN CLASSES c ON e.class_id = c.id
        LEFT JOIN COURSES co ON c.course_id = co.id
        WHERE e.student_id = @p1
        ORDER BY e.created_at DESC
      `;
      
      const enrollResult = await query(enrollQuery, [id]);

      return reply.send({
        success: true,
        data: {
          ...result.rows[0],
          enrollments: enrollResult.rows
        }
      });

    } catch (error: any) {
      console.error('Get student error:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Failed to fetch student'
      });
    }
  });

  // GET /students/:id/enrollments - Get student's enrollments
  app.get('/students/:id/enrollments', async (req: any, reply) => {
    try {
      const { id } = req.params;

      const sql_query = `
        SELECT 
          e.*,
          c.name as class_name,
          c.code as class_code,
          c.schedule_days,
          c.schedule_time,
          co.name as course_name,
          u.full_name as teacher_name
        FROM ENROLLMENTS e
        INNER JOIN CLASSES c ON e.class_id = c.id
        INNER JOIN COURSES co ON c.course_id = co.id
        LEFT JOIN TEACHERS t ON c.teacher_id = t.id
        LEFT JOIN USERS u ON t.user_id = u.id
        WHERE e.student_id = @p1
        ORDER BY e.created_at DESC
      `;

      const result = await query(sql_query, [id]);

      return reply.send({
        success: true,
        data: result.rows
      });

    } catch (error: any) {
      console.error('Get student enrollments error:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Failed to fetch student enrollments'
      });
    }
  });
}
