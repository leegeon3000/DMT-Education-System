# 🔐 DMT Education System - Thông Tin Đăng Nhập

## Demo Accounts

### 👨‍💼 Admin
- **Email:** `admin@dmt.edu.vn`
- **Mật khẩu:** `Admin@123`
- **Quyền:** Quản trị hệ thống, xem tất cả báo cáo, quản lý người dùng

### 👨‍🏫 Giáo Viên (Teacher)
- **Email:** `teacher.math@dmt.edu.vn`
- **Mật khẩu:** `Teacher@123`
- **Thông tin:** Lê Văn Toán - Giáo viên Toán
- **Quyền:** Quản lý lớp học, điểm danh, chấm điểm

### 👨‍🎓 Học Viên (Student)
- **Email:** `student001@gmail.com`
- **Mật khẩu:** `Student@123`
- **Thông tin:** Nguyễn Văn An - Mã HS: HS2025001
- **Quyền:** Xem điểm, lịch học, nộp bài tập

### 👔 Nhân Viên (Staff)
- **Email:** `staff1@dmt.edu.vn`
- **Mật khẩu:** `Staff@123`
- **Thông tin:** Trần Thị Bích Hằng - Trưởng phòng Học vụ
- **Quyền:** Quản lý học vụ, thanh toán

---

## Danh Sách Tài Khoản Đầy Đủ

### Students (10 accounts)
| Email | Password | Full Name | Student Code |
|-------|----------|-----------|--------------|
| student001@gmail.com | Student@123 | Nguyễn Văn An | HS2025001 |
| student002@gmail.com | Student@123 | Trần Thị Bình | HS2025002 |
| student003@gmail.com | Student@123 | Lê Văn Cường | HS2025003 |
| student004@gmail.com | Student@123 | Phạm Thị Dung | HS2025004 |
| student005@gmail.com | Student@123 | Hoàng Văn Em | HS2025005 |
| student006@gmail.com | Student@123 | Võ Thị Phương | HS2025006 |
| student007@gmail.com | Student@123 | Đỗ Văn Giang | HS2025007 |
| student008@gmail.com | Student@123 | Mai Thị Hồng | HS2025008 |
| student009@gmail.com | Student@123 | Bùi Văn Inh | HS2025009 |
| student010@gmail.com | Student@123 | Phan Thị Kim | HS2025010 |

### Teachers (5 accounts)
| Email | Password | Full Name | Teacher Code | Subject |
|-------|----------|-----------|--------------|---------|
| teacher.math@dmt.edu.vn | Teacher@123 | Lê Văn Toán | GV2025001 | Toán học |
| teacher.english@dmt.edu.vn | Teacher@123 | Nguyễn Thị Anh | GV2025002 | Tiếng Anh |
| teacher.physics@dmt.edu.vn | Teacher@123 | Trần Văn Lý | GV2025003 | Vật lý |
| teacher.chemistry@dmt.edu.vn | Teacher@123 | Phạm Thị Hóa | GV2025004 | Hóa học |
| teacher.literature@dmt.edu.vn | Teacher@123 | Hoàng Văn Văn | GV2025005 | Ngữ văn |

### Staff (2 accounts)
| Email | Password | Full Name | Staff Code | Department |
|-------|----------|-----------|------------|------------|
| staff1@dmt.edu.vn | Staff@123 | Trần Thị Bích Hằng | NV2025001 | Phòng Học vụ |
| staff2@dmt.edu.vn | Staff@123 | Phạm Văn Minh | NV2025002 | Phòng Kế toán |

---

## 🚀 Quick Start

```bash
# Start development environment
./start-dev.sh

# Check status
./status-dev.sh

# Stop servers
./stop-dev.sh
```

## 🌐 URLs

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000
- **API Health:** http://localhost:3000/health

## 📝 Notes

- Tất cả mật khẩu đều theo format: `Role@123` (với Role là: Admin, Teacher, Student, Staff)
- Mật khẩu đã được hash bằng bcrypt (10 rounds)
- Token JWT có thời hạn 7 ngày
