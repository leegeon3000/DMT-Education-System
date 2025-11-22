#!/usr/bin/env node

/**
 * Fix NULL password hashes in database
 * Sets proper bcrypt hashes for all users
 */

import sql from 'mssql';
import bcrypt from 'bcryptjs';

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
  server: 'localhost',
  database: 'DMT_EDUCATION_SYSTEM',
  user: 'sa',
  password: 'Password123!',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
  }
};

// Default passwords for each role
const DEFAULT_PASSWORDS = {
  1: 'Admin@123',     // ADMIN
  2: 'Staff@123',     // STAFF
  3: 'Teacher@123',   // TEACHER
  4: 'Student@123',   // STUDENT
  5: 'Parent@123'     // PARENT
};

async function fixPasswords() {
  let pool;
  try {
    console.log('\n' + '='.repeat(70));
    console.log('           DMT DATABASE - FIX PASSWORD HASHES');
    console.log('='.repeat(70) + '\n');

    pool = await sql.connect(config);
    
    // Find users with NULL or empty password_hash
    const result = await pool.request().query(`
      SELECT id, email, full_name, role_id
      FROM USERS
      WHERE password_hash IS NULL OR LEN(password_hash) = 0
    `);
    
    if (result.recordset.length === 0) {
      log.success('All users already have password hashes set');
      return;
    }
    
    log.warning(`Found ${result.recordset.length} users with missing passwords`);
    console.log('');
    
    let fixed = 0;
    
    for (const user of result.recordset) {
      const defaultPassword = DEFAULT_PASSWORDS[user.role_id] || 'Default@123';
      const passwordHash = await bcrypt.hash(defaultPassword, 10);
      
      await pool.request()
        .input('userId', sql.Int, user.id)
        .input('passwordHash', sql.VarChar(255), passwordHash)
        .query('UPDATE USERS SET password_hash = @passwordHash WHERE id = @userId');
      
      log.success(`Fixed: ${user.email.padEnd(35)} → Password: ${defaultPassword}`);
      fixed++;
    }
    
    console.log('\n' + '='.repeat(70));
    log.success(`Fixed ${fixed} user passwords!`);
    console.log('='.repeat(70) + '\n');
    
    console.log('Updated credentials:');
    console.log(`  ${colors.green}Admin:${colors.reset}   admin@dmt.edu.vn / Admin@123`);
    console.log(`  ${colors.green}Staff:${colors.reset}   staff1@dmt.edu.vn / Staff@123`);
    console.log(`  ${colors.green}Teacher:${colors.reset} teacher.math@dmt.edu.vn / Teacher@123`);
    console.log(`  ${colors.green}Student:${colors.reset} student001@gmail.com / Student@123`);
    console.log('');
    
  } catch (err) {
    log.error(`Failed: ${err.message}`);
    console.error(err);
    process.exit(1);
  } finally {
    if (pool) await pool.close();
  }
}

fixPasswords();
