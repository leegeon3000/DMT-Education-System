import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

class EmailService {
  private transporter: Transporter | null = null;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const gmailUser = process.env.GMAIL_USER;
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

    if (!gmailUser || !gmailAppPassword) {
      console.warn('⚠️  Email configuration missing. Email service disabled.');
      return;
    }

    try {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: gmailUser,
          pass: gmailAppPassword,
        },
      });

      console.log('✅ Email service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize email service:', error);
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.transporter) {
      console.error('Email transporter not initialized');
      return false;
    }

    try {
      const info = await this.transporter.sendMail({
        from: `"DMT Education" <${process.env.GMAIL_USER}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });

      console.log('✅ Email sent successfully:', info.messageId);
      return true;
    } catch (error) {
      console.error('❌ Error sending email:', error);
      return false;
    }
  }

  async sendContactFormEmail(data: ContactFormData): Promise<boolean> {
    const adminEmail = process.env.ADMIN_EMAIL || process.env.GMAIL_USER;

    if (!adminEmail) {
      console.error('Admin email not configured');
      return false;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #DC2626 0%, #F43F5E 100%);
            color: white;
            padding: 30px;
            border-radius: 10px 10px 0 0;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            background: #f9fafb;
            padding: 30px;
            border: 1px solid #e5e7eb;
            border-top: none;
          }
          .info-row {
            margin-bottom: 20px;
            padding: 15px;
            background: white;
            border-radius: 8px;
            border-left: 4px solid #DC2626;
          }
          .label {
            font-weight: 600;
            color: #DC2626;
            margin-bottom: 5px;
            font-size: 14px;
            text-transform: uppercase;
          }
          .value {
            color: #1f2937;
            font-size: 16px;
          }
          .message-box {
            background: white;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            margin-top: 20px;
          }
          .footer {
            text-align: center;
            padding: 20px;
            color: #6b7280;
            font-size: 14px;
            border-top: 1px solid #e5e7eb;
          }
          .badge {
            display: inline-block;
            background: #DC2626;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 12px;
            margin-top: 10px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎓 DMT Education</h1>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">Yêu cầu tư vấn mới</p>
        </div>
        
        <div class="content">
          <div class="badge">📧 Form liên hệ từ website</div>
          
          <div class="info-row">
            <div class="label">👤 Họ và tên</div>
            <div class="value">${data.name}</div>
          </div>
          
          <div class="info-row">
            <div class="label">📧 Email</div>
            <div class="value">
              <a href="mailto:${data.email}" style="color: #DC2626; text-decoration: none;">
                ${data.email}
              </a>
            </div>
          </div>
          
          <div class="info-row">
            <div class="label">📱 Số điện thoại</div>
            <div class="value">
              <a href="tel:${data.phone}" style="color: #DC2626; text-decoration: none;">
                ${data.phone}
              </a>
            </div>
          </div>
          
          <div class="message-box">
            <div class="label">💬 Nội dung</div>
            <div class="value" style="white-space: pre-wrap; margin-top: 10px;">
              ${data.message}
            </div>
          </div>
        </div>
        
        <div class="footer">
          <p>
            Email này được gửi tự động từ hệ thống DMT Education<br>
            Thời gian: ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}
          </p>
        </div>
      </body>
      </html>
    `;

    const textContent = `
DMT Education - Yêu cầu tư vấn mới

Họ và tên: ${data.name}
Email: ${data.email}
Số điện thoại: ${data.phone}

Nội dung:
${data.message}

---
Thời gian: ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}
    `;

    return this.sendEmail({
      to: adminEmail,
      subject: `🎓 [DMT Education] Yêu cầu tư vấn từ ${data.name}`,
      html: htmlContent,
      text: textContent,
    });
  }

  async sendConfirmationEmail(data: ContactFormData): Promise<boolean> {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #DC2626 0%, #F43F5E 100%);
            color: white;
            padding: 40px 30px;
            border-radius: 10px 10px 0 0;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
          }
          .content {
            background: white;
            padding: 40px 30px;
            border: 1px solid #e5e7eb;
            border-top: none;
          }
          .greeting {
            font-size: 18px;
            color: #1f2937;
            margin-bottom: 20px;
          }
          .highlight-box {
            background: #fef2f2;
            border-left: 4px solid #DC2626;
            padding: 20px;
            margin: 20px 0;
            border-radius: 5px;
          }
          .button {
            display: inline-block;
            background: linear-gradient(135deg, #DC2626 0%, #F43F5E 100%);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 25px;
            margin: 20px 0;
            font-weight: 600;
          }
          .footer {
            text-align: center;
            padding: 30px;
            color: #6b7280;
            font-size: 14px;
            border-top: 1px solid #e5e7eb;
          }
          .contact-info {
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎓 DMT Education</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.95; font-size: 16px;">
            Nâng tầm tri thức
          </p>
        </div>
        
        <div class="content">
          <div class="greeting">
            Xin chào <strong>${data.name}</strong>,
          </div>
          
          <p>
            Cảm ơn bạn đã quan tâm đến <strong>DMT Education</strong>! 
            Chúng tôi đã nhận được thông tin đăng ký tư vấn của bạn.
          </p>
          
          <div class="highlight-box">
            <p style="margin: 0;">
              ⏰ <strong>Thời gian phản hồi:</strong> Trong vòng 24 giờ<br>
              📞 <strong>Hình thức:</strong> Gọi điện hoặc email<br>
              🎯 <strong>Nội dung:</strong> Tư vấn lộ trình học tập phù hợp
            </p>
          </div>
          
          <p>
            Trong thời gian chờ đợi, bạn có thể:
          </p>
          <ul>
            <li>Khám phá các <a href="http://localhost:5173/courses" style="color: #DC2626;">khóa học</a> của chúng tôi</li>
            <li>Tìm hiểu về <a href="http://localhost:5173/teachers" style="color: #DC2626;">đội ngũ giáo viên</a></li>
            <li>Đọc <a href="http://localhost:5173/about" style="color: #DC2626;">câu chuyện</a> của DMT Education</li>
          </ul>
          
          <center>
            <a href="http://localhost:5173" class="button">
              🏠 Về trang chủ
            </a>
          </center>
          
          <div class="contact-info">
            <strong>📞 Liên hệ khẩn cấp:</strong><br>
            Hotline: 0123 456 789<br>
            Email: contact@dmteducation.vn<br>
            Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM
          </div>
        </div>
        
        <div class="footer">
          <p>
            <strong>DMT Education</strong><br>
            Nâng tầm tri thức - Kiến tạo tương lai<br>
            <br>
            © 2024 DMT Education. All rights reserved.
          </p>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: data.email,
      subject: '✅ Đã nhận được yêu cầu tư vấn - DMT Education',
      html: htmlContent,
    });
  }

  async verifyConnection(): Promise<boolean> {
    if (!this.transporter) {
      return false;
    }

    try {
      await this.transporter.verify();
      console.log('✅ Email service connection verified');
      return true;
    } catch (error) {
      console.error('❌ Email service connection failed:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();
