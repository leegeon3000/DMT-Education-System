#!/usr/bin/env node

/**
 * =================================================================
 * GENERATE PASSWORD HASH - FOR SQL SERVER DATABASE
 * =================================================================
 * Script tạo bcrypt password hash cho DMT Education System
 * 
 * CÁCH DÙNG:
 * node Backend/scripts/generate-password-hash.mjs [password]
 * 
 * VÍ DỤ:
 * node Backend/scripts/generate-password-hash.mjs Admin@123
 * node Backend/scripts/generate-password-hash.mjs Teacher@123
 * =================================================================
 */

import bcrypt from 'bcryptjs';

// Salt rounds (phải giống với backend)
const SALT_ROUNDS = 10;

/**
 * Tạo password hash từ plain password
 */
async function generatePasswordHash(password) {
  try {
    console.log('');
    console.log('=================================================================');
    console.log('PASSWORD HASH GENERATOR - DMT EDUCATION SYSTEM');
    console.log('=================================================================');
    console.log('');
    
    // Validate input
    if (!password || password.trim() === '') {
      console.error('ERROR: Password cannot be empty!');
      console.log('');
      console.log('Usage: node generate-password-hash.mjs [password]');
      console.log('Example: node generate-password-hash.mjs Admin@123');
      console.log('');
      process.exit(1);
    }
    
    console.log('🔐 Generating hash for password:', password);
    console.log('⚙️  Salt rounds:', SALT_ROUNDS);
    console.log('');
    
    // Generate hash
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    
    console.log('Password hash generated successfully!');
    console.log('');
    console.log('─────────────────────────────────────────────────────────────────');
    console.log('HASH (bcrypt):');
    console.log(hash);
    console.log('─────────────────────────────────────────────────────────────────');
    console.log('');
    
    // Verify hash
    const isValid = await bcrypt.compare(password, hash);
    console.log('🔍 Verification test:', isValid ? 'PASSED' : 'FAILED');
    console.log('');
    
    // Generate SQL UPDATE statement
    console.log('─────────────────────────────────────────────────────────────────');
    console.log('SQL UPDATE STATEMENT (Example):');
    console.log('─────────────────────────────────────────────────────────────────');
    console.log(`UPDATE USERS`);
    console.log(`SET PASSWORD_HASH = '${hash}'`);
    console.log(`WHERE EMAIL = 'your-email@example.com';`);
    console.log('─────────────────────────────────────────────────────────────────');
    console.log('');
    
    // Hash details
    console.log('📊 HASH DETAILS:');
    console.log(`   - Length: ${hash.length} characters`);
    console.log(`   - Format: bcrypt ($2a$${SALT_ROUNDS}$...)`);
    console.log(`   - Compatible: SQL Server VARCHAR(255)`);
    console.log('');
    
    console.log('=================================================================');
    console.log('💡 TIP: Copy the hash above and use it in your SQL INSERT/UPDATE');
    console.log('=================================================================');
    console.log('');
    
    return hash;
    
  } catch (error) {
    console.error('');
    console.error('ERROR generating hash:', error.message);
    console.error('');
    process.exit(1);
  }
}

// Main execution
const password = process.argv[2];

if (!password) {
  console.log('');
  console.log('=================================================================');
  console.log('PASSWORD HASH GENERATOR');
  console.log('=================================================================');
  console.log('');
  console.log('Usage:');
  console.log('  node generate-password-hash.mjs [password]');
  console.log('');
  console.log('Examples:');
  console.log('  node generate-password-hash.mjs Admin@123');
  console.log('  node generate-password-hash.mjs Teacher@123');
  console.log('  node generate-password-hash.mjs Student@123');
  console.log('  node generate-password-hash.mjs Staff@123');
  console.log('');
  console.log('=================================================================');
  console.log('');
  process.exit(1);
}

generatePasswordHash(password);
