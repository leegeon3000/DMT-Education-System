import sql from 'mssql';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const config = {
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_DATABASE || 'DMT_EDUCATION_SYSTEM',
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

async function updateExistingCourses() {
  try {
    console.log('🔌 Connecting...');
    const pool = await sql.connect(config);
    console.log('✅ Connected!\n');

    console.log('📸 Updating existing courses...\n');

    // Update based on actual course codes
    const updates = [
      { code: 'MATH-G10-2025', url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=450&fit=crop', students: 198 },
      { code: 'MATH-G11-2025', url: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&h=450&fit=crop', students: 176 },
      { code: 'ENG-IELTS-2025', url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=450&fit=crop', students: 234 },
      { code: 'ENG-BASIC-2025', url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&h=450&fit=crop', students: 189 },
      { code: 'PHYS-G10-2025', url: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800&h=450&fit=crop', students: 156 },
      { code: 'CHEM-G10-2025', url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&h=450&fit=crop', students: 134 }
    ];

    for (const update of updates) {
      const result = await pool.request()
        .input('code', sql.VarChar, update.code)
        .input('url', sql.NVarChar, update.url)
        .input('students', sql.Int, update.students)
        .query('UPDATE courses SET thumbnail_url = @url, students_count = @students WHERE code = @code');
      console.log(`  ✓ Updated course ${update.code}`);
    }

    console.log('\n✅ All courses updated!\n');

    // Show results
    const result = await pool.request().query(`
      SELECT id, code, name, thumbnail_url, students_count 
      FROM courses
    `);
    
    console.log('📋 Updated courses:\n');
    result.recordset.forEach(course => {
      console.log(`  ✓ [${course.code}] ${course.name}`);
      console.log(`    ${course.students_count} students | ${course.thumbnail_url ? '✓ Has image' : '✗ No image'}\n`);
    });
    
    await pool.close();
    console.log('🎉 Done!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateExistingCourses();
