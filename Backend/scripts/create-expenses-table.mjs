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

async function createExpensesTable() {
  try {
    console.log('📦 Connecting to SQL Server...');
    await sql.connect(config);
    console.log('✓ Connected successfully\n');

    // Check if table exists
    const checkTable = await sql.query`
      SELECT COUNT(*) as TableExists 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_NAME = 'EXPENSES'
    `;

    if (checkTable.recordset[0].TableExists > 0) {
      console.log('⚠️  EXPENSES table already exists. Skipping creation.\n');
      return;
    }

    console.log('📝 Creating EXPENSES table...');
    await sql.query`
      CREATE TABLE EXPENSES (
        ID INT IDENTITY(1,1) PRIMARY KEY,
        EXPENSE_CODE VARCHAR(50) UNIQUE,
        EXPENSE_DATE DATETIME2 NOT NULL,
        CATEGORY NVARCHAR(100) NOT NULL,
        AMOUNT DECIMAL(18,2) NOT NULL,
        DESCRIPTION NVARCHAR(500),
        PAYMENT_METHOD VARCHAR(50) DEFAULT 'BANK_TRANSFER',
        APPROVED_BY VARCHAR(100),
        RECEIPT_NUMBER VARCHAR(50),
        NOTES NVARCHAR(MAX),
        CREATED_BY VARCHAR(100),
        CREATED_AT DATETIME2 DEFAULT GETDATE(),
        UPDATED_AT DATETIME2 DEFAULT GETDATE()
      )
    `;
    console.log('✓ EXPENSES table created successfully\n');

    // Create index
    console.log('📝 Creating indexes...');
    await sql.query`
      CREATE INDEX IX_EXPENSES_DATE ON EXPENSES(EXPENSE_DATE);
      CREATE INDEX IX_EXPENSES_CATEGORY ON EXPENSES(CATEGORY);
      CREATE INDEX IX_EXPENSES_CODE ON EXPENSES(EXPENSE_CODE);
    `;
    console.log('✓ Indexes created successfully\n');

    console.log('✅ EXPENSES table setup completed!');

  } catch (error) {
    console.error('❌ Error creating EXPENSES table:', error.message);
    throw error;
  } finally {
    await sql.close();
  }
}

createExpensesTable();
