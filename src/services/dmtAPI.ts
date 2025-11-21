import { apiClient } from './auth';

// ==================== ENROLLMENTS ====================
export interface Enrollment {
  id: number;
  class_id: number;
  student_id: number;
  enrollment_date: string;
  status: 'ACTIVE' | 'COMPLETED' | 'DROPPED';
  total_fee: number;
  paid_amount: number;
  discount_percent: number;
  payment_status: 'PENDING' | 'PARTIAL' | 'PAID';
  notes?: string;
  // Joined data
  class_name?: string;
  class_code?: string;
  course_name?: string;
  subject_name?: string;
  teacher_name?: string;
  student_name?: string;
  student_code?: string;
}

export const enrollmentAPI = {
  create: async (data: {
    class_id: number;
    student_id: number;
    total_fee: number;
    discount_percent?: number;
    notes?: string;
  }) => {
    const response = await apiClient.post('/enrollments', data);
    return response.data;
  },

  drop: async (enrollmentId: number) => {
    const response = await apiClient.delete(`/enrollments/${enrollmentId}`);
    return response.data;
  },

  getByStudent: async (studentId: number): Promise<Enrollment[]> => {
    const response = await apiClient.get(`/enrollments/student/${studentId}`);
    return response.data.data;
  },

  getByClass: async (classId: number): Promise<Enrollment[]> => {
    const response = await apiClient.get(`/enrollments/class/${classId}`);
    return response.data.data;
  },

  getAll: async (params?: {
    page?: number;
    limit?: number;
    class_id?: number;
    student_id?: number;
    status?: string;
  }) => {
    const response = await apiClient.get('/enrollments', { params });
    return response.data;
  },
};

// ==================== ATTENDANCE ====================
export interface AttendanceRecord {
  id: number;
  session_id: number;
  enrollment_id: number;
  student_id: number;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  check_in_time?: string;
  notes?: string;
  marked_by: number;
  marked_at: string;
  // Joined data
  student_name?: string;
  student_code?: string;
  student_email?: string;
  session_title?: string;
  session_date?: string;
  class_name?: string;
}

export interface AttendanceStatistic {
  student_id: number;
  student_code: string;
  student_name: string;
  present_count: number;
  absent_count: number;
  late_count: number;
  excused_count: number;
  total_sessions: number;
  attendance_rate: number;
}

export const attendanceAPI = {
  bulkMark: async (data: {
    session_id: number;
    marked_by: number;
    attendance_data: Array<{
      enrollment_id: number;
      status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
      notes?: string;
    }>;
  }) => {
    const response = await apiClient.post('/attendance/bulk', data);
    return response.data;
  },

  getBySession: async (sessionId: number): Promise<AttendanceRecord[]> => {
    const response = await apiClient.get(`/attendance/session/${sessionId}`);
    return response.data.data;
  },

  getByStudent: async (studentId: number, classId?: number): Promise<AttendanceRecord[]> => {
    const params = classId ? { classId } : {};
    const response = await apiClient.get(`/attendance/student/${studentId}`, { params });
    return response.data.data;
  },

  getStatistics: async (classId: number): Promise<AttendanceStatistic[]> => {
    const response = await apiClient.get(`/attendance/statistics/${classId}`);
    return response.data.data;
  },

  getByClass: async (classId: number) => {
    const response = await apiClient.get(`/attendance/class/${classId}`);
    return response.data.data;
  },
};

// ==================== PAYMENTS ====================
export interface Payment {
  id: number;
  enrollment_id: number;
  amount: number;
  payment_method: 'CASH' | 'BANK_TRANSFER' | 'CREDIT_CARD' | 'E_WALLET';
  payment_date: string;
  transaction_id?: string;
  status: 'COMPLETED' | 'PENDING' | 'REFUNDED' | 'FAILED';
  processed_by: number;
  notes?: string;
  // Joined data
  student_name?: string;
  student_code?: string;
  class_name?: string;
  course_name?: string;
  processed_by_name?: string;
  total_fee?: number;
  enrollment_paid_amount?: number;
  enrollment_payment_status?: string;
}

export const paymentAPI = {
  process: async (data: {
    enrollment_id: number;
    amount: number;
    payment_method: 'CASH' | 'BANK_TRANSFER' | 'CREDIT_CARD' | 'E_WALLET';
    transaction_id?: string;
    processed_by: number;
    notes?: string;
  }) => {
    const response = await apiClient.post('/payments', data);
    return response.data;
  },

  refund: async (data: {
    payment_id: number;
    refund_amount: number;
    reason: string;
    processed_by: number;
  }) => {
    const response = await apiClient.post('/payments/refund', data);
    return response.data;
  },

  getByEnrollment: async (enrollmentId: number): Promise<Payment[]> => {
    const response = await apiClient.get(`/payments/enrollment/${enrollmentId}`);
    return response.data.data;
  },

  getByStudent: async (studentId: number): Promise<Payment[]> => {
    const response = await apiClient.get(`/payments/student/${studentId}`);
    return response.data.data;
  },

  getAll: async (params?: {
    page?: number;
    limit?: number;
    payment_method?: string;
    status?: string;
    from_date?: string;
    to_date?: string;
  }) => {
    const response = await apiClient.get('/payments', { params });
    return response.data;
  },

  getById: async (paymentId: number): Promise<Payment> => {
    const response = await apiClient.get(`/payments/${paymentId}`);
    return response.data.data;
  },
};

// ==================== REPORTS ====================
export interface SystemOverview {
  report_type: string;
  total_active_users: number;
  total_students: number;
  total_teachers: number;
  total_staff?: number;
  active_classes: number;
  active_enrollments: number;
  revenue_this_year: number;
  revenue_this_month: number | null;
  pending_payments?: number;
}

export interface StudentReport {
  student_info: {
    student_id: number;
    student_code: string;
    full_name: string;
    email: string;
    phone?: string;
    school_level: string;
    total_enrollments: number;
    active_enrollments: number;
  };
  enrollments: Array<{
    enrollment_id: number;
    class_name: string;
    course_name: string;
    status: string;
    total_fee: number;
    paid_amount: number;
    payment_status: string;
    attendance_rate?: number;
    average_grade?: number;
  }>;
  pending_assignments: Array<{
    assignment_id: number;
    title: string;
    class_name: string;
    due_date: string;
    status: string;
  }>;
}

export interface ClassReport {
  class_info: {
    class_id: number;
    class_name: string;
    class_code: string;
    course_name: string;
    teacher_name: string;
    total_students: number;
    capacity: number;
    total_sessions: number;
    completed_sessions: number;
  };
  students: Array<{
    student_id: number;
    student_code: string;
    student_name: string;
    enrollment_status: string;
    attendance_rate?: number;
    average_grade?: number;
  }>;
  attendance_stats: Array<{
    student_id: number;
    student_name: string;
    present_count: number;
    absent_count: number;
    late_count: number;
    attendance_rate: number;
  }>;
}

export interface MonthlyRevenue {
  month: number;
  revenue: number;
}

export interface RevenueResponse {
  year: number;
  monthly_revenue: MonthlyRevenue[];
}

export const reportsAPI = {
  getSystemOverview: async (): Promise<SystemOverview> => {
    const response = await apiClient.get('/reports/system');
    return response.data.data;
  },

  getStudentReport: async (studentId: number): Promise<StudentReport> => {
    const response = await apiClient.get(`/reports/student/${studentId}`);
    return response.data.data;
  },

  getClassReport: async (classId: number): Promise<ClassReport> => {
    const response = await apiClient.get(`/reports/class/${classId}`);
    return response.data.data;
  },

  getRevenue: async (year: number, month?: number): Promise<RevenueResponse> => {
    const params = month ? { year, month } : { year };
    const response = await apiClient.get('/reports/revenue', { params });
    return response.data.data;
  },

  getRecentEnrollments: async (limit: number = 7) => {
    const response = await apiClient.get('/enrollments', { 
      params: { limit, page: 1, sort: 'created_at', order: 'desc' } 
    });
    return response.data;
  },

  getTopCourses: async (limit: number = 5) => {
    const response = await apiClient.get('/classes', { 
      params: { limit, page: 1, sort: 'current_students', order: 'desc', status: 'active' } 
    });
    return response.data;
  },

  getAttendanceRate: async (studentId: number, classId?: number) => {
    const params = classId ? { student_id: studentId, class_id: classId } : { student_id: studentId };
    const response = await apiClient.get('/reports/attendance-rate', { params });
    return response.data.data;
  },

  getAverageGrade: async (studentId: number, classId?: number) => {
    const params = classId ? { student_id: studentId, class_id: classId } : { student_id: studentId };
    const response = await apiClient.get('/reports/average-grade', { params });
    return response.data.data;
  },
};
