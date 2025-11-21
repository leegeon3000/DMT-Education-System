# 🔑 TẠI KHOẢN DEMO - DMT EDUCATION SYSTEM

## 📋 Danh sách tài khoản test

### 👨‍💼 **ADMIN**
- **Email**: `admin@dmt.edu.vn`
- **Mật khẩu**: `Admin@123`
- **Dashboard**: http://localhost:5173/admin/dashboard
- **Role ID**: 1

---

### 👔 **STAFF (Nhân viên học vụ)**
- **Email 1**: `staff1@dmt.edu.vn`
- **Tên**: Trần Thị Bích Hằng
- **Mật khẩu**: `Staff@123`
- **Dashboard**: http://localhost:5173/staff/dashboard
- **Role ID**: 2

- **Email 2**: `staff2@dmt.edu.vn`
- **Tên**: Phạm Văn Minh
- **Mật khẩu**: `Staff@123`
- **Dashboard**: http://localhost:5173/staff/dashboard
- **Role ID**: 2

---

### 👨‍🏫 **TEACHER (Giáo viên)**

1. **Giáo viên Toán**
   - **Email**: `teacher.math@dmt.edu.vn`
   - **Tên**: Lê Văn Toán
   - **Mật khẩu**: `Teacher@123`
   - **Dashboard**: http://localhost:5173/teacher/dashboard
   - **Role ID**: 3

2. **Giáo viên Tiếng Anh**
   - **Email**: `teacher.english@dmt.edu.vn`
   - **Tên**: Nguyễn Thị Anh
   - **Mật khẩu**: `Teacher@123`
   - **Dashboard**: http://localhost:5173/teacher/dashboard
   - **Role ID**: 3

3. **Giáo viên Vật lý**
   - **Email**: `teacher.physics@dmt.edu.vn`
   - **Tên**: Trần Văn Lý
   - **Mật khẩu**: `Teacher@123`
   - **Dashboard**: http://localhost:5173/teacher/dashboard
   - **Role ID**: 3

4. **Giáo viên Hóa học**
   - **Email**: `teacher.chemistry@dmt.edu.vn`
   - **Tên**: Phạm Thị Hóa
   - **Mật khẩu**: `Teacher@123`
   - **Dashboard**: http://localhost:5173/teacher/dashboard
   - **Role ID**: 3

5. **Giáo viên Ngữ văn**
   - **Email**: `teacher.literature@dmt.edu.vn`
   - **Tên**: Hoàng Văn Văn
   - **Mật khẩu**: `Teacher@123`
   - **Dashboard**: http://localhost:5173/teacher/dashboard
   - **Role ID**: 3

---

### 👨‍🎓 **STUDENT (Học sinh)**

1. **Học sinh 001**
   - **Email**: `student001@gmail.com`
   - **Tên**: Nguyễn Văn An
   - **Mật khẩu**: `Student@123`
   - **Dashboard**: http://localhost:5173/students/dashboard
   - **Role ID**: 4

2. **Học sinh 002**
   - **Email**: `student002@gmail.com`
   - **Tên**: Trần Thị Bình
   - **Mật khẩu**: `Student@123`
   - **Dashboard**: http://localhost:5173/students/dashboard
   - **Role ID**: 4

... (và 8 học sinh khác với mật khẩu tương tự)

---

## 🔄 Role ID Mapping

| Role ID | Role Name | Route Prefix | Dashboard Path |
|---------|-----------|--------------|----------------|
| 1 | ADMIN | `/admin` | `/admin/dashboard` |
| 2 | STAFF | `/staff` | `/staff/dashboard` |
| 3 | TEACHER | `/teacher` | `/teacher/dashboard` |
| 4 | STUDENT | `/students` | `/students/dashboard` |

---

## 🛠️ Hướng dẫn test

### Bước 1: Clear localStorage (nếu gặp lỗi)
Mở Console trong trình duyệt (F12) và chạy:
```javascript
localStorage.clear();
window.location.href = '/auth/login';
```

### Bước 2: Login với tài khoản cần test
- Vào: http://localhost:5173/auth/login
- Nhập email và mật khẩu từ danh sách trên

### Bước 3: Kiểm tra redirect
- Sau khi login, hệ thống sẽ tự động redirect về dashboard phù hợp với role
- Ví dụ: Login với `teacher.math@dmt.edu.vn` → redirect về `/teacher/dashboard`

### Bước 4: Test các tính năng mới
- **Teacher Dashboard**: Stats cards, upcoming sessions, pending grading, attendance marking
- **Staff Dashboard**: Student registration, payment processing, enrollment management, support tickets

---

## 🐛 Troubleshooting

### Lỗi "Không có quyền truy cập"
**Nguyên nhân**: Đang login với role A nhưng cố truy cập trang của role B

**Giải pháp**:
1. Kiểm tra role hiện tại:
```javascript
console.log('Current role:', JSON.parse(localStorage.getItem('user')).role_id);
```

2. Logout và login lại với tài khoản đúng role:
```javascript
localStorage.clear();
window.location.href = '/auth/login';
```

### Database chưa có dữ liệu mẫu
Chạy lại script import:
```bash
cd Backend
npm run seed
```

Hoặc chạy trực tiếp file SQL:
```sql
-- Trong SQL Server Management Studio
USE DMT_EDUCATION_SYSTEM;
GO
-- Chạy file Db_DMT_Sample_Data.sql
```

---

## ✅ Checklist test hoàn chỉnh

- [ ] Login Admin → Vào được `/admin/dashboard`
- [ ] Login Staff → Vào được `/staff/dashboard` 
- [ ] Login Teacher → Vào được `/teacher/dashboard`
- [ ] Login Student → Vào được `/students/dashboard`
- [ ] Logout từ mỗi role hoạt động đúng
- [ ] Không thể truy cập trang của role khác
- [ ] Tất cả menu items render đúng
- [ ] Stats cards hiển thị dữ liệu (hoặc mock data nếu API chưa có)

---

**Ngày cập nhật**: 18/11/2025
