#!/usr/bin/env node

/**
 * DMT EDUCATION SYSTEM - FRESH INSTALL
 * Complete reset and setup: Drop database → Create schema → Install procedures → Load data
 */

import sql from 'mssql';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
};

const config = {
  server: process.env.DB_SERVER || 'localhost',
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'Password123!',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
  }
};

// Execute SQL file in batches (split by GO)
async function executeSqlFile(pool, filePath, description) {
  log.info(`Executing ${description}...`);
  
  const sql = fs.readFileSync(filePath, 'utf8');
  const batches = sql
    .split(/^\s*GO\s*$/im)
    .map(batch => batch.trim())
    .filter(batch => batch.length > 0);

  log.info(`  Found ${batches.length} SQL batches`);

  for (let i = 0; i < batches.length; i++) {
    try {
      await pool.request().query(batches[i]);
      if ((i + 1) % 10 === 0) {
        log.info(`  Executed ${i + 1}/${batches.length} batches...`);
      }
    } catch (err) {
      // Only show critical errors, skip constraint violations during fresh install
      if (!err.message.includes('PRIMARY KEY') && 
          !err.message.includes('FOREIGN KEY') &&
          !err.message.includes('already exists')) {
        log.warning(`  Batch ${i + 1} error: ${err.message}`);
      }
    }
  }

  log.success(`${description} completed`);
}

async function freshInstall() {
  let pool;
  try {
    console.log('\n' + '='.repeat(70));
    console.log('         DMT EDUCATION SYSTEM - FRESH INSTALL');
    console.log('='.repeat(70) + '\n');

    log.info('Configuration:');
    console.log(`  Server: ${config.server}`);
    console.log(`  User: ${config.user}`);
    console.log('');

    // Step 1: Connect to master and drop existing database
    log.info('Step 1: Resetting database...');
    pool = await sql.connect({...config, database: 'master'});
    log.success('Connected to master database');
    
    await pool.request().query(`
      IF EXISTS (SELECT name FROM sys.databases WHERE name = 'DMT_EDUCATION_SYSTEM')
      BEGIN
        ALTER DATABASE DMT_EDUCATION_SYSTEM SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
        DROP DATABASE DMT_EDUCATION_SYSTEM;
      END
    `);
    log.success('Old database dropped (if existed)');

    // Step 2: Create new database
    log.info('Step 2: Creating fresh database...');
    await pool.request().query(`CREATE DATABASE DMT_EDUCATION_SYSTEM`);
    log.success('Database created');

    await pool.close();

    // Step 3: Connect to new database
    log.info('Step 3: Connecting to DMT_EDUCATION_SYSTEM...');
    pool = await sql.connect({...config, database: 'DMT_EDUCATION_SYSTEM'});
    log.success('Connected to DMT_EDUCATION_SYSTEM');

    // Step 4: Create schema
    const schemaFile = path.join(__dirname, '..', 'Db_DMT_SQLServer.sql');
    await executeSqlFile(pool, schemaFile, 'Database schema');

    // Step 5: Install stored procedures
    const proceduresFile = path.join(__dirname, '..', 'Db_DMT_StoredProcedures.sql');
    await executeSqlFile(pool, proceduresFile, 'Stored procedures');

    // Step 6: Load sample data
    const sampleDataFile = path.join(__dirname, '..', 'Db_DMT_Complete_Sample_Data.sql');
    await executeSqlFile(pool, sampleDataFile, 'Sample data');

    // Step 7: Verify installation
    log.info('Step 4: Verifying installation...');
    
    const tables = [
      'USERS', 'STUDENTS', 'TEACHERS', 'STAFF', 
      'CLASSES', 'ENROLLMENTS', 'SUBMISSIONS', 'PAYMENTS'
    ];

    for (const table of tables) {
      const result = await pool.request()
        .query(`SELECT COUNT(*) as count FROM ${table}`);
      const count = result.recordset[0].count;
      console.log(`  ${table.padEnd(20)} ${count} records`);
    }

    // Test stored procedure
    const testResult = await pool.request().query(`EXEC sp_GetSystemOverview`);
    const overview = testResult.recordset[0];
    log.success('Stored procedure test successful:');
    console.log(`  Total Students: ${overview.total_students}`);
    console.log(`  Total Teachers: ${overview.total_teachers}`);
    console.log(`  Active Classes: ${overview.active_classes}`);

    console.log('\n' + '='.repeat(70));
    log.success('FRESH INSTALL COMPLETE!');
    console.log('='.repeat(70) + '\n');

    console.log('Test accounts:');
    console.log('  Admin:   admin@dmt.edu.vn / Admin@123');
    console.log('  Staff:   staff1@dmt.edu.vn / Staff@123');
    console.log('  Teacher: teacher.math@dmt.edu.vn / Teacher@123');
    console.log('  Student: student001@gmail.com / Student@123');
    console.log('');
    console.log('Next steps:');
    console.log('  1. Restart backend server (if running)');
    console.log('  2. Login with admin account');
    console.log('  3. Access admin dashboard');
    console.log('');

  } catch (err) {
    log.error(`Installation failed: ${err.message}`);
    console.error(err);
    process.exit(1);
  } finally {
    if (pool) await pool.close();
  }
}

freshInstall();
