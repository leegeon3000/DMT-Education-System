# 📚 DMT EDUCATION SYSTEM - DATABASE DOCUMENTATION

## Mục Lục
- [Tổng Quan](#tổng-quan)
- [Cấu Trúc Database](#cấu-trúc-database)
- [Chi Tiết Các Bảng](#chi-tiết-các-bảng)
  - [1. Core - Quản Lý Người Dùng](#1-core---quản-lý-người-dùng)
  - [2. Quản Lý Học Vụ](#2-quản-lý-học-vụ)
  - [3. Đăng Ký & Điểm Danh](#3-đăng-ký--điểm-danh)
  - [4. Bài Tập & Điểm Số](#4-bài-tập--điểm-số)
  - [5. Tài Liệu Học Tập](#5-tài-liệu-học-tập)
  - [6. Thanh Toán](#6-thanh-toán)
  - [7. Khảo Sát & Đánh Giá](#7-khảo-sát--đánh-giá)
  - [8. Thông Báo & Hệ Thống](#8-thông-báo--hệ-thống)
- [Quan Hệ Giữa Các Bảng](#quan-hệ-giữa-các-bảng)
- [Indexes & Performance](#indexes--performance)

---

## 🎯 Tổng Quan

**Database:** DMT_EDUCATION_SYSTEM  
**Platform:** SQL Server  
**Purpose:** Quản lý toàn diện trung tâm giáo dục DMT

### Tính Năng Chính
- Quản lý người dùng (Admin, Staff, Teacher, Student)
- Quản lý học vụ (Môn học, Khóa học, Lớp học)
- Điểm danh & theo dõi học tập
- Bài tập, nộp bài & chấm điểm
- Quản lý tài chính & thanh toán
- Khảo sát & đánh giá
- Tin tức & thông báo
- Activity logs & backup

---

## 🗂️ Cấu Trúc Database

### Tổng Số Bảng: 28 bảng

```
📦 DMT_EDUCATION_SYSTEM
├── 👥 CORE (5 bảng)
│   ├── ROLES
│   ├── USERS
│   ├── STUDENTS
│   ├── TEACHERS
│   └── STAFF
├── 📚 ACADEMIC (6 bảng)
│   ├── SUBJECTS
│   ├── COURSES
│   ├── CLASSES
│   ├── CLASS_SESSIONS
│   ├── ENROLLMENTS
│   └── ATTENDANCE
├── 📝 ASSIGNMENTS (3 bảng)
│   ├── ASSIGNMENTS
│   ├── SUBMISSIONS
│   └── GRADES
├── 📂 MATERIALS (1 bảng)
│   └── MATERIALS
├── 💰 PAYMENTS (1 bảng)
│   └── PAYMENTS
├── 📊 SURVEYS (3 bảng)
│   ├── SURVEYS
│   ├── SURVEY_QUESTIONS
│   └── SURVEY_RESPONSES
└── 🔔 SYSTEM (5 bảng)
    ├── NEWS
    ├── NOTIFICATIONS
    ├── ACTIVITY_LOGS
    ├── SYSTEM_SETTINGS
    └── BACKUP_HISTORY
```

---

## 📖 Chi Tiết Các Bảng

## 1. CORE - Quản Lý Người Dùng

### 🎭 ROLES - Vai Trò Người Dùng

**Mục đích:** Quản lý các vai trò trong hệ thống

| Cột | Kiểu | Mô Tả | Ví Dụ |
|-----|------|-------|-------|
| ID | INT (PK) | ID duy nhất | 1, 2, 3 |
| CODE | VARCHAR(50) UNIQUE | Mã vai trò (dùng trong code) | ADMIN, TEACHER, STUDENT |
| NAME | NVARCHAR(100) | Tên hiển thị | Quản trị viên, Giáo viên |
| DESCRIPTION | NVARCHAR(MAX) | Mô tả chi tiết | Có toàn quyền quản lý |
| CREATED_AT | DATETIME2 | Ngày tạo | 2025-01-01 |

**Dữ liệu mẫu:**
- ID=1: ADMIN - Quản trị viên
- ID=2: STAFF - Nhân viên
- ID=3: TEACHER - Giáo viên
- ID=4: STUDENT - Học sinh

---

### 👤 USERS - Người Dùng

**Mục đích:** Quản lý thông tin tài khoản của tất cả người dùng

| Cột | Kiểu | Mô Tả | Ví Dụ |
|-----|------|-------|-------|
| ID | INT (PK) | ID duy nhất | 1, 2, 3 |
| ROLE_ID | INT (FK→ROLES) | Vai trò của user | 1=Admin, 3=Teacher |
| EMAIL | VARCHAR(255) UNIQUE | Email đăng nhập | admin@dmt.edu.vn |
| PASSWORD_HASH | VARCHAR(255) | Mật khẩu đã mã hóa | $2b$10$... |
| FULL_NAME | NVARCHAR(255) | Họ và tên đầy đủ | Nguyễn Văn A |
| PHONE | VARCHAR(20) | Số điện thoại | 0912345678 |
| ADDRESS | NVARCHAR(MAX) | Địa chỉ | 123 Nguyễn Huệ, Q1, TPHCM |
| BIRTH_DATE | DATE | Ngày sinh | 1990-05-15 |
| AVATAR_URL | VARCHAR(500) | URL ảnh đại diện | /uploads/avatar1.jpg |
| STATUS | BIT | Trạng thái hoạt động | 1=Active, 0=Inactive |
| LAST_LOGIN_AT | DATETIME2 | Lần đăng nhập cuối | 2025-11-04 08:30:00 |
| CREATED_AT | DATETIME2 | Ngày tạo tài khoản | 2025-01-01 |
| UPDATED_AT | DATETIME2 | Ngày cập nhật cuối | 2025-11-04 |

**Quan hệ:**
- FK: ROLE_ID → ROLES(ID)

**Chú ý:**
- Email phải unique (không trùng)
- Password_hash được mã hóa bằng bcrypt
- Status = 0 sẽ không cho phép đăng nhập

---

### 🎓 STUDENTS - Học Sinh

**Mục đích:** Lưu thông tin bổ sung cho học sinh

| Cột | Kiểu | Mô Tả | Ví Dụ |
|-----|------|-------|-------|
| ID | INT (PK) | ID duy nhất | 1, 2, 3 |
| USER_ID | INT UNIQUE (FK→USERS) | Liên kết với bảng USERS | 5 (user_id) |
| STUDENT_CODE | VARCHAR(50) UNIQUE | Mã số học sinh | HS2025001 |
| SCHOOL_LEVEL | VARCHAR(50) | Cấp học hiện tại | ELEMENTARY, MIDDLE_SCHOOL, HIGH_SCHOOL |
| PARENT_NAME | NVARCHAR(255) | Tên phụ huynh | Nguyễn Văn B |
| PARENT_PHONE | VARCHAR(20) | SĐT phụ huynh | 0987654321 |
| PARENT_EMAIL | VARCHAR(255) | Email phụ huynh | parent@gmail.com |
| CREATED_AT | DATETIME2 | Ngày tạo | 2025-01-01 |

**Quan hệ:**
- FK: USER_ID → USERS(ID) ON DELETE CASCADE

**Chú ý:**
- Mỗi STUDENT phải có 1 USER tương ứng
- Khi xóa USER, STUDENT tự động bị xóa (CASCADE)

---

### 👨‍🏫 TEACHERS - Giáo Viên

**Mục đích:** Lưu thông tin bổ sung cho giáo viên

| Cột | Kiểu | Mô Tả | Ví Dụ |
|-----|------|-------|-------|
| ID | INT (PK) | ID duy nhất | 1, 2, 3 |
| USER_ID | INT UNIQUE (FK→USERS) | Liên kết với USERS | 3 (user_id) |
| TEACHER_CODE | VARCHAR(50) UNIQUE | Mã số giáo viên | GV2025001 |
| MAIN_SUBJECT_ID | INT (FK→SUBJECTS) | Môn dạy chính | 1=Toán, 2=Anh |
| YEARS_EXPERIENCE | INT | Số năm kinh nghiệm | 5, 10, 15 |
| DEGREE | NVARCHAR(255) | Bằng cấp | Thạc sĩ Giáo dục |
| SPECIALIZATION | NVARCHAR(255) | Chuyên môn | Toán THPT, Anh IELTS |
| CREATED_AT | DATETIME2 | Ngày tạo | 2025-01-01 |

**Quan hệ:**
- FK: USER_ID → USERS(ID) ON DELETE CASCADE
- FK: MAIN_SUBJECT_ID → SUBJECTS(ID)

---

### 👔 STAFF - Nhân Viên

**Mục đích:** Quản lý nhân viên hành chính

| Cột | Kiểu | Mô Tả | Ví Dụ |
|-----|------|-------|-------|
| ID | INT (PK) | ID duy nhất | 1, 2, 3 |
| USER_ID | INT UNIQUE (FK→USERS) | Liên kết với USERS | 2 (user_id) |
| STAFF_CODE | VARCHAR(50) UNIQUE | Mã nhân viên | NV2025001 |
| DEPARTMENT | NVARCHAR(120) | Phòng ban | Học vụ, Kế toán |
| POSITION | NVARCHAR(120) | Chức vụ | Trưởng phòng, Nhân viên |
| CREATED_AT | DATETIME2 | Ngày tạo | 2025-01-01 |

**Quan hệ:**
- FK: USER_ID → USERS(ID) ON DELETE CASCADE

---

## 2. Quản Lý Học Vụ

### 📖 SUBJECTS - Môn Học

**Mục đích:** Danh mục các môn học

| Cột | Kiểu | Mô Tả | Ví Dụ |
|-----|------|-------|-------|
| ID | INT (PK) | ID duy nhất | 1, 2, 3 |
| NAME | NVARCHAR(120) | Tên môn học | Toán học, Tiếng Anh |
| CODE | VARCHAR(50) UNIQUE | Mã môn học | MATH, ENG, PHYS |
| DESCRIPTION | NVARCHAR(MAX) | Mô tả chi tiết | Toán học cơ bản đến nâng cao |
| IS_ACTIVE | BIT | Trạng thái hoạt động | 1=Active, 0=Inactive |
| CREATED_AT | DATETIME2 | Ngày tạo | 2025-01-01 |

**Ví dụ:**
- MATH - Toán học
- ENG - Tiếng Anh
- PHYS - Vật lý
- CHEM - Hóa học

---

### 📚 COURSES - Khóa Học

**Mục đích:** Quản lý các khóa học cụ thể

| Cột | Kiểu | Mô Tả | Ví Dụ |
|-----|------|-------|-------|
| ID | INT (PK) | ID duy nhất | 1, 2, 3 |
| SUBJECT_ID | INT (FK→SUBJECTS) | Môn học | 1=Toán |
| CODE | VARCHAR(50) UNIQUE | Mã khóa học | MATH-G10-2025 |
| NAME | NVARCHAR(255) | Tên khóa học | Toán lớp 10 nâng cao |
| DESCRIPTION | NVARCHAR(MAX) | Mô tả chi tiết | Chương trình toán... |
| DURATION_WEEKS | INT | Thời lượng (tuần) | 12, 24, 36 |
| TOTAL_SESSIONS | INT | Tổng số buổi học | 24, 48 |
| PRICE | DECIMAL(12,2) | Học phí | 3000000.00 |
| LEVEL | VARCHAR(20) | Cấp độ | BEGINNER, INTERMEDIATE, ADVANCED |
| IS_ACTIVE | BIT | Đang mở đăng ký | 1=Yes, 0=No |
| CREATED_AT | DATETIME2 | Ngày tạo | 2025-01-01 |

**Quan hệ:**
- FK: SUBJECT_ID → SUBJECTS(ID)

**Levels:**
- BEGINNER: Cơ bản
- INTERMEDIATE: Trung bình
- ADVANCED: Nâng cao

---

### 🏫 CLASSES - Lớp Học

**Mục đích:** Quản lý các lớp học cụ thể

| Cột | Kiểu | Mô Tả | Ví Dụ |
|-----|------|-------|-------|
| ID | INT (PK) | ID duy nhất | 1, 2, 3 |
| COURSE_ID | INT (FK→COURSES) | Khóa học | 1 |
| CODE | VARCHAR(50) UNIQUE | Mã lớp | MATH-G10-A1 |
| NAME | NVARCHAR(255) | Tên lớp | Toán 10A1 |
| TEACHER_ID | INT (FK→TEACHERS) | Giáo viên phụ trách | 1 |
| CAPACITY | INT | Sức chứa tối đa | 25, 30 |
| CURRENT_STUDENTS | INT | Số học sinh hiện tại | 20 |
| START_DATE | DATE | Ngày khai giảng | 2025-02-01 |
| END_DATE | DATE | Ngày kết thúc | 2025-05-30 |
| SCHEDULE_DAYS | VARCHAR(50) | Lịch học (ngày) | MONDAY,WEDNESDAY,FRIDAY |
| SCHEDULE_TIME | VARCHAR(20) | Lịch học (giờ) | 18:00-20:00 |
| CLASSROOM | NVARCHAR(100) | Phòng học | Phòng A101 |
| STATUS | VARCHAR(20) | Trạng thái lớp | PLANNING, ACTIVE, COMPLETED, CANCELLED |
| CREATED_AT | DATETIME2 | Ngày tạo | 2025-01-01 |

**Quan hệ:**
- FK: COURSE_ID → COURSES(ID)
- FK: TEACHER_ID → TEACHERS(ID)

**Status:**
- PLANNING: Đang lên kế hoạch
- ACTIVE: Đang hoạt động
- COMPLETED: Đã hoàn thành
- CANCELLED: Đã hủy

---

### 📅 CLASS_SESSIONS - Buổi Học

**Mục đích:** Quản lý từng buổi học trong lớp

| Cột | Kiểu | Mô Tả | Ví Dụ |
|-----|------|-------|-------|
| ID | INT (PK) | ID duy nhất | 1, 2, 3 |
| CLASS_ID | INT (FK→CLASSES) | Lớp học | 1 |
| SESSION_NUMBER | INT | Buổi số | 1, 2, 3... |
| TITLE | NVARCHAR(255) | Tiêu đề buổi học | Phương trình bậc 2 |
| SESSION_DATE | DATE | Ngày học | 2025-02-05 |
| START_TIME | TIME | Giờ bắt đầu | 18:00:00 |
| END_TIME | TIME | Giờ kết thúc | 20:00:00 |
| CONTENT | NVARCHAR(MAX) | Nội dung giảng dạy | Lý thuyết + bài tập |
| HOMEWORK | NVARCHAR(MAX) | Bài tập về nhà | Làm bài 1,2,3 trang 45 |
| STATUS | VARCHAR(20) | Trạng thái | SCHEDULED, COMPLETED, CANCELLED |
| CREATED_AT | DATETIME2 | Ngày tạo | 2025-01-01 |

**Quan hệ:**
- FK: CLASS_ID → CLASSES(ID) ON DELETE CASCADE

---

## 3. Đăng Ký & Điểm Danh

### ✍️ ENROLLMENTS - Đăng Ký Học

**Mục đích:** Quản lý việc học sinh đăng ký vào lớp

| Cột | Kiểu | Mô Tả | Ví Dụ |
|-----|------|-------|-------|
| ID | INT (PK) | ID duy nhất | 1, 2, 3 |
| CLASS_ID | INT (FK→CLASSES) | Lớp học | 1 |
| STUDENT_ID | INT (FK→STUDENTS) | Học sinh | 5 |
| ENROLLMENT_DATE | DATE | Ngày đăng ký | 2025-01-20 |
| STATUS | VARCHAR(20) | Trạng thái | ACTIVE, COMPLETED, DROPPED, SUSPENDED |
| PAYMENT_STATUS | VARCHAR(20) | Trạng thái thanh toán | PENDING, PAID, PARTIAL, OVERDUE |
| TOTAL_FEE | DECIMAL(12,2) | Tổng học phí | 3000000.00 |
| PAID_AMOUNT | DECIMAL(12,2) | Đã thanh toán | 1500000.00 |
| DISCOUNT_PERCENT | DECIMAL(5,2) | % Giảm giá | 10.00 |
| NOTES | NVARCHAR(MAX) | Ghi chú | Học bổng 10% |
| CREATED_AT | DATETIME2 | Ngày tạo | 2025-01-20 |

**Quan hệ:**
- FK: CLASS_ID → CLASSES(ID)
- FK: STUDENT_ID → STUDENTS(ID)

**Enrollment Status:**
- ACTIVE: Đang học
- COMPLETED: Hoàn thành
- DROPPED: Bỏ học
- SUSPENDED: Tạm ngưng

**Payment Status:**
- PENDING: Chưa thanh toán
- PAID: Đã thanh toán đủ
- PARTIAL: Thanh toán một phần
- OVERDUE: Quá hạn thanh toán

---

### ATTENDANCE - Điểm Danh

**Mục đích:** Ghi nhận điểm danh từng buổi học

| Cột | Kiểu | Mô Tả | Ví Dụ |
|-----|------|-------|-------|
| ID | INT (PK) | ID duy nhất | 1, 2, 3 |
| SESSION_ID | INT (FK→CLASS_SESSIONS) | Buổi học | 1 |
| ENROLLMENT_ID | INT (FK→ENROLLMENTS) | Đăng ký học | 5 |
| STATUS | VARCHAR(20) | Trạng thái | PRESENT, ABSENT, LATE, EXCUSED |
| CHECK_IN_TIME | DATETIME2 | Giờ check-in | 2025-02-05 18:05:00 |
| NOTES | NVARCHAR(MAX) | Ghi chú | Đến muộn 5 phút |
| MARKED_BY | INT (FK→USERS) | Người điểm danh | 3 (teacher_id) |
| CREATED_AT | DATETIME2 | Ngày tạo | 2025-02-05 |

**Quan hệ:**
- FK: SESSION_ID → CLASS_SESSIONS(ID)
- FK: ENROLLMENT_ID → ENROLLMENTS(ID)
- FK: MARKED_BY → USERS(ID)

**Attendance Status:**
- PRESENT: Có mặt
- ABSENT: Vắng mặt
- LATE: Đi muộn
- EXCUSED: Vắng có phép

---

## 4. Bài Tập & Điểm Số

### 📝 ASSIGNMENTS - Bài Tập

**Mục đích:** Quản lý bài tập cho lớp học

| Cột | Kiểu | Mô Tả | Ví Dụ |
|-----|------|-------|-------|
| ID | INT (PK) | ID duy nhất | 1, 2, 3 |
| CLASS_ID | INT (FK→CLASSES) | Lớp học | 1 |
| TITLE | NVARCHAR(255) | Tiêu đề bài tập | Bài tập chương 1 |
| DESCRIPTION | NVARCHAR(MAX) | Mô tả chi tiết | Làm các bài... |
| DUE_DATE | DATE | Hạn nộp | 2025-02-10 |
| MAX_SCORE | DECIMAL(6,2) | Điểm tối đa | 100.00 |
| ASSIGNMENT_TYPE | VARCHAR(30) | Loại bài tập | HOMEWORK, QUIZ, EXAM, PROJECT |
| CREATED_BY | INT (FK→USERS) | Người tạo | 3 (teacher_id) |
| CREATED_AT | DATETIME2 | Ngày tạo | 2025-02-03 |

**Quan hệ:**
- FK: CLASS_ID → CLASSES(ID)
- FK: CREATED_BY → USERS(ID)

**Assignment Types:**
- HOMEWORK: Bài tập về nhà
- QUIZ: Kiểm tra ngắn
- EXAM: Bài thi
- PROJECT: Đồ án

---

### 📤 SUBMISSIONS - Bài Nộp

**Mục đích:** Quản lý bài làm của học sinh

| Cột | Kiểu | Mô Tả | Ví Dụ |
|-----|------|-------|-------|
| ID | INT (PK) | ID duy nhất | 1, 2, 3 |
| ASSIGNMENT_ID | INT (FK→ASSIGNMENTS) | Bài tập | 1 |
| STUDENT_ID | INT (FK→STUDENTS) | Học sinh | 5 |
| SUBMISSION_DATE | DATETIME2 | Ngày nộp | 2025-02-09 20:30:00 |
| CONTENT | NVARCHAR(MAX) | Nội dung bài làm | Đáp án: 1. A, 2. B... |
| ATTACHMENT_URL | VARCHAR(500) | File đính kèm | /uploads/hw1_student5.pdf |
| SCORE | DECIMAL(6,2) | Điểm số | 85.50 |
| FEEDBACK | NVARCHAR(MAX) | Nhận xét của GV | Bài làm tốt, cần... |
| GRADED_BY | INT (FK→USERS) | Người chấm | 3 (teacher_id) |
| GRADED_AT | DATETIME2 | Ngày chấm | 2025-02-10 15:00:00 |
| STATUS | VARCHAR(20) | Trạng thái | SUBMITTED, GRADED, LATE, MISSING |
| CREATED_AT | DATETIME2 | Ngày tạo | 2025-02-09 |

**Quan hệ:**
- FK: ASSIGNMENT_ID → ASSIGNMENTS(ID)
- FK: STUDENT_ID → STUDENTS(ID)
- FK: GRADED_BY → USERS(ID)

**Submission Status:**
- SUBMITTED: Đã nộp
- GRADED: Đã chấm điểm
- LATE: Nộp muộn
- MISSING: Chưa nộp

---

### 🎯 GRADES - Điểm Số

**Mục đích:** Quản lý điểm số tổng hợp

| Cột | Kiểu | Mô Tả | Ví Dụ |
|-----|------|-------|-------|
| ID | INT (PK) | ID duy nhất | 1, 2, 3 |
| ENROLLMENT_ID | INT (FK→ENROLLMENTS) | Đăng ký học | 5 |
| GRADE_TYPE | VARCHAR(30) | Loại điểm | MIDTERM, FINAL, ASSIGNMENT, OVERALL |
| SCORE | DECIMAL(6,2) | Điểm số | 85.50 |
| MAX_SCORE | DECIMAL(6,2) | Điểm tối đa | 100.00 |
| WEIGHT | DECIMAL(5,2) | Trọng số (%) | 30.00 |
| NOTES | NVARCHAR(MAX) | Ghi chú | Điểm giữa kỳ |
| GRADED_BY | INT (FK→USERS) | Người chấm | 3 (teacher_id) |
| GRADED_AT | DATETIME2 | Ngày chấm | 2025-03-15 |
| CREATED_AT | DATETIME2 | Ngày tạo | 2025-03-15 |

**Quan hệ:**
- FK: ENROLLMENT_ID → ENROLLMENTS(ID)
- FK: GRADED_BY → USERS(ID)

**Grade Types:**
- MIDTERM: Điểm giữa kỳ
- FINAL: Điểm cuối kỳ
- ASSIGNMENT: Điểm bài tập
- OVERALL: Điểm tổng kết

**Ví dụ tính điểm:**
```
Điểm giữa kỳ: 80 (weight 30%)
Điểm cuối kỳ: 90 (weight 50%)
Điểm bài tập: 85 (weight 20%)
Overall = 80*0.3 + 90*0.5 + 85*0.2 = 86
```

---

## 5. Tài Liệu Học Tập

### 📂 MATERIALS - Tài Liệu

**Mục đích:** Quản lý tài liệu học tập

| Cột | Kiểu | Mô Tả | Ví Dụ |
|-----|------|-------|-------|
| ID | INT (PK) | ID duy nhất | 1, 2, 3 |
| CLASS_ID | INT (FK→CLASSES) | Lớp học | 1 |
| TITLE | NVARCHAR(255) | Tiêu đề tài liệu | Giáo trình chương 1 |
| DESCRIPTION | NVARCHAR(MAX) | Mô tả | Tài liệu lý thuyết... |
| FILE_URL | VARCHAR(500) | Đường dẫn file | /uploads/materials/ch1.pdf |
| FILE_TYPE | VARCHAR(50) | Loại file | PDF, DOCX, PPTX, VIDEO |
| FILE_SIZE | BIGINT | Kích thước (bytes) | 2048576 (2MB) |
| UPLOADED_BY | INT (FK→USERS) | Người tải lên | 3 (teacher_id) |
| IS_PUBLIC | BIT | Công khai | 1=Public, 0=Private |
| CREATED_AT | DATETIME2 | Ngày tạo | 2025-02-01 |

**Quan hệ:**
- FK: CLASS_ID → CLASSES(ID)
- FK: UPLOADED_BY → USERS(ID)

**File Types:**
- PDF: Tài liệu PDF
- DOCX: Word document
- PPTX: PowerPoint
- VIDEO: Video bài giảng
- MP4, AVI: Video formats

---

## 6. Thanh Toán

### 💰 PAYMENTS - Thanh Toán

**Mục đích:** Quản lý lịch sử thanh toán học phí

| Cột | Kiểu | Mô Tả | Ví Dụ |
|-----|------|-------|-------|
| ID | INT (PK) | ID duy nhất | 1, 2, 3 |
| ENROLLMENT_ID | INT (FK→ENROLLMENTS) | Đăng ký học | 5 |
| AMOUNT | DECIMAL(12,2) | Số tiền | 1500000.00 |
| PAYMENT_DATE | DATE | Ngày thanh toán | 2025-02-01 |
| PAYMENT_METHOD | VARCHAR(50) | Phương thức | CASH, BANK_TRANSFER, CARD, MOMO, VNPAY |
| TRANSACTION_ID | VARCHAR(255) | Mã giao dịch | TXN202502010001 |
| STATUS | VARCHAR(20) | Trạng thái | PENDING, COMPLETED, FAILED, REFUNDED |
| NOTES | NVARCHAR(MAX) | Ghi chú | Đợt 1/2 |
| PROCESSED_BY | INT (FK→USERS) | Người xử lý | 2 (staff_id) |
| CREATED_AT | DATETIME2 | Ngày tạo | 2025-02-01 |

**Quan hệ:**
- FK: ENROLLMENT_ID → ENROLLMENTS(ID)
- FK: PROCESSED_BY → USERS(ID)

**Payment Methods:**
- CASH: Tiền mặt
- BANK_TRANSFER: Chuyển khoản
- CARD: Thẻ tín dụng
- MOMO: Ví MoMo
- VNPAY: VNPay

**Payment Status:**
- PENDING: Đang xử lý
- COMPLETED: Thành công
- FAILED: Thất bại
- REFUNDED: Đã hoàn tiền

---

## 7. Khảo Sát & Đánh Giá

### 📊 SURVEYS - Khảo Sát

**Mục đích:** Tạo các khảo sát đánh giá

| Cột | Kiểu | Mô Tả | Ví Dụ |
|-----|------|-------|-------|
| ID | INT (PK) | ID duy nhất | 1, 2, 3 |
| TITLE | NVARCHAR(255) | Tiêu đề khảo sát | Đánh giá giảng viên |
| DESCRIPTION | NVARCHAR(MAX) | Mô tả | Khảo sát chất lượng... |
| TARGET_TYPE | VARCHAR(30) | Đối tượng | STUDENT, TEACHER, PARENT, ALL |
| CLASS_ID | INT (FK→CLASSES) | Lớp học cụ thể | 1 (nullable) |
| COURSE_ID | INT (FK→COURSES) | Khóa học cụ thể | 1 (nullable) |
| START_DATE | DATE | Ngày bắt đầu | 2025-03-01 |
| END_DATE | DATE | Ngày kết thúc | 2025-03-15 |
| IS_ACTIVE | BIT | Đang hoạt động | 1=Yes, 0=No |
| CREATED_BY | INT (FK→USERS) | Người tạo | 1 (admin_id) |
| CREATED_AT | DATETIME2 | Ngày tạo | 2025-02-25 |

**Quan hệ:**
- FK: CLASS_ID → CLASSES(ID)
- FK: COURSE_ID → COURSES(ID)
- FK: CREATED_BY → USERS(ID)

---

### ❓ SURVEY_QUESTIONS - Câu Hỏi Khảo Sát

**Mục đích:** Câu hỏi trong khảo sát

| Cột | Kiểu | Mô Tả | Ví Dụ |
|-----|------|-------|-------|
| ID | INT (PK) | ID duy nhất | 1, 2, 3 |
| SURVEY_ID | INT (FK→SURVEYS) | Khảo sát | 1 |
| QUESTION_TEXT | NVARCHAR(MAX) | Nội dung câu hỏi | Bạn hài lòng về giảng viên? |
| QUESTION_TYPE | VARCHAR(30) | Loại câu hỏi | MULTIPLE_CHOICE, TEXT, RATING, YES_NO |
| OPTIONS | NVARCHAR(MAX) | Các lựa chọn (JSON) | ["Rất hài lòng", "Hài lòng", "Bình thường"] |
| IS_REQUIRED | BIT | Bắt buộc trả lời | 1=Yes, 0=No |
| QUESTION_ORDER | INT | Thứ tự câu hỏi | 1, 2, 3 |
| CREATED_AT | DATETIME2 | Ngày tạo | 2025-02-25 |

**Quan hệ:**
- FK: SURVEY_ID → SURVEYS(ID) ON DELETE CASCADE

**Question Types:**
- MULTIPLE_CHOICE: Trắc nghiệm
- TEXT: Tự luận
- RATING: Đánh giá sao (1-5)
- YES_NO: Có/Không

---

### 💬 SURVEY_RESPONSES - Câu Trả Lời

**Mục đích:** Lưu câu trả lời khảo sát

| Cột | Kiểu | Mô Tả | Ví Dụ |
|-----|------|-------|-------|
| ID | INT (PK) | ID duy nhất | 1, 2, 3 |
| SURVEY_ID | INT (FK→SURVEYS) | Khảo sát | 1 |
| QUESTION_ID | INT (FK→SURVEY_QUESTIONS) | Câu hỏi | 1 |
| RESPONDENT_ID | INT (FK→USERS) | Người trả lời | 5 (student_id) |
| ANSWER_TEXT | NVARCHAR(MAX) | Câu trả lời text | Rất hài lòng |
| ANSWER_RATING | INT | Điểm đánh giá | 5 (1-5 stars) |
| SUBMITTED_AT | DATETIME2 | Ngày gửi | 2025-03-05 |

**Quan hệ:**
- FK: SURVEY_ID → SURVEYS(ID)
- FK: QUESTION_ID → SURVEY_QUESTIONS(ID)
- FK: RESPONDENT_ID → USERS(ID)

---

## 8. Thông Báo & Hệ Thống

### 📰 NEWS - Tin Tức

**Mục đích:** Quản lý tin tức, thông báo, sự kiện

| Cột | Kiểu | Mô Tả | Ví Dụ |
|-----|------|-------|-------|
| ID | INT (PK) | ID duy nhất | 1, 2, 3 |
| TITLE | NVARCHAR(255) | Tiêu đề | Khai giảng khóa mới |
| EXCERPT | NVARCHAR(500) | Tóm tắt ngắn | Trung tâm khai giảng... |
| CONTENT | NVARCHAR(MAX) | Nội dung chi tiết | Markdown/HTML content |
| IMAGE_URL | VARCHAR(500) | Ảnh đại diện | /images/news/news1.jpg |
| TYPE | VARCHAR(50) | Loại bài viết | NEWS, ANNOUNCEMENT, EVENT |
| STATUS | VARCHAR(20) | Trạng thái | DRAFT, PUBLISHED, ARCHIVED |
| IS_FEATURED | BIT | Nổi bật | 1=Featured, 0=Normal |
| AUTHOR_ID | INT (FK→USERS) | Tác giả | 1 (admin_id) |
| PUBLISHED_AT | DATETIME2 | Ngày xuất bản | 2025-11-04 08:00:00 |
| CREATED_AT | DATETIME2 | Ngày tạo | 2025-11-03 |
| UPDATED_AT | DATETIME2 | Ngày cập nhật | 2025-11-04 |

**Quan hệ:**
- FK: AUTHOR_ID → USERS(ID)

**Types:**
- NEWS: Tin tức
- ANNOUNCEMENT: Thông báo
- EVENT: Sự kiện

**Status:**
- DRAFT: Bản nháp
- PUBLISHED: Đã xuất bản
- ARCHIVED: Lưu trữ

---

### 🔔 NOTIFICATIONS - Thông Báo

**Mục đích:** Thông báo cá nhân cho từng user

| Cột | Kiểu | Mô Tả | Ví Dụ |
|-----|------|-------|-------|
| ID | INT (PK) | ID duy nhất | 1, 2, 3 |
| USER_ID | INT (FK→USERS) | Người nhận | 5 (student_id) |
| TITLE | NVARCHAR(255) | Tiêu đề | Nhắc nhở nộp bài tập |
| MESSAGE | NVARCHAR(MAX) | Nội dung | Bạn có 1 bài tập sắp đến hạn |
| TYPE | VARCHAR(50) | Loại thông báo | INFO, WARNING, SUCCESS, ERROR |
| IS_READ | BIT | Đã đọc | 1=Read, 0=Unread |
| LINK_URL | VARCHAR(500) | Link liên quan | /student/assignments/1 |
| CREATED_AT | DATETIME2 | Ngày tạo | 2025-11-04 |

**Quan hệ:**
- FK: USER_ID → USERS(ID) ON DELETE CASCADE

**Types:**
- INFO: Thông tin
- WARNING: Cảnh báo
- SUCCESS: Thành công
- ERROR: Lỗi

---

### 📝 ACTIVITY_LOGS - Nhật Ký Hoạt Động

**Mục đích:** Ghi lại mọi thao tác trong hệ thống

| Cột | Kiểu | Mô Tả | Ví Dụ |
|-----|------|-------|-------|
| ID | INT (PK) | ID duy nhất | 1, 2, 3 |
| USER_ID | INT (FK→USERS) | Người thực hiện | 5 |
| ACTION | VARCHAR(100) | Hành động | LOGIN, CREATE_ASSIGNMENT, UPDATE_GRADE |
| ENTITY_TYPE | VARCHAR(50) | Loại đối tượng | USER, CLASS, ASSIGNMENT |
| ENTITY_ID | INT | ID đối tượng | 1 |
| DETAILS | NVARCHAR(MAX) | Chi tiết (JSON) | {"old_value": 80, "new_value": 85} |
| IP_ADDRESS | VARCHAR(45) | IP address | 192.168.1.100 |
| USER_AGENT | NVARCHAR(500) | Trình duyệt | Mozilla/5.0... |
| CREATED_AT | DATETIME2 | Ngày thực hiện | 2025-11-04 |

**Quan hệ:**
- FK: USER_ID → USERS(ID)

**Ví dụ Actions:**
- LOGIN, LOGOUT
- CREATE_USER, UPDATE_USER, DELETE_USER
- CREATE_CLASS, UPDATE_CLASS
- SUBMIT_ASSIGNMENT
- MARK_ATTENDANCE

---

### ⚙️ SYSTEM_SETTINGS - Cài Đặt Hệ Thống

**Mục đích:** Lưu các cài đặt tổng quát

| Cột | Kiểu | Mô Tả | Ví Dụ |
|-----|------|-------|-------|
| ID | INT (PK) | ID duy nhất | 1, 2, 3 |
| SETTING_KEY | VARCHAR(100) UNIQUE | Key cài đặt | SCHOOL_NAME, EMAIL_SMTP_HOST |
| SETTING_VALUE | NVARCHAR(MAX) | Giá trị | Trung tâm DMT |
| DESCRIPTION | NVARCHAR(500) | Mô tả | Tên trung tâm hiển thị |
| UPDATED_AT | DATETIME2 | Ngày cập nhật | 2025-11-04 |

**Ví dụ Settings:**
```
SCHOOL_NAME: "Trung tâm Giáo dục DMT"
SCHOOL_PHONE: "0912345678"
SCHOOL_EMAIL: "contact@dmt.edu.vn"
SCHOOL_ADDRESS: "123 Nguyễn Huệ, Q1, TPHCM"
EMAIL_SMTP_HOST: "smtp.gmail.com"
PAYMENT_METHODS: "CASH,BANK_TRANSFER,MOMO"
```

---

### 💾 BACKUP_HISTORY - Lịch Sử Backup

**Mục đích:** Theo dõi lịch sử sao lưu database

| Cột | Kiểu | Mô Tả | Ví Dụ |
|-----|------|-------|-------|
| ID | INT (PK) | ID duy nhất | 1, 2, 3 |
| BACKUP_NAME | VARCHAR(255) | Tên file backup | DMT_20251104_0800.bak |
| BACKUP_PATH | VARCHAR(500) | Đường dẫn lưu | C:\Backups\DMT_20251104.bak |
| BACKUP_SIZE | BIGINT | Kích thước (bytes) | 104857600 (100MB) |
| BACKUP_TYPE | VARCHAR(20) | Loại backup | FULL, INCREMENTAL |
| STATUS | VARCHAR(20) | Trạng thái | IN_PROGRESS, COMPLETED, FAILED |
| STARTED_AT | DATETIME2 | Giờ bắt đầu | 2025-11-04 08:00:00 |
| COMPLETED_AT | DATETIME2 | Giờ hoàn thành | 2025-11-04 08:15:00 |

**Backup Types:**
- FULL: Sao lưu toàn bộ
- INCREMENTAL: Sao lưu phần thay đổi

---

## 🔗 Quan Hệ Giữa Các Bảng

### Sơ Đồ Quan Hệ Chính

```
ROLES (1) ──→ (N) USERS
                  ├──→ (1) STUDENTS
                  ├──→ (1) TEACHERS
                  └──→ (1) STAFF

SUBJECTS (1) ──→ (N) COURSES ──→ (N) CLASSES
                                      ├──→ (N) CLASS_SESSIONS
                                      ├──→ (N) ENROLLMENTS
                                      ├──→ (N) ASSIGNMENTS
                                      └──→ (N) MATERIALS

TEACHERS (1) ──→ (N) CLASSES

CLASSES (1) ──→ (N) ENROLLMENTS ──→ (N) ATTENDANCE
                                 └──→ (N) PAYMENTS

STUDENTS (1) ──→ (N) ENROLLMENTS
             └──→ (N) SUBMISSIONS

ASSIGNMENTS (1) ──→ (N) SUBMISSIONS

ENROLLMENTS (1) ──→ (N) GRADES

SURVEYS (1) ──→ (N) SURVEY_QUESTIONS ──→ (N) SURVEY_RESPONSES

USERS (1) ──→ (N) NEWS
          └──→ (N) NOTIFICATIONS
```

### Foreign Key Constraints

**Cascade Deletes (Xóa tự động):**
- Xóa USER → Xóa STUDENT/TEACHER/STAFF
- Xóa CLASS → Xóa CLASS_SESSIONS
- Xóa SURVEY → Xóa SURVEY_QUESTIONS
- Xóa USER → Xóa NOTIFICATIONS

**Restrict Deletes (Không cho xóa nếu còn dữ liệu liên quan):**
- Không xóa COURSE nếu còn CLASSES
- Không xóa CLASS nếu còn ENROLLMENTS
- Không xóa TEACHER nếu đang dạy CLASSES

---

## ⚡ Indexes & Performance

### Indexes Đã Tạo

**Users & Authentication:**
```sql
IX_USERS_EMAIL          -- Tìm kiếm nhanh theo email
IX_USERS_ROLE_ID        -- Filter theo role
IX_USERS_STATUS         -- Filter theo trạng thái
```

**Academic:**
```sql
IX_COURSES_SUBJECT_ID   -- Join với SUBJECTS
IX_COURSES_IS_ACTIVE    -- Lọc khóa học đang mở
IX_CLASSES_COURSE_ID    -- Join với COURSES
IX_CLASSES_TEACHER_ID   -- Tìm lớp theo giáo viên
IX_CLASSES_STATUS       -- Lọc lớp theo trạng thái
```

**Enrollments & Attendance:**
```sql
IX_ENROLLMENTS_CLASS_ID    -- Tìm học sinh trong lớp
IX_ENROLLMENTS_STUDENT_ID  -- Tìm lớp của học sinh
IX_ENROLLMENTS_STATUS      -- Lọc theo trạng thái
IX_ATTENDANCE_SESSION_ID   -- Điểm danh theo buổi
```

**News & Notifications:**
```sql
IX_NEWS_TYPE           -- Lọc theo loại (news/announcement)
IX_NEWS_STATUS         -- Lọc bài đã publish
IX_NEWS_IS_FEATURED    -- Tìm bài nổi bật
IX_NEWS_PUBLISHED_AT   -- Sắp xếp theo ngày
IX_NOTIFICATIONS_USER_ID    -- Thông báo của user
IX_NOTIFICATIONS_IS_READ    -- Thông báo chưa đọc
```

### Query Optimization Tips

**1. Lấy tin tức trang chủ:**
```sql
SELECT TOP 6 * FROM NEWS
WHERE STATUS = 'PUBLISHED' AND TYPE = 'NEWS'
ORDER BY PUBLISHED_AT DESC;
-- Index: IX_NEWS_STATUS, IX_NEWS_TYPE, IX_NEWS_PUBLISHED_AT
```

**2. Lấy danh sách học sinh trong lớp:**
```sql
SELECT s.*, u.FULL_NAME
FROM ENROLLMENTS e
JOIN STUDENTS s ON e.STUDENT_ID = s.ID
JOIN USERS u ON s.USER_ID = u.ID
WHERE e.CLASS_ID = 1 AND e.STATUS = 'ACTIVE';
-- Index: IX_ENROLLMENTS_CLASS_ID, IX_ENROLLMENTS_STATUS
```

**3. Điểm danh buổi học:**
```sql
SELECT a.*, u.FULL_NAME
FROM ATTENDANCE a
JOIN ENROLLMENTS e ON a.ENROLLMENT_ID = e.ID
JOIN STUDENTS s ON e.STUDENT_ID = s.ID
JOIN USERS u ON s.USER_ID = u.ID
WHERE a.SESSION_ID = 1;
-- Index: IX_ATTENDANCE_SESSION_ID
```

---

## 📌 Lưu Ý Quan Trọng

### Best Practices

1. **Luôn sử dụng Transactions khi:**
   - Tạo User + Student/Teacher/Staff (2 bảng)
   - Tạo Payment + Update Enrollment (2 bảng)
   - Tạo Class + Class_Sessions (2 bảng)

2. **Validate dữ liệu:**
   - Email phải unique
   - Status/Type phải đúng enum
   - Dates hợp lý (end_date > start_date)

3. **Security:**
   - KHÔNG lưu password plain text
   - Sử dụng bcrypt hash (PASSWORD_HASH)
   - Log mọi thao tác quan trọng (ACTIVITY_LOGS)

4. **Performance:**
   - Sử dụng indexes đã tạo
   - Tránh SELECT * (chỉ lấy cột cần thiết)
   - Pagination cho danh sách lớn

### ⚠️ Common Pitfalls

1. **Không xóa trực tiếp:**
   - Thay vì DELETE USER → Set STATUS = 0
   - Thay vì DELETE NEWS → Set STATUS = 'ARCHIVED'

2. **Kiểm tra capacity:**
   - Không cho CURRENT_STUDENTS > CAPACITY
   - Check trước khi thêm ENROLLMENT

3. **Payment validation:**
   - PAID_AMOUNT không được > TOTAL_FEE
   - Cập nhật PAYMENT_STATUS khi thêm PAYMENT

---

## Use Cases Phổ Biến

### 1. Đăng Ký Học Sinh Mới
```sql
BEGIN TRANSACTION;

-- 1. Tạo USER
INSERT INTO USERS (ROLE_ID, EMAIL, PASSWORD_HASH, FULL_NAME, ...)
VALUES (4, 'student@gmail.com', '$2b$10...', N'Nguyễn Văn A', ...);

DECLARE @user_id INT = SCOPE_IDENTITY();

-- 2. Tạo STUDENT
INSERT INTO STUDENTS (USER_ID, STUDENT_CODE, SCHOOL_LEVEL, ...)
VALUES (@user_id, 'HS2025001', 'HIGH_SCHOOL', ...);

COMMIT;
```

### 2. Đăng Ký Lớp Học
```sql
BEGIN TRANSACTION;

-- 1. Tạo ENROLLMENT
INSERT INTO ENROLLMENTS (CLASS_ID, STUDENT_ID, TOTAL_FEE, ...)
VALUES (1, 5, 3000000, ...);

-- 2. Tăng CURRENT_STUDENTS
UPDATE CLASSES SET CURRENT_STUDENTS = CURRENT_STUDENTS + 1
WHERE ID = 1;

COMMIT;
```

### 3. Thanh Toán Học Phí
```sql
BEGIN TRANSACTION;

-- 1. Tạo PAYMENT
INSERT INTO PAYMENTS (ENROLLMENT_ID, AMOUNT, PAYMENT_METHOD, ...)
VALUES (1, 1500000, 'BANK_TRANSFER', ...);

-- 2. Cập nhật ENROLLMENT
UPDATE ENROLLMENTS 
SET PAID_AMOUNT = PAID_AMOUNT + 1500000,
    PAYMENT_STATUS = CASE 
        WHEN PAID_AMOUNT + 1500000 >= TOTAL_FEE THEN 'PAID'
        ELSE 'PARTIAL'
    END
WHERE ID = 1;

COMMIT;
```

### 4. Xuất Bản Tin Tức
```sql
UPDATE NEWS 
SET STATUS = 'PUBLISHED',
    PUBLISHED_AT = GETDATE()
WHERE ID = 1;
```

### 5. Lấy Thông Báo Chưa Đọc
```sql
SELECT * FROM NOTIFICATIONS
WHERE USER_ID = 5 AND IS_READ = 0
ORDER BY CREATED_AT DESC;
```

---

## 📚 Tài Liệu Tham Khảo

- **Backend API:** `/Backend/README_API.md`
- **SQL Server Setup:** `/Backend/SQLSERVER_SETUP.md`
- **Database Schema:** `/Backend/Db_DMT_SQLServer.sql`
- **Migration Scripts:** `/Backend/scripts/`

---

**Version:** 1.0  
**Last Updated:** November 4, 2025  
**Author:** DMT Development Team
