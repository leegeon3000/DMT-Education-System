import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { executeProcedure, sql, query } from '../utils/database';
import { authenticateToken, requireRole, ROLES } from '../middleware/auth';

const ProcessPaymentSchema = z.object({
  enrollment_id: z.number().int().positive(),
  amount: z.number().positive(),
  payment_method: z.enum(['CASH', 'BANK_TRANSFER', 'CREDIT_CARD', 'E_WALLET']),
  transaction_id: z.string().optional(),
  processed_by: z.number().int().positive(),
  notes: z.string().optional(),
});

const RefundPaymentSchema = z.object({
  payment_id: z.number().int().positive(),
  refund_amount: z.number().positive(),
  reason: z.string(),
  processed_by: z.number().int().positive(),
});

export async function paymentsRoutes(app: FastifyInstance) {
  // POST /payments - Process a payment
  app.post('/payments', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN, ROLES.STAFF])]
  }, async (req: any, reply) => {
    const schema = ProcessPaymentSchema;
    const parsed = schema.safeParse(req.body);
    
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.flatten() });
    }

    const data = parsed.data;

    try {
      const result = await executeProcedure('sp_ProcessPayment', {
        input: {
          enrollment_id: data.enrollment_id,
          amount: data.amount,
          payment_method: data.payment_method,
          transaction_id: data.transaction_id || null,
          processed_by: data.processed_by,
          notes: data.notes || null,
        },
        output: {
          payment_id: sql.Int,
          new_paid_amount: sql.Decimal(15, 2),
          new_payment_status: sql.VarChar(50),
          error_message: sql.NVarChar(500),
        },
      });

      if (result.returnValue === 0) {
        return reply.code(201).send({
          success: true,
          message: 'Payment processed successfully',
          data: {
            payment_id: result.output.payment_id,
            new_paid_amount: result.output.new_paid_amount,
            new_payment_status: result.output.new_payment_status,
          },
        });
      } else {
        return reply.code(400).send({
          success: false,
          error: result.output.error_message || 'Payment processing failed',
        });
      }
    } catch (error: any) {
      console.error('Process payment error:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });

  // POST /payments/refund - Refund a payment
  app.post('/payments/refund', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN])]
  }, async (req: any, reply) => {
    const schema = RefundPaymentSchema;
    const parsed = schema.safeParse(req.body);
    
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.flatten() });
    }

    const data = parsed.data;

    try {
      const result = await executeProcedure('sp_RefundPayment', {
        input: {
          payment_id: data.payment_id,
          refund_amount: data.refund_amount,
          reason: data.reason,
          processed_by: data.processed_by,
        },
        output: {
          refund_id: sql.Int,
          new_paid_amount: sql.Decimal(15, 2),
          new_payment_status: sql.VarChar(50),
          error_message: sql.NVarChar(500),
        },
      });

      if (result.returnValue === 0) {
        return reply.send({
          success: true,
          message: 'Payment refunded successfully',
          data: {
            refund_id: result.output.refund_id,
            new_paid_amount: result.output.new_paid_amount,
            new_payment_status: result.output.new_payment_status,
          },
        });
      } else {
        return reply.code(400).send({
          success: false,
          error: result.output.error_message || 'Refund processing failed',
        });
      }
    } catch (error: any) {
      console.error('Refund payment error:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });

  // GET /payments/enrollment/:enrollmentId - Get payment history for an enrollment
  app.get('/payments/enrollment/:enrollmentId', {
    preValidation: [authenticateToken]
  }, async (req: any, reply) => {
    const schema = z.object({
      enrollmentId: z.string().transform(Number),
    });

    const parsed = schema.safeParse(req.params);
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.flatten() });
    }

    const { enrollmentId } = parsed.data;

    try {
      const result = await query(`
        SELECT 
          p.*,
          u.full_name as processed_by_name
        FROM PAYMENTS p
        LEFT JOIN USERS u ON p.processed_by = u.id
        WHERE p.enrollment_id = @p1
        ORDER BY p.payment_date DESC
      `, [enrollmentId]);

      return {
        success: true,
        data: result.rows,
      };
    } catch (error: any) {
      console.error('Get enrollment payments error:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });

  // GET /payments/student/:studentId - Get all payments for a student
  app.get('/payments/student/:studentId', {
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
          p.*,
          e.total_fee,
          e.paid_amount as enrollment_paid_amount,
          e.payment_status as enrollment_payment_status,
          c.name as class_name,
          c.code as class_code,
          co.name as course_name,
          u.full_name as processed_by_name
        FROM PAYMENTS p
        JOIN ENROLLMENTS e ON p.enrollment_id = e.id
        JOIN CLASSES c ON e.class_id = c.id
        JOIN COURSES co ON c.course_id = co.id
        LEFT JOIN USERS u ON p.processed_by = u.id
        WHERE e.student_id = @p1
        ORDER BY p.payment_date DESC
      `, [studentId]);

      return {
        success: true,
        data: result.rows,
      };
    } catch (error: any) {
      console.error('Get student payments error:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });

  // GET /payments - Get all payments with pagination
  app.get('/payments', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN, ROLES.STAFF])]
  }, async (req: any, reply) => {
    const schema = z.object({
      page: z.string().optional().default('1').transform(Number),
      limit: z.string().optional().default('20').transform(Number),
      payment_method: z.enum(['CASH', 'BANK_TRANSFER', 'CREDIT_CARD', 'E_WALLET']).optional(),
      status: z.enum(['COMPLETED', 'PENDING', 'REFUNDED', 'FAILED']).optional(),
      from_date: z.string().optional(),
      to_date: z.string().optional(),
    });

    const parsed = schema.safeParse(req.query);
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.flatten() });
    }

    const { page, limit, payment_method, status, from_date, to_date } = parsed.data;
    const offset = (page - 1) * limit;

    try {
      let whereClause = 'WHERE 1=1';
      const params: any[] = [];
      let paramIndex = 1;

      if (payment_method) {
        whereClause += ` AND p.payment_method = @p${paramIndex}`;
        params.push(payment_method);
        paramIndex++;
      }

      if (status) {
        whereClause += ` AND p.status = @p${paramIndex}`;
        params.push(status);
        paramIndex++;
      }

      if (from_date) {
        whereClause += ` AND p.payment_date >= @p${paramIndex}`;
        params.push(new Date(from_date));
        paramIndex++;
      }

      if (to_date) {
        whereClause += ` AND p.payment_date <= @p${paramIndex}`;
        params.push(new Date(to_date));
        paramIndex++;
      }

      const result = await query(`
        SELECT 
          p.*,
          e.student_id,
          s.student_code,
          u_student.full_name as student_name,
          c.name as class_name,
          c.code as class_code,
          u_processor.full_name as processed_by_name
        FROM PAYMENTS p
        JOIN ENROLLMENTS e ON p.enrollment_id = e.id
        JOIN STUDENTS s ON e.student_id = s.id
        JOIN USERS u_student ON s.user_id = u_student.id
        JOIN CLASSES c ON e.class_id = c.id
        LEFT JOIN USERS u_processor ON p.processed_by = u_processor.id
        ${whereClause}
        ORDER BY p.payment_date DESC
        OFFSET @p${paramIndex} ROWS
        FETCH NEXT @p${paramIndex + 1} ROWS ONLY
      `, [...params, offset, limit]);

      const countResult = await query(`
        SELECT COUNT(*) as total
        FROM PAYMENTS p
        JOIN ENROLLMENTS e ON p.enrollment_id = e.id
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
      console.error('Get payments error:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });

  // GET /payments/:id - Get payment details
  app.get('/payments/:id', {
    preValidation: [authenticateToken]
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
      const result = await query(`
        SELECT 
          p.*,
          e.student_id,
          e.total_fee,
          e.paid_amount as enrollment_paid_amount,
          e.payment_status as enrollment_payment_status,
          s.student_code,
          u_student.full_name as student_name,
          u_student.email as student_email,
          c.name as class_name,
          c.code as class_code,
          co.name as course_name,
          u_processor.full_name as processed_by_name
        FROM PAYMENTS p
        JOIN ENROLLMENTS e ON p.enrollment_id = e.id
        JOIN STUDENTS s ON e.student_id = s.id
        JOIN USERS u_student ON s.user_id = u_student.id
        JOIN CLASSES c ON e.class_id = c.id
        JOIN COURSES co ON c.course_id = co.id
        LEFT JOIN USERS u_processor ON p.processed_by = u_processor.id
        WHERE p.id = @p1
      `, [id]);

      if (result.rows.length === 0) {
        return reply.code(404).send({
          success: false,
          error: 'Payment not found',
        });
      }

      return {
        success: true,
        data: result.rows[0],
      };
    } catch (error: any) {
      console.error('Get payment details error:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });
}
