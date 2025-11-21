#!/usr/bin/env node

/**
 * Script to create database and import schema into SQL Server
 * Usage: node scripts/create-database.mjs
 */

import sql from 'mssql';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

// Configuration from environment or defaults
const config = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'DMTEducation2024',
  server: process.env.DB_SERVER || 'localhost',
  port: parseInt(process.env.DB_PORT || '1433'),
  database: 'master', // Connect to master first
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: true,
    enableArithAbort: true,
    connectTimeout: 30000,
    requestTimeout: 30000
  }
};

const DATABASE_NAME = 'dmt_education_system';
const SCHEMA_FILE = path.join(__dirname, '..', 'Db_DMT_SQLServer.sql');

async function createDatabase() {
  let pool;
  
  try {
    console.log('🔌 Connecting to SQL Server...');
    console.log(`   Server: ${config.server}:${config.port}`);
    console.log(`   User: ${config.user}`);
    
    pool = await sql.connect(config);
    console.log('Connected to SQL Server\n');

    // Check if database exists
    console.log(`📊 Checking if database '${DATABASE_NAME}' exists...`);
    const checkDb = await pool.request().query(`
      SELECT name FROM sys.databases WHERE name = '${DATABASE_NAME}'
    `);

    if (checkDb.recordset.length > 0) {
      console.log(`Database '${DATABASE_NAME}' already exists`);
      const readline = await import('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      const answer = await new Promise((resolve) => {
        rl.question('Do you want to drop and recreate it? (yes/no): ', resolve);
      });
      rl.close();

      if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
        console.log(`🗑️  Dropping database '${DATABASE_NAME}'...`);
        await pool.request().query(`
          ALTER DATABASE ${DATABASE_NAME} SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
          DROP DATABASE ${DATABASE_NAME};
        `);
        console.log('Database dropped\n');
      } else {
        console.log('Operation cancelled');
        process.exit(0);
      }
    }

    // Create database
    console.log(`📊 Creating database '${DATABASE_NAME}'...`);
    await pool.request().query(`CREATE DATABASE ${DATABASE_NAME}`);
    console.log(`Database '${DATABASE_NAME}' created successfully\n`);

    // Close master connection
    await pool.close();

    // Connect to new database
    console.log(`🔌 Connecting to '${DATABASE_NAME}'...`);
    config.database = DATABASE_NAME;
    pool = await sql.connect(config);
    console.log('Connected to new database\n');

    // Read and execute schema file
    console.log('📝 Reading schema file...');
    if (!fs.existsSync(SCHEMA_FILE)) {
      throw new Error(`Schema file not found: ${SCHEMA_FILE}`);
    }

    const schemaSQL = fs.readFileSync(SCHEMA_FILE, 'utf8');
    console.log(`Schema file loaded (${schemaSQL.length} characters)\n`);

    // Split by GO statements (SQL Server batch separator)
    console.log('⚙️  Executing schema...');
    const batches = schemaSQL
      .split(/^\s*GO\s*$/gim)
      .map(batch => batch.trim())
      .filter(batch => batch.length > 0);

    console.log(`   Found ${batches.length} SQL batches to execute`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < batches.length; i++) {
      try {
        await pool.request().query(batches[i]);
        successCount++;
        process.stdout.write(`\r   Progress: ${i + 1}/${batches.length} batches executed`);
      } catch (err) {
        errorCount++;
        console.error(`\n   Error in batch ${i + 1}:`, err.message);
      }
    }

    console.log('\n');
    console.log('Schema execution completed');
    console.log(`   Success: ${successCount} batches`);
    if (errorCount > 0) {
      console.log(`   Errors: ${errorCount} batches (see above for details)`);
    }

    // Verify tables created
    console.log('\n📊 Verifying tables...');
    const tables = await pool.request().query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_TYPE = 'BASE TABLE'
      ORDER BY TABLE_NAME
    `);

    console.log(`Found ${tables.recordset.length} tables:`);
    tables.recordset.forEach((table, index) => {
      console.log(`   ${index + 1}. ${table.TABLE_NAME}`);
    });

    await pool.close();

    console.log('\n' + '='.repeat(60));
    console.log('🎉 Database setup completed successfully!');
    console.log('='.repeat(60));
    console.log('\n📝 Next steps:');
    console.log('   1. Run: node scripts/seed-data.mjs (to insert sample data)');
    console.log('   2. Update .env.local with correct DB_DATABASE value');
    console.log('   3. Start backend: npm run dev');
    console.log('');

  } catch (err) {
    console.error('\nError:', err.message);
    console.error('\nFull error:', err);
    process.exit(1);
  } finally {
    if (pool) {
      await pool.close();
    }
  }
}

// Run the script
createDatabase();
