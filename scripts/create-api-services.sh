#!/bin/bash

##############################################################################
# DMT Education System - Fix Missing API Services
# Automatically creates missing API service files
##############################################################################

BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo ""
echo -e "${CYAN}╔════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║         CREATE MISSING API SERVICES                                ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Create adminAPI.ts
echo -e "${BLUE}📝 Creating src/services/adminAPI.ts...${NC}"

cat > src/services/adminAPI.ts << 'EOF'
import api from './api';

// ============================================================================
// ADMIN API SERVICE
// Handles all admin-related API calls
// ============================================================================

const API_BASE = '/admin';

// Teachers Management
export const getTeachers = async (params?: any) => {
  try {
    const response = await api.get('/teachers', { params });
    return response.data.data || response.data || [];
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return [];
  }
};

export const getTeacherById = async (id: number) => {
  try {
    const response = await api.get(`/teachers/${id}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching teacher:', error);
    return null;
  }
};

export const createTeacher = async (data: any) => {
  try {
    const response = await api.post('/teachers', data);
    return response.data;
  } catch (error) {
    console.error('Error creating teacher:', error);
    throw error;
  }
};

export const updateTeacher = async (id: number, data: any) => {
  try {
    const response = await api.put(`/teachers/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating teacher:', error);
    throw error;
  }
};

export const deleteTeacher = async (id: number) => {
  try {
    const response = await api.delete(`/teachers/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting teacher:', error);
    throw error;
  }
};

// Students Management
export const getStudents = async (params?: any) => {
  try {
    const response = await api.get('/students', { params });
    return response.data.data || response.data || [];
  } catch (error) {
    console.error('Error fetching students:', error);
    return [];
  }
};

export const getStudentById = async (id: number) => {
  try {
    const response = await api.get(`/students/${id}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching student:', error);
    return null;
  }
};

export const createStudent = async (data: any) => {
  try {
    const response = await api.post('/students', data);
    return response.data;
  } catch (error) {
    console.error('Error creating student:', error);
    throw error;
  }
};

export const updateStudent = async (id: number, data: any) => {
  try {
    const response = await api.put(`/students/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating student:', error);
    throw error;
  }
};

export const deleteStudent = async (id: number) => {
  try {
    const response = await api.delete(`/students/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting student:', error);
    throw error;
  }
};

// Classes Management
export const getClasses = async (params?: any) => {
  try {
    const response = await api.get('/classes', { params });
    return response.data.data || response.data || [];
  } catch (error) {
    console.error('Error fetching classes:', error);
    return [];
  }
};

export const getClassById = async (id: number) => {
  try {
    const response = await api.get(`/classes/${id}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching class:', error);
    return null;
  }
};

export const createClass = async (data: any) => {
  try {
    const response = await api.post('/classes', data);
    return response.data;
  } catch (error) {
    console.error('Error creating class:', error);
    throw error;
  }
};

export const updateClass = async (id: number, data: any) => {
  try {
    const response = await api.put(`/classes/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating class:', error);
    throw error;
  }
};

export const deleteClass = async (id: number) => {
  try {
    const response = await api.delete(`/classes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting class:', error);
    throw error;
  }
};

// Courses Management
export const getCourses = async (params?: any) => {
  try {
    const response = await api.get('/courses', { params });
    return response.data.data || response.data || [];
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
};

export const getCourseById = async (id: number) => {
  try {
    const response = await api.get(`/courses/${id}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching course:', error);
    return null;
  }
};

export const createCourse = async (data: any) => {
  try {
    const response = await api.post('/courses', data);
    return response.data;
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

export const updateCourse = async (id: number, data: any) => {
  try {
    const response = await api.put(`/courses/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
};

export const deleteCourse = async (id: number) => {
  try {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};

// Staff Management
export const getStaff = async (params?: any) => {
  try {
    const response = await api.get('/staff', { params });
    return response.data.data || response.data || [];
  } catch (error) {
    console.error('Error fetching staff:', error);
    return [];
  }
};

export const getStaffById = async (id: number) => {
  try {
    const response = await api.get(`/staff/${id}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching staff:', error);
    return null;
  }
};

export const createStaff = async (data: any) => {
  try {
    const response = await api.post('/staff', data);
    return response.data;
  } catch (error) {
    console.error('Error creating staff:', error);
    throw error;
  }
};

export const updateStaff = async (id: number, data: any) => {
  try {
    const response = await api.put(`/staff/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating staff:', error);
    throw error;
  }
};

export const deleteStaff = async (id: number) => {
  try {
    const response = await api.delete(`/staff/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting staff:', error);
    throw error;
  }
};

// Analytics & Reports
export const getSystemAnalytics = async () => {
  try {
    const response = await api.get(`${API_BASE}/analytics`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return null;
  }
};

export const getFinanceReport = async (params?: any) => {
  try {
    const response = await api.get(`${API_BASE}/reports/finance`, { params });
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching finance report:', error);
    return null;
  }
};

export const getAttendanceReport = async (params?: any) => {
  try {
    const response = await api.get(`${API_BASE}/reports/attendance`, { params });
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching attendance report:', error);
    return null;
  }
};

export const getPerformanceReport = async (params?: any) => {
  try {
    const response = await api.get(`${API_BASE}/reports/performance`, { params });
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching performance report:', error);
    return null;
  }
};
EOF

echo -e "${GREEN}✅ Created adminAPI.ts${NC}"

# Create studentAPI.ts
echo -e "\n${BLUE}📝 Creating src/services/studentAPI.ts...${NC}"

cat > src/services/studentAPI.ts << 'EOF'
import api from './api';

// ============================================================================
// STUDENT API SERVICE
// Handles all student-related API calls
// ============================================================================

const API_BASE = '/students';

// Student Profile
export const getProfile = async () => {
  try {
    const response = await api.get(`${API_BASE}/profile`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};

export const updateProfile = async (data: any) => {
  try {
    const response = await api.put(`${API_BASE}/profile`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

// Notifications
export const getNotifications = async () => {
  try {
    const response = await api.get(`${API_BASE}/notifications`);
    return response.data.data || response.data || [];
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

export const markNotificationRead = async (id: number) => {
  try {
    const response = await api.put(`${API_BASE}/notifications/${id}/read`);
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

// Payments
export const getPayments = async () => {
  try {
    const response = await api.get(`${API_BASE}/payments`);
    return response.data.data || response.data || [];
  } catch (error) {
    console.error('Error fetching payments:', error);
    return [];
  }
};

export const getPaymentSummary = async () => {
  try {
    const response = await api.get(`${API_BASE}/payments/summary`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching payment summary:', error);
    return null;
  }
};

// Transcript & Grades
export const getTranscript = async () => {
  try {
    const response = await api.get(`${API_BASE}/transcript`);
    return response.data.data || response.data || [];
  } catch (error) {
    console.error('Error fetching transcript:', error);
    return [];
  }
};

export const getGradeSummary = async () => {
  try {
    const response = await api.get(`${API_BASE}/grades/summary`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching grade summary:', error);
    return null;
  }
};

// Surveys
export const getSurveys = async () => {
  try {
    const response = await api.get(`${API_BASE}/surveys`);
    return response.data.data || response.data || [];
  } catch (error) {
    console.error('Error fetching surveys:', error);
    return [];
  }
};

export const submitSurvey = async (surveyId: number, answers: any) => {
  try {
    const response = await api.post(`${API_BASE}/surveys/${surveyId}/submit`, { answers });
    return response.data;
  } catch (error) {
    console.error('Error submitting survey:', error);
    throw error;
  }
};

// Materials
export const getMaterials = async (classId?: number) => {
  try {
    const params = classId ? { class_id: classId } : {};
    const response = await api.get(`${API_BASE}/materials`, { params });
    return response.data.data || response.data || [];
  } catch (error) {
    console.error('Error fetching materials:', error);
    return [];
  }
};

// Schedule
export const getSchedule = async () => {
  try {
    const response = await api.get(`${API_BASE}/schedule`);
    return response.data.data || response.data || [];
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return [];
  }
};

// Videos
export const getVideos = async () => {
  try {
    const response = await api.get(`${API_BASE}/videos`);
    return response.data.data || response.data || [];
  } catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
};
EOF

echo -e "${GREEN}✅ Created studentAPI.ts${NC}"

echo ""
echo -e "${CYAN}════════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Successfully created missing API services!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo -e "  1. Review the generated files: ${BLUE}src/services/adminAPI.ts${NC}"
echo -e "  2. Review the generated files: ${BLUE}src/services/studentAPI.ts${NC}"
echo -e "  3. Update components to use these services"
echo -e "  4. Run: ${BLUE}node scripts/scan-mock-data.mjs${NC} to verify"
echo ""
