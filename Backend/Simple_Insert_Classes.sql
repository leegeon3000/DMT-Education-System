-- Simple Insert Classes - Using Existing Courses
USE DMT_EDUCATION_SYSTEM;
GO

-- Get existing course and teacher IDs
DECLARE @MathCourseId INT = 1;  -- Toán lớp 10
DECLARE @EnglishCourseId INT = 2;  -- Tiếng Anh lớp 11
DECLARE @PhysicsCourseId INT = 3;  -- Vật lý lớp 10
DECLARE @ChemistryCourseId INT = 4;  -- Hóa học lớp 10
DECLARE @LiteratureCourseId INT = 5;  -- Ngữ văn lớp 10

DECLARE @Teacher1Id INT = 6;  -- GV2018001 - Nguyễn Văn Anh
DECLARE @Teacher2Id INT = 7;  -- GV2019001 - Trần Thị Bình
DECLARE @Teacher3Id INT = 8;  -- GV2017001 - Lê Văn Cường
DECLARE @Teacher4Id INT = 9;  -- GV2020001 - Phạm Thị Dung

PRINT 'Starting class inserts...';

-- Class 1: Toán nâng cao A1
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
        @MathCourseId,
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
    PRINT 'Created class: Toán nâng cao A1 (TNA1-2025-06)';
END
ELSE
    PRINT 'Class TNA1-2025-06 already exists';

-- Class 2: Tiếng Anh giao tiếp B1
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
        @EnglishCourseId,
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
    PRINT 'Created class: Tiếng Anh giao tiếp B1 (TAGT-B1-2025-07)';
END
ELSE
    PRINT 'Class TAGT-B1-2025-07 already exists';

-- Class 3: Vật lý đại cương A1
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
        @PhysicsCourseId,
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
    PRINT 'Created class: Vật lý đại cương A1 (VLDC-A1-2025-05)';
END
ELSE
    PRINT 'Class VLDC-A1-2025-05 already exists';

-- Class 4: Hóa học cơ bản A1
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
        @ChemistryCourseId,
        @Teacher4Id,
        '2025-08-01',
        '2025-11-01',
        'WEDNESDAY,FRIDAY',
        '18:00-20:00',
        'P.103',
        35,
        15,
        'PLANNING',
        GETDATE()
    );
    PRINT 'Created class: Hóa học cơ bản A1 (HHCB-A1-2025-08)';
END
ELSE
    PRINT 'Class HHCB-A1-2025-08 already exists';

-- Class 5: Python cơ bản (using Math course as placeholder)
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
        @MathCourseId,  -- Using Math as placeholder
        @Teacher1Id,
        '2025-07-15',
        '2025-10-15',
        'FRIDAY',
        '18:00-20:30',
        'Lab 1',
        20,
        18,
        'PLANNING',
        GETDATE()
    );
    PRINT 'Created class: Python cơ bản (PYTHON-CB-2025-07)';
END
ELSE
    PRINT 'Class PYTHON-CB-2025-07 already exists';

-- Class 6: Văn học và sáng tác
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
        @LiteratureCourseId,
        @Teacher2Id,
        '2025-06-10',
        '2025-09-10',
        'THURSDAY',
        '19:00-21:00',
        'P.104',
        15,
        10,
        'ACTIVE',
        GETDATE()
    );
    PRINT 'Created class: Văn học và sáng tác (VHST-2025-06)';
END
ELSE
    PRINT 'Class VHST-2025-06 already exists';

PRINT 'Class insert script completed.';
GO

-- Verify inserted classes
SELECT CODE, NAME, CAPACITY, CURRENT_STUDENTS, STATUS 
FROM CLASSES 
WHERE CODE IN ('TNA1-2025-06', 'TAGT-B1-2025-07', 'VLDC-A1-2025-05', 'HHCB-A1-2025-08', 'PYTHON-CB-2025-07', 'VHST-2025-06')
ORDER BY CODE;
