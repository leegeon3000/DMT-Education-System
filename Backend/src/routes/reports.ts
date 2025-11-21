import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { executeProcedure, sql, query } from '../utils/database';
import { authenticateToken, requireRole, ROLES } from '../middleware/auth';

export async function reportsRoutes(app: FastifyInstance) {
  // GET /reports/system - Get system overview
  app.get('/reports/system', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN])]
  }, async (req: any, reply) => {
    try {
      const result = await executeProcedure('sp_GetSystemOverview', {});

      return {
        success: true,
        data: result.recordset[0] || {},
      };
    } catch (error: any) {
      console.error('Get system overview error:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });

  // GET /reports/student/:studentId - Get student report
  app.get('/reports/student/:studentId', {
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
      const result = await executeProcedure('sp_GetStudentReport', {
        input: {
          student_id: studentId,
        },
      });

      // sp_GetStudentReport returns 3 result sets: basic info, enrollments, pending assignments
      return {
        success: true,
        data: {
          student_info: result.recordsets[0]?.[0] || null,
          enrollments: result.recordsets[1] || [],
          pending_assignments: result.recordsets[2] || [],
        },
      };
    } catch (error: any) {
      console.error('Get student report error:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });

  // GET /reports/class/:classId - Get class report
  app.get('/reports/class/:classId', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN, ROLES.TEACHER, ROLES.STAFF])]
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
      const result = await executeProcedure('sp_GetClassReport', {
        input: {
          class_id: classId,
        },
      });

      // sp_GetClassReport returns 3 result sets: class info, students list, attendance stats
      return {
        success: true,
        data: {
          class_info: result.recordsets[0]?.[0] || null,
          students: result.recordsets[1] || [],
          attendance_stats: result.recordsets[2] || [],
        },
      };
    } catch (error: any) {
      console.error('Get class report error:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });

  // GET /reports/revenue - Get revenue statistics
  app.get('/reports/revenue', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN, ROLES.STAFF])]
  }, async (req: any, reply) => {
    const schema = z.object({
      year: z.string().transform(Number),
      month: z.string().optional().transform(v => v ? Number(v) : null),
    });

    const parsed = schema.safeParse(req.query);
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.flatten() });
    }

    const { year, month } = parsed.data;

    try {
      if (month) {
        // Get revenue for specific month using function
        const result = await query(`
          SELECT dbo.fn_GetRevenue(@p1, @p2) as revenue
        `, [year, month]);

        return {
          success: true,
          data: {
            year,
            month,
            revenue: result.rows[0]?.revenue || 0,
          },
        };
      } else {
        // Get revenue for all months in the year
        const result = await query(`
          SELECT 
            m.month_num as month,
            dbo.fn_GetRevenue(@p1, m.month_num) as revenue
          FROM (VALUES (1),(2),(3),(4),(5),(6),(7),(8),(9),(10),(11),(12)) AS m(month_num)
          ORDER BY m.month_num
        `, [year]);

        return {
          success: true,
          data: {
            year,
            monthly_revenue: result.rows,
            total_revenue: result.rows.reduce((sum: number, row: any) => sum + (row.revenue || 0), 0),
          },
        };
      }
    } catch (error: any) {
      console.error('Get revenue statistics error:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });

  // GET /reports/attendance-rate - Get attendance rate for student(s)
  app.get('/reports/attendance-rate', {
    preValidation: [authenticateToken]
  }, async (req: any, reply) => {
    const schema = z.object({
      student_id: z.string().transform(Number),
      class_id: z.string().optional().transform(v => v ? Number(v) : null),
    });

    const parsed = schema.safeParse(req.query);
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.flatten() });
    }

    const { student_id, class_id } = parsed.data;

    try {
      const result = await query(`
        SELECT dbo.fn_GetAttendanceRate(@p1, @p2) as attendance_rate
      `, [student_id, class_id]);

      return {
        success: true,
        data: {
          student_id,
          class_id,
          attendance_rate: result.rows[0]?.attendance_rate || 0,
        },
      };
    } catch (error: any) {
      console.error('Get attendance rate error:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });

  // GET /reports/average-grade - Get average grade for student
  app.get('/reports/average-grade', {
    preValidation: [authenticateToken]
  }, async (req: any, reply) => {
    const schema = z.object({
      student_id: z.string().transform(Number),
      class_id: z.string().optional().transform(v => v ? Number(v) : null),
    });

    const parsed = schema.safeParse(req.query);
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.flatten() });
    }

    const { student_id, class_id } = parsed.data;

    try {
      const result = await query(`
        SELECT dbo.fn_GetAverageGrade(@p1, @p2) as average_grade
      `, [student_id, class_id]);

      return {
        success: true,
        data: {
          student_id,
          class_id,
          average_grade: result.rows[0]?.average_grade || 0,
        },
      };
    } catch (error: any) {
      console.error('Get average grade error:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });
}
