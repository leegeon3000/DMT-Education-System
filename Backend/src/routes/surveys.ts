import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { supabase } from '../server';
import { ResponseHelper } from '../utils/response';
import { authenticateToken, requireRole, ROLES } from '../middleware/auth';
import { validateBody, validateParams, validateQuery, PaginationSchema, IdParamSchema } from '../middleware/validation';

const CreateSurveySchema = z.object({
  class_id: z.number().int().positive().optional(),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
  created_by: z.number().int().positive(),
});

const UpdateSurveySchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  is_active: z.boolean().optional(),
});

const CreateQuestionSchema = z.object({
  survey_id: z.number().int().positive(),
  question_text: z.string().min(1),
  question_type: z.enum(['text', 'rating', 'multiple_choice']).default('text'),
  options: z.string().optional(), // JSON string for multiple choice
  is_required: z.boolean().default(false),
  order_number: z.number().int().positive().default(1),
});

const UpdateQuestionSchema = z.object({
  question_text: z.string().min(1).optional(),
  question_type: z.enum(['text', 'rating', 'multiple_choice']).optional(),
  options: z.string().optional(),
  is_required: z.boolean().optional(),
  order_number: z.number().int().positive().optional(),
});

const CreateResponseSchema = z.object({
  survey_id: z.number().int().positive(),
  student_id: z.number().int().positive(),
  question_id: z.number().int().positive(),
  answer_text: z.string().optional(),
  answer_rating: z.number().int().min(1).max(5).optional(),
});

const SurveyQuerySchema = PaginationSchema.extend({
  class_id: z.coerce.number().int().positive().optional(),
  is_active: z.coerce.boolean().optional(),
});

export async function surveysRoutes(app: FastifyInstance) {
  // ========== SURVEYS ROUTES ==========

  // GET /surveys - List surveys with filters
  app.get('/surveys', {
    preValidation: [authenticateToken],
    preHandler: [validateQuery(SurveyQuerySchema)]
  }, async (req: any, reply: any) => {
    try {
      const { page, limit, search, class_id, is_active } = req.query;
      const offset = (page - 1) * limit;

      let query = supabase
        .from('surveys')
        .select(`
          *,
          classes(
            id, name, code
          )
        `, { count: 'exact' })
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });

      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
      }

      if (class_id) {
        query = query.eq('class_id', class_id);
      }

      if (is_active !== undefined) {
        query = query.eq('is_active', is_active);
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

  // GET /surveys/:id - Get survey details with questions
  app.get('/surveys/:id', {
    preValidation: [authenticateToken],
    preHandler: [validateParams(IdParamSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { id } = req.params;

      const { data: survey, error: surveyError } = await supabase
        .from('surveys')
        .select(`
          *,
          classes(
            id, name, code
          )
        `)
        .eq('id', id)
        .single();

      if (surveyError) throw surveyError;
      if (!survey) {
        return ResponseHelper.notFound(reply, 'Survey not found');
      }

      // Get questions
      const { data: questions, error: questionsError } = await supabase
        .from('survey_questions')
        .select('*')
        .eq('survey_id', id)
        .order('order_number');

      if (questionsError) throw questionsError;

      // Get response count
      const { count: responseCount } = await supabase
        .from('survey_responses')
        .select('*', { count: 'exact', head: true })
        .eq('survey_id', id);

      return ResponseHelper.success(reply, {
        ...survey,
        questions,
        response_count: responseCount || 0
      });
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // POST /surveys - Create new survey
  app.post('/surveys', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN, ROLES.STAFF, ROLES.TEACHER])],
    preHandler: [validateBody(CreateSurveySchema)]
  }, async (req: any, reply: any) => {
    try {
      const surveyData = req.body;

      // If class_id provided, verify it exists
      if (surveyData.class_id) {
        const { data: classInfo } = await supabase
          .from('classes')
          .select('id')
          .eq('id', surveyData.class_id)
          .single();

        if (!classInfo) {
          return ResponseHelper.badRequest(reply, 'Class not found');
        }
      }

      const { data, error } = await supabase
        .from('surveys')
        .insert([surveyData])
        .select()
        .single();

      if (error) throw error;

      return ResponseHelper.created(reply, data);
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // PUT /surveys/:id - Update survey
  app.put('/surveys/:id', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN, ROLES.STAFF, ROLES.TEACHER])],
    preHandler: [validateParams(IdParamSchema), validateBody(UpdateSurveySchema)]
  }, async (req: any, reply: any) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const { data, error } = await supabase
        .from('surveys')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) {
        return ResponseHelper.notFound(reply, 'Survey not found');
      }

      return ResponseHelper.success(reply, data);
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // DELETE /surveys/:id - Delete survey
  app.delete('/surveys/:id', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN])],
    preHandler: [validateParams(IdParamSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { id } = req.params;

      const { error } = await supabase
        .from('surveys')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return ResponseHelper.success(reply, { message: 'Survey deleted successfully' });
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // ========== SURVEY QUESTIONS ROUTES ==========

  // POST /survey-questions - Create question
  app.post('/survey-questions', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN, ROLES.STAFF, ROLES.TEACHER])],
    preHandler: [validateBody(CreateQuestionSchema)]
  }, async (req: any, reply: any) => {
    try {
      const questionData = req.body;

      const { data, error } = await supabase
        .from('survey_questions')
        .insert([questionData])
        .select()
        .single();

      if (error) throw error;

      return ResponseHelper.created(reply, data);
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // PUT /survey-questions/:id - Update question
  app.put('/survey-questions/:id', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN, ROLES.STAFF, ROLES.TEACHER])],
    preHandler: [validateParams(IdParamSchema), validateBody(UpdateQuestionSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const { data, error } = await supabase
        .from('survey_questions')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) {
        return ResponseHelper.notFound(reply, 'Question not found');
      }

      return ResponseHelper.success(reply, data);
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // DELETE /survey-questions/:id - Delete question
  app.delete('/survey-questions/:id', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN, ROLES.STAFF, ROLES.TEACHER])],
    preHandler: [validateParams(IdParamSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { id } = req.params;

      const { error } = await supabase
        .from('survey_questions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return ResponseHelper.success(reply, { message: 'Question deleted successfully' });
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // ========== SURVEY RESPONSES ROUTES ==========

  // POST /survey-responses - Submit survey responses
  app.post('/survey-responses', {
    preValidation: [authenticateToken],
    preHandler: [validateBody(z.array(CreateResponseSchema))]
  }, async (req: any, reply: any) => {
    try {
      const responsesData = req.body;

      const { data, error } = await supabase
        .from('survey_responses')
        .insert(responsesData)
        .select();

      if (error) throw error;

      return ResponseHelper.created(reply, data, 'Survey responses submitted successfully');
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // GET /surveys/:id/responses - Get survey responses
  app.get('/surveys/:id/responses', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN, ROLES.STAFF, ROLES.TEACHER])],
    preHandler: [validateParams(IdParamSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { id } = req.params;

      const { data, error } = await supabase
        .from('survey_responses')
        .select(`
          *,
          survey_questions!inner(
            id, question_text, question_type, order_number
          ),
          students!inner(
            id, student_code,
            users!inner(
              id, full_name, email
            )
          )
        `)
        .eq('survey_id', id)
        .order('submitted_at', { ascending: false });

      if (error) throw error;

      return ResponseHelper.success(reply, data);
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // GET /surveys/:id/statistics - Get survey statistics
  app.get('/surveys/:id/statistics', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN, ROLES.STAFF, ROLES.TEACHER])],
    preHandler: [validateParams(IdParamSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { id } = req.params;

      // Get all responses for the survey
      const { data: responses, error } = await supabase
        .from('survey_responses')
        .select(`
          *,
          survey_questions!inner(
            id, question_text, question_type
          )
        `)
        .eq('survey_id', id);

      if (error) throw error;

      // Calculate statistics
      const questionStats: any = {};
      responses?.forEach((response: any) => {
        const qId = response.question_id;
        if (!questionStats[qId]) {
          questionStats[qId] = {
            question_id: qId,
            question_text: response.survey_questions.question_text,
            question_type: response.survey_questions.question_type,
            response_count: 0,
            ratings: [],
            text_responses: []
          };
        }
        
        questionStats[qId].response_count++;
        
        if (response.answer_rating) {
          questionStats[qId].ratings.push(response.answer_rating);
        }
        
        if (response.answer_text) {
          questionStats[qId].text_responses.push(response.answer_text);
        }
      });

      // Calculate averages for rating questions
      Object.values(questionStats).forEach((stat: any) => {
        if (stat.ratings.length > 0) {
          stat.average_rating = (
            stat.ratings.reduce((sum: number, r: number) => sum + r, 0) / stat.ratings.length
          ).toFixed(2);
        }
      });

      return ResponseHelper.success(reply, {
        total_responses: responses?.length || 0,
        question_statistics: Object.values(questionStats)
      });
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });
}
