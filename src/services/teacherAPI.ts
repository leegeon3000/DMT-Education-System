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

export interface TeacherStats {
  totalClasses: number;
  totalStudents: number;
  pendingGrading: number;
  upcomingSessions: number;
  attendanceRate: number;
}

export interface ClassData {
  id: number;
  class_code: string;
  course_name: string;
  current_students: number;
  capacity: number;
  schedule: string;
  room: string;
  status: string;
}

export interface UpcomingSession {
  id: number;
  class_name: string;
  session_date: string;
  start_time: string;
  end_time: string;
  room: string;
  topic: string;
}

export interface PendingSubmission {
  id: number;
  assignment_title: string;
  student_name: string;
  student_code: string;
  submitted_at: string;
  class_name: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  type: 'homework' | 'quiz' | 'midterm' | 'final';
  dueDate: string;
  maxScore: number;
  instructions: string;
  attachments: string[];
  status: 'draft' | 'published' | 'closed';
  submissionCount: number;
  totalStudents: number;
  createdAt: string;
}

export interface Student {
  id: string;
  studentId: string;
  student_code: string;
  name: string;
  full_name: string;
  email: string;
  phone: string;
  attendance: {
    [key: string]: 'present' | 'absent' | 'late' | 'excused';
  };
}

export interface Material {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'video' | 'image' | 'document';
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  downloadCount: number;
  status: 'active' | 'inactive';
  subject: string;
  grade: string;
}

export interface TeachingReport {
  id: string;
  month: string;
  totalClasses: number;
  totalHours: number;
  studentsCount: number;
  avgAttendance: number;
  assignmentsGiven: number;
  avgScore: number;
}

export interface ClassSchedule {
  id: string;
  subject: string;
  className: string;
  room: string;
  startTime: string;
  endTime: string;
  dayOfWeek: number;
  studentCount: number;
}

export const teacherAPI = {
  // Get classes taught by teacher
  getMyClasses: async (teacherId: number): Promise<ClassData[]> => {
    try {
      const response = await apiClient.get(`/classes/teacher/${teacherId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch teacher classes:', error);
      throw error;
    }
  },

  // Get teaching statistics
  getTeachingStats: async (teacherId: number): Promise<TeacherStats> => {
    try {
      const response = await apiClient.get(`/teachers/${teacherId}/statistics`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch teaching stats:', error);
      throw error;
    }
  },

  // Get upcoming sessions
  getUpcomingSessions: async (teacherId: number, days: number = 7): Promise<UpcomingSession[]> => {
    try {
      const response = await apiClient.get(`/sessions/teacher/${teacherId}?days=${days}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch upcoming sessions:', error);
      throw error;
    }
  },

  // Get pending grading submissions
  getPendingGrading: async (teacherId: number): Promise<PendingSubmission[]> => {
    try {
      const response = await apiClient.get(`/submissions/pending?teacherId=${teacherId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch pending grading:', error);
      throw error;
    }
  },

  // Get class details
  getClassDetails: async (classId: number) => {
    try {
      const response = await apiClient.get(`/classes/${classId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch class details:', error);
      throw error;
    }
  },

  // Get class students
  getClassStudents: async (classId: number) => {
    try {
      const response = await apiClient.get(`/classes/${classId}/students`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch class students:', error);
      throw error;
    }
  },

  // Assignments
  getAssignments: async (teacherId: number): Promise<Assignment[]> => {
    try {
      const response = await apiClient.get(`/assignments/teacher/${teacherId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
      return [];
    }
  },

  createAssignment: async (data: Partial<Assignment>): Promise<Assignment> => {
    try {
      const response = await apiClient.post('/assignments', data);
      return response.data;
    } catch (error) {
      console.error('Failed to create assignment:', error);
      throw error;
    }
  },

  updateAssignment: async (id: string, data: Partial<Assignment>): Promise<Assignment> => {
    try {
      const response = await apiClient.put(`/assignments/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to update assignment:', error);
      throw error;
    }
  },

  deleteAssignment: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/assignments/${id}`);
    } catch (error) {
      console.error('Failed to delete assignment:', error);
      throw error;
    }
  },

  // Attendance
  getStudentsForAttendance: async (classId: number): Promise<Student[]> => {
    try {
      const response = await apiClient.get(`/classes/${classId}/students`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch students:', error);
      return [];
    }
  },

  markAttendance: async (classId: number, date: string, attendance: any): Promise<void> => {
    try {
      await apiClient.post('/attendance/mark', { classId, date, attendance });
    } catch (error) {
      console.error('Failed to mark attendance:', error);
      throw error;
    }
  },

  // Materials
  getMaterials: async (teacherId: number): Promise<Material[]> => {
    try {
      const response = await apiClient.get(`/materials/teacher/${teacherId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch materials:', error);
      return [];
    }
  },

  uploadMaterial: async (data: FormData): Promise<Material> => {
    try {
      const response = await apiClient.post('/materials/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to upload material:', error);
      throw error;
    }
  },

  deleteMaterial: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/materials/${id}`);
    } catch (error) {
      console.error('Failed to delete material:', error);
      throw error;
    }
  },

  // Reports
  getTeachingReports: async (teacherId: number): Promise<TeachingReport[]> => {
    try {
      const response = await apiClient.get(`/reports/teacher/${teacherId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch teaching reports:', error);
      return [];
    }
  },

  // Schedule/Calendar
  getSchedule: async (teacherId: number): Promise<ClassSchedule[]> => {
    try {
      const response = await apiClient.get(`/schedule/teacher/${teacherId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch schedule:', error);
      return [];
    }
  },
};

export default teacherAPI;
