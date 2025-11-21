// Export all API services
export * from './auth';
export * from './courses';
export * from './student';
export * from './admin';
export { studentsApi, teachersApi } from './academic';
export type { Teacher } from './academic';
export * from './ticketService';
export * from './news';

// Export core services
export * from './classes';
export * from './attendance';
export * from './assignments';
export * from './materials';
export * from './surveys';
export * from './notifications';
export * from './payments'; // Tách riêng từ materials

// Export advanced services
export * from './reports';
export * from './statistics';

// Export admin services
export * from './activityLogs';
export * from './systemSettings';
export * from './backup';
