#!/usr/bin/env node
import sql from 'mssql';
import dotenv from 'dotenv';
dotenv.config();

const config = {
  server: 'localhost',
  user: 'sa',
  password: 'Password123!',
  database: 'DMT_EDUCATION_SYSTEM',
  options: { encrypt: false, trustServerCertificate: true }
};

async function alterTable() {
  const pool = await sql.connect(config);
  
  console.log('Adding missing columns to PAYMENTS table...\n');
  
  try {
    // Add PAYMENT_CODE
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'PAYMENTS' AND COLUMN_NAME = 'PAYMENT_CODE')
      BEGIN
        ALTER TABLE PAYMENTS ADD PAYMENT_CODE VARCHAR(50) NULL;
        PRINT 'Added PAYMENT_CODE column';
      END
    `);
    console.log('✓ PAYMENT_CODE column added');
    
    // Add RECEIPT_NUMBER  
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'PAYMENTS' AND COLUMN_NAME = 'RECEIPT_NUMBER')
      BEGIN
        ALTER TABLE PAYMENTS ADD RECEIPT_NUMBER VARCHAR(50) NULL;
        PRINT 'Added RECEIPT_NUMBER column';
      END
    `);
    console.log('✓ RECEIPT_NUMBER column added');
    
    // Add DESCRIPTION
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'PAYMENTS' AND COLUMN_NAME = 'DESCRIPTION')
      BEGIN
        ALTER TABLE PAYMENTS ADD DESCRIPTION NVARCHAR(500) NULL;
        PRINT 'Added DESCRIPTION column';
      END
    `);
    console.log('✓ DESCRIPTION column added');
    
    // Add PAYMENT_DETAILS
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'PAYMENTS' AND COLUMN_NAME = 'PAYMENT_DETAILS')
      BEGIN
        ALTER TABLE PAYMENTS ADD PAYMENT_DETAILS NVARCHAR(500) NULL;
        PRINT 'Added PAYMENT_DETAILS column';
      END
    `);
    console.log('✓ PAYMENT_DETAILS column added');
    
    // Add CREATED_BY
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'PAYMENTS' AND COLUMN_NAME = 'CREATED_BY')
      BEGIN
        ALTER TABLE PAYMENTS ADD CREATED_BY VARCHAR(100) NULL;
        PRINT 'Added CREATED_BY column';
      END
    `);
    console.log('✓ CREATED_BY column added');
    
    // Add UPDATED_AT
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'PAYMENTS' AND COLUMN_NAME = 'UPDATED_AT')
      BEGIN
        ALTER TABLE PAYMENTS ADD UPDATED_AT DATETIME2 NULL;
        PRINT 'Added UPDATED_AT column';
      END
    `);
    console.log('✓ UPDATED_AT column added');
    
    console.log('\n✓ All columns added successfully!');
    
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.close();
  }
}

alterTable();
