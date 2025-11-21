/**
 * Database API Service - Replaces Supabase helpers
 * Calls our SQL Server backend API instead of Supabase
 */

import { api } from './http';

// Database table names
export const TABLES = {
  USERS: 'users',
  ROLES: 'roles',
  STUDENTS: 'students',
  TEACHERS: 'teachers',
  STAFF: 'staff',
  SUBJECTS: 'subjects',
  COURSES: 'courses',
  CLASSES: 'classes',
  CLASS_SESSIONS: 'class_sessions',
  ENROLLMENTS: 'enrollments',
  ATTENDANCE: 'attendance',
  ASSIGNMENTS: 'assignments',
  SUBMISSIONS: 'submissions',
  GRADES: 'grades',
  MATERIALS: 'materials',
  NOTIFICATIONS: 'notifications',
  PAYMENTS: 'payments',
  SURVEYS: 'surveys',
  SURVEY_QUESTIONS: 'survey_questions',
  SURVEY_RESPONSES: 'survey_responses',
  ACTIVITY_LOGS: 'activity_logs',
} as const;

/**
 * Database API helpers - replaces supabaseHelpers
 * All functions now call backend API endpoints instead of Supabase
 */
export const dbHelpers = {
  // ==========================================
  // Users
  // ==========================================
  async getUserById(userId: number) {
    try {
      const response = await api.get(`/api/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  },

  async getUserByEmail(email: string) {
    try {
      const response = await api.get(`/api/users/email/${email}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user by email:', error);
      return null;
    }
  },

  // ==========================================
  // Students
  // ==========================================
  async getStudentProfile(userId: number) {
    try {
      const response = await api.get(`/api/students/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching student profile:', error);
      return null;
    }
  },

  async getStudentEnrollments(studentId: number) {
    try {
      const response = await api.get(`/api/enrollments/student/${studentId}`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching student enrollments:', error);
      return [];
    }
  },

  // ==========================================
  // Teachers
  // ==========================================
  async getTeacherProfile(userId: number) {
    try {
      const response = await api.get(`/api/teachers/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching teacher profile:', error);
      return null;
    }
  },

  // ==========================================
  // Courses
  // ==========================================
  async getAllCourses() {
    try {
      const response = await api.get('/api/courses');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching courses:', error);
      return [];
    }
  },

  async getCourseById(courseId: number) {
    try {
      const response = await api.get(`/api/courses/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course:', error);
      return null;
    }
  },

  // ==========================================
  // Classes
  // ==========================================
  async getClassesByCourse(courseId: number) {
    try {
      const response = await api.get(`/api/classes/course/${courseId}`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching classes:', error);
      return [];
    }
  },

  // ==========================================
  // Notifications
  // ==========================================
  async getNotificationsByUser(userId: number, unreadOnly = false) {
    try {
      const params = unreadOnly ? { unread: true } : {};
      const response = await api.get(`/api/notifications/user/${userId}`, { params });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  },

  async markNotificationRead(notificationId: number) {
    try {
      await api.patch(`/api/notifications/${notificationId}/read`);
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  },

  // ==========================================
  // Payments
  // ==========================================
  async getPaymentsByEnrollment(enrollmentId: number) {
    try {
      const response = await api.get(`/api/payments/enrollment/${enrollmentId}`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching payments:', error);
      return [];
    }
  },

  // ==========================================
  // Materials
  // ==========================================
  async getMaterialsByClass(classId: number) {
    try {
      const response = await api.get(`/api/materials/class/${classId}`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching materials:', error);
      return [];
    }
  },

  // ==========================================
  // Assignments
  // ==========================================
  async getAssignmentsByClass(classId: number) {
    try {
      const response = await api.get(`/api/assignments/class/${classId}`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching assignments:', error);
      return [];
    }
  },

  async getStudentSubmissions(studentId: number, assignmentId?: number) {
    try {
      const params = assignmentId ? { assignment_id: assignmentId } : {};
      const response = await api.get(`/api/submissions/student/${studentId}`, { params });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching submissions:', error);
      return [];
    }
  },

  // ==========================================
  // Attendance
  // ==========================================
  async getAttendanceByStudent(studentId: number, startDate?: string, endDate?: string) {
    try {
      const params: any = {};
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;
      
      const response = await api.get(`/api/attendance/student/${studentId}`, { params });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching attendance:', error);
      return [];
    }
  },

  // ==========================================
  // Analytics
  // ==========================================
  async getStudentStats(studentId: number) {
    try {
      const response = await api.get(`/api/students/${studentId}/stats`);
      return response.data || {
        enrollmentsCount: 0,
        pendingAssignments: 0,
      };
    } catch (error) {
      console.error('Error fetching student stats:', error);
      return {
        enrollmentsCount: 0,
        pendingAssignments: 0,
      };
    }
  },
};

// Export for backward compatibility
export const supabaseHelpers = dbHelpers;

// Export TABLES as default for easy import
export default {
  TABLES,
  dbHelpers,
  supabaseHelpers: dbHelpers, // Alias for backward compatibility
};
