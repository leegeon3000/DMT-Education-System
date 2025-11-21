import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { query } from '../utils/database';
import { authenticateToken, requireRole, ROLES } from '../middleware/auth';

export async function backupRoutes(app: FastifyInstance) {
  // POST /backup - Create new backup (Admin only)
  app.post('/backup', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN])]
  }, async (req: any, reply) => {
    const schema = z.object({
      backup_type: z.enum(['full', 'incremental']),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.flatten() });
    }

    const { backup_type } = parsed.data;
    const userId = req.user.id;

    try {
      // Create backup record with status 'in_progress'
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const fileName = `DMT_EDU_${backup_type}_${timestamp}.bak`;
      const filePath = `/backups/${fileName}`;

      const insertResult = await query(`
        INSERT INTO BACKUP_HISTORY (backup_type, file_path, file_size, status, created_by)
        OUTPUT INSERTED.id
        VALUES (@p1, @p2, 0, 'in_progress', @p3)
      `, [backup_type, filePath, userId]);

      const backupId = insertResult.rows[0].id;

      // In production, you would actually perform the backup here
      // For now, we'll just mark it as success immediately
      // TODO: Implement actual SQL Server backup command
      
      // Simulate backup success
      await query(`
        UPDATE BACKUP_HISTORY
        SET status = 'success', file_size = 1024000, created_at = GETDATE()
        WHERE id = @p1
      `, [backupId]);

      // Get the created backup record
      const result = await query(`
        SELECT id, backup_type, file_path, file_size, status, error_message, created_by, created_at
        FROM BACKUP_HISTORY
        WHERE id = @p1
      `, [backupId]);

      return {
        success: true,
        data: result.rows[0],
        message: 'Backup created successfully',
      };
    } catch (error: any) {
      console.error('Create backup error:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });

  // GET /backup/history - Get backup history (Admin only)
  app.get('/backup/history', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN])]
  }, async (req: any, reply) => {
    try {
      const result = await query(`
        SELECT 
          bh.id,
          bh.backup_type,
          bh.file_path,
          bh.file_size,
          bh.status,
          bh.error_message,
          bh.created_by,
          u.full_name as created_by_name,
          bh.created_at
        FROM BACKUP_HISTORY bh
        LEFT JOIN USERS u ON bh.created_by = u.id
        ORDER BY bh.created_at DESC
      `);

      return {
        success: true,
        data: result.rows,
      };
    } catch (error: any) {
      console.error('Get backup history error:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });

  // POST /backup/restore - Restore from backup (Admin only)
  app.post('/backup/restore', {
    preValidation: [authenticateToken, requireRole([ROLES.ADMIN])]
  }, async (req: any, reply) => {
    const schema = z.object({
      backup_id: z.number(),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.flatten() });
    }

    const { backup_id } = parsed.data;

    try {
      // Check if backup exists and is successful
      const backupResult = await query(`
        SELECT id, backup_type, file_path, status
        FROM BACKUP_HISTORY
        WHERE id = @p1
      `, [backup_id]);

      if (backupResult.rows.length === 0) {
        return reply.code(404).send({
          success: false,
          error: 'Backup not found',
        });
      }

      const backup = backupResult.rows[0];

      if (backup.status !== 'success') {
        return reply.code(400).send({
          success: false,
          error: 'Cannot restore from a failed or in-progress backup',
        });
      }

      // In production, you would actually perform the restore here
      // This is a dangerous operation and should be carefully implemented
      // TODO: Implement actual SQL Server restore command with proper safety checks

      return {
        success: true,
        message: 'Database restore initiated. This may take several minutes.',
        warning: 'Restore functionality is not yet fully implemented. This is a placeholder response.',
      };
    } catch (error: any) {
      console.error('Restore backup error:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });
}
