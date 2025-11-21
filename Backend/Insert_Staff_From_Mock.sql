-- Insert Staff from Mock Data (Staff.tsx)
-- This script adds 6 staff members matching the frontend mock data

USE DMT_EDUCATION_SYSTEM;
GO

-- Staff 1: Nguyễn Văn An - Quản lý (Ban Giám đốc)
IF NOT EXISTS (SELECT 1 FROM USERS WHERE EMAIL = 'nguyenvanan@dmt.edu.vn')
BEGIN
    INSERT INTO USERS (ROLE_ID, EMAIL, PASSWORD_HASH, FULL_NAME, PHONE, STATUS, CREATED_AT)
    VALUES (
        2, -- STAFF role
        'nguyenvanan@dmt.edu.vn',
        '$2b$10$K7l8rX9qP3mN5wV2tY4uZ.eH6jF8kL9mN3pQ5rS7tU9vW1xY3zA5B', -- Staff@123
        N'Nguyễn Văn An',
        '0912345678',
        1, -- ACTIVE
        GETDATE()
    );
    
    DECLARE @UserId1 INT = SCOPE_IDENTITY();
    
    INSERT INTO STAFF (USER_ID, STAFF_CODE, DEPARTMENT, POSITION, CREATED_AT)
    VALUES (@UserId1, 'NV2018001', N'Ban Giám đốc', N'Quản lý', GETDATE());
    
    PRINT 'Created staff: Nguyễn Văn An (NV2018001)';
END
ELSE
    PRINT 'Staff Nguyễn Văn An already exists';

-- Staff 2: Trần Thị Bình - Kế toán (Tài chính)
IF NOT EXISTS (SELECT 1 FROM USERS WHERE EMAIL = 'tranthibinh.kt@dmt.edu.vn')
BEGIN
    INSERT INTO USERS (ROLE_ID, EMAIL, PASSWORD_HASH, FULL_NAME, PHONE, STATUS, CREATED_AT)
    VALUES (
        2, -- STAFF role
        'tranthibinh.kt@dmt.edu.vn',
        '$2b$10$K7l8rX9qP3mN5wV2tY4uZ.eH6jF8kL9mN3pQ5rS7tU9vW1xY3zA5B', -- Staff@123
        N'Trần Thị Bình',
        '0923456789',
        1, -- ACTIVE
        GETDATE()
    );
    
    DECLARE @UserId2 INT = SCOPE_IDENTITY();
    
    INSERT INTO STAFF (USER_ID, STAFF_CODE, DEPARTMENT, POSITION, CREATED_AT)
    VALUES (@UserId2, 'NV2019001', N'Tài chính', N'Kế toán', GETDATE());
    
    PRINT 'Created staff: Trần Thị Bình (NV2019001)';
END
ELSE
    PRINT 'Staff Trần Thị Bình already exists';

-- Staff 3: Lê Văn Cường - IT
IF NOT EXISTS (SELECT 1 FROM USERS WHERE EMAIL = 'levancuong.it@dmt.edu.vn')
BEGIN
    INSERT INTO USERS (ROLE_ID, EMAIL, PASSWORD_HASH, FULL_NAME, PHONE, STATUS, CREATED_AT)
    VALUES (
        2, -- STAFF role
        'levancuong.it@dmt.edu.vn',
        '$2b$10$K7l8rX9qP3mN5wV2tY4uZ.eH6jF8kL9mN3pQ5rS7tU9vW1xY3zA5B', -- Staff@123
        N'Lê Văn Cường',
        '0934567890',
        1, -- ACTIVE
        GETDATE()
    );
    
    DECLARE @UserId3 INT = SCOPE_IDENTITY();
    
    INSERT INTO STAFF (USER_ID, STAFF_CODE, DEPARTMENT, POSITION, CREATED_AT)
    VALUES (@UserId3, 'NV2020001', N'IT', N'IT', GETDATE());
    
    PRINT 'Created staff: Lê Văn Cường (NV2020001)';
END
ELSE
    PRINT 'Staff Lê Văn Cường already exists';

-- Staff 4: Phạm Thị Dung - Lễ tân (Hành chính)
IF NOT EXISTS (SELECT 1 FROM USERS WHERE EMAIL = 'phamthidung.lt@dmt.edu.vn')
BEGIN
    INSERT INTO USERS (ROLE_ID, EMAIL, PASSWORD_HASH, FULL_NAME, PHONE, STATUS, CREATED_AT)
    VALUES (
        2, -- STAFF role
        'phamthidung.lt@dmt.edu.vn',
        '$2b$10$K7l8rX9qP3mN5wV2tY4uZ.eH6jF8kL9mN3pQ5rS7tU9vW1xY3zA5B', -- Staff@123
        N'Phạm Thị Dung',
        '0945678901',
        1, -- ACTIVE
        GETDATE()
    );
    
    DECLARE @UserId4 INT = SCOPE_IDENTITY();
    
    INSERT INTO STAFF (USER_ID, STAFF_CODE, DEPARTMENT, POSITION, CREATED_AT)
    VALUES (@UserId4, 'NV2021001', N'Hành chính', N'Lễ tân', GETDATE());
    
    PRINT 'Created staff: Phạm Thị Dung (NV2021001)';
END
ELSE
    PRINT 'Staff Phạm Thị Dung already exists';

-- Staff 5: Hoàng Văn Em - Tuyển sinh
IF NOT EXISTS (SELECT 1 FROM USERS WHERE EMAIL = 'hoangvanem@dmt.edu.vn')
BEGIN
    INSERT INTO USERS (ROLE_ID, EMAIL, PASSWORD_HASH, FULL_NAME, PHONE, STATUS, CREATED_AT)
    VALUES (
        2, -- STAFF role
        'hoangvanem@dmt.edu.vn',
        '$2b$10$K7l8rX9qP3mN5wV2tY4uZ.eH6jF8kL9mN3pQ5rS7tU9vW1xY3zA5B', -- Staff@123
        N'Hoàng Văn Em',
        '0956789012',
        1, -- ACTIVE
        GETDATE()
    );
    
    DECLARE @UserId5 INT = SCOPE_IDENTITY();
    
    INSERT INTO STAFF (USER_ID, STAFF_CODE, DEPARTMENT, POSITION, CREATED_AT)
    VALUES (@UserId5, 'NV2020002', N'Tuyển sinh', N'Tuyển sinh', GETDATE());
    
    PRINT 'Created staff: Hoàng Văn Em (NV2020002)';
END
ELSE
    PRINT 'Staff Hoàng Văn Em already exists';

-- Staff 6: Mai Thị Phương - Marketing
IF NOT EXISTS (SELECT 1 FROM USERS WHERE EMAIL = 'maithiphuong.mkt@dmt.edu.vn')
BEGIN
    INSERT INTO USERS (ROLE_ID, EMAIL, PASSWORD_HASH, FULL_NAME, PHONE, STATUS, CREATED_AT)
    VALUES (
        2, -- STAFF role
        'maithiphuong.mkt@dmt.edu.vn',
        '$2b$10$K7l8rX9qP3mN5wV2tY4uZ.eH6jF8kL9mN3pQ5rS7tU9vW1xY3zA5B', -- Staff@123
        N'Mai Thị Phương',
        '0967890123',
        0, -- INACTIVE
        GETDATE()
    );
    
    DECLARE @UserId6 INT = SCOPE_IDENTITY();
    
    INSERT INTO STAFF (USER_ID, STAFF_CODE, DEPARTMENT, POSITION, CREATED_AT)
    VALUES (@UserId6, 'NV2019002', N'Marketing', N'Marketing', GETDATE());
    
    PRINT 'Created staff: Mai Thị Phương (NV2019002)';
END
ELSE
    PRINT 'Staff Mai Thị Phương already exists';

PRINT 'Staff import script completed.';
GO

-- Verify inserted staff
SELECT s.STAFF_CODE, u.FULL_NAME, s.DEPARTMENT, s.POSITION, 
       CASE WHEN u.STATUS = 1 THEN 'ACTIVE' ELSE 'INACTIVE' END AS STATUS
FROM STAFF s
INNER JOIN USERS u ON s.USER_ID = u.ID
WHERE s.STAFF_CODE IN ('NV2018001', 'NV2019001', 'NV2020001', 'NV2021001', 'NV2020002', 'NV2019002')
ORDER BY s.STAFF_CODE;
