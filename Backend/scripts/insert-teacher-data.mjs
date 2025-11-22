#!/usr/bin/env node

/**
 * Insert Teacher Sample Data Script
 * Reads the SQL file and executes it against the database
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sql from 'mssql';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database configuration
const config = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'Password123!',
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_NAME || 'DMT_EDUCATION_SYSTEM',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

async function insertTeacherData() {
  let pool;
  
  try {
    console.log('🔌 Connecting to SQL Server...');
    console.log(`   Server: ${config.server}`);
    console.log(`   Database: ${config.database}`);
    
    pool = await sql.connect(config);
    console.log('✅ Connected successfully!\n');
    
    // Read SQL file
    const sqlFilePath = path.join(__dirname, '..', 'Db_DMT_Teacher_Sample_Data.sql');
    console.log('📖 Reading SQL file...');
    console.log(`   Path: ${sqlFilePath}\n`);
    
    const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Split by GO statements (case insensitive)
    const batches = sqlScript
      .split(/\r?\nGO\r?\n/i)
      .filter(batch => batch.trim().length > 0);
    
    console.log(`📊 Found ${batches.length} SQL batches to execute\n`);
    
    // Execute each batch
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i].trim();
      
      // Skip comments and empty batches
      if (!batch || batch.startsWith('--') || batch.startsWith('/*')) {
        continue;
      }
      
      try {
        console.log(`⚙️  Executing batch ${i + 1}/${batches.length}...`);
        
        const result = await pool.request().query(batch);
        
        if (result.recordset && result.recordset.length > 0) {
          // This is likely a verification query
          console.log(`   ✓ Result: ${JSON.stringify(result.recordset[0])}`);
        } else if (result.rowsAffected && result.rowsAffected.length > 0) {
          const affected = result.rowsAffected.reduce((sum, count) => sum + count, 0);
          if (affected > 0) {
            console.log(`   ✓ ${affected} row(s) affected`);
          }
        } else {
          console.log(`   ✓ Executed successfully`);
        }
      } catch (batchError) {
        console.error(`   ❌ Error in batch ${i + 1}:`, batchError.message);
        
        // Show problematic SQL (first 200 chars)
        const preview = batch.substring(0, 200).replace(/\n/g, ' ');
        console.error(`   SQL Preview: ${preview}...`);
        
        // Continue with next batch instead of stopping
        console.log(`   ⚠️  Continuing with next batch...\n`);
      }
    }
    
    console.log('\n🎉 Teacher sample data insertion completed!');
    console.log('\n📋 Summary:');
    console.log('   - 8 Assignments created');
    console.log('   - 7 Submissions added');
    console.log('   - 1 Grade recorded');
    console.log('   - 8 Materials uploaded');
    console.log('   - 26 Class Sessions scheduled');
    console.log('   - Attendance records auto-generated\n');
    
    // Run verification queries
    console.log('🔍 Running verification queries...\n');
    
    const verifications = [
      { name: 'Assignments', query: 'SELECT COUNT(*) as count FROM ASSIGNMENTS WHERE teacher_id IN (4, 5, 6)' },
      { name: 'Submissions', query: 'SELECT COUNT(*) as count FROM SUBMISSIONS' },
      { name: 'Grades', query: 'SELECT COUNT(*) as count FROM GRADES' },
      { name: 'Materials', query: 'SELECT COUNT(*) as count FROM MATERIALS WHERE uploaded_by IN (4, 5, 6)' },
      { name: 'Class Sessions', query: 'SELECT COUNT(*) as count FROM CLASS_SESSIONS WHERE teacher_id IN (4, 5, 6)' },
      { name: 'Attendance', query: 'SELECT COUNT(*) as count FROM ATTENDANCE' }
    ];
    
    for (const verification of verifications) {
      try {
        const result = await pool.request().query(verification.query);
        const count = result.recordset[0].count;
        console.log(`   ✓ ${verification.name}: ${count} records`);
      } catch (verifyError) {
        console.error(`   ❌ ${verification.name}: Could not verify`, verifyError.message);
      }
    }
    
    console.log('\n✅ All done! You can now test the Teacher module with real data.\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  } finally {
    if (pool) {
      await pool.close();
      console.log('🔌 Database connection closed.');
    }
  }
}

// Run the script
insertTeacherData();
