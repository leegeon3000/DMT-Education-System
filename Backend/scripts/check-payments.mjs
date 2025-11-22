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

async function checkPayments() {
  const pool = await sql.connect(config);
  
  // Count total payments
  const total = await pool.request().query(`
    SELECT COUNT(*) as total FROM PAYMENTS
  `);
  
  // Count mock payments
  const mock = await pool.request().query(`
    SELECT COUNT(*) as total FROM PAYMENTS WHERE PAYMENT_CODE LIKE 'PMT-23%'
  `);
  
  // List mock payments
  const list = await pool.request().query(`
    SELECT PAYMENT_CODE, AMOUNT, STATUS, PAYMENT_DATE
    FROM PAYMENTS 
    WHERE PAYMENT_CODE LIKE 'PMT-23%'
    ORDER BY PAYMENT_CODE
  `);
  
  console.log(`\nTotal payments in database: ${total.recordset[0].total}`);
  console.log(`Mock payments (PMT-23xxx): ${mock.recordset[0].total}`);
  console.log('\nMock payments list:');
  list.recordset.forEach((p, i) => {
    console.log(`  ${i+1}. ${p.PAYMENT_CODE} - ${p.AMOUNT.toLocaleString('vi-VN')} VND - ${p.STATUS} - ${p.PAYMENT_DATE.toISOString().split('T')[0]}`);
  });
  
  await pool.close();
}

checkPayments().catch(console.error);
