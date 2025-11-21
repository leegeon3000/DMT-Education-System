import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { query, executeProcedure, sql } from '../utils/database';
import bcrypt from 'bcryptjs';

export async function authRoutes(app: FastifyInstance) {
  // Fast OPTIONS handler for preflight requests
  app.options('/auth/login', async (req, reply) => {
    return reply.code(204).send();
  });

  // Register Student
  app.post('/auth/register/student', async (req, reply) => {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(8, 'Password must be at least 8 characters'),
      full_name: z.string().min(1),
      phone: z.string().optional(),
      address: z.string().optional(),
      birth_date: z.string().optional(), // ISO date string
      school_level: z.enum(['ELEMENTARY', 'MIDDLE_SCHOOL', 'HIGH_SCHOOL']).optional(),
      parent_name: z.string().optional(),
      parent_phone: z.string().optional(),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.flatten() });
    }

    const data = parsed.data;

    try {
      // Hash password
      const password_hash = await bcrypt.hash(data.password, 10);

      // Call stored procedure
      const result = await executeProcedure('sp_RegisterStudent', {
        input: {
          email: data.email,
          password_hash: password_hash,
          full_name: data.full_name,
          phone: data.phone || null,
          address: data.address || null,
          birth_date: data.birth_date ? new Date(data.birth_date) : null,
          school_level: data.school_level || 'HIGH_SCHOOL',
          parent_name: data.parent_name || null,
          parent_phone: data.parent_phone || null,
        },
        output: {
          student_id: sql.Int,
          student_code: sql.VarChar(50),
          error_message: sql.NVarChar(500),
        },
      });

      if (result.returnValue === 0) {
        // Success
        return reply.code(201).send({
          success: true,
          message: 'Student registered successfully',
          data: {
            student_id: result.output.student_id,
            student_code: result.output.student_code,
            email: data.email,
            full_name: data.full_name,
          },
        });
      } else {
        // Business logic error
        return reply.code(400).send({
          success: false,
          error: result.output.error_message || 'Registration failed',
        });
      }
    } catch (error: any) {
      console.error('Register student error:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });

  // Register Teacher
  app.post('/auth/register/teacher', async (req, reply) => {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(8, 'Password must be at least 8 characters'),
      full_name: z.string().min(1),
      phone: z.string().optional(),
      address: z.string().optional(),
      birth_date: z.string().optional(),
      degree: z.string().optional(),
      specialization: z.string().optional(),
      years_of_experience: z.number().int().min(0).optional(),
      bio: z.string().optional(),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.flatten() });
    }

    const data = parsed.data;

    try {
      // Hash password
      const password_hash = await bcrypt.hash(data.password, 10);

      // Call stored procedure
      const result = await executeProcedure('sp_RegisterTeacher', {
        input: {
          email: data.email,
          password_hash: password_hash,
          full_name: data.full_name,
          phone: data.phone || null,
          address: data.address || null,
          birth_date: data.birth_date ? new Date(data.birth_date) : null,
          degree: data.degree || null,
          specialization: data.specialization || null,
          years_of_experience: data.years_of_experience || 0,
          bio: data.bio || null,
        },
        output: {
          teacher_id: sql.Int,
          teacher_code: sql.VarChar(50),
          error_message: sql.NVarChar(500),
        },
      });

      if (result.returnValue === 0) {
        return reply.code(201).send({
          success: true,
          message: 'Teacher registered successfully',
          data: {
            teacher_id: result.output.teacher_id,
            teacher_code: result.output.teacher_code,
            email: data.email,
            full_name: data.full_name,
          },
        });
      } else {
        return reply.code(400).send({
          success: false,
          error: result.output.error_message || 'Registration failed',
        });
      }
    } catch (error: any) {
      console.error('Register teacher error:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });

  // Login with email + password
  app.post('/auth/login', async (req, reply) => {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success)
      return reply.code(400).send({ error: parsed.error.flatten() });

    const { email, password } = parsed.data;

    // Fetch user by email
    const sql_query = `SELECT * FROM users WHERE email = @p1`;
    const result = await query(sql_query, [email]);
    
    if (result.rows.length === 0) {
      return reply.code(401).send({ success: false, error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    
    // SQL Server returns uppercase field names, normalize to lowercase
    const normalizedUser = {
      id: user.ID || user.id,
      email: user.EMAIL || user.email,
      password_hash: user.PASSWORD_HASH || user.password_hash,
      role_id: user.ROLE_ID || user.role_id,
      full_name: user.FULL_NAME || user.full_name
    };

    // Debug logging
    console.log('Login attempt:', {
      email,
      hasPassword: !!password,
      hasUserPasswordHash: !!normalizedUser.password_hash,
      passwordHashLength: normalizedUser.password_hash?.length
    });

    // Verify password
    if (!normalizedUser.password_hash) {
      console.error('User has no password_hash:', normalizedUser.email);
      return reply.code(500).send({ 
        success: false,
        error: 'User account configuration error' 
      });
    }

    const ok = await bcrypt.compare(password, normalizedUser.password_hash);
    if (!ok) return reply.code(401).send({ success: false, error: 'Invalid credentials' });

    // Get additional info based on role
    let additionalInfo: any = {};
    
    if (normalizedUser.role_id === 4) { // STUDENT
      const studentQuery = `SELECT id as student_id, student_code FROM students WHERE user_id = @p1`;
      const studentResult = await query(studentQuery, [normalizedUser.id]);
      if (studentResult.rows.length > 0) {
        additionalInfo = studentResult.rows[0];
      }
    } else if (normalizedUser.role_id === 3) { // TEACHER
      const teacherQuery = `SELECT id as teacher_id, teacher_code FROM teachers WHERE user_id = @p1`;
      const teacherResult = await query(teacherQuery, [normalizedUser.id]);
      if (teacherResult.rows.length > 0) {
        additionalInfo = teacherResult.rows[0];
      }
    }

    // issue a simple signed JWT (Fastify JWT)
    const token = await reply.jwtSign({
      sub: String(normalizedUser.id),
      email: normalizedUser.email,
      role_id: normalizedUser.role_id,
    });

    return {
      success: true,
      token,
      user: {
        id: normalizedUser.id,
        email: normalizedUser.email,
        full_name: normalizedUser.full_name,
        role_id: normalizedUser.role_id,
        ...additionalInfo,
      },
    };
  });

  // Get current user
  app.get(
    '/auth/me',
    { preValidation: [app.authenticate] },
    async (req: any, reply: any) => {
      try {
        const userId = Number(req.user?.sub);
        const sql_query = `SELECT id, email, full_name, role_id, status, created_at FROM users WHERE id = @p1`;
        const result = await query(sql_query, [userId]);
        
        if (result.rows.length === 0) {
          return reply.code(404).send({ error: 'User not found' });
        }
        
        const user = result.rows[0];
        
        // If student, get student_id and student_code
        if (user.role_id === 4) { // STUDENT role
          const studentQuery = `SELECT id as student_id, student_code FROM students WHERE user_id = @p1`;
          const studentResult = await query(studentQuery, [userId]);
          if (studentResult.rows.length > 0) {
            user.student_id = studentResult.rows[0].student_id;
            user.student_code = studentResult.rows[0].student_code;
          }
        }
        
        // If teacher, get teacher_id and teacher_code
        if (user.role_id === 3) { // TEACHER role
          const teacherQuery = `SELECT id as teacher_id, teacher_code FROM teachers WHERE user_id = @p1`;
          const teacherResult = await query(teacherQuery, [userId]);
          if (teacherResult.rows.length > 0) {
            user.teacher_id = teacherResult.rows[0].teacher_id;
            user.teacher_code = teacherResult.rows[0].teacher_code;
          }
        }
        
        return { user };
      } catch (error: any) {
        return reply.code(500).send({ error: error.message });
      }
    }
  );
}
