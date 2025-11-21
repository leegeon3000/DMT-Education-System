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

// ============ NOTIFICATIONS ============
export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  is_read: boolean;
  link_url?: string;
  created_at: string;
}

export interface CreateNotificationData {
  user_id: number;
  title: string;
  message: string;
  type?: 'info' | 'warning' | 'success' | 'error';
  link_url?: string;
}

interface NotificationQueryParams extends PaginationParams {
  is_read?: boolean;
  type?: 'info' | 'warning' | 'success' | 'error';
}

export const notificationsApi = {
  // Lấy tất cả thông báo của user hiện tại
  getAll: async (params: NotificationQueryParams = {}): Promise<PaginatedResponse<Notification>> => {
    const response = await apiClient.get('/notifications', { params });
    return response.data;
  },

  // Lấy thông báo theo ID
  getById: async (id: number): Promise<ApiResponse<Notification>> => {
    const response = await apiClient.get(`/notifications/${id}`);
    return response.data;
  },

  // Đánh dấu đã đọc
  markAsRead: async (id: number): Promise<ApiResponse<Notification>> => {
    const response = await apiClient.patch(`/notifications/${id}/read`);
    return response.data;
  },

  // Đánh dấu tất cả đã đọc
  markAllAsRead: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.patch('/notifications/read-all');
    return response.data;
  },

  // Đếm thông báo chưa đọc
  getUnreadCount: async (): Promise<ApiResponse<number>> => {
    const response = await apiClient.get('/notifications/unread-count');
    return response.data;
  },

  // Xóa thông báo
  delete: async (id: number): Promise<ApiResponse<any>> => {
    const response = await apiClient.delete(`/notifications/${id}`);
    return response.data;
  },

  // Tạo thông báo mới (Admin/System only)
  create: async (data: CreateNotificationData): Promise<ApiResponse<Notification>> => {
    const response = await apiClient.post('/notifications', data);
    return response.data;
  },
};
