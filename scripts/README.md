# DMT Education System - Scripts

Tập hợp các scripts hữu ích để kiểm tra và quản lý hệ thống.

## 📋 Danh sách Scripts

### 1. `check-system.sh` - Kiểm tra hệ thống
Kiểm tra trạng thái của các services chính (Backend, Frontend, SQL Server).

```bash
./scripts/check-system.sh
```

**Output:**
- ✅ Backend Server status (Port 3001)
- ✅ Frontend Server status (Port 5173)  
- ✅ SQL Server status (Port 1433)
- Overall system health (0/3, 1/3, 2/3, 3/3)

---

### 2. `test-admin-apis.sh` - Test Admin APIs
Tự động test tất cả 11 admin API endpoints đã migrate.

```bash
./scripts/test-admin-apis.sh
```

**Endpoints được test:**

**Payments API (2 endpoints)**
- GET `/api/payments` - Danh sách payments
- GET `/api/payments/stats/summary` - Thống kê payments

**Finance Report API (2 endpoints)**
- GET `/api/finance/summary` - Tổng quan tài chính
- GET `/api/finance/monthly-revenue?year=2025` - Doanh thu theo tháng

**Attendance Report API (2 endpoints)**
- GET `/api/attendance/reports` - Danh sách báo cáo điểm danh
- GET `/api/attendance/summary` - Tổng quan điểm danh

**Analytics API (2 endpoints)**
- GET `/api/analytics?time_range=30d` - Phân tích đầy đủ
- GET `/api/analytics/summary` - Tổng quan phân tích

**Performance Report API (2 endpoints)**
- GET `/api/performance/reports` - Báo cáo hiệu suất
- GET `/api/performance/summary` - Tổng quan hiệu suất

**Settings API (1 endpoint)**
- GET `/api/settings` - Cài đặt hệ thống

**Output:**
- ✅ Số tests passed/failed/warnings
- ❌ Chi tiết lỗi (nếu có)
- Exit code: 0 (success), 1 (có lỗi)

---

## 🚀 Quick Start

```bash
# 1. Kiểm tra hệ thống
./scripts/check-system.sh

# 2. Nếu thiếu service nào, khởi động:
docker start dmt-sqlserver           # SQL Server
cd Backend && npm run dev            # Backend
npm run dev                          # Frontend (terminal mới)

# 3. Test APIs
./scripts/test-admin-apis.sh
```

---

## 📊 Admin Migration Status

**100% COMPLETE** - All 11 admin pages migrated to SQL Server API:

1. ✅ Dashboard
2. ✅ Students  
3. ✅ Teachers
4. ✅ Classes
5. ✅ Staff
6. ✅ Payments
7. ✅ Finance Report
8. ✅ Attendance Report
9. ✅ Analytics
10. ✅ Performance Report
11. ✅ Settings

---

## 🔧 Troubleshooting

### Backend không start được
```bash
cd Backend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### SQL Server không connect được
```bash
docker ps -a | grep dmt-sqlserver
docker start dmt-sqlserver
docker logs dmt-sqlserver
```

### Frontend build errors
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## 📝 Notes

- Scripts yêu cầu `curl` và `python3` để test APIs
- Scripts tự động kiểm tra ports: 3001 (Backend), 5173 (Frontend), 1433 (SQL Server)
- Color coding: 🟢 Green (OK), 🔴 Red (Error), 🟡 Yellow (Warning)
