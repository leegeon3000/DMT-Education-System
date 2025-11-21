import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { supabase } from '../server';
import { ResponseHelper } from '../utils/response';
import { authenticateToken, requireRole, ROLES } from '../middleware/auth';
import { validateBody, validateParams, validateQuery, PaginationSchema, IdParamSchema } from '../middleware/validation';

const CreateClassSchema = z.object({
  course_id: z.number().int().positive(),
  code: z.string().min(1).max(50),
  name: z.string().min(1).max(255),
  teacher_id: z.number().int().positive(),
  capacity: z.number().int().positive().default(25),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  schedule_days: z.string().optional(), // "Monday,Wednesday,Friday"
  schedule_time: z.string().optional(), // "18:00-20:00"
  classroom: z.string().max(100).optional(),
  status: z.enum(['planning', 'active', 'completed', 'cancelled']).default('planning'),
});

const UpdateClassSchema = z.object({
  course_id: z.number().int().positive().optional(),
  code: z.string().min(1).max(50).optional(),
  name: z.string().min(1).max(255).optional(),
  teacher_id: z.number().int().positive().optional(),
  capacity: z.number().int().positive().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  schedule_days: z.string().optional(),
  schedule_time: z.string().optional(),
  classroom: z.string().max(100).optional(),
  status: z.enum(['planning', 'active', 'completed', 'cancelled']).optional(),
});

const ClassQuerySchema = PaginationSchema.extend({
  course_id: z.coerce.number().int().positive().optional(),
  teacher_id: z.coerce.number().int().positive().optional(),
  status: z.enum(['planning', 'active', 'completed', 'cancelled']).optional(),
});

export async function classesRoutes(app: FastifyInstance) {
  // GET /classes - List classes with filters
  app.get('/classes', {
    preValidation: [authenticateToken],
    preHandler: [validateQuery(ClassQuerySchema)]
  }, async (req: any, reply: any) => {
    try {
      const { page, limit, search, course_id, teacher_id, status } = req.query;
      const offset = (page - 1) * limit;

      let query = supabase
        .from('classes')
        .select(`
          *,
          courses!inner(
            id, name, code, subject_id
          ),
          teachers!inner(
            id, 
            users!inner(
              id, full_name, email
            )
          )
        `, { count: 'exact' })
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });

      if (search) {
        query = query.or(`name.ilike.%${search}%,code.ilike.%${search}%`);
      }

      if (course_id) {
        query = query.eq('course_id', course_id);
      }

      if (teacher_id) {
        query = query.eq('teacher_id', teacher_id);
      }

      if (status) {
        query = query.eq('status', status);
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

  // GET /classes/:id - Get class details
  app.get('/classes/:id', {
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
            id, name, code, description, duration_weeks, total_sessions, price, level,
            subjects(id, name, code)
          ),
          teachers!inner(
            id, teacher_code, years_experience, degree, specialization,
            users!inner(
              id, full_name, email, phone
            )
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) {
        return ResponseHelper.notFound(reply, 'Class not found');
      }

      // Get enrolled students count
      const { count: enrolledCount } = await supabase
        .from('enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('class_id', id)
        .eq('status', 'active');

      return ResponseHelper.success(reply, { ...data, enrolled_students: enrolledCount || 0 });
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // POST /classes - Create new class
  app.post('/classes', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN, ROLES.STAFF])],
    preHandler: [validateBody(CreateClassSchema)]
  }, async (req: any, reply: any) => {
    try {
      const classData = req.body;

      // Verify course exists
      const { data: course } = await supabase
        .from('courses')
        .select('id')
        .eq('id', classData.course_id)
        .single();

      if (!course) {
        return ResponseHelper.badRequest(reply, 'Course not found');
      }

      // Verify teacher exists
      const { data: teacher } = await supabase
        .from('teachers')
        .select('id')
        .eq('id', classData.teacher_id)
        .single();

      if (!teacher) {
        return ResponseHelper.badRequest(reply, 'Teacher not found');
      }

      // Check if class code already exists
      const { data: existingClass } = await supabase
        .from('classes')
        .select('id')
        .eq('code', classData.code)
        .single();

      if (existingClass) {
        return ResponseHelper.badRequest(reply, 'Class code already exists');
      }

      const { data, error } = await supabase
        .from('classes')
        .insert([classData])
        .select()
        .single();

      if (error) throw error;

      return ResponseHelper.created(reply, data);
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // PUT /classes/:id - Update class
  app.put('/classes/:id', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN, ROLES.STAFF])],
    preHandler: [validateParams(IdParamSchema), validateBody(UpdateClassSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Verify class exists
      const { data: existingClass } = await supabase
        .from('classes')
        .select('*')
        .eq('id', id)
        .single();

      if (!existingClass) {
        return ResponseHelper.notFound(reply, 'Class not found');
      }

      // If updating code, check for duplicates
      if (updateData.code && updateData.code !== existingClass.code) {
        const { data: duplicateClass } = await supabase
          .from('classes')
          .select('id')
          .eq('code', updateData.code)
          .single();

        if (duplicateClass) {
          return ResponseHelper.badRequest(reply, 'Class code already exists');
        }
      }

      const { data, error } = await supabase
        .from('classes')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return ResponseHelper.success(reply, data);
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // DELETE /classes/:id - Delete class
  app.delete('/classes/:id', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN])],
    preHandler: [validateParams(IdParamSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { id } = req.params;

      // Check if class has enrollments
      const { count } = await supabase
        .from('enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('class_id', id);

      if (count && count > 0) {
        return ResponseHelper.badRequest(reply, 'Cannot delete class with existing enrollments');
      }

      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return ResponseHelper.success(reply, { message: 'Class deleted successfully' });
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // GET /classes/:id/students - Get class students
  app.get('/classes/:id/students', {
    preValidation: [authenticateToken],
    preHandler: [validateParams(IdParamSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { id } = req.params;

      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          students!inner(
            id, student_code, school_level,
            users!inner(
              id, full_name, email, phone
            )
          )
        `)
        .eq('class_id', id)
        .order('enrollment_date', { ascending: false });

      if (error) throw error;

      return ResponseHelper.success(reply, data);
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // GET /classes/:id/sessions - Get class sessions
  app.get('/classes/:id/sessions', {
    preValidation: [authenticateToken],
    preHandler: [validateParams(IdParamSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { id } = req.params;

      const { data, error } = await supabase
        .from('class_sessions')
        .select('*')
        .eq('class_id', id)
        .order('session_date', { ascending: true });

      if (error) throw error;

      return ResponseHelper.success(reply, data);
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });
}
