import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { query } from '../utils/database';

const ClassQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  course_id: z.coerce.number().int().positive().optional(),
  teacher_id: z.coerce.number().int().positive().optional(),
  status: z.enum(['planning', 'active', 'completed', 'cancelled']).optional(),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
});

export async function classesRoutes(app: FastifyInstance) {
  // GET /classes - List classes with filters
  app.get('/classes', async (req, reply) => {
    try {
      const parsed = ClassQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        return reply.code(400).send({ 
          success: false, 
          error: 'Query validation error: ' + parsed.error.errors[0].message 
        });
      }

      const { page, limit, search, course_id, teacher_id, status, sort, order } = parsed.data;
      const offset = (page - 1) * limit;

      // Build WHERE conditions
      const conditions: string[] = ['1=1'];
      const params: any[] = [];
      let paramIndex = 1;

      if (search) {
        conditions.push(`(c.name LIKE @p${paramIndex} OR c.code LIKE @p${paramIndex})`);
        params.push(`%${search}%`);
        paramIndex++;
      }

      if (course_id) {
        conditions.push(`c.course_id = @p${paramIndex}`);
        params.push(course_id);
        paramIndex++;
      }

      if (teacher_id) {
        conditions.push(`c.teacher_id = @p${paramIndex}`);
        params.push(teacher_id);
        paramIndex++;
      }

      if (status) {
        conditions.push(`c.status = @p${paramIndex}`);
        params.push(status);
        paramIndex++;
      }

      const whereClause = conditions.join(' AND ');

      // Determine sort column
      let sortColumn = 'c.created_at';
      if (sort === 'current_students') {
        sortColumn = 'c.current_students';
      } else if (sort === 'name') {
        sortColumn = 'c.name';
      } else if (sort === 'start_date') {
        sortColumn = 'c.start_date';
      }

      const sortOrder = order === 'asc' ? 'ASC' : 'DESC';

      // Get classes with joined data
      const sql_query = `
        SELECT 
          c.*,
          co.name as course_name,
          co.subject_id,
          s.name as subject_name,
          u.full_name as teacher_name
        FROM CLASSES c
        LEFT JOIN COURSES co ON c.course_id = co.id
        LEFT JOIN SUBJECTS s ON co.subject_id = s.id
        LEFT JOIN TEACHERS t ON c.teacher_id = t.id
        LEFT JOIN USERS u ON t.user_id = u.id
        WHERE ${whereClause}
        ORDER BY ${sortColumn} ${sortOrder}
        OFFSET @p${paramIndex} ROWS FETCH NEXT @p${paramIndex + 1} ROWS ONLY
      `;
      
      params.push(offset, limit);

      const result = await query(sql_query, params);

      // Get total count
      const countQuery = `
        SELECT COUNT(*) as total
        FROM CLASSES c
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
      console.error('Get classes error:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Failed to fetch classes'
      });
    }
  });

  // GET /classes/:id - Get class details
  app.get('/classes/:id', async (req: any, reply) => {
    try {
      const { id } = req.params;

      const sql_query = `
        SELECT 
          c.*,
          co.name as course_name,
          co.subject_id,
          s.name as subject_name,
          u.full_name as teacher_name,
          t.teacher_code
        FROM CLASSES c
        LEFT JOIN COURSES co ON c.course_id = co.id
        LEFT JOIN SUBJECTS s ON co.subject_id = s.id
        LEFT JOIN TEACHERS t ON c.teacher_id = t.id
        LEFT JOIN USERS u ON t.user_id = u.id
        WHERE c.id = @p1
      `;

      const result = await query(sql_query, [id]);

      if (result.rows.length === 0) {
        return reply.code(404).send({
          success: false,
          error: 'Class not found'
        });
      }

      return reply.send({
        success: true,
        data: result.rows[0]
      });

    } catch (error: any) {
      console.error('Get class error:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Failed to fetch class'
      });
    }
  });
}
