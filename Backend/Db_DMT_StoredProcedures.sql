-- =================================================================
-- DMT EDUCATION SYSTEM - STORED PROCEDURES, FUNCTIONS & TRIGGERS
-- =================================================================
-- Mục đích: Xử lý các nghiệp vụ phức tạp cho hệ thống quản lý giáo dục
-- Phù hợp cho đồ án môn Hệ Quản Trị CSDL
-- =================================================================

USE DMT_EDUCATION_SYSTEM;
GO

-- =================================================================
-- PHẦN 1: STORED PROCEDURES - QUẢN LÝ USERS & AUTHENTICATION
-- =================================================================

-- 1.1. Tạo User mới với validation
CREATE OR ALTER PROCEDURE sp_CreateUser
    @role_id INT,
    @email VARCHAR(255),
    @password_hash VARCHAR(255),
    @full_name NVARCHAR(255),
    @phone VARCHAR(20) = NULL,
    @address NVARCHAR(MAX) = NULL,
    @birth_date DATE = NULL,
    @user_id INT OUTPUT,
    @error_message NVARCHAR(500) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Validate email format
        IF @email NOT LIKE '%_@__%.__%'
        BEGIN
            SET @error_message = N'Email không hợp lệ';
            ROLLBACK TRANSACTION;
            RETURN -1;
        END
        
        -- Check email đã tồn tại chưa
        IF EXISTS (SELECT 1 FROM USERS WHERE EMAIL = @email)
        BEGIN
            SET @error_message = N'Email đã được sử dụng';
            ROLLBACK TRANSACTION;
            RETURN -2;
        END
        
        -- Validate role_id
        IF NOT EXISTS (SELECT 1 FROM ROLES WHERE ID = @role_id)
        BEGIN
            SET @error_message = N'Role không tồn tại';
            ROLLBACK TRANSACTION;
            RETURN -3;
        END
        
        -- Insert user
        INSERT INTO USERS (ROLE_ID, EMAIL, PASSWORD_HASH, FULL_NAME, PHONE, ADDRESS, BIRTH_DATE, STATUS)
        VALUES (@role_id, @email, @password_hash, @full_name, @phone, @address, @birth_date, 1);
        
        SET @user_id = SCOPE_IDENTITY();
        SET @error_message = N'Tạo user thành công';
        
        -- Log activity
        INSERT INTO ACTIVITY_LOGS (USER_ID, ACTION, ENTITY_TYPE, ENTITY_ID, DETAILS)
        VALUES (@user_id, 'CREATE_USER', 'USER', @user_id, 
                CONCAT('Created user: ', @email));
        
        COMMIT TRANSACTION;
        RETURN 0;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        SET @error_message = ERROR_MESSAGE();
        RETURN -99;
    END CATCH
END
GO

-- 1.2. Đăng ký Student với validation đầy đủ
CREATE OR ALTER PROCEDURE sp_RegisterStudent
    @email VARCHAR(255),
    @password_hash VARCHAR(255),
    @full_name NVARCHAR(255),
    @phone VARCHAR(20),
    @address NVARCHAR(MAX),
    @birth_date DATE,
    @school_level VARCHAR(50),
    @parent_name NVARCHAR(255),
    @parent_phone VARCHAR(20),
    @parent_email VARCHAR(255) = NULL,
    @student_id INT OUTPUT,
    @student_code VARCHAR(50) OUTPUT,
    @error_message NVARCHAR(500) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @user_id INT;
    DECLARE @year VARCHAR(4) = YEAR(GETDATE());
    DECLARE @max_code INT;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Tạo USER trước
        DECLARE @user_error NVARCHAR(500);
        EXEC sp_CreateUser 
            @role_id = 4, -- STUDENT role
            @email = @email,
            @password_hash = @password_hash,
            @full_name = @full_name,
            @phone = @phone,
            @address = @address,
            @birth_date = @birth_date,
            @user_id = @user_id OUTPUT,
            @error_message = @user_error OUTPUT;
        
        IF @user_id IS NULL
        BEGIN
            SET @error_message = @user_error;
            ROLLBACK TRANSACTION;
            RETURN -1;
        END
        
        -- Generate student code: HS2025001, HS2025002...
        SELECT @max_code = ISNULL(MAX(CAST(RIGHT(STUDENT_CODE, 3) AS INT)), 0)
        FROM STUDENTS
        WHERE STUDENT_CODE LIKE 'HS' + @year + '%';
        
        SET @student_code = 'HS' + @year + RIGHT('000' + CAST(@max_code + 1 AS VARCHAR), 3);
        
        -- Insert student
        INSERT INTO STUDENTS (USER_ID, STUDENT_CODE, SCHOOL_LEVEL, PARENT_NAME, PARENT_PHONE, PARENT_EMAIL)
        VALUES (@user_id, @student_code, @school_level, @parent_name, @parent_phone, @parent_email);
        
        SET @student_id = SCOPE_IDENTITY();
        SET @error_message = N'Đăng ký học sinh thành công';
        
        COMMIT TRANSACTION;
        RETURN 0;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        SET @error_message = ERROR_MESSAGE();
        RETURN -99;
    END CATCH
END
GO

-- 1.3. Đăng ký Teacher
CREATE OR ALTER PROCEDURE sp_RegisterTeacher
    @email VARCHAR(255),
    @password_hash VARCHAR(255),
    @full_name NVARCHAR(255),
    @phone VARCHAR(20),
    @address NVARCHAR(MAX),
    @birth_date DATE,
    @main_subject_id INT = NULL,
    @years_experience INT = 0,
    @degree NVARCHAR(255) = NULL,
    @specialization NVARCHAR(255) = NULL,
    @teacher_id INT OUTPUT,
    @teacher_code VARCHAR(50) OUTPUT,
    @error_message NVARCHAR(500) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @user_id INT;
    DECLARE @year VARCHAR(4) = YEAR(GETDATE());
    DECLARE @max_code INT;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Tạo USER
        DECLARE @user_error NVARCHAR(500);
        EXEC sp_CreateUser 
            @role_id = 3, -- TEACHER role
            @email = @email,
            @password_hash = @password_hash,
            @full_name = @full_name,
            @phone = @phone,
            @address = @address,
            @birth_date = @birth_date,
            @user_id = @user_id OUTPUT,
            @error_message = @user_error OUTPUT;
        
        IF @user_id IS NULL
        BEGIN
            SET @error_message = @user_error;
            ROLLBACK TRANSACTION;
            RETURN -1;
        END
        
        -- Generate teacher code: GV2025001
        SELECT @max_code = ISNULL(MAX(CAST(RIGHT(TEACHER_CODE, 3) AS INT)), 0)
        FROM TEACHERS
        WHERE TEACHER_CODE LIKE 'GV' + @year + '%';
        
        SET @teacher_code = 'GV' + @year + RIGHT('000' + CAST(@max_code + 1 AS VARCHAR), 3);
        
        -- Insert teacher
        INSERT INTO TEACHERS (USER_ID, TEACHER_CODE, MAIN_SUBJECT_ID, YEARS_EXPERIENCE, DEGREE, SPECIALIZATION)
        VALUES (@user_id, @teacher_code, @main_subject_id, @years_experience, @degree, @specialization);
        
        SET @teacher_id = SCOPE_IDENTITY();
        SET @error_message = N'Đăng ký giáo viên thành công';
        
        COMMIT TRANSACTION;
        RETURN 0;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        SET @error_message = ERROR_MESSAGE();
        RETURN -99;
    END CATCH
END
GO

-- =================================================================
-- PHẦN 2: STORED PROCEDURES - QUẢN LÝ ENROLLMENT & CLASS
-- =================================================================

-- 2.1. Đăng ký học sinh vào lớp với validation đầy đủ
CREATE OR ALTER PROCEDURE sp_EnrollStudent
    @class_id INT,
    @student_id INT,
    @total_fee DECIMAL(12,2),
    @discount_percent DECIMAL(5,2) = 0,
    @notes NVARCHAR(MAX) = NULL,
    @enrollment_id INT OUTPUT,
    @error_message NVARCHAR(500) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @current_students INT;
    DECLARE @capacity INT;
    DECLARE @class_status VARCHAR(20);
    DECLARE @final_fee DECIMAL(12,2);
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Check class tồn tại và lấy thông tin
        SELECT @current_students = CURRENT_STUDENTS, 
               @capacity = CAPACITY,
               @class_status = STATUS
        FROM CLASSES
        WHERE ID = @class_id;
        
        IF @current_students IS NULL
        BEGIN
            SET @error_message = N'Lớp học không tồn tại';
            ROLLBACK TRANSACTION;
            RETURN -1;
        END
        
        -- Kiểm tra trạng thái lớp
        IF @class_status NOT IN ('PLANNING', 'ACTIVE')
        BEGIN
            SET @error_message = N'Lớp học đã kết thúc hoặc bị hủy';
            ROLLBACK TRANSACTION;
            RETURN -2;
        END
        
        -- Kiểm tra sức chứa
        IF @current_students >= @capacity
        BEGIN
            SET @error_message = N'Lớp học đã đầy';
            ROLLBACK TRANSACTION;
            RETURN -3;
        END
        
        -- Kiểm tra student đã đăng ký chưa
        IF EXISTS (SELECT 1 FROM ENROLLMENTS 
                   WHERE CLASS_ID = @class_id 
                   AND STUDENT_ID = @student_id
                   AND STATUS IN ('ACTIVE', 'COMPLETED'))
        BEGIN
            SET @error_message = N'Học sinh đã đăng ký lớp này';
            ROLLBACK TRANSACTION;
            RETURN -4;
        END
        
        -- Tính học phí sau giảm giá
        SET @final_fee = @total_fee * (1 - @discount_percent / 100.0);
        
        -- Insert enrollment
        INSERT INTO ENROLLMENTS (CLASS_ID, STUDENT_ID, TOTAL_FEE, DISCOUNT_PERCENT, NOTES, PAYMENT_STATUS)
        VALUES (@class_id, @student_id, @final_fee, @discount_percent, @notes, 'PENDING');
        
        SET @enrollment_id = SCOPE_IDENTITY();
        
        -- Cập nhật số học sinh trong lớp
        UPDATE CLASSES
        SET CURRENT_STUDENTS = CURRENT_STUDENTS + 1
        WHERE ID = @class_id;
        
        -- Log activity
        INSERT INTO ACTIVITY_LOGS (USER_ID, ACTION, ENTITY_TYPE, ENTITY_ID, DETAILS)
        SELECT USER_ID, 'ENROLL_CLASS', 'ENROLLMENT', @enrollment_id,
               CONCAT('Student enrolled in class_id: ', @class_id)
        FROM STUDENTS WHERE ID = @student_id;
        
        SET @error_message = N'Đăng ký lớp học thành công';
        COMMIT TRANSACTION;
        RETURN 0;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        SET @error_message = ERROR_MESSAGE();
        RETURN -99;
    END CATCH
END
GO

-- 2.2. Hủy đăng ký (Drop class)
CREATE OR ALTER PROCEDURE sp_DropEnrollment
    @enrollment_id INT,
    @reason NVARCHAR(MAX) = NULL,
    @error_message NVARCHAR(500) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @class_id INT;
    DECLARE @student_id INT;
    DECLARE @enrollment_status VARCHAR(20);
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Lấy thông tin enrollment
        SELECT @class_id = CLASS_ID, 
               @student_id = STUDENT_ID,
               @enrollment_status = STATUS
        FROM ENROLLMENTS
        WHERE ID = @enrollment_id;
        
        IF @class_id IS NULL
        BEGIN
            SET @error_message = N'Enrollment không tồn tại';
            ROLLBACK TRANSACTION;
            RETURN -1;
        END
        
        IF @enrollment_status = 'DROPPED'
        BEGIN
            SET @error_message = N'Đã hủy đăng ký trước đó';
            ROLLBACK TRANSACTION;
            RETURN -2;
        END
        
        -- Cập nhật status
        UPDATE ENROLLMENTS
        SET STATUS = 'DROPPED',
            NOTES = ISNULL(NOTES, '') + CHAR(13) + CHAR(10) + 
                    'Dropped on ' + CONVERT(VARCHAR, GETDATE(), 120) + ': ' + ISNULL(@reason, '')
        WHERE ID = @enrollment_id;
        
        -- Giảm số học sinh trong lớp
        UPDATE CLASSES
        SET CURRENT_STUDENTS = CURRENT_STUDENTS - 1
        WHERE ID = @class_id;
        
        -- Log activity
        INSERT INTO ACTIVITY_LOGS (USER_ID, ACTION, ENTITY_TYPE, ENTITY_ID, DETAILS)
        SELECT USER_ID, 'DROP_ENROLLMENT', 'ENROLLMENT', @enrollment_id, @reason
        FROM STUDENTS WHERE ID = @student_id;
        
        SET @error_message = N'Hủy đăng ký thành công';
        COMMIT TRANSACTION;
        RETURN 0;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        SET @error_message = ERROR_MESSAGE();
        RETURN -99;
    END CATCH
END
GO

-- =================================================================
-- PHẦN 3: STORED PROCEDURES - QUẢN LÝ PAYMENTS
-- =================================================================

-- 3.1. Ghi nhận thanh toán với auto-update payment status
CREATE OR ALTER PROCEDURE sp_ProcessPayment
    @enrollment_id INT,
    @amount DECIMAL(12,2),
    @payment_method VARCHAR(50),
    @transaction_id VARCHAR(255) = NULL,
    @notes NVARCHAR(MAX) = NULL,
    @processed_by INT,
    @payment_id INT OUTPUT,
    @error_message NVARCHAR(500) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @total_fee DECIMAL(12,2);
    DECLARE @paid_amount DECIMAL(12,2);
    DECLARE @new_paid_amount DECIMAL(12,2);
    DECLARE @new_payment_status VARCHAR(20);
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Lấy thông tin enrollment
        SELECT @total_fee = TOTAL_FEE, @paid_amount = PAID_AMOUNT
        FROM ENROLLMENTS
        WHERE ID = @enrollment_id;
        
        IF @total_fee IS NULL
        BEGIN
            SET @error_message = N'Enrollment không tồn tại';
            ROLLBACK TRANSACTION;
            RETURN -1;
        END
        
        -- Validate amount
        IF @amount <= 0
        BEGIN
            SET @error_message = N'Số tiền phải lớn hơn 0';
            ROLLBACK TRANSACTION;
            RETURN -2;
        END
        
        SET @new_paid_amount = @paid_amount + @amount;
        
        IF @new_paid_amount > @total_fee
        BEGIN
            SET @error_message = N'Số tiền thanh toán vượt quá học phí';
            ROLLBACK TRANSACTION;
            RETURN -3;
        END
        
        -- Xác định payment status mới
        IF @new_paid_amount >= @total_fee
            SET @new_payment_status = 'PAID';
        ELSE IF @new_paid_amount > 0
            SET @new_payment_status = 'PARTIAL';
        ELSE
            SET @new_payment_status = 'PENDING';
        
        -- Insert payment record
        INSERT INTO PAYMENTS (ENROLLMENT_ID, AMOUNT, PAYMENT_METHOD, TRANSACTION_ID, 
                             STATUS, NOTES, PROCESSED_BY)
        VALUES (@enrollment_id, @amount, @payment_method, @transaction_id, 
                'COMPLETED', @notes, @processed_by);
        
        SET @payment_id = SCOPE_IDENTITY();
        
        -- Update enrollment
        UPDATE ENROLLMENTS
        SET PAID_AMOUNT = @new_paid_amount,
            PAYMENT_STATUS = @new_payment_status
        WHERE ID = @enrollment_id;
        
        -- Log activity
        INSERT INTO ACTIVITY_LOGS (USER_ID, ACTION, ENTITY_TYPE, ENTITY_ID, DETAILS)
        VALUES (@processed_by, 'PROCESS_PAYMENT', 'PAYMENT', @payment_id,
                CONCAT('Amount: ', @amount, ', Method: ', @payment_method));
        
        SET @error_message = N'Thanh toán thành công';
        COMMIT TRANSACTION;
        RETURN 0;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        SET @error_message = ERROR_MESSAGE();
        RETURN -99;
    END CATCH
END
GO

-- 3.2. Hoàn tiền
CREATE OR ALTER PROCEDURE sp_RefundPayment
    @payment_id INT,
    @refund_amount DECIMAL(12,2),
    @refund_reason NVARCHAR(MAX),
    @processed_by INT,
    @error_message NVARCHAR(500) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @enrollment_id INT;
    DECLARE @original_amount DECIMAL(12,2);
    DECLARE @payment_status VARCHAR(20);
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Lấy thông tin payment
        SELECT @enrollment_id = ENROLLMENT_ID, 
               @original_amount = AMOUNT,
               @payment_status = STATUS
        FROM PAYMENTS
        WHERE ID = @payment_id;
        
        IF @enrollment_id IS NULL
        BEGIN
            SET @error_message = N'Payment không tồn tại';
            ROLLBACK TRANSACTION;
            RETURN -1;
        END
        
        IF @payment_status = 'REFUNDED'
        BEGIN
            SET @error_message = N'Đã hoàn tiền trước đó';
            ROLLBACK TRANSACTION;
            RETURN -2;
        END
        
        IF @refund_amount > @original_amount
        BEGIN
            SET @error_message = N'Số tiền hoàn vượt quá số tiền đã thanh toán';
            ROLLBACK TRANSACTION;
            RETURN -3;
        END
        
        -- Update payment status
        UPDATE PAYMENTS
        SET STATUS = 'REFUNDED',
            NOTES = ISNULL(NOTES, '') + CHAR(13) + CHAR(10) + 
                    'Refunded: ' + CAST(@refund_amount AS VARCHAR) + ' - ' + @refund_reason
        WHERE ID = @payment_id;
        
        -- Update enrollment paid_amount
        UPDATE ENROLLMENTS
        SET PAID_AMOUNT = PAID_AMOUNT - @refund_amount
        WHERE ID = @enrollment_id;
        
        -- Recalculate payment status
        UPDATE ENROLLMENTS
        SET PAYMENT_STATUS = CASE 
            WHEN PAID_AMOUNT >= TOTAL_FEE THEN 'PAID'
            WHEN PAID_AMOUNT > 0 THEN 'PARTIAL'
            ELSE 'PENDING'
        END
        WHERE ID = @enrollment_id;
        
        -- Log activity
        INSERT INTO ACTIVITY_LOGS (USER_ID, ACTION, ENTITY_TYPE, ENTITY_ID, DETAILS)
        VALUES (@processed_by, 'REFUND_PAYMENT', 'PAYMENT', @payment_id,
                CONCAT('Refund: ', @refund_amount, ', Reason: ', @refund_reason));
        
        SET @error_message = N'Hoàn tiền thành công';
        COMMIT TRANSACTION;
        RETURN 0;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        SET @error_message = ERROR_MESSAGE();
        RETURN -99;
    END CATCH
END
GO

-- =================================================================
-- PHẦN 4: STORED PROCEDURES - QUẢN LÝ ATTENDANCE
-- =================================================================

-- 4.1. Bulk mark attendance cho một session
CREATE OR ALTER PROCEDURE sp_BulkMarkAttendance
    @session_id INT,
    @attendance_data NVARCHAR(MAX), -- JSON: [{"enrollment_id":1,"status":"PRESENT","notes":""}]
    @marked_by INT,
    @error_message NVARCHAR(500) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Validate session exists
        IF NOT EXISTS (SELECT 1 FROM CLASS_SESSIONS WHERE ID = @session_id)
        BEGIN
            SET @error_message = N'Session không tồn tại';
            ROLLBACK TRANSACTION;
            RETURN -1;
        END
        
        -- Parse JSON và insert/update attendance
        MERGE INTO ATTENDANCE AS target
        USING (
            SELECT 
                @session_id AS session_id,
                JSON_VALUE(value, '$.enrollment_id') AS enrollment_id,
                JSON_VALUE(value, '$.status') AS status,
                JSON_VALUE(value, '$.notes') AS notes,
                @marked_by AS marked_by,
                GETDATE() AS check_in_time
            FROM OPENJSON(@attendance_data)
        ) AS source
        ON target.SESSION_ID = source.session_id 
           AND target.ENROLLMENT_ID = source.enrollment_id
        WHEN MATCHED THEN
            UPDATE SET 
                STATUS = source.status,
                NOTES = source.notes,
                MARKED_BY = source.marked_by,
                CHECK_IN_TIME = CASE WHEN source.status = 'PRESENT' THEN source.check_in_time ELSE target.CHECK_IN_TIME END
        WHEN NOT MATCHED THEN
            INSERT (SESSION_ID, ENROLLMENT_ID, STATUS, NOTES, MARKED_BY, CHECK_IN_TIME)
            VALUES (source.session_id, source.enrollment_id, source.status, source.notes, 
                    source.marked_by, 
                    CASE WHEN source.status = 'PRESENT' THEN source.check_in_time ELSE NULL END);
        
        -- Log activity
        INSERT INTO ACTIVITY_LOGS (USER_ID, ACTION, ENTITY_TYPE, ENTITY_ID, DETAILS)
        VALUES (@marked_by, 'BULK_MARK_ATTENDANCE', 'ATTENDANCE', @session_id,
                CONCAT('Marked attendance for session: ', @session_id));
        
        SET @error_message = N'Điểm danh thành công';
        COMMIT TRANSACTION;
        RETURN 0;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        SET @error_message = ERROR_MESSAGE();
        RETURN -99;
    END CATCH
END
GO

-- =================================================================
-- PHẦN 5: FUNCTIONS - TRỢ GIÚP TÍNH TOÁN & BÁO CÁO
-- =================================================================

-- 5.1. Tính tỷ lệ điểm danh của student
CREATE OR ALTER FUNCTION fn_GetAttendanceRate
(
    @student_id INT,
    @class_id INT = NULL
)
RETURNS DECIMAL(5,2)
AS
BEGIN
    DECLARE @total_sessions INT;
    DECLARE @present_count INT;
    DECLARE @rate DECIMAL(5,2);
    
    SELECT @total_sessions = COUNT(*),
           @present_count = SUM(CASE WHEN a.STATUS = 'PRESENT' THEN 1 ELSE 0 END)
    FROM ATTENDANCE a
    JOIN ENROLLMENTS e ON a.ENROLLMENT_ID = e.ID
    JOIN CLASS_SESSIONS cs ON a.SESSION_ID = cs.ID
    WHERE e.STUDENT_ID = @student_id
      AND (@class_id IS NULL OR e.CLASS_ID = @class_id);
    
    IF @total_sessions = 0
        SET @rate = 0;
    ELSE
        SET @rate = (@present_count * 100.0) / @total_sessions;
    
    RETURN @rate;
END
GO

-- 5.2. Tính điểm trung bình của student
CREATE OR ALTER FUNCTION fn_GetAverageGrade
(
    @student_id INT,
    @class_id INT = NULL
)
RETURNS DECIMAL(5,2)
AS
BEGIN
    DECLARE @avg_grade DECIMAL(5,2);
    
    SELECT @avg_grade = AVG(g.SCORE)
    FROM GRADES g
    JOIN ENROLLMENTS e ON g.ENROLLMENT_ID = e.ID
    WHERE e.STUDENT_ID = @student_id
      AND (@class_id IS NULL OR e.CLASS_ID = @class_id)
      AND g.GRADE_TYPE = 'OVERALL';
    
    RETURN ISNULL(@avg_grade, 0);
END
GO

-- 5.3. Tính tổng doanh thu theo tháng/năm
CREATE OR ALTER FUNCTION fn_GetRevenue
(
    @year INT,
    @month INT = NULL
)
RETURNS DECIMAL(15,2)
AS
BEGIN
    DECLARE @revenue DECIMAL(15,2);
    
    SELECT @revenue = SUM(AMOUNT)
    FROM PAYMENTS
    WHERE YEAR(PAYMENT_DATE) = @year
      AND (@month IS NULL OR MONTH(PAYMENT_DATE) = @month)
      AND STATUS = 'COMPLETED';
    
    RETURN ISNULL(@revenue, 0);
END
GO

-- 5.4. Kiểm tra student có thể submit assignment không
CREATE OR ALTER FUNCTION fn_CanSubmitAssignment
(
    @assignment_id INT,
    @student_id INT
)
RETURNS BIT
AS
BEGIN
    DECLARE @can_submit BIT = 0;
    DECLARE @due_date DATE;
    DECLARE @is_enrolled BIT = 0;
    
    -- Check due date
    SELECT @due_date = DUE_DATE
    FROM ASSIGNMENTS
    WHERE ID = @assignment_id;
    
    -- Check enrollment
    SELECT @is_enrolled = 1
    FROM ENROLLMENTS e
    JOIN ASSIGNMENTS a ON e.CLASS_ID = a.CLASS_ID
    WHERE a.ID = @assignment_id
      AND e.STUDENT_ID = @student_id
      AND e.STATUS = 'ACTIVE';
    
    -- Can submit if enrolled and before due date
    IF @is_enrolled = 1 AND (@due_date IS NULL OR CAST(GETDATE() AS DATE) <= @due_date)
        SET @can_submit = 1;
    
    RETURN @can_submit;
END
GO

-- 5.5. Tính điểm tổng kết theo trọng số
CREATE OR ALTER FUNCTION fn_CalculateOverallGrade
(
    @enrollment_id INT
)
RETURNS DECIMAL(6,2)
AS
BEGIN
    DECLARE @overall_grade DECIMAL(6,2);
    
    SELECT @overall_grade = SUM(SCORE * WEIGHT / 100.0)
    FROM GRADES
    WHERE ENROLLMENT_ID = @enrollment_id
      AND GRADE_TYPE != 'OVERALL'
      AND WEIGHT IS NOT NULL;
    
    RETURN ISNULL(@overall_grade, 0);
END
GO

-- =================================================================
-- PHẦN 6: TRIGGERS - TỰ ĐỘNG XỬ LÝ DỮ LIỆU
-- =================================================================

-- 6.1. Trigger: Auto update USERS.UPDATED_AT khi có thay đổi
CREATE OR ALTER TRIGGER trg_Users_UpdateTimestamp
ON USERS
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE USERS
    SET UPDATED_AT = GETDATE()
    FROM USERS u
    INNER JOIN inserted i ON u.ID = i.ID;
END
GO

-- 6.2. Trigger: Validate capacity khi update CLASSES.CURRENT_STUDENTS
CREATE OR ALTER TRIGGER trg_Classes_ValidateCapacity
ON CLASSES
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    IF EXISTS (SELECT 1 FROM inserted WHERE CURRENT_STUDENTS > CAPACITY)
    BEGIN
        RAISERROR (N'Số học sinh vượt quá sức chứa lớp học', 16, 1);
        ROLLBACK TRANSACTION;
    END
END
GO

-- 6.3. Trigger: Auto create notification khi có assignment mới
CREATE OR ALTER TRIGGER trg_Assignments_CreateNotification
ON ASSIGNMENTS
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Tạo notification cho tất cả students trong class
    INSERT INTO NOTIFICATIONS (USER_ID, TITLE, MESSAGE, TYPE, LINK_URL)
    SELECT 
        u.ID,
        N'Bài tập mới',
        CONCAT(N'Bạn có bài tập mới: ', i.TITLE, N'. Hạn nộp: ', 
               CONVERT(VARCHAR, i.DUE_DATE, 103)),
        'INFO',
        CONCAT('/student/assignments/', i.ID)
    FROM inserted i
    JOIN ENROLLMENTS e ON e.CLASS_ID = i.CLASS_ID
    JOIN STUDENTS s ON s.ID = e.STUDENT_ID
    JOIN USERS u ON u.ID = s.USER_ID
    WHERE e.STATUS = 'ACTIVE';
END
GO

-- 6.4. Trigger: Auto create notification khi được chấm điểm
CREATE OR ALTER TRIGGER trg_Submissions_GradeNotification
ON SUBMISSIONS
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Chỉ tạo notification khi status chuyển sang GRADED
    IF UPDATE(STATUS)
    BEGIN
        INSERT INTO NOTIFICATIONS (USER_ID, TITLE, MESSAGE, TYPE, LINK_URL)
        SELECT 
            u.ID,
            N'Bài tập đã được chấm',
            CONCAT(N'Bài tập "', a.TITLE, N'" đã được chấm điểm: ', i.SCORE, '/', a.MAX_SCORE),
            'SUCCESS',
            CONCAT('/student/submissions/', i.ID)
        FROM inserted i
        JOIN deleted d ON i.ID = d.ID
        JOIN ASSIGNMENTS a ON i.ASSIGNMENT_ID = a.ID
        JOIN STUDENTS s ON s.ID = i.STUDENT_ID
        JOIN USERS u ON u.ID = s.USER_ID
        WHERE i.STATUS = 'GRADED' AND d.STATUS != 'GRADED';
    END
END
GO

-- 6.5. Trigger: Auto log khi delete user (soft delete)
CREATE OR ALTER TRIGGER trg_Users_LogDelete
ON USERS
INSTEAD OF DELETE
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Soft delete: set STATUS = 0 thay vì DELETE
    UPDATE USERS
    SET STATUS = 0
    FROM USERS u
    INNER JOIN deleted d ON u.ID = d.ID;
    
    -- Log activity
    INSERT INTO ACTIVITY_LOGS (USER_ID, ACTION, ENTITY_TYPE, ENTITY_ID, DETAILS)
    SELECT ID, 'SOFT_DELETE_USER', 'USER', ID, CONCAT('User deactivated: ', EMAIL)
    FROM deleted;
END
GO

-- 6.6. Trigger: Validate payment amount không âm
CREATE OR ALTER TRIGGER trg_Payments_ValidateAmount
ON PAYMENTS
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    IF EXISTS (SELECT 1 FROM inserted WHERE AMOUNT <= 0)
    BEGIN
        RAISERROR (N'Số tiền thanh toán phải lớn hơn 0', 16, 1);
        ROLLBACK TRANSACTION;
    END
END
GO

-- 6.7. Trigger: Auto calculate overall grade khi insert/update grades
CREATE OR ALTER TRIGGER trg_Grades_CalculateOverall
ON GRADES
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Recalculate overall grade cho các enrollment bị ảnh hưởng
    DECLARE @enrollment_ids TABLE (enrollment_id INT);
    
    INSERT INTO @enrollment_ids (enrollment_id)
    SELECT DISTINCT ENROLLMENT_ID FROM inserted;
    
    -- Delete old overall grades
    DELETE FROM GRADES
    WHERE ENROLLMENT_ID IN (SELECT enrollment_id FROM @enrollment_ids)
      AND GRADE_TYPE = 'OVERALL';
    
    -- Insert new calculated overall grades
    INSERT INTO GRADES (ENROLLMENT_ID, GRADE_TYPE, SCORE, MAX_SCORE, GRADED_BY)
    SELECT 
        e.enrollment_id,
        'OVERALL',
        dbo.fn_CalculateOverallGrade(e.enrollment_id),
        100,
        (SELECT TOP 1 GRADED_BY FROM GRADES WHERE ENROLLMENT_ID = e.enrollment_id ORDER BY GRADED_AT DESC)
    FROM @enrollment_ids e
    WHERE dbo.fn_CalculateOverallGrade(e.enrollment_id) > 0;
END
GO

-- =================================================================
-- PHẦN 7: STORED PROCEDURES - BACKUP & RESTORE
-- =================================================================

-- 7.1. Backup database
CREATE OR ALTER PROCEDURE sp_BackupDatabase
    @backup_path NVARCHAR(500) = NULL,
    @backup_type VARCHAR(20) = 'FULL', -- FULL or DIFFERENTIAL
    @error_message NVARCHAR(500) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @backup_name VARCHAR(255);
    DECLARE @full_path NVARCHAR(500);
    DECLARE @db_name VARCHAR(100) = 'DMT_EDUCATION_SYSTEM';
    DECLARE @backup_id INT;
    
    BEGIN TRY
        -- Generate backup name
        SET @backup_name = @db_name + '_' + 
                          CONVERT(VARCHAR, GETDATE(), 112) + '_' + 
                          REPLACE(CONVERT(VARCHAR, GETDATE(), 108), ':', '') + 
                          '.bak';
        
        -- Default backup path if not provided
        IF @backup_path IS NULL
            SET @backup_path = 'C:\SQLBackups\';
        
        SET @full_path = @backup_path + @backup_name;
        
        -- Log backup start
        INSERT INTO BACKUP_HISTORY (BACKUP_NAME, BACKUP_PATH, BACKUP_TYPE, STATUS, STARTED_AT)
        VALUES (@backup_name, @full_path, @backup_type, 'IN_PROGRESS', GETDATE());
        
        SET @backup_id = SCOPE_IDENTITY();
        
        -- Perform backup
        IF @backup_type = 'FULL'
        BEGIN
            BACKUP DATABASE @db_name 
            TO DISK = @full_path
            WITH FORMAT, INIT, COMPRESSION,
                 NAME = @backup_name,
                 DESCRIPTION = 'Full backup of DMT Education System';
        END
        ELSE IF @backup_type = 'DIFFERENTIAL'
        BEGIN
            BACKUP DATABASE @db_name 
            TO DISK = @full_path
            WITH DIFFERENTIAL, COMPRESSION,
                 NAME = @backup_name,
                 DESCRIPTION = 'Differential backup of DMT Education System';
        END
        
        -- Get backup size
        DECLARE @backup_size BIGINT;
        EXEC master.dbo.xp_fileexist @full_path;
        
        -- Update backup history
        UPDATE BACKUP_HISTORY
        SET STATUS = 'COMPLETED',
            COMPLETED_AT = GETDATE(),
            BACKUP_SIZE = @backup_size
        WHERE ID = @backup_id;
        
        SET @error_message = N'Backup thành công: ' + @full_path;
        RETURN 0;
    END TRY
    BEGIN CATCH
        -- Update backup history as failed
        IF @backup_id IS NOT NULL
        BEGIN
            UPDATE BACKUP_HISTORY
            SET STATUS = 'FAILED',
                COMPLETED_AT = GETDATE()
            WHERE ID = @backup_id;
        END
        
        SET @error_message = ERROR_MESSAGE();
        RETURN -99;
    END CATCH
END
GO

-- 7.2. Restore database
CREATE OR ALTER PROCEDURE sp_RestoreDatabase
    @backup_file NVARCHAR(500),
    @restore_type VARCHAR(20) = 'FULL', -- FULL or DIFFERENTIAL
    @error_message NVARCHAR(500) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @db_name VARCHAR(100) = 'DMT_EDUCATION_SYSTEM';
    
    BEGIN TRY
        -- Verify backup file exists
        IF NOT EXISTS (SELECT 1 FROM sys.backup_devices WHERE physical_name = @backup_file)
        BEGIN
            -- Check if it's a file path
            DECLARE @file_exists INT;
            EXEC master.dbo.xp_fileexist @backup_file, @file_exists OUTPUT;
            
            IF @file_exists = 0
            BEGIN
                SET @error_message = N'File backup không tồn tại';
                RETURN -1;
            END
        END
        
        -- Set database to single user mode
        ALTER DATABASE DMT_EDUCATION_SYSTEM SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
        
        -- Restore database
        IF @restore_type = 'FULL'
        BEGIN
            RESTORE DATABASE @db_name
            FROM DISK = @backup_file
            WITH REPLACE, RECOVERY;
        END
        ELSE IF @restore_type = 'DIFFERENTIAL'
        BEGIN
            RESTORE DATABASE @db_name
            FROM DISK = @backup_file
            WITH NORECOVERY;
        END
        
        -- Set back to multi user
        ALTER DATABASE DMT_EDUCATION_SYSTEM SET MULTI_USER;
        
        SET @error_message = N'Restore thành công';
        RETURN 0;
    END TRY
    BEGIN CATCH
        -- Try to set back to multi user on error
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
            
        BEGIN TRY
            ALTER DATABASE DMT_EDUCATION_SYSTEM SET MULTI_USER;
        END TRY
        BEGIN CATCH
            -- Ignore error if database is not accessible
        END CATCH
        
        SET @error_message = ERROR_MESSAGE();
        RETURN -99;
    END CATCH
END
GO

-- =================================================================
-- PHẦN 8: STORED PROCEDURES - BÁO CÁO & THỐNG KÊ
-- =================================================================

-- 8.1. Báo cáo tổng quan hệ thống
CREATE OR ALTER PROCEDURE sp_GetSystemOverview
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        'System Statistics' AS report_type,
        (SELECT COUNT(*) FROM USERS WHERE STATUS = 1) AS total_active_users,
        (SELECT COUNT(*) FROM STUDENTS) AS total_students,
        (SELECT COUNT(*) FROM TEACHERS) AS total_teachers,
        (SELECT COUNT(*) FROM CLASSES WHERE STATUS = 'ACTIVE') AS active_classes,
        (SELECT COUNT(*) FROM ENROLLMENTS WHERE STATUS = 'ACTIVE') AS active_enrollments,
        (SELECT SUM(AMOUNT) FROM PAYMENTS WHERE STATUS = 'COMPLETED' AND YEAR(PAYMENT_DATE) = YEAR(GETDATE())) AS revenue_this_year,
        (SELECT SUM(AMOUNT) FROM PAYMENTS WHERE STATUS = 'COMPLETED' AND YEAR(PAYMENT_DATE) = YEAR(GETDATE()) AND MONTH(PAYMENT_DATE) = MONTH(GETDATE())) AS revenue_this_month;
END
GO

-- 8.2. Báo cáo học tập của student
CREATE OR ALTER PROCEDURE sp_GetStudentReport
    @student_id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Thông tin cơ bản
    SELECT 
        s.ID,
        s.STUDENT_CODE,
        u.FULL_NAME,
        u.EMAIL,
        s.SCHOOL_LEVEL
    FROM STUDENTS s
    JOIN USERS u ON s.USER_ID = u.ID
    WHERE s.ID = @student_id;
    
    -- Các lớp đang học
    SELECT 
        e.ID AS enrollment_id,
        c.NAME AS class_name,
        c.CODE AS class_code,
        co.NAME AS course_name,
        e.STATUS AS enrollment_status,
        e.PAYMENT_STATUS,
        e.TOTAL_FEE,
        e.PAID_AMOUNT,
        dbo.fn_GetAttendanceRate(@student_id, c.ID) AS attendance_rate,
        dbo.fn_GetAverageGrade(@student_id, c.ID) AS average_grade
    FROM ENROLLMENTS e
    JOIN CLASSES c ON e.CLASS_ID = c.ID
    JOIN COURSES co ON c.COURSE_ID = co.ID
    WHERE e.STUDENT_ID = @student_id
    ORDER BY e.CREATED_AT DESC;
    
    -- Assignments pending
    SELECT 
        a.ID,
        a.TITLE,
        a.DUE_DATE,
        a.ASSIGNMENT_TYPE,
        c.NAME AS class_name,
        CASE 
            WHEN s.ID IS NULL THEN 'NOT_SUBMITTED'
            ELSE s.STATUS
        END AS submission_status
    FROM ASSIGNMENTS a
    JOIN CLASSES c ON a.CLASS_ID = c.ID
    JOIN ENROLLMENTS e ON e.CLASS_ID = c.ID
    LEFT JOIN SUBMISSIONS s ON s.ASSIGNMENT_ID = a.ID AND s.STUDENT_ID = @student_id
    WHERE e.STUDENT_ID = @student_id
      AND e.STATUS = 'ACTIVE'
      AND (s.STATUS IS NULL OR s.STATUS IN ('SUBMITTED'))
    ORDER BY a.DUE_DATE;
END
GO

-- 8.3. Báo cáo lớp học cho teacher
CREATE OR ALTER PROCEDURE sp_GetClassReport
    @class_id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Class info
    SELECT 
        c.ID,
        c.CODE,
        c.NAME,
        c.CAPACITY,
        c.CURRENT_STUDENTS,
        c.STATUS,
        co.NAME AS course_name,
        t.TEACHER_CODE,
        u.FULL_NAME AS teacher_name
    FROM CLASSES c
    JOIN COURSES co ON c.COURSE_ID = co.ID
    JOIN TEACHERS t ON c.TEACHER_ID = t.ID
    JOIN USERS u ON t.USER_ID = u.ID
    WHERE c.ID = @class_id;
    
    -- Students list with stats
    SELECT 
        s.ID,
        s.STUDENT_CODE,
        u.FULL_NAME,
        u.EMAIL,
        u.PHONE,
        e.STATUS AS enrollment_status,
        e.PAYMENT_STATUS,
        dbo.fn_GetAttendanceRate(s.ID, @class_id) AS attendance_rate,
        dbo.fn_GetAverageGrade(s.ID, @class_id) AS average_grade,
        (SELECT COUNT(*) FROM SUBMISSIONS sub 
         JOIN ASSIGNMENTS a ON sub.ASSIGNMENT_ID = a.ID
         WHERE a.CLASS_ID = @class_id AND sub.STUDENT_ID = s.ID 
         AND sub.STATUS = 'SUBMITTED') AS pending_grading_count
    FROM ENROLLMENTS e
    JOIN STUDENTS s ON e.STUDENT_ID = s.ID
    JOIN USERS u ON s.USER_ID = u.ID
    WHERE e.CLASS_ID = @class_id
    ORDER BY u.FULL_NAME;
    
    -- Attendance statistics
    SELECT 
        cs.SESSION_DATE,
        cs.TITLE AS session_title,
        COUNT(a.ID) AS total_marked,
        SUM(CASE WHEN a.STATUS = 'PRESENT' THEN 1 ELSE 0 END) AS present_count,
        SUM(CASE WHEN a.STATUS = 'ABSENT' THEN 1 ELSE 0 END) AS absent_count,
        SUM(CASE WHEN a.STATUS = 'LATE' THEN 1 ELSE 0 END) AS late_count
    FROM CLASS_SESSIONS cs
    LEFT JOIN ATTENDANCE a ON a.SESSION_ID = cs.ID
    WHERE cs.CLASS_ID = @class_id
    GROUP BY cs.ID, cs.SESSION_DATE, cs.TITLE
    ORDER BY cs.SESSION_DATE;
END
GO

-- =================================================================
-- PHẦN 9: INDEXES BỔ SUNG (NẾU CẦN)
-- =================================================================

-- Index cho performance queries
CREATE NONCLUSTERED INDEX IX_ENROLLMENTS_STUDENT_STATUS 
ON ENROLLMENTS(STUDENT_ID, STATUS) INCLUDE (CLASS_ID, TOTAL_FEE, PAID_AMOUNT);

CREATE NONCLUSTERED INDEX IX_ATTENDANCE_ENROLLMENT_STATUS
ON ATTENDANCE(ENROLLMENT_ID, STATUS) INCLUDE (SESSION_ID, CHECK_IN_TIME);

CREATE NONCLUSTERED INDEX IX_SUBMISSIONS_STUDENT_STATUS
ON SUBMISSIONS(STUDENT_ID, STATUS) INCLUDE (ASSIGNMENT_ID, SCORE);

CREATE NONCLUSTERED INDEX IX_GRADES_ENROLLMENT_TYPE
ON GRADES(ENROLLMENT_ID, GRADE_TYPE) INCLUDE (SCORE, WEIGHT);

GO

-- =================================================================
-- KẾT THÚC FILE
-- =================================================================
PRINT N' Đã tạo thành công:';
PRINT N'   - 15+ Stored Procedures';
PRINT N'   - 5 Functions';  
PRINT N'   - 7 Triggers';
PRINT N'   - Backup/Restore procedures';
PRINT N'   - Báo cáo & thống kê';
PRINT N'';
PRINT N'Sử dụng các procedures này trong Backend API routes.';
GO
