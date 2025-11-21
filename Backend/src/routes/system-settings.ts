import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { query } from '../utils/database';
import { authenticateToken, requireRole, ROLES } from '../middleware/auth';

export async function systemSettingsRoutes(app: FastifyInstance) {
  // GET /system-settings - Get all system settings (Admin only)
  app.get('/system-settings', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN])]
  }, async (req: any, reply) => {
    try {
      const result = await query(`
        SELECT id, setting_key, setting_value, description, updated_at, updated_by
        FROM SYSTEM_SETTINGS
        ORDER BY setting_key
      `);

      return {
        success: true,
        data: result.rows,
      };
    } catch (error: any) {
      console.error('Get system settings error:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });

  // GET /system-settings/:key - Get setting by key
  app.get('/system-settings/:key', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN])]
  }, async (req: any, reply) => {
    const schema = z.object({
      key: z.string().min(1),
    });

    const parsed = schema.safeParse(req.params);
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.flatten() });
    }

    const { key } = parsed.data;

    try {
      const result = await query(`
        SELECT id, setting_key, setting_value, description, updated_at, updated_by
        FROM SYSTEM_SETTINGS
        WHERE setting_key = @p1
      `, [key]);

      if (result.rows.length === 0) {
        return reply.code(404).send({
          success: false,
          error: 'Setting not found',
        });
      }

      return {
        success: true,
        data: result.rows[0],
      };
    } catch (error: any) {
      console.error('Get setting by key error:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });

  // PUT /system-settings/:key - Update setting (Admin only)
  app.put('/system-settings/:key', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN])]
  }, async (req: any, reply) => {
    const paramsSchema = z.object({
      key: z.string().min(1),
    });

    const bodySchema = z.object({
      setting_value: z.string(),
    });

    const paramsParsed = paramsSchema.safeParse(req.params);
    const bodyParsed = bodySchema.safeParse(req.body);

    if (!paramsParsed.success) {
      return reply.code(400).send({ error: paramsParsed.error.flatten() });
    }

    if (!bodyParsed.success) {
      return reply.code(400).send({ error: bodyParsed.error.flatten() });
    }

    const { key } = paramsParsed.data;
    const { setting_value } = bodyParsed.data;
    const userId = req.user.id;

    try {
      // Check if setting exists
      const checkResult = await query(`
        SELECT id FROM SYSTEM_SETTINGS WHERE setting_key = @p1
      `, [key]);

      if (checkResult.rows.length === 0) {
        return reply.code(404).send({
          success: false,
          error: 'Setting not found',
        });
      }

      // Update setting
      await query(`
        UPDATE SYSTEM_SETTINGS
        SET setting_value = @p1, updated_by = @p2, updated_at = GETDATE()
        WHERE setting_key = @p3
      `, [setting_value, userId, key]);

      // Get updated setting
      const result = await query(`
        SELECT id, setting_key, setting_value, description, updated_at, updated_by
        FROM SYSTEM_SETTINGS
        WHERE setting_key = @p1
      `, [key]);

      return {
        success: true,
        data: result.rows[0],
        message: 'Setting updated successfully',
      };
    } catch (error: any) {
      console.error('Update setting error:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });
}
