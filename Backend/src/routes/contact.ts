import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { emailService } from '../services/emailService.js';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().regex(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ (10-11 chữ số)'),
  message: z.string().min(10, 'Nội dung phải có ít nhất 10 ký tự'),
});

export default async function contactRoutes(fastify: FastifyInstance) {
  // POST /api/contact - Gửi form liên hệ
  fastify.post('/contact', async (request, reply) => {
    try {
      const data = contactFormSchema.parse(request.body);

      // Gửi email đến admin
      const adminEmailSent = await emailService.sendContactFormEmail(data);

      if (!adminEmailSent) {
        return reply.status(500).send({
          success: false,
          message: 'Không thể gửi email. Vui lòng thử lại sau.',
        });
      }

      // Gửi email xác nhận cho người dùng
      await emailService.sendConfirmationEmail(data);

      return reply.status(200).send({
        success: true,
        message: 'Đã gửi thông tin thành công. Chúng tôi sẽ liên hệ với bạn trong 24h.',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          message: 'Dữ liệu không hợp lệ',
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      }

      console.error('Contact form error:', error);
      return reply.status(500).send({
        success: false,
        message: 'Có lỗi xảy ra. Vui lòng thử lại sau.',
      });
    }
  });

  // GET /api/contact/verify - Kiểm tra email service
  fastify.get('/contact/verify', async (request, reply) => {
    const isVerified = await emailService.verifyConnection();

    return reply.status(200).send({
      success: isVerified,
      message: isVerified
        ? 'Email service hoạt động bình thường'
        : 'Email service chưa được cấu hình hoặc có lỗi',
    });
  });
}
