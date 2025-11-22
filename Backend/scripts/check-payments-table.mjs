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

async function checkTable() {
  const pool = await sql.connect(config);
  const result = await pool.request().query(`
    SELECT COLUMN_NAME, DATA_TYPE 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'PAYMENTS' 
    ORDER BY ORDINAL_POSITION
  `);
  console.log('PAYMENTS table columns:');
  result.recordset.forEach(col => console.log(`  - ${col.COLUMN_NAME} (${col.DATA_TYPE})`));
  await pool.close();
}

checkTable().catch(console.error);
