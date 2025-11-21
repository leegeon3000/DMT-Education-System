# Backend Scripts Documentation

Các scripts hỗ trợ quản lý database và backend server.

## 📁 Available Scripts

### 1. Test Connection
**File**: `scripts/test-connection.mjs`  
**Usage**: `node scripts/test-connection.mjs`

Kiểm tra kết nối đến SQL Server và hiển thị thông tin:
- ✅ Server version
- 📁 Danh sách databases
- 📊 Danh sách tables (nếu connected đến database cụ thể)
- 📈 Số lượng records trong các bảng chính

**Example:**
```bash
node scripts/test-connection.mjs
```

---

### 2. Create Database
**File**: `scripts/create-database.mjs`  
**Usage**: `node scripts/create-database.mjs`

Tự động:
- 🔍 Kiểm tra database tồn tại
- 🗑️ Drop database cũ (nếu chọn yes)
- 📊 Tạo database mới
- 📝 Import schema từ `Db_DMT_SQLServer.sql`
- ✅ Verify tables đã tạo

**Example:**
```bash
node scripts/create-database.mjs
```

---

### 3. Seed Data
**File**: `scripts/seed-data.mjs`  
**Usage**: `node scripts/seed-data.mjs`

Insert sample data:
- 👥 4 roles (Admin, Staff, Teacher, Student)
- 🔐 4 test users với passwords đã hash
- 📚 3 subjects (Toán, Tiếng Anh, Lập trình)
- 📖 3 courses

**Test Accounts:**
- Admin: `admin@dmt.edu.vn` / `admin123`
- Staff: `staff@dmt.edu.vn` / `staff123`
- Teacher: `teacher@dmt.edu.vn` / `teacher123`
- Student: `student@dmt.edu.vn` / `student123`

**Example:**
```bash
node scripts/seed-data.mjs
```

---

### 4. Start Backend
**File**: `scripts/start-backend.sh`  
**Usage**: `./scripts/start-backend.sh [options]`

Khởi động backend server với:
- ✅ Environment validation
- 🔍 Database connection check
- 🧹 Cleanup old processes
- 🚀 Start server

**Options:**
- `--dev` or `-d`: Development mode with watch (default)
- No flag: Production mode

**Examples:**
```bash
# Development mode (with auto-reload)
./scripts/start-backend.sh --dev

# Production mode
./scripts/start-backend.sh
```

---

### 5. Reset Database
**File**: `scripts/reset-database.sh`  
**Usage**: `./scripts/reset-database.sh`

⚠️ **WARNING**: Xóa toàn bộ data!

Tự động:
1. Drop database cũ
2. Tạo database mới
3. Import schema
4. Seed sample data

**Example:**
```bash
./scripts/reset-database.sh
```

---

## 🚀 Quick Start Guide

### Initial Setup
```bash
# 1. Start SQL Server container (if not running)
docker start dmt-sqlserver

# 2. Test connection
node scripts/test-connection.mjs

# 3. Create database and import schema
node scripts/create-database.mjs

# 4. Seed sample data
node scripts/seed-data.mjs

# 5. Start backend
./scripts/start-backend.sh --dev
```

### Daily Development
```bash
# Just start the backend (database already setup)
./scripts/start-backend.sh --dev
```

### Reset Everything
```bash
# Drop and recreate database with fresh data
./scripts/reset-database.sh
```

---

## 🔧 Configuration

Scripts read configuration from `.env.local`:

```bash
DB_SERVER=localhost
DB_DATABASE=dmt_education_system
DB_USER=sa
DB_PASSWORD=DMTEducation2024
DB_PORT=1433
DB_ENCRYPT=false
DB_TRUST_CERT=true
PORT=3001
```

---

## 🐛 Troubleshooting

### Connection Failed
```bash
# Check SQL Server is running
docker ps | grep sql

# Start SQL Server
docker start dmt-sqlserver

# Test connection
node scripts/test-connection.mjs
```

### Database Not Found
```bash
# Create database
node scripts/create-database.mjs
```

### Authentication Error
- Check `DB_PASSWORD` in `.env.local`
- Verify SQL Server SA password: `docker inspect dmt-sqlserver | grep MSSQL_SA_PASSWORD`

### Port Already in Use
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

---

## 📝 Script Dependencies

All scripts require:
- ✅ Node.js >= 18
- ✅ `mssql` package
- ✅ `bcryptjs` package (for seed-data)
- ✅ `dotenv` package
- ✅ SQL Server running on specified port

---

## 🔐 Security Notes

- ⚠️ Passwords trong scripts là cho **development only**
- ⚠️ **NEVER** commit `.env.local` với production passwords
- ⚠️ Change all default passwords trước khi deploy production

---

## 📚 Related Files

- `Db_DMT_SQLServer.sql` - Database schema
- `.env.local` - Configuration
- `src/utils/database.ts` - Database connection module
- `src/server.ts` - Main server file

---

## 💡 Tips

1. **Always test connection first** trước khi chạy scripts khác
2. **Use reset script** khi cần fresh start
3. **Check logs** trong `/tmp/backend.log` nếu có lỗi
4. **Keep .env.local** cập nhật với đúng credentials

---

**Last Updated**: October 22, 2025
