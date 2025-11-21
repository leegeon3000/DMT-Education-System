import { apiClient } from './auth';

// Types for shared pagination
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

// Students API
interface Student {
  id: number;
  user_id: number;
  student_code?: string;
  school_level?: 'elementary' | 'middle_school' | 'high_school';
  parent_name?: string;
  parent_phone?: string;
  parent_email?: string;
  created_at: string;
  users: {
    id: number;
    email: string;
    full_name: string;
    phone?: string;
    address?: string;
    birth_date?: string;
    status: boolean;
    created_at: string;
  };
}

interface CreateStudentData {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  address?: string;
  birth_date?: string;
  student_code?: string;
  school_level?: 'elementary' | 'middle_school' | 'high_school';
  parent_name?: string;
  parent_phone?: string;
  parent_email?: string;
}

interface UpdateStudentData {
  email?: string;
  full_name?: string;
  phone?: string;
  address?: string;
  birth_date?: string;
  status?: boolean;
  student_code?: string;
  school_level?: 'elementary' | 'middle_school' | 'high_school';
  parent_name?: string;
  parent_phone?: string;
  parent_email?: string;
}

interface StudentQueryParams extends PaginationParams {
  school_level?: 'elementary' | 'middle_school' | 'high_school';
  status?: boolean;
}

export const studentsApi = {
  getAll: async (params: StudentQueryParams = {}): Promise<PaginatedResponse<Student>> => {
    const response = await apiClient.get('/students', { params });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Student>> => {
    const response = await apiClient.get(`/students/${id}`);
    return response.data;
  },

  create: async (data: CreateStudentData): Promise<ApiResponse<Student>> => {
    const response = await apiClient.post('/students', data);
    return response.data;
  },

  update: async (id: number, data: UpdateStudentData): Promise<ApiResponse<Student>> => {
    const response = await apiClient.put(`/students/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete(`/students/${id}`);
    return response.data;
  },

  getEnrollments: async (id: number): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get(`/students/${id}/enrollments`);
    return response.data;
  },
};

// Teachers API
export interface Teacher {
  id: number;
  user_id: number;
  teacher_code?: string;
  main_subject_id?: number;
  years_experience: number;
  degree?: string;
  specialization?: string;
  created_at: string;
  users: {
    id: number;
    email: string;
    full_name: string;
    phone?: string;
    avatar?: string;
    role?: string;
    address?: string;
    birth_date?: string;
    status: boolean;
    created_at: string;
  };
  subjects?: {
    id: number;
    name: string;
    code: string;
    description?: string;
  };
}

interface CreateTeacherData {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  address?: string;
  birth_date?: string;
  teacher_code?: string;
  main_subject_id?: number;
  years_experience?: number;
  degree?: string;
  specialization?: string;
}

interface UpdateTeacherData {
  email?: string;
  full_name?: string;
  phone?: string;
  address?: string;
  birth_date?: string;
  status?: boolean;
  teacher_code?: string;
  main_subject_id?: number;
  years_experience?: number;
  degree?: string;
  specialization?: string;
}

interface TeacherQueryParams extends PaginationParams {
  main_subject_id?: number;
  status?: boolean;
}

export const teachersApi = {
  getAll: async (params: TeacherQueryParams = {}): Promise<PaginatedResponse<Teacher>> => {
    const response = await apiClient.get('/teachers', { params });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Teacher>> => {
    const response = await apiClient.get(`/teachers/${id}`);
    return response.data;
  },

  create: async (data: CreateTeacherData): Promise<ApiResponse<Teacher>> => {
    const response = await apiClient.post('/teachers', data);
    return response.data;
  },

  update: async (id: number, data: UpdateTeacherData): Promise<ApiResponse<Teacher>> => {
    const response = await apiClient.put(`/teachers/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete(`/teachers/${id}`);
    return response.data;
  },

  getClasses: async (id: number): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get(`/teachers/${id}/classes`);
    return response.data;
  },

  getPerformance: async (id: number): Promise<ApiResponse<any>> => {
    const response = await apiClient.get(`/teachers/${id}/performance`);
    return response.data;
  },
};