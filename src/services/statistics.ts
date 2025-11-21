import { apiClient } from './auth';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ============ STATISTICS ============
export const statisticsApi = {
  // Tỷ lệ điểm danh
  getAttendanceRate: async (studentId: number, classId?: number): Promise<ApiResponse<number>> => {
    const response = await apiClient.get('/statistics/attendance-rate', {
      params: { student_id: studentId, class_id: classId }
    });
    return response.data;
  },

  // Điểm trung bình
  getAverageGrade: async (studentId: number, classId?: number): Promise<ApiResponse<number>> => {
    const response = await apiClient.get('/statistics/average-grade', {
      params: { student_id: studentId, class_id: classId }
    });
    return response.data;
  },

  // Doanh thu
  getRevenue: async (year: number, month?: number): Promise<ApiResponse<number>> => {
    const response = await apiClient.get('/statistics/revenue', {
      params: { year, month }
    });
    return response.data;
  },

  // Kiểm tra có thể submit assignment
  canSubmitAssignment: async (assignmentId: number, studentId: number): Promise<ApiResponse<boolean>> => {
    const response = await apiClient.get('/statistics/can-submit-assignment', {
      params: { assignment_id: assignmentId, student_id: studentId }
    });
    return response.data;
  },

  // Tính điểm tổng kết
  calculateOverallGrade: async (enrollmentId: number): Promise<ApiResponse<number>> => {
    const response = await apiClient.get('/statistics/overall-grade', {
      params: { enrollment_id: enrollmentId }
    });
    return response.data;
  },
};
