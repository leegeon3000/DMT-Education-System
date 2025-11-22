import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { getPool } from '../utils/database.js';

interface PerformanceQueryParams {
  month?: string;
  year?: string;
  course_id?: string;
  teacher_id?: string;
}

interface PerformanceDetailParams {
  recordId: string;
}

export default async function performanceRoutes(app: FastifyInstance) {
  const pool = await getPool();

  // GET /api/performance/reports - List performance reports with filters
  app.get<{ Querystring: PerformanceQueryParams }>(
    '/performance/reports',
    async (request: FastifyRequest<{ Querystring: PerformanceQueryParams }>, reply: FastifyReply) => {
      try {
        const { month, year, course_id, teacher_id } = request.query;

        let query = `
          SELECT 
            CONCAT('PERF-', c.ID) as id,
            c.ID as courseId,
            co.NAME as courseName,
            t.ID as teacherId,
            tu.FULL_NAME as teacherName,
            MONTH(COALESCE(cs.SESSION_DATE, c.START_DATE, GETDATE())) as month,
            YEAR(COALESCE(cs.SESSION_DATE, c.START_DATE, GETDATE())) as year,
            
            -- Average score from submissions
            ISNULL((
              SELECT AVG(CAST(sub2.SCORE as FLOAT))
              FROM SUBMISSIONS sub2
              INNER JOIN ASSIGNMENTS a2 ON sub2.ASSIGNMENT_ID = a2.ID
              WHERE a2.CLASS_ID = c.ID AND sub2.SCORE IS NOT NULL
            ), 0) as averageScore,
            
            -- Pass rate (students with average >= 50)
            ISNULL((
              SELECT COUNT(DISTINCT sub3.STUDENT_ID) * 100.0 / NULLIF(COUNT(DISTINCT e3.STUDENT_ID), 0)
              FROM ENROLLMENTS e3
              LEFT JOIN SUBMISSIONS sub3 ON sub3.STUDENT_ID = e3.STUDENT_ID
              LEFT JOIN ASSIGNMENTS a3 ON sub3.ASSIGNMENT_ID = a3.ID
              WHERE e3.CLASS_ID = c.ID AND a3.CLASS_ID = c.ID
              GROUP BY e3.STUDENT_ID
              HAVING AVG(CAST(sub3.SCORE as FLOAT)) >= 50
            ), 0) as passRate,
            
            -- Attendance rate
            ISNULL((
              SELECT AVG(CASE WHEN att.STATUS = 'PRESENT' THEN 100.0 ELSE 0.0 END)
              FROM CLASS_SESSIONS cs2
              LEFT JOIN ATTENDANCE att ON att.SESSION_ID = cs2.ID
              WHERE cs2.CLASS_ID = c.ID
            ), 0) as attendanceRate,
            
            COUNT(DISTINCT e.STUDENT_ID) as totalStudents,
            
            0 as highPerformers,
            0 as lowPerformers,
            
            -- Improvement rate (mock for now - would need historical data)
            CAST((RAND() * 25) as INT) as improvementRate,
            
            NULL as notes
            
          FROM CLASSES c
          INNER JOIN COURSES co ON c.COURSE_ID = co.ID
          INNER JOIN TEACHERS t ON c.TEACHER_ID = t.ID
          INNER JOIN USERS tu ON t.USER_ID = tu.ID
          LEFT JOIN ENROLLMENTS e ON e.CLASS_ID = c.ID
          LEFT JOIN CLASS_SESSIONS cs ON cs.CLASS_ID = c.ID
          WHERE 1=1
        `;

        const params: any = {};
        let paramIndex = 1;

        if (month) {
          query += ` AND MONTH(cs.SESSION_DATE) = @month`;
          params.month = parseInt(month);
        }

        if (year) {
          query += ` AND YEAR(cs.SESSION_DATE) = @year`;
          params.year = parseInt(year);
        }

        if (course_id) {
          query += ` AND co.ID = @course_id`;
          params.course_id = parseInt(course_id);
        }

        if (teacher_id) {
          query += ` AND t.ID = @teacher_id`;
          params.teacher_id = parseInt(teacher_id);
        }

        query += `
          GROUP BY c.ID, co.NAME, t.ID, tu.FULL_NAME,
                   MONTH(COALESCE(cs.SESSION_DATE, c.START_DATE, GETDATE())), 
                   YEAR(COALESCE(cs.SESSION_DATE, c.START_DATE, GETDATE()))
          ORDER BY year DESC, month DESC, co.NAME
        `;

        const sqlRequest = pool.request();
        Object.entries(params).forEach(([key, value]) => {
          sqlRequest.input(key, value);
        });

        const result = await sqlRequest.query(query);

        const reports = result.recordset.map(row => ({
          id: row.id,
          courseId: row.courseId.toString(),
          courseName: row.courseName,
          teacherId: row.teacherId.toString(),
          teacherName: row.teacherName,
          month: row.month ? row.month.toString() : '1',
          year: row.year || new Date().getFullYear(),
          averageScore: parseFloat(row.averageScore.toFixed(1)),
          passRate: parseFloat(row.passRate.toFixed(0)),
          attendanceRate: parseFloat(row.attendanceRate.toFixed(0)),
          totalStudents: row.totalStudents,
          highPerformers: row.highPerformers,
          lowPerformers: row.lowPerformers,
          improvementRate: row.improvementRate,
          notes: row.notes || ''
        }));

        reply.send(reports);
      } catch (error: any) {
        console.error('Error fetching performance reports:', error);
        reply.status(500).send({
          error: 'Không thể tải dữ liệu báo cáo hiệu suất',
          message: error.message
        });
      }
    }
  );

  // GET /api/performance/reports/:recordId - Get detailed student performance for a course
  app.get<{ Params: PerformanceDetailParams }>(
    '/performance/reports/:recordId',
    async (request: FastifyRequest<{ Params: PerformanceDetailParams }>, reply: FastifyReply) => {
      try {
        const { recordId } = request.params;
        
        // Extract course ID from recordId (format: PERF-{courseId})
        const courseId = recordId.replace('PERF-', '');

        // Get course info
        const courseInfoQuery = `
          SELECT 
            c.ID as courseId,
            co.NAME as courseName,
            MONTH(cs.SESSION_DATE) as month,
            YEAR(cs.SESSION_DATE) as year,
            COALESCE(AVG(CAST(sub.SCORE as FLOAT)), 0) as averageScore
          FROM CLASSES c
          INNER JOIN COURSES co ON c.COURSE_ID = co.ID
          LEFT JOIN CLASS_SESSIONS cs ON cs.CLASS_ID = c.ID
          LEFT JOIN ENROLLMENTS e ON e.CLASS_ID = c.ID
          LEFT JOIN ASSIGNMENTS a ON a.CLASS_ID = c.ID
          LEFT JOIN SUBMISSIONS sub ON sub.ASSIGNMENT_ID = a.ID AND sub.STUDENT_ID = e.STUDENT_ID
          WHERE c.ID = @courseId
          GROUP BY c.ID, co.NAME, MONTH(cs.SESSION_DATE), YEAR(cs.SESSION_DATE)
        `;

        const courseResult = await pool.request()
          .input('courseId', parseInt(courseId))
          .query(courseInfoQuery);

        if (courseResult.recordset.length === 0) {
          return reply.status(404).send({ error: 'Course not found' });
        }

        const courseInfo = courseResult.recordset[0];

        // Get student performance details
        const studentsQuery = `
          SELECT 
            s.ID as studentId,
            su.FULL_NAME as studentName,
            
            -- Current average score
            COALESCE(AVG(CAST(sub.SCORE as FLOAT)), 0) as currentScore,
            
            -- Previous score (mock - would need historical data)
            COALESCE(AVG(CAST(sub.SCORE as FLOAT)) - (RAND() * 10), 0) as previousScore,
            
            -- Attendance percentage
            COALESCE(
              (SELECT COUNT(*) * 100.0 / NULLIF(COUNT(DISTINCT cs.ID), 0)
               FROM CLASS_SESSIONS cs
               LEFT JOIN ATTENDANCE att ON att.SESSION_ID = cs.ID AND att.STUDENT_ID = s.ID AND att.STATUS = 'PRESENT'
               WHERE cs.CLASS_ID = e.CLASS_ID
              ), 0
            ) as attendance,
            
            -- Number of submissions completed
            COUNT(DISTINCT sub.ID) as assignments
            
          FROM ENROLLMENTS e
          INNER JOIN STUDENTS s ON e.STUDENT_ID = s.ID
          INNER JOIN USERS su ON s.USER_ID = su.ID
          LEFT JOIN ASSIGNMENTS a ON a.CLASS_ID = e.CLASS_ID
          LEFT JOIN SUBMISSIONS sub ON sub.ASSIGNMENT_ID = a.ID AND sub.STUDENT_ID = s.ID
          WHERE e.CLASS_ID = @courseId
          GROUP BY s.ID, su.FULL_NAME, e.CLASS_ID
          ORDER BY currentScore DESC
        `;

        const studentsResult = await pool.request()
          .input('courseId', parseInt(courseId))
          .query(studentsQuery);

        const students = studentsResult.recordset.map(row => ({
          studentId: row.studentId.toString(),
          studentName: row.studentName,
          currentScore: parseFloat(row.currentScore.toFixed(1)),
          previousScore: parseFloat(row.previousScore.toFixed(1)),
          attendance: parseFloat(row.attendance.toFixed(1)),
          assignments: row.assignments,
          improvement: ((row.currentScore - row.previousScore) / (row.previousScore || 1)) * 100
        }));

        const performanceDetail = {
          id: recordId,
          courseId: courseInfo.courseId.toString(),
          courseName: courseInfo.courseName,
          month: courseInfo.month ? courseInfo.month.toString() : '1',
          year: courseInfo.year || new Date().getFullYear(),
          averageScore: parseFloat(courseInfo.averageScore.toFixed(1)),
          students
        };

        reply.send(performanceDetail);
      } catch (error: any) {
        console.error('Error fetching performance details:', error);
        reply.status(500).send({
          error: 'Không thể tải chi tiết hiệu suất',
          message: error.message
        });
      }
    }
  );

  // GET /api/performance/summary - Get performance summary statistics
  app.get('/performance/summary', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const summaryQuery = `
        SELECT 
          -- Average score across all submissions
          ISNULL(AVG(CAST(sub.SCORE as FLOAT)), 0) as averageScore,
          
          -- Total number of classes
          (SELECT COUNT(*) FROM CLASSES) as totalCourses,
          
          -- High performing (mock for now)
          0 as highPerforming,
          
          -- Low performing (mock for now)
          0 as lowPerforming
          
        FROM SUBMISSIONS sub
      `;

      const result = await pool.request().query(summaryQuery);
      const row = result.recordset[0];

      const summary = {
        averageScore: parseFloat((row.averageScore || 0).toFixed(1)),
        totalCourses: row.totalCourses || 0,
        highPerforming: row.highPerforming || 0,
        lowPerforming: row.lowPerforming || 0,
        overallImprovement: parseFloat((Math.random() * 20).toFixed(1)) // Mock - would need historical data
      };

      reply.send(summary);
    } catch (error: any) {
      console.error('Error fetching performance summary:', error);
      reply.status(500).send({
        error: 'Không thể tải tóm tắt hiệu suất',
        message: error.message
      });
    }
  });
}
