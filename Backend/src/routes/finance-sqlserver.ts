import { FastifyPluginAsync } from 'fastify';
import sql from 'mssql';
import { getPool } from '../utils/database';

const financeSqlServerRoutes: FastifyPluginAsync = async (fastify) => {
  
  // GET /api/finance/monthly-revenue - Get monthly revenue breakdown
  fastify.get('/finance/monthly-revenue', async (request, reply) => {
    try {
      const { year } = request.query as { year?: string };
      const targetYear = year ? parseInt(year) : new Date().getFullYear();

      const pool = getPool();
      if (!pool) {
        return reply.status(500).send({ error: 'Database connection not available' });
      }
      
      // Aggregate payments by month
      // For simplicity: 70% tuition, 10% books, 15% exam fees, 5% other
      const result = await pool.request()
        .input('year', sql.Int, targetYear)
        .query(`
          SELECT 
            MONTH(PAYMENT_DATE) as Month,
            YEAR(PAYMENT_DATE) as Year,
            SUM(AMOUNT) as TotalAmount
          FROM PAYMENTS
          WHERE YEAR(PAYMENT_DATE) = @year
            AND STATUS = 'COMPLETED'
          GROUP BY MONTH(PAYMENT_DATE), YEAR(PAYMENT_DATE)
          ORDER BY Month
        `);

      // Create full 12-month array with Vietnamese month names
      const monthNames = ['Thg 1', 'Thg 2', 'Thg 3', 'Thg 4', 'Thg 5', 'Thg 6', 
                          'Thg 7', 'Thg 8', 'Thg 9', 'Thg 10', 'Thg 11', 'Thg 12'];
      
      const monthlyData = Array.from({ length: 12 }, (_, idx) => {
        const monthData = result.recordset.find(r => r.Month === idx + 1);
        const totalAmount = monthData ? parseFloat(monthData.TotalAmount) : 0;
        
        // Distribute revenue: 70% tuition, 10% books, 15% exams, 5% other
        return {
          month: monthNames[idx],
          year: targetYear,
          tuitionFees: Math.round(totalAmount * 0.70),
          bookSales: Math.round(totalAmount * 0.10),
          examFees: Math.round(totalAmount * 0.15),
          otherIncome: Math.round(totalAmount * 0.05)
        };
      });

      return reply.send(monthlyData);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ 
        error: 'Không thể tải dữ liệu doanh thu',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // GET /api/finance/expenses - Get expenses with filters
  fastify.get('/finance/expenses', async (request, reply) => {
    try {
      const { year, month, category } = request.query as { 
        year?: string; 
        month?: string; 
        category?: string;
      };

      const pool = getPool();
      if (!pool) {
        return reply.status(500).send({ error: 'Database connection not available' });
      }

      const sqlRequest = pool.request();
      
      let whereConditions: string[] = [];
      
      if (year) {
        sqlRequest.input('year', sql.Int, parseInt(year));
        whereConditions.push('YEAR(EXPENSE_DATE) = @year');
      }
      
      if (month) {
        sqlRequest.input('month', sql.Int, parseInt(month));
        whereConditions.push('MONTH(EXPENSE_DATE) = @month');
      }
      
      if (category) {
        sqlRequest.input('category', sql.NVarChar, category);
        whereConditions.push('CATEGORY = @category');
      }

      const whereClause = whereConditions.length > 0 
        ? 'WHERE ' + whereConditions.join(' AND ') 
        : '';

      const result = await sqlRequest.query(`
        SELECT 
          ID,
          EXPENSE_CODE as ExpenseCode,
          EXPENSE_DATE as ExpenseDate,
          CATEGORY as Category,
          AMOUNT as Amount,
          DESCRIPTION as Description,
          PAYMENT_METHOD as PaymentMethod,
          APPROVED_BY as ApprovedBy,
          CREATED_AT as CreatedAt
        FROM EXPENSES
        ${whereClause}
        ORDER BY EXPENSE_DATE DESC
      `);

      const expenses = result.recordset.map(expense => ({
        id: expense.ExpenseCode || `EXP${expense.ID.toString().padStart(4, '0')}`,
        date: new Date(expense.ExpenseDate).toLocaleDateString('vi-VN'),
        category: expense.Category,
        amount: parseFloat(expense.Amount),
        description: expense.Description,
        paymentMethod: expense.PaymentMethod || 'Chuyển khoản'
      }));

      return reply.send(expenses);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ 
        error: 'Không thể tải dữ liệu chi phí',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // GET /api/finance/summary - Get financial summary
  fastify.get('/finance/summary', async (request, reply) => {
    try {
      const { year, month } = request.query as { year?: string; month?: string };
      const targetYear = year ? parseInt(year) : new Date().getFullYear();

      const pool = getPool();
      if (!pool) {
        return reply.status(500).send({ error: 'Database connection not available' });
      }

      const sqlRequest = pool.request();
      
      sqlRequest.input('year', sql.Int, targetYear);
      
      let dateCondition = 'YEAR(PAYMENT_DATE) = @year';
      let expenseDateCondition = 'YEAR(EXPENSE_DATE) = @year';
      
      if (month) {
        const targetMonth = parseInt(month);
        sqlRequest.input('month', sql.Int, targetMonth);
        dateCondition += ' AND MONTH(PAYMENT_DATE) = @month';
        expenseDateCondition += ' AND MONTH(EXPENSE_DATE) = @month';
      }

      // Get revenue from payments
      const revenueResult = await sqlRequest.query(`
        SELECT 
          SUM(CASE WHEN STATUS = 'COMPLETED' THEN AMOUNT ELSE 0 END) as TotalRevenue,
          COUNT(CASE WHEN STATUS = 'PENDING' THEN 1 END) as PendingPayments,
          COUNT(CASE WHEN STATUS = 'COMPLETED' THEN 1 END) as CompletedPayments,
          COUNT(CASE WHEN STATUS = 'REFUNDED' THEN 1 END) as RefundedPayments
        FROM PAYMENTS
        WHERE ${dateCondition}
      `);

      // Get expenses
      const expenseResult = await pool.request()
        .input('year', sql.Int, targetYear)
        .input('month', month ? sql.Int : sql.Int, month ? parseInt(month) : null)
        .query(`
          SELECT 
            COALESCE(SUM(AMOUNT), 0) as TotalExpenses
          FROM EXPENSES
          WHERE ${expenseDateCondition}
        `);

      const totalRevenue = parseFloat(revenueResult.recordset[0]?.TotalRevenue || 0);
      const totalExpenses = parseFloat(expenseResult.recordset[0]?.TotalExpenses || 0);

      return reply.send({
        totalRevenue,
        totalExpenses,
        netProfit: totalRevenue - totalExpenses,
        pendingPayments: revenueResult.recordset[0]?.PendingPayments || 0,
        completedPayments: revenueResult.recordset[0]?.CompletedPayments || 0,
        refundedPayments: revenueResult.recordset[0]?.RefundedPayments || 0
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ 
        error: 'Không thể tải dữ liệu tổng hợp',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // GET /api/finance/payments - Reuse payments from payments-sqlserver
  // (This will be handled by the existing payments route)
};

export default financeSqlServerRoutes;
