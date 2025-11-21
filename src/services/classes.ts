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

// ============ CLASSES ============
export interface Class {
  id: number;
  course_id: number;
  code: string;
  name: string;
  teacher_id: number;
  capacity: number;
  current_students: number;
  start_date?: string;
  end_date?: string;
  schedule_days?: string;
  schedule_time?: string;
  classroom?: string;
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  created_at: string;
}

export interface CreateClassData {
  course_id: number;
  code: string;
  name: string;
  teacher_id: number;
  capacity?: number;
  start_date?: string;
  end_date?: string;
  schedule_days?: string;
  schedule_time?: string;
  classroom?: string;
  status?: 'planning' | 'active' | 'completed' | 'cancelled';
}

interface ClassQueryParams extends PaginationParams {
  course_id?: number;
  teacher_id?: number;
  status?: 'planning' | 'active' | 'completed' | 'cancelled';
}

export const classesApi = {
  getAll: async (params: ClassQueryParams = {}): Promise<PaginatedResponse<Class>> => {
    const response = await apiClient.get('/classes', { params });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Class>> => {
    const response = await apiClient.get(`/classes/${id}`);
    return response.data;
  },

  create: async (data: CreateClassData): Promise<ApiResponse<Class>> => {
    const response = await apiClient.post('/classes', data);
    return response.data;
  },

  update: async (id: number, data: Partial<CreateClassData>): Promise<ApiResponse<Class>> => {
    const response = await apiClient.put(`/classes/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<any>> => {
    const response = await apiClient.delete(`/classes/${id}`);
    return response.data;
  },

  getStudents: async (id: number): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get(`/classes/${id}/students`);
    return response.data;
  },

  getSessions: async (id: number): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get(`/classes/${id}/sessions`);
    return response.data;
  },

  getMaterials: async (id: number): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get(`/classes/${id}/materials`);
    return response.data;
  },
};

// ============ ENROLLMENTS ============
export interface Enrollment {
  id: number;
  class_id: number;
  student_id: number;
  enrollment_date: string;
  status: 'active' | 'completed' | 'dropped' | 'suspended';
  payment_status: 'pending' | 'paid' | 'partial' | 'overdue';
  total_fee: number;
  paid_amount: number;
  discount_percent: number;
  notes?: string;
  created_at: string;
}

export interface CreateEnrollmentData {
  class_id: number;
  student_id: number;
  enrollment_date?: string;
  status?: 'active' | 'completed' | 'dropped' | 'suspended';
  payment_status?: 'pending' | 'paid' | 'partial' | 'overdue';
  total_fee: number;
  paid_amount?: number;
  discount_percent?: number;
  notes?: string;
}

interface EnrollmentQueryParams extends PaginationParams {
  class_id?: number;
  student_id?: number;
  status?: 'active' | 'completed' | 'dropped' | 'suspended';
  payment_status?: 'pending' | 'paid' | 'partial' | 'overdue';
}

export const enrollmentsApi = {
  getAll: async (params: EnrollmentQueryParams = {}): Promise<PaginatedResponse<Enrollment>> => {
    const response = await apiClient.get('/enrollments', { params });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Enrollment>> => {
    const response = await apiClient.get(`/enrollments/${id}`);
    return response.data;
  },

  create: async (data: CreateEnrollmentData): Promise<ApiResponse<Enrollment>> => {
    const response = await apiClient.post('/enrollments', data);
    return response.data;
  },

  update: async (id: number, data: Partial<CreateEnrollmentData>): Promise<ApiResponse<Enrollment>> => {
    const response = await apiClient.put(`/enrollments/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<any>> => {
    const response = await apiClient.delete(`/enrollments/${id}`);
    return response.data;
  },

  getAttendance: async (id: number): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get(`/enrollments/${id}/attendance`);
    return response.data;
  },

  getPayments: async (id: number): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get(`/enrollments/${id}/payments`);
    return response.data;
  },
};

// ============ STAFF ============
export interface Staff {
  id: number;
  user_id: number;
  staff_code: string;
  department?: string;
  position?: string;
  created_at: string;
}

export interface CreateStaffData {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  address?: string;
  birth_date?: string;
  staff_code?: string;
  department?: string;
  position?: string;
}

interface StaffQueryParams extends PaginationParams {
  department?: string;
  status?: boolean;
}

export const staffApi = {
  getAll: async (params: StaffQueryParams = {}): Promise<PaginatedResponse<Staff>> => {
    const response = await apiClient.get('/staff', { params });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Staff>> => {
    const response = await apiClient.get(`/staff/${id}`);
    return response.data;
  },

  create: async (data: CreateStaffData): Promise<ApiResponse<Staff>> => {
    const response = await apiClient.post('/staff', data);
    return response.data;
  },

  update: async (id: number, data: Partial<CreateStaffData>): Promise<ApiResponse<Staff>> => {
    const response = await apiClient.put(`/staff/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<any>> => {
    const response = await apiClient.delete(`/staff/${id}`);
    return response.data;
  },

  getDepartments: async (): Promise<ApiResponse<string[]>> => {
    const response = await apiClient.get('/staff/departments');
    return response.data;
  },
};
