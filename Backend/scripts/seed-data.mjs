#!/usr/bin/env node

/**
 * Script to seed sample data into SQL Server database
 * Usage: node scripts/seed-data.mjs
 */

import sql from 'mssql';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const config = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'DMTEducation2024',
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_DATABASE || 'dmt_education_system',
  port: parseInt(process.env.DB_PORT || '1433'),
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: true,
    enableArithAbort: true
  }
};

async function seedData() {
  let pool;
  
  try {
    console.log('🌱 Seeding SQL Server Database');
    console.log('='.repeat(60));
    console.log(`   Database: ${config.database}\n`);

    pool = await sql.connect(config);
    console.log('Connected to database\n');

    // Check if roles already exist
    const rolesCheck = await pool.request().query('SELECT COUNT(*) as count FROM roles');
    if (rolesCheck.recordset[0].count > 0) {
      console.log('Data already exists. Skipping roles...\n');
    } else {
      // Insert roles
      console.log('📝 Inserting roles...');
      await pool.request().query(`
        SET IDENTITY_INSERT roles ON;
        INSERT INTO roles (id, code, name, description) VALUES
        (1, 'ADMIN', N'Quản trị viên', N'Quản trị hệ thống, có toàn quyền'),
        (2, 'STAFF', N'Nhân viên', N'Nhân viên văn phòng, quản lý học vụ'),
        (3, 'TEACHER', N'Giáo viên', N'Giảng dạy và quản lý lớp học'),
        (4, 'STUDENT', N'Học sinh', N'Học viên tham gia khóa học');
        SET IDENTITY_INSERT roles OFF;
      `);
      console.log('   Roles inserted (4 records)\n');
    }

    // Hash passwords
    console.log('🔐 Hashing passwords...');
    const adminPassword = await bcrypt.hash('admin123', 12);
    const staffPassword = await bcrypt.hash('staff123', 12);
    const teacherPassword = await bcrypt.hash('teacher123', 12);
    const studentPassword = await bcrypt.hash('student123', 12);
    console.log('   Passwords hashed\n');

    // Insert users
    console.log('👥 Inserting users...');
    
    // Admin
    await pool.request()
      .input('role_id', sql.Int, 1)
      .input('email', sql.VarChar, 'admin@dmt.edu.vn')
      .input('password_hash', sql.VarChar, adminPassword)
      .input('full_name', sql.NVarChar, 'Quản Trị Viên')
      .input('phone', sql.VarChar, '0901234567')
      .query(`
        IF NOT EXISTS (SELECT 1 FROM users WHERE email = @email)
        INSERT INTO users (role_id, email, password_hash, full_name, phone, status)
        VALUES (@role_id, @email, @password_hash, @full_name, @phone, 1)
      `);
    console.log('   Admin user created (admin@dmt.edu.vn / admin123)');

    // Staff
    await pool.request()
      .input('role_id', sql.Int, 2)
      .input('email', sql.VarChar, 'staff@dmt.edu.vn')
      .input('password_hash', sql.VarChar, staffPassword)
      .input('full_name', sql.NVarChar, 'Nhân Viên Văn Phòng')
      .input('phone', sql.VarChar, '0901234568')
      .query(`
        IF NOT EXISTS (SELECT 1 FROM users WHERE email = @email)
        INSERT INTO users (role_id, email, password_hash, full_name, phone, status)
        VALUES (@role_id, @email, @password_hash, @full_name, @phone, 1)
      `);
    console.log('   Staff user created (staff@dmt.edu.vn / staff123)');

    // Teacher
    const teacherResult = await pool.request()
      .input('role_id', sql.Int, 3)
      .input('email', sql.VarChar, 'teacher@dmt.edu.vn')
      .input('password_hash', sql.VarChar, teacherPassword)
      .input('full_name', sql.NVarChar, 'Nguyễn Văn Giáo')
      .input('phone', sql.VarChar, '0901234569')
      .query(`
        IF NOT EXISTS (SELECT 1 FROM users WHERE email = @email)
        BEGIN
          INSERT INTO users (role_id, email, password_hash, full_name, phone, status)
          OUTPUT INSERTED.id
          VALUES (@role_id, @email, @password_hash, @full_name, @phone, 1)
        END
        ELSE
          SELECT id FROM users WHERE email = @email
      `);
    console.log('   Teacher user created (teacher@dmt.edu.vn / teacher123)');

    // Student
    const studentResult = await pool.request()
      .input('role_id', sql.Int, 4)
      .input('email', sql.VarChar, 'student@dmt.edu.vn')
      .input('password_hash', sql.VarChar, studentPassword)
      .input('full_name', sql.NVarChar, 'Trần Thị Học')
      .input('phone', sql.VarChar, '0901234570')
      .query(`
        IF NOT EXISTS (SELECT 1 FROM users WHERE email = @email)
        BEGIN
          INSERT INTO users (role_id, email, password_hash, full_name, phone, status)
          OUTPUT INSERTED.id
          VALUES (@role_id, @email, @password_hash, @full_name, @phone, 1)
        END
        ELSE
          SELECT id FROM users WHERE email = @email
      `);
    console.log('   Student user created (student@dmt.edu.vn / student123)\n');

    // Insert subjects
    console.log('📚 Inserting subjects...');
    await pool.request().query(`
      IF NOT EXISTS (SELECT 1 FROM subjects WHERE code = 'MATH')
      INSERT INTO subjects (name, code, description, is_active) VALUES
      (N'Toán học', 'MATH', N'Môn Toán học', 1);
      
      IF NOT EXISTS (SELECT 1 FROM subjects WHERE code = 'ENG')
      INSERT INTO subjects (name, code, description, is_active) VALUES
      (N'Tiếng Anh', 'ENG', N'Môn Tiếng Anh', 1);
      
      IF NOT EXISTS (SELECT 1 FROM subjects WHERE code = 'PROG')
      INSERT INTO subjects (name, code, description, is_active) VALUES
      (N'Lập trình', 'PROG', N'Môn Lập trình', 1);
    `);
    console.log('   Subjects inserted (3 subjects)\n');

    // Insert courses
    console.log('📖 Inserting courses...');
    await pool.request().query(`
      DECLARE @math_id INT, @eng_id INT, @prog_id INT;
      SELECT @math_id = id FROM subjects WHERE code = 'MATH';
      SELECT @eng_id = id FROM subjects WHERE code = 'ENG';
      SELECT @prog_id = id FROM subjects WHERE code = 'PROG';
      
      IF NOT EXISTS (SELECT 1 FROM courses WHERE code = 'MATH-01')
      INSERT INTO courses (subject_id, code, name, description, duration_weeks, total_sessions, price, level, is_active)
      VALUES (@math_id, 'MATH-01', N'Toán cơ bản lớp 8-9', N'Khóa học toán học cơ bản dành cho học sinh lớp 8-9', 12, 24, 2000000, 'beginner', 1);
      
      IF NOT EXISTS (SELECT 1 FROM courses WHERE code = 'ENG-01')
      INSERT INTO courses (subject_id, code, name, description, duration_weeks, total_sessions, price, level, is_active)
      VALUES (@eng_id, 'ENG-01', N'Tiếng Anh giao tiếp', N'Khóa học tiếng Anh giao tiếp cơ bản', 16, 32, 2500000, 'intermediate', 1);
      
      IF NOT EXISTS (SELECT 1 FROM courses WHERE code = 'PROG-01')
      INSERT INTO courses (subject_id, code, name, description, duration_weeks, total_sessions, price, level, is_active)
      VALUES (@prog_id, 'PROG-01', N'Lập trình Python cơ bản', N'Khóa học lập trình Python cho người mới bắt đầu', 20, 40, 3000000, 'beginner', 1);
    `);
    console.log('   Courses inserted (3 courses)\n');

    await pool.close();

    console.log('='.repeat(60));
    console.log('🎉 Data seeding completed successfully!');
    console.log('='.repeat(60));
    console.log('\n📝 Test Accounts:');
    console.log('   Admin:   admin@dmt.edu.vn    / admin123');
    console.log('   Staff:   staff@dmt.edu.vn    / staff123');
    console.log('   Teacher: teacher@dmt.edu.vn  / teacher123');
    console.log('   Student: student@dmt.edu.vn  / student123');
    console.log('\nYou can now start the backend server: npm run dev');
    console.log('');

  } catch (err) {
    console.error('\nError:', err.message);
    console.error('Full error:', err);
    process.exit(1);
  } finally {
    if (pool) {
      await pool.close();
    }
  }
}

// Run the script
seedData();
