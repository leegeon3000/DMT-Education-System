# 🎓 DMT EDUCATION SYSTEM - DATABASE PROCEDURES

## 📚 TỔNG QUAN

Đây là phần **Hệ Quản Trị CSDL** cho đồ án môn học, bao gồm:
- **15+ Stored Procedures** - Xử lý nghiệp vụ phức tạp
- **5 Functions** - Tính toán và validation
- **7 Triggers** - Tự động xử lý dữ liệu
- **Backup/Restore** - Sao lưu và phục hồi database
- **Reports** - Báo cáo và thống kê

---

## 📁 CẤU TRÚC FILE

```
Backend/
├── Db_DMT_SQLServer.sql              # Database schema (28 tables)
├── Db_DMT_StoredProcedures.sql       # Procedures, Functions, Triggers
├── STORED_PROCEDURES_GUIDE.md        # Hướng dẫn chi tiết
├── Test_StoredProcedures.sql         # Test scripts
└── README_DATABASE_PROCEDURES.md     # File này
```

---

## HƯỚNG DẪN CÀI ĐẶT

### Bước 1: Tạo Database Schema
```bash
# Windows - SQL Server Management Studio
1. Mở SQL Server Management Studio (SSMS)
2. Connect tới SQL Server instance
3. File → Open → File → chọn Db_DMT_SQLServer.sql
4. Execute (F5)

# Hoặc dùng command line
sqlcmd -S localhost -i Backend/Db_DMT_SQLServer.sql
```

### Bước 2: Tạo Stored Procedures, Functions, Triggers
```bash
# Trong SSMS
1. File → Open → File → chọn Db_DMT_StoredProcedures.sql
2. Execute (F5)

# Hoặc command line
sqlcmd -S localhost -d DMT_EDUCATION_SYSTEM -i Backend/Db_DMT_StoredProcedures.sql
```

### Bước 3: Test
```bash
# Chạy test scripts
sqlcmd -S localhost -d DMT_EDUCATION_SYSTEM -i Backend/Test_StoredProcedures.sql
```

### Bước 4: Verify
```sql
-- Kiểm tra procedures đã tạo
SELECT name, create_date FROM sys.procedures ORDER BY name;

-- Kiểm tra functions
SELECT name, create_date FROM sys.objects WHERE type = 'FN' ORDER BY name;

-- Kiểm tra triggers
SELECT name, create_date FROM sys.triggers ORDER BY name;
```

---

## DANH SÁCH STORED PROCEDURES

### 1️⃣ User Management
| Procedure | Mục đích | Params | Output |
|-----------|----------|---------|--------|
| `sp_CreateUser` | Tạo user mới | role_id, email, password_hash, full_name... | user_id |
| `sp_RegisterStudent` | Đăng ký học sinh | email, password, full_name, parent_info... | student_id, student_code |
| `sp_RegisterTeacher` | Đăng ký giáo viên | email, password, degree, specialization... | teacher_id, teacher_code |

**Ví dụ:**
```sql
DECLARE @student_id INT, @student_code VARCHAR(50), @error NVARCHAR(500);
EXEC sp_RegisterStudent 
    @email = 'student@example.com',
    @password_hash = '$2b$10$hashedpassword',
    @full_name = N'Nguyễn Văn A',
    @phone = '0912345678',
    @address = N'123 Test Street',
    @birth_date = '2005-01-15',
    @school_level = 'HIGH_SCHOOL',
    @parent_name = N'Nguyễn Văn B',
    @parent_phone = '0909123456',
    @student_id = @student_id OUTPUT,
    @student_code = @student_code OUTPUT,
    @error_message = @error OUTPUT;
-- Output: student_code = 'HS2025001'
```

---

### 2️⃣ Enrollment Management
| Procedure | Mục đích | Validation | Auto-Update |
|-----------|----------|------------|-------------|
| `sp_EnrollStudent` | Đăng ký vào lớp | Class capacity, duplicate check | CURRENT_STUDENTS++ |
| `sp_DropEnrollment` | Hủy đăng ký | Status check | CURRENT_STUDENTS-- |

**Ví dụ:**
```sql
DECLARE @enrollment_id INT, @error NVARCHAR(500);
EXEC sp_EnrollStudent
    @class_id = 1,
    @student_id = 5,
    @total_fee = 3000000,
    @discount_percent = 10,  -- Giảm 10% = 2,700,000
    @notes = N'Học bổng học sinh giỏi',
    @enrollment_id = @enrollment_id OUTPUT,
    @error_message = @error OUTPUT;
```

---

### 3️⃣ Payment Processing
| Procedure | Mục đích | Auto-Calculation | Status Update |
|-----------|----------|------------------|---------------|
| `sp_ProcessPayment` | Ghi nhận thanh toán | Update paid_amount | PENDING → PARTIAL → PAID |
| `sp_RefundPayment` | Hoàn tiền | Decrease paid_amount | Recalculate status |

**Ví dụ:**
```sql
-- Thanh toán đợt 1
EXEC sp_ProcessPayment
    @enrollment_id = 1,
    @amount = 1500000,
    @payment_method = 'BANK_TRANSFER',
    @transaction_id = 'TXN001',
    @processed_by = 2;  -- Staff ID

-- PAYMENT_STATUS tự động chuyển: PENDING → PARTIAL
```

---

### 4️⃣ Attendance System
| Procedure | Mục đích | Input Format | Features |
|-----------|----------|--------------|----------|
| `sp_BulkMarkAttendance` | Điểm danh hàng loạt | JSON array | MERGE (insert/update) |

**Ví dụ:**
```sql
DECLARE @json NVARCHAR(MAX) = N'
[
  {"enrollment_id": 1, "status": "PRESENT", "notes": "Đúng giờ"},
  {"enrollment_id": 2, "status": "ABSENT", "notes": "Xin phép"},
  {"enrollment_id": 3, "status": "LATE", "notes": "Muộn 10 phút"}
]';

EXEC sp_BulkMarkAttendance
    @session_id = 1,
    @attendance_data = @json,
    @marked_by = 3;  -- Teacher ID
```

---

### 5️⃣ Backup & Restore
| Procedure | Mục đích | Params | Output |
|-----------|----------|---------|--------|
| `sp_BackupDatabase` | Sao lưu database | backup_path, backup_type (FULL/DIFFERENTIAL) | backup file path |
| `sp_RestoreDatabase` | Phục hồi database | backup_file | success/error |

**Ví dụ:**
```sql
-- Backup
EXEC sp_BackupDatabase
    @backup_path = 'C:\SQLBackups\',
    @backup_type = 'FULL';
-- Output: DMT_EDUCATION_SYSTEM_20251105_143000.bak

-- Restore
EXEC sp_RestoreDatabase
    @backup_file = 'C:\SQLBackups\DMT_EDUCATION_SYSTEM_20251105_143000.bak';
```

---

### 6️⃣ Reports & Analytics
| Procedure | Mục đích | Result Sets | Use Case |
|-----------|----------|-------------|----------|
| `sp_GetSystemOverview` | Tổng quan hệ thống | 1 table | Admin dashboard |
| `sp_GetStudentReport` | Báo cáo học sinh | 3 tables | Student profile |
| `sp_GetClassReport` | Báo cáo lớp học | 3 tables | Teacher dashboard |

**Ví dụ:**
```sql
-- Student report: basic info + enrollments + pending assignments
EXEC sp_GetStudentReport @student_id = 5;

-- Class report: class info + students + attendance stats
EXEC sp_GetClassReport @class_id = 1;
```

---

## 🔧 FUNCTIONS

| Function | Mục đích | Params | Return |
|----------|----------|---------|--------|
| `fn_GetAttendanceRate` | Tỷ lệ điểm danh | student_id, class_id | DECIMAL(5,2) % |
| `fn_GetAverageGrade` | Điểm trung bình | student_id, class_id | DECIMAL(5,2) |
| `fn_GetRevenue` | Doanh thu | year, month | DECIMAL(15,2) |
| `fn_CanSubmitAssignment` | Check quyền submit | assignment_id, student_id | BIT (0/1) |
| `fn_CalculateOverallGrade` | Điểm tổng kết | enrollment_id | DECIMAL(6,2) |

**Ví dụ:**
```sql
-- Tỷ lệ điểm danh
SELECT dbo.fn_GetAttendanceRate(5, NULL) AS attendance_rate;
-- Output: 85.50%

-- Doanh thu tháng 11/2025
SELECT dbo.fn_GetRevenue(2025, 11) AS revenue;
-- Output: 30,000,000

-- Điểm trung bình
SELECT 
    s.STUDENT_CODE,
    u.FULL_NAME,
    dbo.fn_GetAverageGrade(s.ID, NULL) AS avg_grade
FROM STUDENTS s
JOIN USERS u ON s.USER_ID = u.ID;
```

---

## ⚡ TRIGGERS

| Trigger | Bảng | Event | Action |
|---------|------|-------|--------|
| `trg_Users_UpdateTimestamp` | USERS | UPDATE | Auto set UPDATED_AT |
| `trg_Classes_ValidateCapacity` | CLASSES | UPDATE | Check CURRENT_STUDENTS ≤ CAPACITY |
| `trg_Assignments_CreateNotification` | ASSIGNMENTS | INSERT | Notify students |
| `trg_Submissions_GradeNotification` | SUBMISSIONS | UPDATE | Notify when graded |
| `trg_Users_LogDelete` | USERS | DELETE | Soft delete (STATUS=0) |
| `trg_Payments_ValidateAmount` | PAYMENTS | INSERT/UPDATE | Amount > 0 |
| `trg_Grades_CalculateOverall` | GRADES | INSERT/UPDATE | Auto calc overall grade |

**Đặc biệt:**
```sql
-- Soft Delete: DELETE chuyển thành UPDATE
DELETE FROM USERS WHERE ID = 10;
-- Thực tế: UPDATE USERS SET STATUS = 0 WHERE ID = 10

-- Auto Notification: Tạo assignment → tự động notify students
INSERT INTO ASSIGNMENTS (...)
-- Trigger tạo NOTIFICATIONS cho tất cả students trong class

-- Auto Overall Grade: Insert MIDTERM, FINAL → tự động tính OVERALL
INSERT INTO GRADES (GRADE_TYPE='MIDTERM', SCORE=80, WEIGHT=30);
INSERT INTO GRADES (GRADE_TYPE='FINAL', SCORE=90, WEIGHT=50);
-- Trigger insert OVERALL = 80*0.3 + 90*0.5 = 69
```

---

## 🎯 CÁC TÌNH HUỐNG SỬ DỤNG

### Tình huống 1: Admin đăng ký học sinh mới
```sql
-- Bước 1: Đăng ký student
EXEC sp_RegisterStudent ...;

-- Bước 2: Enroll vào lớp
EXEC sp_EnrollStudent @class_id = 1, @student_id = @new_student_id, ...;

-- Bước 3: Ghi nhận thanh toán
EXEC sp_ProcessPayment @enrollment_id = @new_enrollment_id, @amount = 1500000, ...;

-- Auto:
-- - CURRENT_STUDENTS tự động tăng
-- - PAYMENT_STATUS tự động update
-- - ACTIVITY_LOGS tự động ghi
```

### Tình huống 2: Teacher điểm danh và tạo assignment
```sql
-- Điểm danh
EXEC sp_BulkMarkAttendance @session_id = 1, @attendance_data = '[...]', ...;

-- Tạo assignment
INSERT INTO ASSIGNMENTS (CLASS_ID, TITLE, DUE_DATE, ...) VALUES (...);

-- Auto:
-- - Trigger tự động tạo NOTIFICATIONS cho students
```

### Tình huống 3: Teacher chấm điểm
```sql
-- Nhập điểm midterm, final
INSERT INTO GRADES (GRADE_TYPE='MIDTERM', SCORE=80, WEIGHT=30);
INSERT INTO GRADES (GRADE_TYPE='FINAL', SCORE=90, WEIGHT=50);

-- Auto:
-- - Trigger tự động tính OVERALL grade
-- - Trigger tự động notify student khi status = GRADED
```

### Tình huống 4: Admin backup database
```sql
-- Full backup hàng tuần
EXEC sp_BackupDatabase @backup_type = 'FULL';

-- Differential backup hàng ngày
EXEC sp_BackupDatabase @backup_type = 'DIFFERENTIAL';

-- Restore khi cần
EXEC sp_RestoreDatabase @backup_file = 'path/to/backup.bak';
```

---

## 💻 TÍCH HỢP VỚI BACKEND API

### Setup Connection (Node.js + mssql)
```typescript
// utils/database.ts
import sql from 'mssql';

const config = {
  user: 'sa',
  password: 'your_password',
  server: 'localhost',
  database: 'DMT_EDUCATION_SYSTEM',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

export async function callProcedure(name: string, params: any) {
  const pool = await sql.connect(config);
  const request = pool.request();
  
  // Add params
  Object.entries(params.input || {}).forEach(([key, value]) => {
    request.input(key, value);
  });
  
  Object.entries(params.output || {}).forEach(([key, type]) => {
    request.output(key, type);
  });
  
  return await request.execute(name);
}
```

### API Route Example
```typescript
// routes/students.ts
app.post('/students/register', async (req, reply) => {
  const result = await callProcedure('sp_RegisterStudent', {
    input: {
      email: req.body.email,
      password_hash: await bcrypt.hash(req.body.password, 10),
      full_name: req.body.full_name,
      // ... other fields
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

## 📊 DASHBOARD QUERIES

### Admin Dashboard
```sql
-- Tổng quan
EXEC sp_GetSystemOverview;

-- Doanh thu theo tháng
SELECT 
    MONTH_NUM AS month,
    dbo.fn_GetRevenue(2025, MONTH_NUM) AS revenue
FROM (VALUES (1),(2),(3),(4),(5),(6),(7),(8),(9),(10),(11),(12)) AS M(MONTH_NUM);
```

### Student Dashboard
```sql
-- Profile + stats
EXEC sp_GetStudentReport @student_id = 5;

-- Attendance rate
SELECT dbo.fn_GetAttendanceRate(5, NULL);

-- Average grade
SELECT dbo.fn_GetAverageGrade(5, NULL);
```

### Teacher Dashboard
```sql
-- Class overview
EXEC sp_GetClassReport @class_id = 1;

-- Pending grading
SELECT COUNT(*) FROM SUBMISSIONS 
WHERE ASSIGNMENT_ID IN (SELECT ID FROM ASSIGNMENTS WHERE CLASS_ID = 1)
AND STATUS = 'SUBMITTED';
```

---

## 🧪 TESTING

Chạy test scripts:
```bash
sqlcmd -S localhost -d DMT_EDUCATION_SYSTEM -i Backend/Test_StoredProcedures.sql
```

Test covers:
- User registration (student, teacher)
- Enrollment (success, duplicate, capacity)
- Payment (partial, full, overpayment)
- Attendance bulk marking
- Functions (attendance rate, revenue, etc.)
- Triggers (notifications, soft delete, auto-calculate)
- Reports (system, student, class)
- Drop enrollment

---

## 📝 LƯU Ý QUAN TRỌNG

### ⚠️ Security
1. **KHÔNG** pass plain password vào procedures - phải hash trước với bcrypt
2. **LUÔN** kiểm tra return code và error_message
3. **VALIDATE** tất cả input ở Backend trước khi gọi SP

### ⚠️ Performance
1. Stored procedures đã optimize với indexes
2. Sử dụng transactions cho data consistency
3. Bulk operations (attendance) tối ưu hơn loop

### ⚠️ Error Handling
```typescript
try {
  const result = await callProcedure(...);
  
  if (result.returnValue !== 0) {
    // Business logic error
    return reply.code(400).send({ error: result.output.error_message });
  }
  
  // Success
  return reply.send({ success: true, ... });
  
} catch (error) {
  // System error
  return reply.code(500).send({ error: error.message });
}
```

---

## 📚 TÀI LIỆU THAM KHẢO

- **Chi tiết procedures:** [STORED_PROCEDURES_GUIDE.md](./STORED_PROCEDURES_GUIDE.md)
- **Database schema:** [Db_DMT_SQLServer.sql](./Db_DMT_SQLServer.sql)
- **Test scripts:** [Test_StoredProcedures.sql](./Test_StoredProcedures.sql)
- **API documentation:** [README_API.md](./README_API.md)

---

## 🎓 CHO ĐỒ ÁN MÔN HỌC

### Các điểm nổi bật để trình bày:
1. **15+ Stored Procedures** với validation đầy đủ
2. **5 Functions** tính toán phức tạp (attendance rate, revenue, grades)
3. **7 Triggers** tự động xử lý (notifications, soft delete, auto-calculate)
4. **Backup/Restore** procedures với logging
5. **Reports** đa dạng (system, student, class)
6. **Transaction handling** đảm bảo data integrity
7. **Security** (soft delete, validation, activity logs)
8. **Performance** (indexes, bulk operations)

### Demo flow:
1. Tạo student → Show student_code auto-generate
2. Enroll vào class → Show CURRENT_STUDENTS auto-update
3. Thanh toán → Show PAYMENT_STATUS auto-change
4. Điểm danh → Show bulk insert/update
5. Tạo assignment → Show auto-notification
6. Chấm điểm → Show auto-calculate overall grade
7. Xem reports → Show sp_GetStudentReport, sp_GetClassReport
8. Backup → Show sp_BackupDatabase

---

**Version:** 1.0  
**Last Updated:** November 5, 2025  
**Author:** DMT Development Team  
**For:** Đồ án môn Hệ Quản Trị CSDL
