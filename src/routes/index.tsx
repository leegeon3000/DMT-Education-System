import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import CoursesPage from '../pages/CoursesPage';
import TeachersPage from '../pages/TeachersPage';
import TeachersListPage from '../pages/TeachersListPage';
import TeacherDetailPage from '../pages/TeacherDetailPage';
import SchedulePage from '../pages/SchedulePage';
import AnnouncementPage from '../pages/AnnouncementPage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import Login from '../features/auth/pages/Login';
import UnauthorizedPage from '../pages/UnauthorizedPage';

// Layout
import AdminLayout from '../components/admin/AdminLayout';
import StudentLayout from '../components/layout/StudentLayout';
import TeacherLayout from '../components/layout/TeacherLayout';
import StaffLayout from '../components/layout/StaffLayout';

// Guards
import ProtectedRoute from '../components/common/ProtectedRoute';
import { Role } from '../types';

// Student Pages
import StudentDashboard from '../features/students/pages/Dashboard';
import StudentSchedule from '../features/students/pages/Schedule';
import StudentVideos from '../features/students/pages/Videos';
import StudentMaterials from '../features/students/pages/Materials';
import StudentTranscript from '../features/students/pages/Transcript';
import StudentPayments from '../features/students/pages/Payments';
import StudentSurveys from '../features/students/pages/Surveys';
import StudentNotifications from '../features/students/pages/Notifications';

// Teacher Pages - NEW UI
import TeacherDashboard from '../pages/teacher/TeacherDashboard';
import MyClasses from '../pages/teacher/MyClasses';
import TeacherAssignments from '../pages/teacher/Assignments';
import TeacherGrading from '../pages/teacher/Grading';
import TeacherAttendance from '../pages/teacher/Attendance';
import TeacherMaterials from '../pages/teacher/Materials';
// Old teacher pages (keep for compatibility)
import TeacherSurveys from '../features/teachers/pages/Surveys';
import TeacherTimesheet from '../features/teachers/pages/Timesheet';
import TeacherCalendar from '../features/teachers/pages/Calendar';
import TeacherReports from '../features/teachers/pages/Reports';

// Staff Pages (NEW)
import StaffDashboard from '../features/staff/pages/Dashboard';
import StudentRegistration from '../features/staff/pages/StudentRegistration';
import StaffStudentsManagement from '../features/staff/pages/StudentsManagement';
import PaymentProcessing from '../features/staff/pages/PaymentProcessing';
import PaymentHistory from '../features/staff/pages/PaymentHistory';
import EnrollmentsManagement from '../features/staff/pages/EnrollmentsManagement';
import EnrollmentCreate from '../features/staff/pages/EnrollmentCreate';
import StaffSchedule from '../features/staff/pages/Schedule';
import StaffSupport from '../features/staff/pages/Support';
import StaffTasks from '../features/staff/pages/Tasks';
import StaffTickets from '../features/staff/pages/Tickets';
import StaffClasses from '../features/staff/pages/Classes';
import StaffReports from '../features/staff/pages/Reports';

// Admin Pages
import AdminDashboard from '../features/admin/pages/Dashboard';
import AdminStudentsManagement from '../features/admin/pages/Students';
import CoursesManagement from '../features/admin/pages/Courses';
import TeachersManagement from '../features/admin/pages/Teachers';
import StaffManagement from '../features/admin/pages/Staff';
import ClassesManagement from '../features/admin/pages/Classes';
import ScheduleManagement from '../features/admin/pages/Schedule';
import PaymentsManagement from '../features/admin/pages/Payments';
import AttendanceReport from '../features/admin/pages/AttendanceReport';
import PerformanceReport from '../features/admin/pages/PerformanceReport';
import Analytics from '../features/admin/pages/Analytics';
import Roles from '../features/admin/pages/Roles';
import Settings from '../features/admin/pages/Settings';
import Notifications from '../features/admin/pages/Notifications';
import FinanceReport from '../features/admin/pages/FinanceReport';
import BackupRestore from '../features/admin/pages/BackupRestore';

// New notification page
import NotificationsPage from '../pages/NotificationsPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/courses" element={<CoursesPage />} />
      <Route path="/teachers" element={<TeachersPage />} />
      <Route path="/teachers/list" element={<TeachersListPage />} />
      <Route path="/teachers/:id" element={<TeacherDetailPage />} />
      <Route path="/schedule" element={<SchedulePage />} />
      <Route path="/announcements" element={<AnnouncementPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/auth/login" element={<Login />} />

      {/* Student Routes - Protected */}
      <Route 
        path="/students" 
        element={
          <ProtectedRoute allowedRoles={[Role.STUDENT]} fallbackPath="/auth/login">
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/students/dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="schedule" element={<StudentSchedule />} />
        <Route path="videos" element={<StudentVideos />} />
        <Route path="materials" element={<StudentMaterials />} />
        <Route path="transcript" element={<StudentTranscript />} />
        <Route path="payments" element={<StudentPayments />} />
        <Route path="surveys" element={<StudentSurveys />} />
        <Route path="notifications" element={<StudentNotifications />} />
      </Route>

      {/* Teacher Routes - Protected */}
      <Route 
        path="/teacher" 
        element={
          <ProtectedRoute allowedRoles={[Role.TEACHER]} fallbackPath="/auth/login">
            <TeacherLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/teacher/dashboard" replace />} />
        <Route path="dashboard" element={<TeacherDashboard />} />
        <Route path="classes" element={<MyClasses />} />
        <Route path="assignments" element={<TeacherAssignments />} />
        <Route path="grading" element={<TeacherGrading />} />
        <Route path="grading/:assignmentId" element={<TeacherGrading />} />
        <Route path="attendance" element={<TeacherAttendance />} />
        <Route path="materials" element={<TeacherMaterials />} />
        <Route path="surveys" element={<TeacherSurveys />} />
        <Route path="timesheet" element={<TeacherTimesheet />} />
        <Route path="calendar" element={<TeacherCalendar />} />
        <Route path="reports" element={<TeacherReports />} />
      </Route>

      {/* Admin Routes - Protected */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute allowedRoles={[Role.ADMIN]} fallbackPath="/auth/login">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users/students" element={<AdminStudentsManagement />} />
        <Route path="users/teachers" element={<TeachersManagement />} />
        <Route path="users/staff" element={<StaffManagement />} />
        <Route path="courses" element={<CoursesManagement />} />
        <Route path="classes" element={<ClassesManagement />} />
        <Route path="schedule" element={<ScheduleManagement />} />
        <Route path="payments" element={<PaymentsManagement />} />
        <Route path="reports/attendance" element={<AttendanceReport />} />
        <Route path="reports/performance" element={<PerformanceReport />} />
        <Route path="reports/finance" element={<FinanceReport />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="surveys" element={<div>Quản lý khảo sát</div>} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="roles" element={<Roles />} />
        <Route path="backup" element={<BackupRestore />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Staff Routes - Protected */}
      <Route 
        path="/staff" 
        element={
          <ProtectedRoute allowedRoles={[Role.STAFF]} fallbackPath="/auth/login">
            <StaffLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/staff/dashboard" replace />} />
        <Route path="dashboard" element={<StaffDashboard />} />
        <Route path="students" element={<StaffStudentsManagement />} />
        <Route path="students/register" element={<StudentRegistration />} />
        <Route path="payments" element={<PaymentHistory />} />
        <Route path="payments/process" element={<PaymentProcessing />} />
        <Route path="enrollments" element={<EnrollmentsManagement />} />
        <Route path="enrollments/create" element={<EnrollmentCreate />} />
        <Route path="classes" element={<StaffClasses />} />
        <Route path="schedule" element={<StaffSchedule />} />
        <Route path="support" element={<StaffSupport />} />
        <Route path="tasks" element={<StaffTasks />} />
        <Route path="tickets" element={<StaffTickets />} />
        <Route path="reports" element={<StaffReports />} />
      </Route>

      {/* Unauthorized Page */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route
        path="*"
        element={
          <div
            style={{
              padding: '2rem',
              textAlign: 'center',
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
              Không tìm thấy trang
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              Liên kết bạn truy cập không tồn tại.
            </p>
            <a
              href="/home"
              style={{
                color: '#6366f1',
                textDecoration: 'underline',
                fontSize: '1.1rem',
              }}
            >
              Quay lại trang chủ
            </a>
          </div>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
