-- Insert Teachers from Mock Data (Teachers.tsx)
-- This script adds 6 teachers matching the frontend mock data

USE DMT_EDUCATION_SYSTEM;
GO

DECLARE @TeacherRoleId INT = 3; -- TEACHER role

-- Check and get subject IDs (you may need to adjust these based on your SUBJECTS table)
DECLARE @MathSubjectId INT = (SELECT TOP 1 ID FROM SUBJECTS WHERE name LIKE N'%Toán%');
DECLARE @EnglishSubjectId INT = (SELECT TOP 1 ID FROM SUBJECTS WHERE name LIKE N'%Anh%' OR name LIKE N'%English%');
DECLARE @PhysicsSubjectId INT = (SELECT TOP 1 ID FROM SUBJECTS WHERE name LIKE N'%Vật%' OR name LIKE N'%Lý%');
DECLARE @LiteratureSubjectId INT = (SELECT TOP 1 ID FROM SUBJECTS WHERE name LIKE N'%Văn%' OR name LIKE N'%Literature%');
DECLARE @ITSubjectId INT = (SELECT TOP 1 ID FROM SUBJECTS WHERE name LIKE N'%Tin%' OR name LIKE N'%IT%' OR name LIKE N'%Computer%');
DECLARE @ArtSubjectId INT = (SELECT TOP 1 ID FROM SUBJECTS WHERE name LIKE N'%Nghệ%' OR name LIKE N'%Art%' OR name LIKE N'%Âm%');

-- If subjects don't exist, create them
IF @MathSubjectId IS NULL
BEGIN
    INSERT INTO SUBJECTS (name, description) VALUES (N'Toán học', N'Môn Toán học');
    SET @MathSubjectId = SCOPE_IDENTITY();
END

IF @EnglishSubjectId IS NULL
BEGIN
    INSERT INTO SUBJECTS (name, description) VALUES (N'Tiếng Anh', N'Môn Tiếng Anh');
    SET @EnglishSubjectId = SCOPE_IDENTITY();
END

IF @PhysicsSubjectId IS NULL
BEGIN
    INSERT INTO SUBJECTS (name, description) VALUES (N'Vật lý', N'Môn Vật lý');
    SET @PhysicsSubjectId = SCOPE_IDENTITY();
END

IF @LiteratureSubjectId IS NULL
BEGIN
    INSERT INTO SUBJECTS (name, description) VALUES (N'Ngữ văn', N'Môn Ngữ văn');
    SET @LiteratureSubjectId = SCOPE_IDENTITY();
END

IF @ITSubjectId IS NULL
BEGIN
    INSERT INTO SUBJECTS (name, description) VALUES (N'Tin học', N'Môn Tin học');
    SET @ITSubjectId = SCOPE_IDENTITY();
END

IF @ArtSubjectId IS NULL
BEGIN
    INSERT INTO SUBJECTS (name, description) VALUES (N'Nghệ thuật', N'Môn Nghệ thuật');
    SET @ArtSubjectId = SCOPE_IDENTITY();
END

-- Teacher 1: Nguyễn Văn Anh (Math & Physics)
-- Email: nguyenvananh@dmt.edu.vn
IF NOT EXISTS (SELECT 1 FROM USERS WHERE email = 'nguyenvananh@dmt.edu.vn')
BEGIN
    INSERT INTO USERS (email, password_hash, full_name, phone, address, birth_date, role_id, status, created_at)
    VALUES (
        'nguyenvananh@dmt.edu.vn',
        '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxF6q5Owi', -- Teacher@123
        N'Nguyễn Văn Anh',
        '0912345678',
        N'123 Nguyễn Huệ, Quận 1, TP.HCM',
        '1983-05-10',
        @TeacherRoleId,
        1, -- active
        '2018-06-15'
    );
    
    DECLARE @UserId1 INT = SCOPE_IDENTITY();
    
    INSERT INTO TEACHERS (user_id, teacher_code, main_subject_id, years_experience, degree, specialization, created_at)
    VALUES (
        @UserId1,
        'GV2018001',
        @MathSubjectId,
        10,
        N'Thạc sĩ Toán học ứng dụng',
        N'Toán học, Vật lý',
        '2018-06-15'
    );
    
    PRINT 'Created teacher: Nguyễn Văn Anh';
END
ELSE
    PRINT 'Teacher Nguyễn Văn Anh already exists';

-- Teacher 2: Trần Thị Bình (English & Literature)
-- Email: tranthibinh@dmt.edu.vn
IF NOT EXISTS (SELECT 1 FROM USERS WHERE email = 'tranthibinh@dmt.edu.vn')
BEGIN
    INSERT INTO USERS (email, password_hash, full_name, phone, address, birth_date, role_id, status, created_at)
    VALUES (
        'tranthibinh@dmt.edu.vn',
        '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxF6q5Owi',
        N'Trần Thị Bình',
        '0923456789',
        N'456 Lê Lợi, Quận 1, TP.HCM',
        '1985-08-15',
        @TeacherRoleId,
        1,
        '2019-08-20'
    );
    
    DECLARE @UserId2 INT = SCOPE_IDENTITY();
    
    INSERT INTO TEACHERS (user_id, teacher_code, main_subject_id, years_experience, degree, specialization, created_at)
    VALUES (
        @UserId2,
        'GV2019001',
        @EnglishSubjectId,
        7,
        N'Cử nhân Ngôn ngữ Anh',
        N'Tiếng Anh, Ngữ văn',
        '2019-08-20'
    );
    
    PRINT 'Created teacher: Trần Thị Bình';
END
ELSE
    PRINT 'Teacher Trần Thị Bình already exists';

-- Teacher 3: Lê Văn Cường (Physics, Chemistry, Biology) - ON LEAVE
-- Email: levancuong@dmt.edu.vn
IF NOT EXISTS (SELECT 1 FROM USERS WHERE email = 'levancuong@dmt.edu.vn')
BEGIN
    INSERT INTO USERS (email, password_hash, full_name, phone, address, birth_date, role_id, status, created_at)
    VALUES (
        'levancuong@dmt.edu.vn',
        '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxF6q5Owi',
        N'Lê Văn Cường',
        '0934567890',
        N'789 Điện Biên Phủ, Quận 3, TP.HCM',
        '1978-03-05',
        @TeacherRoleId,
        1, -- active (we don't have on_leave status, using active)
        '2017-03-10'
    );
    
    DECLARE @UserId3 INT = SCOPE_IDENTITY();
    
    INSERT INTO TEACHERS (user_id, teacher_code, main_subject_id, years_experience, degree, specialization, created_at)
    VALUES (
        @UserId3,
        'GV2017001',
        @PhysicsSubjectId,
        14,
        N'Tiến sĩ Vật lý',
        N'Vật lý, Hóa học, Sinh học',
        '2017-03-10'
    );
    
    PRINT 'Created teacher: Lê Văn Cường';
END
ELSE
    PRINT 'Teacher Lê Văn Cường already exists';

-- Teacher 4: Phạm Thị Dung (Literature, History, Geography)
-- Email: phamthidung@dmt.edu.vn
IF NOT EXISTS (SELECT 1 FROM USERS WHERE email = 'phamthidung@dmt.edu.vn')
BEGIN
    INSERT INTO USERS (email, password_hash, full_name, phone, address, birth_date, role_id, status, created_at)
    VALUES (
        'phamthidung@dmt.edu.vn',
        '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxF6q5Owi',
        N'Phạm Thị Dung',
        '0945678901',
        N'321 Trần Hưng Đạo, Quận 5, TP.HCM',
        '1987-02-10',
        @TeacherRoleId,
        1,
        '2020-02-15'
    );
    
    DECLARE @UserId4 INT = SCOPE_IDENTITY();
    
    INSERT INTO TEACHERS (user_id, teacher_code, main_subject_id, years_experience, degree, specialization, created_at)
    VALUES (
        @UserId4,
        'GV2020001',
        @LiteratureSubjectId,
        5,
        N'Thạc sĩ Việt Nam học',
        N'Tiếng Việt, Lịch sử, Địa lý',
        '2020-02-15'
    );
    
    PRINT 'Created teacher: Phạm Thị Dung';
END
ELSE
    PRINT 'Teacher Phạm Thị Dung already exists';

-- Teacher 5: Hoàng Văn Em (IT, Math) - INACTIVE
-- Email: hoangvanem@dmt.edu.vn
IF NOT EXISTS (SELECT 1 FROM USERS WHERE email = 'hoangvanem@dmt.edu.vn')
BEGIN
    INSERT INTO USERS (email, password_hash, full_name, phone, address, birth_date, role_id, status, created_at)
    VALUES (
        'hoangvanem@dmt.edu.vn',
        '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxF6q5Owi',
        N'Hoàng Văn Em',
        '0956789012',
        N'654 Võ Văn Tần, Quận 3, TP.HCM',
        '1990-01-01',
        @TeacherRoleId,
        0, -- inactive
        '2021-01-05'
    );
    
    DECLARE @UserId5 INT = SCOPE_IDENTITY();
    
    INSERT INTO TEACHERS (user_id, teacher_code, main_subject_id, years_experience, degree, specialization, created_at)
    VALUES (
        @UserId5,
        'GV2021001',
        @ITSubjectId,
        4,
        N'Kỹ sư Công nghệ thông tin',
        N'Tin học, Toán học',
        '2021-01-05'
    );
    
    PRINT 'Created teacher: Hoàng Văn Em';
END
ELSE
    PRINT 'Teacher Hoàng Văn Em already exists';

-- Teacher 6: Mai Thị Phương (Art, Music)
-- Email: maithiphuong@dmt.edu.vn
IF NOT EXISTS (SELECT 1 FROM USERS WHERE email = 'maithiphuong@dmt.edu.vn')
BEGIN
    INSERT INTO USERS (email, password_hash, full_name, phone, address, birth_date, role_id, status, created_at)
    VALUES (
        'maithiphuong@dmt.edu.vn',
        '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxF6q5Owi',
        N'Mai Thị Phương',
        '0967890123',
        N'987 Nguyễn Thị Minh Khai, Quận 1, TP.HCM',
        '1989-11-20',
        @TeacherRoleId,
        1,
        '2019-11-20'
    );
    
    DECLARE @UserId6 INT = SCOPE_IDENTITY();
    
    INSERT INTO TEACHERS (user_id, teacher_code, main_subject_id, years_experience, degree, specialization, created_at)
    VALUES (
        @UserId6,
        'GV2019002',
        @ArtSubjectId,
        6,
        N'Cử nhân Mỹ thuật',
        N'Nghệ thuật, Âm nhạc',
        '2019-11-20'
    );
    
    PRINT 'Created teacher: Mai Thị Phương';
END
ELSE
    PRINT 'Teacher Mai Thị Phương already exists';

GO

-- Verify the data
SELECT 
    t.ID,
    t.TEACHER_CODE,
    u.full_name,
    u.email,
    u.phone,
    s.name as subject,
    t.YEARS_EXPERIENCE,
    t.DEGREE,
    t.SPECIALIZATION,
    u.status,
    t.CREATED_AT
FROM TEACHERS t
INNER JOIN USERS u ON t.USER_ID = u.ID
LEFT JOIN SUBJECTS s ON t.MAIN_SUBJECT_ID = s.ID
WHERE u.email IN (
    'nguyenvananh@dmt.edu.vn',
    'tranthibinh@dmt.edu.vn',
    'levancuong@dmt.edu.vn',
    'phamthidung@dmt.edu.vn',
    'hoangvanem@dmt.edu.vn',
    'maithiphuong@dmt.edu.vn'
)
ORDER BY t.CREATED_AT;

PRINT '';
PRINT '==============================================';
PRINT 'Teachers imported successfully!';
PRINT 'Total teachers: 6';
PRINT 'Password for all teachers: Teacher@123';
PRINT '==============================================';
