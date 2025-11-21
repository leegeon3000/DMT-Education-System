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

// ============ MATERIALS ============
export interface Material {
  id: number;
  class_id: number;
  title: string;
  description?: string;
  file_url?: string;
  file_type?: string;
  file_size?: number;
  is_public: boolean;
  uploaded_by: number;
  created_at: string;
}

export interface CreateMaterialData {
  class_id: number;
  title: string;
  description?: string;
  file_url?: string;
  file_type?: string;
  file_size?: number;
  is_public?: boolean;
  uploaded_by: number;
}

interface MaterialQueryParams extends PaginationParams {
  class_id?: number;
  file_type?: string;
}

export const materialsApi = {
  getAll: async (params: MaterialQueryParams = {}): Promise<PaginatedResponse<Material>> => {
    const response = await apiClient.get('/materials', { params });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Material>> => {
    const response = await apiClient.get(`/materials/${id}`);
    return response.data;
  },

  create: async (data: CreateMaterialData): Promise<ApiResponse<Material>> => {
    const response = await apiClient.post('/materials', data);
    return response.data;
  },

  update: async (id: number, data: Partial<CreateMaterialData>): Promise<ApiResponse<Material>> => {
    const response = await apiClient.put(`/materials/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<any>> => {
    const response = await apiClient.delete(`/materials/${id}`);
    return response.data;
  },
};
