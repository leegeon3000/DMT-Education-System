import { apiClient } from './auth';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ============ REPORTS ============
export interface SystemOverview {
  total_active_users: number;
  total_students: number;
  total_teachers: number;
  active_classes: number;
  revenue_this_year: number;
  revenue_this_month: number;
}

export interface StudentReport {
  basic_info: {
    student_code: string;
    full_name: string;
    email: string;
    school_level: string;
  };
  enrollments: Array<{
    class_name: string;
    enrollment_status: string;
    payment_status: string;
    attendance_rate: number;
    average_grade: number;
  }>;
  pending_assignments: Array<{
    assignment_title: string;
    due_date: string;
    submission_status: string;
  }>;
}

export interface ClassReport {
  class_info: {
    code: string;
    name: string;
    capacity: number;
    current_students: number;
    teacher_name: string;
  };
  students: Array<{
    student_code: string;
    full_name: string;
    attendance_rate: number;
    average_grade: number;
    pending_grading_count: number;
  }>;
  attendance_stats: Array<{
    session_date: string;
    present_count: number;
    absent_count: number;
    late_count: number;
  }>;
}

export const reportsApi = {
  // Tổng quan hệ thống (Admin only)
  getSystemOverview: async (): Promise<ApiResponse<SystemOverview>> => {
    const response = await apiClient.get('/reports/system-overview');
    return response.data;
  },

  // Báo cáo học sinh
  getStudentReport: async (studentId: number): Promise<ApiResponse<StudentReport>> => {
    const response = await apiClient.get(`/reports/student/${studentId}`);
    return response.data;
  },

  // Báo cáo lớp học
  getClassReport: async (classId: number): Promise<ApiResponse<ClassReport>> => {
    const response = await apiClient.get(`/reports/class/${classId}`);
    return response.data;
  },

  // Báo cáo doanh thu
  getRevenueReport: async (year: number, month?: number): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/reports/revenue', {
      params: { year, month }
    });
    return response.data;
  },
};
