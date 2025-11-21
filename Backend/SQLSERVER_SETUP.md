# Hướng dẫn chuyển sang SQL Server

## 📋 Yêu cầu

Bạn cần cài đặt một trong các phương án sau:

### Option 1: SQL Server Express (Miễn phí - Khuyến nghị cho Development)
```bash
# macOS - Sử dụng Docker
docker pull mcr.microsoft.com/mssql/server:2022-latest

# Chạy SQL Server trong Docker
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=YourStrong@Passw0rd" \
   -p 1433:1433 --name sqlserver2022 \
   -d mcr.microsoft.com/mssql/server:2022-latest
```

### Option 2: Azure SQL Database (Cloud)
- Truy cập https://portal.azure.com
- Tạo Azure SQL Database mới
- Lấy connection string

### Option 3: SQL Server trên Windows
- Download SQL Server Express từ Microsoft
- Cài đặt SQL Server Management Studio (SSMS)

## 🔧 Cấu hình Backend

### 1. Cập nhật file `.env.local`

File đã được cập nhật với config SQL Server:

```bash
# Database Configuration - SQL Server
DB_SERVER=localhost          # hoặc địa chỉ server của bạn
DB_DATABASE=dmt_education_system
DB_USER=sa                   # username SQL Server
DB_PASSWORD=YourStrong@Passw0rd  # Thay bằng password của bạn
DB_PORT=1433
DB_ENCRYPT=false            # true nếu dùng Azure SQL
DB_TRUST_CERT=true          # true cho local dev
```

### 2. Cài đặt dependencies

```bash
cd Backend
npm install mssql @types/mssql
```

✅ **Đã hoàn tất** - Package đã được cài đặt

### 3. Tạo Database Schema

#### Sử dụng Azure Data Studio (Khuyến nghị cho macOS):

1. Download Azure Data Studio: https://docs.microsoft.com/en-us/sql/azure-data-studio/download
2. Kết nối đến SQL Server:
   - Server: `localhost`
   - User: `sa`
   - Password: `YourStrong@Passw0rd`
3. Tạo database mới:
   ```sql
   CREATE DATABASE dmt_education_system;
   ```
4. Mở file `Db_DMT_SQLServer.sql` và chạy

#### Sử dụng sqlcmd (Command line):

```bash
# Kết nối và tạo database
sqlcmd -S localhost -U sa -P 'YourStrong@Passw0rd' -Q "CREATE DATABASE dmt_education_system"

# Import schema
sqlcmd -S localhost -U sa -P 'YourStrong@Passw0rd' -d dmt_education_system -i Backend/Db_DMT_SQLServer.sql
```

#### Sử dụng Docker exec:

```bash
# Copy file SQL vào container
docker cp Backend/Db_DMT_SQLServer.sql sqlserver2022:/tmp/

# Chạy script
docker exec -it sqlserver2022 /opt/mssql-tools/bin/sqlcmd \
   -S localhost -U sa -P 'YourStrong@Passw0rd' \
   -Q "CREATE DATABASE dmt_education_system"

docker exec -it sqlserver2022 /opt/mssql-tools/bin/sqlcmd \
   -S localhost -U sa -P 'YourStrong@Passw0rd' \
   -d dmt_education_system -i /tmp/Db_DMT_SQLServer.sql
```

## 🚀 Khởi động Backend

```bash
cd Backend
npm run dev
```

Kiểm tra logs để đảm bảo kết nối thành công:
```
✅ SQL Server connection pool initialized
Connected to: localhost/dmt_education_system
```

## 🔄 Các thay đổi đã thực hiện

### 1. **database.ts** - Chuyển từ PostgreSQL sang SQL Server
- ✅ Thay `pg` package bằng `mssql`
- ✅ Cập nhật connection configuration
- ✅ Chuyển đổi parameter syntax ($1, $2 → @p1, @p2)
- ✅ Giữ backward compatibility với PostgreSQL-style results

### 2. **auth.ts** - Cập nhật auth routes
- ✅ Chuyển từ Supabase client sang raw SQL queries
- ✅ Sử dụng `query()` helper function

### 3. **Db_DMT_SQLServer.sql** - Schema mới
- ✅ Chuyển đổi PostgreSQL syntax sang T-SQL
- ✅ `SERIAL` → `IDENTITY(1,1)`
- ✅ `timestamp` → `DATETIME2`
- ✅ `text` → `NVARCHAR(MAX)`
- ✅ `boolean` → `BIT`
- ✅ Thêm `GO` statements
- ✅ Tạo indexes cho performance

## 📝 TODO - Cần cập nhật thêm

Một số route vẫn đang dùng Supabase client và cần chuyển sang raw SQL:

- [ ] `students.ts` - Cần chuyển sang SQL queries
- [ ] `teachers.ts` - Cần chuyển sang SQL queries  
- [ ] `assignments.ts` - Cần chuyển sang SQL queries
- [ ] `materials.ts` - Cần chuyển sang SQL queries
- [ ] `payments.ts` - Cần chuyển sang SQL queries
- [ ] `surveys.ts` - Cần chuyển sang SQL queries
- [ ] `enrollments.ts` - Cần chuyển sang SQL queries
- [ ] `attendance.ts` - Cần chuyển sang SQL queries
- [ ] `classes.ts` - Cần chuyển sang SQL queries

**Lưu ý**: Các route như `courses.ts`, `subjects.ts` đã sử dụng raw SQL nên tương thích 100%.

## 🐛 Troubleshooting

### Lỗi: "Login failed for user 'sa'"
- Kiểm tra password trong `.env.local`
- Đảm bảo SQL Server đang chạy: `docker ps`

### Lỗi: "Cannot connect to SQL Server"
- Kiểm tra port 1433 có đang mở không
- Kiểm tra firewall
- Với Docker: `docker logs sqlserver2022`

### Lỗi: "Database does not exist"
- Tạo database trước: `CREATE DATABASE dmt_education_system;`

### Lỗi: "Self signed certificate"
- Đặt `DB_TRUST_CERT=true` trong `.env.local`

## 📚 Tài liệu tham khảo

- [mssql package documentation](https://www.npmjs.com/package/mssql)
- [SQL Server Docker](https://hub.docker.com/_/microsoft-mssql-server)
- [Azure Data Studio](https://docs.microsoft.com/en-us/sql/azure-data-studio/)
- [T-SQL Reference](https://docs.microsoft.com/en-us/sql/t-sql/)

## ✅ Kiểm tra kết nối

```bash
# Test health endpoint
curl http://localhost:3001/health

# Test courses API
curl http://localhost:3001/courses?page=1&limit=5
```

## 🔙 Quay lại PostgreSQL (nếu cần)

1. Đổi lại file `database.ts` về version cũ
2. Cập nhật `.env.local`:
   ```bash
   DATABASE_URL=postgresql://nguyenhuuthang@localhost:5432/dmt_education_system
   ```
3. Uninstall SQL Server package:
   ```bash
   npm uninstall mssql @types/mssql
   npm install pg @types/pg
   ```
