import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { supabase } from '../server';
import { ResponseHelper } from '../utils/response';
import { authenticateToken, requireRole, ROLES } from '../middleware/auth';
import { validateBody, validateParams, validateQuery, PaginationSchema, IdParamSchema } from '../middleware/validation';

const CreateStudentSchema = z.object({
  // User info
  email: z.string().email(),
  password: z.string().min(6),
  full_name: z.string().min(1),
  phone: z.string().optional(),
  address: z.string().optional(),
  birth_date: z.string().optional(),
  
  // Student specific info
  student_code: z.string().optional(),
  school_level: z.enum(['elementary', 'middle_school', 'high_school']).optional(),
  parent_name: z.string().optional(),
  parent_phone: z.string().optional(),
  parent_email: z.string().email().optional(),
});

const UpdateStudentSchema = z.object({
  // User info updates
  email: z.string().email().optional(),
  full_name: z.string().min(1).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  birth_date: z.string().optional(),
  status: z.boolean().optional(),
  
  // Student specific updates
  student_code: z.string().optional(),
  school_level: z.enum(['elementary', 'middle_school', 'high_school']).optional(),
  parent_name: z.string().optional(),
  parent_phone: z.string().optional(),
  parent_email: z.string().email().optional(),
});

const StudentQuerySchema = PaginationSchema.extend({
  school_level: z.enum(['elementary', 'middle_school', 'high_school']).optional(),
  status: z.coerce.boolean().optional(),
});

export async function studentsRoutes(app: FastifyInstance) {
  // GET /students - List students with filters
  app.get('/students', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN, ROLES.STAFF, ROLES.TEACHER])],
    preHandler: [validateQuery(StudentQuerySchema)]
  }, async (req: any, reply: any) => {
    try {
      const { page, limit, search, school_level, status } = req.query;
      const offset = (page - 1) * limit;

      let query = supabase
        .from('students')
        .select(`
          *,
          users!inner(
            id, email, full_name, phone, address, birth_date, status, created_at
          )
        `, { count: 'exact' })
        .range(offset, offset + limit - 1)
        .order('id');

      if (search) {
        query = query.or(`users.full_name.ilike.%${search}%,users.email.ilike.%${search}%,student_code.ilike.%${search}%`);
      }

      if (school_level) {
        query = query.eq('school_level', school_level);
      }

      if (status !== undefined) {
        query = query.eq('users.status', status);
      }

      const { data, error, count } = await query;
      if (error) throw error;

      return ResponseHelper.successWithPagination(
        reply,
        data,
        { page, limit, total: count || 0 }
      );
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // GET /students/:id - Get student details
  app.get('/students/:id', {
    preValidation: [authenticateToken],
    preHandler: [validateParams(IdParamSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          users!inner(
            id, email, full_name, phone, address, birth_date, status, created_at
          )
        `)
        .eq('id', id)
        .single();

      if (error || !data) {
        return ResponseHelper.notFound(reply, 'Student');
      }

      return ResponseHelper.success(reply, data);
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // POST /students - Create new student
  app.post('/students', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN, ROLES.STAFF])],
    preHandler: [validateBody(CreateStudentSchema)]
  }, async (req: any, reply: any) => {
    try {
      const studentData = req.body;
      
      // Generate student code if not provided
      if (!studentData.student_code) {
        const year = new Date().getFullYear();
        const { count } = await supabase
          .from('students')
          .select('*', { count: 'exact', head: true });
        studentData.student_code = `DMT${year}${String(count + 1).padStart(4, '0')}`;
      }

      // Create user first
      const saltRounds = 12;
      const password_hash = await bcrypt.hash(studentData.password, saltRounds);
      
      const { password, student_code, school_level, parent_name, parent_phone, parent_email, ...userData } = studentData;
      
      const { data: user, error: userError } = await supabase
        .from('users')
        .insert({ 
          ...userData, 
          password_hash,
          role_id: ROLES.STUDENT 
        })
        .select('id')
        .single();

      if (userError) {
        if (userError.code === '23505') {
          return ResponseHelper.error(reply, 'Email already exists', 409);
        }
        throw userError;
      }

      // Create student record
      const { data: student, error: studentError } = await supabase
        .from('students')
        .insert({
          user_id: user.id,
          student_code,
          school_level,
          parent_name,
          parent_phone,
          parent_email,
        })
        .select(`
          *,
          users!inner(
            id, email, full_name, phone, status
          )
        `)
        .single();

      if (studentError) throw studentError;

      return ResponseHelper.success(reply, student, 'Student created successfully', 201);
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // PUT /students/:id - Update student
  app.put('/students/:id', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN, ROLES.STAFF])],
    preHandler: [validateParams(IdParamSchema), validateBody(UpdateStudentSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Get student with user_id
      const { data: student, error: getError } = await supabase
        .from('students')
        .select('user_id')
        .eq('id', id)
        .single();

      if (getError || !student) {
        return ResponseHelper.notFound(reply, 'Student');
      }

      // Separate user and student updates
      const { email, full_name, phone, address, birth_date, status, ...studentUpdates } = updateData;
      const userUpdates = { email, full_name, phone, address, birth_date, status };

      // Update user table if there are user fields to update
      if (Object.keys(userUpdates).some(key => userUpdates[key as keyof typeof userUpdates] !== undefined)) {
        const filteredUserUpdates = Object.fromEntries(
          Object.entries(userUpdates).filter(([_, value]) => value !== undefined)
        );
        
        const { error: userError } = await supabase
          .from('users')
          .update(filteredUserUpdates)
          .eq('id', student.user_id);

        if (userError) throw userError;
      }

      // Update student table if there are student fields to update
      if (Object.keys(studentUpdates).some(key => studentUpdates[key] !== undefined)) {
        const filteredStudentUpdates = Object.fromEntries(
          Object.entries(studentUpdates).filter(([_, value]) => value !== undefined)
        );
        
        const { error: studentError } = await supabase
          .from('students')
          .update(filteredStudentUpdates)
          .eq('id', id);

        if (studentError) throw studentError;
      }

      // Get updated student data
      const { data: updatedStudent, error: fetchError } = await supabase
        .from('students')
        .select(`
          *,
          users!inner(
            id, email, full_name, phone, address, birth_date, status
          )
        `)
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      return ResponseHelper.success(reply, updatedStudent, 'Student updated successfully');
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // DELETE /students/:id - Delete student
  app.delete('/students/:id', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN])],
    preHandler: [validateParams(IdParamSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { id } = req.params;

      // Get student with user_id to delete both records
      const { data: student, error: getError } = await supabase
        .from('students')
        .select('user_id')
        .eq('id', id)
        .single();

      if (getError || !student) {
        return ResponseHelper.notFound(reply, 'Student');
      }

      // Delete student record first (due to foreign key)
      const { error: studentError } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

      if (studentError) throw studentError;

      // Delete user record
      const { error: userError } = await supabase
        .from('users')
        .delete()
        .eq('id', student.user_id);

      if (userError) throw userError;

      return ResponseHelper.success(reply, null, 'Student deleted successfully');
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // GET /students/:id/enrollments - Get student's enrollments
  app.get('/students/:id/enrollments', {
    preValidation: [authenticateToken],
    preHandler: [validateParams(IdParamSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { id } = req.params;
      
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          classes!inner(
            id, name, code,
            courses!inner(name, description)
          )
        `)
        .eq('student_id', id)
        .order('enrollment_date', { ascending: false });

      if (error) throw error;

      return ResponseHelper.success(reply, data);
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });
}