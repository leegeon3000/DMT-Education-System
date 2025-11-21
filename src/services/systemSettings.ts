import { apiClient } from './auth';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ============ SYSTEM SETTINGS ============
export interface SystemSetting {
  id: number;
  setting_key: string;
  setting_value: string;
  description?: string;
  updated_at: string;
  updated_by: number;
}

export interface UpdateSettingData {
  setting_value: string;
}

export const systemSettingsApi = {
  // Lấy tất cả settings (Admin only)
  getAll: async (): Promise<ApiResponse<SystemSetting[]>> => {
    const response = await apiClient.get('/system-settings');
    return response.data;
  },

  // Lấy setting theo key
  getByKey: async (key: string): Promise<ApiResponse<SystemSetting>> => {
    const response = await apiClient.get(`/system-settings/${key}`);
    return response.data;
  },

  // Cập nhật setting (Admin only)
  update: async (key: string, data: UpdateSettingData): Promise<ApiResponse<SystemSetting>> => {
    const response = await apiClient.put(`/system-settings/${key}`, data);
    return response.data;
  },
};
