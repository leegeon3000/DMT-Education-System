import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { supabase } from '../server';
import { query } from '../utils/database';
import { ResponseHelper } from '../utils/response';
import { authenticateToken, requireRole, ROLES } from '../middleware/auth';
import { validateBody, validateParams, validateQuery, PaginationSchema, IdParamSchema } from '../middleware/validation';

const CreateTeacherSchema = z.object({
  // User info
  email: z.string().email(),
  password: z.string().min(6),
  full_name: z.string().min(1),
  phone: z.string().optional(),
  address: z.string().optional(),
  birth_date: z.string().optional(),
  
  // Teacher specific info
  teacher_code: z.string().optional(),
  main_subject_id: z.number().int().positive().optional(),
  years_experience: z.number().int().min(0).default(0),
  degree: z.string().optional(),
  specialization: z.string().optional(),
});

const UpdateTeacherSchema = z.object({
  // User info updates
  email: z.string().email().optional(),
  full_name: z.string().min(1).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  birth_date: z.string().optional(),
  status: z.boolean().optional(),
  
  // Teacher specific updates
  teacher_code: z.string().optional(),
  main_subject_id: z.number().int().positive().optional(),
  years_experience: z.number().int().min(0).optional(),
  degree: z.string().optional(),
  specialization: z.string().optional(),
});

const TeacherQuerySchema = PaginationSchema.extend({
  main_subject_id: z.coerce.number().int().positive().optional(),
  status: z.coerce.boolean().optional(),
});

export async function teachersRoutes(app: FastifyInstance) {
  // GET /teachers - List teachers with filters (PUBLIC - no auth required)
  app.get('/teachers', {
    preHandler: [validateQuery(TeacherQuerySchema)]
  }, async (req: any, reply: any) => {
    try {
      const { page, limit, search, main_subject_id, status } = req.query;
      const offset = (page - 1) * limit;

      let conditions: string[] = [];
      let params: any[] = [];
      let paramIndex = 1;

      if (search) {
        conditions.push(`(u.full_name LIKE @search OR u.email LIKE @search OR t.teacher_code LIKE @search)`);
        params.push({ name: 'search', value: `%${search}%` });
      }

      if (main_subject_id) {
        conditions.push(`t.main_subject_id = @main_subject_id`);
        params.push({ name: 'main_subject_id', value: main_subject_id });
      }

      if (status !== undefined) {
        conditions.push(`u.status = @status`);
        params.push({ name: 'status', value: status });
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      // Count query
      const countQuery = `
        SELECT COUNT(*) as total
        FROM teachers t
        INNER JOIN users u ON t.user_id = u.id
        ${whereClause}
      `;
      const countResult = await query(countQuery, params);
      const total = parseInt(countResult.rows[0].total);

      // Data query (SQL Server syntax) - Return flat structure matching PublicTeacher
      const dataQuery = `
        SELECT 
          t.id, t.teacher_code, t.main_subject_id,
          t.years_experience, t.degree, t.specialization,
          t.created_at,
          u.full_name, u.phone, u.address, u.birth_date,
          NULL as bio, NULL as avatar_url, u.status as is_active
        FROM teachers t
        INNER JOIN users u ON t.user_id = u.id
        ${whereClause}
        ORDER BY t.id
        OFFSET $${paramIndex} ROWS
        FETCH NEXT $${paramIndex + 1} ROWS ONLY
      `;
      const dataResult = await query(dataQuery, [...params, offset, limit]);

      // Transform to match PublicTeacher interface
      const transformedData = dataResult.rows.map((row: any) => ({
        id: row.id,
        teacher_code: row.teacher_code,
        full_name: row.full_name,
        phone: row.phone,
        address: row.address,
        birth_date: row.birth_date,
        degree: row.degree,
        specialization: row.specialization,
        years_of_experience: row.years_experience,
        bio: row.bio,
        avatar_url: row.avatar_url,
        is_active: row.is_active,
        created_at: row.created_at
      }));

      return ResponseHelper.successWithPagination(
        reply,
        transformedData,
        { page, limit, total }
      );
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // GET /teachers/:id - Get teacher details (PUBLIC - no auth required)
  app.get('/teachers/:id', {
    preHandler: [validateParams(IdParamSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { id } = req.params;
      const sql = `
        SELECT 
          t.id, t.teacher_code, t.main_subject_id,
          t.years_experience, t.degree, t.specialization,
          t.created_at,
          u.full_name, u.phone, u.address, u.birth_date,
          NULL as bio, NULL as avatar_url, u.status as is_active
        FROM teachers t
        INNER JOIN users u ON t.user_id = u.id
        WHERE t.id = $1
      `;
      const result = await query(sql, [id]);

      if (result.rows.length === 0) {
        return ResponseHelper.notFound(reply, 'Teacher');
      }

      const teacher = {
        id: result.rows[0].id,
        teacher_code: result.rows[0].teacher_code,
        full_name: result.rows[0].full_name,
        phone: result.rows[0].phone,
        address: result.rows[0].address,
        birth_date: result.rows[0].birth_date,
        degree: result.rows[0].degree,
        specialization: result.rows[0].specialization,
        years_of_experience: result.rows[0].years_experience,
        bio: result.rows[0].bio,
        avatar_url: result.rows[0].avatar_url,
        is_active: result.rows[0].is_active,
        created_at: result.rows[0].created_at
      };

      return ResponseHelper.success(reply, teacher);
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // POST /teachers - Create new teacher
  app.post('/teachers', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN, ROLES.STAFF])],
    preHandler: [validateBody(CreateTeacherSchema)]
  }, async (req: any, reply: any) => {
    try {
      const teacherData = req.body;
      
      // Generate teacher code if not provided
      if (!teacherData.teacher_code) {
        const year = new Date().getFullYear();
        const { count } = await supabase
          .from('teachers')
          .select('*', { count: 'exact', head: true });
        teacherData.teacher_code = `GV${year}${String(count + 1).padStart(4, '0')}`;
      }

      // Create user first
      const saltRounds = 12;
      const password_hash = await bcrypt.hash(teacherData.password, saltRounds);
      
      const { password, teacher_code, main_subject_id, years_experience, degree, specialization, ...userData } = teacherData;
      
      const { data: user, error: userError } = await supabase
        .from('users')
        .insert({ 
          ...userData, 
          password_hash,
          role_id: ROLES.TEACHER 
        })
        .select('id')
        .single();

      if (userError) {
        if (userError.code === '23505') {
          return ResponseHelper.error(reply, 'Email already exists', 409);
        }
        throw userError;
      }

      // Create teacher record
      const { data: teacher, error: teacherError } = await supabase
        .from('teachers')
        .insert({
          user_id: user.id,
          teacher_code,
          main_subject_id,
          years_experience,
          degree,
          specialization,
        })
        .select(`
          *,
          users!inner(
            id, email, full_name, phone, status
          ),
          subjects(
            id, name, code
          )
        `)
        .single();

      if (teacherError) throw teacherError;

      return ResponseHelper.success(reply, teacher, 'Teacher created successfully', 201);
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // PUT /teachers/:id - Update teacher
  app.put('/teachers/:id', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN, ROLES.STAFF])],
    preHandler: [validateParams(IdParamSchema), validateBody(UpdateTeacherSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Get teacher with user_id
      const { data: teacher, error: getError } = await supabase
        .from('teachers')
        .select('user_id')
        .eq('id', id)
        .single();

      if (getError || !teacher) {
        return ResponseHelper.notFound(reply, 'Teacher');
      }

      // Separate user and teacher updates
      const { email, full_name, phone, address, birth_date, status, ...teacherUpdates } = updateData;
      const userUpdates = { email, full_name, phone, address, birth_date, status };

      // Update user table if needed
      const userKeys = Object.keys(userUpdates).filter(key => userUpdates[key as keyof typeof userUpdates] !== undefined);
      if (userKeys.length > 0) {
        const filteredUserUpdates = Object.fromEntries(
          userKeys.map(key => [key, userUpdates[key as keyof typeof userUpdates]])
        );
        
        const { error: userError } = await supabase
          .from('users')
          .update(filteredUserUpdates)
          .eq('id', teacher.user_id);

        if (userError) throw userError;
      }

      // Update teacher table if needed
      const teacherKeys = Object.keys(teacherUpdates).filter(key => teacherUpdates[key as keyof typeof teacherUpdates] !== undefined);
      if (teacherKeys.length > 0) {
        const filteredTeacherUpdates = Object.fromEntries(
          teacherKeys.map(key => [key, teacherUpdates[key as keyof typeof teacherUpdates]])
        );
        
        const { error: teacherError } = await supabase
          .from('teachers')
          .update(filteredTeacherUpdates)
          .eq('id', id);

        if (teacherError) throw teacherError;
      }

      // Get updated teacher data
      const { data: updatedTeacher, error: fetchError } = await supabase
        .from('teachers')
        .select(`
          *,
          users!inner(
            id, email, full_name, phone, address, birth_date, status
          ),
          subjects(
            id, name, code
          )
        `)
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      return ResponseHelper.success(reply, updatedTeacher, 'Teacher updated successfully');
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // DELETE /teachers/:id - Delete teacher
  app.delete('/teachers/:id', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN])],
    preHandler: [validateParams(IdParamSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { id } = req.params;

      // Check if teacher has active classes
      const { data: activeClasses } = await supabase
        .from('classes')
        .select('id')
        .eq('teacher_id', id)
        .eq('status', 'active')
        .limit(1);

      if (activeClasses && activeClasses.length > 0) {
        return ResponseHelper.error(reply, 'Cannot delete teacher with active classes', 409);
      }

      // Get teacher with user_id
      const { data: teacher, error: getError } = await supabase
        .from('teachers')
        .select('user_id')
        .eq('id', id)
        .single();

      if (getError || !teacher) {
        return ResponseHelper.notFound(reply, 'Teacher');
      }

      // Delete teacher record first
      const { error: teacherError } = await supabase
        .from('teachers')
        .delete()
        .eq('id', id);

      if (teacherError) throw teacherError;

      // Delete user record
      const { error: userError } = await supabase
        .from('users')
        .delete()
        .eq('id', teacher.user_id);

      if (userError) throw userError;

      return ResponseHelper.success(reply, null, 'Teacher deleted successfully');
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // GET /teachers/:id/classes - Get teacher's classes
  app.get('/teachers/:id/classes', {
    preValidation: [authenticateToken],
    preHandler: [validateParams(IdParamSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { id } = req.params;
      
      const { data, error } = await supabase
        .from('classes')
        .select(`
          *,
          courses!inner(
            id, name, description
          )
        `)
        .eq('teacher_id', id)
        .order('start_date', { ascending: false });

      if (error) throw error;

      return ResponseHelper.success(reply, data);
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // GET /teachers/:id/performance - Get teacher performance stats
  app.get('/teachers/:id/performance', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN, ROLES.STAFF])],
    preHandler: [validateParams(IdParamSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { id } = req.params;
      
      // Get basic stats
      const [classesResult, studentsResult, ratingsResult] = await Promise.all([
        // Total classes taught
        supabase
          .from('classes')
          .select('id', { count: 'exact', head: true })
          .eq('teacher_id', id),
        
        // Total students taught
        supabase
          .from('enrollments')
          .select('student_id', { count: 'exact', head: true })
          .in('class_id', 
            supabase
              .from('classes')
              .select('id')
              .eq('teacher_id', id)
          ),
        
        // Average attendance rate would require more complex query
        // For now, return mock data structure
        { data: [], error: null, count: 0 }
      ]);

      const stats = {
        total_classes: classesResult.count || 0,
        total_students: studentsResult.count || 0,
        average_rating: 4.5, // Would be calculated from actual feedback
        attendance_rate: 85.5, // Would be calculated from attendance data
      };

      return ResponseHelper.success(reply, stats);
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });
}