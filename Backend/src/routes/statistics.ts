import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { query } from '../utils/database';
import { authenticateToken, requireRole, ROLES } from '../middleware/auth';

export async function statisticsRoutes(app: FastifyInstance) {
  // GET /statistics/attendance-rate - Get attendance rate
  app.get('/statistics/attendance-rate', {
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
        data: result.rows[0]?.attendance_rate || 0,
      };
    } catch (error: any) {
      console.error('Get attendance rate error:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });

  // GET /statistics/average-grade - Get average grade
  app.get('/statistics/average-grade', {
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
        data: result.rows[0]?.average_grade || 0,
      };
    } catch (error: any) {
      console.error('Get average grade error:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });

  // GET /statistics/revenue - Get revenue
  app.get('/statistics/revenue', {
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
      const result = await query(`
        SELECT dbo.fn_GetRevenue(@p1, @p2) as revenue
      `, [year, month]);

      return {
        success: true,
        data: result.rows[0]?.revenue || 0,
      };
    } catch (error: any) {
      console.error('Get revenue error:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });

  // GET /statistics/can-submit-assignment - Check if student can submit assignment
  app.get('/statistics/can-submit-assignment', {
    preValidation: [authenticateToken]
  }, async (req: any, reply) => {
    const schema = z.object({
      assignment_id: z.string().transform(Number),
      student_id: z.string().transform(Number),
    });

    const parsed = schema.safeParse(req.query);
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.flatten() });
    }

    const { assignment_id, student_id } = parsed.data;

    try {
      const result = await query(`
        SELECT dbo.fn_CanSubmitAssignment(@p1, @p2) as can_submit
      `, [assignment_id, student_id]);

      return {
        success: true,
        data: Boolean(result.rows[0]?.can_submit),
      };
    } catch (error: any) {
      console.error('Can submit assignment error:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });

  // GET /statistics/overall-grade - Calculate overall grade for enrollment
  app.get('/statistics/overall-grade', {
    preValidation: [authenticateToken]
  }, async (req: any, reply) => {
    const schema = z.object({
      enrollment_id: z.string().transform(Number),
    });

    const parsed = schema.safeParse(req.query);
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.flatten() });
    }

    const { enrollment_id } = parsed.data;

    try {
      const result = await query(`
        SELECT dbo.fn_CalculateOverallGrade(@p1) as overall_grade
      `, [enrollment_id]);

      return {
        success: true,
        data: result.rows[0]?.overall_grade || 0,
      };
    } catch (error: any) {
      console.error('Calculate overall grade error:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });
}
