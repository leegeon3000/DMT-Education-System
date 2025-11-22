import { FastifyInstance } from 'fastify';
import { authRoutes } from '../routes/auth';
import { usersRoutes } from '../routes/users';
import { rolesRoutes } from '../routes/roles';
import { studentsRoutes } from '../routes/students-sqlserver'; // SQL Server version
import { teachersRoutes } from '../routes/teachers-sqlserver'; // SQL Server version
import { subjectsRoutes } from '../routes/subjects';
import { coursesRoutes } from '../routes/courses';
import { classesRoutes } from '../routes/classes-sqlserver.js'; // SQL Server version
import { enrollmentsRoutes } from '../routes/enrollments';
import { attendanceRoutes } from '../routes/attendance';
import { assignmentsRoutes } from '../routes/assignments';
import { materialsRoutes } from '../routes/materials';
import paymentsSqlServerRoutes from '../routes/payments-sqlserver.js'; // SQL Server version
import financeSqlServerRoutes from '../routes/finance-sqlserver.js'; // SQL Server version
import attendanceReportRoutes from '../routes/attendance-report-sqlserver.js'; // SQL Server version
import analyticsRoutes from '../routes/analytics-sqlserver.js'; // SQL Server version
import { surveysRoutes } from '../routes/surveys';
import staffSqlServerRoutes from '../routes/staff-sqlserver.js'; // SQL Server version
import { newsRoutes } from '../routes/news';
import { reportsRoutes } from '../routes/reports';
import { notificationsRoutes } from '../routes/notifications';
import { statisticsRoutes } from '../routes/statistics';
import { activityLogsRoutes } from '../routes/activity-logs';
import { systemSettingsRoutes } from '../routes/system-settings';
import { backupRoutes } from '../routes/backup';
import contactRoutes from '../routes/contact.js';

export default async function registerRoutes(app: FastifyInstance) {
  console.log('📝 Registering routes...');
  
  // Core authentication routes - UPDATED WITH STORED PROCEDURES
  console.log('  ✓ Auth routes');
  await authRoutes(app);
  
  // Contact form routes - Email service
  console.log('  ✓ Contact routes');
  await app.register(contactRoutes, { prefix: '/api' });
  
  // News routes - ACTIVE FOR SQL SERVER
  await newsRoutes(app);
  
  // Academic entity routes - UPDATED WITH STORED PROCEDURES
  await enrollmentsRoutes(app);  // Uses sp_EnrollStudent, sp_DropEnrollment
  await attendanceRoutes(app);   // Uses sp_BulkMarkAttendance
  await app.register(paymentsSqlServerRoutes, { prefix: '/api' });  // Payments - SQL Server
  await app.register(financeSqlServerRoutes, { prefix: '/api' });  // Finance - SQL Server
  await app.register(attendanceReportRoutes, { prefix: '/api' });  // Attendance Reports - SQL Server
  await app.register(analyticsRoutes, { prefix: '/api' });  // Analytics - SQL Server
  await reportsRoutes(app);      // Uses sp_GetSystemOverview, sp_GetStudentReport, sp_GetClassReport
  
  // New advanced routes - ACTIVE FOR SQL SERVER
  await notificationsRoutes(app);   // Notification management
  await statisticsRoutes(app);      // Uses database functions (fn_GetAttendanceRate, fn_GetAverageGrade, etc.)
  await activityLogsRoutes(app);    // Activity logging and tracking
  await systemSettingsRoutes(app);  // System settings management (Admin)
  await backupRoutes(app);          // Database backup/restore (Admin)
  
  // User management routes - ACTIVE FOR SQL SERVER
  await usersRoutes(app);
  await rolesRoutes(app);
  
  // Entity management routes - ACTIVE FOR SQL SERVER
  await studentsRoutes(app);
  await teachersRoutes(app);    // Teachers management - ACTIVE
  await app.register(staffSqlServerRoutes, { prefix: '/api' });  // Staff management - SQL Server
  await subjectsRoutes(app);
  await coursesRoutes(app);
  await classesRoutes(app);
  
  // Learning resources routes - ACTIVE FOR SQL SERVER
  await assignmentsRoutes(app);
  await materialsRoutes(app);
  
  // Survey routes - ACTIVE FOR SQL SERVER
  console.log('  ✓ Survey routes');
  await surveysRoutes(app);
  
  console.log('✅ All routes registered successfully');
}
