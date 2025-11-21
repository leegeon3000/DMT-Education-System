import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { executeProcedure, sql, query } from '../utils/database';
import { authenticateToken, requireRole, ROLES } from '../middleware/auth';

const CreateEnrollmentSchema = z.object({
  class_id: z.number().int().positive(),
  student_id: z.number().int().positive(),
  total_fee: z.number().positive(),
  discount_percent: z.number().min(0).max(100).default(0),
  notes: z.string().optional(),
});

export async function enrollmentsRoutes(app: FastifyInstance) {
  // POST /enrollments - Enroll student in a class
  app.post('/enrollments', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN, ROLES.STAFF])]
  }, async (req: any, reply) => {
    const schema = CreateEnrollmentSchema;
    const parsed = schema.safeParse(req.body);
    
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.flatten() });
    }

    const data = parsed.data;

    try {
      const result = await executeProcedure('sp_EnrollStudent', {
        input: {
          class_id: data.class_id,
          student_id: data.student_id,
          total_fee: data.total_fee,
          discount_percent: data.discount_percent,
          notes: data.notes || null,
        },
        output: {
          enrollment_id: sql.Int,
          error_message: sql.NVarChar(500),
        },
      });

      if (result.returnValue === 0) {
        return reply.code(201).send({
          success: true,
          message: 'Student enrolled successfully',
          data: {
            enrollment_id: result.output.enrollment_id,
          },
        });
      } else {
        return reply.code(400).send({
          success: false,
          error: result.output.error_message || 'Enrollment failed',
        });
      }
    } catch (error: any) {
      console.error('Enroll student error:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });

  // DELETE /enrollments/:id - Drop enrollment
  app.delete('/enrollments/:id', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN, ROLES.STAFF])]
  }, async (req: any, reply) => {
    const schema = z.object({
      id: z.string().transform(Number),
    });

    const parsed = schema.safeParse(req.params);
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.flatten() });
    }

    const { id } = parsed.data;

    try {
      const result = await executeProcedure('sp_DropEnrollment', {
        input: {
          enrollment_id: id,
        },
        output: {
          error_message: sql.NVarChar(500),
        },
      });

      if (result.returnValue === 0) {
        return reply.send({
          success: true,
          message: 'Enrollment dropped successfully',
        });
      } else {
        return reply.code(400).send({
          success: false,
          error: result.output.error_message || 'Drop enrollment failed',
        });
      }
    } catch (error: any) {
      console.error('Drop enrollment error:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });

  // GET /enrollments/student/:studentId - Get student enrollments
  app.get('/enrollments/student/:studentId', {
    preValidation: [authenticateToken]
  }, async (req: any, reply) => {
    const schema = z.object({
      studentId: z.string().transform(Number),
    });

    const parsed = schema.safeParse(req.params);
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.flatten() });
    }

    const { studentId } = parsed.data;

    try {
      const result = await query(`
        SELECT 
          e.*,
          c.name as class_name,
          c.code as class_code,
          c.status as class_status,
          c.start_date,
          c.end_date,
          c.schedule,
          co.name as course_name,
          co.code as course_code,
          s.name as subject_name,
          t.teacher_code,
          u.full_name as teacher_name
        FROM ENROLLMENTS e
        JOIN CLASSES c ON e.class_id = c.id
        JOIN COURSES co ON c.course_id = co.id
        JOIN SUBJECTS s ON co.subject_id = s.id
        LEFT JOIN TEACHERS t ON c.teacher_id = t.id
        LEFT JOIN USERS u ON t.user_id = u.id
        WHERE e.student_id = @p1
        ORDER BY e.enrollment_date DESC
      `, [studentId]);

      return {
        success: true,
        data: result.rows,
      };
    } catch (error: any) {
      console.error('Get student enrollments error:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });

  // GET /enrollments/class/:classId - Get class enrollments
  app.get('/enrollments/class/:classId', {
    preValidation: [authenticateToken]
  }, async (req: any, reply) => {
    const schema = z.object({
      classId: z.string().transform(Number),
    });

    const parsed = schema.safeParse(req.params);
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.flatten() });
    }

    const { classId } = parsed.data;

    try {
      const result = await query(`
        SELECT 
          e.*,
          u.full_name as student_name,
          u.email as student_email,
          s.student_code,
          s.phone as student_phone,
          s.school_level
        FROM ENROLLMENTS e
        JOIN STUDENTS s ON e.student_id = s.id
        JOIN USERS u ON s.user_id = u.id
        WHERE e.class_id = @p1
        ORDER BY u.full_name
      `, [classId]);

      return {
        success: true,
        data: result.rows,
      };
    } catch (error: any) {
      console.error('Get class enrollments error:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });

  // GET /enrollments - List all enrollments with pagination
  app.get('/enrollments', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN, ROLES.STAFF])]
  }, async (req: any, reply) => {
    const schema = z.object({
      page: z.string().optional().default('1').transform(Number),
      limit: z.string().optional().default('10').transform(Number),
      class_id: z.string().optional().transform(v => v ? Number(v) : undefined),
      student_id: z.string().optional().transform(v => v ? Number(v) : undefined),
      status: z.enum(['ACTIVE', 'COMPLETED', 'DROPPED']).optional(),
    });

    const parsed = schema.safeParse(req.query);
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.flatten() });
    }

    const { page, limit, class_id, student_id, status } = parsed.data;
    const offset = (page - 1) * limit;

    try {
      let whereClause = 'WHERE 1=1';
      const params: any[] = [];
      let paramIndex = 1;

      if (class_id) {
        whereClause += ` AND e.class_id = @p${paramIndex}`;
        params.push(class_id);
        paramIndex++;
      }

      if (student_id) {
        whereClause += ` AND e.student_id = @p${paramIndex}`;
        params.push(student_id);
        paramIndex++;
      }

      if (status) {
        whereClause += ` AND e.status = @p${paramIndex}`;
        params.push(status);
        paramIndex++;
      }

      const result = await query(`
        SELECT 
          e.*,
          u.full_name as student_name,
          s.student_code,
          c.name as class_name,
          c.code as class_code,
          co.name as course_name
        FROM ENROLLMENTS e
        JOIN STUDENTS s ON e.student_id = s.id
        JOIN USERS u ON s.user_id = u.id
        JOIN CLASSES c ON e.class_id = c.id
        JOIN COURSES co ON c.course_id = co.id
        ${whereClause}
        ORDER BY e.enrollment_date DESC
        OFFSET @p${paramIndex} ROWS
        FETCH NEXT @p${paramIndex + 1} ROWS ONLY
      `, [...params, offset, limit]);

      const countResult = await query(`
        SELECT COUNT(*) as total
        FROM ENROLLMENTS e
        ${whereClause}
      `, params);

      const total = countResult.rows[0]?.total || 0;

      return {
        success: true,
        data: result.rows,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error: any) {
      console.error('Get enrollments error:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });
}
