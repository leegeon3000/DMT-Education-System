import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { getPool } from '../utils/database.js';
import sql from 'mssql';

interface PaymentQueryParams {
  status?: string;
  payment_method?: string;
  student_id?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
}

interface PaymentIdParam {
  id: string;
}

export default async function paymentsRoutes(fastify: FastifyInstance) {
  // GET /api/payments - List all payments with filters
  fastify.get<{ Querystring: PaymentQueryParams }>(
    '/payments',
    async (request: FastifyRequest<{ Querystring: PaymentQueryParams }>, reply: FastifyReply) => {
      try {
        const pool = await getPool();
        
        const { 
          status, 
          payment_method, 
          student_id,
          date_from,
          date_to,
          limit = 100,
          offset = 0 
        } = request.query;

        let query = `
          SELECT 
            p.ID,
            p.PAYMENT_CODE,
            p.ENROLLMENT_ID,
            p.AMOUNT,
            p.PAYMENT_DATE,
            p.PAYMENT_METHOD,
            p.STATUS,
            p.RECEIPT_NUMBER,
            p.DESCRIPTION,
            p.PAYMENT_DETAILS,
            p.CREATED_BY,
            p.CREATED_AT,
            p.UPDATED_AT,
            s.ID as STUDENT_ID,
            s.STUDENT_CODE,
            u.FULL_NAME as STUDENT_NAME,
            u.EMAIL as STUDENT_EMAIL,
            c.CODE as CLASS_CODE,
            c.NAME as CLASS_NAME,
            e.ENROLLMENT_DATE
          FROM PAYMENTS p
          INNER JOIN ENROLLMENTS e ON p.ENROLLMENT_ID = e.ID
          INNER JOIN STUDENTS s ON e.STUDENT_ID = s.ID
          INNER JOIN USERS u ON s.USER_ID = u.ID
          INNER JOIN CLASSES c ON e.CLASS_ID = c.ID
          WHERE 1=1
        `;

        const params: any[] = [];

        if (status) {
          query += ` AND p.STATUS = @status`;
          params.push({ name: 'status', type: sql.VarChar, value: status });
        }

        if (payment_method) {
          query += ` AND p.PAYMENT_METHOD = @payment_method`;
          params.push({ name: 'payment_method', type: sql.VarChar, value: payment_method });
        }

        if (student_id) {
          query += ` AND s.ID = @student_id`;
          params.push({ name: 'student_id', type: sql.Int, value: parseInt(student_id) });
        }

        if (date_from) {
          query += ` AND p.PAYMENT_DATE >= @date_from`;
          params.push({ name: 'date_from', type: sql.Date, value: date_from });
        }

        if (date_to) {
          query += ` AND p.PAYMENT_DATE <= @date_to`;
          params.push({ name: 'date_to', type: sql.Date, value: date_to });
        }

        query += ` ORDER BY p.PAYMENT_DATE DESC, p.CREATED_AT DESC`;
        query += ` OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY`;
        
        params.push({ name: 'offset', type: sql.Int, value: offset });
        params.push({ name: 'limit', type: sql.Int, value: limit });

        const sqlRequest = pool.request();
        params.forEach(param => {
          sqlRequest.input(param.name, param.type, param.value);
        });

        const result = await sqlRequest.query(query);

        // Get total count
        let countQuery = `
          SELECT COUNT(*) as total
          FROM PAYMENTS p
          INNER JOIN ENROLLMENTS e ON p.ENROLLMENT_ID = e.ID
          INNER JOIN STUDENTS s ON e.STUDENT_ID = s.ID
          WHERE 1=1
        `;

        const countParams: any[] = [];
        if (status) {
          countQuery += ` AND p.STATUS = @status`;
          countParams.push({ name: 'status', type: sql.VarChar, value: status });
        }
        if (payment_method) {
          countQuery += ` AND p.PAYMENT_METHOD = @payment_method`;
          countParams.push({ name: 'payment_method', type: sql.VarChar, value: payment_method });
        }
        if (student_id) {
          countQuery += ` AND s.ID = @student_id`;
          countParams.push({ name: 'student_id', type: sql.Int, value: parseInt(student_id) });
        }
        if (date_from) {
          countQuery += ` AND p.PAYMENT_DATE >= @date_from`;
          countParams.push({ name: 'date_from', type: sql.Date, value: date_from });
        }
        if (date_to) {
          countQuery += ` AND p.PAYMENT_DATE <= @date_to`;
          countParams.push({ name: 'date_to', type: sql.Date, value: date_to });
        }

        const countRequest = pool.request();
        countParams.forEach(param => {
          countRequest.input(param.name, param.type, param.value);
        });

        const countResult = await countRequest.query(countQuery);
        const total = countResult.recordset[0].total;

        reply.send({
          success: true,
          data: result.recordset,
          pagination: {
            total,
            limit,
            offset,
            hasMore: offset + limit < total
          }
        });
      } catch (error: any) {
        fastify.log.error(error);
        reply.status(500).send({
          success: false,
          message: 'Failed to fetch payments',
          error: error.message
        });
      }
    }
  );

  // GET /api/payments/:id - Get payment by ID
  fastify.get<{ Params: PaymentIdParam }>(
    '/payments/:id',
    async (request: FastifyRequest<{ Params: PaymentIdParam }>, reply: FastifyReply) => {
      try {
        const pool = await getPool();
        const { id } = request.params;

        const result = await pool.request()
          .input('id', sql.Int, parseInt(id))
          .query(`
            SELECT 
              p.ID,
              p.PAYMENT_CODE,
              p.ENROLLMENT_ID,
              p.AMOUNT,
              p.PAYMENT_DATE,
              p.PAYMENT_METHOD,
              p.STATUS,
              p.RECEIPT_NUMBER,
              p.DESCRIPTION,
              p.PAYMENT_DETAILS,
              p.CREATED_BY,
              p.CREATED_AT,
              p.UPDATED_AT,
              s.ID as STUDENT_ID,
              s.STUDENT_CODE,
              u.FULL_NAME as STUDENT_NAME,
              u.EMAIL as STUDENT_EMAIL,
              u.PHONE as STUDENT_PHONE,
              c.CODE as CLASS_CODE,
              c.NAME as CLASS_NAME,
              e.ENROLLMENT_DATE
            FROM PAYMENTS p
            INNER JOIN ENROLLMENTS e ON p.ENROLLMENT_ID = e.ID
            INNER JOIN STUDENTS s ON e.STUDENT_ID = s.ID
            INNER JOIN USERS u ON s.USER_ID = u.ID
            INNER JOIN CLASSES c ON e.CLASS_ID = c.ID
            WHERE p.ID = @id
          `);

        if (result.recordset.length === 0) {
          return reply.status(404).send({
            success: false,
            message: 'Payment not found'
          });
        }

        reply.send({
          success: true,
          data: result.recordset[0]
        });
      } catch (error: any) {
        fastify.log.error(error);
        reply.status(500).send({
          success: false,
          message: 'Failed to fetch payment',
          error: error.message
        });
      }
    }
  );

  // GET /api/payments/stats/summary - Get payment statistics
  fastify.get('/payments/stats/summary', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const pool = await getPool();

      const result = await pool.request().query(`
        SELECT 
          COUNT(*) as total_payments,
          SUM(CASE WHEN STATUS = 'COMPLETED' THEN 1 ELSE 0 END) as completed_count,
          SUM(CASE WHEN STATUS = 'PENDING' THEN 1 ELSE 0 END) as pending_count,
          SUM(CASE WHEN STATUS = 'FAILED' THEN 1 ELSE 0 END) as failed_count,
          SUM(CASE WHEN STATUS = 'REFUNDED' THEN 1 ELSE 0 END) as refunded_count,
          SUM(CASE WHEN STATUS = 'COMPLETED' THEN AMOUNT ELSE 0 END) as total_revenue,
          SUM(CASE WHEN STATUS = 'PENDING' THEN AMOUNT ELSE 0 END) as pending_amount,
          SUM(CASE WHEN STATUS = 'REFUNDED' THEN AMOUNT ELSE 0 END) as refunded_amount,
          AVG(CASE WHEN STATUS = 'COMPLETED' THEN AMOUNT ELSE NULL END) as avg_payment
        FROM PAYMENTS
      `);

      reply.send({
        success: true,
        data: result.recordset[0]
      });
    } catch (error: any) {
      fastify.log.error(error);
      reply.status(500).send({
        success: false,
        message: 'Failed to fetch payment statistics',
        error: error.message
      });
    }
  });
}
