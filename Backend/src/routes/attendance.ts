import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { executeProcedure, sql, query } from '../utils/database';
import { authenticateToken, requireRole, ROLES } from '../middleware/auth';

const BulkMarkAttendanceSchema = z.object({
  session_id: z.number().int().positive(),
  marked_by: z.number().int().positive(),
  attendance_data: z.array(z.object({
    enrollment_id: z.number().int().positive(),
    status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']),
    notes: z.string().optional(),
  })),
});

export async function attendanceRoutes(app: FastifyInstance) {
  // POST /attendance/bulk - Bulk mark attendance
  app.post('/attendance/bulk', {
    preValidation: [authenticateToken, requireRole([ROLES.TEACHER, ROLES.ADMIN, ROLES.STAFF])]
  }, async (req: any, reply) => {
    const schema = BulkMarkAttendanceSchema;
    const parsed = schema.safeParse(req.body);
    
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.flatten() });
    }

    const { session_id, marked_by, attendance_data } = parsed.data;

    try {
      // Convert attendance_data to JSON string for stored procedure
      const json_data = JSON.stringify(attendance_data);

      const result = await executeProcedure('sp_BulkMarkAttendance', {
        input: {
          session_id,
          attendance_data: json_data,
          marked_by,
        },
        output: {
          records_processed: sql.Int,
          error_message: sql.NVarChar(500),
        },
      });

      if (result.returnValue === 0) {
        return reply.send({
          success: true,
          message: 'Attendance marked successfully',
          records_processed: result.output.records_processed,
        });
      } else {
        return reply.code(400).send({
          success: false,
          error: result.output.error_message || 'Failed to mark attendance',
        });
      }
    } catch (error: any) {
      console.error('Bulk mark attendance error:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });

  // GET /attendance/session/:sessionId - Get attendance for a session
  app.get('/attendance/session/:sessionId', {
    preValidation: [authenticateToken]
  }, async (req: any, reply) => {
    const schema = z.object({
      sessionId: z.string().transform(Number),
    });

    const parsed = schema.safeParse(req.params);
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.flatten() });
    }

    const { sessionId } = parsed.data;

    try {
      const result = await query(`
        SELECT 
          a.*,
          e.student_id,
          s.student_code,
          u.full_name as student_name,
          u.email as student_email
        FROM ATTENDANCE a
        JOIN ENROLLMENTS e ON a.enrollment_id = e.id
        JOIN STUDENTS s ON e.student_id = s.id
        JOIN USERS u ON s.user_id = u.id
        WHERE a.session_id = @p1
        ORDER BY u.full_name
      `, [sessionId]);

      return {
        success: true,
        data: result.rows,
      };
    } catch (error: any) {
      console.error('Get session attendance error:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });

  // GET /attendance/student/:studentId - Get student attendance history
  app.get('/attendance/student/:studentId', {
    preValidation: [authenticateToken]
  }, async (req: any, reply) => {
    const schema = z.object({
      studentId: z.string().transform(Number),
      classId: z.string().optional().transform(v => v ? Number(v) : undefined),
    });

    const parsed = schema.safeParse({ ...req.params, ...req.query });
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.flatten() });
    }

    const { studentId, classId } = parsed.data;

    try {
      let whereClause = 'WHERE e.student_id = @p1';
      const params: any[] = [studentId];

      if (classId) {
        whereClause += ' AND e.class_id = @p2';
        params.push(classId);
      }

      const result = await query(`
        SELECT 
          a.*,
          cs.session_number,
          cs.title as session_title,
          cs.session_date,
          cs.start_time,
          cs.end_time,
          c.name as class_name,
          c.code as class_code
        FROM ATTENDANCE a
        JOIN ENROLLMENTS e ON a.enrollment_id = e.id
        JOIN CLASS_SESSIONS cs ON a.session_id = cs.id
        JOIN CLASSES c ON cs.class_id = c.id
        ${whereClause}
        ORDER BY cs.session_date DESC, cs.start_time DESC
      `, params);

      return {
        success: true,
        data: result.rows,
      };
    } catch (error: any) {
      console.error('Get student attendance error:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });

  // GET /attendance/statistics/:classId - Get attendance statistics for a class
  app.get('/attendance/statistics/:classId', {
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
          e.student_id,
          s.student_code,
          u.full_name as student_name,
          COUNT(CASE WHEN a.status = 'PRESENT' THEN 1 END) as present_count,
          COUNT(CASE WHEN a.status = 'ABSENT' THEN 1 END) as absent_count,
          COUNT(CASE WHEN a.status = 'LATE' THEN 1 END) as late_count,
          COUNT(CASE WHEN a.status = 'EXCUSED' THEN 1 END) as excused_count,
          COUNT(a.id) as total_sessions,
          CAST(
            CASE 
              WHEN COUNT(a.id) > 0 
              THEN (COUNT(CASE WHEN a.status = 'PRESENT' THEN 1 END) * 100.0 / COUNT(a.id))
              ELSE 0
            END AS DECIMAL(5,2)
          ) as attendance_rate
        FROM ENROLLMENTS e
        JOIN STUDENTS s ON e.student_id = s.id
        JOIN USERS u ON s.user_id = u.id
        LEFT JOIN ATTENDANCE a ON a.enrollment_id = e.id
        WHERE e.class_id = @p1
        GROUP BY e.student_id, s.student_code, u.full_name
        ORDER BY u.full_name
      `, [classId]);

      return {
        success: true,
        data: result.rows,
      };
    } catch (error: any) {
      console.error('Get attendance statistics error:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });

  // GET /attendance/class/:classId - Get all attendance records for a class
  app.get('/attendance/class/:classId', {
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
          cs.id as session_id,
          cs.session_number,
          cs.title as session_title,
          cs.session_date,
          cs.start_time,
          cs.end_time,
          COUNT(a.id) as total_marked,
          COUNT(CASE WHEN a.status = 'PRESENT' THEN 1 END) as present_count,
          COUNT(CASE WHEN a.status = 'ABSENT' THEN 1 END) as absent_count,
          COUNT(CASE WHEN a.status = 'LATE' THEN 1 END) as late_count
        FROM CLASS_SESSIONS cs
        LEFT JOIN ATTENDANCE a ON a.session_id = cs.id
        WHERE cs.class_id = @p1
        GROUP BY cs.id, cs.session_number, cs.title, cs.session_date, cs.start_time, cs.end_time
        ORDER BY cs.session_date DESC, cs.start_time DESC
      `, [classId]);

      return {
        success: true,
        data: result.rows,
      };
    } catch (error: any) {
      console.error('Get class attendance error:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });
}
