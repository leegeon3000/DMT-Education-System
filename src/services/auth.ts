import axios from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Create axios instance with interceptors
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[API] ✓ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    return response;
  },
  (error) => {
    console.error(`[API] ✗ ${error.config?.method?.toUpperCase()} ${error.config?.url} -`, error.message);
    if (error.response?.status === 401) {
      // Unauthorized - clear token but DON'T auto-redirect
      // Let the component handle redirect logic
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      // REMOVED: window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Types
interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    full_name: string;
    role_id: number;
    student_id?: number;
    student_code?: string;
    teacher_id?: number;
    teacher_code?: string;
  };
}

interface User {
  id: number;
  email: string;
  full_name: string;
  role_id: number;
  phone?: string;
  status: boolean;
  created_at: string;
}

interface RegisterStudentData {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  address?: string;
  birth_date?: string;
  school_level?: 'ELEMENTARY' | 'MIDDLE_SCHOOL' | 'HIGH_SCHOOL';
  parent_name?: string;
  parent_phone?: string;
}

interface RegisterTeacherData {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  address?: string;
  birth_date?: string;
  degree?: string;
  specialization?: string;
  years_of_experience?: number;
  bio?: string;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    student_id?: number;
    student_code?: string;
    teacher_id?: number;
    teacher_code?: string;
    email: string;
    full_name: string;
  };
}

export const authService = {
  login: async (credentials: { email: string; password: string }): Promise<LoginResponse> => {
    try {
      console.log('🌐 authService: Starting login request');
      console.log('🌐 API_BASE_URL:', API_BASE_URL);
      console.log('🌐 VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
      console.log('🌐 Target URL:', `${API_BASE_URL}/auth/login`);
      
      const startTime = performance.now();
      
      // Use native fetch instead of axios to avoid interceptor overhead
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      const endTime = performance.now();
      console.log(`🌐 authService: Response received in ${(endTime - startTime).toFixed(0)}ms`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }
      
      const data = await response.json();
      const { token, user } = data;
      
      // Store token and user in localStorage
      const storageStart = performance.now();
      localStorage.setItem('authToken', token);
      localStorage.setItem('token', token); // Store both for compatibility
      localStorage.setItem('user', JSON.stringify(user));
      console.log(`💾 authService: Storage saved in ${(performance.now() - storageStart).toFixed(0)}ms`);
      
      return { token, user };
    } catch (error: any) {
      console.error('🌐 authService: Login failed:', error);
      console.error('🌐 Error details:', error.message);
      throw new Error(error.message || 'Login failed');
    }
  },

  registerStudent: async (data: RegisterStudentData): Promise<RegisterResponse> => {
    try {
      const response = await apiClient.post('/auth/register/student', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Student registration failed');
    }
  },

  registerTeacher: async (data: RegisterTeacherData): Promise<RegisterResponse> => {
    try {
      const response = await apiClient.post('/auth/register/teacher', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Teacher registration failed');
    }
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Let the caller handle navigation
    // REMOVED: window.location.href = '/login';
  },

  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data.user;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to get current user');
    }
  },

  getStoredUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken: (): string | null => {
    return localStorage.getItem('authToken');
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('authToken');
  },
};

export { apiClient };
export default authService;