/**
 * =================================================================
 * GENERATE ALL SAMPLE ACCOUNT PASSWORDS
 * =================================================================
 * 
 * Script này tạo password hash cho TẤT CẢ tài khoản mẫu
 * và xuất ra SQL UPDATE statements
 * 
 * Usage:
 *   node Backend/scripts/generate-all-passwords.mjs
 */

import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

// Danh sách tài khoản mẫu
const SAMPLE_ACCOUNTS = [
  // ADMIN
  { id: 1, email: 'admin@dmt.edu.vn', password: 'Admin@123', role: 'Admin' },
  
  // STAFF
  { id: 2, email: 'staff1@dmt.edu.vn', password: 'Staff@123', role: 'Staff' },
  { id: 3, email: 'staff2@dmt.edu.vn', password: 'Staff@123', role: 'Staff' },
  
  // TEACHERS
  { id: 4, email: 'teacher.math@dmt.edu.vn', password: 'Teacher@123', role: 'Teacher' },
  { id: 5, email: 'teacher.english@dmt.edu.vn', password: 'Teacher@123', role: 'Teacher' },
  { id: 6, email: 'teacher.physics@dmt.edu.vn', password: 'Teacher@123', role: 'Teacher' },
  { id: 7, email: 'teacher.chemistry@dmt.edu.vn', password: 'Teacher@123', role: 'Teacher' },
  { id: 8, email: 'teacher.literature@dmt.edu.vn', password: 'Teacher@123', role: 'Teacher' },
  
  // STUDENTS
  { id: 9, email: 'student001@gmail.com', password: 'Student@123', role: 'Student' },
  { id: 10, email: 'student002@gmail.com', password: 'Student@123', role: 'Student' },
  { id: 11, email: 'student003@gmail.com', password: 'Student@123', role: 'Student' },
  { id: 12, email: 'student004@gmail.com', password: 'Student@123', role: 'Student' },
  { id: 13, email: 'student005@gmail.com', password: 'Student@123', role: 'Student' },
  { id: 14, email: 'student006@gmail.com', password: 'Student@123', role: 'Student' },
  { id: 15, email: 'student007@gmail.com', password: 'Student@123', role: 'Student' },
  { id: 16, email: 'student008@gmail.com', password: 'Student@123', role: 'Student' },
  { id: 17, email: 'student009@gmail.com', password: 'Student@123', role: 'Student' },
  { id: 18, email: 'student010@gmail.com', password: 'Student@123', role: 'Student' },
];

async function generateAllPasswords() {
  console.log('=================================================================');
  console.log('🔐 GENERATE ALL SAMPLE ACCOUNT PASSWORDS');
  console.log('=================================================================');
  console.log('');
  console.log(`📊 Total accounts: ${SAMPLE_ACCOUNTS.length}`);
  console.log(`🔒 Salt rounds: ${SALT_ROUNDS}`);
  console.log('');
  console.log('⏳ Generating hashes...');
  console.log('');
  
  const results = [];
  
  for (const account of SAMPLE_ACCOUNTS) {
    try {
      const hash = await bcrypt.hash(account.password, SALT_ROUNDS);
      results.push({
        ...account,
        hash
      });
      console.log(`✓ ${account.role.padEnd(10)} | ${account.email.padEnd(35)} | ${account.password}`);
    } catch (error) {
      console.error(`✗ Error hashing password for ${account.email}:`, error.message);
    }
  }
  
  console.log('');
  console.log('=================================================================');
  console.log('📝 SQL INSERT STATEMENTS');
  console.log('=================================================================');
  console.log('');
  console.log('-- Copy đoạn này vào file Db_DMT_Sample_Data.sql');
  console.log('-- Thay thế phần INSERT INTO USERS');
  console.log('');
  console.log('SET IDENTITY_INSERT USERS ON;');
  console.log('');
  
  results.forEach((account, index) => {
    const comma = index < results.length - 1 ? ',' : ';';
    if (index === 0) {
      console.log(`INSERT INTO USERS (ID, ROLE_ID, EMAIL, PASSWORD_HASH, FULL_NAME, PHONE, ADDRESS, BIRTH_DATE, AVATAR_URL, STATUS) VALUES`);
    }
    
    // Giữ nguyên data mẫu, chỉ thay password_hash
    let roleId, fullName, phone, address, birthDate, avatarUrl;
    
    switch (account.id) {
      case 1:
        roleId = 1; fullName = "N'Nguyễn Văn Admin'"; phone = "'0901234567'"; 
        address = "N'123 Nguyễn Huệ, Quận 1, TP.HCM'"; birthDate = "'1985-01-15'"; 
        avatarUrl = "'/images/avatar-admin.jpg'";
        break;
      case 2:
        roleId = 2; fullName = "N'Trần Thị Bích Hằng'"; phone = "'0902345678'"; 
        address = "N'456 Lê Lợi, Quận 1, TP.HCM'"; birthDate = "'1988-03-20'"; 
        avatarUrl = "'/images/avatar-staff1.jpg'";
        break;
      case 3:
        roleId = 2; fullName = "N'Phạm Văn Minh'"; phone = "'0903456789'"; 
        address = "N'789 Hai Bà Trưng, Quận 3, TP.HCM'"; birthDate = "'1990-07-10'"; 
        avatarUrl = "'/images/avatar-staff2.jpg'";
        break;
      case 4:
        roleId = 3; fullName = "N'Lê Văn Toán'"; phone = "'0904567890'"; 
        address = "N'321 Võ Văn Tần, Quận 3, TP.HCM'"; birthDate = "'1982-05-15'"; 
        avatarUrl = "'/images/ẢNH-GV/DMT-25-2.jpg'";
        break;
      case 5:
        roleId = 3; fullName = "N'Nguyễn Thị Anh'"; phone = "'0905678901'"; 
        address = "N'654 Điện Biên Phủ, Quận Bình Thạnh, TP.HCM'"; birthDate = "'1987-08-22'"; 
        avatarUrl = "'/images/ẢNH-GV/DMT-25-4.jpg'";
        break;
      case 6:
        roleId = 3; fullName = "N'Trần Văn Lý'"; phone = "'0906789012'"; 
        address = "N'987 Cách Mạng Tháng 8, Quận 10, TP.HCM'"; birthDate = "'1984-12-05'"; 
        avatarUrl = "'/images/ẢNH-GV/DMT-25-6.jpg'";
        break;
      case 7:
        roleId = 3; fullName = "N'Phạm Thị Hóa'"; phone = "'0907890123'"; 
        address = "N'147 Lý Thường Kiệt, Quận 10, TP.HCM'"; birthDate = "'1986-04-18'"; 
        avatarUrl = "'/images/ẢNH-GV/DMT-25-14.jpg'";
        break;
      case 8:
        roleId = 3; fullName = "N'Hoàng Văn Văn'"; phone = "'0908901234'"; 
        address = "N'258 Nguyễn Thị Minh Khai, Quận 3, TP.HCM'"; birthDate = "'1983-09-30'"; 
        avatarUrl = "'/images/ẢNH-GV/DMT-25-15.jpg'";
        break;
      case 9:
        roleId = 4; fullName = "N'Nguyễn Văn An'"; phone = "'0909012345'"; 
        address = "N'123 Lê Văn Sỹ, Quận 3, TP.HCM'"; birthDate = "'2010-01-10'"; 
        avatarUrl = "'/images/ẢNH-HỌC-SINH/DMT-25-23.jpg'";
        break;
      case 10:
        roleId = 4; fullName = "N'Trần Thị Bình'"; phone = "'0910123456'"; 
        address = "N'456 Hoàng Văn Thụ, Quận Phú Nhuận, TP.HCM'"; birthDate = "'2009-05-20'"; 
        avatarUrl = "'/images/ẢNH-HỌC-SINH/DMT-25-24.jpg'";
        break;
      case 11:
        roleId = 4; fullName = "N'Lê Văn Cường'"; phone = "'0911234567'"; 
        address = "N'789 Phan Đăng Lưu, Quận Bình Thạnh, TP.HCM'"; birthDate = "'2010-03-15'"; 
        avatarUrl = "'/images/ẢNH-HỌC-SINH/DMT-25-25.jpg'";
        break;
      case 12:
        roleId = 4; fullName = "N'Phạm Thị Dung'"; phone = "'0912345678'"; 
        address = "N'321 Bạch Đằng, Quận Bình Thạnh, TP.HCM'"; birthDate = "'2009-11-25'"; 
        avatarUrl = "'/images/ẢNH-HỌC-SINH/DMT-25-26.jpg'";
        break;
      case 13:
        roleId = 4; fullName = "N'Hoàng Văn Em'"; phone = "'0913456789'"; 
        address = "N'654 Xô Viết Nghệ Tĩnh, Quận Bình Thạnh, TP.HCM'"; birthDate = "'2010-07-08'"; 
        avatarUrl = "'/images/ẢNH-HỌC-SINH/DMT-25-27.jpg'";
        break;
      case 14:
        roleId = 4; fullName = "N'Võ Thị Phương'"; phone = "'0914567890'"; 
        address = "N'987 Trường Chinh, Quận Tân Bình, TP.HCM'"; birthDate = "'2009-09-12'"; 
        avatarUrl = "'/images/ẢNH-HỌC-SINH/DMT-25-28.jpg'";
        break;
      case 15:
        roleId = 4; fullName = "N'Đỗ Văn Giang'"; phone = "'0915678901'"; 
        address = "N'147 Cộng Hòa, Quận Tân Bình, TP.HCM'"; birthDate = "'2010-02-28'"; 
        avatarUrl = "'/images/ẢNH-HỌC-SINH/DMT-25-29.jpg'";
        break;
      case 16:
        roleId = 4; fullName = "N'Mai Thị Hồng'"; phone = "'0916789012'"; 
        address = "N'258 Hoàng Hoa Thám, Quận Tân Bình, TP.HCM'"; birthDate = "'2009-06-14'"; 
        avatarUrl = "'/images/ẢNH-HỌC-SINH/DMT-25-30.jpg'";
        break;
      case 17:
        roleId = 4; fullName = "N'Bùi Văn Inh'"; phone = "'0917890123'"; 
        address = "N'369 Lạc Long Quân, Quận 11, TP.HCM'"; birthDate = "'2010-04-05'"; 
        avatarUrl = "'/images/ẢNH-HỌC-SINH/DMT-25-31.jpg'";
        break;
      case 18:
        roleId = 4; fullName = "N'Phan Thị Kim'"; phone = "'0918901234'"; 
        address = "N'741 Lý Thái Tổ, Quận 10, TP.HCM'"; birthDate = "'2009-12-18'"; 
        avatarUrl = "'/images/ẢNH-HỌC-SINH/DMT-25-32.jpg'";
        break;
    }
    
    console.log(`(${account.id}, ${roleId}, '${account.email}', '${account.hash}', ${fullName}, ${phone}, ${address}, ${birthDate}, ${avatarUrl}, 1)${comma}`);
  });
  
  console.log('');
  console.log('SET IDENTITY_INSERT USERS OFF;');
  console.log('');
  console.log('=================================================================');
  console.log('ACCOUNT SUMMARY');
  console.log('=================================================================');
  console.log('');
  console.log('Tài khoản đăng nhập:');
  console.log('─────────────────────────────────────────────────────────────────');
  
  // Group by role
  const groupedByRole = results.reduce((acc, account) => {
    if (!acc[account.role]) {
      acc[account.role] = [];
    }
    acc[account.role].push(account);
    return acc;
  }, {});
  
  Object.entries(groupedByRole).forEach(([role, accounts]) => {
    console.log('');
    console.log(`${role}:`);
    accounts.forEach(account => {
      console.log(`  ${account.email.padEnd(35)} | Password: ${account.password}`);
    });
  });
  
  console.log('');
  console.log('─────────────────────────────────────────────────────────────────');
  console.log('');
  console.log('Done! Password hashes generated successfully.');
  console.log('');
  console.log('📝 Next steps:');
  console.log('   1. Copy SQL INSERT statements above');
  console.log('   2. Replace the USERS INSERT in Db_DMT_Sample_Data.sql');
  console.log('   3. Run the SQL file to create sample data');
  console.log('');
  console.log('=================================================================');
}

// Run
generateAllPasswords();
