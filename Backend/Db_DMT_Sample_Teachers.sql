-- Sample Teachers Data for DMT Education System
-- Run this script after creating the database schema

-- Note: This assumes users table already has some user records
-- And subjects table has subject records

-- Insert sample teacher data
-- First, ensure we have some users with teacher role (role_id = 3)

DECLARE @TeacherRoleId INT = 3; -- TEACHER role

-- Sample Teacher 1: Trần Giang Thanh (Math Teacher)
IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'thanh@dmt.edu.vn')
BEGIN
    INSERT INTO users (email, password_hash, full_name, phone, address, birth_date, role_id, status)
    VALUES (
        'thanh@dmt.edu.vn',
        '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxF6q5Owi', -- password: Teacher123
        N'Trần Giang Thanh',
        '0901234567',
        N'123 Nguyễn Huệ, Q1, TP.HCM',
        '1985-01-15',
        @TeacherRoleId,
        1
    );
    
    DECLARE @UserId1 INT = SCOPE_IDENTITY();
    
    INSERT INTO teachers (user_id, teacher_code, main_subject_id, years_experience, degree, specialization)
    VALUES (
        @UserId1,
        'GV20240001',
        1, -- Math subject (adjust based on your subjects table)
        10,
        N'Thạc sĩ Toán học',
        N'Toán học ứng dụng'
    );
END

-- Sample Teacher 2: Hà Đăng Như Quỳnh (Literature Teacher)
IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'quynh@dmt.edu.vn')
BEGIN
    INSERT INTO users (email, password_hash, full_name, phone, address, birth_date, role_id, status)
    VALUES (
        'quynh@dmt.edu.vn',
        '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxF6q5Owi',
        N'Hà Đăng Như Quỳnh',
        '0902234567',
        N'456 Lê Lợi, Q1, TP.HCM',
        '1987-03-20',
        @TeacherRoleId,
        1
    );
    
    DECLARE @UserId2 INT = SCOPE_IDENTITY();
    
    INSERT INTO teachers (user_id, teacher_code, main_subject_id, years_experience, degree, specialization)
    VALUES (
        @UserId2,
        'GV20240002',
        2, -- Literature subject
        8,
        N'Thạc sĩ Ngữ văn',
        N'Văn học Việt Nam'
    );
END

-- Sample Teacher 3: Trần Anh Khoa (English Teacher)
IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'khoa@dmt.edu.vn')
BEGIN
    INSERT INTO users (email, password_hash, full_name, phone, address, birth_date, role_id, status)
    VALUES (
        'khoa@dmt.edu.vn',
        '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxF6q5Owi',
        N'Trần Anh Khoa',
        '0903234567',
        N'789 Trần Hưng Đạo, Q5, TP.HCM',
        '1983-07-10',
        @TeacherRoleId,
        1
    );
    
    DECLARE @UserId3 INT = SCOPE_IDENTITY();
    
    INSERT INTO teachers (user_id, teacher_code, main_subject_id, years_experience, degree, specialization)
    VALUES (
        @UserId3,
        'GV20240003',
        3, -- English subject
        12,
        N'Cử nhân Tiếng Anh, TESOL',
        N'Tiếng Anh giao tiếp'
    );
END

-- Sample Teacher 4: Nguyễn Bá Thọ (Physics Teacher)
IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'tho@dmt.edu.vn')
BEGIN
    INSERT INTO users (email, password_hash, full_name, phone, address, birth_date, role_id, status)
    VALUES (
        'tho@dmt.edu.vn',
        '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxF6q5Owi',
        N'Nguyễn Bá Thọ',
        '0904234567',
        N'321 Võ Văn Tần, Q3, TP.HCM',
        '1980-05-25',
        @TeacherRoleId,
        1
    );
    
    DECLARE @UserId4 INT = SCOPE_IDENTITY();
    
    INSERT INTO teachers (user_id, teacher_code, main_subject_id, years_experience, degree, specialization)
    VALUES (
        @UserId4,
        'GV20240004',
        4, -- Physics subject
        15,
        N'Tiến sĩ Vật lý',
        N'Vật lý lý thuyết'
    );
END

-- Sample Teacher 5: Từ Kim Loan (Chemistry Teacher)
IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'loan@dmt.edu.vn')
BEGIN
    INSERT INTO users (email, password_hash, full_name, phone, address, birth_date, role_id, status)
    VALUES (
        'loan@dmt.edu.vn',
        '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxF6q5Owi',
        N'Từ Kim Loan',
        '0905234567',
        N'654 Pasteur, Q3, TP.HCM',
        '1986-11-30',
        @TeacherRoleId,
        1
    );
    
    DECLARE @UserId5 INT = SCOPE_IDENTITY();
    
    INSERT INTO teachers (user_id, teacher_code, main_subject_id, years_experience, degree, specialization)
    VALUES (
        @UserId5,
        'GV20240005',
        5, -- Chemistry subject
        9,
        N'Thạc sĩ Hóa học',
        N'Hóa học hữu cơ'
    );
END

-- Sample Teacher 6: Lê Văn Minh (Biology Teacher)
IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'minh@dmt.edu.vn')
BEGIN
    INSERT INTO users (email, password_hash, full_name, phone, address, birth_date, role_id, status)
    VALUES (
        'minh@dmt.edu.vn',
        '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxF6q5Owi',
        N'Lê Văn Minh',
        '0906234567',
        N'147 Điện Biên Phủ, Q10, TP.HCM',
        '1988-08-12',
        @TeacherRoleId,
        1
    );
    
    DECLARE @UserId6 INT = SCOPE_IDENTITY();
    
    INSERT INTO teachers (user_id, teacher_code, main_subject_id, years_experience, degree, specialization)
    VALUES (
        @UserId6,
        'GV20240006',
        6, -- Biology subject
        7,
        N'Thạc sĩ Sinh học',
        N'Sinh học phân tử'
    );
END

-- Sample Teacher 7: Phạm Thị Hương (History Teacher)
IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'huong@dmt.edu.vn')
BEGIN
    INSERT INTO users (email, password_hash, full_name, phone, address, birth_date, role_id, status)
    VALUES (
        'huong@dmt.edu.vn',
        '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxF6q5Owi',
        N'Phạm Thị Hương',
        '0907234567',
        N'258 Cách Mạng Tháng 8, Q10, TP.HCM',
        '1984-02-18',
        @TeacherRoleId,
        1
    );
    
    DECLARE @UserId7 INT = SCOPE_IDENTITY();
    
    INSERT INTO teachers (user_id, teacher_code, main_subject_id, years_experience, degree, specialization)
    VALUES (
        @UserId7,
        'GV20240007',
        7, -- History subject
        11,
        N'Thạc sĩ Lịch sử',
        N'Lịch sử Việt Nam'
    );
END

-- Sample Teacher 8: Hoàng Văn Nam (Geography Teacher)
IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'nam@dmt.edu.vn')
BEGIN
    INSERT INTO users (email, password_hash, full_name, phone, address, birth_date, role_id, status)
    VALUES (
        'nam@dmt.edu.vn',
        '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxF6q5Owi',
        N'Hoàng Văn Nam',
        '0908234567',
        N'369 Nguyễn Thị Minh Khai, Q3, TP.HCM',
        '1982-09-22',
        @TeacherRoleId,
        1
    );
    
    DECLARE @UserId8 INT = SCOPE_IDENTITY();
    
    INSERT INTO teachers (user_id, teacher_code, main_subject_id, years_experience, degree, specialization)
    VALUES (
        @UserId8,
        'GV20240008',
        8, -- Geography subject
        13,
        N'Thạc sĩ Địa lý',
        N'Địa lý kinh tế'
    );
END

-- Add more teachers if needed...

-- Verify the data
SELECT 
    t.id,
    t.teacher_code,
    u.full_name,
    u.email,
    u.phone,
    s.name as subject_name,
    t.years_experience,
    t.degree,
    t.specialization,
    u.status
FROM teachers t
INNER JOIN users u ON t.user_id = u.id
LEFT JOIN subjects s ON t.main_subject_id = s.id
ORDER BY t.teacher_code;

PRINT 'Sample teachers data inserted successfully!';
