#!/usr/bin/env node

/**
 * DMT EDUCATION SYSTEM - COMPLETE DATABASE SETUP
 * 
 * This script will:
 * 1. Create database schema  
 * 2. Install stored procedures
 * 3. Insert sample data
 */

import sql from 'mssql';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for console output
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

// Database configuration
const config = {
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_NAME || 'DMT_EDUCATION_SYSTEM',
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'Password123!',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

const masterConfig = {
  ...config,
  database: 'master',
};

async function executeSqlFile(pool, filePath, description) {
  log.info(`Executing ${description}...`);
  
  try {
    const sqlContent = fs.readFileSync(filePath, 'utf8');
    
    // Split by GO statement (case insensitive)
    const batches = sqlContent
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
        // Some errors can be ignored (e.g., "object already exists")
        if (!err.message.includes('already exists')) {
          log.warning(`  Batch ${i + 1} warning: ${err.message.substring(0, 100)}`);
        }
      }
    }
    
    log.success(`${description} completed`);
    return true;
  } catch (err) {
    log.error(`${description} failed: ${err.message}`);
    return false;
  }
}

async function checkTable(pool, tableName) {
  try {
    const result = await pool.request().query(`
      SELECT COUNT(*) as count 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_NAME = '${tableName}'
    `);
    return result.recordset[0].count > 0;
  } catch (err) {
    return false;
  }
}

async function getRowCount(pool, tableName) {
  try {
    const result = await pool.request().query(`SELECT COUNT(*) as count FROM ${tableName}`);
    return result.recordset[0].count;
  } catch (err) {
    return 0;
  }
}

async function main() {
  console.log('='.repeat(70));
  console.log('DMT EDUCATION SYSTEM - COMPLETE DATABASE SETUP');
  console.log('='.repeat(70));
  console.log('');
  
  log.info(`Configuration:`);
  console.log(`  Server: ${config.server}`);
  console.log(`  Database: ${config.database}`);
  console.log(`  User: ${config.user}`);
  console.log('');
  
  const backendDir = path.join(__dirname, '..');
  
  const files = {
    schema: path.join(backendDir, 'Db_DMT_SQLServer.sql'),
    procedures: path.join(backendDir, 'Db_DMT_StoredProcedures.sql'),
    sampleData: path.join(backendDir, 'Db_DMT_Complete_Sample_Data.sql'),
  };
  
  // Check if files exist
  for (const [key, filePath] of Object.entries(files)) {
    if (!fs.existsSync(filePath)) {
      log.error(`File not found: ${filePath}`);
      process.exit(1);
    }
  }
  
  let masterPool;
  let pool;
  
  try {
    // Step 1: Create database (connect to master)
    log.info('Step 1: Connecting to master database...');
    masterPool = await sql.connect(masterConfig);
    log.success('Connected to master database');
    
    // Check if database exists
    const dbCheck = await masterPool.request().query(`
      SELECT name FROM sys.databases WHERE name = '${config.database}'
    `);
    
    if (dbCheck.recordset.length === 0) {
      log.info('Creating database...');
      await executeSqlFile(masterPool, files.schema, 'Database schema');
    } else {
      log.warning(`Database ${config.database} already exists`);
    }
    
    await masterPool.close();
    
    // Step 2: Connect to target database
    log.info(`Step 2: Connecting to ${config.database}...`);
    pool = await sql.connect(config);
    log.success(`Connected to ${config.database}`);
    
    // Check if tables exist
    const tablesExist = await checkTable(pool, 'USERS');
    
    if (!tablesExist) {
      log.info('Creating database schema...');
      await executeSqlFile(pool, files.schema, 'Database schema');
    } else {
      log.success('Database schema already exists');
    }
    
    // Step 3: Install stored procedures
    await executeSqlFile(pool, files.procedures, 'Stored procedures');
    
    // Step 4: Check if sample data exists
    const userCount = await getRowCount(pool, 'USERS');
    
    if (userCount === 0) {
      log.info('Inserting sample data...');
      await executeSqlFile(pool, files.sampleData, 'Sample data');
    } else {
      log.warning(`Sample data already exists (${userCount} users found)`);
      
      const answer = await new Promise((resolve) => {
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });
        rl.question('Do you want to reload sample data? (yes/no): ', (ans) => {
          rl.close();
          resolve(ans.toLowerCase());
        });
      });
      
      if (answer === 'yes' || answer === 'y') {
        log.info('Reloading sample data...');
        await executeSqlFile(pool, files.sampleData, 'Sample data');
      } else {
        log.info('Skipping sample data insertion');
      }
    }
    
    // Step 5: Verify installation
    console.log('');
    log.info('Step 5: Verifying installation...');
    
    const tables = ['USERS', 'STUDENTS', 'TEACHERS', 'STAFF', 'CLASSES', 'ENROLLMENTS'];
    
    for (const table of tables) {
      const count = await getRowCount(pool, table);
      console.log(`  ${table.padEnd(20)} ${count} records`);
    }
    
    // Test stored procedure
    try {
      const result = await pool.request().query('EXEC sp_GetSystemOverview');
      const overview = result.recordset[0];
      
      console.log('');
      log.success('Stored procedure test successful:');
      console.log(`  Total Students: ${overview.total_students || 0}`);
      console.log(`  Total Teachers: ${overview.total_teachers || 0}`);
      console.log(`  Active Classes: ${overview.active_classes || 0}`);
    } catch (err) {
      log.warning(`Stored procedure test failed: ${err.message}`);
    }
    
    console.log('');
    console.log('='.repeat(70));
    log.success('DATABASE SETUP COMPLETE!');
    console.log('='.repeat(70));
    console.log('');
    console.log('Test accounts:');
    console.log('  Admin:   admin@dmt.edu.vn / Admin@123');
    console.log('  Staff:   staff1@dmt.edu.vn / Staff@123');
    console.log('  Teacher: teacher.math@dmt.edu.vn / Teacher@123');
    console.log('  Student: student001@gmail.com / Student@123');
    console.log('');
    console.log('Next steps:');
    console.log('  1. Restart backend if running');
    console.log('  2. Login with admin account');
    console.log('');
    
  } catch (err) {
    log.error(`Setup failed: ${err.message}`);
    console.error(err);
    process.exit(1);
  } finally {
    if (pool) await pool.close();
    if (masterPool) await masterPool.close();
  }
}

main().catch(console.error);
