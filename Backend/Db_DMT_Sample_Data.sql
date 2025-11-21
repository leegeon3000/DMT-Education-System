-- =================================================================
-- DMT EDUCATION SYSTEM - SAMPLE DATA
-- =================================================================
--
-- FILE NÀY CHỨA DỮ LIỆU MẪU ĐỂ TEST HỆ THỐNG
-- =================================================================
-- HƯỚNG DẪN:
-- 1. Đảm bảo đã chạy Db_DMT_SQLServer.sql trước
-- 2. Chạy file này để import dữ liệu mẫu
-- =================================================================

USE DMT_EDUCATION_SYSTEM;
GO

-- =================================================================
-- XÓA DỮ LIỆU CŨ (NẾU CÓ) - TRÁNH CONFLICT
-- =================================================================

PRINT 'Deleting old sample data (if exists)...';

-- Xóa theo thứ tự ngược để tránh foreign key constraint
IF OBJECT_ID('SURVEY_RESPONSES', 'U') IS NOT NULL DELETE FROM SURVEY_RESPONSES;
IF OBJECT_ID('SURVEY_QUESTIONS', 'U') IS NOT NULL DELETE FROM SURVEY_QUESTIONS;
IF OBJECT_ID('SURVEYS', 'U') IS NOT NULL DELETE FROM SURVEYS;
IF OBJECT_ID('NOTIFICATIONS', 'U') IS NOT NULL DELETE FROM NOTIFICATIONS;
IF OBJECT_ID('NEWS', 'U') IS NOT NULL DELETE FROM NEWS;
IF OBJECT_ID('PAYMENTS', 'U') IS NOT NULL DELETE FROM PAYMENTS;
IF OBJECT_ID('GRADES', 'U') IS NOT NULL DELETE FROM GRADES;
IF OBJECT_ID('SUBMISSIONS', 'U') IS NOT NULL DELETE FROM SUBMISSIONS;
IF OBJECT_ID('ASSIGNMENTS', 'U') IS NOT NULL DELETE FROM ASSIGNMENTS;
IF OBJECT_ID('ATTENDANCE', 'U') IS NOT NULL DELETE FROM ATTENDANCE;
IF OBJECT_ID('ENROLLMENTS', 'U') IS NOT NULL DELETE FROM ENROLLMENTS;
IF OBJECT_ID('CLASS_SESSIONS', 'U') IS NOT NULL DELETE FROM CLASS_SESSIONS;
IF OBJECT_ID('MATERIALS', 'U') IS NOT NULL DELETE FROM MATERIALS;
IF OBJECT_ID('CLASSES', 'U') IS NOT NULL DELETE FROM CLASSES;
IF OBJECT_ID('COURSES', 'U') IS NOT NULL DELETE FROM COURSES;
IF OBJECT_ID('SUBJECTS', 'U') IS NOT NULL DELETE FROM SUBJECTS;
IF OBJECT_ID('STAFF', 'U') IS NOT NULL DELETE FROM STAFF;
IF OBJECT_ID('TEACHERS', 'U') IS NOT NULL DELETE FROM TEACHERS;
IF OBJECT_ID('STUDENTS', 'U') IS NOT NULL DELETE FROM STUDENTS;
IF OBJECT_ID('USERS', 'U') IS NOT NULL DELETE FROM USERS;
-- Không xóa ROLES vì đây là dữ liệu cơ bản của hệ thống

PRINT 'Old data deleted successfully.';

GO

-- =================================================================
-- 1. USERS - TẠO TẠI KHOẢN MẪU
-- =================================================================

-- MẬT KHẨU THẬT - ĐÃ HASH BẰNG BCRYPT
-- Hash by: Backend/scripts/generate-all-passwords.mjs
-- Password format: Role@123 (Admin@123, Teacher@123, Student@123, Staff@123)

SET IDENTITY_INSERT USERS ON;

INSERT INTO USERS (ID, ROLE_ID, EMAIL, PASSWORD_HASH, FULL_NAME, PHONE, ADDRESS, BIRTH_DATE, AVATAR_URL, STATUS) VALUES
(1, 1, 'admin@dmt.edu.vn', '$2a$10$2cmTPF1fZsIHv0ACWjHvV.ANP451eU4eBXu9euwPdBoXziLgVZ4Em', N'Admin', '0901234567', N'123 Nguyễn Huệ, Quận 1, TP.HCM', '1985-01-15', '/images/avatar-admin.jpg', 1),
(2, 2, 'staff1@dmt.edu.vn', '$2a$10$mJRSTg127El59S1YY5pyvO4XMOtyJjTMUylp9hgiFyqXuJZcSD2IK', N'Trần Thị Bích Hằng', '0902345678', N'456 Lê Lợi, Quận 1, TP.HCM', '1988-03-20', '/images/avatar-staff1.jpg', 1),
(3, 2, 'staff2@dmt.edu.vn', '$2a$10$/B0BLiP69olcdjhDzf/Hd.bKFMFvyVVH.Uj3E4rbgDmKmo99JLsAi', N'Phạm Văn Minh', '0903456789', N'789 Hai Bà Trưng, Quận 3, TP.HCM', '1990-07-10', '/images/avatar-staff2.jpg', 1),
(4, 3, 'teacher.math@dmt.edu.vn', '$2a$10$.IM3F8KoK5wh2Tbe6nMEdO0NCbcZ1i86L81qh/2MbHAklPYCV.kx6', N'Lê Văn Toán', '0904567890', N'321 Võ Văn Tần, Quận 3, TP.HCM', '1982-05-15', '/images/ẢNH-GV/DMT-25-2.jpg', 1),
(5, 3, 'teacher.english@dmt.edu.vn', '$2a$10$a.0hHClyx2yJqNHwvCZZoen43XmojuIsIZvNWxrVWAlBSDWGuCbD.', N'Nguyễn Thị Anh', '0905678901', N'654 Điện Biên Phủ, Quận Bình Thạnh, TP.HCM', '1987-08-22', '/images/ẢNH-GV/DMT-25-4.jpg', 1),
(6, 3, 'teacher.physics@dmt.edu.vn', '$2a$10$ule6z/eQk.gy.b4d1ZbfO.9rb6/wsu3sE0zZVZRvoVdApoveZiNwa', N'Trần Văn Lý', '0906789012', N'987 Cách Mạng Tháng 8, Quận 10, TP.HCM', '1984-12-05', '/images/ẢNH-GV/DMT-25-6.jpg', 1),
(7, 3, 'teacher.chemistry@dmt.edu.vn', '$2a$10$WY/gXamlfl9y9ZoZAcDRJ.X8aW.CkjXBssdEXvJUxSUpATbzMrzaW', N'Phạm Thị Hóa', '0907890123', N'147 Lý Thường Kiệt, Quận 10, TP.HCM', '1986-04-18', '/images/ẢNH-GV/DMT-25-14.jpg', 1),
(8, 3, 'teacher.literature@dmt.edu.vn', '$2a$10$sOJKppC06u7DCVDQR36FlOJLbnLn..BFws6JMjJl0W4Cyt5RqXNS6', N'Hoàng Văn Văn', '0908901234', N'258 Nguyễn Thị Minh Khai, Quận 3, TP.HCM', '1983-09-30', '/images/ẢNH-GV/DMT-25-15.jpg', 1),
(9, 4, 'student001@gmail.com', '$2a$10$LVsyPaSyan663sys6LOvnenphbS43vf69Gc7869.XnUMzaA1x9BNy', N'Nguyễn Văn An', '0909012345', N'123 Lê Văn Sỹ, Quận 3, TP.HCM', '2010-01-10', '/images/ẢNH-HỌC-SINH/DMT-25-23.jpg', 1),
(10, 4, 'student002@gmail.com', '$2a$10$3YJqWvc4bJBRs7Kc2WeaI.BuL8ELufPxl/1HCgwrme9Wewup.9Oby', N'Trần Thị Bình', '0910123456', N'456 Hoàng Văn Thụ, Quận Phú Nhuận, TP.HCM', '2009-05-20', '/images/ẢNH-HỌC-SINH/DMT-25-24.jpg', 1),
(11, 4, 'student003@gmail.com', '$2a$10$oYOJQnHP4qWGWer5XbAyXOrkvHWaProbP.GIj7mVh2UpfkMobQ5P2', N'Lê Văn Cường', '0911234567', N'789 Phan Đăng Lưu, Quận Bình Thạnh, TP.HCM', '2010-03-15', '/images/ẢNH-HỌC-SINH/DMT-25-25.jpg', 1),
(12, 4, 'student004@gmail.com', '$2a$10$VRl/bfKf0hHdmBNcIRQyu.nnzpFI9sqhk3NPj1Sfss99Awo9gCEwK', N'Phạm Thị Dung', '0912345678', N'321 Bạch Đằng, Quận Bình Thạnh, TP.HCM', '2009-11-25', '/images/ẢNH-HỌC-SINH/DMT-25-26.jpg', 1),
(13, 4, 'student005@gmail.com', '$2a$10$OANobeNE0pa3su8syCyZRux43gSjZ5zkUpE0HWBZHE8.qrNn44IuG', N'Hoàng Văn Em', '0913456789', N'654 Xô Viết Nghệ Tĩnh, Quận Bình Thạnh, TP.HCM', '2010-07-08', '/images/ẢNH-HỌC-SINH/DMT-25-27.jpg', 1),
(14, 4, 'student006@gmail.com', '$2a$10$2VYPbZ7blboJL4vBtR2OR.OSVWFhapAlv740l74AIUNShKaFB/IRe', N'Võ Thị Phương', '0914567890', N'987 Trường Chinh, Quận Tân Bình, TP.HCM', '2009-09-12', '/images/ẢNH-HỌC-SINH/DMT-25-28.jpg', 1),
(15, 4, 'student007@gmail.com', '$2a$10$20cbYgn0IJ0o10QRhu73qejnmbWWR3D1Ef5/wICu5ZpcVw9mKbU0e', N'Đỗ Văn Giang', '0915678901', N'147 Cộng Hòa, Quận Tân Bình, TP.HCM', '2010-02-28', '/images/ẢNH-HỌC-SINH/DMT-25-29.jpg', 1),
(16, 4, 'student008@gmail.com', '$2a$10$Sjd.sN.gdFhVlj3ncVorPuuKYr.Ws5FQau1H81qzs5VkPXKEcfQUe', N'Mai Thị Hồng', '0916789012', N'258 Hoàng Hoa Thám, Quận Tân Bình, TP.HCM', '2009-06-14', '/images/ẢNH-HỌC-SINH/DMT-25-30.jpg', 1),
(17, 4, 'student009@gmail.com', '$2a$10$9p4IkP1iIh0a5By6srOnO.maudXDOR.09ZToilwgiiaJ9cMHojnyO', N'Bùi Văn Inh', '0917890123', N'369 Lạc Long Quân, Quận 11, TP.HCM', '2010-04-05', '/images/ẢNH-HỌC-SINH/DMT-25-31.jpg', 1),
(18, 4, 'student010@gmail.com', '$2a$10$pUV4SRzevPwVBiyNtIeMkup1vFJkU4Pi1SnZbd6eC0QVCoHjl/Q..', N'Phan Thị Kim', '0918901234', N'741 Lý Thái Tổ, Quận 10, TP.HCM', '2009-12-18', '/images/ẢNH-HỌC-SINH/DMT-25-32.jpg', 1);

SET IDENTITY_INSERT USERS OFF;

-- =================================================================
-- 2. STUDENTS - THÔNG TIN HỌC SINH
-- =================================================================

SET IDENTITY_INSERT STUDENTS ON;

INSERT INTO STUDENTS (ID, USER_ID, STUDENT_CODE, SCHOOL_LEVEL, PARENT_NAME, PARENT_PHONE, PARENT_EMAIL) VALUES
(1, 9, 'HS2025001', 'HIGH_SCHOOL', N'Nguyễn Văn Phụ Huynh A', '0901111111', 'parent001@gmail.com'),
(2, 10, 'HS2025002', 'HIGH_SCHOOL', N'Trần Thị Phụ Huynh B', '0902222222', 'parent002@gmail.com'),
(3, 11, 'HS2025003', 'HIGH_SCHOOL', N'Lê Văn Phụ Huynh C', '0903333333', 'parent003@gmail.com'),
(4, 12, 'HS2025004', 'HIGH_SCHOOL', N'Phạm Thị Phụ Huynh D', '0904444444', 'parent004@gmail.com'),
(5, 13, 'HS2025005', 'HIGH_SCHOOL', N'Hoàng Văn Phụ Huynh E', '0905555555', 'parent005@gmail.com'),
(6, 14, 'HS2025006', 'HIGH_SCHOOL', N'Võ Thị Phụ Huynh F', '0906666666', 'parent006@gmail.com'),
(7, 15, 'HS2025007', 'HIGH_SCHOOL', N'Đỗ Văn Phụ Huynh G', '0907777777', 'parent007@gmail.com'),
(8, 16, 'HS2025008', 'HIGH_SCHOOL', N'Mai Thị Phụ Huynh H', '0908888888', 'parent008@gmail.com'),
(9, 17, 'HS2025009', 'MIDDLE_SCHOOL', N'Bùi Văn Phụ Huynh I', '0909999999', 'parent009@gmail.com'),
(10, 18, 'HS2025010', 'MIDDLE_SCHOOL', N'Phan Thị Phụ Huynh K', '0900000000', 'parent010@gmail.com');

SET IDENTITY_INSERT STUDENTS OFF;

-- =================================================================
-- 3. SUBJECTS - MÔN HỌC
-- =================================================================

SET IDENTITY_INSERT SUBJECTS ON;

INSERT INTO SUBJECTS (ID, NAME, CODE, DESCRIPTION, IS_ACTIVE) VALUES
(1, N'Toán học', 'MATH', N'Toán học từ cơ bản đến nâng cao', 1),
(2, N'Tiếng Anh', 'ENGLISH', N'Tiếng Anh giao tiếp và luyện thi', 1),
(3, N'Vật lý', 'PHYSICS', N'Vật lý THCS và THPT', 1),
(4, N'Hóa học', 'CHEMISTRY', N'Hóa học THCS và THPT', 1),
(5, N'Ngữ văn', 'LITERATURE', N'Ngữ văn và kỹ năng viết', 1),
(6, N'Tin học', 'COMPUTER', N'Tin học văn phòng và lập trình', 1);

SET IDENTITY_INSERT SUBJECTS OFF;

-- =================================================================
-- 4. TEACHERS - THÔNG TIN GIÁO VIÊN
-- =================================================================

SET IDENTITY_INSERT TEACHERS ON;

INSERT INTO TEACHERS (ID, USER_ID, TEACHER_CODE, MAIN_SUBJECT_ID, YEARS_EXPERIENCE, DEGREE, SPECIALIZATION) VALUES
(1, 4, 'GV2025001', 1, 12, N'Thạc sĩ Toán học', N'Toán THPT, Luyện thi Đại học'),
(2, 5, 'GV2025002', 2, 8, N'Cử nhân Ngôn ngữ Anh', N'IELTS, TOEFL, Tiếng Anh giao tiếp'),
(3, 6, 'GV2025003', 3, 10, N'Thạc sĩ Vật lý', N'Vật lý THPT, Luyện thi Đại học'),
(4, 7, 'GV2025004', 4, 9, N'Cử nhân Hóa học', N'Hóa học THPT, Luyện thi Đại học'),
(5, 8, 'GV2025005', 5, 11, N'Thạc sĩ Văn học', N'Ngữ văn THPT, Kỹ năng viết');

SET IDENTITY_INSERT TEACHERS OFF;

-- =================================================================
-- 5. STAFF - NHÂN VIÊN
-- =================================================================

SET IDENTITY_INSERT STAFF ON;

INSERT INTO STAFF (ID, USER_ID, STAFF_CODE, DEPARTMENT, POSITION) VALUES
(1, 2, 'NV2025001', N'Phòng Học vụ', N'Trưởng phòng'),
(2, 3, 'NV2025002', N'Phòng Kế toán', N'Nhân viên');

SET IDENTITY_INSERT STAFF OFF;

-- =================================================================
-- 6. COURSES - KHÓA HỌC
-- =================================================================

SET IDENTITY_INSERT COURSES ON;

INSERT INTO COURSES (ID, SUBJECT_ID, CODE, NAME, DESCRIPTION, DURATION_WEEKS, TOTAL_SESSIONS, PRICE, LEVEL, IS_ACTIVE) VALUES
(1, 1, 'MATH-G10-2025', N'Toán 10 Nâng cao', N'Chương trình Toán lớp 10 nâng cao, bồi dưỡng học sinh giỏi', 24, 48, 3000000.00, 'ADVANCED', 1),
(2, 1, 'MATH-G11-2025', N'Toán 11 Cơ bản', N'Chương trình Toán lớp 11 cơ bản', 24, 48, 2800000.00, 'BEGINNER', 1),
(3, 2, 'ENG-IELTS-2025', N'Luyện thi IELTS 6.5+', N'Khóa học luyện thi IELTS mục tiêu 6.5 - 7.5', 12, 36, 4500000.00, 'INTERMEDIATE', 1),
(4, 2, 'ENG-BASIC-2025', N'Tiếng Anh Giao tiếp Cơ bản', N'Khóa học Tiếng Anh giao tiếp cho người mới bắt đầu', 16, 32, 2500000.00, 'BEGINNER', 1),
(5, 3, 'PHYS-G10-2025', N'Vật lý 10', N'Chương trình Vật lý lớp 10', 24, 48, 2900000.00, 'BEGINNER', 1),
(6, 4, 'CHEM-G10-2025', N'Hóa học 10', N'Chương trình Hóa học lớp 10', 24, 48, 2900000.00, 'BEGINNER', 1);

SET IDENTITY_INSERT COURSES OFF;

-- =================================================================
-- 7. CLASSES - LỚP HỌC
-- =================================================================

SET IDENTITY_INSERT CLASSES ON;

INSERT INTO CLASSES (ID, COURSE_ID, CODE, NAME, TEACHER_ID, CAPACITY, CURRENT_STUDENTS, START_DATE, END_DATE, SCHEDULE_DAYS, SCHEDULE_TIME, CLASSROOM, STATUS) VALUES
(1, 1, 'MATH10-A1', N'Toán 10A1', 1, 25, 8, '2025-02-01', '2025-07-30', 'MONDAY,WEDNESDAY,FRIDAY', '18:00-20:00', N'Phòng A101', 'ACTIVE'),
(2, 1, 'MATH10-A2', N'Toán 10A2', 1, 25, 0, '2025-03-01', '2025-08-30', 'TUESDAY,THURSDAY,SATURDAY', '18:00-20:00', N'Phòng A102', 'PLANNING'),
(3, 3, 'IELTS-B1', N'IELTS B1', 2, 20, 2, '2025-02-15', '2025-05-15', 'MONDAY,WEDNESDAY,FRIDAY', '19:00-21:00', N'Phòng B201', 'ACTIVE'),
(4, 4, 'ENG-BASIC-C1', N'Anh Giao Tiếp C1', 2, 20, 0, '2025-03-10', '2025-07-10', 'TUESDAY,THURSDAY', '18:30-20:30', N'Phòng B202', 'PLANNING'),
(5, 5, 'PHYS10-D1', N'Vật lý 10D1', 3, 25, 0, '2025-02-20', '2025-08-20', 'MONDAY,THURSDAY', '18:00-20:00', N'Phòng C301', 'PLANNING');

SET IDENTITY_INSERT CLASSES OFF;

-- =================================================================
-- 8. CLASS_SESSIONS - BUỔI HỌC (Cho lớp MATH10-A1)
-- =================================================================

SET IDENTITY_INSERT CLASS_SESSIONS ON;

INSERT INTO CLASS_SESSIONS (ID, CLASS_ID, SESSION_NUMBER, TITLE, SESSION_DATE, START_TIME, END_TIME, CONTENT, HOMEWORK, STATUS) VALUES
(1, 1, 1, N'Ôn tập kiến thức lớp 9', '2025-02-03', '18:00', '20:00', N'Ôn tập phương trình bậc 2, hệ phương trình', N'Làm bài tập 1-10 trang 5', 'COMPLETED'),
(2, 1, 2, N'Mệnh đề và tập hợp', '2025-02-05', '18:00', '20:00', N'Mệnh đề, mệnh đề phủ định, mệnh đề kéo theo', N'Làm bài tập 11-20 trang 12', 'COMPLETED'),
(3, 1, 3, N'Các phép toán tập hợp', '2025-02-07', '18:00', '20:00', N'Hợp, giao, hiệu, phần bù của tập hợp', N'Làm bài tập 21-30 trang 18', 'COMPLETED'),
(4, 1, 4, N'Các tập hợp số', '2025-02-10', '18:00', '20:00', N'Tập N, Z, Q, R và các tính chất', N'Làm bài tập 31-40 trang 25', 'SCHEDULED'),
(5, 1, 5, N'Sai số và số gần đúng', '2025-02-12', '18:00', '20:00', N'Khái niệm sai số, quy tắc làm tròn', N'Làm bài tập 41-50 trang 32', 'SCHEDULED');

-- Lớp IELTS-B1
INSERT INTO CLASS_SESSIONS (ID, CLASS_ID, SESSION_NUMBER, TITLE, SESSION_DATE, START_TIME, END_TIME, CONTENT, STATUS) VALUES
(6, 3, 1, N'Introduction & Diagnostic Test', '2025-02-17', '19:00', '21:00', N'Làm bài test đầu vào, đánh giá trình độ', 'SCHEDULED'),
(7, 3, 2, N'Reading Skills - Skimming & Scanning', '2025-02-19', '19:00', '21:00', N'Kỹ năng đọc lướt và đọc tìm thông tin', 'SCHEDULED'),
(8, 3, 3, N'Listening Part 1 & 2', '2025-02-21', '19:00', '21:00', N'Luyện nghe Part 1 và Part 2', 'SCHEDULED');

SET IDENTITY_INSERT CLASS_SESSIONS OFF;

-- =================================================================
-- 9. ENROLLMENTS - ĐĂNG KÝ HỌC
-- =================================================================

SET IDENTITY_INSERT ENROLLMENTS ON;

INSERT INTO ENROLLMENTS (ID, CLASS_ID, STUDENT_ID, ENROLLMENT_DATE, STATUS, PAYMENT_STATUS, TOTAL_FEE, PAID_AMOUNT, DISCOUNT_PERCENT, NOTES) VALUES
-- Lớp Toán 10A1
(1, 1, 1, '2025-01-15', 'ACTIVE', 'PAID', 3000000.00, 3000000.00, 0, N'Đăng ký sớm'),
(2, 1, 2, '2025-01-18', 'ACTIVE', 'PARTIAL', 3000000.00, 1500000.00, 0, N'Đã đóng đợt 1/2'),
(3, 1, 3, '2025-01-20', 'ACTIVE', 'PAID', 3000000.00, 2700000.00, 10, N'Giảm giá 10% học sinh cũ'),
(4, 1, 4, '2025-01-22', 'ACTIVE', 'PAID', 3000000.00, 3000000.00, 0, NULL),
(5, 1, 5, '2025-01-25', 'ACTIVE', 'PARTIAL', 3000000.00, 1000000.00, 0, N'Chưa đóng đủ'),
(6, 1, 6, '2025-01-28', 'ACTIVE', 'PENDING', 3000000.00, 0, 0, N'Chưa thanh toán'),
(7, 1, 7, '2025-01-30', 'ACTIVE', 'PAID', 3000000.00, 2850000.00, 5, N'Giảm giá 5% giới thiệu bạn'),
(8, 1, 8, '2025-02-01', 'ACTIVE', 'PAID', 3000000.00, 3000000.00, 0, NULL),

-- Lớp IELTS B1
(9, 3, 9, '2025-02-05', 'ACTIVE', 'PAID', 4500000.00, 4500000.00, 0, NULL),
(10, 3, 10, '2025-02-10', 'ACTIVE', 'PARTIAL', 4500000.00, 2250000.00, 0, N'Đã đóng 50%');

SET IDENTITY_INSERT ENROLLMENTS OFF;

-- =================================================================
-- 10. ATTENDANCE - ĐIỂM DANH (Cho 3 buổi đầu của lớp Toán 10A1)
-- =================================================================

SET IDENTITY_INSERT ATTENDANCE ON;

-- Buổi 1
INSERT INTO ATTENDANCE (ID, SESSION_ID, ENROLLMENT_ID, STATUS, CHECK_IN_TIME, MARKED_BY) VALUES
(1, 1, 1, 'PRESENT', '2025-02-03 17:55:00', 4),
(2, 1, 2, 'PRESENT', '2025-02-03 18:02:00', 4),
(3, 1, 3, 'LATE', '2025-02-03 18:15:00', 4),
(4, 1, 4, 'PRESENT', '2025-02-03 17:58:00', 4),
(5, 1, 5, 'PRESENT', '2025-02-03 18:00:00', 4),
(6, 1, 6, 'ABSENT', NULL, 4),
(7, 1, 7, 'PRESENT', '2025-02-03 17:57:00', 4),
(8, 1, 8, 'PRESENT', '2025-02-03 18:01:00', 4);

-- Buổi 2
INSERT INTO ATTENDANCE (ID, SESSION_ID, ENROLLMENT_ID, STATUS, CHECK_IN_TIME, MARKED_BY) VALUES
(9, 2, 1, 'PRESENT', '2025-02-05 17:58:00', 4),
(10, 2, 2, 'PRESENT', '2025-02-05 18:00:00', 4),
(11, 2, 3, 'PRESENT', '2025-02-05 18:03:00', 4),
(12, 2, 4, 'PRESENT', '2025-02-05 17:55:00', 4),
(13, 2, 5, 'EXCUSED', NULL, 4),
(14, 2, 6, 'ABSENT', NULL, 4),
(15, 2, 7, 'PRESENT', '2025-02-05 18:02:00', 4),
(16, 2, 8, 'LATE', '2025-02-05 18:12:00', 4);

-- Buổi 3
INSERT INTO ATTENDANCE (ID, SESSION_ID, ENROLLMENT_ID, STATUS, CHECK_IN_TIME, MARKED_BY) VALUES
(17, 3, 1, 'PRESENT', '2025-02-07 17:59:00', 4),
(18, 3, 2, 'PRESENT', '2025-02-07 18:01:00', 4),
(19, 3, 3, 'PRESENT', '2025-02-07 18:00:00', 4),
(20, 3, 4, 'PRESENT', '2025-02-07 17:57:00', 4),
(21, 3, 5, 'PRESENT', '2025-02-07 18:04:00', 4),
(22, 3, 6, 'PRESENT', '2025-02-07 18:05:00', 4),
(23, 3, 7, 'PRESENT', '2025-02-07 17:56:00', 4),
(24, 3, 8, 'PRESENT', '2025-02-07 18:02:00', 4);

SET IDENTITY_INSERT ATTENDANCE OFF;

-- =================================================================
-- 11. ASSIGNMENTS - BÀI TẬP
-- =================================================================

SET IDENTITY_INSERT ASSIGNMENTS ON;

INSERT INTO ASSIGNMENTS (ID, CLASS_ID, TITLE, DESCRIPTION, DUE_DATE, MAX_SCORE, ASSIGNMENT_TYPE, CREATED_BY) VALUES
(1, 1, N'Bài tập chương 1 - Mệnh đề và tập hợp', N'Làm các bài tập từ 1 đến 50 trang 35. Nộp file PDF hoặc ảnh chụp bài làm.', '2025-02-15', 100, 'HOMEWORK', 4),
(2, 1, N'Kiểm tra 15 phút - Chương 1', N'Kiểm tra kiến thức chương 1: Mệnh đề, tập hợp, các phép toán', '2025-02-14', 100, 'QUIZ', 4),
(3, 3, N'IELTS Reading Practice Test 1', N'Complete the reading test within 60 minutes. Submit your answer sheet.', '2025-02-25', 40, 'HOMEWORK', 5);

SET IDENTITY_INSERT ASSIGNMENTS OFF;

-- =================================================================
-- 12. SUBMISSIONS - BÀI NỘP
-- =================================================================

SET IDENTITY_INSERT SUBMISSIONS ON;

INSERT INTO SUBMISSIONS (ID, ASSIGNMENT_ID, STUDENT_ID, SUBMISSION_DATE, CONTENT, SCORE, FEEDBACK, GRADED_BY, GRADED_AT, STATUS) VALUES
(1, 1, 1, '2025-02-14 20:30:00', N'Đã làm xong 50/50 bài tập', 95, N'Bài làm tốt, chỉ sai 2 câu nhỏ. Cần chú ý cách trình bày.', 4, '2025-02-15 10:00:00', 'GRADED'),
(2, 1, 2, '2025-02-15 08:00:00', N'Đã làm 48/50 bài', 88, N'Còn thiếu 2 bài. Phần làm được khá tốt.', 4, '2025-02-15 10:30:00', 'GRADED'),
(3, 1, 3, '2025-02-15 21:00:00', N'Nộp muộn 6 tiếng', 75, N'Bài làm đúng nhưng nộp muộn nên trừ điểm.', 4, '2025-02-16 09:00:00', 'LATE'),
(4, 1, 4, '2025-02-14 19:00:00', N'Hoàn thành đầy đủ', 92, N'Tốt lắm! Tiếp tục phát huy.', 4, '2025-02-15 10:15:00', 'GRADED');

SET IDENTITY_INSERT SUBMISSIONS OFF;

-- =================================================================
-- 13. PAYMENTS - THANH TOÁN
-- =================================================================

SET IDENTITY_INSERT PAYMENTS ON;

INSERT INTO PAYMENTS (ID, ENROLLMENT_ID, AMOUNT, PAYMENT_DATE, PAYMENT_METHOD, TRANSACTION_ID, STATUS, NOTES, PROCESSED_BY) VALUES
(1, 1, 3000000.00, '2025-01-15', 'BANK_TRANSFER', 'TXN20250115001', 'COMPLETED', N'Thanh toán đầy đủ một lần', 2),
(2, 2, 1500000.00, '2025-01-18', 'CASH', 'CASH20250118001', 'COMPLETED', N'Đợt 1/2', 2),
(3, 3, 2700000.00, '2025-01-20', 'MOMO', 'MOMO20250120001', 'COMPLETED', N'Thanh toán qua MoMo, giảm 10%', 2),
(4, 4, 3000000.00, '2025-01-22', 'BANK_TRANSFER', 'TXN20250122001', 'COMPLETED', N'Chuyển khoản ngân hàng', 2),
(5, 5, 1000000.00, '2025-01-25', 'CASH', 'CASH20250125001', 'COMPLETED', N'Đợt 1/3', 2),
(6, 7, 2850000.00, '2025-01-30', 'VNPAY', 'VNPAY20250130001', 'COMPLETED', N'Thanh toán VNPay, giảm 5%', 2),
(7, 8, 3000000.00, '2025-02-01', 'BANK_TRANSFER', 'TXN20250201001', 'COMPLETED', NULL, 2),
(8, 9, 4500000.00, '2025-02-05', 'BANK_TRANSFER', 'TXN20250205001', 'COMPLETED', N'Thanh toán đầy đủ', 2),
(9, 10, 2250000.00, '2025-02-10', 'CASH', 'CASH20250210001', 'COMPLETED', N'Đợt 1/2', 2);

SET IDENTITY_INSERT PAYMENTS OFF;

-- =================================================================
-- 14. MATERIALS - TÀI LIỆU HỌC TẬP
-- =================================================================

SET IDENTITY_INSERT MATERIALS ON;

INSERT INTO MATERIALS (ID, CLASS_ID, TITLE, DESCRIPTION, FILE_URL, FILE_TYPE, FILE_SIZE, UPLOADED_BY, IS_PUBLIC) VALUES
(1, 1, N'Giáo trình Toán 10 - Chương 1', N'Tài liệu lý thuyết chương 1: Mệnh đề và tập hợp', '/uploads/materials/toan10-chuong1.pdf', 'PDF', 2048576, 4, 1),
(2, 1, N'Bài tập nâng cao Toán 10', N'Tuyển tập 100 bài tập nâng cao Toán 10', '/uploads/materials/toan10-baitap-nangcao.pdf', 'PDF', 3145728, 4, 1),
(3, 1, N'Slide bài giảng buổi 1', N'Slide PowerPoint buổi 1', '/uploads/materials/slide-buoi1.pptx', 'PPTX', 1048576, 4, 0),
(4, 3, N'IELTS Reading Strategies', N'Chiến thuật làm bài Reading hiệu quả', '/uploads/materials/ielts-reading-strategies.pdf', 'PDF', 1572864, 5, 1),
(5, 3, N'Cambridge IELTS 16 - Reading Tests', N'Bộ đề Cambridge IELTS 16', '/uploads/materials/cambridge-ielts-16.pdf', 'PDF', 5242880, 5, 0);

SET IDENTITY_INSERT MATERIALS OFF;

-- =================================================================
-- 15. NEWS - TIN TỨC & THÔNG BÁO
-- =================================================================

SET IDENTITY_INSERT NEWS ON;

INSERT INTO NEWS (ID, TITLE, EXCERPT, CONTENT, IMAGE_URL, TYPE, STATUS, IS_FEATURED, AUTHOR_ID, PUBLISHED_AT, CREATED_AT) VALUES
(1, N'Khai giảng khóa học Toán 10 Nâng cao', 
    N'Trung tâm DMT Education vui mừng thông báo khai giảng khóa học Toán 10 Nâng cao vào ngày 01/02/2025.',
    N'Trung tâm DMT Education vui mừng thông báo khai giảng khóa học **Toán 10 Nâng cao** vào ngày **01/02/2025**.\n\n**Thông tin khóa học:**\n- Thời gian: 18:00-20:00, Thứ 2-4-6\n- Giáo viên: Thầy Lê Văn Toán\n- Học phí: 3.000.000đ/khóa\n\nHiện còn vài suất cuối, đăng ký ngay!',
    '/images/ẢNH-SỰ-KIỆN-TRUYỀN-THÔNG/2-9-2025/z6956571199815_60cc52dda085da375c1704ab56ef6653.jpg',
    'NEWS', 'PUBLISHED', 1, 1, '2025-01-15 08:00:00', '2025-01-14 15:00:00'),

(2, N'Thông báo lịch nghỉ Tết Nguyên Đán 2025',
    N'Trung tâm thông báo lịch nghỉ Tết Nguyên Đán 2025 từ ngày 26/01 đến 05/02.',
    N'Kính gửi Quý phụ huynh và các em học sinh,\n\nTrung tâm DMT Education xin thông báo lịch nghỉ Tết Nguyên Đán Ất Tỵ 2025:\n\n**Thời gian nghỉ:** Từ 26/01/2025 đến 05/02/2025\n**Ngày làm việc trở lại:** 06/02/2025\n\nTrung tâm kính chúc Quý phụ huynh và các em năm mới an khang thịnh vượng!',
    '/images/logo-dmt-main.png',
    'ANNOUNCEMENT', 'PUBLISHED', 1, 1, '2025-01-10 09:00:00', '2025-01-09 14:00:00'),

(3, N'Tuyển sinh khóa IELTS 6.5+ - Khai giảng tháng 3/2025',
    N'Đăng ký ngay khóa học IELTS 6.5+ với đội ngũ giảng viên 8.0+ IELTS.',
    N' **KHÓA HỌC IELTS 6.5+ - KHAI GIẢNG THÁNG 3/2025**\n\n Cam kết đầu ra 6.5+\n Giảng viên 8.0+ IELTS\n Lớp nhỏ 15-20 học viên\n Tài liệu Cambridge chính gốc\n Học phí ưu đãi: 4.500.000đ/khóa\n\n📞 Hotline: 0905678901\nEmail: ielts@dmt.edu.vn',
    '/images/ANH-GV/DMT-25-4.jpg',
    'NEWS', 'PUBLISHED', 0, 1, '2025-01-20 10:00:00', '2025-01-19 16:00:00'),

(4, N'Sự kiện Ngày hội Toán học 2025',
    N'Tham gia Ngày hội Toán học với nhiều trò chơi trí tuệ và giải thưởng hấp dẫn.',
    N' **NGÀY HỘI TOÁN HỌC 2025**\n\n Thời gian: 15/03/2025\n Địa điểm: Trung tâm DMT Education\n\n**Chương trình:**\n- Thi giải toán nhanh\n- Trò chơi trí tuệ Toán học\n- Talkshow với các thầy cô giỏi\n- Giải thưởng giá trị\n\nMiễn phí tham gia! Đăng ký ngay!',
    '/images/ANH-HỌC-SINH/DMT-25-33.jpg',
    'EVENT', 'PUBLISHED', 1, 1, '2025-02-01 08:00:00', '2025-01-31 10:00:00'),

(5, N'Chúc mừng học viên đạt IELTS 7.5',
    N'Chúc mừng em Nguyễn Thị Mai đạt 7.5 IELTS sau 3 tháng học tại trung tâm.',
    N'**CHÚC MỪNG HỌC VIÊN ĐẠT 7.5 IELTS**\n\nTrung tâm DMT Education xin chúc mừng em **Nguyễn Thị Mai** đã đạt **7.5 IELTS** (Listening 8.0, Reading 8.0, Writing 7.0, Speaking 7.0) sau 3 tháng học tại trung tâm.\n\nChúc em tiếp tục thành công trên con đường học vấn!',
    '/images/ANH-HỌC-SINH/DMT-25-38.jpg',
    'NEWS', 'PUBLISHED', 0, 1, '2025-02-05 14:00:00', '2025-02-05 10:00:00'),

(6, N'Ưu đãi học phí tháng 2/2025',
    N'Giảm 15% học phí cho học viên đăng ký trong tháng 2/2025.',
    N' **ƯU ĐÃI HỌC PHÍ THÁNG 2/2025**\n\n Giảm 15% học phí cho tất cả khóa học\n Tặng bộ tài liệu trị giá 500.000đ\n Miễn phí test đầu vào\n\nÁp dụng đến hết 28/02/2025\n📞 Liên hệ ngay: 0901234567',
    '/images/banner.jpg',
    'ANNOUNCEMENT', 'PUBLISHED', 1, 1, '2025-02-01 07:00:00', '2025-01-30 09:00:00');

SET IDENTITY_INSERT NEWS OFF;

-- =================================================================
-- 16. NOTIFICATIONS - THÔNG BÁO CÁ NHÂN
-- =================================================================

SET IDENTITY_INSERT NOTIFICATIONS ON;

INSERT INTO NOTIFICATIONS (ID, USER_ID, TITLE, MESSAGE, TYPE, IS_READ, LINK_URL, CREATED_AT) VALUES
(1, 9, N'Nhắc nhở nộp bài tập', N'Bạn có 1 bài tập sắp đến hạn: "Bài tập chương 1" - hạn nộp 15/02/2025', 'WARNING', 0, '/student/assignments/1', '2025-02-13 08:00:00'),
(2, 9, N'Điểm bài tập đã được cập nhật', N'Bài tập "Bài tập chương 1" của bạn đã được chấm điểm: 95/100', 'SUCCESS', 1, '/student/assignments/1', '2025-02-15 10:05:00'),
(3, 10, N'Nhắc nhở thanh toán học phí', N'Bạn còn nợ 1.500.000đ học phí lớp Toán 10A1. Vui lòng thanh toán trước ngày 01/03/2025', 'WARNING', 0, '/student/payments', '2025-02-10 09:00:00'),
(4, 4, N'Lịch dạy tuần này', N'Bạn có 6 buổi dạy trong tuần này. Xem chi tiết lịch dạy.', 'INFO', 1, '/teacher/schedule', '2025-02-03 07:00:00'),
(5, 9, N'Tài liệu mới được cập nhật', N'Giáo viên đã đăng tài liệu mới: "Bài tập nâng cao Toán 10"', 'INFO', 0, '/student/materials', '2025-02-08 15:30:00');

SET IDENTITY_INSERT NOTIFICATIONS OFF;

-- =================================================================
-- 17. SURVEYS - KHẢO SÁT
-- =================================================================

SET IDENTITY_INSERT SURVEYS ON;

INSERT INTO SURVEYS (ID, TITLE, DESCRIPTION, TARGET_TYPE, CLASS_ID, START_DATE, END_DATE, IS_ACTIVE, CREATED_BY) VALUES
(1, N'Khảo sát chất lượng giảng dạy - Lớp Toán 10A1', 
    N'Khảo sát đánh giá chất lượng giảng dạy của thầy Lê Văn Toán ở lớp Toán 10A1',
    'STUDENT', 1, '2025-02-10', '2025-02-20', 1, 1),
(2, N'Khảo sát mức độ hài lòng chung',
    N'Khảo sát mức độ hài lòng của học viên về cơ sở vật chất, chất lượng giảng dạy',
    'ALL', NULL, '2025-02-01', '2025-02-28', 1, 1);

SET IDENTITY_INSERT SURVEYS OFF;

-- =================================================================
-- 18. SURVEY_QUESTIONS - CÂU HỎI KHẢO SÁT
-- =================================================================

SET IDENTITY_INSERT SURVEY_QUESTIONS ON;

INSERT INTO SURVEY_QUESTIONS (ID, SURVEY_ID, QUESTION_TEXT, QUESTION_TYPE, OPTIONS, IS_REQUIRED, QUESTION_ORDER) VALUES
(1, 1, N'Bạn đánh giá như thế nào về kiến thức chuyên môn của giảng viên?', 'RATING', NULL, 1, 1),
(2, 1, N'Giảng viên có truyền đạt bài giảng rõ ràng, dễ hiểu không?', 'RATING', NULL, 1, 2),
(3, 1, N'Bạn hài lòng về phương pháp giảng dạy của giảng viên?', 'RATING', NULL, 1, 3),
(4, 1, N'Giảng viên có nhiệt tình hỗ trợ học sinh không?', 'RATING', NULL, 1, 4),
(5, 1, N'Bạn có góp ý gì cho giảng viên không?', 'TEXT', NULL, 0, 5),

(6, 2, N'Bạn hài lòng về cơ sở vật chất của trung tâm?', 'RATING', NULL, 1, 1),
(7, 2, N'Bạn hài lòng về chất lượng giảng dạy tổng thể?', 'RATING', NULL, 1, 2),
(8, 2, N'Bạn có giới thiệu trung tâm cho người thân, bạn bè không?', 'YES_NO', NULL, 1, 3);

SET IDENTITY_INSERT SURVEY_QUESTIONS OFF;

-- =================================================================
-- 19. SURVEY_RESPONSES - CÂU TRẢ LỜI KHẢO SÁT
-- =================================================================

SET IDENTITY_INSERT SURVEY_RESPONSES ON;

INSERT INTO SURVEY_RESPONSES (ID, SURVEY_ID, QUESTION_ID, RESPONDENT_ID, ANSWER_RATING, SUBMITTED_AT) VALUES
-- Học sinh 1 trả lời khảo sát 1
(1, 1, 1, 9, 5, '2025-02-12 20:00:00'),
(2, 1, 2, 9, 5, '2025-02-12 20:00:00'),
(3, 1, 3, 9, 4, '2025-02-12 20:00:00'),
(4, 1, 4, 9, 5, '2025-02-12 20:00:00');

INSERT INTO SURVEY_RESPONSES (ID, SURVEY_ID, QUESTION_ID, RESPONDENT_ID, ANSWER_TEXT, SUBMITTED_AT) VALUES
(5, 1, 5, 9, N'Thầy dạy rất tốt, nhiệt tình. Em rất hài lòng.', '2025-02-12 20:00:00');

-- Học sinh 2 trả lời khảo sát 1
INSERT INTO SURVEY_RESPONSES (ID, SURVEY_ID, QUESTION_ID, RESPONDENT_ID, ANSWER_RATING, SUBMITTED_AT) VALUES
(6, 1, 1, 10, 4, '2025-02-13 19:30:00'),
(7, 1, 2, 10, 4, '2025-02-13 19:30:00'),
(8, 1, 3, 10, 4, '2025-02-13 19:30:00'),
(9, 1, 4, 10, 5, '2025-02-13 19:30:00');

INSERT INTO SURVEY_RESPONSES (ID, SURVEY_ID, QUESTION_ID, RESPONDENT_ID, ANSWER_TEXT, SUBMITTED_AT) VALUES
(10, 1, 5, 10, N'Thầy giảng bài rất hay, em học được nhiều kiến thức.', '2025-02-13 19:30:00');

SET IDENTITY_INSERT SURVEY_RESPONSES OFF;

-- =================================================================
-- 20. SYSTEM_SETTINGS - CÀI ĐẶT HỆ THỐNG
-- =================================================================

SET IDENTITY_INSERT SYSTEM_SETTINGS ON;

INSERT INTO SYSTEM_SETTINGS (ID, SETTING_KEY, SETTING_VALUE, DESCRIPTION) VALUES
(1, 'SCHOOL_NAME', N'Trung tâm Giáo dục DMT', N'Tên trung tâm'),
(2, 'SCHOOL_PHONE', '0901234567', N'Số điện thoại liên hệ'),
(3, 'SCHOOL_EMAIL', 'contact@dmt.edu.vn', N'Email liên hệ'),
(4, 'SCHOOL_ADDRESS', N'123 Nguyễn Huệ, Quận 1, TP.HCM', N'Địa chỉ trung tâm'),
(5, 'PAYMENT_METHODS', 'CASH,BANK_TRANSFER,MOMO,VNPAY', N'Các phương thức thanh toán được chấp nhận'),
(6, 'DEFAULT_CLASS_CAPACITY', '25', N'Sức chứa mặc định của lớp học'),
(7, 'LATE_PAYMENT_DAYS', '7', N'Số ngày cho phép thanh toán muộn');

SET IDENTITY_INSERT SYSTEM_SETTINGS OFF;

-- =================================================================
-- 21. GRADES - ĐIỂM SỐ TỔNG HỢP
-- =================================================================

SET IDENTITY_INSERT GRADES ON;

INSERT INTO GRADES (ID, ENROLLMENT_ID, GRADE_TYPE, SCORE, MAX_SCORE, WEIGHT, NOTES, GRADED_BY, GRADED_AT) VALUES
(1, 1, 'ASSIGNMENT', 95, 100, 20.00, N'Điểm bài tập', 4, '2025-02-15 10:00:00'),
(2, 2, 'ASSIGNMENT', 88, 100, 20.00, N'Điểm bài tập', 4, '2025-02-15 10:30:00');

SET IDENTITY_INSERT GRADES OFF;

GO
