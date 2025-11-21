import http from './http';
import { Role } from '../types';

// Admin-related API stubs
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: 'active' | 'locked';
  lastLogin?: string;
  createdAt?: string;
}

export interface RolePermissionMatrix {
  role: Role;
  permissions: string[];
}

export interface Student {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'graduated' | 'suspended';
  courseIds: string[];
  paymentStatus: 'paid' | 'pending' | 'overdue' | 'partial';
  notes?: string;
  parentName?: string;
  parentPhone?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in weeks
  schedule: string;
  startDate: string;
  endDate: string;
  maxStudents: number;
  currentStudents: number;
  teacherId: string;
  price: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  materials?: string[];
  location?: string;
}

export interface Teacher {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  specialization: string[];
  bio: string;
  hireDate: string;
  status: 'active' | 'inactive' | 'on_leave';
  courseIds: string[];
  rating: number;
  qualifications?: string[];
  profileImage?: string;
}

export interface FinancialTransaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  date: string;
  paymentMethod?: string;
  relatedEntityType?: 'student' | 'course' | 'teacher' | 'facility';
  relatedEntityId?: string;
  status: 'completed' | 'pending' | 'cancelled' | 'refunded';
}

export const adminService = {
  // Users
  listUsers: (params?: { search?: string; role?: Role; status?: string }) => http.get('/admin/users', { params }),
  createUser: (payload: Partial<AdminUser>) => http.post('/admin/users', payload),
  updateUser: (id: string, payload: Partial<AdminUser>) => http.put(`/admin/users/${id}`, payload),
  lockUser: (id: string) => http.post(`/admin/users/${id}/lock`, {}),
  unlockUser: (id: string) => http.post(`/admin/users/${id}/unlock`, {}),
  resetPassword: (id: string) => http.post(`/admin/users/${id}/reset-password`, {}),

  // Roles & permissions
  getRoleMatrix: () => http.get('/admin/roles/matrix'),
  updateRolePermissions: (role: Role, permissions: string[]) => http.put(`/admin/roles/${role}`, { permissions }),

  // Analytics (dashboard)
  dashboardStats: () => http.get('/admin/analytics/dashboard'),
  trendUsers: (range: string) => http.get('/admin/analytics/users', { params: { range } }),
  trendRevenue: (range: string) => http.get('/admin/analytics/revenue', { params: { range } }),

  // Students Management
  listStudents: (params?: { search?: string; status?: string; course?: string; page?: number; limit?: number }) => 
    http.get('/admin/students', { params }),
  getStudent: (id: string) => http.get(`/admin/students/${id}`),
  createStudent: (payload: Partial<Student>) => http.post('/admin/students', payload),
  updateStudent: (id: string, payload: Partial<Student>) => http.put(`/admin/students/${id}`, payload),
  deleteStudent: (id: string) => http.delete(`/admin/students/${id}`),
  enrollStudent: (studentId: string, courseId: string) => http.post(`/admin/students/${studentId}/enroll`, { courseId }),
  unenrollStudent: (studentId: string, courseId: string) => http.post(`/admin/students/${studentId}/unenroll`, { courseId }),
  getStudentPaymentHistory: (studentId: string) => http.get(`/admin/students/${studentId}/payments`),
  getStudentAttendance: (studentId: string) => http.get(`/admin/students/${studentId}/attendance`),
  
  // Courses Management
  listCourses: (params?: { search?: string; status?: string; teacher?: string; category?: string; level?: string; page?: number; limit?: number }) => 
    http.get('/admin/courses', { params }),
  getCourse: (id: string) => http.get(`/admin/courses/${id}`),
  createCourse: (payload: Partial<Course>) => http.post('/admin/courses', payload),
  updateCourse: (id: string, payload: Partial<Course>) => http.put(`/admin/courses/${id}`, payload),
  deleteCourse: (id: string) => http.delete(`/admin/courses/${id}`),
  getCourseStudents: (courseId: string) => http.get(`/admin/courses/${courseId}/students`),
  getCourseSchedule: (courseId: string) => http.get(`/admin/courses/${courseId}/schedule`),
  getCourseAttendance: (courseId: string) => http.get(`/admin/courses/${courseId}/attendance`),
  
  // Teachers Management
  listTeachers: (params?: { search?: string; status?: string; specialization?: string; page?: number; limit?: number }) => 
    http.get('/admin/teachers', { params }),
  getTeacher: (id: string) => http.get(`/admin/teachers/${id}`),
  createTeacher: (payload: Partial<Teacher>) => http.post('/admin/teachers', payload),
  updateTeacher: (id: string, payload: Partial<Teacher>) => http.put(`/admin/teachers/${id}`, payload),
  deleteTeacher: (id: string) => http.delete(`/admin/teachers/${id}`),
  getTeacherCourses: (teacherId: string) => http.get(`/admin/teachers/${teacherId}/courses`),
  getTeacherSchedule: (teacherId: string) => http.get(`/admin/teachers/${teacherId}/schedule`),
  getTeacherPaymentHistory: (teacherId: string) => http.get(`/admin/teachers/${teacherId}/payments`),
  
  // Financial Management
  listTransactions: (params?: { type?: 'income' | 'expense'; category?: string; startDate?: string; endDate?: string; page?: number; limit?: number }) => 
    http.get('/admin/finance/transactions', { params }),
  getTransaction: (id: string) => http.get(`/admin/finance/transactions/${id}`),
  createTransaction: (payload: Partial<FinancialTransaction>) => http.post('/admin/finance/transactions', payload),
  updateTransaction: (id: string, payload: Partial<FinancialTransaction>) => http.put(`/admin/finance/transactions/${id}`, payload),
  deleteTransaction: (id: string) => http.delete(`/admin/finance/transactions/${id}`),
  getFinancialSummary: (params: { startDate: string; endDate: string }) => http.get('/admin/finance/summary', { params }),
  getMonthlyReport: (year: number, month: number) => http.get(`/admin/finance/reports/monthly/${year}/${month}`),
  getQuarterlyReport: (year: number, quarter: number) => http.get(`/admin/finance/reports/quarterly/${year}/${quarter}`),
  getAnnualReport: (year: number) => http.get(`/admin/finance/reports/annual/${year}`),
  generateInvoice: (studentId: string, items: Array<{ description: string; amount: number }>) => 
    http.post(`/admin/finance/invoices`, { studentId, items }),
  getInvoice: (id: string) => http.get(`/admin/finance/invoices/${id}`),
  
  // Payments Management
  getPayments: (params?: { status?: string; paymentMethod?: string; startDate?: string; endDate?: string; page?: number; limit?: number }) => 
    http.get('/admin/payments', { params }),
  getPayment: (id: string) => http.get(`/admin/payments/${id}`),
  createPayment: (payload: Partial<import('../types').PaymentTransaction>) => http.post('/admin/payments', payload),
  updatePayment: (id: string, payload: Partial<import('../types').PaymentTransaction>) => http.put(`/admin/payments/${id}`, payload),
  deletePayment: (id: string) => http.delete(`/admin/payments/${id}`),
  generateReceipt: (paymentId: string) => http.get(`/admin/payments/${paymentId}/receipt`),
  
  // Notifications templates
  listTemplates: () => http.get('/admin/notification-templates'),
  updateTemplate: (id: string, payload: { subject: string; body: string }) => http.put(`/admin/notification-templates/${id}`, payload),
  sendTestTemplate: (id: string, to: string) => http.post(`/admin/notification-templates/${id}/test`, { to }),

  // Settings / System
  getSettings: () => http.get('/admin/settings'),
  updateSettings: (payload: any) => http.put('/admin/settings', payload),
  toggleMaintenance: (enabled: boolean) => http.post('/admin/settings/maintenance', { enabled }),
  triggerBackup: () => http.post('/admin/system/backup', {}),
  getSecurityAlerts: () => http.get('/admin/security/alerts'),
};

// Note: For new backend routes, use the dedicated service files:
// - classes: src/services/classes.ts (classesApi, enrollmentsApi, staffApi)
// - attendance: src/services/attendance.ts (attendanceApi, sessionsApi)
// - assignments: src/services/assignments.ts (assignmentsApi, submissionsApi, gradesApi)
// - materials: src/services/materials.ts (materialsApi, paymentsApi)
// - surveys: src/services/surveys.ts (surveysApi, surveyQuestionsApi, surveyResponsesApi)

export default adminService;