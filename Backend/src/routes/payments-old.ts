import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { supabase } from '../server';
import { ResponseHelper } from '../utils/response';
import { authenticateToken, requireRole, ROLES } from '../middleware/auth';
import { validateBody, validateParams, validateQuery, PaginationSchema, IdParamSchema } from '../middleware/validation';

const CreatePaymentSchema = z.object({
  enrollment_id: z.number().int().positive(),
  amount: z.number().positive(),
  payment_method: z.enum(['cash', 'bank_transfer', 'online']).default('cash'),
  payment_date: z.string().optional(),
  receipt_number: z.string().max(100).optional(),
  notes: z.string().optional(),
  processed_by: z.number().int().positive(),
});

const UpdatePaymentSchema = z.object({
  amount: z.number().positive().optional(),
  payment_method: z.enum(['cash', 'bank_transfer', 'online']).optional(),
  payment_date: z.string().optional(),
  receipt_number: z.string().max(100).optional(),
  notes: z.string().optional(),
});

const PaymentQuerySchema = PaginationSchema.extend({
  enrollment_id: z.coerce.number().int().positive().optional(),
  payment_method: z.enum(['cash', 'bank_transfer', 'online']).optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

export async function paymentsRoutes(app: FastifyInstance) {
  // GET /payments - List payments with filters
  app.get('/payments', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN, ROLES.STAFF])],
    preHandler: [validateQuery(PaymentQuerySchema)]
  }, async (req: any, reply: any) => {
    try {
      const { page, limit, search, enrollment_id, payment_method, start_date, end_date } = req.query;
      const offset = (page - 1) * limit;

      let query = supabase
        .from('payments')
        .select(`
          *,
          enrollments!inner(
            id, total_fee, paid_amount,
            classes!inner(
              id, name, code,
              courses(id, name)
            ),
            students!inner(
              id, student_code,
              users!inner(
                id, full_name, email, phone
              )
            )
          )
        `, { count: 'exact' })
        .range(offset, offset + limit - 1)
        .order('payment_date', { ascending: false });

      if (search) {
        query = query.or(`receipt_number.ilike.%${search}%,notes.ilike.%${search}%`);
      }

      if (enrollment_id) {
        query = query.eq('enrollment_id', enrollment_id);
      }

      if (payment_method) {
        query = query.eq('payment_method', payment_method);
      }

      if (start_date) {
        query = query.gte('payment_date', start_date);
      }

      if (end_date) {
        query = query.lte('payment_date', end_date);
      }

      const { data, error, count } = await query;
      if (error) throw error;

      return ResponseHelper.successWithPagination(
        reply,
        data,
        { page, limit, total: count || 0 }
      );
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // GET /payments/:id - Get payment details
  app.get('/payments/:id', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN, ROLES.STAFF])],
    preHandler: [validateParams(IdParamSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { id } = req.params;

      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          enrollments!inner(
            id, total_fee, paid_amount, discount_percent, payment_status,
            classes!inner(
              id, name, code,
              courses(id, name, price)
            ),
            students!inner(
              id, student_code,
              users!inner(
                id, full_name, email, phone, address
              )
            )
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) {
        return ResponseHelper.notFound(reply, 'Payment not found');
      }

      return ResponseHelper.success(reply, data);
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // POST /payments - Create new payment
  app.post('/payments', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN, ROLES.STAFF])],
    preHandler: [validateBody(CreatePaymentSchema)]
  }, async (req: any, reply: any) => {
    try {
      const paymentData = req.body;

      // Get enrollment info
      const { data: enrollment, error: enrollmentError } = await supabase
        .from('enrollments')
        .select('id, total_fee, paid_amount, payment_status')
        .eq('id', paymentData.enrollment_id)
        .single();

      if (enrollmentError || !enrollment) {
        return ResponseHelper.badRequest(reply, 'Enrollment not found');
      }

      // Check if payment amount is valid
      const remainingAmount = enrollment.total_fee - enrollment.paid_amount;
      if (paymentData.amount > remainingAmount) {
        return ResponseHelper.badRequest(reply, `Payment amount exceeds remaining balance (${remainingAmount})`);
      }

      // Create payment
      const { data, error } = await supabase
        .from('payments')
        .insert([paymentData])
        .select()
        .single();

      if (error) throw error;

      // Update enrollment paid_amount and payment_status
      const newPaidAmount = enrollment.paid_amount + paymentData.amount;
      const newPaymentStatus = newPaidAmount >= enrollment.total_fee ? 'paid' : 
                               newPaidAmount > 0 ? 'partial' : 'pending';

      await supabase
        .from('enrollments')
        .update({ 
          paid_amount: newPaidAmount,
          payment_status: newPaymentStatus
        })
        .eq('id', paymentData.enrollment_id);

      return ResponseHelper.created(reply, data);
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // PUT /payments/:id - Update payment
  app.put('/payments/:id', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN, ROLES.STAFF])],
    preHandler: [validateParams(IdParamSchema), validateBody(UpdatePaymentSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Get current payment
      const { data: currentPayment } = await supabase
        .from('payments')
        .select('*, enrollments!inner(id, total_fee, paid_amount)')
        .eq('id', id)
        .single();

      if (!currentPayment) {
        return ResponseHelper.notFound(reply, 'Payment not found');
      }

      // Update payment
      const { data, error } = await supabase
        .from('payments')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // If amount changed, recalculate enrollment paid_amount
      if (updateData.amount && updateData.amount !== currentPayment.amount) {
        const amountDiff = updateData.amount - currentPayment.amount;
        const newPaidAmount = currentPayment.enrollments.paid_amount + amountDiff;
        const newPaymentStatus = newPaidAmount >= currentPayment.enrollments.total_fee ? 'paid' : 
                                 newPaidAmount > 0 ? 'partial' : 'pending';

        await supabase
          .from('enrollments')
          .update({ 
            paid_amount: newPaidAmount,
            payment_status: newPaymentStatus
          })
          .eq('id', currentPayment.enrollment_id);
      }

      return ResponseHelper.success(reply, data);
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // DELETE /payments/:id - Delete payment
  app.delete('/payments/:id', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN])],
    preHandler: [validateParams(IdParamSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { id } = req.params;

      // Get payment info
      const { data: payment } = await supabase
        .from('payments')
        .select('*, enrollments!inner(id, paid_amount, total_fee)')
        .eq('id', id)
        .single();

      if (!payment) {
        return ResponseHelper.notFound(reply, 'Payment not found');
      }

      // Delete payment
      const { error } = await supabase
        .from('payments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update enrollment paid_amount
      const newPaidAmount = payment.enrollments.paid_amount - payment.amount;
      const newPaymentStatus = newPaidAmount >= payment.enrollments.total_fee ? 'paid' : 
                               newPaidAmount > 0 ? 'partial' : 'pending';

      await supabase
        .from('enrollments')
        .update({ 
          paid_amount: Math.max(0, newPaidAmount),
          payment_status: newPaymentStatus
        })
        .eq('id', payment.enrollment_id);

      return ResponseHelper.success(reply, { message: 'Payment deleted successfully' });
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // GET /enrollments/:id/payments - Get payments for an enrollment
  app.get('/enrollments/:id/payments', {
    preValidation: [authenticateToken],
    preHandler: [validateParams(IdParamSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { id } = req.params;

      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('enrollment_id', id)
        .order('payment_date', { ascending: false });

      if (error) throw error;

      return ResponseHelper.success(reply, data);
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // GET /payments/summary - Get payment summary statistics
  app.get('/payments/summary', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN, ROLES.STAFF])],
  }, async (req: any, reply: any) => {
    try {
      const { start_date, end_date } = req.query;

      let query = supabase
        .from('payments')
        .select('amount, payment_method, payment_date');

      if (start_date) {
        query = query.gte('payment_date', start_date);
      }

      if (end_date) {
        query = query.lte('payment_date', end_date);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Calculate summary
      const totalAmount = data?.reduce((sum: number, p: any) => sum + Number(p.amount), 0) || 0;
      const byMethod = data?.reduce((acc: any, p: any) => {
        acc[p.payment_method] = (acc[p.payment_method] || 0) + Number(p.amount);
        return acc;
      }, {}) || {};

      return ResponseHelper.success(reply, {
        totalAmount,
        totalPayments: data?.length || 0,
        byMethod,
        period: { start_date, end_date }
      });
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });
}
