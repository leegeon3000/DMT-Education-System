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

// News Types
export interface News {
  id: number;
  title: string;
  excerpt?: string;
  content: string;
  image_url?: string;
  type: 'news' | 'announcement' | 'event';
  status: 'draft' | 'published' | 'archived';
  is_featured: boolean;
  author_id: number;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateNewsData {
  title: string;
  excerpt?: string;
  content: string;
  image_url?: string;
  type?: 'news' | 'announcement' | 'event';
  status?: 'draft' | 'published' | 'archived';
  is_featured?: boolean;
  published_at?: string;
}

export interface UpdateNewsData {
  title?: string;
  excerpt?: string;
  content?: string;
  image_url?: string;
  type?: 'news' | 'announcement' | 'event';
  status?: 'draft' | 'published' | 'archived';
  is_featured?: boolean;
  published_at?: string;
}

export interface NewsQueryParams extends PaginationParams {
  type?: 'news' | 'announcement' | 'event';
  status?: 'draft' | 'published' | 'archived';
  is_featured?: boolean;
}

// News API
export const newsApi = {
  // Get all news with filters
  getAll: async (params: NewsQueryParams = {}): Promise<PaginatedResponse<News>> => {
    const response = await apiClient.get('/news', { params });
    return response.data;
  },

  // Get news by ID
  getById: async (id: number): Promise<ApiResponse<News>> => {
    const response = await apiClient.get(`/news/${id}`);
    return response.data;
  },

  // Create news (Admin/Staff only)
  create: async (data: CreateNewsData): Promise<ApiResponse<News>> => {
    const response = await apiClient.post('/news', data);
    return response.data;
  },

  // Update news (Admin/Staff only)
  update: async (id: number, data: UpdateNewsData): Promise<ApiResponse<News>> => {
    const response = await apiClient.put(`/news/${id}`, data);
    return response.data;
  },

  // Delete news (Admin only)
  delete: async (id: number): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete(`/news/${id}`);
    return response.data;
  },

  // Publish/unpublish news (Admin/Staff only)
  publish: async (id: number, publish: boolean): Promise<ApiResponse<News>> => {
    const response = await apiClient.patch(`/news/${id}/publish`, { publish });
    return response.data;
  },

  // Toggle featured status (Admin/Staff only)
  feature: async (id: number, featured: boolean): Promise<ApiResponse<News>> => {
    const response = await apiClient.patch(`/news/${id}/feature`, { featured });
    return response.data;
  },
};
