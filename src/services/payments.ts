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

// ============ PAYMENTS ============
export interface Payment {
  id: number;
  enrollment_id: number;
  amount: number;
  payment_date: string;
  payment_method: 'CASH' | 'BANK_TRANSFER' | 'CARD' | 'MOMO' | 'VNPAY';
  transaction_id?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  notes?: string;
  processed_by: number;
  created_at: string;
}

export interface CreatePaymentData {
  enrollment_id: number;
  amount: number;
  payment_method: 'CASH' | 'BANK_TRANSFER' | 'CARD' | 'MOMO' | 'VNPAY';
  payment_date?: string;
  transaction_id?: string;
  notes?: string;
  processed_by: number;
}

interface PaymentQueryParams extends PaginationParams {
  enrollment_id?: number;
  payment_method?: 'CASH' | 'BANK_TRANSFER' | 'CARD' | 'MOMO' | 'VNPAY';
  status?: 'pending' | 'completed' | 'failed' | 'refunded';
  start_date?: string;
  end_date?: string;
}

export const paymentsApi = {
  // Lấy tất cả payments
  getAll: async (params: PaymentQueryParams = {}): Promise<PaginatedResponse<Payment>> => {
    const response = await apiClient.get('/payments', { params });
    return response.data;
  },

  // Lấy payment theo ID
  getById: async (id: number): Promise<ApiResponse<Payment>> => {
    const response = await apiClient.get(`/payments/${id}`);
    return response.data;
  },

  // Tạo payment mới
  create: async (data: CreatePaymentData): Promise<ApiResponse<Payment>> => {
    const response = await apiClient.post('/payments', data);
    return response.data;
  },

  // Cập nhật payment
  update: async (id: number, data: Partial<CreatePaymentData>): Promise<ApiResponse<Payment>> => {
    const response = await apiClient.put(`/payments/${id}`, data);
    return response.data;
  },

  // Xóa payment
  delete: async (id: number): Promise<ApiResponse<any>> => {
    const response = await apiClient.delete(`/payments/${id}`);
    return response.data;
  },

  // Hoàn tiền (refund)
  refund: async (
    id: number,
    refundData: { refund_amount: number; refund_reason: string }
  ): Promise<ApiResponse<Payment>> => {
    const response = await apiClient.post(`/payments/${id}/refund`, refundData);
    return response.data;
  },

  // Lấy tóm tắt thanh toán (summary/statistics)
  getSummary: async (params: { start_date?: string; end_date?: string }): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/payments/summary', { params });
    return response.data;
  },

  // Lấy payments theo enrollment
  getByEnrollment: async (enrollmentId: number): Promise<ApiResponse<Payment[]>> => {
    const response = await apiClient.get(`/enrollments/${enrollmentId}/payments`);
    return response.data;
  },
};
