import axios from 'axios';

// API Configuration for public endpoints
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Create axios instance for public API (no auth required)
export const publicApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

// Public Courses API (no auth required)
export interface PublicCourse {
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

interface CourseQueryParams extends PaginationParams {
  subject_id?: number;
  level?: 'beginner' | 'intermediate' | 'advanced';
  is_active?: boolean;
}

export const publicCoursesApi = {
  getAll: async (params: CourseQueryParams = {}): Promise<PaginatedResponse<PublicCourse>> => {
    const response = await publicApiClient.get('/courses', { params });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<PublicCourse>> => {
    const response = await publicApiClient.get(`/courses/${id}`);
    return response.data;
  },
};

// Public Teachers API (no auth required)
export interface PublicTeacher {
  id: number;
  teacher_code: string;
  full_name: string;
  phone?: string;
  address?: string;
  birth_date?: string;
  degree?: string;
  specialization?: string;
  years_of_experience?: number;
  bio?: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
}

interface TeacherQueryParams extends PaginationParams {
  specialization?: string;
  is_active?: boolean;
}

export const publicTeachersApi = {
  getAll: async (params: TeacherQueryParams = {}): Promise<PaginatedResponse<PublicTeacher>> => {
    const response = await publicApiClient.get('/teachers', { params });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<PublicTeacher>> => {
    const response = await publicApiClient.get(`/teachers/${id}`);
    return response.data;
  },
};
