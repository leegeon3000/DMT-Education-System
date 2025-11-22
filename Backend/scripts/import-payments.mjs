#!/usr/bin/env node

/**
 * Import Payments from Mock Data to SQL Server
 */

import sql from 'mssql';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const config = {
  server: process.env.DB_SERVER || 'localhost',
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'Password123!',
  database: process.env.DB_NAME || 'DMT_EDUCATION_SYSTEM',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
  }
};

const paymentsData = [
  { code: 'PMT-23001', amount: 4500000, date: '2023-08-15', method: 'BANK_TRANSFER', status: 'COMPLETED', receipt: 'R-2308-001', desc: 'Thanh toán học phí kỳ 1 khóa Tiếng Anh nâng cao', createdBy: 'admin' },
  { code: 'PMT-23002', amount: 7800000, date: '2023-08-17', method: 'CASH', status: 'COMPLETED', receipt: 'R-2308-002', desc: 'Thanh toán học phí đầy đủ khóa Luyện thi IELTS', createdBy: 'admin' },
  { code: 'PMT-23003', amount: 3200000, date: '2023-08-20', method: 'E_WALLET', status: 'COMPLETED', receipt: 'R-2308-003', desc: 'Thanh toán học phí khóa Tiếng Anh giao tiếp qua MoMo', createdBy: 'staff-001' },
  { code: 'PMT-23004', amount: 2500000, date: '2023-09-05', method: 'BANK_TRANSFER', status: 'PENDING', receipt: null, desc: 'Đặt cọc học phí khóa Tiếng Anh cho trẻ em', createdBy: 'staff-002' },
  { code: 'PMT-23005', amount: 4500000, date: '2023-09-10', method: 'CREDIT_CARD', status: 'FAILED', receipt: null, desc: 'Thanh toán học phí qua thẻ - Giao dịch thất bại', createdBy: 'admin' },
  { code: 'PMT-23006', amount: 5200000, date: '2023-09-15', method: 'CASH', status: 'COMPLETED', receipt: 'R-2309-006', desc: 'Thanh toán học phí đầy đủ khóa Luyện thi TOEIC', createdBy: 'staff-001' },
  { code: 'PMT-23007', amount: 6000000, date: '2023-09-22', method: 'BANK_TRANSFER', status: 'COMPLETED', receipt: 'R-2309-007', desc: 'Thanh toán học phí khóa Tiếng Anh thương mại', createdBy: 'admin' },
  { code: 'PMT-23008', amount: 4800000, date: '2023-10-01', method: 'CREDIT_CARD', status: 'REFUNDED', receipt: 'R-2310-008', desc: 'Hoàn học phí do hủy đăng ký khóa học', createdBy: 'admin', details: 'Refund to card ending 4321' },
  { code: 'PMT-23009', amount: 7800000, date: '2023-10-08', method: 'BANK_TRANSFER', status: 'PENDING', receipt: null, desc: 'Chờ xác nhận thanh toán học phí Luyện thi IELTS', createdBy: 'staff-002' },
  { code: 'PMT-23010', amount: 5500000, date: '2023-10-12', method: 'E_WALLET', status: 'COMPLETED', receipt: 'R-2310-010', desc: 'Thanh toán học phí khóa Tiếng Anh chuyên ngành IT qua ZaloPay', createdBy: 'staff-001' },
  { code: 'PMT-23011', amount: 5200000, date: '2023-10-15', method: 'CASH', status: 'COMPLETED', receipt: 'R-2310-011', desc: 'Thanh toán học phí khóa Luyện thi TOEIC', createdBy: 'admin' },
  { code: 'PMT-23012', amount: 4500000, date: '2023-10-20', method: 'BANK_TRANSFER', status: 'PENDING', receipt: null, desc: 'Đặt cọc học phí khóa Tiếng Anh nâng cao', createdBy: 'staff-002' },
  { code: 'PMT-23013', amount: 6000000, date: '2023-10-25', method: 'E_WALLET', status: 'FAILED', receipt: null, desc: 'Thanh toán học phí qua ví MoMo - Giao dịch thất bại', createdBy: 'admin' },
  { code: 'PMT-23014', amount: 3200000, date: '2023-10-28', method: 'CASH', status: 'COMPLETED', receipt: 'R-2310-014', desc: 'Thanh toán học phí khóa Tiếng Anh giao tiếp', createdBy: 'staff-001' },
  { code: 'PMT-23015', amount: 2500000, date: '2023-11-02', method: 'CREDIT_CARD', status: 'COMPLETED', receipt: 'R-2311-015', desc: 'Thanh toán học phí khóa Tiếng Anh cho trẻ em qua thẻ tín dụng', createdBy: 'admin' },
];

async function importPayments() {
  let pool;
  try {
    console.log('\n==============================================');
    console.log('Importing Payments from Mock Data');
    console.log('==============================================\n');

    console.log('Connecting to database...');
    pool = await sql.connect(config);
    console.log('✓ Connected\n');

    // Get student enrollments
    console.log('Getting student enrollments...');
    const enrollments = await pool.request().query(`
      SELECT TOP 8 e.ID, s.STUDENT_CODE 
      FROM ENROLLMENTS e
      INNER JOIN STUDENTS s ON e.STUDENT_ID = s.ID
      ORDER BY e.ID
    `);

    if (enrollments.recordset.length < 8) {
      console.log('⚠ Not enough enrollments found. Creating enrollments...');
      
      // Create enrollments for first 8 students
      const students = await pool.request().query(`
        SELECT TOP 8 ID, STUDENT_CODE FROM STUDENTS ORDER BY ID
      `);
      
      const classes = await pool.request().query(`
        SELECT TOP 1 ID FROM CLASSES WHERE STATUS = 'ACTIVE'
      `);
      
      const classId = classes.recordset[0].ID;
      
      for (const student of students.recordset) {
        await pool.request()
          .input('studentId', sql.Int, student.ID)
          .input('classId', sql.Int, classId)
          .query(`
            IF NOT EXISTS (SELECT 1 FROM ENROLLMENTS WHERE STUDENT_ID = @studentId)
            BEGIN
              INSERT INTO ENROLLMENTS (STUDENT_ID, CLASS_ID, ENROLLMENT_DATE, STATUS)
              VALUES (@studentId, @classId, GETDATE(), 'ACTIVE')
            END
          `);
      }
      
      // Re-fetch enrollments
      const newEnrollments = await pool.request().query(`
        SELECT TOP 8 e.ID, s.STUDENT_CODE 
        FROM ENROLLMENTS e
        INNER JOIN STUDENTS s ON e.STUDENT_ID = s.ID
        ORDER BY e.ID
      `);
      enrollments.recordset = newEnrollments.recordset;
    }

    console.log(`✓ Found ${enrollments.recordset.length} enrollments\n`);

    // Delete existing mock payments
    console.log('Clearing existing mock payments...');
    await pool.request().query(`DELETE FROM PAYMENTS WHERE PAYMENT_CODE LIKE 'PMT-23%'`);
    console.log('✓ Cleared\n');

    // Insert payments
    console.log('Inserting payments...');
    let inserted = 0;

    for (let i = 0; i < paymentsData.length; i++) {
      const payment = paymentsData[i];
      const enrollment = enrollments.recordset[i % enrollments.recordset.length];

      try {
        await pool.request()
          .input('code', sql.VarChar, payment.code)
          .input('enrollmentId', sql.Int, enrollment.ID)
          .input('amount', sql.Decimal(18, 2), payment.amount)
          .input('date', sql.Date, payment.date)
          .input('method', sql.VarChar, payment.method)
          .input('status', sql.VarChar, payment.status)
          .input('receipt', sql.VarChar, payment.receipt)
          .input('desc', sql.NVarChar, payment.desc)
          .input('details', sql.NVarChar, payment.details || null)
          .input('createdBy', sql.VarChar, payment.createdBy)
          .query(`
            INSERT INTO PAYMENTS (
              PAYMENT_CODE, ENROLLMENT_ID, AMOUNT, PAYMENT_DATE, 
              PAYMENT_METHOD, STATUS, RECEIPT_NUMBER, DESCRIPTION,
              PAYMENT_DETAILS, CREATED_BY
            ) VALUES (
              @code, @enrollmentId, @amount, @date,
              @method, @status, @receipt, @desc,
              @details, @createdBy
            )
          `);

        inserted++;
        process.stdout.write(`\r  Inserted ${inserted}/${paymentsData.length} payments`);
      } catch (err) {
        console.error(`\n✗ Failed to insert ${payment.code}:`, err.message);
      }
    }

    console.log('\n✓ All payments inserted\n');

    // Verify
    console.log('Verification:');
    const stats = await pool.request().query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN STATUS = 'COMPLETED' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN STATUS = 'PENDING' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN STATUS = 'FAILED' THEN 1 ELSE 0 END) as failed,
        SUM(CASE WHEN STATUS = 'REFUNDED' THEN 1 ELSE 0 END) as refunded,
        SUM(AMOUNT) as total_amount
      FROM PAYMENTS
      WHERE PAYMENT_CODE LIKE 'PMT-23%'
    `);

    const s = stats.recordset[0];
    console.log(`  Total payments: ${s.total}`);
    console.log(`  Completed: ${s.completed}`);
    console.log(`  Pending: ${s.pending}`);
    console.log(`  Failed: ${s.failed}`);
    console.log(`  Refunded: ${s.refunded}`);
    console.log(`  Total amount: ${s.total_amount.toLocaleString('vi-VN')} VND`);

    console.log('\n==============================================');
    console.log('✓ Payments import completed successfully!');
    console.log('==============================================\n');

  } catch (err) {
    console.error('\n✗ Import failed:', err.message);
    console.error(err);
    process.exit(1);
  } finally {
    if (pool) await pool.close();
  }
}

importPayments();
