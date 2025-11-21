# DMT Education System

Hệ thống quản lý trung tâm giáo dục toàn diện, được phát triển với React, TypeScript, và SQL Server.

## Tổng quan

DMT Education System là một nền tảng quản lý giáo dục đầy đủ chức năng, hỗ trợ quản lý học sinh, giáo viên, lớp học, nhân viên, và các hoạt động giáo dục. Hệ thống cung cấp giao diện người dùng hiện đại, responsive và tích hợp với cơ sở dữ liệu SQL Server.

## Công nghệ sử dụng

### Frontend
- **React 18** - Thư viện UI
- **TypeScript** - Type safety
- **Vite** - Build tool và dev server
- **TailwindCSS** - Styling framework
- **Redux Toolkit** - State management
- **React Router v6** - Routing
- **Axios** - HTTP client
- **React Query** - Data fetching và caching

### Backend
- **Fastify** - Web framework hiệu năng cao
- **TypeScript** - Type safety
- **SQL Server** - Database
- **mssql** - SQL Server driver
- **bcrypt** - Password hashing
- **jsonwebtoken** - Authentication
- **Nodemailer** - Email service

## Tính năng chính

### Quản trị viên (Admin)
- Dashboard tổng quan với thống kê và biểu đồ
- Quản lý học sinh, giáo viên, lớp học, nhân viên
- Quản lý khóa học và chương trình đào tạo
- Báo cáo tài chính và thanh toán
- Báo cáo điểm danh và hiệu suất
- Phân tích dữ liệu và thống kê
- Quản lý người dùng và phân quyền

### Giáo viên
- Dashboard cá nhân với lịch dạy
- Quản lý lớp học và học sinh
- Điểm danh trực tuyến
- Quản lý bài tập và chấm điểm
- Quản lý tài liệu giảng dạy
- Báo cáo tiến độ học sinh
- Khảo sát và đánh giá

### Học sinh
- Dashboard cá nhân với tiến độ học tập
- Xem lịch học và điểm danh
- Truy cập tài liệu học tập
- Nộp bài tập trực tuyến
- Xem điểm và bảng điểm
- Thanh toán học phí
- Thông báo và tin tức

### Nhân viên (Staff)
- Dashboard công việc hàng ngày
- Đăng ký học sinh mới
- Quản lý tuyển sinh
- Xử lý thanh toán và học phí
- Quản lý lịch học
- Hỗ trợ khách hàng
- Báo cáo doanh thu

## Cấu trúc dự án

```
dmt-edu-ui/
├── Backend/                    # Backend API server
│   ├── src/
│   │   ├── routes/            # API endpoints
│   │   ├── services/          # Business logic
│   │   ├── middleware/        # Authentication, validation
│   │   ├── utils/             # Database, helpers
│   │   └── plugins/           # Fastify plugins
│   ├── scripts/               # Database setup scripts
│   ├── Db_DMT_SQLServer.sql  # Database schema
│   └── Db_DMT_StoredProcedures.sql
│
├── src/                       # Frontend source code
│   ├── components/           
│   │   ├── admin/            # Admin components
│   │   ├── common/           # Shared components
│   │   ├── layout/           # Layout components
│   │   ├── teacher/          # Teacher components
│   │   └── staff/            # Staff components
│   │
│   ├── features/             # Feature modules
│   │   ├── admin/            # Admin pages
│   │   ├── students/         # Student pages
│   │   ├── teachers/         # Teacher pages
│   │   ├── staff/            # Staff pages
│   │   └── auth/             # Authentication
│   │
│   ├── services/             # API client services
│   ├── store/                # Redux store
│   ├── hooks/                # Custom React hooks
│   ├── types/                # TypeScript types
│   ├── routes/               # Route configuration
│   └── utils/                # Utility functions
│
├── public/                    # Static assets
│   └── images/               # Images (teachers, students, events)
│
└── scripts/                   # Development scripts
```

## Cài đặt và chạy

### Yêu cầu hệ thống
- **Node.js** >= 18.x
- **npm** >= 9.x
- **SQL Server** 2019 hoặc mới hơn
- **Docker** (khuyến nghị cho macOS/Linux để chạy SQL Server)

### Hướng dẫn cài đặt từ đầu (cho người mới)

#### Bước 1: Clone repository
```bash
git clone https://github.com/leegeon3000/DMT-Education-System.git
cd dmt-edu-ui
```

#### Bước 2: Cài đặt dependencies

```bash
# Frontend dependencies
npm install

# Backend dependencies
cd Backend
npm install
cd ..
```

#### Bước 3: Setup SQL Server

**Option A: Sử dụng Docker (Khuyến nghị cho macOS/Linux)**

```bash
# Pull và chạy SQL Server container
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=Password123!" \
  -p 1433:1433 --name dmt-sqlserver \
  -d mcr.microsoft.com/mssql/server:2019-latest

# Chờ 15 giây để SQL Server khởi động
sleep 15
```

**Option B: SQL Server đã cài sẵn trên Windows**

Bỏ qua bước này nếu đã có SQL Server. Đảm bảo:
- SQL Server đang chạy
- SQL Server Authentication enabled
- Biết `sa` password hoặc có admin account

#### Bước 4: Cấu hình môi trường

**Frontend - Tạo file `.env` trong thư mục gốc:**
```env
VITE_API_URL=http://localhost:3001
VITE_GOOGLE_CLIENT_ID=optional_google_oauth_id
VITE_GOOGLE_CLIENT_SECRET=optional_google_oauth_secret
```

**Backend - Tạo file `Backend/.env`:**
```env
# Database Configuration
DB_SERVER=localhost
DB_NAME=DMT_EDUCATION_SYSTEM
DB_USER=sa
DB_PASSWORD=Password123!
DB_PORT=1433

# Server Configuration
PORT=3001
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# Email Configuration (Optional - có thể bỏ qua)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Google OAuth (Optional - có thể bỏ qua)
GOOGLE_CLIENT_ID=optional_google_oauth_id
GOOGLE_CLIENT_SECRET=optional_google_oauth_secret
```

**LƯU Ý**: 
- Nếu dùng Docker, password là `Password123!`
- Nếu dùng SQL Server có sẵn, thay đổi `DB_PASSWORD` theo password thực tế
- **Windows users**: Nếu dùng SQL Server Express, `DB_SERVER` có thể là `localhost\\SQLEXPRESS`
- Google OAuth là optional, không bắt buộc

#### Bước 5: Thiết lập Database

**QUAN TRỌNG**: Bước này tạo database, tables, stored procedures và import dữ liệu mẫu.

**Option A: Node.js script (Khuyến nghị - chạy được trên mọi OS)**

```bash
cd Backend/scripts
node fresh-install.mjs
cd ../..
```

**Option B: Shell script (chỉ macOS/Linux)**

```bash
cd Backend/scripts
chmod +x setup-database-complete.sh
./setup-database-complete.sh
cd ../..
```

**Option C: Manual setup trên Windows**

```cmd
cd Backend

REM 1. Tạo database và schema
sqlcmd -S localhost\SQLEXPRESS -U sa -P "Password123!" -d master -i Db_DMT_SQLServer.sql

REM 2. Cài đặt stored procedures
sqlcmd -S localhost\SQLEXPRESS -U sa -P "Password123!" -d DMT_EDUCATION_SYSTEM -i Db_DMT_StoredProcedures.sql

REM 3. Import dữ liệu mẫu
sqlcmd -S localhost\SQLEXPRESS -U sa -P "Password123!" -d DMT_EDUCATION_SYSTEM -i Db_DMT_Complete_Sample_Data.sql

cd ..
```

**Lưu ý Windows users:**
- Thay `localhost\SQLEXPRESS` bằng instance name thực tế của bạn
- Nếu không rõ instance name, dùng `localhost` hoặc `(local)`
- Có thể dùng SSMS để chạy các file .sql thủ công (Open File → Execute)

**Option D: Sử dụng SQL Server Management Studio (SSMS)**

1. Mở SSMS và connect đến SQL Server
2. File → Open → File → chọn `Backend/Db_DMT_SQLServer.sql` → Execute
3. Đổi database sang `DMT_EDUCATION_SYSTEM` (dropdown ở toolbar)
4. File → Open → File → chọn `Backend/Db_DMT_StoredProcedures.sql` → Execute
5. File → Open → File → chọn `Backend/Db_DMT_Complete_Sample_Data.sql` → Execute

**Kiểm tra database đã setup thành công:**
```bash
cd Backend
node scripts/quick-test.mjs
```

Nếu thấy output hiển thị số lượng users, students, teachers... thì database đã OK!

#### Bước 6: Chạy ứng dụng

**QUAN TRỌNG**: Cần chạy cả Backend VÀ Frontend cùng lúc.

**Option A: Script tự động - macOS/Linux**

```bash
# Từ thư mục gốc
chmod +x start-dev.sh stop-dev.sh
./start-dev.sh
```

Để dừng:
```bash
./stop-dev.sh
```

**Option B: Script tự động - Windows (Khuyến nghị)**

**Batch Script (Command Prompt):**
```cmd
REM Double-click start-dev.bat
REM Hoặc chạy trong CMD:
start-dev.bat

REM Để dừng:
stop-dev.bat
```

**PowerShell Script:**
```powershell
# Right-click start-dev.ps1 → Run with PowerShell
# Hoặc chạy trong PowerShell:
.\start-dev.ps1

# Để dừng:
.\stop-dev.ps1
```

**Lưu ý Windows:** Nếu gặp lỗi execution policy:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Option C: Chạy thủ công (mọi OS) - cần 2 terminals**

Terminal 1 - Backend:
```bash
cd Backend
npm run dev
```

Chờ đến khi thấy: `Server listening on http://localhost:3001`

Terminal 2 - Frontend:
```bash
npm run dev
# hoặc
npm start
```

**Scripts tự động sẽ:**
- Kiểm tra SQL Server đang chạy
- Dọn dẹp processes cũ
- Khởi động Backend (port 3001)
- Khởi động Frontend (port 5173)
- Hiển thị thông tin và tài khoản demo
- Kiểm tra và khởi động SQL Server (nếu dùng Docker)
- Dọn dẹp processes cũ
- Khởi động Backend server (port 3001)
- Khởi động Frontend server (port 5173)
- Hiển thị thông tin truy cập và tài khoản demo

**Option B: Chạy thủ công (cần 2 terminals)**

Terminal 1 - Backend:
```bash
cd Backend
npm run dev
```

Chờ đến khi thấy: `Server listening on http://localhost:3001`

Terminal 2 - Frontend:
```bash
npm run dev
# hoặc
npm start
```

#### Bước 7: Truy cập ứng dụng

Mở browser và truy cập:
- **Ứng dụng chính**: http://localhost:5173
- **Backend API**: http://localhost:3001

### Tài khoản đăng nhập

Sau khi setup xong, đăng nhập bằng các tài khoản sau:

**Admin (Quản trị viên)**
- Email: `admin@dmt.edu.vn`
- Password: `Admin@123`
- Quyền: Toàn quyền quản lý hệ thống

**Nhân viên (Staff)**
- Email: `staff1@dmt.edu.vn`
- Password: `Staff@123`
- Quyền: Đăng ký học sinh, xử lý thanh toán, hỗ trợ

**Giáo viên (Teacher)**
- Email: `teacher.math@dmt.edu.vn`
- Password: `Teacher@123`
- Quyền: Quản lý lớp học, điểm danh, chấm điểm

**Học sinh (Student)**
- Email: `student001@gmail.com`
- Password: `Student@123`
- Quyền: Xem điểm, tài liệu, nộp bài

Chi tiết đầy đủ các tài khoản xem tại: `Z-docs/DEMO_ACCOUNTS.md`

---

## Tóm tắt nhanh (Quick Start)

### macOS/Linux (Docker)

```bash
# 1. Clone và install
git clone https://github.com/leegeon3000/DMT-Education-System.git
cd dmt-edu-ui
npm install
cd Backend && npm install && cd ..

# 2. Start SQL Server (Docker)
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=Password123!" \
  -p 1433:1433 --name dmt-sqlserver -d mcr.microsoft.com/mssql/server:2019-latest
sleep 15

# 3. Setup database
cd Backend/scripts
node fresh-install.mjs
cd ../..

# 4. Configure env
cp .env.example .env
cp Backend/.env.example Backend/.env
# Edit Backend/.env: DB_PASSWORD=Password123!

# 5. Start application
./start-dev.sh

# 6. Access: http://localhost:5173
# Login: admin@dmt.edu.vn / Admin@123
```

### Windows (SQL Server Express)

```cmd
REM 1. Clone và install
git clone https://github.com/leegeon3000/DMT-Education-System.git
cd dmt-edu-ui
npm install
cd Backend
npm install
cd ..

REM 2. Cài SQL Server Express (nếu chưa có)
REM Download: https://www.microsoft.com/en-us/sql-server/sql-server-downloads

REM 3. Setup database
cd Backend\scripts
node fresh-install.mjs
cd ..\..

REM 4. Configure env files
copy .env.example .env
copy Backend\.env.example Backend\.env
REM Edit Backend\.env với Notepad:
REM   DB_SERVER=localhost\SQLEXPRESS
REM   DB_PASSWORD=your_sa_password

REM 5. Start application - SỬ DỤNG SCRIPT Tự ĐỘNG
start-dev.bat
REM Hoặc PowerShell:
REM .\start-dev.ps1

REM 6. Access: http://localhost:5173
REM Login: admin@dmt.edu.vn / Admin@123

REM Để dừng:
REM stop-dev.bat
```

---

## Dừng ứng dụng

**macOS/Linux:**
```bash
./stop-dev.sh
```

**Windows Batch:**
```cmd
stop-dev.bat
```

**Windows PowerShell:**
```powershell
.\stop-dev.ps1
```

**Manual (mọi OS):**
```bash
# macOS/Linux
pkill -f "tsx watch"  # Stop backend
pkill -f "vite"       # Stop frontend

# Windows CMD
taskkill /F /IM node.exe

# Windows PowerShell
Get-Process node | Stop-Process -Force
```

---

## Kiểm tra hệ thống

```bash
# Xem log realtime
tail -f backend.log
tail -f frontend.log

# Kiểm tra services đang chạy
./scripts/status-dev.sh

# Health check
./scripts/health-check.sh

# Test database connection
cd Backend
node scripts/quick-test.mjs
```

---

## Xử lý sự cố (Troubleshooting)

### 1. Backend không kết nối được Database

```bash
# Kiểm tra SQL Server đang chạy
docker ps | grep dmt-sqlserver

# Nếu không chạy, start lại
docker start dmt-sqlserver

# Test connection
cd Backend
node scripts/quick-test.mjs

# Kiểm tra credentials
cat Backend/.env | grep DB_
```

**Lỗi thường gặp:**
- `Login failed for user 'sa'` - Sai password trong `.env`
- `Cannot open database` - Database chưa được tạo, chạy lại setup
- `Connection refused` - SQL Server chưa chạy hoặc sai port

### 2. Frontend không gọi được API

```bash
# Kiểm tra backend đang chạy
curl http://localhost:3001/health

# Kiểm tra CORS settings
cat Backend/src/server.ts | grep cors

# Kiểm tra environment
cat .env | grep VITE_API_URL
```

**Lỗi thường gặp:**
- `Network Error` - Backend chưa chạy
- `CORS policy` - Cần enable CORS trong backend
- `404 Not Found` - Sai URL trong `.env`

### 3. Script start-dev.sh không chạy

```bash
# Cấp quyền thực thi
chmod +x start-dev.sh stop-dev.sh

# Kiểm tra processes đang chạy
ps aux | grep -E "tsx|vite"

# Kill processes cũ
./stop-dev.sh

# Start lại
./start-dev.sh
```

### 4. Database setup failed

```bash
# Option 1: Reset database hoàn toàn
cd Backend/scripts
node fresh-install.mjs

# Option 2: Reset manual
docker exec -it dmt-sqlserver /opt/mssql-tools/bin/sqlcmd \
  -S localhost -U sa -P "Password123!" \
  -Q "DROP DATABASE IF EXISTS DMT_EDUCATION_SYSTEM"

# Sau đó setup lại
./setup-database-complete.sh
```

### 5. Port đã được sử dụng

**macOS/Linux:**
```bash
# Kiểm tra port 3001 (Backend)
lsof -ti:3001 | xargs kill -9

# Kiểm tra port 5173 (Frontend)
lsof -ti:5173 | xargs kill -9

# Kiểm tra port 1433 (SQL Server)
lsof -ti:1433
```

**Windows:**
```cmd
REM Tìm process đang dùng port
netstat -ano | findstr :3001
netstat -ano | findstr :5173
netstat -ano | findstr :1433

REM Kill process (thay <PID> bằng Process ID từ lệnh trên)
taskkill /PID <PID> /F

REM Ví dụ:
REM netstat -ano | findstr :3001
REM   TCP    0.0.0.0:3001    0.0.0.0:0    LISTENING    12345
REM taskkill /PID 12345 /F
```

### 6. sqlcmd không tìm thấy (Windows)

```cmd
REM Download và cài SQL Server Command Line Tools:
REM https://docs.microsoft.com/en-us/sql/tools/sqlcmd-utility

REM Hoặc dùng SSMS để chạy SQL scripts (khuyến nghị cho Windows)
```

Chi tiết đầy đủ xem tại: `Z-docs/TROUBLESHOOTING.md`

---

### Nhân viên
- Email: `staff1@dmt.edu.vn`
- Password: `Staff@123`

Chi tiết đầy đủ xem tại: `Z-docs/DEMO_ACCOUNTS.md`

## API Documentation

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Lấy thông tin user

### Students
- `GET /api/students` - Danh sách học sinh
- `GET /api/students/:id` - Chi tiết học sinh
- `POST /api/students` - Tạo học sinh mới
- `PUT /api/students/:id` - Cập nhật học sinh
- `DELETE /api/students/:id` - Xóa học sinh

### Teachers
- `GET /api/teachers` - Danh sách giáo viên
- `GET /api/teachers/:id` - Chi tiết giáo viên
- `POST /api/teachers` - Tạo giáo viên mới
- `PUT /api/teachers/:id` - Cập nhật giáo viên

### Classes
- `GET /api/classes` - Danh sách lớp học
- `GET /api/classes/:id` - Chi tiết lớp học
- `POST /api/classes` - Tạo lớp mới
- `PUT /api/classes/:id` - Cập nhật lớp

### Staff
- `GET /api/staff` - Danh sách nhân viên
- `GET /api/staff/:id` - Chi tiết nhân viên

Chi tiết đầy đủ xem tại: `Backend/README_API.md`

## Database Schema

Hệ thống sử dụng SQL Server với các bảng chính:

### Core Tables
- `USERS` - Người dùng hệ thống
- `STUDENTS` - Học sinh
- `TEACHERS` - Giáo viên
- `STAFF` - Nhân viên
- `CLASSES` - Lớp học
- `COURSES` - Khóa học
- `SUBJECTS` - Môn học

### Academic Tables
- `ENROLLMENTS` - Đăng ký học
- `ATTENDANCE` - Điểm danh
- `ASSIGNMENTS` - Bài tập
- `GRADES` - Điểm số
- `SCHEDULES` - Lịch học

### Administrative Tables
- `PAYMENTS` - Thanh toán
- `INVOICES` - Hóa đơn
- `NOTIFICATIONS` - Thông báo
- `NEWS` - Tin tức
- `ACTIVITY_LOGS` - Nhật ký hoạt động

Chi tiết schema và stored procedures xem tại:
- `Backend/DATABASE_DOCUMENTATION.md`
- `Backend/STORED_PROCEDURES_GUIDE.md`

## Scripts hữu ích

### Development
```bash
npm run dev              # Chạy frontend dev server
npm run build           # Build production
npm run preview         # Preview production build
npm run type-check      # Kiểm tra TypeScript

cd Backend
npm run dev             # Chạy backend dev server
npm run build           # Build backend
npm start               # Chạy production backend
```

### Database Management
```bash
cd Backend/scripts

# Tạo database mới
node create-database.mjs

# Reset database
./reset-database.sh

# Import sample data
node seed-data.mjs

# Generate password hash
node generate-password-hash.mjs

# Install stored procedures
./install-procedures.sh
```

### System Utilities
```bash
# Kiểm tra trạng thái hệ thống
./scripts/status-dev.sh

# Health check
./scripts/health-check.sh

# Dừng tất cả services
./stop-dev.sh
```

## Migration Progress

### Completed (5/11 Admin Pages)
- Dashboard - Tổng quan hệ thống
- Students - Quản lý học sinh
- Teachers - Quản lý giáo viên
- Classes - Quản lý lớp học
- Staff - Quản lý nhân viên

### In Progress
- Payments - Quản lý thanh toán
- Finance Report - Báo cáo tài chính
- Attendance - Báo cáo điểm danh
- Performance - Báo cáo hiệu suất
- Analytics - Phân tích dữ liệu
- Settings - Cài đặt hệ thống

## Troubleshooting

### Backend không kết nối được Database
```bash
# Kiểm tra SQL Server đang chạy
docker ps | grep sql

# Test connection
cd Backend
node scripts/test-connection.mjs

# Kiểm tra credentials trong .env
cat Backend/.env | grep DB_
```

### Frontend không gọi được API
```bash
# Kiểm tra backend đang chạy
curl http://localhost:3001/health

# Kiểm tra CORS settings
cat Backend/src/server.ts | grep cors

# Kiểm tra environment variables
cat .env | grep VITE_API_URL
```

### Build errors
```bash
# Clear cache và reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite
npm run dev
```

Chi tiết đầy đủ xem tại: `Z-docs/TROUBLESHOOTING.md`

## Git Workflow

### Branch strategy
- `master` - Production branch
- `feature/*` - Feature development
- `hotfix/*` - Emergency fixes

### Commit conventions
```bash
feat: Thêm tính năng mới
fix: Sửa lỗi
docs: Cập nhật documentation
style: Format code
refactor: Refactor code
test: Thêm tests
chore: Maintenance tasks
```

Chi tiết xem tại: `Z-docs/GIT_COMMIT_GUIDE.md`

## Documentation

- `Backend/README_API.md` - API documentation
- `Backend/DATABASE_DOCUMENTATION.md` - Database schema
- `Backend/STORED_PROCEDURES_GUIDE.md` - Stored procedures guide
- `Backend/SQLSERVER_SETUP.md` - SQL Server setup
- `Z-docs/CREDENTIALS.md` - System credentials
- `Z-docs/DEMO_ACCOUNTS.md` - Demo account list
- `Z-docs/TROUBLESHOOTING.md` - Common issues
- `Z-docs/SRS.md` - Software requirements specification

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is private and proprietary to DMT Education Center.

## Support

For support, please contact:
- Email: support@dmt.edu.vn
- Phone: +84 xxx xxx xxx

## Team

Developed by DMT Education Center Development Team

---

Last updated: November 2025