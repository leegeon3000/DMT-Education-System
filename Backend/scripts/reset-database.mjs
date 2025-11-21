#!/usr/bin/env node

/**
 * DMT EDUCATION SYSTEM - RESET DATABASE
 * Drops and recreates the database from scratch
 */

import sql from 'mssql';

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

async function resetDatabase() {
  let pool;
  try {
    console.log('\n' + '='.repeat(60));
    console.log('       DMT EDUCATION SYSTEM - RESET DATABASE');
    console.log('='.repeat(60) + '\n');

    log.info('Connecting to master database...');
    pool = await sql.connect({...config, database: 'master'});
    log.success('Connected to master database');
    
    log.info('Dropping existing database (if exists)...');
    await pool.request().query(`
      IF EXISTS (SELECT name FROM sys.databases WHERE name = 'DMT_EDUCATION_SYSTEM')
      BEGIN
        ALTER DATABASE DMT_EDUCATION_SYSTEM SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
        DROP DATABASE DMT_EDUCATION_SYSTEM;
        PRINT 'Database dropped successfully';
      END
      ELSE
      BEGIN
        PRINT 'Database does not exist';
      END
    `);
    
    log.success('Database reset complete');
    
    console.log('\n' + '='.repeat(60));
    log.success('DATABASE RESET COMPLETE!');
    console.log('='.repeat(60) + '\n');
    
    log.info('Next step: Run setup-database-complete.mjs to create fresh database');
    
  } catch (err) {
    log.error(`Reset failed: ${err.message}`);
    console.error(err);
    process.exit(1);
  } finally {
    if (pool) await pool.close();
  }
}

resetDatabase();
