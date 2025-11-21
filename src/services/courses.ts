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

// Subjects API
interface Subject {
  id: number;
  name: string;
  code: string;
  description?: string;
  is_active: boolean;
  created_at: string;
}

interface CreateSubjectData {
  name: string;
  code: string;
  description?: string;
  is_active?: boolean;
}

interface SubjectQueryParams extends PaginationParams {
  is_active?: boolean;
}

export const subjectsApi = {
  getAll: async (params: SubjectQueryParams = {}): Promise<PaginatedResponse<Subject>> => {
    const response = await apiClient.get('/subjects', { params });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Subject>> => {
    const response = await apiClient.get(`/subjects/${id}`);
    return response.data;
  },

  create: async (data: CreateSubjectData): Promise<ApiResponse<Subject>> => {
    const response = await apiClient.post('/subjects', data);
    return response.data;
  },

  update: async (id: number, data: Partial<CreateSubjectData>): Promise<ApiResponse<Subject>> => {
    const response = await apiClient.put(`/subjects/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete(`/subjects/${id}`);
    return response.data;
  },
};

// Courses API
interface Course {
  id: number;
  subject_id: number;
  code: string;
  name: string;
  description?: string;
  duration_weeks: number;
  total_sessions: number;
  price?: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  is_active: boolean;
  created_at: string;
  subjects: {
    id: number;
    name: string;
    code: string;
    description?: string;
  };
}

interface CreateCourseData {
  subject_id: number;
  code: string;
  name: string;
  description?: string;
  duration_weeks?: number;
  total_sessions?: number;
  price?: number;
  level?: 'beginner' | 'intermediate' | 'advanced';
  is_active?: boolean;
}

interface CourseQueryParams extends PaginationParams {
  subject_id?: number;
  level?: 'beginner' | 'intermediate' | 'advanced';
  is_active?: boolean;
}

export const coursesApi = {
  getAll: async (params: CourseQueryParams = {}): Promise<PaginatedResponse<Course>> => {
    const response = await apiClient.get('/courses', { params });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Course>> => {
    const response = await apiClient.get(`/courses/${id}`);
    return response.data;
  },

  create: async (data: CreateCourseData): Promise<ApiResponse<Course>> => {
    const response = await apiClient.post('/courses', data);
    return response.data;
  },

  update: async (id: number, data: Partial<CreateCourseData>): Promise<ApiResponse<Course>> => {
    const response = await apiClient.put(`/courses/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete(`/courses/${id}`);
    return response.data;
  },

  getClasses: async (id: number): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get(`/courses/${id}/classes`);
    return response.data;
  },
};