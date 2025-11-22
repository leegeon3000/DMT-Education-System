import sql from 'mssql';

const config = {
  server: 'localhost',
  database: 'DMT_EDUCATION_SYSTEM',
  user: 'sa',
  password: 'Password123!',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true
  }
};

// Sample expenses data - Adjusted for realistic education center costs
const expensesData = [
  { code: 'EXP0001', date: new Date(2023, 0, 15), category: 'Lương nhân viên', amount: 18000000, description: 'Lương giáo viên và nhân viên tháng 1', method: 'BANK_TRANSFER' },
  { code: 'EXP0002', date: new Date(2023, 0, 20), category: 'Văn phòng phẩm', amount: 2500000, description: 'Mua văn phòng phẩm tháng 1', method: 'CASH' },
  { code: 'EXP0003', date: new Date(2023, 1, 5), category: 'Tiền điện', amount: 3200000, description: 'Tiền điện tháng 2', method: 'BANK_TRANSFER' },
  { code: 'EXP0004', date: new Date(2023, 1, 10), category: 'Tiền nước', amount: 800000, description: 'Tiền nước tháng 2', method: 'BANK_TRANSFER' },
  { code: 'EXP0005', date: new Date(2023, 2, 8), category: 'Tiếp thị và quảng cáo', amount: 5000000, description: 'Chi phí quảng cáo Facebook Ads tháng 3', method: 'CREDIT_CARD' },
  { code: 'EXP0006', date: new Date(2023, 2, 18), category: 'Trang thiết bị', amount: 4500000, description: 'Mua máy chiếu và bảng thông minh', method: 'BANK_TRANSFER' },
  { code: 'EXP0007', date: new Date(2023, 3, 12), category: 'Bảo trì', amount: 2800000, description: 'Sửa chữa điều hòa và thiết bị lớp học', method: 'CASH' },
  { code: 'EXP0008', date: new Date(2023, 3, 25), category: 'Khác', amount: 3500000, description: 'Chi phí tổ chức sự kiện học sinh', method: 'CASH' },
  { code: 'EXP0009', date: new Date(2023, 4, 3), category: 'Lương nhân viên', amount: 19500000, description: 'Lương giáo viên và nhân viên tháng 5', method: 'BANK_TRANSFER' },
  { code: 'EXP0010', date: new Date(2023, 4, 14), category: 'Đào tạo giáo viên', amount: 4200000, description: 'Khóa đào tạo kỹ năng giảng dạy', method: 'BANK_TRANSFER' },
  { code: 'EXP0011', date: new Date(2023, 5, 7), category: 'Tiền điện', amount: 3800000, description: 'Tiền điện tháng 6', method: 'BANK_TRANSFER' },
  { code: 'EXP0012', date: new Date(2023, 5, 22), category: 'Tiền nước', amount: 900000, description: 'Tiền nước tháng 6', method: 'BANK_TRANSFER' },
  { code: 'EXP0013', date: new Date(2023, 6, 9), category: 'Tiếp thị và quảng cáo', amount: 6500000, description: 'Chạy quảng cáo Google Ads và poster', method: 'CREDIT_CARD' },
  { code: 'EXP0014', date: new Date(2023, 6, 19), category: 'Trang thiết bị', amount: 3200000, description: 'Mua bàn ghế học sinh mới', method: 'BANK_TRANSFER' },
  { code: 'EXP0015', date: new Date(2023, 7, 4), category: 'Bảo trì', amount: 3100000, description: 'Bảo dưỡng hệ thống điện và nước', method: 'CASH' },
  { code: 'EXP0016', date: new Date(2023, 7, 16), category: 'Khác', amount: 2800000, description: 'Mua đồ dùng vệ sinh và trang trí', method: 'CASH' },
  { code: 'EXP0017', date: new Date(2023, 8, 11), category: 'Lương nhân viên', amount: 20500000, description: 'Lương giáo viên và nhân viên tháng 9', method: 'BANK_TRANSFER' },
  { code: 'EXP0018', date: new Date(2023, 8, 28), category: 'Học liệu', amount: 4500000, description: 'Mua sách giáo khoa và tài liệu học tập', method: 'BANK_TRANSFER' },
  { code: 'EXP0019', date: new Date(2023, 9, 6), category: 'Tiền điện', amount: 4100000, description: 'Tiền điện tháng 10', method: 'BANK_TRANSFER' },
  { code: 'EXP0020', date: new Date(2023, 9, 21), category: 'Tiền nước', amount: 1000000, description: 'Tiền nước tháng 10', method: 'BANK_TRANSFER' }
];

async function importExpenses() {
  try {
    console.log('📦 Connecting to SQL Server...');
    await sql.connect(config);
    console.log('✓ Connected successfully\n');

    // Check if EXPENSES table exists
    const checkTable = await sql.query`
      SELECT COUNT(*) as TableExists 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_NAME = 'EXPENSES'
    `;

    if (checkTable.recordset[0].TableExists === 0) {
      console.log('❌ EXPENSES table does not exist. Please run create-expenses-table.mjs first.\n');
      process.exit(1);
    }

    // Clear existing mock expenses (EXP00xx)
    console.log('🗑️  Clearing existing mock expenses...');
    const deleteResult = await sql.query`
      DELETE FROM EXPENSES WHERE EXPENSE_CODE LIKE 'EXP00%'
    `;
    console.log(`✓ Deleted ${deleteResult.rowsAffected[0]} old records\n`);

    // Insert expenses
    console.log('📥 Importing expenses data...');
    let successCount = 0;

    for (const expense of expensesData) {
      try {
        await sql.query`
          INSERT INTO EXPENSES (
            EXPENSE_CODE, 
            EXPENSE_DATE, 
            CATEGORY, 
            AMOUNT, 
            DESCRIPTION, 
            PAYMENT_METHOD,
            APPROVED_BY,
            CREATED_BY
          )
          VALUES (
            ${expense.code},
            ${expense.date},
            ${expense.category},
            ${expense.amount},
            ${expense.description},
            ${expense.method},
            'Admin',
            'System'
          )
        `;
        successCount++;
      } catch (error) {
        console.error(`❌ Failed to insert ${expense.code}:`, error.message);
      }
    }

    console.log(`✓ Inserted ${successCount}/${expensesData.length} expenses\n`);

    // Verification
    console.log('🔍 Verifying imported data...');
    const verifyResult = await sql.query`
      SELECT 
        COUNT(*) as TotalCount,
        SUM(AMOUNT) as TotalAmount,
        MIN(EXPENSE_DATE) as EarliestDate,
        MAX(EXPENSE_DATE) as LatestDate
      FROM EXPENSES
      WHERE EXPENSE_CODE LIKE 'EXP00%'
    `;

    const stats = verifyResult.recordset[0];
    console.log(`  Total expenses: ${stats.TotalCount}`);
    console.log(`  Total amount: ${stats.TotalAmount.toLocaleString('vi-VN')} VND`);
    console.log(`  Date range: ${stats.EarliestDate.toLocaleDateString('vi-VN')} - ${stats.LatestDate.toLocaleDateString('vi-VN')}`);

    // Category breakdown
    const categoryResult = await sql.query`
      SELECT 
        CATEGORY,
        COUNT(*) as Count,
        SUM(AMOUNT) as Total
      FROM EXPENSES
      WHERE EXPENSE_CODE LIKE 'EXP00%'
      GROUP BY CATEGORY
      ORDER BY Total DESC
    `;

    console.log('\n📊 Breakdown by category:');
    categoryResult.recordset.forEach(cat => {
      console.log(`  ${cat.CATEGORY}: ${cat.Count} items, ${cat.Total.toLocaleString('vi-VN')} VND`);
    });

    console.log('\n✅ Expenses import completed successfully!');

  } catch (error) {
    console.error('❌ Error importing expenses:', error.message);
    throw error;
  } finally {
    await sql.close();
  }
}

importExpenses();
