import { FastifyPluginAsync } from 'fastify';
import sql from 'mssql';
import { getPool } from '../utils/database';

const attendanceReportRoutes: FastifyPluginAsync = async (fastify) => {
  
  // GET /api/attendance/reports - Get attendance reports with aggregation
  fastify.get('/attendance/reports', async (request, reply) => {
    try {
      const { date_from, date_to, course_id, teacher_id } = request.query as {
        date_from?: string;
        date_to?: string;
        course_id?: string;
        teacher_id?: string;
      };

      const pool = getPool();
      if (!pool) {
        return reply.status(500).send({ error: 'Database connection not available' });
      }

      const sqlRequest = pool.request();
      let whereConditions: string[] = ['1=1'];

      if (date_from) {
        sqlRequest.input('date_from', sql.Date, new Date(date_from));
        whereConditions.push('cs.SESSION_DATE >= @date_from');
      }

      if (date_to) {
        sqlRequest.input('date_to', sql.Date, new Date(date_to));
        whereConditions.push('cs.SESSION_DATE <= @date_to');
      }

      if (course_id) {
        sqlRequest.input('course_id', sql.Int, parseInt(course_id));
        whereConditions.push('c.COURSE_ID = @course_id');
      }

      if (teacher_id) {
        sqlRequest.input('teacher_id', sql.Int, parseInt(teacher_id));
        whereConditions.push('c.TEACHER_ID = @teacher_id');
      }

      const whereClause = whereConditions.join(' AND ');

      const result = await sqlRequest.query(`
        SELECT 
          cs.ID as SessionId,
          cs.SESSION_DATE as SessionDate,
          c.ID as ClassId,
          c.NAME as ClassName,
          co.ID as CourseId,
          co.NAME as CourseName,
          t.ID as TeacherId,
          tu.FULL_NAME as TeacherName,
          COUNT(DISTINCT e.ID) as TotalStudents,
          COUNT(DISTINCT CASE WHEN a.STATUS = 'PRESENT' OR a.STATUS = 'LATE' THEN a.ID END) as PresentStudents,
          COUNT(DISTINCT CASE WHEN a.STATUS = 'ABSENT' THEN a.ID END) as AbsentStudents,
          COUNT(DISTINCT CASE WHEN a.STATUS = 'LATE' THEN a.ID END) as LateStudents,
          COUNT(DISTINCT CASE WHEN a.STATUS = 'EXCUSED' THEN a.ID END) as ExcusedStudents
        FROM CLASS_SESSIONS cs
        INNER JOIN CLASSES c ON cs.CLASS_ID = c.ID
        INNER JOIN COURSES co ON c.COURSE_ID = co.ID
        INNER JOIN TEACHERS t ON c.TEACHER_ID = t.ID
        INNER JOIN USERS tu ON t.USER_ID = tu.ID
        LEFT JOIN ENROLLMENTS e ON e.CLASS_ID = c.ID AND e.STATUS = 'ACTIVE'
        LEFT JOIN ATTENDANCE a ON a.SESSION_ID = cs.ID AND a.ENROLLMENT_ID = e.ID
        WHERE ${whereClause}
        GROUP BY 
          cs.ID, cs.SESSION_DATE, c.ID, c.NAME,
          co.ID, co.NAME, t.ID, tu.FULL_NAME
        ORDER BY cs.SESSION_DATE DESC, c.NAME
      `);

      const reports = result.recordset.map(row => {
        const totalStudents = parseInt(row.TotalStudents) || 0;
        const presentStudents = parseInt(row.PresentStudents) || 0;
        const attendanceRate = totalStudents > 0 
          ? Math.round((presentStudents / totalStudents) * 100)
          : 0;

        return {
          id: `ATT-${row.SessionId}`,
          date: new Date(row.SessionDate).toISOString().split('T')[0],
          courseId: row.CourseId?.toString(),
          courseName: row.CourseName,
          teacherId: row.TeacherId?.toString(),
          teacherName: row.TeacherName,
          attendanceRate,
          totalStudents,
          presentStudents,
          absentStudents: parseInt(row.AbsentStudents) || 0,
          lateStudents: parseInt(row.LateStudents) || 0,
          excusedStudents: parseInt(row.ExcusedStudents) || 0
        };
      });

      return reply.send(reports);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({
        error: 'Không thể tải dữ liệu điểm danh',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // GET /api/attendance/reports/:sessionId - Get detailed attendance for a session
  fastify.get('/attendance/reports/:sessionId', async (request, reply) => {
    try {
      const { sessionId } = request.params as { sessionId: string };

      const pool = getPool();
      if (!pool) {
        return reply.status(500).send({ error: 'Database connection not available' });
      }

      // Get session info
      const sessionResult = await pool.request()
        .input('session_id', sql.Int, parseInt(sessionId))
        .query(`
          SELECT 
            cs.ID as SessionId,
            cs.SESSION_DATE as SessionDate,
            c.ID as ClassId,
            c.NAME as ClassName,
            co.ID as CourseId,
            co.NAME as CourseName,
            t.ID as TeacherId,
            tu.FULL_NAME as TeacherName
          FROM CLASS_SESSIONS cs
          INNER JOIN CLASSES c ON cs.CLASS_ID = c.ID
          INNER JOIN COURSES co ON c.COURSE_ID = co.ID
          INNER JOIN TEACHERS t ON c.TEACHER_ID = t.ID
          INNER JOIN USERS tu ON t.USER_ID = tu.ID
          WHERE cs.ID = @session_id
        `);

      if (sessionResult.recordset.length === 0) {
        return reply.status(404).send({ error: 'Session not found' });
      }

      const session = sessionResult.recordset[0];

      // Get student attendance
      const studentsResult = await pool.request()
        .input('session_id', sql.Int, parseInt(sessionId))
        .query(`
          SELECT 
            s.ID as StudentId,
            su.FULL_NAME as StudentName,
            COALESCE(a.STATUS, 'ABSENT') as Status,
            a.CHECK_IN_TIME as CheckInTime,
            a.NOTES as Note
          FROM ENROLLMENTS e
          INNER JOIN STUDENTS s ON e.STUDENT_ID = s.ID
          INNER JOIN USERS su ON s.USER_ID = su.ID
          INNER JOIN CLASS_SESSIONS cs ON e.CLASS_ID = cs.CLASS_ID
          LEFT JOIN ATTENDANCE a ON a.SESSION_ID = cs.ID AND a.ENROLLMENT_ID = e.ID
          WHERE cs.ID = @session_id AND e.STATUS = 'ACTIVE'
          ORDER BY su.FULL_NAME
        `);

      const students = studentsResult.recordset.map(row => ({
        studentId: row.StudentId?.toString(),
        studentName: row.StudentName,
        status: row.Status.toLowerCase(),
        arrivalTime: row.CheckInTime ? new Date(row.CheckInTime).toLocaleTimeString('vi-VN') : undefined,
        note: row.Note || ''
      }));

      const totalStudents = students.length;
      const presentStudents = students.filter(s => s.status === 'present' || s.status === 'late').length;
      const attendanceRate = totalStudents > 0
        ? Math.round((presentStudents / totalStudents) * 100)
        : 0;

      return reply.send({
        id: `ATT-${session.SessionId}`,
        date: new Date(session.SessionDate).toISOString().split('T')[0],
        courseId: session.CourseId?.toString(),
        courseName: session.CourseName,
        teacherId: session.TeacherId?.toString(),
        teacherName: session.TeacherName,
        attendanceRate,
        students
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({
        error: 'Không thể tải chi tiết điểm danh',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // GET /api/attendance/summary - Get attendance summary statistics
  fastify.get('/attendance/summary', async (request, reply) => {
    try {
      const { date_from, date_to } = request.query as {
        date_from?: string;
        date_to?: string;
      };

      const pool = getPool();
      if (!pool) {
        return reply.status(500).send({ error: 'Database connection not available' });
      }

      const sqlRequest = pool.request();
      let whereConditions: string[] = ['1=1'];

      if (date_from) {
        sqlRequest.input('date_from', sql.Date, new Date(date_from));
        whereConditions.push('cs.SESSION_DATE >= @date_from');
      }

      if (date_to) {
        sqlRequest.input('date_to', sql.Date, new Date(date_to));
        whereConditions.push('cs.SESSION_DATE <= @date_to');
      }

      const whereClause = whereConditions.join(' AND ');

      const result = await sqlRequest.query(`
        SELECT 
          COUNT(DISTINCT cs.ID) as TotalSessions,
          COUNT(DISTINCT e.ID) as TotalEnrollments,
          COUNT(CASE WHEN a.STATUS = 'PRESENT' OR a.STATUS = 'LATE' THEN 1 END) as TotalPresent,
          COUNT(CASE WHEN a.STATUS = 'ABSENT' THEN 1 END) as TotalAbsent,
          COUNT(CASE WHEN a.STATUS = 'LATE' THEN 1 END) as TotalLate,
          COUNT(CASE WHEN a.STATUS = 'EXCUSED' THEN 1 END) as TotalExcused
        FROM CLASS_SESSIONS cs
        LEFT JOIN ENROLLMENTS e ON e.CLASS_ID = cs.CLASS_ID AND e.STATUS = 'ACTIVE'
        LEFT JOIN ATTENDANCE a ON a.SESSION_ID = cs.ID AND a.ENROLLMENT_ID = e.ID
        WHERE ${whereClause}
      `);

      const stats = result.recordset[0];
      const totalEnrollments = parseInt(stats.TotalEnrollments) || 0;
      const totalPresent = parseInt(stats.TotalPresent) || 0;
      const overallRate = totalEnrollments > 0
        ? Math.round((totalPresent / totalEnrollments) * 100)
        : 0;

      return reply.send({
        totalSessions: parseInt(stats.TotalSessions) || 0,
        totalEnrollments,
        totalPresent,
        totalAbsent: parseInt(stats.TotalAbsent) || 0,
        totalLate: parseInt(stats.TotalLate) || 0,
        totalExcused: parseInt(stats.TotalExcused) || 0,
        overallAttendanceRate: overallRate
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({
        error: 'Không thể tải thống kê điểm danh',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
};

export default attendanceReportRoutes;
