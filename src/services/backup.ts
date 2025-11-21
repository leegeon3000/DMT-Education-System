import { apiClient } from './auth';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ============ BACKUP ============
export interface BackupHistory {
  id: number;
  backup_type: 'full' | 'incremental';
  file_path: string;
  file_size: number;
  status: 'success' | 'failed' | 'in_progress';
  error_message?: string;
  created_by: number;
  created_at: string;
}

export interface CreateBackupData {
  backup_type: 'full' | 'incremental';
}

export interface RestoreBackupData {
  backup_id: number;
}

export const backupApi = {
  // Tạo backup mới (Admin only)
  create: async (data: CreateBackupData): Promise<ApiResponse<BackupHistory>> => {
    const response = await apiClient.post('/backup', data);
    return response.data;
  },

  // Lấy lịch sử backup (Admin only)
  getHistory: async (): Promise<ApiResponse<BackupHistory[]>> => {
    const response = await apiClient.get('/backup/history');
    return response.data;
  },

  // Restore từ backup (Admin only)
  restore: async (data: RestoreBackupData): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.post('/backup/restore', data);
    return response.data;
  },
};
