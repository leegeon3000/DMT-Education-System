import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { sql, query } from '../utils/database';
import { authenticateToken, requireRole, ROLES } from '../middleware/auth';

export async function notificationsRoutes(app: FastifyInstance) {
  // GET /notifications - Get all notifications for current user
  app.get('/notifications', {
    preValidation: [authenticateToken]
  }, async (req: any, reply) => {
    const schema = z.object({
      type: z.string().optional(),
      is_read: z.string().optional().transform(v => v === 'true' ? 1 : v === 'false' ? 0 : undefined),
      page: z.string().optional().transform(v => v ? Number(v) : 1),
      limit: z.string().optional().transform(v => v ? Number(v) : 20),
    });

    const parsed = schema.safeParse(req.query);
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.flatten() });
    }

    const { type, is_read, page, limit } = parsed.data;
    const userId = req.user.id;
    const offset = (page - 1) * limit;

    try {
      // Build WHERE clause
      let whereConditions = ['user_id = @p1'];
      const params: any[] = [userId];
      let paramIndex = 2;

      if (type) {
        whereConditions.push(`type = @p${paramIndex}`);
        params.push(type);
        paramIndex++;
      }

      if (is_read !== undefined) {
        whereConditions.push(`is_read = @p${paramIndex}`);
        params.push(is_read);
        paramIndex++;
      }

      const whereClause = whereConditions.join(' AND ');

      // Get total count
      const countResult = await query(`
        SELECT COUNT(*) as total
        FROM NOTIFICATIONS
        WHERE ${whereClause}
      `, params);

      // Get paginated data
      const result = await query(`
        SELECT id, user_id, title, message, type, is_read, link_url, created_at
        FROM NOTIFICATIONS
        WHERE ${whereClause}
        ORDER BY created_at DESC
        OFFSET @p${paramIndex} ROWS FETCH NEXT @p${paramIndex + 1} ROWS ONLY
      `, [...params, offset, limit]);

      const total = countResult.rows[0]?.total || 0;

      return {
        success: true,
        data: result.rows,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error: any) {
      console.error('Get notifications error:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });

  // GET /notifications/unread-count - Get unread notifications count
  app.get('/notifications/unread-count', {
    preValidation: [authenticateToken]
  }, async (req: any, reply) => {
    const userId = req.user.id;

    try {
      const result = await query(`
        SELECT COUNT(*) as count
        FROM NOTIFICATIONS
        WHERE user_id = @p1 AND is_read = 0
      `, [userId]);

      return {
        success: true,
        data: { count: result.rows[0]?.count || 0 },
      };
    } catch (error: any) {
      console.error('Get unread count error:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });

  // GET /notifications/:id - Get notification by ID
  app.get('/notifications/:id', {
    preValidation: [authenticateToken]
  }, async (req: any, reply) => {
    const schema = z.object({
      id: z.string().transform(Number),
    });

    const parsed = schema.safeParse(req.params);
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.flatten() });
    }

    const { id } = parsed.data;
    const userId = req.user.id;

    try {
      const result = await query(`
        SELECT id, user_id, title, message, type, is_read, link_url, created_at
        FROM NOTIFICATIONS
        WHERE id = @p1 AND user_id = @p2
      `, [id, userId]);

      if (result.rows.length === 0) {
        return reply.code(404).send({
          success: false,
          error: 'Notification not found',
        });
      }

      return {
        success: true,
        data: result.rows[0],
      };
    } catch (error: any) {
      console.error('Get notification error:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });

  // PUT /notifications/:id/read - Mark notification as read
  app.put('/notifications/:id/read', {
    preValidation: [authenticateToken]
  }, async (req: any, reply) => {
    const schema = z.object({
      id: z.string().transform(Number),
    });

    const parsed = schema.safeParse(req.params);
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.flatten() });
    }

    const { id } = parsed.data;
    const userId = req.user.id;

    try {
      const result = await query(`
        UPDATE NOTIFICATIONS
        SET is_read = 1
        WHERE id = @p1 AND user_id = @p2
      `, [id, userId]);

      if (result.rowsAffected[0] === 0) {
        return reply.code(404).send({
          success: false,
          error: 'Notification not found',
        });
      }

      return {
        success: true,
        message: 'Notification marked as read',
      };
    } catch (error: any) {
      console.error('Mark notification as read error:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });

  // PUT /notifications/mark-all-read - Mark all notifications as read
  app.put('/notifications/mark-all-read', {
    preValidation: [authenticateToken]
  }, async (req: any, reply) => {
    const userId = req.user.id;

    try {
      await query(`
        UPDATE NOTIFICATIONS
        SET is_read = 1
        WHERE user_id = @p1 AND is_read = 0
      `, [userId]);

      return {
        success: true,
        message: 'All notifications marked as read',
      };
    } catch (error: any) {
      console.error('Mark all as read error:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });

  // POST /notifications - Create new notification (Admin/Staff only)
  app.post('/notifications', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN, ROLES.STAFF])]
  }, async (req: any, reply) => {
    const schema = z.object({
      user_id: z.number(),
      title: z.string().min(1).max(200),
      message: z.string().min(1),
      type: z.enum(['info', 'warning', 'success', 'error']),
      link_url: z.string().url().optional().nullable(),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.flatten() });
    }

    const { user_id, title, message, type, link_url } = parsed.data;

    try {
      const result = await query(`
        INSERT INTO NOTIFICATIONS (user_id, title, message, type, link_url, is_read)
        OUTPUT INSERTED.id
        VALUES (@p1, @p2, @p3, @p4, @p5, 0)
      `, [user_id, title, message, type, link_url || null]);

      return {
        success: true,
        data: { id: result.rows[0].id },
        message: 'Notification created successfully',
      };
    } catch (error: any) {
      console.error('Create notification error:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });

  // DELETE /notifications/:id - Delete notification
  app.delete('/notifications/:id', {
    preValidation: [authenticateToken]
  }, async (req: any, reply) => {
    const schema = z.object({
      id: z.string().transform(Number),
    });

    const parsed = schema.safeParse(req.params);
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.flatten() });
    }

    const { id } = parsed.data;
    const userId = req.user.id;

    try {
      const result = await query(`
        DELETE FROM NOTIFICATIONS
        WHERE id = @p1 AND user_id = @p2
      `, [id, userId]);

      if (result.rowsAffected[0] === 0) {
        return reply.code(404).send({
          success: false,
          error: 'Notification not found',
        });
      }

      return {
        success: true,
        message: 'Notification deleted successfully',
      };
    } catch (error: any) {
      console.error('Delete notification error:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });
}
