import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { supabase } from '../server';
import { ResponseHelper } from '../utils/response';
import { authenticateToken, requireRole, ROLES } from '../middleware/auth';
import { validateBody, validateParams, validateQuery, PaginationSchema, IdParamSchema } from '../middleware/validation';

const CreateNewsSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  excerpt: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  image_url: z.string().url().optional(),
  published_at: z.string().optional(), // ISO date string
  is_featured: z.boolean().default(false),
  type: z.enum(['news', 'announcement', 'event']).default('news'),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
});

const UpdateNewsSchema = z.object({
  title: z.string().min(1).optional(),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  image_url: z.string().url().optional(),
  published_at: z.string().optional(),
  is_featured: z.boolean().optional(),
  type: z.enum(['news', 'announcement', 'event']).optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
});

const NewsQuerySchema = PaginationSchema.extend({
  type: z.enum(['news', 'announcement', 'event']).optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  is_featured: z.coerce.boolean().optional(),
});

export async function newsRoutes(app: FastifyInstance) {
  // GET /news - List news with filters
  app.get('/news', {
    preHandler: [validateQuery(NewsQuerySchema)]
  }, async (req: any, reply: any) => {
    try {
      const { page, limit, search, type, status, is_featured, author } = req.query;
      const offset = (page - 1) * limit;

      let query = supabase
        .from('news')
        .select('*', { count: 'exact' })
        .range(offset, offset + limit - 1)
        .order('published_at', { ascending: false });

      // Apply filters
      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,author.ilike.%${search}%`);
      }

      if (type) {
        query = query.eq('type', type);
      }

      if (status) {
        query = query.eq('status', status);
      } else {
        // Default: only show published news to non-authenticated users
        if (!req.user || ![ROLES.ADMIN, ROLES.STAFF].includes(req.user.role)) {
          query = query.eq('status', 'published');
        }
      }

      if (is_featured !== undefined) {
        query = query.eq('is_featured', is_featured);
      }

      if (author) {
        query = query.ilike('author', `%${author}%`);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      return ResponseHelper.successWithPagination(
        reply,
        data || [],
        { page, limit, total: count || 0 },
        'News retrieved successfully'
      );
    } catch (error: any) {
      app.log.error(error);
      return ResponseHelper.error(
        reply,
        error.message || 'Failed to retrieve news',
        error.code || 500
      );
    }
  });

  // GET /news/:id - Get single news by ID
  app.get('/news/:id', {
    preHandler: [validateParams(IdParamSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { id } = req.params;

      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (!data) {
        return ResponseHelper.notFound(reply, 'News');
      }

      // Check if user can view draft/archived news
      if (data.status !== 'published') {
        if (!req.user || ![ROLES.ADMIN, ROLES.STAFF].includes(req.user.role)) {
          return ResponseHelper.notFound(reply, 'News');
        }
      }

      return ResponseHelper.success(reply, data, 'News retrieved successfully');
    } catch (error: any) {
      app.log.error(error);
      return ResponseHelper.error(
        reply,
        error.message || 'Failed to retrieve news',
        error.code || 500
      );
    }
  });

  // POST /news - Create new news
  app.post('/news', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN, ROLES.STAFF])],
    preHandler: [validateBody(CreateNewsSchema)]
  }, async (req: any, reply: any) => {
    try {
      const newsData = {
        ...req.body,
        author_id: req.user.id, // Set author from authenticated user
      };

      // Set published_at to now if publishing and not provided
      if (newsData.status === 'published' && !newsData.published_at) {
        newsData.published_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('news')
        .insert([newsData])
        .select()
        .single();

      if (error) throw error;

      app.log.info(`News created: ${data.id} by user ${req.user.id}`);
      return ResponseHelper.created(reply, data, 'News created successfully');
    } catch (error: any) {
      app.log.error(error);
      return ResponseHelper.error(
        reply,
        error.message || 'Failed to create news',
        error.code || 500
      );
    }
  });

  // PUT /news/:id - Update news
  app.put('/news/:id', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN, ROLES.STAFF])],
    preHandler: [validateParams(IdParamSchema), validateBody(UpdateNewsSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Check if news exists
      const { data: existing, error: fetchError } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError || !existing) {
        return ResponseHelper.notFound(reply, 'News');
      }

      // Set published_at if changing status to published and not provided
      if (updates.status === 'published' && !existing.published_at && !updates.published_at) {
        updates.published_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('news')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      app.log.info(`News updated: ${id} by user ${req.user.id}`);
      return ResponseHelper.success(reply, data, 'News updated successfully');
    } catch (error: any) {
      app.log.error(error);
      return ResponseHelper.error(
        reply,
        error.message || 'Failed to update news',
        error.code || 500
      );
    }
  });

  // DELETE /news/:id - Delete news
  app.delete('/news/:id', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN])],
    preHandler: [validateParams(IdParamSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { id } = req.params;

      // Check if news exists
      const { data: existing, error: fetchError } = await supabase
        .from('news')
        .select('id')
        .eq('id', id)
        .single();

      if (fetchError || !existing) {
        return ResponseHelper.notFound(reply, 'News');
      }

      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

      if (error) throw error;

      app.log.info(`News deleted: ${id} by user ${req.user.id}`);
      return ResponseHelper.success(reply, null, 'News deleted successfully');
    } catch (error: any) {
      app.log.error(error);
      return ResponseHelper.error(
        reply,
        error.message || 'Failed to delete news',
        error.code || 500
      );
    }
  });

  // PATCH /news/:id/publish - Quick publish/unpublish
  app.patch('/news/:id/publish', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN, ROLES.STAFF])],
    preHandler: [validateParams(IdParamSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { id } = req.params;
      const { publish } = req.body as { publish: boolean };

      const updates: any = {
        status: publish ? 'published' : 'draft'
      };

      // Set published_at when publishing
      if (publish) {
        updates.published_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('news')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      if (!data) {
        return ResponseHelper.notFound(reply, 'News');
      }

      app.log.info(`News ${publish ? 'published' : 'unpublished'}: ${id} by user ${req.user.id}`);
      return ResponseHelper.success(reply, data, `News ${publish ? 'published' : 'unpublished'} successfully`);
    } catch (error: any) {
      app.log.error(error);
      return ResponseHelper.error(
        reply,
        error.message || 'Failed to update news status',
        error.code || 500
      );
    }
  });

  // PATCH /news/:id/feature - Toggle featured status
  app.patch('/news/:id/feature', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN, ROLES.STAFF])],
    preHandler: [validateParams(IdParamSchema)]
  }, async (req: any, reply: any) => {
    try {
      const { id } = req.params;
      const { featured } = req.body as { featured: boolean };

      const { data, error } = await supabase
        .from('news')
        .update({ is_featured: featured })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      if (!data) {
        return ResponseHelper.notFound(reply, 'News');
      }

      app.log.info(`News featured status updated: ${id} by user ${req.user.id}`);
      return ResponseHelper.success(reply, data, 'Featured status updated successfully');
    } catch (error: any) {
      app.log.error(error);
      return ResponseHelper.error(
        reply,
        error.message || 'Failed to update featured status',
        error.code || 500
      );
    }
  });
}
