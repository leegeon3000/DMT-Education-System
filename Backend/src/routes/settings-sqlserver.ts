import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { getPool } from '../utils/database.js';

interface SettingUpdate {
  category: string;
  key: string;
  value: string;
}

interface BulkSettingsUpdate {
  settings: SettingUpdate[];
}

export default async function settingsRoutes(app: FastifyInstance) {
  const pool = await getPool();

  // GET /api/settings - Get all system settings
  app.get('/settings', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Simply return default settings since SYSTEM_SETTINGS table may not exist yet
      // Settings can be persisted later when user saves them
      return reply.send(getDefaultSettings());
    } catch (error: any) {
      console.error('Error fetching settings:', error);
      reply.status(500).send({
        error: 'Không thể tải cài đặt hệ thống',
        message: error.message
      });
    }
  });

  // PUT /api/settings - Update system settings (bulk update)
  app.put<{ Body: BulkSettingsUpdate }>(
    '/settings',
    async (request: FastifyRequest<{ Body: BulkSettingsUpdate }>, reply: FastifyReply) => {
      try {
        const { settings } = request.body;

        if (!settings || !Array.isArray(settings)) {
          return reply.status(400).send({
            error: 'Invalid request body',
            message: 'Settings must be an array'
          });
        }

        // Check if SYSTEM_SETTINGS table exists, create if not
        await ensureSettingsTableExists();

        // Update each setting
        for (const setting of settings) {
          const { category, key, value } = setting;

          // Convert value to string (JSON if object/array)
          const valueStr = typeof value === 'object' 
            ? JSON.stringify(value) 
            : String(value);

          const updateQuery = `
            MERGE INTO SYSTEM_SETTINGS AS target
            USING (SELECT @category AS CATEGORY, @key AS SETTING_KEY) AS source
            ON target.CATEGORY = source.CATEGORY AND target.SETTING_KEY = source.SETTING_KEY
            WHEN MATCHED THEN
              UPDATE SET SETTING_VALUE = @value, UPDATED_AT = GETDATE()
            WHEN NOT MATCHED THEN
              INSERT (CATEGORY, SETTING_KEY, SETTING_VALUE, CREATED_AT, UPDATED_AT)
              VALUES (@category, @key, @value, GETDATE(), GETDATE());
          `;

          await pool.request()
            .input('category', category)
            .input('key', key)
            .input('value', valueStr)
            .query(updateQuery);
        }

        // Fetch updated settings
        const updatedSettings = await pool.request().query(`
          SELECT CATEGORY, SETTING_KEY, SETTING_VALUE
          FROM SYSTEM_SETTINGS
        `);

        // Group settings by category
        const settingsByCategory: any = {};
        updatedSettings.recordset.forEach(row => {
          const category = row.CATEGORY.toLowerCase();
          const key = row.SETTING_KEY;
          let value = row.SETTING_VALUE;

          try {
            value = JSON.parse(value);
          } catch {
            // Keep as string
          }

          if (!settingsByCategory[category]) {
            settingsByCategory[category] = {};
          }

          settingsByCategory[category][key] = value;
        });

        reply.send({
          success: true,
          message: 'Cài đặt đã được cập nhật thành công',
          settings: settingsByCategory
        });
      } catch (error: any) {
        console.error('Error updating settings:', error);
        reply.status(500).send({
          error: 'Không thể cập nhật cài đặt',
          message: error.message
        });
      }
    }
  );

  // GET /api/settings/:category - Get settings by category
  app.get<{ Params: { category: string } }>(
    '/settings/:category',
    async (request: FastifyRequest<{ Params: { category: string } }>, reply: FastifyReply) => {
      try {
        const { category } = request.params;

        const query = `
          SELECT SETTING_KEY, SETTING_VALUE, DESCRIPTION
          FROM SYSTEM_SETTINGS
          WHERE CATEGORY = @category
          ORDER BY SETTING_KEY
        `;

        const result = await pool.request()
          .input('category', category.toUpperCase())
          .query(query);

        const settings: any = {};
        result.recordset.forEach(row => {
          let value = row.SETTING_VALUE;
          try {
            value = JSON.parse(value);
          } catch {
            // Keep as string
          }
          settings[row.SETTING_KEY] = value;
        });

        // Return defaults if category is empty
        if (Object.keys(settings).length === 0) {
          const defaults = getDefaultSettings();
          return reply.send(defaults[category as keyof typeof defaults] || {});
        }

        reply.send(settings);
      } catch (error: any) {
        console.error('Error fetching category settings:', error);
        reply.status(500).send({
          error: 'Không thể tải cài đặt',
          message: error.message
        });
      }
    }
  );

  // Helper function to ensure SYSTEM_SETTINGS table exists
  async function ensureSettingsTableExists() {
    const createTableQuery = `
      IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'SYSTEM_SETTINGS')
      BEGIN
        CREATE TABLE SYSTEM_SETTINGS (
          ID INT IDENTITY(1,1) PRIMARY KEY,
          CATEGORY VARCHAR(50) NOT NULL,
          SETTING_KEY VARCHAR(100) NOT NULL,
          SETTING_VALUE NVARCHAR(MAX),
          DESCRIPTION NVARCHAR(500),
          CREATED_AT DATETIME2 DEFAULT GETDATE(),
          UPDATED_AT DATETIME2 DEFAULT GETDATE(),
          CONSTRAINT UQ_CATEGORY_KEY UNIQUE (CATEGORY, SETTING_KEY)
        );
      END
    `;

    await pool.request().query(createTableQuery);
  }

  // Helper function to get default settings
  function getDefaultSettings() {
    return {
      general: {
        siteName: 'DMT Education System',
        siteDescription: 'Hệ thống quản lý giáo dục trực tuyến',
        adminEmail: 'admin@dmtedu.com',
        timezone: 'Asia/Ho_Chi_Minh',
        language: 'vi',
        maintenanceMode: false,
        registrationEnabled: true
      },
      security: {
        twoFactorAuth: true,
        sessionTimeout: 30,
        maxLoginAttempts: 5,
        passwordPolicy: {
          minLength: 8,
          requiresSpecialChar: true,
          requiresNumber: true,
          requiresUppercase: true,
          requiresLowercase: true
        },
        ipWhitelist: ['192.168.1.0/24', '10.0.0.0/16'],
        rateLimiting: {
          enabled: true,
          maxRequests: 100,
          timeWindow: 60
        }
      },
      email: {
        smtpHost: 'smtp.gmail.com',
        smtpPort: 587,
        smtpUser: 'noreply@dmtedu.com',
        smtpPassword: '********',
        fromEmail: 'noreply@dmtedu.com',
        fromName: 'DMT Education',
        encryption: 'tls'
      },
      payment: {
        currency: 'VND',
        taxRate: 10,
        paymentMethods: {
          vnpay: true,
          momo: true,
          banking: true,
          cash: false
        },
        autoReminder: true,
        reminderDays: 7
      },
      notification: {
        emailNotifications: true,
        smsNotifications: true,
        pushNotifications: true,
        defaultLanguage: 'vi',
        batchSize: 100,
        retryAttempts: 3
      },
      storage: {
        maxFileSize: 10,
        allowedFileTypes: ['pdf', 'doc', 'docx', 'jpg', 'png', 'mp4'],
        storageQuota: 100,
        backupFrequency: 'daily',
        backupRetention: 30
      }
    };
  }
}
