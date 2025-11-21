import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface StaffStats {
  pendingRegistrations: number;
  pendingPayments: number;
  newTickets: number;
  todayClasses: number;
  monthlyRevenue: number;
  activeStudents: number;
}

export interface PendingRegistration {
  id: number;
  student_name: string;
  email: string;
  phone: string;
  registered_at: string;
  status: string;
}

export interface PendingPayment {
  id: number;
  student_name: string;
  enrollment_id: number;
  amount: number;
  due_date: string;
  status: string;
}

export const staffAPI = {
  // Get staff dashboard statistics
  getStats: async (): Promise<StaffStats> => {
    try {
      const response = await apiClient.get('/staff/statistics');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch staff stats:', error);
      throw error;
    }
  },

  // Get pending student registrations
  getPendingRegistrations: async (): Promise<PendingRegistration[]> => {
    try {
      const response = await apiClient.get('/staff/registrations/pending');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch pending registrations:', error);
      throw error;
    }
  },

  // Get pending payments
  getPendingPayments: async (): Promise<PendingPayment[]> => {
    try {
      const response = await apiClient.get('/staff/payments/pending');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch pending payments:', error);
      throw error;
    }
  },
};

export default staffAPI;
