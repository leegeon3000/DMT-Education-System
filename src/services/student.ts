import http from './http';

export interface StudentProfile {
  id: string;
  userId: string;
  studentCode: string;
  fullName: string;
  email: string;
  phone?: string;
  schoolLevel: 'elementary' | 'middle_school' | 'high_school';
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  status: 'active' | 'inactive' | 'graduated' | 'suspended';
  enrollmentDate: string;
}

export interface StudentMaterial {
  id: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileType: 'pdf' | 'doc' | 'video' | 'image' | 'link';
  fileSize?: number;
  isDownloadable: boolean;
  courseTitle: string;
  uploadedAt: string;
}

export interface StudentVideo {
  id: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: number;
  courseTitle: string;
  sessionNumber: number;
  uploadedAt: string;
  isWatched: boolean;
}

export interface StudentGrade {
  id: string;
  assignmentTitle: string;
  courseTitle: string;
  score: number;
  maxScore: number;
  feedback?: string;
  submittedAt?: string;
  gradedAt: string;
  gradedBy: string;
  type: 'homework' | 'quiz' | 'exam' | 'project';
}

export interface StudentSchedule {
  id: string;
  classId: string;
  className: string;
  courseTitle: string;
  teacherName: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  classroom?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface StudentPayment {
  id: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  status: 'completed' | 'pending' | 'overdue';
  description: string;
  receiptNumber?: string;
}

export interface StudentPaymentSummary {
  totalFee: number;
  paidAmount: number;
  remainingAmount: number;
  nextDueDate?: string;
}

export interface StudentSurvey {
  id: string;
  title: string;
  description: string;
  deadline?: string;
  status: 'pending' | 'completed';
  courseTitle: string;
  questionCount: number;
  completedAt?: string;
}

export interface StudentNotification {
  id: string;
  title: string;
  message: string;
  type: 'general' | 'assignment' | 'grade' | 'payment' | 'system';
  isRead: boolean;
  createdAt: string;
}

export interface DashboardStats {
  completedCourses: number;
  pendingAssignments: number;
  upcomingDeadlines: number;
  completionRate: number;
}

const studentService = {
  // Profile
  getProfile: () => http.get<StudentProfile>('/students/profile'),
  updateProfile: (data: Partial<StudentProfile>) => http.put('/students/profile', data),

  // Dashboard
  getDashboardStats: () => http.get<DashboardStats>('/students/dashboard/stats'),

  // Materials
  getMaterials: (params?: { courseId?: string; type?: string }) => 
    http.get<StudentMaterial[]>('/students/materials', { params }),
  downloadMaterial: (materialId: string) => 
    http.get(`/students/materials/${materialId}/download`, { responseType: 'blob' }),

  // Videos
  getVideos: (params?: { courseId?: string }) => 
    http.get<StudentVideo[]>('/students/videos', { params }),
  markVideoWatched: (videoId: string) => 
    http.post(`/students/videos/${videoId}/watched`, {}),

  // Grades & Transcript
  getGrades: (params?: { courseId?: string; type?: string }) => 
    http.get<StudentGrade[]>('/students/grades', { params }),
  getTranscript: () => http.get('/students/transcript'),

  // Schedule
  getSchedule: (params?: { startDate?: string; endDate?: string }) => 
    http.get<StudentSchedule[]>('/students/schedule', { params }),

  // Payments
  getPayments: () => http.get<StudentPayment[]>('/students/payments'),
  getPaymentSummary: () => http.get<StudentPaymentSummary>('/students/payments/summary'),
  processPayment: (paymentId: string, data: any) => 
    http.post(`/students/payments/${paymentId}/process`, data),

  // Surveys
  getSurveys: (params?: { status?: 'pending' | 'completed' }) => 
    http.get<StudentSurvey[]>('/students/surveys', { params }),
  getSurveyDetails: (surveyId: string) => 
    http.get(`/students/surveys/${surveyId}`),
  submitSurvey: (surveyId: string, answers: any) => 
    http.post(`/students/surveys/${surveyId}/submit`, { answers }),

  // Notifications
  getNotifications: (params?: { unreadOnly?: boolean }) => 
    http.get<StudentNotification[]>('/students/notifications', { params }),
  markNotificationRead: (notificationId: string) => 
    http.put(`/students/notifications/${notificationId}/read`, {}),
  markAllNotificationsRead: () => 
    http.put('/students/notifications/read-all', {}),
  deleteNotification: (notificationId: string) => 
    http.delete(`/students/notifications/${notificationId}`),

  // Courses & Enrollments
  getEnrolledCourses: () => http.get('/students/courses'),
  getCourseDetails: (courseId: string) => http.get(`/students/courses/${courseId}`),
  getCourseMaterials: (courseId: string) => http.get(`/students/courses/${courseId}/materials`),
  getCourseVideos: (courseId: string) => http.get(`/students/courses/${courseId}/videos`),

  // Assignments
  getAssignments: (params?: { courseId?: string; status?: string }) => 
    http.get('/students/assignments', { params }),
  getAssignmentDetails: (assignmentId: string) => 
    http.get(`/students/assignments/${assignmentId}`),
  submitAssignment: (assignmentId: string, data: FormData) => 
    http.post(`/students/assignments/${assignmentId}/submit`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  // Attendance
  getAttendance: (params?: { startDate?: string; endDate?: string }) => 
    http.get('/students/attendance', { params }),

  // Feedback
  submitFeedback: (data: { courseId?: string; teacherId?: string; message: string; rating?: number }) => 
    http.post('/students/feedback', data),
};

export default studentService;
