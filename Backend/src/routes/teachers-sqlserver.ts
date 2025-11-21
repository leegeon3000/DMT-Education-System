import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import * as sql from 'mssql';
import { getPool } from '../utils/database';

const TeacherQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  subject_id: z.coerce.number().int().positive().optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

export async function teachersRoutes(app: FastifyInstance) {
  // GET /teachers - List teachers with filters
  app.get('/teachers', async (request, reply) => {
    try {
      const { page = 1, limit = 10, search = '', subject_id, status } = request.query as any;
      const offset = (page - 1) * limit;

      const pool = await getPool();

      // Simple query first - just get teachers
      const teachersQuery = `
        SELECT 
          t.ID,
          t.USER_ID,
          t.TEACHER_CODE,
          t.YEARS_EXPERIENCE,
          t.DEGREE,
          t.SPECIALIZATION,
          u.email,
          u.full_name,
          u.phone,
          u.status
        FROM TEACHERS t
        INNER JOIN USERS u ON t.USER_ID = u.ID
        ORDER BY t.CREATED_AT DESC
      `;

      const result = await pool.request().query(teachersQuery);

      return reply.send({
        success: true,
        data: result.recordset,
        pagination: {
          page,
          limit,
          total: result.recordset.length,
          totalPages: Math.ceil(result.recordset.length / limit),
        },
      });
    } catch (error) {
      console.error('Error fetching teachers:', error);
      return reply.status(500).send({
        success: false,
        message: 'Failed to fetch teachers',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });
}
