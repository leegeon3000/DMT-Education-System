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

// ============ SURVEYS ============
export interface Survey {
  id: number;
  title: string;
  description?: string;
  target_type?: 'student' | 'teacher' | 'parent' | 'all';
  class_id?: number;
  course_id?: number;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  created_by: number;
  created_at: string;
}

export interface CreateSurveyData {
  title: string;
  description?: string;
  target_type?: 'student' | 'teacher' | 'parent' | 'all';
  class_id?: number;
  course_id?: number;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
  created_by: number;
}

interface SurveyQueryParams extends PaginationParams {
  class_id?: number;
  is_active?: boolean;
}

export const surveysApi = {
  getAll: async (params: SurveyQueryParams = {}): Promise<PaginatedResponse<Survey>> => {
    const response = await apiClient.get('/surveys', { params });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Survey>> => {
    const response = await apiClient.get(`/surveys/${id}`);
    return response.data;
  },

  create: async (data: CreateSurveyData): Promise<ApiResponse<Survey>> => {
    const response = await apiClient.post('/surveys', data);
    return response.data;
  },

  update: async (id: number, data: Partial<CreateSurveyData>): Promise<ApiResponse<Survey>> => {
    const response = await apiClient.put(`/surveys/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<any>> => {
    const response = await apiClient.delete(`/surveys/${id}`);
    return response.data;
  },

  getResponses: async (id: number): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get(`/surveys/${id}/responses`);
    return response.data;
  },

  getStatistics: async (id: number): Promise<ApiResponse<any>> => {
    const response = await apiClient.get(`/surveys/${id}/statistics`);
    return response.data;
  },
};

// ============ SURVEY QUESTIONS ============
export interface SurveyQuestion {
  id: number;
  survey_id: number;
  question_text: string;
  question_type: 'multiple_choice' | 'text' | 'rating' | 'yes_no';
  options?: string;
  is_required: boolean;
  question_order: number;
  created_at: string;
}

export interface CreateQuestionData {
  survey_id: number;
  question_text: string;
  question_type?: 'multiple_choice' | 'text' | 'rating' | 'yes_no';
  options?: string;
  is_required?: boolean;
  question_order?: number;
}

export const surveyQuestionsApi = {
  create: async (data: CreateQuestionData): Promise<ApiResponse<SurveyQuestion>> => {
    const response = await apiClient.post('/survey-questions', data);
    return response.data;
  },

  update: async (id: number, data: Partial<CreateQuestionData>): Promise<ApiResponse<SurveyQuestion>> => {
    const response = await apiClient.put(`/survey-questions/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<any>> => {
    const response = await apiClient.delete(`/survey-questions/${id}`);
    return response.data;
  },
};

// ============ SURVEY RESPONSES ============
export interface SurveyResponse {
  id?: number;
  survey_id: number;
  question_id: number;
  respondent_id: number;
  answer_text?: string;
  answer_rating?: number;
  submitted_at?: string;
}

export const surveyResponsesApi = {
  submit: async (responses: SurveyResponse[]): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/survey-responses', responses);
    return response.data;
  },
};
