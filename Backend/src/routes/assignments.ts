import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { supabase } from '../server';
import { ResponseHelper } from '../utils/response';
import { authenticateToken, requireRole, ROLES } from '../middleware/auth';
import { validateBody, validateParams, validateQuery, PaginationSchema, IdParamSchema } from '../middleware/validation';

const CreateAssignmentSchema = z.object({
  class_id: z.number().int().positive(),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  due_date: z.string().optional(),
  max_score: z.number().positive().default(100),
  assignment_type: z.enum(['homework', 'quiz', 'exam', 'project']).default('homework'),
  created_by: z.number().int().positive(),
});

const UpdateAssignmentSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  due_date: z.string().optional(),
  max_score: z.number().positive().optional(),
  assignment_type: z.enum(['homework', 'quiz', 'exam', 'project']).optional(),
});

const CreateSubmissionSchema = z.object({
  assignment_id: z.number().int().positive(),
  student_id: z.number().int().positive(),
  content: z.string().optional(),
  file_url: z.string().max(500).optional(),
});

const CreateGradeSchema = z.object({
  submission_id: z.number().int().positive(),
  score: z.number().min(0),
  feedback: z.string().optional(),
  graded_by: z.number().int().positive(),
});

const UpdateGradeSchema = z.object({
  score: z.number().min(0).optional(),
  feedback: z.string().optional(),
});

export async function assignmentsRoutes(app: FastifyInstance) {
  // GET /assignments - List assignments
  app.get('/assignments', {
    preValidation: [authenticateToken],
    preHandler: [validateQuery(PaginationSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { page, limit, search } = req.query;
      const offset = (page - 1) * limit;

      let query = supabase
        .from('assignments')
        .select(`
          *,
          classes!inner(
            id, name, code,
            courses(id, name)
          )
        `, { count: 'exact' })
        .range(offset, offset + limit - 1)
        .order('due_date', { ascending: false });

      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
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

  // GET /assignments/:id - Get assignment details
  app.get('/assignments/:id', {
    preValidation: [authenticateToken],
    preHandler: [validateParams(IdParamSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { id } = req.params;

      const { data, error } = await supabase
        .from('assignments')
        .select(`
          *,
          classes!inner(
            id, name, code,
            courses(id, name)
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) {
        return ResponseHelper.notFound(reply, 'Assignment not found');
      }

      return ResponseHelper.success(reply, data);
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // POST /assignments - Create assignment
  app.post('/assignments', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN, ROLES.STAFF, ROLES.TEACHER])],
    preHandler: [validateBody(CreateAssignmentSchema)]
  }, async (req: any, reply: any) => {
    try {
      const assignmentData = req.body;

      const { data, error } = await supabase
        .from('assignments')
        .insert([assignmentData])
        .select()
        .single();

      if (error) throw error;

      return ResponseHelper.created(reply, data);
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // PUT /assignments/:id - Update assignment
  app.put('/assignments/:id', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN, ROLES.STAFF, ROLES.TEACHER])],
    preHandler: [validateParams(IdParamSchema), validateBody(UpdateAssignmentSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const { data, error } = await supabase
        .from('assignments')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) {
        return ResponseHelper.notFound(reply, 'Assignment not found');
      }

      return ResponseHelper.success(reply, data);
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // DELETE /assignments/:id - Delete assignment
  app.delete('/assignments/:id', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN])],
    preHandler: [validateParams(IdParamSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { id } = req.params;

      const { error } = await supabase
        .from('assignments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return ResponseHelper.success(reply, { message: 'Assignment deleted successfully' });
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // ========== SUBMISSIONS ROUTES ==========

  // GET /assignments/:id/submissions - Get submissions for an assignment
  app.get('/assignments/:id/submissions', {
    preValidation: [authenticateToken],
    preHandler: [validateParams(IdParamSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { id } = req.params;

      const { data, error } = await supabase
        .from('submissions')
        .select(`
          *,
          students!inner(
            id, student_code,
            users!inner(
              id, full_name, email
            )
          ),
          grades(*)
        `)
        .eq('assignment_id', id)
        .order('submitted_at', { ascending: false });

      if (error) throw error;

      return ResponseHelper.success(reply, data);
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // POST /submissions - Submit assignment
  app.post('/submissions', {
    preValidation: [authenticateToken],
    preHandler: [validateBody(CreateSubmissionSchema)]
  }, async (req: any, reply: any) => {
    try {
      const submissionData = req.body;

      // Check if already submitted
      const { data: existing } = await supabase
        .from('submissions')
        .select('id')
        .eq('assignment_id', submissionData.assignment_id)
        .eq('student_id', submissionData.student_id)
        .single();

      if (existing) {
        return ResponseHelper.badRequest(reply, 'Assignment already submitted');
      }

      // Check if submission is late
      const { data: assignment } = await supabase
        .from('assignments')
        .select('due_date')
        .eq('id', submissionData.assignment_id)
        .single();

      const isLate = assignment?.due_date 
        ? new Date() > new Date(assignment.due_date)
        : false;

      const { data, error } = await supabase
        .from('submissions')
        .insert([{ ...submissionData, is_late: isLate }])
        .select()
        .single();

      if (error) throw error;

      return ResponseHelper.created(reply, data);
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // PUT /submissions/:id - Update submission
  app.put('/submissions/:id', {
    preValidation: [authenticateToken],
    preHandler: [validateParams(IdParamSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { id } = req.params;
      const { content, file_url } = req.body;

      const { data, error } = await supabase
        .from('submissions')
        .update({ content, file_url })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) {
        return ResponseHelper.notFound(reply, 'Submission not found');
      }

      return ResponseHelper.success(reply, data);
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // ========== GRADES ROUTES ==========

  // POST /grades - Grade a submission
  app.post('/grades', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN, ROLES.STAFF, ROLES.TEACHER])],
    preHandler: [validateBody(CreateGradeSchema)]
  }, async (req: any, reply: any) => {
    try {
      const gradeData = req.body;

      // Check if already graded
      const { data: existing } = await supabase
        .from('grades')
        .select('id')
        .eq('submission_id', gradeData.submission_id)
        .single();

      if (existing) {
        return ResponseHelper.badRequest(reply, 'Submission already graded');
      }

      const { data, error } = await supabase
        .from('grades')
        .insert([gradeData])
        .select()
        .single();

      if (error) throw error;

      return ResponseHelper.created(reply, data);
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // PUT /grades/:id - Update grade
  app.put('/grades/:id', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN, ROLES.STAFF, ROLES.TEACHER])],
    preHandler: [validateParams(IdParamSchema), validateBody(UpdateGradeSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const { data, error } = await supabase
        .from('grades')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) {
        return ResponseHelper.notFound(reply, 'Grade not found');
      }

      return ResponseHelper.success(reply, data);
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // GET /students/:id/grades - Get student grades
  app.get('/students/:id/grades', {
    preValidation: [authenticateToken],
    preHandler: [validateParams(IdParamSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { id } = req.params;

      const { data, error } = await supabase
        .from('grades')
        .select(`
          *,
          submissions!inner(
            id, submitted_at, is_late,
            assignments!inner(
              id, title, max_score, assignment_type,
              classes(id, name)
            ),
            students!inner(id)
          )
        `)
        .eq('submissions.student_id', id)
        .order('graded_at', { ascending: false });

      if (error) throw error;

      return ResponseHelper.success(reply, data);
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });
}
