import { FastifyInstance } from 'fastify';
import { getPool } from '../utils/database.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface BackupRecord {
  id: string;
  filename: string;
  size: number;
  created_at: string;
  type: 'manual' | 'auto';
  status: 'completed' | 'failed' | 'in_progress';
  description?: string;
}

export default async function backupRoutes(app: FastifyInstance) {
  const BACKUP_DIR = path.join(__dirname, '../../backups');
  const DB_NAME = 'DMT_EDUCATION_SYSTEM';

  console.log('  ✓ Backup routes');

  // Simple test endpoint
  app.get('/backup/test', async (request, reply) => {
    return reply.send({ message: 'Backup routes working!', backupDir: BACKUP_DIR });
  });

  /* TEMPORARILY DISABLED - mkdir causes hang
  // Ensure backup directory exists
  try {
    await fs.mkdir(BACKUP_DIR, { recursive: true });
  } catch (err) {
    console.error('Error creating backup directory:', err);
  }
  */

  // GET /api/backup/stats - Get backup statistics
  app.get('/backup/stats', async (request, reply) => {
    try {
      const files = await fs.readdir(BACKUP_DIR);
      const backupFiles = files.filter(f => f.endsWith('.bak'));

      let totalSize = 0;
      let lastBackup: Date | null = null;

      for (const file of backupFiles) {
        const filePath = path.join(BACKUP_DIR, file);
        const stats = await fs.stat(filePath);
        totalSize += stats.size;
        
        if (!lastBackup || stats.mtime > lastBackup) {
          lastBackup = stats.mtime;
        }
      }

      return reply.send({
        totalBackups: backupFiles.length,
        totalSize,
        lastBackup: lastBackup ? lastBackup.toISOString() : null,
        autoBackupEnabled: false, // TODO: Implement auto backup config
        retentionDays: 30
      });
    } catch (err: any) {
      console.error('Error getting backup stats:', err);
      return reply.status(500).send({
        error: 'Failed to get backup statistics',
        message: err.message
      });
    }
  });

  // GET /api/backup/list - List all backups
  app.get('/backup/list', async (request, reply) => {
    try {
      const files = await fs.readdir(BACKUP_DIR);
      const backupFiles = files.filter(f => f.endsWith('.bak'));

      const backups: BackupRecord[] = await Promise.all(
        backupFiles.map(async (file) => {
          const filePath = path.join(BACKUP_DIR, file);
          const stats = await fs.stat(filePath);

          // Parse filename to extract metadata
          // Format: DMT_EDU_YYYY-MM-DDTHH-MM-SS-mmmZ.bak
          const isAuto = file.includes('_auto_');
          const id = file.replace('.bak', '');

          return {
            id,
            filename: file,
            size: stats.size,
            created_at: stats.mtime.toISOString(),
            type: isAuto ? 'auto' : 'manual',
            status: 'completed',
            description: isAuto ? 'Automatic backup' : 'Manual backup from admin panel'
          } as BackupRecord;
        })
      );

      // Sort by creation date, newest first
      backups.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      return reply.send(backups);
    } catch (err: any) {
      console.error('Error listing backups:', err);
      return reply.status(500).send({
        error: 'Failed to list backups',
        message: err.message
      });
    }
  });

  // POST /api/backup/create - Create a new backup
  app.post('/backup/create', async (request, reply) => {
    const { description } = request.body as { description?: string };

    try {
      const pool = await getPool();
      if (!pool) {
        return reply.status(500).send({
          error: 'Database connection failed',
          message: 'Could not connect to database'
        });
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `DMT_EDU_${timestamp}.bak`;
      const backupPath = path.join(BACKUP_DIR, filename);

      // Execute SQL Server BACKUP command
      // Note: The path needs to be accessible by SQL Server process
      // For Docker, we might need to use a mounted volume
      const query = `
        BACKUP DATABASE [${DB_NAME}]
        TO DISK = N'${backupPath}'
        WITH FORMAT, INIT,
        NAME = N'${description || 'Manual Backup'}',
        SKIP, NOREWIND, NOUNLOAD, STATS = 10
      `;

      await pool.request().query(query);

      // Verify backup file was created
      const stats = await fs.stat(backupPath);

      return reply.send({
        success: true,
        backup: {
          id: filename.replace('.bak', ''),
          filename,
          size: stats.size,
          created_at: new Date().toISOString(),
          type: 'manual',
          status: 'completed',
          description
        }
      });
    } catch (err: any) {
      console.error('Error creating backup:', err);
      return reply.status(500).send({
        error: 'Failed to create backup',
        message: err.message,
        details: 'Make sure SQL Server has write permissions to the backup directory'
      });
    }
  });

  // GET /api/backup/download/:id - Download a backup file
  app.get('/backup/download/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const filename = `${id}.bak`;
    const filePath = path.join(BACKUP_DIR, filename);

    try {
      // Check if file exists
      await fs.stat(filePath);

      // Send file
      return reply
        .type('application/octet-stream')
        .header('Content-Disposition', `attachment; filename="${filename}"`)
        .send(require('fs').createReadStream(filePath));
    } catch (err: any) {
      console.error('Error downloading backup:', err);
      return reply.status(404).send({
        error: 'Backup file not found',
        message: `File ${filename} does not exist`
      });
    }
  });

  // POST /api/backup/restore/:id - Restore from a backup
  app.post('/backup/restore/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const filename = `${id}.bak`;
    const backupPath = path.join(BACKUP_DIR, filename);

    try {
      // Check if backup file exists
      await fs.stat(backupPath);

      const pool = await getPool();
      if (!pool) {
        return reply.status(500).send({
          error: 'Database connection failed',
          message: 'Could not connect to database'
        });
      }

      // First, set database to single user mode to disconnect all users
      await pool.request().query(`
        USE master;
        ALTER DATABASE [${DB_NAME}] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
      `);

      // Restore the database
      const restoreQuery = `
        RESTORE DATABASE [${DB_NAME}]
        FROM DISK = N'${backupPath}'
        WITH FILE = 1,
        NOUNLOAD, REPLACE, STATS = 10;
      `;

      await pool.request().query(restoreQuery);

      // Set database back to multi-user mode
      await pool.request().query(`
        ALTER DATABASE [${DB_NAME}] SET MULTI_USER;
      `);

      return reply.send({
        success: true,
        message: 'Database restored successfully',
        restoredFrom: filename
      });
    } catch (err: any) {
      console.error('Error restoring backup:', err);

      // Try to set database back to multi-user mode if restore failed
      try {
        const pool = await getPool();
        if (pool) {
          await pool.request().query(`
            USE master;
            ALTER DATABASE [${DB_NAME}] SET MULTI_USER;
          `);
        }
      } catch (cleanupErr) {
        console.error('Error cleaning up after failed restore:', cleanupErr);
      }

      return reply.status(500).send({
        error: 'Failed to restore backup',
        message: err.message,
        details: 'Database may be in use. Please ensure all connections are closed.'
      });
    }
  });

  // POST /api/backup/upload-restore - Upload and restore from a backup file
  // TODO: Requires @fastify/multipart plugin
  app.post('/backup/upload-restore', async (request, reply) => {
    return reply.status(501).send({
      error: 'Not Implemented',
      message: 'Upload feature requires multipart plugin setup'
    });
  });

  // DELETE /api/backup/:id - Delete a backup file
  app.delete('/backup/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const filename = `${id}.bak`;
    const filePath = path.join(BACKUP_DIR, filename);

    try {
      // Check if file exists
      await fs.stat(filePath);

      // Delete the file
      await fs.unlink(filePath);

      return reply.send({
        success: true,
        message: 'Backup deleted successfully',
        filename
      });
    } catch (err: any) {
      console.error('Error deleting backup:', err);
      return reply.status(404).send({
        error: 'Backup file not found',
        message: `File ${filename} does not exist or cannot be deleted`
      });
    }
  });
}
