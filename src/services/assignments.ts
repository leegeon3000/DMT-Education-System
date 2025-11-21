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

// ============ ASSIGNMENTS ============
export interface Assignment {
  id: number;
  class_id: number;
  title: string;
  description?: string;
  due_date?: string;
  max_score: number;
  assignment_type: 'homework' | 'quiz' | 'exam' | 'project';
  created_by: number;
  created_at: string;
}

export interface CreateAssignmentData {
  class_id: number;
  title: string;
  description?: string;
  due_date?: string;
  max_score?: number;
  assignment_type?: 'homework' | 'quiz' | 'exam' | 'project';
  created_by: number;
}

export const assignmentsApi = {
  getAll: async (params: PaginationParams = {}): Promise<PaginatedResponse<Assignment>> => {
    const response = await apiClient.get('/assignments', { params });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Assignment>> => {
    const response = await apiClient.get(`/assignments/${id}`);
    return response.data;
  },

  create: async (data: CreateAssignmentData): Promise<ApiResponse<Assignment>> => {
    const response = await apiClient.post('/assignments', data);
    return response.data;
  },

  update: async (id: number, data: Partial<CreateAssignmentData>): Promise<ApiResponse<Assignment>> => {
    const response = await apiClient.put(`/assignments/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<any>> => {
    const response = await apiClient.delete(`/assignments/${id}`);
    return response.data;
  },

  getSubmissions: async (id: number): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get(`/assignments/${id}/submissions`);
    return response.data;
  },
};

// ============ SUBMISSIONS ============
export interface Submission {
  id: number;
  assignment_id: number;
  student_id: number;
  submission_date: string;
  content?: string;
  attachment_url?: string;
  score?: number;
  feedback?: string;
  graded_by?: number;
  graded_at?: string;
  status: 'submitted' | 'graded' | 'late' | 'missing';
  created_at: string;
}

export interface CreateSubmissionData {
  assignment_id: number;
  student_id: number;
  submission_date?: string;
  content?: string;
  attachment_url?: string;
  status?: 'submitted' | 'graded' | 'late' | 'missing';
}

export const submissionsApi = {
  create: async (data: CreateSubmissionData): Promise<ApiResponse<Submission>> => {
    const response = await apiClient.post('/submissions', data);
    return response.data;
  },

  update: async (id: number, data: Partial<CreateSubmissionData>): Promise<ApiResponse<Submission>> => {
    const response = await apiClient.put(`/submissions/${id}`, data);
    return response.data;
  },
};

// ============ GRADES ============
export interface Grade {
  id: number;
  enrollment_id: number;
  grade_type: 'midterm' | 'final' | 'assignment' | 'overall';
  score: number;
  max_score: number;
  weight?: number;
  notes?: string;
  graded_by: number;
  graded_at: string;
  created_at: string;
}

export interface CreateGradeData {
  enrollment_id: number;
  grade_type: 'midterm' | 'final' | 'assignment' | 'overall';
  score: number;
  max_score?: number;
  weight?: number;
  notes?: string;
  graded_by: number;
}

export const gradesApi = {
  create: async (data: CreateGradeData): Promise<ApiResponse<Grade>> => {
    const response = await apiClient.post('/grades', data);
    return response.data;
  },

  update: async (id: number, data: Partial<CreateGradeData>): Promise<ApiResponse<Grade>> => {
    const response = await apiClient.put(`/grades/${id}`, data);
    return response.data;
  },

  getByStudent: async (studentId: number): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get(`/students/${studentId}/grades`);
    return response.data;
  },
};
