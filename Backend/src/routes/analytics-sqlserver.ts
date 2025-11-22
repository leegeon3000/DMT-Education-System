import { FastifyPluginAsync } from 'fastify';
import sql from 'mssql';
import { getPool } from '../utils/database';

const analyticsRoutes: FastifyPluginAsync = async (fastify) => {
  
  // GET /api/analytics - Get comprehensive analytics data
  fastify.get('/analytics', async (request, reply) => {
    try {
      const { time_range } = request.query as { time_range?: string };
      
      const pool = getPool();
      if (!pool) {
        return reply.status(500).send({ error: 'Database connection not available' });
      }

      // Calculate date range
      const endDate = new Date();
      let startDate = new Date();
      switch (time_range) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '90d':
          startDate.setDate(endDate.getDate() - 90);
          break;
        case '1y':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
        case '30d':
        default:
          startDate.setDate(endDate.getDate() - 30);
      }

      // User Statistics
      const userStatsResult = await pool.request().query(`
        SELECT 
          (SELECT COUNT(*) FROM USERS WHERE STATUS = 1) as TotalUsers,
          (SELECT COUNT(*) FROM USERS WHERE STATUS = 1 AND LAST_LOGIN_AT >= DATEADD(DAY, -7, GETDATE())) as ActiveUsers,
          (SELECT COUNT(*) FROM USERS WHERE CREATED_AT >= DATEADD(DAY, -30, GETDATE())) as NewUsers,
          (SELECT COUNT(*) FROM TEACHERS t INNER JOIN USERS u ON t.USER_ID = u.ID WHERE u.STATUS = 1) as TeacherCount,
          (SELECT COUNT(*) FROM STUDENTS s INNER JOIN USERS u ON s.USER_ID = u.ID WHERE u.STATUS = 1) as StudentCount,
          (SELECT COUNT(*) FROM STAFF st INNER JOIN USERS u ON st.USER_ID = u.ID WHERE u.STATUS = 1) as StaffCount
      `);

      // User growth by month (last 5 months)
      const userGrowthResult = await pool.request().query(`
        SELECT 
          MONTH(CREATED_AT) as Month,
          YEAR(CREATED_AT) as Year,
          COUNT(*) as Count
        FROM USERS
        WHERE CREATED_AT >= DATEADD(MONTH, -5, GETDATE())
        GROUP BY MONTH(CREATED_AT), YEAR(CREATED_AT)
        ORDER BY Year, Month
      `);

      const monthNames = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
      const userGrowth = userGrowthResult.recordset.map(row => ({
        month: monthNames[row.Month - 1],
        count: parseInt(row.Count)
      }));

      // Course Statistics
      const courseStatsResult = await pool.request().query(`
        SELECT 
          (SELECT COUNT(*) FROM COURSES) as TotalCourses,
          (SELECT COUNT(*) FROM COURSES WHERE IS_ACTIVE = 1) as ActiveCourses
      `);

      // Popular courses
      const popularCoursesResult = await pool.request().query(`
        SELECT TOP 5
          c.NAME as CourseName,
          COUNT(DISTINCT e.STUDENT_ID) as StudentCount
        FROM COURSES c
        LEFT JOIN CLASSES cl ON c.ID = cl.COURSE_ID
        LEFT JOIN ENROLLMENTS e ON cl.ID = e.CLASS_ID AND e.STATUS = 'ACTIVE'
        GROUP BY c.ID, c.NAME
        ORDER BY StudentCount DESC
      `);

      const popularCourses = popularCoursesResult.recordset.map(row => ({
        name: row.CourseName,
        students: parseInt(row.StudentCount) || 0
      }));

      // Revenue Statistics
      const revenueStatsResult = await pool.request().query(`
        SELECT 
          SUM(CASE WHEN STATUS = 'COMPLETED' THEN AMOUNT ELSE 0 END) as TotalRevenue,
          SUM(CASE WHEN STATUS = 'COMPLETED' AND PAYMENT_DATE >= DATEADD(MONTH, -1, GETDATE()) THEN AMOUNT ELSE 0 END) as MonthlyRevenue,
          COUNT(CASE WHEN PAYMENT_DATE >= DATEADD(MONTH, -1, GETDATE()) THEN 1 END) as RecentPayments
        FROM PAYMENTS
      `);

      // Payment methods distribution
      const paymentMethodsResult = await pool.request().query(`
        SELECT 
          PAYMENT_METHOD,
          COUNT(*) as Count,
          SUM(AMOUNT) as Total
        FROM PAYMENTS
        WHERE STATUS = 'COMPLETED'
        GROUP BY PAYMENT_METHOD
      `);

      const totalPayments = paymentMethodsResult.recordset.reduce((sum, row) => sum + parseInt(row.Count), 0);
      const paymentMethods = paymentMethodsResult.recordset.map(row => {
        const methodMap: { [key: string]: string } = {
          'CASH': 'Tiền mặt',
          'BANK_TRANSFER': 'Chuyển khoản',
          'CREDIT_CARD': 'Thẻ tín dụng',
          'E_WALLET': 'Ví điện tử'
        };
        return {
          method: methodMap[row.PAYMENT_METHOD] || row.PAYMENT_METHOD,
          percentage: totalPayments > 0 ? Math.round((parseInt(row.Count) / totalPayments) * 100) : 0
        };
      });

      // Revenue by month (last 5 months)
      const revenueByMonthResult = await pool.request().query(`
        SELECT 
          MONTH(PAYMENT_DATE) as Month,
          YEAR(PAYMENT_DATE) as Year,
          SUM(AMOUNT) as Total
        FROM PAYMENTS
        WHERE STATUS = 'COMPLETED' 
          AND PAYMENT_DATE >= DATEADD(MONTH, -5, GETDATE())
        GROUP BY MONTH(PAYMENT_DATE), YEAR(PAYMENT_DATE)
        ORDER BY Year, Month
      `);

      const revenueByMonth = revenueByMonthResult.recordset.map(row => ({
        month: monthNames[row.Month - 1],
        amount: parseFloat(row.Total) || 0
      }));

      // Calculate revenue growth
      const previousMonthRevenue = revenueByMonth.length >= 2 
        ? revenueByMonth[revenueByMonth.length - 2].amount 
        : 0;
      const currentMonthRevenue = revenueByMonth.length >= 1 
        ? revenueByMonth[revenueByMonth.length - 1].amount 
        : 0;
      const revenueGrowth = previousMonthRevenue > 0
        ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100
        : 0;

      // System Statistics (mock values - would need actual monitoring setup)
      const systemStats = {
        uptime: 99.8,
        activeConnections: await pool.request().query(`SELECT COUNT(*) as Count FROM sys.dm_exec_sessions WHERE is_user_process = 1`).then(r => parseInt(r.recordset[0].Count)),
        serverLoad: 65.4,
        errorRate: 0.02,
        responseTime: 234,
        storageUsed: 67.8
      };

      const analyticsData = {
        userStats: {
          totalUsers: parseInt(userStatsResult.recordset[0].TotalUsers) || 0,
          activeUsers: parseInt(userStatsResult.recordset[0].ActiveUsers) || 0,
          newUsers: parseInt(userStatsResult.recordset[0].NewUsers) || 0,
          teacherCount: parseInt(userStatsResult.recordset[0].TeacherCount) || 0,
          studentCount: parseInt(userStatsResult.recordset[0].StudentCount) || 0,
          staffCount: parseInt(userStatsResult.recordset[0].StaffCount) || 0,
          userGrowth
        },
        courseStats: {
          totalCourses: parseInt(courseStatsResult.recordset[0].TotalCourses) || 0,
          activeCourses: parseInt(courseStatsResult.recordset[0].ActiveCourses) || 0,
          completionRate: 78.5, // Would need completion tracking
          popularCourses,
          completionTrend: [ // Mock data for now
            { month: 'T1', rate: 72.3 },
            { month: 'T2', rate: 75.1 },
            { month: 'T3', rate: 76.8 },
            { month: 'T4', rate: 77.9 },
            { month: 'T5', rate: 78.5 }
          ]
        },
        revenueStats: {
          totalRevenue: parseFloat(revenueStatsResult.recordset[0].TotalRevenue) || 0,
          monthlyRevenue: parseFloat(revenueStatsResult.recordset[0].MonthlyRevenue) || 0,
          revenueGrowth: parseFloat(revenueGrowth.toFixed(1)),
          paymentMethods,
          revenueByMonth
        },
        systemStats
      };

      return reply.send(analyticsData);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({
        error: 'Không thể tải dữ liệu thống kê',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // GET /api/analytics/summary - Quick summary stats
  fastify.get('/analytics/summary', async (request, reply) => {
    try {
      const pool = getPool();
      if (!pool) {
        return reply.status(500).send({ error: 'Database connection not available' });
      }

      const result = await pool.request().query(`
        SELECT 
          (SELECT COUNT(*) FROM USERS WHERE STATUS = 1) as TotalUsers,
          (SELECT COUNT(*) FROM COURSES WHERE IS_ACTIVE = 1) as ActiveCourses,
          (SELECT COUNT(*) FROM CLASSES WHERE STATUS = 'ACTIVE') as ActiveClasses,
          (SELECT SUM(AMOUNT) FROM PAYMENTS WHERE STATUS = 'COMPLETED' AND PAYMENT_DATE >= DATEADD(MONTH, -1, GETDATE())) as MonthlyRevenue
      `);

      return reply.send({
        totalUsers: parseInt(result.recordset[0].TotalUsers) || 0,
        activeCourses: parseInt(result.recordset[0].ActiveCourses) || 0,
        activeClasses: parseInt(result.recordset[0].ActiveClasses) || 0,
        monthlyRevenue: parseFloat(result.recordset[0].MonthlyRevenue) || 0
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({
        error: 'Không thể tải tổng hợp thống kê',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
};

export default analyticsRoutes;
