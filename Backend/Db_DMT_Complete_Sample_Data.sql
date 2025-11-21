-- =================================================================
-- DMT EDUCATION SYSTEM - COMPLETE SAMPLE DATA
-- =================================================================
-- Version: 2.0
-- Date: November 20, 2025
-- Description: Tổng hợp tất cả dữ liệu mẫu cho hệ thống
-- =================================================================
-- HƯỚNG DẪN SỬ DỤNG:
-- 1. Đảm bảo đã chạy Db_DMT_SQLServer.sql trước
-- 2. Chạy file này: sqlcmd -S localhost -d DMT_EDUCATION_SYSTEM -i Db_DMT_Complete_Sample_Data.sql
-- 3. Hoặc: node Backend/scripts/insert-complete-data.mjs
-- =================================================================
-- NỘI DUNG:
-- - 1 Admin account
-- - 2 Staff accounts  
-- - 5 Teacher accounts (Math, English, Physics, Chemistry, Literature)
-- - 11 Student accounts
-- - Subjects, Courses, Classes
-- - 8 Assignments (Teacher data)
-- - 7 Submissions
-- - 10 Materials
-- - 8 Class Sessions
-- - 24+ Attendance records
-- - Enrollments, Payments
-- =================================================================

USE DMT_EDUCATION_SYSTEM;
GO

PRINT '====================================================================';
PRINT 'DMT EDUCATION SYSTEM - COMPLETE SAMPLE DATA INSERTION';
PRINT '====================================================================';
PRINT '';

-- =================================================================
-- XÓA DỮ LIỆU CŨ (IF EXISTS) - TRÁNH CONFLICT
-- =================================================================

PRINT '1. Deleting old sample data...';

-- Xóa theo thứ tự ngược để tránh foreign key constraint
DELETE FROM SURVEY_RESPONSES WHERE 1=1;
DELETE FROM SURVEY_QUESTIONS WHERE 1=1;
DELETE FROM SURVEYS WHERE 1=1;
DELETE FROM NOTIFICATIONS WHERE 1=1;
DELETE FROM NEWS WHERE 1=1;
DELETE FROM PAYMENTS WHERE 1=1;
DELETE FROM GRADES WHERE 1=1;
DELETE FROM SUBMISSIONS WHERE 1=1;
DELETE FROM ASSIGNMENTS WHERE 1=1;
DELETE FROM ATTENDANCE WHERE 1=1;
DELETE FROM ENROLLMENTS WHERE 1=1;
DELETE FROM CLASS_SESSIONS WHERE 1=1;
DELETE FROM MATERIALS WHERE 1=1;
DELETE FROM CLASSES WHERE 1=1;
DELETE FROM COURSES WHERE 1=1;
DELETE FROM SUBJECTS WHERE 1=1;
DELETE FROM STAFF WHERE 1=1;
DELETE FROM TEACHERS WHERE 1=1;
DELETE FROM STUDENTS WHERE 1=1;
DELETE FROM USERS WHERE ID > 0;

PRINT '   ✓ Old data deleted';
PRINT '';

GO

-- =================================================================
-- 2. USERS - TẠO TÀI KHOẢN MẪU
-- =================================================================

PRINT '2. Creating user accounts...';

-- MẬT KHẨU: Role@123 (Admin@123, Teacher@123, Student@123, Staff@123)
-- Đã hash bằng bcrypt với cost factor 10

SET IDENTITY_INSERT USERS ON;

INSERT INTO USERS (ID, ROLE_ID, EMAIL, PASSWORD_HASH, FULL_NAME, PHONE, ADDRESS, BIRTH_DATE, AVATAR_URL, STATUS) VALUES
-- ADMIN
(1, 1, 'admin@dmt.edu.vn', '$2a$10$2cmTPF1fZsIHv0ACWjHvV.ANP451eU4eBXu9euwPdBoXziLgVZ4Em', N'Nguyễn Văn Admin', '0901234567', N'123 Nguyễn Huệ, Quận 1, TP.HCM', '1985-01-15', '/images/LOGO/DMT-logo.png', 1),

-- STAFF
(2, 2, 'staff1@dmt.edu.vn', '$2a$10$mJRSTg127El59S1YY5pyvO4XMOtyJjTMUylp9hgiFyqXuJZcSD2IK', N'Trần Thị Bích Hằng', '0902345678', N'456 Lê Lợi, Quận 1, TP.HCM', '1988-03-20', '/images/avatar-staff1.jpg', 1),
(3, 2, 'staff2@dmt.edu.vn', '$2a$10$/B0BLiP69olcdjhDzf/Hd.bKFMFvyVVH.Uj3E4rbgDmKmo99JLsAi', N'Phạm Văn Minh', '0903456789', N'789 Hai Bà Trưng, Quận 3, TP.HCM', '1990-07-10', '/images/avatar-staff2.jpg', 1),

-- TEACHERS
(4, 3, 'teacher.math@dmt.edu.vn', '$2a$10$.IM3F8KoK5wh2Tbe6nMEdO0NCbcZ1i86L81qh/2MbHAklPYCV.kx6', N'Lê Văn Toán', '0904567890', N'321 Võ Văn Tần, Quận 3, TP.HCM', '1982-05-15', '/images/ANH-GV/DMT-25-2.jpg', 1),
(5, 3, 'teacher.english@dmt.edu.vn', '$2a$10$a.0hHClyx2yJqNHwvCZZoen43XmojuIsIZvNWxrVWAlBSDWGuCbD.', N'Nguyễn Thị Anh', '0905678901', N'654 Điện Biên Phủ, Quận Bình Thạnh, TP.HCM', '1987-08-22', '/images/ANH-GV/DMT-25-4.jpg', 1),
(6, 3, 'teacher.physics@dmt.edu.vn', '$2a$10$ule6z/eQk.gy.b4d1ZbfO.9rb6/wsu3sE0zZVZRvoVdApoveZiNwa', N'Trần Văn Lý', '0906789012', N'987 Cách Mạng Tháng 8, Quận 10, TP.HCM', '1984-12-05', '/images/ANH-GV/DMT-25-6.jpg', 1),
(7, 3, 'teacher.chemistry@dmt.edu.vn', '$2a$10$WY/gXamlfl9y9ZoZAcDRJ.X8aW.CkjXBssdEXvJUxSUpATbzMrzaW', N'Phạm Thị Hóa', '0907890123', N'147 Lý Thường Kiệt, Quận 10, TP.HCM', '1986-04-18', '/images/ANH-GV/DMT-25-14.jpg', 1),
(8, 3, 'teacher.literature@dmt.edu.vn', '$2a$10$sOJKppC06u7DCVDQR36FlOJLbnLn..BFws6JMjJl0W4Cyt5RqXNS6', N'Hoàng Văn Văn', '0908901234', N'258 Nguyễn Thị Minh Khai, Quận 3, TP.HCM', '1983-09-30', '/images/ANH-GV/DMT-25-15.jpg', 1),

-- STUDENTS
(9, 4, 'student001@gmail.com', '$2a$10$LVsyPaSyan663sys6LOvnenphbS43vf69Gc7869.XnUMzaA1x9BNy', N'Nguyễn Văn An', '0909012345', N'123 Lê Văn Sỹ, Quận 3, TP.HCM', '2010-01-10', '/images/ANH-HOC-SINH/DMT-25-23.jpg', 1),
(10, 4, 'student002@gmail.com', '$2a$10$3YJqWvc4bJBRs7Kc2WeaI.BuL8ELufPxl/1HCgwrme9Wewup.9Oby', N'Trần Thị Bình', '0910123456', N'456 Hoàng Văn Thụ, Quận Phú Nhuận, TP.HCM', '2009-05-20', '/images/ANH-HOC-SINH/DMT-25-24.jpg', 1),
(11, 4, 'student003@gmail.com', '$2a$10$oYOJQnHP4qWGWer5XbAyXOrkvHWaProbP.GIj7mVh2UpfkMobQ5P2', N'Lê Văn Cường', '0911234567', N'789 Phan Đăng Lưu, Quận Bình Thạnh, TP.HCM', '2010-03-15', '/images/ANH-HOC-SINH/DMT-25-25.jpg', 1),
(12, 4, 'student004@gmail.com', '$2a$10$VRl/bfKf0hHdmBNcIRQyu.nnzpFI9sqhk3NPj1Sfss99Awo9gCEwK', N'Phạm Thị Dung', '0912345678', N'321 Bạch Đằng, Quận Bình Thạnh, TP.HCM', '2009-11-25', '/images/ANH-HOC-SINH/DMT-25-26.jpg', 1),
(13, 4, 'student005@gmail.com', '$2a$10$OANobeNE0pa3su8syCyZRux43gSjZ5zkUpE0HWBZHE8.qrNn44IuG', N'Hoàng Văn Em', '0913456789', N'654 Xô Viết Nghệ Tĩnh, Quận Bình Thạnh, TP.HCM', '2010-07-08', '/images/ANH-HOC-SINH/DMT-25-27.jpg', 1),
(14, 4, 'student006@gmail.com', '$2a$10$2VYPbZ7blboJL4vBtR2OR.OSVWFhapAlv740l74AIUNShKaFB/IRe', N'Võ Thị Phương', '0914567890', N'987 Trường Chinh, Quận Tân Bình, TP.HCM', '2009-09-12', '/images/ANH-HOC-SINH/DMT-25-28.jpg', 1),
(15, 4, 'student007@gmail.com', '$2a$10$20cbYgn0IJ0o10QRhu73qejnmbWWR3D1Ef5/wICu5ZpcVw9mKbU0e', N'Đỗ Văn Giang', '0915678901', N'147 Cộng Hòa, Quận Tân Bình, TP.HCM', '2010-02-28', '/images/ANH-HOC-SINH/DMT-25-29.jpg', 1),
(16, 4, 'student008@gmail.com', '$2a$10$Sjd.sN.gdFhVlj3ncVorPuuKYr.Ws5FQau1H81qzs5VkPXKEcfQUe', N'Mai Thị Hồng', '0916789012', N'258 Hoàng Hoa Thám, Quận Tân Bình, TP.HCM', '2009-06-14', '/images/ANH-HOC-SINH/DMT-25-30.jpg', 1),
(17, 4, 'student009@gmail.com', '$2a$10$9p4IkP1iIh0a5By6srOnO.maudXDOR.09ZToilwgiiaJ9cMHojnyO', N'Bùi Văn Inh', '0917890123', N'369 Lạc Long Quân, Quận 11, TP.HCM', '2010-04-05', '/images/ANH-HOC-SINH/DMT-25-31.jpg', 1),
(18, 4, 'student010@gmail.com', '$2a$10$pUV4SRzevPwVBiyNtIeMkup1vFJkU4Pi1SnZbd6eC0QVCoHjl/Q..', N'Phan Thị Kim', '0918901234', N'741 Lý Thái Tổ, Quận 10, TP.HCM', '2009-12-18', '/images/ANH-HOC-SINH/DMT-25-32.jpg', 1),
(19, 4, 'student011@gmail.com', '$2a$10$pUV4SRzevPwVBiyNtIeMkup1vFJkU4Pi1SnZbd6eC0QVCoHjl/Q..', N'Lương Văn Long', '0919012345', N'852 Trần Hưng Đạo, Quận 5, TP.HCM', '2010-08-22', '/images/ANH-HOC-SINH/DMT-25-33.jpg', 1);

SET IDENTITY_INSERT USERS OFF;

PRINT '   ✓ Created 19 user accounts (1 admin, 2 staff, 5 teachers, 11 students)';

GO

-- =================================================================
-- 3. STUDENTS - THÔNG TIN HỌC SINH
-- =================================================================

PRINT '3. Creating student records...';

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
(10, 18, 'HS2025010', 'MIDDLE_SCHOOL', N'Phan Thị Phụ Huynh K', '0900000000', 'parent010@gmail.com'),
(11, 19, 'HS2025011', 'HIGH_SCHOOL', N'Lương Văn Phụ Huynh L', '0901010101', 'parent011@gmail.com');

SET IDENTITY_INSERT STUDENTS OFF;

PRINT '   ✓ Created 11 student records';

GO

-- =================================================================
-- 4. TEACHERS - THÔNG TIN GIÁO VIÊN
-- =================================================================

PRINT '4. Creating teacher records...';

SET IDENTITY_INSERT TEACHERS ON;

INSERT INTO TEACHERS (ID, USER_ID, TEACHER_CODE, YEARS_EXPERIENCE, DEGREE, SPECIALIZATION) VALUES
(1, 4, 'GV2025001', 15, N'Thạc sĩ Toán học', N'Đại số và Giải tích'),
(2, 5, 'GV2025002', 10, N'Cử nhân Ngôn ngữ Anh', N'IELTS và TOEFL'),
(3, 6, 'GV2025003', 12, N'Thạc sĩ Vật lý', N'Vật lý đại cương và Cơ học'),
(4, 7, 'GV2025004', 8, N'Cử nhân Hóa học', N'Hóa hữu cơ và Hóa phân tích'),
(5, 8, 'GV2025005', 14, N'Tiến sĩ Ngữ văn', N'Văn học Việt Nam hiện đại');

SET IDENTITY_INSERT TEACHERS OFF;

-- Update MAIN_SUBJECT_ID after creating subjects
-- Will be updated in later section

PRINT '   ✓ Created 5 teacher records';

GO

-- =================================================================
-- 5. STAFF - THÔNG TIN NHÂN VIÊN
-- =================================================================

PRINT '5. Creating staff records...';

SET IDENTITY_INSERT STAFF ON;

INSERT INTO STAFF (ID, USER_ID, STAFF_CODE, DEPARTMENT, POSITION) VALUES
(1, 2, 'NV2025001', N'Phòng Đào tạo', N'Chuyên viên tuyển sinh'),
(2, 3, 'NV2025002', N'Phòng Tài chính', N'Kế toán');

SET IDENTITY_INSERT STAFF OFF;

PRINT '   ✓ Created 2 staff records';

GO

-- =================================================================
-- 6. SUBJECTS - MÔN HỌC
-- =================================================================

PRINT '6. Creating subjects...';

SET IDENTITY_INSERT SUBJECTS ON;

INSERT INTO SUBJECTS (ID, CODE, NAME, DESCRIPTION, IS_ACTIVE) VALUES
(1, 'MATH', N'Toán học', N'Toán học từ cơ bản đến nâng cao', 1),
(2, 'ENG', N'Tiếng Anh', N'Tiếng Anh giao tiếp và IELTS', 1),
(3, 'PHY', N'Vật lý', N'Vật lý đại cương', 1),
(4, 'CHEM', N'Hóa học', N'Hóa học cơ bản và nâng cao', 1),
(5, 'LIT', N'Ngữ văn', N'Văn học Việt Nam', 1);

SET IDENTITY_INSERT SUBJECTS OFF;

-- Update MAIN_SUBJECT_ID for teachers
UPDATE TEACHERS SET MAIN_SUBJECT_ID = 1 WHERE ID = 1; -- Math teacher
UPDATE TEACHERS SET MAIN_SUBJECT_ID = 2 WHERE ID = 2; -- English teacher
UPDATE TEACHERS SET MAIN_SUBJECT_ID = 3 WHERE ID = 3; -- Physics teacher
UPDATE TEACHERS SET MAIN_SUBJECT_ID = 4 WHERE ID = 4; -- Chemistry teacher
UPDATE TEACHERS SET MAIN_SUBJECT_ID = 5 WHERE ID = 5; -- Literature teacher

PRINT '   ✓ Created 5 subjects';
PRINT '   ✓ Updated teacher subject assignments';

GO

-- =================================================================
-- 7. COURSES - KHÓA HỌC
-- =================================================================

PRINT '7. Creating courses...';

SET IDENTITY_INSERT COURSES ON;

INSERT INTO COURSES (ID, SUBJECT_ID, CODE, NAME, DESCRIPTION, DURATION_WEEKS, TOTAL_SESSIONS, PRICE, LEVEL, IS_ACTIVE) VALUES
(1, 1, 'MATH10', N'Toán lớp 10', N'Chương trình Toán học lớp 10 nâng cao', 24, 48, 3000000, 'INTERMEDIATE', 1),
(2, 2, 'ENG11', N'Tiếng Anh lớp 11', N'Tiếng Anh giao tiếp và luyện thi IELTS 6.0+', 20, 40, 3500000, 'INTERMEDIATE', 1),
(3, 3, 'PHY10', N'Vật lý lớp 10', N'Vật lý đại cương - Cơ học và Nhiệt học', 22, 44, 2800000, 'BEGINNER', 1),
(4, 4, 'CHEM10', N'Hóa học lớp 10', N'Hóa học đại cương và Hóa vô cơ', 22, 44, 2800000, 'BEGINNER', 1),
(5, 5, 'LIT10', N'Ngữ văn lớp 10', N'Văn học Việt Nam và kỹ năng viết', 20, 40, 2500000, 'INTERMEDIATE', 1);

SET IDENTITY_INSERT COURSES OFF;

PRINT '   ✓ Created 5 courses';

GO

-- =================================================================
-- 8. CLASSES - LỚP HỌC
-- =================================================================

PRINT '8. Creating classes...';

SET IDENTITY_INSERT CLASSES ON;

INSERT INTO CLASSES (ID, COURSE_ID, CODE, NAME, TEACHER_ID, CAPACITY, CURRENT_STUDENTS, START_DATE, END_DATE, SCHEDULE_DAYS, SCHEDULE_TIME, CLASSROOM, STATUS) VALUES
(1, 1, 'MATH10A', N'Toán 10A - Thầy Toán', 1, 25, 8, '2025-01-10', '2025-06-30', 'MONDAY,WEDNESDAY,FRIDAY', '18:00-20:00', 'A101', 'ACTIVE'),
(2, 2, 'ENG11B', N'Tiếng Anh 11B - Cô Anh', 2, 20, 6, '2025-01-15', '2025-06-15', 'TUESDAY,THURSDAY,SATURDAY', '19:00-21:00', 'B202', 'ACTIVE'),
(3, 3, 'PHY10A', N'Vật Lý 10A - Thầy Lý', 3, 25, 7, '2025-01-12', '2025-06-25', 'MONDAY,WEDNESDAY', '14:00-16:00', 'C303', 'ACTIVE'),
(4, 4, 'CHEM10A', N'Hóa 10A - Cô Hóa', 4, 25, 5, '2025-01-10', '2025-06-30', 'TUESDAY,THURSDAY', '16:00-18:00', 'D404', 'ACTIVE'),
(5, 5, 'LIT10A', N'Văn 10A - Thầy Văn', 5, 20, 4, '2025-01-20', '2025-06-20', 'FRIDAY,SATURDAY', '15:00-17:00', 'E505', 'ACTIVE');

SET IDENTITY_INSERT CLASSES OFF;

PRINT '   ✓ Created 5 classes';

GO

-- =================================================================
-- 9. ENROLLMENTS - ĐĂNG KÝ LỚP HỌC
-- =================================================================

PRINT '9. Creating enrollments...';

SET IDENTITY_INSERT ENROLLMENTS ON;

-- Math class enrollments
INSERT INTO ENROLLMENTS (ID, CLASS_ID, STUDENT_ID, ENROLLMENT_DATE, STATUS, PAYMENT_STATUS, TOTAL_FEE, PAID_AMOUNT, DISCOUNT_PERCENT) VALUES
(1, 1, 1, '2025-01-05', 'ACTIVE', 'PAID', 3000000, 3000000, 0),
(2, 1, 2, '2025-01-05', 'ACTIVE', 'PAID', 3000000, 3000000, 0),
(3, 1, 3, '2025-01-06', 'ACTIVE', 'PARTIAL', 3000000, 1500000, 0),
(4, 1, 4, '2025-01-06', 'ACTIVE', 'PAID', 3000000, 3000000, 10),
(5, 1, 5, '2025-01-07', 'ACTIVE', 'PAID', 3000000, 3000000, 0),
(6, 1, 6, '2025-01-07', 'ACTIVE', 'PENDING', 3000000, 0, 0),
(7, 1, 7, '2025-01-08', 'ACTIVE', 'PAID', 3000000, 3000000, 0),
(8, 1, 8, '2025-01-08', 'ACTIVE', 'PAID', 3000000, 3000000, 0),

-- English class enrollments
(9, 2, 2, '2025-01-10', 'ACTIVE', 'PAID', 3500000, 3500000, 0),
(10, 2, 3, '2025-01-10', 'ACTIVE', 'PAID', 3500000, 3500000, 0),
(11, 2, 4, '2025-01-11', 'ACTIVE', 'PARTIAL', 3500000, 2000000, 0),
(12, 2, 5, '2025-01-11', 'ACTIVE', 'PAID', 3500000, 3500000, 0),
(13, 2, 9, '2025-01-12', 'ACTIVE', 'PAID', 3500000, 3500000, 15),
(14, 2, 10, '2025-01-12', 'ACTIVE', 'PENDING', 3500000, 0, 0),

-- Physics class enrollments
(15, 3, 1, '2025-01-08', 'ACTIVE', 'PAID', 2800000, 2800000, 0),
(16, 3, 3, '2025-01-08', 'ACTIVE', 'PAID', 2800000, 2800000, 0),
(17, 3, 5, '2025-01-09', 'ACTIVE', 'PAID', 2800000, 2800000, 0),
(18, 3, 7, '2025-01-09', 'ACTIVE', 'PARTIAL', 2800000, 1400000, 0),
(19, 3, 8, '2025-01-10', 'ACTIVE', 'PAID', 2800000, 2800000, 0),
(20, 3, 9, '2025-01-10', 'ACTIVE', 'PAID', 2800000, 2800000, 0),
(21, 3, 10, '2025-01-11', 'ACTIVE', 'PENDING', 2800000, 0, 0),

-- Chemistry class enrollments
(22, 4, 1, '2025-01-05', 'ACTIVE', 'PAID', 2800000, 2800000, 0),
(23, 4, 4, '2025-01-06', 'ACTIVE', 'PAID', 2800000, 2800000, 0),
(24, 4, 6, '2025-01-07', 'ACTIVE', 'PARTIAL', 2800000, 1400000, 0),
(25, 4, 8, '2025-01-08', 'ACTIVE', 'PAID', 2800000, 2800000, 0),
(26, 4, 11, '2025-01-09', 'ACTIVE', 'PENDING', 2800000, 0, 0),

-- Literature class enrollments
(27, 5, 2, '2025-01-15', 'ACTIVE', 'PAID', 2500000, 2500000, 0),
(28, 5, 5, '2025-01-16', 'ACTIVE', 'PAID', 2500000, 2500000, 0),
(29, 5, 7, '2025-01-17', 'ACTIVE', 'PARTIAL', 2500000, 1250000, 0),
(30, 5, 10, '2025-01-18', 'ACTIVE', 'PENDING', 2500000, 0, 0);

SET IDENTITY_INSERT ENROLLMENTS OFF;

PRINT '   ✓ Created 30 enrollments';

GO

-- =================================================================
-- 10. ASSIGNMENTS - BÀI TẬP (TEACHER MODULE DATA)
-- =================================================================

PRINT '10. Creating assignments...';

INSERT INTO ASSIGNMENTS (CLASS_ID, TITLE, DESCRIPTION, DUE_DATE, MAX_SCORE, ASSIGNMENT_TYPE, CREATED_BY, CREATED_AT) VALUES
-- Math assignments
(1, N'Phương trình bậc 2', N'Giải các dạng phương trình bậc 2 cơ bản và nâng cao. Làm đầy đủ các bước giải, ghi rõ công thức.', DATEADD(DAY, 7, GETDATE()), 10, 'HOMEWORK', 4, DATEADD(DAY, -3, GETDATE())),
(1, N'Kiểm tra giữa kỳ - Đại số', N'Kiểm tra 45 phút về phương trình, bất phương trình và hệ phương trình.', DATEADD(DAY, 14, GETDATE()), 10, 'QUIZ', 4, DATEADD(DAY, -5, GETDATE())),
(1, N'Bài tập về hàm số', N'Khảo sát hàm số bậc nhất và bậc hai. Vẽ đồ thị và tìm tính chất.', DATEADD(DAY, 10, GETDATE()), 10, 'HOMEWORK', 4, DATEADD(DAY, -2, GETDATE())),

-- English assignments
(2, N'IELTS Writing Task 2 - Essay', N'Write an essay about "Education System". Minimum 250 words. Use academic vocabulary and proper structure.', DATEADD(DAY, 5, GETDATE()), 10, 'HOMEWORK', 5, DATEADD(DAY, -4, GETDATE())),
(2, N'Speaking Practice - Part 2', N'Record a 2-minute talk about "Your favorite teacher". Upload MP3 file.', DATEADD(DAY, 8, GETDATE()), 10, 'HOMEWORK', 5, DATEADD(DAY, -1, GETDATE())),
(2, N'Vocabulary Quiz Unit 5', N'Multiple choice test on vocabulary and grammar from Unit 5.', DATEADD(DAY, 3, GETDATE()), 10, 'QUIZ', 5, DATEADD(DAY, -6, GETDATE())),

-- Physics assignments
(3, N'Bài tập Động học', N'Các bài tập về chuyển động thẳng đều và chuyển động biến đổi đều. Sử dụng công thức chính xác.', DATEADD(DAY, 6, GETDATE()), 10, 'HOMEWORK', 6, DATEADD(DAY, -3, GETDATE())),
(3, N'Thí nghiệm Lực và Chuyển động', N'Báo cáo thí nghiệm về định luật Newton. Kèm ảnh chụp và kết quả đo.', DATEADD(DAY, 12, GETDATE()), 10, 'PROJECT', 6, DATEADD(DAY, -7, GETDATE()));

PRINT '   ✓ Created 8 assignments';

GO

-- =================================================================
-- 11. SUBMISSIONS - BÀI NỘP
-- =================================================================

PRINT '11. Creating submissions...';

DECLARE @Assignment1 INT = (SELECT TOP 1 ID FROM ASSIGNMENTS WHERE TITLE LIKE N'%Phương trình%' ORDER BY CREATED_AT DESC);
DECLARE @Assignment4 INT = (SELECT TOP 1 ID FROM ASSIGNMENTS WHERE TITLE LIKE N'%IELTS Writing%' ORDER BY CREATED_AT DESC);
DECLARE @Assignment7 INT = (SELECT TOP 1 ID FROM ASSIGNMENTS WHERE TITLE LIKE N'%Động học%' ORDER BY CREATED_AT DESC);

INSERT INTO SUBMISSIONS (ASSIGNMENT_ID, STUDENT_ID, SUBMISSION_DATE, CONTENT, ATTACHMENT_URL, STATUS, CREATED_AT) VALUES
(@Assignment1, 1, DATEADD(DAY, -1, GETDATE()), N'Em đã giải xong tất cả các bài tập. Các bước giải được trình bày rõ ràng trong file đính kèm.', '/uploads/submissions/math_eq_hs001.pdf', 'SUBMITTED', DATEADD(DAY, -1, GETDATE())),
(@Assignment1, 2, DATEADD(DAY, -2, GETDATE()), N'Bài làm của em về phương trình bậc 2. Em đã làm đúng theo hướng dẫn của thầy.', '/uploads/submissions/math_eq_hs002.pdf', 'GRADED', DATEADD(DAY, -2, GETDATE())),
(@Assignment1, 3, DATEADD(HOUR, -10, GETDATE()), N'Bài tập phương trình của em. Em làm hết rồi thầy ơi.', '/uploads/submissions/math_eq_hs003.pdf', 'SUBMITTED', DATEADD(HOUR, -10, GETDATE())),
(@Assignment4, 3, DATEADD(HOUR, -5, GETDATE()), N'Here is my essay about the education system. I have analyzed both traditional and modern approaches.', '/uploads/submissions/english_essay_hs003.docx', 'SUBMITTED', DATEADD(HOUR, -5, GETDATE())),
(@Assignment4, 4, DATEADD(DAY, -3, GETDATE()), N'My essay on education system reform. Please check my grammar and vocabulary usage.', '/uploads/submissions/english_essay_hs004.docx', 'SUBMITTED', DATEADD(DAY, -3, GETDATE())),
(@Assignment4, 5, DATEADD(DAY, -2, GETDATE()), N'This is my writing task 2 essay. I tried to follow IELTS format.', '/uploads/submissions/english_essay_hs005.docx', 'GRADED', DATEADD(DAY, -2, GETDATE())),
(@Assignment7, 5, DATEADD(DAY, 1, GETDATE()), N'Bài tập động học của em. Em đã làm hết các bài nhưng nộp trễ do ốm.', '/uploads/submissions/physics_kinetics_hs005.pdf', 'LATE', DATEADD(DAY, 1, GETDATE()));

-- Update graded submissions with scores
UPDATE SUBMISSIONS SET 
  SCORE = 8.5,
  FEEDBACK = N'Bài làm tốt! Cần chú ý thêm về cách trình bày và kiểm tra lại kết quả. Điểm: 8.5/10',
  GRADED_BY = 4,
  GRADED_AT = DATEADD(HOUR, -2, GETDATE())
WHERE STATUS = 'GRADED' AND ASSIGNMENT_ID = @Assignment1;

UPDATE SUBMISSIONS SET 
  SCORE = 7.0,
  FEEDBACK = N'Good effort! Work on your grammar and vocabulary range. Score: 7.0/10',
  GRADED_BY = 5,
  GRADED_AT = DATEADD(HOUR, -5, GETDATE())
WHERE STATUS = 'GRADED' AND ASSIGNMENT_ID = @Assignment4;

PRINT '   ✓ Created 7 submissions';

GO

-- =================================================================
-- 12. MATERIALS - TÀI LIỆU HỌC TẬP (TEACHER MODULE DATA)
-- =================================================================

PRINT '12. Creating materials...';

INSERT INTO MATERIALS (CLASS_ID, TITLE, DESCRIPTION, FILE_URL, FILE_TYPE, FILE_SIZE, UPLOADED_BY, IS_PUBLIC, CREATED_AT) VALUES
-- Math materials
(1, N'Bài giảng Phương trình bậc 2', N'Slide bài giảng với công thức và ví dụ minh họa chi tiết', '/uploads/materials/math_equations_lecture.pdf', 'pdf', 2500000, 4, 1, DATEADD(DAY, -10, GETDATE())),
(1, N'Bài tập nâng cao Đại số', N'100 bài tập từ cơ bản đến nâng cao có đáp án', '/uploads/materials/math_exercises_advanced.pdf', 'pdf', 3200000, 4, 1, DATEADD(DAY, -7, GETDATE())),

-- English materials
(2, N'IELTS Writing Templates', N'Useful templates and phrases for IELTS Writing Task 2', '/uploads/materials/ielts_writing_templates.pdf', 'pdf', 1800000, 5, 1, DATEADD(DAY, -12, GETDATE())),
(2, N'Pronunciation Practice Video', N'Video hướng dẫn phát âm chuẩn British English', '/uploads/materials/pronunciation_guide.mp4', 'video', 125000000, 5, 1, DATEADD(DAY, -5, GETDATE())),
(2, N'Vocabulary Unit 1-5', N'Tổng hợp từ vựng quan trọng Unit 1-5 kèm ví dụ', '/uploads/materials/vocab_unit_1_5.docx', 'document', 950000, 5, 1, DATEADD(DAY, -8, GETDATE())),

-- Physics materials
(3, N'Video bài giảng Động học', N'Video giảng bài chi tiết về chuyển động và vận tốc', '/uploads/materials/physics_kinetics_video.mp4', 'video', 85000000, 6, 1, DATEADD(DAY, -9, GETDATE())),
(3, N'Hướng dẫn thí nghiệm', N'Hướng dẫn chi tiết các thí nghiệm Vật lý lớp 10', '/uploads/materials/physics_lab_guide.pdf', 'pdf', 4500000, 6, 1, DATEADD(DAY, -11, GETDATE())),
(3, N'Công thức Vật lý tổng hợp', N'Tất cả công thức cần nhớ cho kỳ thi', '/uploads/materials/physics_formulas.pptx', 'pptx', 1200000, 6, 1, DATEADD(DAY, -6, GETDATE())),

-- Chemistry materials
(4, N'Bảng tuần hoàn các nguyên tố', N'Bảng tuần hoàn đầy đủ với thông tin chi tiết', '/uploads/materials/periodic_table.pdf', 'pdf', 850000, 7, 1, DATEADD(DAY, -8, GETDATE())),

-- Literature materials
(5, N'Phân tích tác phẩm Chiếc Thuyền Ngoài Xa', N'Tài liệu phân tích chi tiết tác phẩm', '/uploads/materials/thuyen_ngoai_xa_analysis.pdf', 'pdf', 1500000, 8, 1, DATEADD(DAY, -7, GETDATE()));

PRINT '   ✓ Created 10 materials';

GO

-- =================================================================
-- 13. CLASS_SESSIONS - BUỔI HỌC
-- =================================================================

PRINT '13. Creating class sessions...';

-- Math class sessions
INSERT INTO CLASS_SESSIONS (CLASS_ID, SESSION_NUMBER, TITLE, SESSION_DATE, START_TIME, END_TIME, CONTENT, STATUS, CREATED_AT) VALUES
(1, 1, N'Giới thiệu phương trình', DATEADD(DAY, -10, GETDATE()), '18:00', '20:00', N'Các khái niệm cơ bản về phương trình', 'COMPLETED', DATEADD(DAY, -10, GETDATE())),
(1, 2, N'Phương trình bậc nhất', DATEADD(DAY, -7, GETDATE()), '18:00', '20:00', N'Giải và biện luận phương trình bậc nhất', 'COMPLETED', DATEADD(DAY, -7, GETDATE())),
(1, 3, N'Phương trình bậc hai', DATEADD(DAY, -3, GETDATE()), '18:00', '20:00', N'Công thức nghiệm và delta', 'COMPLETED', DATEADD(DAY, -3, GETDATE())),

-- English class sessions
(2, 1, N'IELTS Introduction', DATEADD(DAY, -8, GETDATE()), '19:00', '21:00', N'Overview of IELTS exam structure', 'COMPLETED', DATEADD(DAY, -8, GETDATE())),
(2, 2, N'Writing Task 2 Structure', DATEADD(DAY, -5, GETDATE()), '19:00', '21:00', N'Essay structure and planning', 'COMPLETED', DATEADD(DAY, -5, GETDATE())),

-- Physics class sessions
(3, 1, N'Chuyển động thẳng đều', DATEADD(DAY, -9, GETDATE()), '14:00', '16:00', N'Khái niệm và công thức STĐ', 'COMPLETED', DATEADD(DAY, -9, GETDATE())),
(3, 2, N'Chuyển động biến đổi đều', DATEADD(DAY, -6, GETDATE()), '14:00', '16:00', N'Gia tốc và phương trình chuyển động', 'COMPLETED', DATEADD(DAY, -6, GETDATE())),
(3, 3, N'Định luật Newton', DATEADD(DAY, -2, GETDATE()), '14:00', '16:00', N'Ba định luật Newton về động lực học', 'COMPLETED', DATEADD(DAY, -2, GETDATE()));

PRINT '   ✓ Created 8 class sessions';

GO

-- =================================================================
-- 14. ATTENDANCE - ĐIỂM DANH (AUTO-GENERATED)
-- =================================================================

PRINT '14. Creating attendance records...';

-- Auto-generate attendance for completed sessions
DECLARE @SessionID INT;
DECLARE @EnrollmentID INT;

DECLARE session_cursor CURSOR FOR
SELECT ID FROM CLASS_SESSIONS WHERE STATUS = 'COMPLETED';

OPEN session_cursor;
FETCH NEXT FROM session_cursor INTO @SessionID;

WHILE @@FETCH_STATUS = 0
BEGIN
    -- Get class_id from session
    DECLARE @ClassID INT = (SELECT CLASS_ID FROM CLASS_SESSIONS WHERE ID = @SessionID);
    
    -- Add attendance for each enrolled student in this class
    INSERT INTO ATTENDANCE (SESSION_ID, ENROLLMENT_ID, STATUS, CHECK_IN_TIME, CREATED_AT)
    SELECT 
        @SessionID,
        E.ID,
        CASE 
            WHEN (ABS(CHECKSUM(NEWID())) % 100) < 90 THEN 'PRESENT'
            WHEN (ABS(CHECKSUM(NEWID())) % 100) < 95 THEN 'LATE'
            ELSE 'ABSENT'
        END,
        DATEADD(MINUTE, -120 + (ABS(CHECKSUM(NEWID())) % 15), GETDATE()),
        GETDATE()
    FROM ENROLLMENTS E
    WHERE E.CLASS_ID = @ClassID
    AND NOT EXISTS (
        SELECT 1 FROM ATTENDANCE A 
        WHERE A.SESSION_ID = @SessionID AND A.ENROLLMENT_ID = E.ID
    );
    
    FETCH NEXT FROM session_cursor INTO @SessionID;
END

CLOSE session_cursor;
DEALLOCATE session_cursor;

DECLARE @AttendanceCount INT = (SELECT COUNT(*) FROM ATTENDANCE);
PRINT '   ✓ Created ' + CAST(@AttendanceCount AS VARCHAR) + ' attendance records';

GO

-- =================================================================
-- 15. PAYMENTS - THANH TOÁN
-- =================================================================

PRINT '15. Creating payment records...';

SET IDENTITY_INSERT PAYMENTS ON;

-- Payments for enrollments that are PAID or PARTIAL
INSERT INTO PAYMENTS (ID, ENROLLMENT_ID, AMOUNT, PAYMENT_DATE, PAYMENT_METHOD, TRANSACTION_ID, STATUS, PROCESSED_BY, CREATED_AT) VALUES
-- Full payments
(1, 1, 3000000, '2025-01-05', 'BANK_TRANSFER', 'TXN001', 'COMPLETED', 2, '2025-01-05'),
(2, 2, 3000000, '2025-01-05', 'CASH', 'TXN002', 'COMPLETED', 2, '2025-01-05'),
(3, 4, 2700000, '2025-01-06', 'BANK_TRANSFER', 'TXN003', 'COMPLETED', 2, '2025-01-06'), -- 10% discount
(4, 5, 3000000, '2025-01-07', 'VNPAY', 'TXN004', 'COMPLETED', 2, '2025-01-07'),
(5, 7, 3000000, '2025-01-08', 'BANK_TRANSFER', 'TXN005', 'COMPLETED', 2, '2025-01-08'),
(6, 8, 3000000, '2025-01-08', 'CASH', 'TXN006', 'COMPLETED', 2, '2025-01-08'),

-- Partial payments
(7, 3, 1500000, '2025-01-06', 'CASH', 'TXN007', 'COMPLETED', 2, '2025-01-06'),
(8, 11, 2000000, '2025-01-11', 'BANK_TRANSFER', 'TXN008', 'COMPLETED', 2, '2025-01-11'),
(9, 18, 1400000, '2025-01-09', 'CASH', 'TXN009', 'COMPLETED', 2, '2025-01-09'),
(10, 23, 1400000, '2025-01-07', 'VNPAY', 'TXN010', 'COMPLETED', 2, '2025-01-07'),
(11, 29, 1250000, '2025-01-17', 'BANK_TRANSFER', 'TXN011', 'COMPLETED', 2, '2025-01-17');

SET IDENTITY_INSERT PAYMENTS OFF;

PRINT '   ✓ Created 11 payment records';

GO

-- =================================================================
-- VERIFICATION - KIỂM TRA DỮ LIỆU
-- =================================================================

PRINT '';
PRINT '====================================================================';
PRINT 'VERIFICATION - SUMMARY OF INSERTED DATA';
PRINT '====================================================================';

SELECT 'Users' AS [Table], COUNT(*) AS [Records] FROM USERS UNION ALL
SELECT 'Students', COUNT(*) FROM STUDENTS UNION ALL
SELECT 'Teachers', COUNT(*) FROM TEACHERS UNION ALL
SELECT 'Staff', COUNT(*) FROM STAFF UNION ALL
SELECT 'Subjects', COUNT(*) FROM SUBJECTS UNION ALL
SELECT 'Courses', COUNT(*) FROM COURSES UNION ALL
SELECT 'Classes', COUNT(*) FROM CLASSES UNION ALL
SELECT 'Enrollments', COUNT(*) FROM ENROLLMENTS UNION ALL
SELECT 'Assignments', COUNT(*) FROM ASSIGNMENTS UNION ALL
SELECT 'Submissions', COUNT(*) FROM SUBMISSIONS UNION ALL
SELECT 'Materials', COUNT(*) FROM MATERIALS UNION ALL
SELECT 'Class Sessions', COUNT(*) FROM CLASS_SESSIONS UNION ALL
SELECT 'Attendance', COUNT(*) FROM ATTENDANCE UNION ALL
SELECT 'Payments', COUNT(*) FROM PAYMENTS
ORDER BY [Table];

PRINT '';
PRINT '====================================================================';
PRINT '✅ COMPLETE SAMPLE DATA INSERTION FINISHED SUCCESSFULLY!';
PRINT '====================================================================';
PRINT '';
PRINT 'TEST ACCOUNTS:';
PRINT '  Admin:   admin@dmt.edu.vn / Admin@123';
PRINT '  Staff:   staff1@dmt.edu.vn / Staff@123';
PRINT '  Teacher: teacher.math@dmt.edu.vn / Teacher@123';
PRINT '  Student: student001@gmail.com / Student@123';
PRINT '';
PRINT 'DATABASE: DMT_EDUCATION_SYSTEM is ready for use!';
PRINT '====================================================================';
