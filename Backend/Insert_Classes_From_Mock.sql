-- Insert Classes from Mock Data (Classes.tsx)
-- This script adds 6 classes matching the frontend mock data

USE DMT_EDUCATION_SYSTEM;
GO

-- First, ensure we have courses
-- Check if courses exist, if not create them
DECLARE @Course1Id INT, @Course2Id INT, @Course3Id INT, @Course4Id INT, @Course5Id INT, @Course6Id INT;
DECLARE @MathSubjectId INT, @EnglishSubjectId INT, @PhysicsSubjectId INT, @ChemistrySubjectId INT, @ITSubjectId INT, @LiteratureSubjectId INT;

-- Get subject IDs
SET @MathSubjectId = (SELECT TOP 1 ID FROM SUBJECTS WHERE name LIKE N'%Toán%');
SET @EnglishSubjectId = (SELECT TOP 1 ID FROM SUBJECTS WHERE name LIKE N'%Anh%' OR name LIKE N'%English%');
SET @PhysicsSubjectId = (SELECT TOP 1 ID FROM SUBJECTS WHERE name LIKE N'%Vật%' OR name LIKE N'%Lý%');
SET @ChemistrySubjectId = (SELECT TOP 1 ID FROM SUBJECTS WHERE name LIKE N'%Hóa%' OR name LIKE N'%Chemistry%');
SET @ITSubjectId = (SELECT TOP 1 ID FROM SUBJECTS WHERE name LIKE N'%Tin%' OR name LIKE N'%IT%' OR name LIKE N'%Python%');
SET @LiteratureSubjectId = (SELECT TOP 1 ID FROM SUBJECTS WHERE name LIKE N'%Văn%' OR name LIKE N'%Literature%');

-- Create courses if they don't exist
IF NOT EXISTS (SELECT 1 FROM COURSES WHERE name = N'Toán học nâng cao')
BEGIN
    INSERT INTO COURSES (name, subject_id, description, duration_weeks, price, level)
    VALUES (N'Toán học nâng cao', @MathSubjectId, N'Khóa học Toán nâng cao cho học sinh THPT', 12, 3000000, N'Nâng cao');
    SET @Course1Id = SCOPE_IDENTITY();
    PRINT 'Created course: Toán học nâng cao';
END
ELSE
    SET @Course1Id = (SELECT ID FROM COURSES WHERE name = N'Toán học nâng cao');

IF NOT EXISTS (SELECT 1 FROM COURSES WHERE name = N'Tiếng Anh giao tiếp')
BEGIN
    INSERT INTO COURSES (name, subject_id, description, duration_weeks, price, level)
    VALUES (N'Tiếng Anh giao tiếp', @EnglishSubjectId, N'Khóa học Tiếng Anh giao tiếp trình độ B1', 12, 2500000, N'Trung cấp');
    SET @Course2Id = SCOPE_IDENTITY();
    PRINT 'Created course: Tiếng Anh giao tiếp';
END
ELSE
    SET @Course2Id = (SELECT ID FROM COURSES WHERE name = N'Tiếng Anh giao tiếp');

IF NOT EXISTS (SELECT 1 FROM COURSES WHERE name = N'Vật lý đại cương')
BEGIN
    INSERT INTO COURSES (name, subject_id, description, duration_weeks, price, level)
    VALUES (N'Vật lý đại cương', @PhysicsSubjectId, N'Khóa học Vật lý đại cương cho học sinh THPT', 12, 2800000, N'Cơ bản');
    SET @Course3Id = SCOPE_IDENTITY();
    PRINT 'Created course: Vật lý đại cương';
END
ELSE
    SET @Course3Id = (SELECT ID FROM COURSES WHERE name = N'Vật lý đại cương');

IF NOT EXISTS (SELECT 1 FROM COURSES WHERE name = N'Hóa học cơ bản')
BEGIN
    INSERT INTO COURSES (name, subject_id, description, duration_weeks, price, level)
    VALUES (N'Hóa học cơ bản', @ChemistrySubjectId, N'Khóa học Hóa học cơ bản cho học sinh THPT', 12, 2600000, N'Cơ bản');
    SET @Course4Id = SCOPE_IDENTITY();
    PRINT 'Created course: Hóa học cơ bản';
END
ELSE
    SET @Course4Id = (SELECT ID FROM COURSES WHERE name = N'Hóa học cơ bản');

IF NOT EXISTS (SELECT 1 FROM COURSES WHERE name = N'Lập trình Python')
BEGIN
    INSERT INTO COURSES (name, subject_id, description, duration_weeks, price, level)
    VALUES (N'Lập trình Python', @ITSubjectId, N'Khóa học lập trình Python cơ bản', 8, 3500000, N'Cơ bản');
    SET @Course5Id = SCOPE_IDENTITY();
    PRINT 'Created course: Lập trình Python';
END
ELSE
    SET @Course5Id = (SELECT ID FROM COURSES WHERE name = N'Lập trình Python');

IF NOT EXISTS (SELECT 1 FROM COURSES WHERE name = N'Ngữ văn và văn học')
BEGIN
    INSERT INTO COURSES (name, subject_id, description, duration_weeks, price, level)
    VALUES (N'Ngữ văn và văn học', @LiteratureSubjectId, N'Khóa học Văn học và sáng tác văn', 12, 2200000, N'Trung cấp');
    SET @Course6Id = SCOPE_IDENTITY();
    PRINT 'Created course: Ngữ văn và văn học';
END
ELSE
    SET @Course6Id = (SELECT ID FROM COURSES WHERE name = N'Ngữ văn và văn học');

-- Get teacher IDs
DECLARE @Teacher1Id INT = (SELECT ID FROM TEACHERS WHERE TEACHER_CODE = 'GV2018001'); -- Nguyễn Văn Anh
DECLARE @Teacher2Id INT = (SELECT ID FROM TEACHERS WHERE TEACHER_CODE = 'GV2019001'); -- Trần Thị Bình
DECLARE @Teacher3Id INT = (SELECT ID FROM TEACHERS WHERE TEACHER_CODE = 'GV2017001'); -- Lê Văn Cường
DECLARE @Teacher4Id INT = (SELECT ID FROM TEACHERS WHERE TEACHER_CODE = 'GV2020001'); -- Phạm Thị Dung

-- Class 1: Toán nâng cao A1 (ongoing - 8/24 sessions completed)
IF NOT EXISTS (SELECT 1 FROM CLASSES WHERE CODE = 'TNA1-2025-06')
BEGIN
    INSERT INTO CLASSES (
        CODE, NAME, COURSE_ID, TEACHER_ID, 
        START_DATE, END_DATE, 
        SCHEDULE_DAYS, SCHEDULE_TIME, CLASSROOM, 
        CAPACITY, CURRENT_STUDENTS, 
        STATUS, CREATED_AT
    )
    VALUES (
        'TNA1-2025-06',
        N'Toán nâng cao A1',
        @Course1Id,
        @Teacher1Id,
        '2025-06-01',
        '2025-09-01',
        'MONDAY,WEDNESDAY',
        '18:00-20:00',
        'P.101',
        30,
        25,
        'ACTIVE',
        GETDATE()
    );
    PRINT 'Created class: Toán nâng cao A1';
END
ELSE
    PRINT 'Class Toán nâng cao A1 already exists';

-- Class 2: Tiếng Anh giao tiếp B1 (ongoing - 4/24 sessions completed)
IF NOT EXISTS (SELECT 1 FROM CLASSES WHERE CODE = 'TAGT-B1-2025-07')
BEGIN
    INSERT INTO CLASSES (
        CODE, NAME, COURSE_ID, TEACHER_ID,
        START_DATE, END_DATE,
        SCHEDULE_DAYS, SCHEDULE_TIME, CLASSROOM,
        CAPACITY, CURRENT_STUDENTS,
        STATUS, CREATED_AT
    )
    VALUES (
        'TAGT-B1-2025-07',
        N'Tiếng Anh giao tiếp B1',
        @Course2Id,
        @Teacher2Id,
        '2025-07-01',
        '2025-10-01',
        'TUESDAY,THURSDAY',
        '18:00-20:00',
        'P.102',
        25,
        20,
        'ACTIVE',
        GETDATE()
    );
    PRINT 'Created class: Tiếng Anh giao tiếp B1';
END
ELSE
    PRINT 'Class Tiếng Anh giao tiếp B1 already exists';

-- Class 3: Vật lý đại cương A1 (completed - 12/12 sessions)
IF NOT EXISTS (SELECT 1 FROM CLASSES WHERE CODE = 'VLDC-A1-2025-05')
BEGIN
    INSERT INTO CLASSES (
        CODE, NAME, COURSE_ID, TEACHER_ID,
        START_DATE, END_DATE,
        SCHEDULE_DAYS, SCHEDULE_TIME, CLASSROOM,
        CAPACITY, CURRENT_STUDENTS,
        STATUS, CREATED_AT
    )
    VALUES (
        'VLDC-A1-2025-05',
        N'Vật lý đại cương A1',
        @Course3Id,
        @Teacher3Id,
        '2025-05-15',
        '2025-08-15',
        'SATURDAY',
        '8:00-11:30',
        'P.201',
        40,
        35,
        'COMPLETED',
        GETDATE()
    );
    PRINT 'Created class: Vật lý đại cương A1';
END
ELSE
    PRINT 'Class Vật lý đại cương A1 already exists';

-- Class 4: Hóa học cơ bản A1 (upcoming - 0/24 sessions)
IF NOT EXISTS (SELECT 1 FROM CLASSES WHERE CODE = 'HHCB-A1-2025-08')
BEGIN
    INSERT INTO CLASSES (
        CODE, NAME, COURSE_ID, TEACHER_ID,
        START_DATE, END_DATE,
        SCHEDULE_DAYS, SCHEDULE_TIME, CLASSROOM,
        CAPACITY, CURRENT_STUDENTS,
        STATUS, CREATED_AT
    )
    VALUES (
        'HHCB-A1-2025-08',
        N'Hóa học cơ bản A1',
        @Course4Id,
        @Teacher4Id,
        '2025-08-01',
        '2025-11-01',
        'FRIDAY,SUNDAY',
        '18:00-20:00',
        'P.202',
        35,
        15,
        'PLANNING',
        GETDATE()
    );
    PRINT 'Created class: Hóa học cơ bản A1';
END
ELSE
    PRINT 'Class Hóa học cơ bản A1 already exists';

-- Class 5: Python cơ bản (upcoming - 0/16 sessions)
IF NOT EXISTS (SELECT 1 FROM CLASSES WHERE CODE = 'PYTHON-CB-2025-07')
BEGIN
    INSERT INTO CLASSES (
        CODE, NAME, COURSE_ID, TEACHER_ID,
        START_DATE, END_DATE,
        SCHEDULE_DAYS, SCHEDULE_TIME, CLASSROOM,
        CAPACITY, CURRENT_STUDENTS,
        STATUS, CREATED_AT
    )
    VALUES (
        'PYTHON-CB-2025-07',
        N'Python cơ bản',
        @Course5Id,
        @Teacher1Id,
        '2025-07-15',
        '2025-09-15',
        'TUESDAY,SATURDAY',
        '18:00-20:00',
        'P.301',
        20,
        18,
        'PLANNING',
        GETDATE()
    );
    PRINT 'Created class: Python cơ bản';
END
ELSE
    PRINT 'Class Python cơ bản already exists';

-- Class 6: Văn học và sáng tác (ongoing - 6/24 sessions)
IF NOT EXISTS (SELECT 1 FROM CLASSES WHERE CODE = 'VHST-2025-06')
BEGIN
    INSERT INTO CLASSES (
        CODE, NAME, COURSE_ID, TEACHER_ID,
        START_DATE, END_DATE,
        SCHEDULE_DAYS, SCHEDULE_TIME, CLASSROOM,
        CAPACITY, CURRENT_STUDENTS,
        STATUS, CREATED_AT
    )
    VALUES (
        'VHST-2025-06',
        N'Văn học và sáng tác',
        @Course6Id,
        @Teacher2Id,
        '2025-06-15',
        '2025-09-15',
        'WEDNESDAY,FRIDAY',
        '18:00-20:00',
        'P.302',
        15,
        10,
        'ACTIVE',
        GETDATE()
    );
    PRINT 'Created class: Văn học và sáng tác';
END
ELSE
    PRINT 'Class Văn học và sáng tác already exists';

GO

-- Verify the data
SELECT 
    c.ID,
    c.CODE,
    c.NAME,
    co.name as course_name,
    u.full_name as teacher_name,
    c.START_DATE,
    c.END_DATE,
    c.SCHEDULE_DAYS,
    c.SCHEDULE_TIME,
    c.CLASSROOM,
    c.CURRENT_STUDENTS,
    c.CAPACITY,
    c.STATUS
FROM CLASSES c
INNER JOIN COURSES co ON c.COURSE_ID = co.ID
INNER JOIN TEACHERS t ON c.TEACHER_ID = t.ID
INNER JOIN USERS u ON t.USER_ID = u.ID
WHERE c.CODE IN (
    'TNA1-2025-06',
    'TAGT-B1-2025-07',
    'VLDC-A1-2025-05',
    'HHCB-A1-2025-08',
    'PYTHON-CB-2025-07',
    'VHST-2025-06'
)
ORDER BY c.START_DATE;

PRINT '';
PRINT '==============================================';
PRINT 'Classes imported successfully!';
PRINT 'Total classes: 6';
PRINT 'Courses created/verified: 6';
PRINT '==============================================';
