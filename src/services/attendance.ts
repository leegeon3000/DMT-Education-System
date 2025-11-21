import { apiClient } from './auth';

// Types
interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ============ ATTENDANCE ============
export interface Attendance {
  id: number;
  session_id: number;
  enrollment_id: number;
  status: 'present' | 'absent' | 'late' | 'excused';
  check_in_time?: string;
  notes?: string;
  marked_by: number;
  created_at: string;
}

export interface CreateAttendanceData {
  session_id: number;
  enrollment_id: number;
  status: 'present' | 'absent' | 'late' | 'excused';
  check_in_time?: string;
  notes?: string;
  marked_by: number;
}

export interface BulkAttendanceData {
  session_id: number;
  attendance_records: Array<{
    enrollment_id: number;
    status: 'present' | 'absent' | 'late' | 'excused';
    check_in_time?: string;
    notes?: string;
  }>;
  marked_by: number;
}

export const attendanceApi = {
  getAll: async (params: PaginationParams = {}): Promise<PaginatedResponse<Attendance>> => {
    const response = await apiClient.get('/attendance', { params });
    return response.data;
  },

  create: async (data: CreateAttendanceData): Promise<ApiResponse<Attendance>> => {
    const response = await apiClient.post('/attendance', data);
    return response.data;
  },

  update: async (id: number, data: Partial<CreateAttendanceData>): Promise<ApiResponse<Attendance>> => {
    const response = await apiClient.put(`/attendance/${id}`, data);
    return response.data;
  },

  bulkMark: async (data: BulkAttendanceData): Promise<ApiResponse<Attendance[]>> => {
    const response = await apiClient.post('/attendance/bulk', data);
    return response.data;
  },

  getBySession: async (sessionId: number): Promise<ApiResponse<Attendance[]>> => {
    const response = await apiClient.get(`/sessions/${sessionId}/attendance`);
    return response.data;
  },
};

// ============ CLASS SESSIONS ============
export interface ClassSession {
  id: number;
  class_id: number;
  session_number: number;
  title?: string;
  session_date: string;
  start_time: string;
  end_time: string;
  content?: string;
  homework?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  created_at: string;
}

export interface CreateSessionData {
  class_id: number;
  session_number: number;
  title?: string;
  session_date: string;
  start_time: string;
  end_time: string;
  content?: string;
  homework?: string;
  status?: 'scheduled' | 'completed' | 'cancelled';
}

export const sessionsApi = {
  getAll: async (params: PaginationParams = {}): Promise<PaginatedResponse<ClassSession>> => {
    const response = await apiClient.get('/sessions', { params });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<ClassSession>> => {
    const response = await apiClient.get(`/sessions/${id}`);
    return response.data;
  },

  create: async (data: CreateSessionData): Promise<ApiResponse<ClassSession>> => {
    const response = await apiClient.post('/sessions', data);
    return response.data;
  },

  update: async (id: number, data: Partial<CreateSessionData>): Promise<ApiResponse<ClassSession>> => {
    const response = await apiClient.put(`/sessions/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<any>> => {
    const response = await apiClient.delete(`/sessions/${id}`);
    return response.data;
  },

  getAttendance: async (id: number): Promise<ApiResponse<Attendance[]>> => {
    const response = await apiClient.get(`/sessions/${id}/attendance`);
    return response.data;
  },
};
