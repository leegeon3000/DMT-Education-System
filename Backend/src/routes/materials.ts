import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { supabase } from '../server';
import { ResponseHelper } from '../utils/response';
import { authenticateToken, requireRole, ROLES } from '../middleware/auth';
import { validateBody, validateParams, validateQuery, PaginationSchema, IdParamSchema } from '../middleware/validation';

const CreateMaterialSchema = z.object({
  class_id: z.number().int().positive(),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  file_url: z.string().max(500).optional(),
  file_type: z.string().max(50).optional(), // pdf, doc, video, image, link
  file_size: z.number().int().nonnegative().optional(),
  is_downloadable: z.boolean().default(true),
  uploaded_by: z.number().int().positive(),
});

const UpdateMaterialSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  file_url: z.string().max(500).optional(),
  file_type: z.string().max(50).optional(),
  file_size: z.number().int().nonnegative().optional(),
  is_downloadable: z.boolean().optional(),
});

const MaterialQuerySchema = PaginationSchema.extend({
  class_id: z.coerce.number().int().positive().optional(),
  file_type: z.string().optional(),
});

export async function materialsRoutes(app: FastifyInstance) {
  // GET /materials - List materials with filters
  app.get('/materials', {
    preValidation: [authenticateToken],
    preHandler: [validateQuery(MaterialQuerySchema)]
  }, async (req: any, reply: any) => {
    try {
      const { page, limit, search, class_id, file_type } = req.query;
      const offset = (page - 1) * limit;

      let query = supabase
        .from('materials')
        .select(`
          *,
          classes!inner(
            id, name, code,
            courses(id, name)
          ),
          users!uploaded_by(
            id, full_name, email
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

      if (file_type) {
        query = query.eq('file_type', file_type);
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

  // GET /materials/:id - Get material details
  app.get('/materials/:id', {
    preValidation: [authenticateToken],
    preHandler: [validateParams(IdParamSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { id } = req.params;

      const { data, error } = await supabase
        .from('materials')
        .select(`
          *,
          classes!inner(
            id, name, code,
            courses(id, name)
          ),
          users!uploaded_by(
            id, full_name, email
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) {
        return ResponseHelper.notFound(reply, 'Material not found');
      }

      return ResponseHelper.success(reply, data);
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // POST /materials - Create new material
  app.post('/materials', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN, ROLES.STAFF, ROLES.TEACHER])],
    preHandler: [validateBody(CreateMaterialSchema)]
  }, async (req: any, reply: any) => {
    try {
      const materialData = req.body;

      // Verify class exists
      const { data: classInfo } = await supabase
        .from('classes')
        .select('id')
        .eq('id', materialData.class_id)
        .single();

      if (!classInfo) {
        return ResponseHelper.badRequest(reply, 'Class not found');
      }

      const { data, error } = await supabase
        .from('materials')
        .insert([materialData])
        .select()
        .single();

      if (error) throw error;

      return ResponseHelper.created(reply, data);
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // PUT /materials/:id - Update material
  app.put('/materials/:id', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN, ROLES.STAFF, ROLES.TEACHER])],
    preHandler: [validateParams(IdParamSchema), validateBody(UpdateMaterialSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const { data, error } = await supabase
        .from('materials')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) {
        return ResponseHelper.notFound(reply, 'Material not found');
      }

      return ResponseHelper.success(reply, data);
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // DELETE /materials/:id - Delete material
  app.delete('/materials/:id', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN, ROLES.STAFF, ROLES.TEACHER])],
    preHandler: [validateParams(IdParamSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { id } = req.params;

      const { error } = await supabase
        .from('materials')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return ResponseHelper.success(reply, { message: 'Material deleted successfully' });
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });

  // GET /classes/:id/materials - Get materials for a class
  app.get('/classes/:id/materials', {
    preValidation: [authenticateToken],
    preHandler: [validateParams(IdParamSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { id } = req.params;

      const { data, error } = await supabase
        .from('materials')
        .select(`
          *,
          users!uploaded_by(
            id, full_name
          )
        `)
        .eq('class_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return ResponseHelper.success(reply, data);
    } catch (error: any) {
      return ResponseHelper.serverError(reply, error.message);
    }
  });
}
