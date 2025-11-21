# 📚 HƯỚNG DẪN SỬ DỤNG STORED PROCEDURES & FUNCTIONS

## MỤC LỤC
1. [Cài đặt](#cài-đặt)
2. [User Management](#1-user-management)
3. [Enrollment Management](#2-enrollment-management)
4. [Payment Processing](#3-payment-processing)
5. [Attendance System](#4-attendance-system)
6. [Functions & Calculations](#5-functions--calculations)
7. [Triggers (Auto-Processing)](#6-triggers-auto-processing)
8. [Backup & Restore](#7-backup--restore)
9. [Reports & Analytics](#8-reports--analytics)
10. [Cách gọi từ Backend API](#9-cách-gọi-từ-backend-api)

---

## CÀI ĐẶT

### 1. Chạy scripts theo thứ tự:
```bash
# 1. Tạo database schema
sqlcmd -S localhost -d master -i Backend/Db_DMT_SQLServer.sql

# 2. Tạo stored procedures, functions, triggers
sqlcmd -S localhost -d DMT_EDUCATION_SYSTEM -i Backend/Db_DMT_StoredProcedures.sql
```

### 2. Kiểm tra cài đặt:
```sql
-- List all stored procedures
SELECT name, create_date FROM sys.procedures ORDER BY name;

-- List all functions
SELECT name, create_date FROM sys.objects WHERE type IN ('FN', 'TF') ORDER BY name;

-- List all triggers
SELECT name, create_date FROM sys.triggers ORDER BY name;
```

---

## 1. USER MANAGEMENT

### 1.1. Tạo User mới (`sp_CreateUser`)

**Mục đích:** Tạo user với validation email, role

**Tham số:**
- `@role_id`: INT - ID role (1=Admin, 2=Staff, 3=Teacher, 4=Student)
- `@email`: VARCHAR(255) - Email (unique)
- `@password_hash`: VARCHAR(255) - Mật khẩu đã hash
- `@full_name`: NVARCHAR(255) - Họ tên đầy đủ
- `@phone`: VARCHAR(20) - SĐT (optional)
- `@address`: NVARCHAR(MAX) - Địa chỉ (optional)
- `@birth_date`: DATE - Ngày sinh (optional)
- `@user_id`: INT OUTPUT - ID user vừa tạo
- `@error_message`: NVARCHAR(500) OUTPUT - Thông báo lỗi

**Ví dụ SQL:**
```sql
DECLARE @user_id INT;
DECLARE @error_msg NVARCHAR(500);

EXEC sp_CreateUser
    @role_id = 4,
    @email = 'student01@gmail.com',
    @password_hash = '$2b$10$abcdefghijklmnopqrstuvwxyz',
    @full_name = N'Nguyễn Văn A',
    @phone = '0912345678',
    @address = N'123 Nguyễn Huệ, Q1, TPHCM',
    @birth_date = '2005-05-15',
    @user_id = @user_id OUTPUT,
    @error_message = @error_msg OUTPUT;

SELECT @user_id AS user_id, @error_msg AS message;
```

**Return codes:**
- `0`: Thành công
- `-1`: Email không hợp lệ
- `-2`: Email đã tồn tại
- `-3`: Role không tồn tại
- `-99`: Lỗi hệ thống

---

### 1.2. Đăng ký Student (`sp_RegisterStudent`)

**Mục đích:** Tạo user + student với student_code tự động

**Ví dụ SQL:**
```sql
DECLARE @student_id INT;
DECLARE @student_code VARCHAR(50);
DECLARE @error_msg NVARCHAR(500);

EXEC sp_RegisterStudent
    @email = 'student02@gmail.com',
    @password_hash = '$2b$10$hashedpassword',
    @full_name = N'Trần Thị B',
    @phone = '0987654321',
    @address = N'456 Lê Lợi, Q1, TPHCM',
    @birth_date = '2006-08-20',
    @school_level = 'HIGH_SCHOOL',
    @parent_name = N'Trần Văn C',
    @parent_phone = '0909123456',
    @parent_email = 'parent@gmail.com',
    @student_id = @student_id OUTPUT,
    @student_code = @student_code OUTPUT,
    @error_message = @error_msg OUTPUT;

SELECT @student_id AS student_id, 
       @student_code AS student_code, 
       @error_msg AS message;
-- Output: student_id=5, student_code='HS2025001'
```

---

### 1.3. Đăng ký Teacher (`sp_RegisterTeacher`)

**Ví dụ SQL:**
```sql
DECLARE @teacher_id INT;
DECLARE @teacher_code VARCHAR(50);
DECLARE @error_msg NVARCHAR(500);

EXEC sp_RegisterTeacher
    @email = 'teacher01@dmt.edu.vn',
    @password_hash = '$2b$10$hashedpassword',
    @full_name = N'Nguyễn Văn Giáo',
    @phone = '0901234567',
    @address = N'789 Điện Biên Phủ, Q3, TPHCM',
    @birth_date = '1985-03-10',
    @main_subject_id = 1,
    @years_experience = 10,
    @degree = N'Thạc sĩ Toán học',
    @specialization = N'Toán THPT, Toán Olympic',
    @teacher_id = @teacher_id OUTPUT,
    @teacher_code = @teacher_code OUTPUT,
    @error_message = @error_msg OUTPUT;

SELECT @teacher_id AS teacher_id,
       @teacher_code AS teacher_code,
       @error_msg AS message;
-- Output: teacher_id=3, teacher_code='GV2025001'
```

---

## 2. ENROLLMENT MANAGEMENT

### 2.1. Đăng ký học (`sp_EnrollStudent`)

**Mục đích:** Đăng ký student vào lớp với validation đầy đủ

**Validation:**
- Class tồn tại và còn chỗ
- Class đang ACTIVE hoặc PLANNING
- Student chưa đăng ký lớp này
- Auto tăng CURRENT_STUDENTS

**Ví dụ SQL:**
```sql
DECLARE @enrollment_id INT;
DECLARE @error_msg NVARCHAR(500);

EXEC sp_EnrollStudent
    @class_id = 1,
    @student_id = 5,
    @total_fee = 3000000, -- 3 triệu
    @discount_percent = 10, -- Giảm 10%
    @notes = N'Học bổng học sinh giỏi',
    @enrollment_id = @enrollment_id OUTPUT,
    @error_message = @error_msg OUTPUT;

SELECT @enrollment_id AS enrollment_id, @error_msg AS message;
-- Final fee = 3000000 * 0.9 = 2,700,000
```

**Return codes:**
- `0`: Thành công
- `-1`: Lớp không tồn tại
- `-2`: Lớp đã kết thúc/hủy
- `-3`: Lớp đã đầy
- `-4`: Đã đăng ký trước đó

---

### 2.2. Hủy đăng ký (`sp_DropEnrollment`)

**Ví dụ SQL:**
```sql
DECLARE @error_msg NVARCHAR(500);

EXEC sp_DropEnrollment
    @enrollment_id = 1,
    @reason = N'Chuyển lớp do lịch học không phù hợp',
    @error_message = @error_msg OUTPUT;

SELECT @error_msg AS message;
```

---

## 3. PAYMENT PROCESSING

### 3.1. Ghi nhận thanh toán (`sp_ProcessPayment`)

**Mục đích:** 
- Ghi nhận thanh toán
- Auto update PAYMENT_STATUS (PENDING → PARTIAL → PAID)
- Log activity

**Ví dụ SQL:**
```sql
DECLARE @payment_id INT;
DECLARE @error_msg NVARCHAR(500);

-- Thanh toán đợt 1: 1,500,000
EXEC sp_ProcessPayment
    @enrollment_id = 1,
    @amount = 1500000,
    @payment_method = 'BANK_TRANSFER',
    @transaction_id = 'TXN202511050001',
    @notes = N'Thanh toán đợt 1/2',
    @processed_by = 2, -- Staff ID
    @payment_id = @payment_id OUTPUT,
    @error_message = @error_msg OUTPUT;

-- Enrollment sẽ chuyển sang PAYMENT_STATUS = 'PARTIAL'
-- PAID_AMOUNT = 1,500,000 / TOTAL_FEE = 2,700,000
```

**Return codes:**
- `0`: Thành công
- `-1`: Enrollment không tồn tại
- `-2`: Số tiền <= 0
- `-3`: Vượt quá học phí

---

### 3.2. Hoàn tiền (`sp_RefundPayment`)

**Ví dụ SQL:**
```sql
DECLARE @error_msg NVARCHAR(500);

EXEC sp_RefundPayment
    @payment_id = 1,
    @refund_amount = 500000,
    @refund_reason = N'Hoàn tiền do nghỉ học giữa chừng',
    @processed_by = 2,
    @error_message = @error_msg OUTPUT;

SELECT @error_msg AS message;
```

---

## 4. ATTENDANCE SYSTEM

### 4.1. Bulk điểm danh (`sp_BulkMarkAttendance`)

**Mục đích:** Điểm danh nhiều students trong 1 session

**Ví dụ SQL:**
```sql
DECLARE @error_msg NVARCHAR(500);
DECLARE @attendance_json NVARCHAR(MAX) = N'
[
  {"enrollment_id": 1, "status": "PRESENT", "notes": ""},
  {"enrollment_id": 2, "status": "ABSENT", "notes": "Xin phép"},
  {"enrollment_id": 3, "status": "LATE", "notes": "Đến muộn 10 phút"},
  {"enrollment_id": 4, "status": "PRESENT", "notes": ""}
]';

EXEC sp_BulkMarkAttendance
    @session_id = 1,
    @attendance_data = @attendance_json,
    @marked_by = 3, -- Teacher ID
    @error_message = @error_msg OUTPUT;

SELECT @error_msg AS message;
```

**Lưu ý:** Sử dụng MERGE để:
- Insert nếu chưa có
- Update nếu đã có

---

## 5. FUNCTIONS & CALCULATIONS

### 5.1. Tính tỷ lệ điểm danh (`fn_GetAttendanceRate`)

**Ví dụ SQL:**
```sql
-- Tỷ lệ điểm danh của student 5 trong tất cả lớp
SELECT dbo.fn_GetAttendanceRate(5, NULL) AS attendance_rate;
-- Output: 85.50 (%)

-- Tỷ lệ điểm danh trong class 1
SELECT dbo.fn_GetAttendanceRate(5, 1) AS attendance_rate;
-- Output: 90.00 (%)
```

---

### 5.2. Tính điểm trung bình (`fn_GetAverageGrade`)

**Ví dụ SQL:**
```sql
SELECT 
    s.STUDENT_CODE,
    u.FULL_NAME,
    dbo.fn_GetAverageGrade(s.ID, NULL) AS overall_avg,
    dbo.fn_GetAverageGrade(s.ID, 1) AS class1_avg
FROM STUDENTS s
JOIN USERS u ON s.USER_ID = u.ID;
```

---

### 5.3. Tính doanh thu (`fn_GetRevenue`)

**Ví dụ SQL:**
```sql
-- Doanh thu năm 2025
SELECT dbo.fn_GetRevenue(2025, NULL) AS revenue_2025;

-- Doanh thu tháng 11/2025
SELECT dbo.fn_GetRevenue(2025, 11) AS revenue_nov_2025;

-- Doanh thu từng tháng trong năm
SELECT 
    MONTH_NUM,
    dbo.fn_GetRevenue(2025, MONTH_NUM) AS revenue
FROM (VALUES (1),(2),(3),(4),(5),(6),(7),(8),(9),(10),(11),(12)) AS Months(MONTH_NUM);
```

---

### 5.4. Kiểm tra submit assignment (`fn_CanSubmitAssignment`)

**Ví dụ SQL:**
```sql
-- Check student 5 có thể submit assignment 1 không
SELECT dbo.fn_CanSubmitAssignment(1, 5) AS can_submit;
-- Output: 1 (TRUE) hoặc 0 (FALSE)

-- Validate trước khi submit
IF dbo.fn_CanSubmitAssignment(1, 5) = 1
BEGIN
    -- Allow submission
    PRINT 'Can submit';
END
ELSE
BEGIN
    -- Reject
    PRINT 'Cannot submit (not enrolled or past due date)';
END
```

---

### 5.5. Tính điểm tổng kết (`fn_CalculateOverallGrade`)

**Ví dụ SQL:**
```sql
-- Tính điểm tổng kết cho enrollment 1
SELECT dbo.fn_CalculateOverallGrade(1) AS overall_grade;
-- Output: 86.50 (midterm 30% + final 50% + assignment 20%)
```

---

## 6. TRIGGERS (AUTO-PROCESSING)

### 6.1. Auto update timestamp (`trg_Users_UpdateTimestamp`)
```sql
-- Tự động set UPDATED_AT khi update USER
UPDATE USERS SET FULL_NAME = N'Nguyễn Văn A (Updated)' WHERE ID = 1;
-- UPDATED_AT tự động = GETDATE()
```

---

### 6.2. Validate capacity (`trg_Classes_ValidateCapacity`)
```sql
-- Không cho CURRENT_STUDENTS > CAPACITY
UPDATE CLASSES SET CURRENT_STUDENTS = 30 WHERE ID = 1 AND CAPACITY = 25;
-- Error: "Số học sinh vượt quá sức chứa lớp học"
```

---

### 6.3. Auto notification assignment (`trg_Assignments_CreateNotification`)
```sql
-- Khi tạo assignment mới, tự động tạo notification cho students
INSERT INTO ASSIGNMENTS (CLASS_ID, TITLE, DESCRIPTION, DUE_DATE, CREATED_BY)
VALUES (1, N'Bài tập chương 1', N'Làm bài 1,2,3', '2025-11-10', 3);

-- Trigger tự động tạo notification cho tất cả students trong class 1
```

---

### 6.4. Auto notification grading (`trg_Submissions_GradeNotification`)
```sql
-- Khi chấm điểm, tự động thông báo cho student
UPDATE SUBMISSIONS 
SET STATUS = 'GRADED', SCORE = 85, FEEDBACK = N'Bài làm tốt'
WHERE ID = 1;

-- Trigger tạo notification: "Bài tập đã được chấm điểm: 85/100"
```

---

### 6.5. Soft delete user (`trg_Users_LogDelete`)
```sql
-- DELETE user sẽ chuyển thành soft delete
DELETE FROM USERS WHERE ID = 10;
-- Thực tế: UPDATE USERS SET STATUS = 0 WHERE ID = 10
-- + Log vào ACTIVITY_LOGS
```

---

### 6.6. Auto calculate overall grade (`trg_Grades_CalculateOverall`)
```sql
-- Khi insert/update GRADES, tự động tính lại OVERALL
INSERT INTO GRADES (ENROLLMENT_ID, GRADE_TYPE, SCORE, WEIGHT, GRADED_BY)
VALUES (1, 'MIDTERM', 80, 30, 3);

INSERT INTO GRADES (ENROLLMENT_ID, GRADE_TYPE, SCORE, WEIGHT, GRADED_BY)
VALUES (1, 'FINAL', 90, 50, 3);

-- Trigger tự động insert GRADE_TYPE='OVERALL' với điểm tính theo trọng số
-- Overall = 80*0.3 + 90*0.5 = 69
```

---

## 7. BACKUP & RESTORE

### 7.1. Backup database (`sp_BackupDatabase`)

**Ví dụ SQL:**
```sql
DECLARE @error_msg NVARCHAR(500);

-- Full backup
EXEC sp_BackupDatabase
    @backup_path = 'C:\SQLBackups\',
    @backup_type = 'FULL',
    @error_message = @error_msg OUTPUT;

SELECT @error_msg;
-- Output: "Backup thành công: C:\SQLBackups\DMT_EDUCATION_SYSTEM_20251105_143000.bak"

-- Differential backup
EXEC sp_BackupDatabase
    @backup_path = 'C:\SQLBackups\',
    @backup_type = 'DIFFERENTIAL',
    @error_message = @error_msg OUTPUT;
```

**Lưu ý:**
- Auto log vào BACKUP_HISTORY
- Ghi nhận thời gian, kích thước, trạng thái

---

### 7.2. Restore database (`sp_RestoreDatabase`)

**Ví dụ SQL:**
```sql
DECLARE @error_msg NVARCHAR(500);

EXEC sp_RestoreDatabase
    @backup_file = 'C:\SQLBackups\DMT_EDUCATION_SYSTEM_20251105_143000.bak',
    @restore_type = 'FULL',
    @error_message = @error_msg OUTPUT;

SELECT @error_msg;
```

**Cảnh báo:** 
- ⚠️ Restore sẽ OVERWRITE database hiện tại
- ⚠️ Tất cả connections sẽ bị ngắt (SINGLE_USER mode)

---

## 8. REPORTS & ANALYTICS

### 8.1. System overview (`sp_GetSystemOverview`)

**Ví dụ SQL:**
```sql
EXEC sp_GetSystemOverview;
```

**Output:**
| report_type | total_active_users | total_students | total_teachers | active_classes | revenue_this_year | revenue_this_month |
|-------------|-------------------|----------------|----------------|----------------|-------------------|-------------------|
| System Statistics | 150 | 100 | 20 | 15 | 150,000,000 | 30,000,000 |

---

### 8.2. Student report (`sp_GetStudentReport`)

**Ví dụ SQL:**
```sql
EXEC sp_GetStudentReport @student_id = 5;
```

**Output 3 result sets:**
1. **Thông tin cơ bản:** student_code, full_name, email, school_level
2. **Lớp đang học:** class_name, enrollment_status, payment_status, attendance_rate, average_grade
3. **Assignments pending:** assignment_title, due_date, submission_status

---

### 8.3. Class report cho teacher (`sp_GetClassReport`)

**Ví dụ SQL:**
```sql
EXEC sp_GetClassReport @class_id = 1;
```

**Output 3 result sets:**
1. **Class info:** code, name, capacity, current_students, teacher_name
2. **Students list:** student_code, full_name, attendance_rate, average_grade, pending_grading_count
3. **Attendance stats:** session_date, present_count, absent_count, late_count

---

## 9. CÁCH GỌI TỪ BACKEND API

### 9.1. Setup SQL Server connection

**File: `/Backend/src/utils/database.ts`**
```typescript
import sql from 'mssql';

const config = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER || 'localhost',
  database: 'DMT_EDUCATION_SYSTEM',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

export async function executeProcedure(
  procedureName: string, 
  params: any
): Promise<any> {
  const pool = await sql.connect(config);
  const request = pool.request();
  
  // Add input parameters
  for (const [key, value] of Object.entries(params.input || {})) {
    request.input(key, value);
  }
  
  // Add output parameters
  for (const [key, type] of Object.entries(params.output || {})) {
    request.output(key, type as any);
  }
  
  const result = await request.execute(procedureName);
  
  return {
    returnValue: result.returnValue,
    recordsets: result.recordsets,
    output: result.output
  };
}
```

---

### 9.2. API Route Examples

#### 9.2.1. Register Student

**File: `/Backend/src/routes/auth.ts`**
```typescript
import { executeProcedure } from '../utils/database';
import sql from 'mssql';
import bcrypt from 'bcrypt';

app.post('/auth/register/student', async (req, reply) => {
  const { email, password, full_name, phone, address, birth_date, 
          school_level, parent_name, parent_phone, parent_email } = req.body;
  
  // Hash password
  const password_hash = await bcrypt.hash(password, 10);
  
  const result = await executeProcedure('sp_RegisterStudent', {
    input: {
      email,
      password_hash,
      full_name,
      phone,
      address,
      birth_date,
      school_level,
      parent_name,
      parent_phone,
      parent_email
    },
    output: {
      student_id: sql.Int,
      student_code: sql.VarChar(50),
      error_message: sql.NVarChar(500)
    }
  });
  
  if (result.returnValue === 0) {
    return reply.code(201).send({
      success: true,
      data: {
        student_id: result.output.student_id,
        student_code: result.output.student_code
      }
    });
  } else {
    return reply.code(400).send({
      success: false,
      error: result.output.error_message
    });
  }
});
```

---

#### 9.2.2. Enroll Student

**File: `/Backend/src/routes/enrollments.ts`**
```typescript
app.post('/enrollments', {
  preValidation: [authenticateToken, requireRole([ROLES.ADMIN, ROLES.STAFF])]
}, async (req, reply) => {
  const { class_id, student_id, total_fee, discount_percent, notes } = req.body;
  
  const result = await executeProcedure('sp_EnrollStudent', {
    input: {
      class_id,
      student_id,
      total_fee,
      discount_percent: discount_percent || 0,
      notes
    },
    output: {
      enrollment_id: sql.Int,
      error_message: sql.NVarChar(500)
    }
  });
  
  if (result.returnValue === 0) {
    return reply.code(201).send({
      success: true,
      data: { enrollment_id: result.output.enrollment_id }
    });
  } else {
    return reply.code(400).send({
      success: false,
      error: result.output.error_message
    });
  }
});
```

---

#### 9.2.3. Process Payment

**File: `/Backend/src/routes/payments.ts`**
```typescript
app.post('/payments', {
  preValidation: [authenticateToken, requireRole([ROLES.ADMIN, ROLES.STAFF])]
}, async (req, reply) => {
  const { enrollment_id, amount, payment_method, transaction_id, notes } = req.body;
  const processed_by = req.user.sub;
  
  const result = await executeProcedure('sp_ProcessPayment', {
    input: {
      enrollment_id,
      amount,
      payment_method,
      transaction_id,
      notes,
      processed_by
    },
    output: {
      payment_id: sql.Int,
      error_message: sql.NVarChar(500)
    }
  });
  
  if (result.returnValue === 0) {
    return reply.code(201).send({
      success: true,
      data: { payment_id: result.output.payment_id },
      message: result.output.error_message
    });
  } else {
    return reply.code(400).send({
      success: false,
      error: result.output.error_message
    });
  }
});
```

---

#### 9.2.4. Bulk Mark Attendance

**File: `/Backend/src/routes/attendance.ts`**
```typescript
app.post('/attendance/bulk', {
  preValidation: [authenticateToken, requireRole([ROLES.TEACHER, ROLES.ADMIN])]
}, async (req, reply) => {
  const { session_id, attendance_records } = req.body;
  const marked_by = req.user.sub;
  
  // Convert to JSON string
  const attendance_data = JSON.stringify(attendance_records);
  
  const result = await executeProcedure('sp_BulkMarkAttendance', {
    input: {
      session_id,
      attendance_data,
      marked_by
    },
    output: {
      error_message: sql.NVarChar(500)
    }
  });
  
  if (result.returnValue === 0) {
    return reply.send({
      success: true,
      message: result.output.error_message
    });
  } else {
    return reply.code(400).send({
      success: false,
      error: result.output.error_message
    });
  }
});
```

---

#### 9.2.5. Get Student Report

**File: `/Backend/src/routes/reports.ts`**
```typescript
app.get('/reports/student/:id', {
  preValidation: [authenticateToken]
}, async (req, reply) => {
  const { id } = req.params;
  
  const result = await executeProcedure('sp_GetStudentReport', {
    input: { student_id: id }
  });
  
  return reply.send({
    success: true,
    data: {
      basic_info: result.recordsets[0][0],
      enrollments: result.recordsets[1],
      pending_assignments: result.recordsets[2]
    }
  });
});
```

---

#### 9.2.6. Use Functions in Queries

**File: `/Backend/src/routes/students.ts`**
```typescript
app.get('/students/:id/stats', async (req, reply) => {
  const { id } = req.params;
  
  const pool = await sql.connect(config);
  const result = await pool.request()
    .input('student_id', sql.Int, id)
    .query(`
      SELECT 
        s.STUDENT_CODE,
        u.FULL_NAME,
        dbo.fn_GetAttendanceRate(@student_id, NULL) AS attendance_rate,
        dbo.fn_GetAverageGrade(@student_id, NULL) AS average_grade,
        (SELECT COUNT(*) FROM ENROLLMENTS WHERE STUDENT_ID = @student_id AND STATUS = 'ACTIVE') AS active_classes
      FROM STUDENTS s
      JOIN USERS u ON s.USER_ID = u.ID
      WHERE s.ID = @student_id
    `);
  
  return reply.send({
    success: true,
    data: result.recordset[0]
  });
});
```

---

## 10. TESTING PROCEDURES

### Test Script
```sql
-- Test 1: Register student
DECLARE @student_id INT, @student_code VARCHAR(50), @error NVARCHAR(500);
EXEC sp_RegisterStudent 
    @email = 'test@example.com',
    @password_hash = '$2b$10$test',
    @full_name = N'Test Student',
    @phone = '0912345678',
    @address = N'Test Address',
    @birth_date = '2005-01-01',
    @school_level = 'HIGH_SCHOOL',
    @parent_name = N'Test Parent',
    @parent_phone = '0909123456',
    @student_id = @student_id OUTPUT,
    @student_code = @student_code OUTPUT,
    @error_message = @error OUTPUT;
    
SELECT @student_id, @student_code, @error;

-- Test 2: Enroll student
DECLARE @enrollment_id INT, @error2 NVARCHAR(500);
EXEC sp_EnrollStudent 
    @class_id = 1,
    @student_id = @student_id,
    @total_fee = 3000000,
    @discount_percent = 10,
    @enrollment_id = @enrollment_id OUTPUT,
    @error_message = @error2 OUTPUT;
    
SELECT @enrollment_id, @error2;

-- Test 3: Process payment
DECLARE @payment_id INT, @error3 NVARCHAR(500);
EXEC sp_ProcessPayment
    @enrollment_id = @enrollment_id,
    @amount = 1500000,
    @payment_method = 'CASH',
    @processed_by = 1,
    @payment_id = @payment_id OUTPUT,
    @error_message = @error3 OUTPUT;
    
SELECT @payment_id, @error3;

-- Test 4: Check results
SELECT * FROM STUDENTS WHERE ID = @student_id;
SELECT * FROM ENROLLMENTS WHERE ID = @enrollment_id;
SELECT * FROM PAYMENTS WHERE ID = @payment_id;

-- Test 5: Calculate stats
SELECT 
    dbo.fn_GetAttendanceRate(@student_id, NULL) AS attendance_rate,
    dbo.fn_GetAverageGrade(@student_id, NULL) AS avg_grade;
```

---

## 📌 LƯU Ý QUAN TRỌNG

### Security
1. **KHÔNG bao giờ** pass raw password vào stored procedures - phải hash trước
2. **LUÔN kiểm tra** return code và error_message
3. **Validate** tất cả input parameters ở Backend trước khi gọi SP

### Performance
1. Stored procedures đã được optimize với indexes
2. Sử dụng transactions cho consistency
3. Output parameters tránh SELECT nhiều lần

### Error Handling
```typescript
try {
  const result = await executeProcedure('sp_EnrollStudent', params);
  
  if (result.returnValue !== 0) {
    return reply.code(400).send({
      success: false,
      error: result.output.error_message
    });
  }
  
  // Success case
  return reply.send({ success: true, data: result.output });
  
} catch (error) {
  return reply.code(500).send({
    success: false,
    error: error.message
  });
}
```

---

## 📚 TÀI LIỆU THAM KHẢO

- Database Schema: `Backend/Db_DMT_SQLServer.sql`
- Stored Procedures: `Backend/Db_DMT_StoredProcedures.sql`
- API Documentation: `Backend/README_API.md`
- Sample Data: `Backend/Db_DMT_Sample_Data.sql`

---

**Version:** 1.0  
**Last Updated:** November 5, 2025  
**Author:** DMT Development Team
