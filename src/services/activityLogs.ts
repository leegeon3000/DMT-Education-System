import { apiClient } from './auth';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface PaginationParams {
  page?: number;
  limit?: number;
}

// ============ ACTIVITY LOGS ============
export interface ActivityLog {
  id: number;
  user_id: number;
  action: string;
  table_name: string;
  record_id: number;
  old_value?: string;
  new_value?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface ActivityLogQueryParams extends PaginationParams {
  user_id?: number;
  action?: string;
  table_name?: string;
  from_date?: string;
  to_date?: string;
}

export const activityLogsApi = {
  // Lấy tất cả activity logs (Admin only)
  getAll: async (params?: ActivityLogQueryParams): Promise<ApiResponse<PaginatedResponse<ActivityLog>>> => {
    const response = await apiClient.get('/activity-logs', { params });
    return response.data;
  },

  // Lấy activity logs của một user
  getByUser: async (userId: number, params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<ActivityLog>>> => {
    const response = await apiClient.get(`/activity-logs/user/${userId}`, { params });
    return response.data;
  },
};
