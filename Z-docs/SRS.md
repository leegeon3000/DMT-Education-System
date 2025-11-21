# SOFTWARE REQUIREMENT SPECIFICATION (SRS)
## HỆ THỐNG QUẢN LÝ GIÁO DỤC DMT

**Phiên bản:** 1.0  
**Ngày:** 05/11/2025  
**Loại dự án:** Đồ án môn học  
**Mục tiêu:** Xây dựng hệ thống quản lý trung tâm giáo dục với các tính năng cốt lõi

---

## MỤC LỤC

1. [Tổng quan hệ thống](#1-tổng-quan-hệ-thống)
2. [Kiến trúc hệ thống](#2-kiến-trúc-hệ-thống)
3. [Phân tích hiện trạng](#3-phân-tích-hiện-trạng)
4. [Roadmap thực hiện](#4-roadmap-thực-hiện)
5. [Chi tiết nhiệm vụ](#5-chi-tiết-nhiệm-vụ)

---

## 1. TỔNG QUAN HỆ THỐNG

### 1.1. Mục đích
Xây dựng hệ thống quản lý toàn diện cho trung tâm giáo dục DMT, hỗ trợ:
- Quản lý học viên, giáo viên, nhân viên
- Quản lý khóa học, lớp học, lịch học
- Quản lý bài tập, chấm điểm, điểm danh
- Quản lý tài chính, thanh toán
- Phân quyền và báo cáo

### 1.2. Phạm vi
- **Frontend:** React + TypeScript + Tailwind CSS
- **Backend:** Node.js + Fastify + TypeScript
- **Database:** SQL Server
- **Authentication:** JWT
- **File Storage:** Local storage (không dùng cloud)

### 1.3. Vai trò người dùng
1. **Admin:** Quản lý toàn hệ thống
2. **Staff:** Hỗ trợ học vụ, tài chính
3. **Teacher:** Giảng dạy, chấm điểm, điểm danh
4. **Student:** Học tập, nộp bài, xem điểm

---

## 2. KIẾN TRÚC HỆ THỐNG

### 2.1. Cấu trúc dự án hiện tại

```
dmt-edu-ui/
├── Backend/
│   ├── src/
│   │   ├── middleware/
│   │   │   └── auth.ts          # JWT authentication
│   │   ├── routes/
│   │   │   ├── auth.ts          # Login, register
│   │   │   ├── users.ts         # User management
│   │   │   ├── students.ts      # Student CRUD
│   │   │   ├── teachers.ts      # Teacher CRUD
│   │   │   ├── courses.ts       # Course management
│   │   │   └── classes.ts       # Class management
│   │   ├── utils/
│   │   │   ├── database.ts      # SQL Server connection
│   │   │   └── response.ts      # API response helpers
│   │   └── server.ts            # Main server
│   └── package.json
├── src/
│   ├── components/
│   │   ├── common/              # Shared components
│   │   ├── layout/              # Layouts by role
│   │   └── sections/            # Page sections
│   ├── features/
│   │   ├── admin/               # Admin features
│   │   ├── auth/                # Authentication
│   │   ├── students/            # Student features
│   │   └── teachers/            # Teacher features
│   ├── services/
│   │   ├── auth.ts              # Auth API calls
│   │   ├── admin.ts             # Admin APIs
│   │   ├── student.ts           # Student APIs
│   │   └── http.ts              # Axios instance
│   ├── routes/
│   │   └── index.tsx            # Route configuration
│   └── store/
│       └── slices/              # Redux slices
└── package.json
```

### 2.2. Database Schema (Đã có)

**28 bảng chính:**
- Core: ROLES, USERS, STUDENTS, TEACHERS, STAFF
- Academic: SUBJECTS, COURSES, CLASSES, CLASS_SESSIONS, ENROLLMENTS
- Attendance: ATTENDANCE
- Assignments: ASSIGNMENTS, SUBMISSIONS, GRADES
- Materials: MATERIALS
- Payments: PAYMENTS
- Surveys: SURVEYS, SURVEY_QUESTIONS, SURVEY_RESPONSES
- System: NEWS, NOTIFICATIONS, ACTIVITY_LOGS, SYSTEM_SETTINGS, BACKUP_HISTORY

### 2.3. Database Logic Layer (Stored Procedures, Functions, Triggers)

> 📚 **Mục đích:** Đóng gói business logic vào database layer, đảm bảo tính nhất quán dữ liệu, giảm roundtrip, và tự động hóa các tác vụ phức tạp.

#### 2.3.1. Stored Procedures (15+)

**User Management:**
- `sp_CreateUser` - Tạo user mới với validation email unique, role hợp lệ
- `sp_RegisterStudent` - Đăng ký học sinh với auto-generate student_code (HS2025001)
- `sp_RegisterTeacher` - Đăng ký giáo viên với auto-generate teacher_code (GV2025001)

**Enrollment Management:**
- `sp_EnrollStudent` - Đăng ký học sinh vào lớp, validate capacity, auto-update CURRENT_STUDENTS
- `sp_DropEnrollment` - Hủy đăng ký, auto-decrement CURRENT_STUDENTS

**Payment Processing:**
- `sp_ProcessPayment` - Ghi nhận thanh toán, auto-update PAID_AMOUNT và PAYMENT_STATUS
- `sp_RefundPayment` - Hoàn tiền, recalculate PAID_AMOUNT và STATUS

**Attendance:**
- `sp_BulkMarkAttendance` - Điểm danh hàng loạt qua JSON input, sử dụng MERGE operation

**Database Administration:**
- `sp_BackupDatabase` - Backup database (FULL/DIFFERENTIAL) với logging vào BACKUP_HISTORY
- `sp_RestoreDatabase` - Restore database từ backup file

**Reports & Analytics:**
- `sp_GetSystemOverview` - Tổng quan hệ thống (users count, revenue, active classes)
- `sp_GetStudentReport` - Báo cáo chi tiết học sinh (info + enrollments + pending assignments)
- `sp_GetClassReport` - Báo cáo lớp học (class info + students + attendance stats)

#### 2.3.2. Functions (5)

**Calculation Functions:**
- `fn_GetAttendanceRate` - Tính tỷ lệ điểm danh (%) của student trong class hoặc toàn bộ
  ```sql
  SELECT dbo.fn_GetAttendanceRate(@student_id, @class_id) -- Returns DECIMAL(5,2)
  ```

- `fn_GetAverageGrade` - Tính điểm trung bình của student
  ```sql
  SELECT dbo.fn_GetAverageGrade(@student_id, @class_id) -- Returns DECIMAL(5,2)
  ```

- `fn_GetRevenue` - Tính doanh thu theo tháng/năm
  ```sql
  SELECT dbo.fn_GetRevenue(2025, 11) -- Returns DECIMAL(15,2)
  ```

**Validation Functions:**
- `fn_CanSubmitAssignment` - Kiểm tra student có thể submit assignment (deadline check, enrollment check)
  ```sql
  SELECT dbo.fn_CanSubmitAssignment(@assignment_id, @student_id) -- Returns BIT (0/1)
  ```

- `fn_CalculateOverallGrade` - Tính điểm tổng kết theo trọng số (midterm, final, assignments)
  ```sql
  SELECT dbo.fn_CalculateOverallGrade(@enrollment_id) -- Returns DECIMAL(6,2)
  ```

#### 2.3.3. Triggers (7)

**Auto Update Triggers:**
- `trg_Users_UpdateTimestamp` - Tự động set UPDATED_AT khi UPDATE USERS
- `trg_Grades_CalculateOverall` - Tự động tính OVERALL grade khi insert/update MIDTERM/FINAL

**Validation Triggers:**
- `trg_Classes_ValidateCapacity` - Validate CURRENT_STUDENTS ≤ CAPACITY khi UPDATE CLASSES
- `trg_Payments_ValidateAmount` - Validate AMOUNT > 0 khi INSERT/UPDATE PAYMENTS

**Auto Notification Triggers:**
- `trg_Assignments_CreateNotification` - Tự động tạo NOTIFICATIONS cho students khi tạo assignment mới
- `trg_Submissions_GradeNotification` - Tự động notify student khi bài được chấm điểm

**Soft Delete Trigger:**
- `trg_Users_LogDelete` - Chuyển DELETE thành UPDATE STATUS = 0 (soft delete pattern)

#### 2.3.4. Lợi ích của Database Logic Layer

**Performance:** Giảm network roundtrips, thực thi nhanh hơn ở database layer  
**Data Integrity:** Enforce business rules ở database level, không phụ thuộc application code  
**Maintainability:** Centralize business logic, dễ maintain và update  
**Security:** Giảm SQL injection risk, validate data trước khi insert/update  
**Automation:** Triggers tự động xử lý notification, calculation, logging  
**Consistency:** Transaction handling đảm bảo ACID properties  

#### 2.3.5. Backend API Integration

```typescript
// Example: Call stored procedure từ Node.js
import sql from 'mssql';

async function registerStudent(data: StudentRegisterDTO) {
  const pool = await sql.connect(config);
  const result = await pool.request()
    .input('email', sql.VarChar(100), data.email)
    .input('password_hash', sql.VarChar(255), hashedPassword)
    .input('full_name', sql.NVarChar(100), data.fullName)
    .input('phone', sql.VarChar(20), data.phone)
    .input('address', sql.NVarChar(255), data.address)
    .input('birth_date', sql.Date, data.birthDate)
    .input('school_level', sql.VarChar(50), data.schoolLevel)
    .input('parent_name', sql.NVarChar(100), data.parentName)
    .input('parent_phone', sql.VarChar(20), data.parentPhone)
    .output('student_id', sql.Int)
    .output('student_code', sql.VarChar(50))
    .output('error_message', sql.NVarChar(500))
    .execute('sp_RegisterStudent');
    
  if (result.returnValue === 0) {
    return {
      success: true,
      studentId: result.output.student_id,
      studentCode: result.output.student_code
    };
  } else {
    throw new Error(result.output.error_message);
  }
}
```

#### 2.3.6. Tài liệu & Testing

📄 **Tài liệu chi tiết:**
- `/Backend/STORED_PROCEDURES_GUIDE.md` - Hướng dẫn đầy đủ mỗi procedure/function/trigger
- `/Backend/README_DATABASE_PROCEDURES.md` - Quick reference và demo flows

🧪 **Test Scripts:**
- `/Backend/Test_StoredProcedures.sql` - Comprehensive test suite cho tất cả procedures

📦 **Installation:**
```bash
# 1. Create schema
sqlcmd -S localhost -i Backend/Db_DMT_SQLServer.sql

# 2. Install procedures, functions, triggers
sqlcmd -S localhost -d DMT_EDUCATION_SYSTEM -i Backend/Db_DMT_StoredProcedures.sql

# 3. Run tests
sqlcmd -S localhost -d DMT_EDUCATION_SYSTEM -i Backend/Test_StoredProcedures.sql
```

---

## 3. PHÂN TÍCH HIỆN TRẠNG

### 3.1. Đã hoàn thành

#### 3.1.1. Database Layer
- [x] Database schema đầy đủ 28 bảng
- [x] 15+ Stored Procedures (sp_RegisterStudent, sp_EnrollStudent, sp_ProcessPayment, sp_BulkMarkAttendance, etc.)
- [x] 5 Calculation Functions (fn_GetAttendanceRate, fn_GetAverageGrade, fn_GetRevenue, etc.)
- [x] 7 Triggers (auto-update, validation, notification, soft-delete)
- [x] Backup/Restore procedures với logging

#### 3.1.2. Backend Layer
- [x] Backend basic auth (login, JWT)
- [x] Stored Procedures Integration:
  - [x] Auth routes (sp_RegisterStudent, sp_RegisterTeacher)
  - [x] Enrollments routes (sp_EnrollStudent, sp_DropEnrollment)
  - [x] Attendance routes (sp_BulkMarkAttendance, statistics)
  - [x] Payments routes (sp_ProcessPayment, sp_RefundPayment)
  - [x] Reports routes (sp_GetSystemOverview, sp_GetStudentReport, sp_GetClassReport)
- [x] executeProcedure() utility function với input/output parameters
- [x] Backend server running on http://localhost:3001

#### 3.1.3. Frontend Layer
- [x] Frontend routing by role (Admin, Teacher, Student, Staff)
- [x] UI components library
- [x] Layout cho Admin, Teacher, Student
- [x] **Giao diện 4 Roles đã có sẵn:**
  - **Admin Dashboard** (`/admin/dashboard`) - StatCards, Charts, Analytics
  - **Teacher Dashboard** (`/teacher/dashboard`) - Assignments, Grading, Reports
  - **Student Dashboard** (`/students/dashboard`) - Courses, Progress, Quick Links
  - ⚠️ **Staff** - Chưa có Dashboard riêng (chỉ có Support, Tasks, Tickets pages)
- [x] API Services Layer (`/src/services/dmtAPI.ts`):
  - enrollmentAPI (create, drop, getByStudent, getByClass, getAll)
  - attendanceAPI (bulkMark, getBySession, getStatistics)
  - paymentAPI (process, refund, getByEnrollment, getAll)
  - reportsAPI (getSystemOverview, getStudentReport, getClassReport, getRevenue)

### 3.2. ⚠️ Chưa hoàn thiện

#### 3.2.1. Frontend Integration Issues
- [ ] **Admin Dashboard đang dùng mock data** - Cần tích hợp:
  - `reportsAPI.getSystemOverview()` cho stats cards
  - `reportsAPI.getRevenue(year)` cho revenue chart
  - Recharts cho data visualization
  
- [ ] **Teacher Dashboard đang dùng mock data** - Cần tích hợp:
  - `reportsAPI.getClassReport(classId)` cho mỗi lớp
  - Real statistics: pending grading, upcoming deadlines
  - Attendance overview
  
- [ ] **Student Dashboard đang dùng mock data** - Cần tích hợp:
  - `reportsAPI.getStudentReport(studentId)` cho toàn bộ data
  - Display real enrollments, pending assignments
  - Show attendance rate và average grade
  
- [ ] **Staff Dashboard không tồn tại** - Cần tạo:
  - `/src/features/staff/pages/Dashboard.tsx`
  - StaffLayout component
  - Staff-specific statistics và tasks

#### 3.2.2. Missing UI Components
- [ ] Teacher Attendance Marking Interface:
  - Fetch enrollments với `enrollmentAPI.getByClass(classId)`
  - Checkbox list cho PRESENT/ABSENT/LATE/EXCUSED
  - Submit bulk attendance với `attendanceAPI.bulkMark()`
  
- [ ] Payment Management UI (Admin/Staff):
  - Form nhập payment details (enrollment_id, amount, method)
  - Call `paymentAPI.process()` để ghi nhận thanh toán
  - Payment history table với `paymentAPI.getAll()`
  - Payment status tracking (PENDING → PARTIAL → PAID)

#### 3.2.3. Backend API Gaps
- [ ] Backend routes cần migrate từ Supabase sang SQL Server:
  - students.ts, teachers.ts (đang có nhưng chưa dùng stored procedures)
  - classes.ts, courses.ts (cần update cho SQL Server)
  
- [ ] File Upload Infrastructure:
  - Assignments với file attachment
  - Materials upload/download
  - Multer configuration
  - File type validation

#### 3.2.4. Other Missing Features
- [ ] Chưa có forgot password
- [ ] Chưa có notifications thực tế (chỉ có triggers tạo notifications)
- [ ] Chưa có assignment submission UI
- [ ] Chưa có grade calculation UI

---

## 4. ROADMAP THỰC HIỆN

### 📅 GIAI ĐOẠN 1: TÍCH HỢP API VÀ DASHBOARDS (Tuần 1 - 7 ngày) ⭐ HIỆN TẠI

**Mục tiêu:** Kết nối các Dashboard hiện có với Backend APIs thông qua dmtAPI.ts

#### **TASK 1.1: Student Dashboard Integration** ⭐ ƯU TIÊN CAO NHẤT
- **Thời gian:** 0.5 - 1 ngày
- **Ưu tiên:** Cao nhất (dễ nhất, impact cao)
- **Phụ thuộc:** Không (API đã sẵn sàng)
- **File cần sửa:** `/src/features/students/pages/Dashboard.tsx`
- **Chi tiết:**
  - [ ] Import `reportsAPI` từ `/src/services/dmtAPI`
  - [ ] Gọi `reportsAPI.getStudentReport(studentId)` trong useEffect
  - [ ] Thay thế mock data bằng real data từ API response:
    - `student_info`: Hiển thị student code, full name, school level
    - `enrollments`: Map enrollments array ra course cards với progress bars
    - `pending_assignments`: Hiển thị danh sách assignments với due dates
  - [ ] Gọi `reportsAPI.getAttendanceRate(studentId)` hiển thị attendance %
  - [ ] Gọi `reportsAPI.getAverageGrade(studentId)` hiển thị điểm TB
  - [ ] Add loading state với Spinner component
  - [ ] Add error handling với error message display
  - [ ] Test với real student data từ database

**Expected Output:**
```typescript
// API Response Structure:
{
  student_info: {
    student_code: "HS2025001",
    full_name: "Nguyễn Văn A",
    total_enrollments: 3,
    active_enrollments: 2
  },
  enrollments: [
    { class_name: "Toán 10A", course_name: "Toán học", attendance_rate: 95.5 }
  ],
  pending_assignments: [
    { title: "Bài tập chương 3", due_date: "2025-11-10" }
  ]
}
```

---

#### **TASK 1.2: Admin Dashboard Integration** ⭐ QUAN TRỌNG NHẤT
- **Thời gian:** 1-2 ngày
- **Ưu tiên:** Cao (quan trọng cho demo)
- **Phụ thuộc:** Không
- **File cần sửa:** `/src/features/admin/pages/Dashboard.tsx`
- **Chi tiết:**

**Phase A: System Overview Stats (0.5 ngày)**
- [ ] Import `reportsAPI` từ dmtAPI.ts
- [ ] Gọi `reportsAPI.getSystemOverview()` trong useEffect
- [ ] Map response data vào StatCard components:
  - Total Students → `total_students`
  - Total Teachers → `total_teachers`
  - Active Classes → `active_classes`
  - Total Revenue → `total_revenue` (format tiền VNĐ)
- [ ] Add loading skeleton cho cards
- [ ] Handle errors gracefully

**Phase B: Revenue Chart (0.5 ngày)**
- [ ] Cài đặt Recharts: `npm install recharts`
- [ ] Gọi `reportsAPI.getRevenue(2025)` để lấy monthly revenue
- [ ] Replace BarChart component hiện tại với Recharts BarChart
- [ ] Map data: `[{month: 1, revenue: 50000000}, ...]`
- [ ] Format Y-axis với VNĐ (50M, 100M)
- [ ] Add tooltips hiển thị exact revenue
- [ ] Add color gradient cho bars

**Phase C: Additional Analytics (0.5 ngày)**
- [ ] Enrollment statistics chart (active vs completed vs dropped)
- [ ] Payment status overview (PAID, PARTIAL, PENDING counts)
- [ ] Recent activities table (fetch từ ACTIVITY_LOGS nếu có)
- [ ] Top performing classes (highest attendance rate)

**Expected Recharts Implementation:**
```typescript
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

<ResponsiveContainer width="100%" height={300}>
  <BarChart data={revenueData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip formatter={(value) => `${value.toLocaleString('vi-VN')} ₫`} />
    <Bar dataKey="revenue" fill="#6366f1" />
  </BarChart>
</ResponsiveContainer>
```

---

#### **TASK 1.3: Teacher Dashboard Integration**
- **Thời gian:** 1-2 ngày
- **Ưu tiên:** Trung bình-cao
- **Phụ thuộc:** Không
- **File cần sửa:** `/src/features/teachers/pages/Dashboard.tsx`
- **Chi tiết:**

**Phase A: Fetch Teacher's Classes (0.5 ngày)**
- [ ] Tạo API endpoint mới: `GET /api/classes/teacher/:teacherId`
- [ ] Hoặc dùng existing classes API với filter `?teacher_id=X`
- [ ] Fetch danh sách classes mà teacher đang dạy
- [ ] Display classes với class_code, course_name, student count

**Phase B: Class Reports (1 ngày)**
- [ ] Loop qua mỗi class, gọi `reportsAPI.getClassReport(classId)`
- [ ] Aggregate statistics:
  - Total students across all classes
  - Total assignments created
  - Pending grading count (submissions chưa chấm)
  - Average attendance rate across classes
- [ ] Display upcoming deadlines từ assignments
- [ ] Show recent submissions cần chấm

**Phase C: Attendance Overview (0.5 ngày)**
- [ ] Fetch attendance statistics cho tất cả classes
- [ ] Display attendance rate chart (Recharts Line/Area chart)
- [ ] Highlight classes với attendance thấp (< 80%)
- [ ] Quick link tới attendance marking page

**Expected Data Flow:**
```typescript
// 1. Fetch classes
const classes = await classAPI.getByTeacher(teacherId);

// 2. For each class, get report
const reports = await Promise.all(
  classes.map(c => reportsAPI.getClassReport(c.id))
);

// 3. Aggregate stats
const totalStudents = reports.reduce((sum, r) => sum + r.class_info.total_students, 0);
```

---

#### **TASK 1.4: Teacher Attendance Marking UI** ⭐ TÍNH NĂNG MỚI
- **Thời gian:** 1-2 ngày
- **Ưu tiên:** Cao (core feature)
- **Phụ thuộc:** Enrollment API
- **File mới:** `/src/features/teachers/components/AttendanceMarking.tsx`
- **Chi tiết:**

**Phase A: Session Selection (0.5 ngày)**
- [ ] Create component với route `/teacher/attendance`
- [ ] Dropdown chọn Class (từ classes teacher đang dạy)
- [ ] Dropdown chọn Session (từ CLASS_SESSIONS của class đó)
- [ ] Hiển thị session info: date, title, duration

**Phase B: Student List với Checkboxes (0.5 ngày)**
- [ ] Gọi `enrollmentAPI.getByClass(classId)` lấy students
- [ ] Render table với columns: STT, Student Code, Student Name, Status
- [ ] Radio buttons cho mỗi student: PRESENT / ABSENT / LATE / EXCUSED
- [ ] Notes textarea (optional) cho từng student
- [ ] Select All / Clear All buttons

**Phase C: Bulk Submit (0.5 ngày)**
- [ ] Prepare attendance_data array:
  ```typescript
  [
    { enrollment_id: 1, status: 'PRESENT', notes: '' },
    { enrollment_id: 2, status: 'ABSENT', notes: 'Sick leave' }
  ]
  ```
- [ ] Gọi `attendanceAPI.bulkMark({ session_id, marked_by, attendance_data })`
- [ ] Success message với total marked
- [ ] Redirect hoặc clear form cho session tiếp theo

**UI Mockup:**
```
┌─────────────────────────────────────────┐
│ Điểm danh - Lớp Toán 10A               │
│ Session: 05/11/2025 - Chương 3         │
├─────────────────────────────────────────┤
│ STT | Mã HS      | Họ tên        | Điểm danh        │
│  1  | HS2025001  | Nguyễn Văn A  | ● Có ○ Vắng ○ Muộn │
│  2  | HS2025002  | Trần Thị B    | ○ Có ● Vắng ○ Muộn │
├─────────────────────────────────────────┤
│ [Select All] [Clear] [Submit Attendance]│
└─────────────────────────────────────────┘
```

---

#### **TASK 1.5: Payment Management UI** ⭐ TÍNH NĂNG MỚI
- **Thời gian:** 1-2 ngày
- **Ưu tiên:** Trung bình
- **Phụ thuộc:** Payment API, Enrollment API
- **File mới:** `/src/features/admin/pages/PaymentProcessing.tsx`
- **Chi tiết:**

**Phase A: Payment Recording Form (0.5 ngày)**
- [ ] Create page tại `/admin/payments/new`
- [ ] Form fields:
  - Student search (autocomplete)
  - Enrollment dropdown (load enrollments của student)
  - Amount input (hiển thị total_fee, paid_amount, remaining)
  - Payment Method: CASH / BANK_TRANSFER / CREDIT_CARD / E_WALLET
  - Transaction ID (optional)
  - Notes (optional)
- [ ] Validation: amount > 0, amount <= remaining
- [ ] Submit → `paymentAPI.process(data)`

**Phase B: Payment History Table (0.5 ngày)**
- [ ] Display payments với pagination
- [ ] Filter by: payment_method, status, date range, student
- [ ] Columns: Date, Student, Class, Amount, Method, Status, Receipt
- [ ] Actions: View Details, Generate Receipt (PDF - future)
- [ ] Show enrollment payment status badge (PAID/PARTIAL/PENDING)

**Phase C: Payment Statistics (0.5 ngày)**
- [ ] Total revenue this month (từ reportsAPI.getRevenue)
- [ ] Pending payments count
- [ ] Chart: Revenue by payment method (Recharts PieChart)
- [ ] Recent transactions (last 10)

---

#### **TASK 1.6: Staff Dashboard Creation** ⚠️ TÙY CHỌN
- **Thời gian:** 1 ngày
- **Ưu tiên:** Thấp (có thể skip nếu thiếu thời gian)
- **Phụ thuộc:** Không
- **Files mới:** 
  - `/src/features/staff/pages/Dashboard.tsx`
  - `/src/components/layout/StaffLayout.tsx` (nếu chưa có)
- **Chi tiết:**
  - [ ] Tạo StaffLayout tương tự AdminLayout, TeacherLayout
  - [ ] Staff Dashboard hiển thị:
    - Pending support tickets count
    - Tasks assigned to staff
    - Recent student registrations (cần approve?)
    - Payment processing queue
  - [ ] Quick links: Tickets, Tasks, Students, Payments
  - [ ] Add route `/staff/dashboard` vào routes/index.tsx

---

### 📅 GIAI ĐOẠN 2: NỀN TẢNG (Tuần 2 - 7 ngày)

**Mục tiêu:** Xây dựng nền tảng vững chắc cho toàn bộ hệ thống

#### **TASK 1.1: Backend API Foundation** ⭐ CRITICAL
- **Thời gian:** 2-3 ngày
- **Ưu tiên:** Cao nhất
- **Phụ thuộc:** Không
- **Chi tiết:**
  - [ ] Fix và test tất cả API endpoints hiện có
  - [ ] Thêm API cho Attendance
  - [ ] Thêm API cho Assignments & Submissions
  - [ ] Thêm API cho Grades
  - [ ] Thêm API cho Materials
  - [ ] Thêm API cho Payments
  - [ ] Thêm API cho Notifications

#### **TASK 1.2: Role-Based Access Control**
- **Thời gian:** 1 ngày
- **Ưu tiên:** Cao
- **Phụ thuộc:** Task 1.1
- **Chi tiết:**
  - [ ] Backend middleware kiểm tra permissions
  - [ ] Frontend route guards
  - [ ] Hide/show UI elements theo role
  - [ ] Redirect unauthorized access

#### **TASK 1.3: Authentication Flow**
- **Thời gian:** 1-2 ngày
- **Ưu tiên:** Trung bình
- **Phụ thuộc:** Task 1.1
- **Chi tiết:**
  - [ ] Trang Forgot Password
  - [ ] API gửi reset token (mock email)
  - [ ] Trang Reset Password
  - [ ] Password validation (min 8 chars)
  - [ ] Session timeout
  - [ ] Remember me functionality

#### **TASK 1.4: File Upload Infrastructure**
- **Thời gian:** 1 ngày
- **Ưu tiên:** Cao
- **Phụ thuộc:** Task 1.1
- **Chi tiết:**
  - [ ] Setup multer cho file upload
  - [ ] Create /uploads directory structure
  - [ ] File type validation
  - [ ] File size limit (10MB)
  - [ ] Serve static files

---

### 📅 GIAI ĐOẠN 2: TÍNH NĂNG HỌC VỤ (Tuần 2 - 7 ngày)

**Mục tiêu:** Hoàn thiện các tính năng học vụ cốt lõi

#### **TASK 2.1: Attendance System**
- **Thời gian:** 1-2 ngày
- **Ưu tiên:** Cao
- **Phụ thuộc:** Task 1.1, 1.2
- **Chi tiết:**

**Backend:**
- [ ] GET /api/attendance/session/:sessionId - Lấy danh sách điểm danh
- [ ] POST /api/attendance/mark - Điểm danh (bulk)
- [ ] GET /api/attendance/student/:studentId - Lịch sử điểm danh
- [ ] GET /api/attendance/statistics/:classId - Thống kê

**Frontend:**
- [ ] Teacher: Trang điểm danh với checkbox list
- [ ] Teacher: Bulk mark present/absent
- [ ] Student: Xem lịch sử điểm danh
- [ ] Statistics: Present/Absent ratio chart
- [ ] Export to Excel

#### **TASK 2.2: Assignment & Grading System**
- **Thời gian:** 2-3 ngày
- **Ưu tiên:** Cao nhất
- **Phụ thuộc:** Task 1.1, 1.4
- **Chi tiết:**

**Backend:**
- [ ] POST /api/assignments - Tạo assignment
- [ ] PUT /api/assignments/:id - Sửa assignment
- [ ] DELETE /api/assignments/:id - Xóa assignment
- [ ] POST /api/submissions - Nộp bài (với file)
- [ ] PUT /api/submissions/:id - Sửa bài nộp
- [ ] POST /api/grades - Chấm điểm
- [ ] GET /api/assignments/class/:classId - Assignments của lớp
- [ ] GET /api/submissions/assignment/:assignmentId - Bài nộp

**Frontend Teacher:**
- [ ] Tạo assignment với file attachment
- [ ] Xem danh sách submissions
- [ ] Chấm điểm với comment
- [ ] Batch grading interface
- [ ] Download submitted files

**Frontend Student:**
- [ ] Xem assignments
- [ ] Submit assignment với file
- [ ] Xem điểm và feedback
- [ ] Resubmit before deadline

#### **TASK 2.3: Grade Book & Reports**
- **Thời gian:** 2 ngày
- **Ưu tiên:** Cao
- **Phụ thuộc:** Task 2.2
- **Chi tiết:**

**Backend:**
- [ ] GET /api/grades/student/:studentId - Tất cả điểm của student
- [ ] POST /api/grades/calculate/:enrollmentId - Tính điểm tổng kết
- [ ] GET /api/grades/transcript/:studentId - Generate transcript

**Frontend Teacher:**
- [ ] Nhập điểm midterm, final
- [ ] Cấu hình trọng số (midterm 30%, final 50%, assignment 20%)
- [ ] Tự động tính điểm tổng kết
- [ ] Grade distribution chart

**Frontend Student:**
- [ ] Xem bảng điểm chi tiết
- [ ] Export transcript PDF
- [ ] Grade statistics

#### **TASK 2.4: Materials Management**
- **Thời gian:** 1 ngày
- **Ưu tiên:** Trung bình
- **Phụ thuộc:** Task 1.4
- **Chi tiết:**

**Backend:**
- [ ] POST /api/materials - Upload material
- [ ] GET /api/materials/class/:classId - Tài liệu của lớp
- [ ] DELETE /api/materials/:id - Xóa tài liệu
- [ ] GET /api/materials/:id/download - Download file

**Frontend:**
- [ ] Teacher upload PDF, DOCX
- [ ] Organize by class/course
- [ ] Student download materials
- [ ] File type validation

---

### 📅 GIAI ĐOẠN 3: QUẢN LÝ & BÁO CÁO (Tuần 3 - 7 ngày)

**Mục tiêu:** Hoàn thiện quản lý tài chính, lịch học, thông báo

#### **TASK 3.1: Payment Management**
- **Thời gian:** 1-2 ngày
- **Ưu tiên:** Trung bình
- **Phụ thuộc:** Task 1.1
- **Chi tiết:**

**Backend:**
- [ ] POST /api/payments - Ghi nhận thanh toán
- [ ] GET /api/payments/student/:studentId - Lịch sử thanh toán
- [ ] GET /api/payments/enrollment/:enrollmentId - Payment của enrollment
- [ ] GET /api/payments/:id/receipt - Generate receipt PDF

**Frontend:**
- [ ] Admin/Staff ghi nhận thanh toán manual
- [ ] Student/Parent xem payment history
- [ ] Payment status tracking (Paid, Partial, Pending)
- [ ] Generate receipt PDF

#### **TASK 3.2: Class Schedule Display**
- **Thời gian:** 1 ngày
- **Ưu tiên:** Trung bình
- **Phụ thuộc:** Task 1.1
- **Chi tiết:**

**Frontend:**
- [ ] Calendar view với React Big Calendar
- [ ] Student xem schedule cá nhân
- [ ] Teacher xem teaching schedule
- [ ] Filter by week/month
- [ ] Export to iCal format

#### **TASK 3.3: Notification System**
- **Thời gian:** 1 ngày
- **Ưu tiên:** Thấp
- **Phụ thuộc:** Task 1.1, 2.2
- **Chi tiết:**

**Backend:**
- [ ] POST /api/notifications - Tạo notification
- [ ] GET /api/notifications/user/:userId - Lấy notifications
- [ ] PUT /api/notifications/:id/read - Mark as read
- [ ] Auto-create notification khi có assignment mới
- [ ] Auto-create notification khi được chấm điểm

**Frontend:**
- [ ] Notification bell icon với badge count
- [ ] Notification dropdown list
- [ ] Mark as read
- [ ] Notification types: info, success, warning

#### **TASK 3.4: Dashboard Analytics**
- **Thời gian:** 1-2 ngày
- **Ưu tiên:** Trung bình
- **Phụ thuộc:** Task 2.2, 2.3, 3.1
- **Chi tiết:**

**Student Dashboard:**
- [ ] Enrolled courses count
- [ ] Pending assignments count
- [ ] Average grade
- [ ] Attendance rate
- [ ] Recent notifications

**Teacher Dashboard:**
- [ ] Classes count
- [ ] Total students
- [ ] Pending grading count
- [ ] Recent submissions
- [ ] Attendance overview

**Admin Dashboard:**
- [ ] Total users by role
- [ ] Revenue chart (Recharts)
- [ ] Enrollment statistics
- [ ] Active classes count
- [ ] Payment status overview

---

### 📅 GIAI ĐOẠN 4: HOÀN THIỆN & POLISH (Tuần 4 - 7 ngày)

**Mục tiêu:** Hoàn thiện UI/UX, search/filter, testing

#### **TASK 4.1: Search & Filter**
- **Thời gian:** 1 ngày
- **Ưu tiên:** Thấp
- **Phụ thuộc:** Task 1.1
- **Chi tiết:**
- [ ] Search students by name
- [ ] Search teachers by name
- [ ] Filter classes by status
- [ ] Filter courses by subject
- [ ] Sort tables by column
- [ ] Pagination

#### **TASK 4.2: Data Integration**
- **Thời gian:** 2 ngày
- **Ưu tiên:** Cao
- **Phụ thuộc:** Tất cả tasks trước
- **Chi tiết:**
- [ ] Thay thế tất cả mock data bằng real API
- [ ] Connect Student Dashboard với APIs
- [ ] Connect Teacher pages với APIs
- [ ] Connect Admin pages với APIs
- [ ] Error handling cho tất cả API calls

#### **TASK 4.3: Testing & Bug Fixes**
- **Thời gian:** 2 ngày
- **Ưu tiên:** Cao
- **Chi tiết:**
- [ ] Test tất cả user flows
- [ ] Test permissions và role-based access
- [ ] Test file upload/download
- [ ] Test form validations
- [ ] Fix UI bugs
- [ ] Cross-browser testing
- [ ] Mobile responsive check

#### **TASK 4.4: Demo Preparation**
- **Thời gian:** 1-2 ngày
- **Ưu tiên:** Cao
- **Chi tiết:**
- [ ] Tạo sample data đầy đủ
- [ ] Chuẩn bị demo script
- [ ] Record demo video (optional)
- [ ] Viết README.md chi tiết
- [ ] Deploy test server (optional)

---

## 5. CHI TIẾT NHIỆM VỤ

### 5.1. TASK 1.1: Backend API Foundation

#### 5.1.1. Fix Existing APIs

**Users API** (`/Backend/src/routes/users.ts`)
```typescript
// Endpoints cần fix:
GET    /users              // List users with pagination
GET    /users/:id          // Get user by ID
POST   /users              // Create user
PUT    /users/:id          // Update user
DELETE /users/:id          // Delete user
```

**Students API** (`/Backend/src/routes/students.ts`)
```typescript
GET    /students                     // List students
GET    /students/:id                 // Get student details
POST   /students                     // Create student
PUT    /students/:id                 // Update student
DELETE /students/:id                 // Delete student
GET    /students/:id/enrollments     // Get enrollments
```

**Teachers API** (`/Backend/src/routes/teachers.ts`)
```typescript
GET    /teachers                     // List teachers
GET    /teachers/:id                 // Get teacher details
POST   /teachers                     // Create teacher
PUT    /teachers/:id                 // Update teacher
DELETE /teachers/:id                 // Delete teacher
GET    /teachers/:id/classes         // Get assigned classes
```

**Classes API** (`/Backend/src/routes/classes.ts`)
```typescript
GET    /classes                      // List classes
GET    /classes/:id                  // Get class details
POST   /classes                      // Create class
PUT    /classes/:id                  // Update class
DELETE /classes/:id                  // Delete class
GET    /classes/:id/students         // Get enrolled students
GET    /classes/:id/sessions         // Get class sessions
```

**Courses API** (`/Backend/src/routes/courses.ts`)
```typescript
GET    /courses                      // List courses
GET    /courses/:id                  // Get course details
POST   /courses                      // Create course
PUT    /courses/:id                  // Update course
DELETE /courses/:id                  // Delete course
```

#### 5.1.2. Create New APIs

**File: `/Backend/src/routes/attendance.ts`**
```typescript
import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { query } from '../utils/database';
import { authenticateToken, requireRole, ROLES } from '../middleware/auth';

export async function attendanceRoutes(app: FastifyInstance) {
  // Get attendance for a session
  app.get('/attendance/session/:sessionId', {
    preValidation: [authenticateToken]
  }, async (req: any, reply) => {
    const { sessionId } = req.params;
    
    const sql = `
      SELECT a.*, e.student_id, u.full_name as student_name
      FROM ATTENDANCE a
      JOIN ENROLLMENTS e ON a.enrollment_id = e.id
      JOIN STUDENTS s ON e.student_id = s.id
      JOIN USERS u ON s.user_id = u.id
      WHERE a.session_id = @p1
    `;
    
    const result = await query(sql, [sessionId]);
    return { success: true, data: result.rows };
  });

  // Mark attendance (bulk)
  app.post('/attendance/mark', {
    preValidation: [authenticateToken, requireRole([ROLES.TEACHER, ROLES.ADMIN])]
  }, async (req: any, reply) => {
    const { sessionId, attendances } = req.body;
    
    // attendances: [{ enrollmentId, status, notes }]
    const values = attendances.map((a: any) => 
      `(${sessionId}, ${a.enrollmentId}, '${a.status}', '${a.notes || ''}', ${req.user.sub})`
    ).join(',');
    
    const sql = `
      INSERT INTO ATTENDANCE (session_id, enrollment_id, status, notes, marked_by)
      VALUES ${values}
    `;
    
    await query(sql);
    return { success: true, message: 'Attendance marked successfully' };
  });

  // Get student attendance history
  app.get('/attendance/student/:studentId', {
    preValidation: [authenticateToken]
  }, async (req: any, reply) => {
    const { studentId } = req.params;
    
    const sql = `
      SELECT a.*, cs.session_date, cs.title as session_title, c.name as class_name
      FROM ATTENDANCE a
      JOIN ENROLLMENTS e ON a.enrollment_id = e.id
      JOIN CLASS_SESSIONS cs ON a.session_id = cs.id
      JOIN CLASSES c ON cs.class_id = c.id
      WHERE e.student_id = @p1
      ORDER BY cs.session_date DESC
    `;
    
    const result = await query(sql, [studentId]);
    return { success: true, data: result.rows };
  });

  // Get attendance statistics
  app.get('/attendance/statistics/:classId', {
    preValidation: [authenticateToken]
  }, async (req: any, reply) => {
    const { classId } = req.params;
    
    const sql = `
      SELECT 
        e.student_id,
        u.full_name as student_name,
        COUNT(CASE WHEN a.status = 'PRESENT' THEN 1 END) as present_count,
        COUNT(CASE WHEN a.status = 'ABSENT' THEN 1 END) as absent_count,
        COUNT(CASE WHEN a.status = 'LATE' THEN 1 END) as late_count,
        COUNT(*) as total_sessions
      FROM ENROLLMENTS e
      JOIN STUDENTS s ON e.student_id = s.id
      JOIN USERS u ON s.user_id = u.id
      LEFT JOIN ATTENDANCE a ON a.enrollment_id = e.id
      WHERE e.class_id = @p1
      GROUP BY e.student_id, u.full_name
    `;
    
    const result = await query(sql, [classId]);
    return { success: true, data: result.rows };
  });
}
```

**File: `/Backend/src/routes/assignments.ts`** - Tương tự cho Assignments, Submissions, Grades

**File: `/Backend/src/routes/materials.ts`** - Tương tự cho Materials

**File: `/Backend/src/routes/payments.ts`** - Tương tự cho Payments

**File: `/Backend/src/routes/notifications.ts`** - Tương tự cho Notifications

---

### 5.2. TASK 1.2: Role-Based Access Control

#### 5.2.1. Backend Middleware

**File: `/Backend/src/middleware/auth.ts`**
```typescript
// Already exists, ensure it's working properly
export async function authenticateToken(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    return reply.code(401).send({ error: 'Authentication required' });
  }
}

export function requireRole(allowedRoles: number[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    await authenticateToken(request, reply);
    
    if (!request.user?.role_id || !allowedRoles.includes(request.user.role_id)) {
      return reply.code(403).send({ error: 'Access denied' });
    }
  };
}
```

#### 5.2.2. Frontend Route Guards

**File: `/src/guards/RequireRole.tsx`**
```typescript
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Role } from '../types';

interface RequireRoleProps {
  allowedRoles: Role[];
  children: React.ReactNode;
}

export const RequireRole: React.FC<RequireRoleProps> = ({ allowedRoles, children }) => {
  const user = useSelector((state: RootState) => state.user);
  
  if (!user.isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
};
```

---

### 5.3. TASK 1.3: Authentication Flow

#### 5.3.1. Forgot Password Page

**File: `/src/features/auth/pages/ForgotPassword.tsx`**
```typescript
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../../../services/auth';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await authService.forgotPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center mb-4">Check Your Email</h2>
          <p className="text-gray-600 text-center mb-4">
            We've sent a password reset link to {email}
          </p>
          <Link to="/auth/login" className="text-primary-600 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter your email"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <Link to="/auth/login" className="text-primary-600 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
```

#### 5.3.2. Backend API for Password Reset

**Add to `/Backend/src/routes/auth.ts`**
```typescript
// Forgot password - send reset token
app.post('/auth/forgot-password', async (req, reply) => {
  const { email } = req.body;
  
  // Find user
  const userResult = await query('SELECT * FROM users WHERE email = @p1', [email]);
  if (userResult.rows.length === 0) {
    // Don't reveal if email exists
    return { success: true, message: 'If email exists, reset link sent' };
  }
  
  const user = userResult.rows[0];
  
  // Generate reset token (valid for 1 hour)
  const resetToken = await reply.jwtSign(
    { sub: user.id, type: 'reset' },
    { expiresIn: '1h' }
  );
  
  // In production: send email with reset link
  // For now: just log it
  console.log(`Reset link: http://localhost:5173/auth/reset-password?token=${resetToken}`);
  
  return { success: true, message: 'Reset link sent to email' };
});

// Reset password with token
app.post('/auth/reset-password', async (req, reply) => {
  const { token, newPassword } = req.body;
  
  try {
    const decoded = await app.jwt.verify(token);
    
    if (decoded.type !== 'reset') {
      return reply.code(400).send({ error: 'Invalid token type' });
    }
    
    // Validate password
    if (newPassword.length < 8) {
      return reply.code(400).send({ error: 'Password must be at least 8 characters' });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    await query(
      'UPDATE users SET password_hash = @p1 WHERE id = @p2',
      [hashedPassword, decoded.sub]
    );
    
    return { success: true, message: 'Password reset successfully' };
  } catch (err) {
    return reply.code(400).send({ error: 'Invalid or expired token' });
  }
});
```

---

### 5.4. TASK 1.4: File Upload Infrastructure

#### 5.4.1. Setup Multer

**File: `/Backend/src/utils/upload.ts`**
```typescript
import multer from '@fastify/multipart';
import path from 'path';
import fs from 'fs';

const uploadDir = path.join(process.cwd(), 'uploads');

// Create upload directories
['assignments', 'materials', 'avatars', 'receipts'].forEach(dir => {
  const fullPath = path.join(uploadDir, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

export const uploadConfig = {
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
};

export const allowedFileTypes = {
  documents: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'],
  images: ['.jpg', '.jpeg', '.png', '.gif'],
  all: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.jpg', '.jpeg', '.png']
};

export function isFileTypeAllowed(filename: string, allowedTypes: string[]): boolean {
  const ext = path.extname(filename).toLowerCase();
  return allowedTypes.includes(ext);
}
```

**Register in `/Backend/src/server.ts`**
```typescript
import multipart from '@fastify/multipart';

app.register(multipart, {
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  }
});

// Serve static files
app.register(require('@fastify/static'), {
  root: path.join(process.cwd(), 'uploads'),
  prefix: '/uploads/',
});
```

---

## 6. KIỂM THỬ & CHẤT LƯỢNG

### 6.1. Checklist Testing

#### Authentication
- [ ] Login với email/password đúng
- [ ] Login với email/password sai
- [ ] Logout
- [ ] Forgot password flow
- [ ] Reset password với token hợp lệ
- [ ] Reset password với token hết hạn
- [ ] Session timeout

#### Role-Based Access
- [ ] Admin access admin pages
- [ ] Teacher không access admin pages
- [ ] Student không access teacher pages
- [ ] Redirect khi unauthorized

#### CRUD Operations
- [ ] Create student/teacher/class/course
- [ ] Read (list & detail)
- [ ] Update
- [ ] Delete
- [ ] Form validation

#### File Operations
- [ ] Upload file (PDF, DOCX)
- [ ] Download file
- [ ] File type validation
- [ ] File size limit
- [ ] View uploaded files

#### Business Logic
- [ ] Attendance marking
- [ ] Assignment submission
- [ ] Grade calculation
- [ ] Payment recording
- [ ] Notification creation

---

## 7. TIÊU CHÍ ĐÁNH GIÁ ĐỒ ÁN

### 7.1. Chức năng (40%)
- Đăng nhập, phân quyền
- Quản lý users, students, teachers
- Quản lý classes, courses
- Điểm danh
- Assignment & grading
- Payment tracking
- Dashboard & reports

### 7.2. Giao diện (20%)
- UI đẹp, responsive
- UX flow mượt mà
- Không có lỗi hiển thị

### 7.3. Code Quality (20%)
- Code sạch, có structure
- Component reusable
- API design chuẩn RESTful
- Error handling tốt

### 7.4. Database (10%)
- Schema đầy đủ
- Relationships đúng
- Indexes hợp lý

### 7.5. Documentation (10%)
- README.md chi tiết
- API documentation
- Setup instructions
- Demo video (optional)

---

## 8. LƯU Ý QUAN TRỌNG

### 8.1. Điều KHÔNG cần làm (Out of scope)
- OAuth, Social login
- Two-Factor Authentication (2FA)
- Cloud storage (AWS S3)
- Real email/SMS service
- Payment gateway integration (VNPay, MoMo)
- Live chat với WebSocket
- Video streaming
- Progressive Web App (PWA)
- Mobile app
- Microservices architecture

### 8.2. Điều NÊN làm (Best practices)
- Sử dụng TypeScript
- Error handling đầy đủ
- Input validation
- SQL injection prevention
- Password hashing
- JWT for authentication
- Responsive UI
- Loading states
- Success/error messages

### 8.3. Tips Demo
1. **Chuẩn bị data mẫu đầy đủ:** 10 students, 5 teachers, 5 classes
2. **Demo theo flow:** Login → Dashboard → Key features
3. **Highlight unique features:** Real-time updates, beautiful UI
4. **Prepare for questions:** Explain architecture, tech choices
5. **Have backup:** Screenshots, video nếu live demo fail

---

## 9. TIMELINE CHI TIẾT

### Tuần 1: Foundation
- **Ngày 1-2:** Task 1.1 (Backend APIs)
- **Ngày 3:** Task 1.2 (RBAC)
- **Ngày 4-5:** Task 1.3 (Auth Flow)
- **Ngày 6:** Task 1.4 (File Upload)
- **Ngày 7:** Testing tuần 1

### Tuần 2: Core Features
- **Ngày 8-9:** Task 2.1 (Attendance)
- **Ngày 10-12:** Task 2.2 (Assignment)
- **Ngày 13-14:** Task 2.3 (Grades)

### Tuần 3: Management
- **Ngày 15-16:** Task 2.4 (Materials)
- **Ngày 17-18:** Task 3.1 (Payment)
- **Ngày 19:** Task 3.2 (Schedule)
- **Ngày 20:** Task 3.3 (Notifications)
- **Ngày 21:** Task 3.4 (Dashboard)

### Tuần 4: Polish & Demo
- **Ngày 22:** Task 4.1 (Search/Filter)
- **Ngày 23-24:** Task 4.2 (Data Integration)
- **Ngày 25-26:** Task 4.3 (Testing)
- **Ngày 27-28:** Task 4.4 (Demo Prep)

---

## 10. KẾT LUẬN

Với roadmap này, dự án sẽ có đủ các tính năng cốt lõi cho một hệ thống quản lý giáo dục hoàn chỉnh, phù hợp với yêu cầu đồ án môn học. Focus vào **chất lượng thay vì số lượng**, đảm bảo mọi tính năng đều hoạt động ổn định và có UI/UX tốt.

**Ưu tiên cao nhất:** Backend API Integration → RBAC → Assignment System

**Success metrics:**
- 100% core features working
- Zero critical bugs
- Clean, maintainable code
- Smooth demo presentation

Good luck! 🚀
