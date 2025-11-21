import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { query } from '../utils/database';
import { authenticateToken, requireRole, ROLES } from '../middleware/auth';

export async function activityLogsRoutes(app: FastifyInstance) {
  // GET /activity-logs - Get all activity logs (Admin only)
  app.get('/activity-logs', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN])]
  }, async (req: any, reply) => {
    const schema = z.object({
      user_id: z.string().optional().transform(v => v ? Number(v) : undefined),
      action: z.string().optional(),
      table_name: z.string().optional(),
      from_date: z.string().optional(),
      to_date: z.string().optional(),
      page: z.string().optional().transform(v => v ? Number(v) : 1),
      limit: z.string().optional().transform(v => v ? Number(v) : 50),
    });

    const parsed = schema.safeParse(req.query);
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.flatten() });
    }

    const { user_id, action, table_name, from_date, to_date, page, limit } = parsed.data;
    const offset = (page - 1) * limit;

    try {
      // Build WHERE clause
      let whereConditions: string[] = [];
      const params: any[] = [];
      let paramIndex = 1;

      if (user_id) {
        whereConditions.push(`user_id = @p${paramIndex}`);
        params.push(user_id);
        paramIndex++;
      }

      if (action) {
        whereConditions.push(`action = @p${paramIndex}`);
        params.push(action);
        paramIndex++;
      }

      if (table_name) {
        whereConditions.push(`table_name = @p${paramIndex}`);
        params.push(table_name);
        paramIndex++;
      }

      if (from_date) {
        whereConditions.push(`created_at >= @p${paramIndex}`);
        params.push(from_date);
        paramIndex++;
      }

      if (to_date) {
        whereConditions.push(`created_at <= @p${paramIndex}`);
        params.push(to_date);
        paramIndex++;
      }

      const whereClause = whereConditions.length > 0 
        ? `WHERE ${whereConditions.join(' AND ')}` 
        : '';

      // Get total count
      const countResult = await query(`
        SELECT COUNT(*) as total
        FROM ACTIVITY_LOGS
        ${whereClause}
      `, params);

      // Get paginated data
      const result = await query(`
        SELECT 
          al.id,
          al.user_id,
          u.full_name as user_name,
          al.action,
          al.table_name,
          al.record_id,
          al.old_value,
          al.new_value,
          al.ip_address,
          al.user_agent,
          al.created_at
        FROM ACTIVITY_LOGS al
        LEFT JOIN USERS u ON al.user_id = u.id
        ${whereClause}
        ORDER BY al.created_at DESC
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
      console.error('Get activity logs error:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });

  // GET /activity-logs/user/:userId - Get activity logs for specific user
  app.get('/activity-logs/user/:userId', {
    preValidation: [authenticateToken]
  }, async (req: any, reply) => {
    const schema = z.object({
      userId: z.string().transform(Number),
    });

    const querySchema = z.object({
      page: z.string().optional().transform(v => v ? Number(v) : 1),
      limit: z.string().optional().transform(v => v ? Number(v) : 50),
    });

    const paramsParsed = schema.safeParse(req.params);
    const queryParsed = querySchema.safeParse(req.query);

    if (!paramsParsed.success) {
      return reply.code(400).send({ error: paramsParsed.error.flatten() });
    }
    
    if (!queryParsed.success) {
      return reply.code(400).send({ error: queryParsed.error.flatten() });
    }

    const { userId } = paramsParsed.data;
    const { page, limit } = queryParsed.data;
    const offset = (page - 1) * limit;

    // Check if user can view this user's logs
    const requestUserId = req.user.id;
    const userRole = req.user.role;

    if (userRole !== ROLES.ADMIN && requestUserId !== userId) {
      return reply.code(403).send({
        success: false,
        error: 'You can only view your own activity logs',
      });
    }

    try {
      // Get total count
      const countResult = await query(`
        SELECT COUNT(*) as total
        FROM ACTIVITY_LOGS
        WHERE user_id = @p1
      `, [userId]);

      // Get paginated data
      const result = await query(`
        SELECT 
          id,
          user_id,
          action,
          table_name,
          record_id,
          old_value,
          new_value,
          ip_address,
          user_agent,
          created_at
        FROM ACTIVITY_LOGS
        WHERE user_id = @p1
        ORDER BY created_at DESC
        OFFSET @p2 ROWS FETCH NEXT @p3 ROWS ONLY
      `, [userId, offset, limit]);

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
      console.error('Get user activity logs error:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });
}
