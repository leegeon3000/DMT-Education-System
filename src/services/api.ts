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

// Users API
interface User {
  id: number;
  email: string;
  full_name: string;
  role_id: number;
  phone?: string;
  address?: string;
  birth_date?: string;
  status: boolean;
  created_at: string;
  roles?: { name: string };
}

interface CreateUserData {
  email: string;
  password: string;
  full_name: string;
  role_id: number;
  phone?: string;
  address?: string;
  birth_date?: string;
  status?: boolean;
}

interface UpdateUserData {
  email?: string;
  password?: string;
  full_name?: string;
  role_id?: number;
  phone?: string;
  address?: string;
  birth_date?: string;
  status?: boolean;
}

export const usersApi = {
  getAll: async (params: PaginationParams = {}): Promise<PaginatedResponse<User>> => {
    const response = await apiClient.get('/users', { params });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<User>> => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  create: async (data: CreateUserData): Promise<ApiResponse<User>> => {
    const response = await apiClient.post('/users', data);
    return response.data;
  },

  update: async (id: number, data: UpdateUserData): Promise<ApiResponse<User>> => {
    const response = await apiClient.put(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },
};

// Roles API
interface Role {
  id: number;
  code: string;
  name: string;
  description?: string;
  created_at: string;
}

interface CreateRoleData {
  code: string;
  name: string;
  description?: string;
}

export const rolesApi = {
  getAll: async (): Promise<ApiResponse<Role[]>> => {
    const response = await apiClient.get('/roles');
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Role>> => {
    const response = await apiClient.get(`/roles/${id}`);
    return response.data;
  },

  create: async (data: CreateRoleData): Promise<ApiResponse<Role>> => {
    const response = await apiClient.post('/roles', data);
    return response.data;
  },

  update: async (id: number, data: Partial<CreateRoleData>): Promise<ApiResponse<Role>> => {
    const response = await apiClient.put(`/roles/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete(`/roles/${id}`);
    return response.data;
  },
};