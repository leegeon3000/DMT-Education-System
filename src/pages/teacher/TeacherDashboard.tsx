import React, { useState, useEffect } from 'react';
import TeacherDashboardStats from '../../components/teacher/dashboard/TeacherDashboardStats';
import TeacherDashboardCharts from '../../components/teacher/dashboard/TeacherDashboardCharts';
import TeacherUpcomingDeadlines from '../../components/teacher/dashboard/TeacherUpcomingDeadlines';
import TeacherRecentActivity from '../../components/teacher/dashboard/TeacherRecentActivity';
import TeacherQuickActions from '../../components/teacher/dashboard/TeacherQuickActions';
import { useNavigate } from 'react-router-dom';

const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Mock data - Replace with API calls
  const stats = {
    totalStudents: 142,
    activeClasses: 5,
    pendingAssignments: 23,
    attendanceRate: 92
  };

  const attendanceData = [
    { date: '2/1', present: 28, absent: 2 },
    { date: '3/1', present: 30, absent: 0 },
    { date: '4/1', present: 27, absent: 3 },
    { date: '5/1', present: 29, absent: 1 },
    { date: '6/1', present: 30, absent: 0 },
    { date: '7/1', present: 28, absent: 2 },
    { date: '8/1', present: 29, absent: 1 }
  ];

  const gradeDistribution = [
    { grade: 'A (9-10)', count: 35 },
    { grade: 'B (7-8.9)', count: 58 },
    { grade: 'C (5-6.9)', count: 32 },
    { grade: 'D (4-4.9)', count: 12 },
    { grade: 'F (<4)', count: 5 }
  ];

  const weeklyActivity = [
    { day: 'Thứ 2', assignments: 4, materials: 2 },
    { day: 'Thứ 3', assignments: 3, materials: 5 },
    { day: 'Thứ 4', assignments: 6, materials: 3 },
    { day: 'Thứ 5', assignments: 2, materials: 4 },
    { day: 'Thứ 6', assignments: 5, materials: 2 },
    { day: 'Thứ 7', assignments: 1, materials: 1 },
    { day: 'CN', assignments: 0, materials: 0 }
  ];

  const deadlines = [
    {
      id: '1',
      type: 'assignment' as const,
      title: 'Bài tập tuần 5 - React Hooks',
      className: 'Lớp ReactJS Nâng cao',
      dueDate: new Date().toISOString(),
      dueTime: '23:59',
      status: 'today' as const,
      submissionCount: 18,
      totalStudents: 30
    },
    {
      id: '2',
      type: 'exam' as const,
      title: 'Kiểm tra giữa kỳ',
      className: 'Lớp JavaScript Cơ bản',
      dueDate: new Date(Date.now() + 86400000).toISOString(),
      dueTime: '14:00',
      status: 'upcoming' as const,
      submissionCount: 0,
      totalStudents: 25
    },
    {
      id: '3',
      type: 'assignment' as const,
      title: 'Project cuối khóa',
      className: 'Lớp Web Development',
      dueDate: new Date(Date.now() - 86400000).toISOString(),
      status: 'overdue' as const,
      submissionCount: 20,
      totalStudents: 28
    }
  ];

  const activities = [
    {
      id: '1',
      type: 'submission' as const,
      title: 'Bài tập mới được nộp',
      description: 'Bài tập tuần 5 - React Hooks',
      studentName: 'Nguyễn Văn A',
      className: 'ReactJS Nâng cao',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      status: 'info' as const
    },
    {
      id: '2',
      type: 'comment' as const,
      title: 'Bình luận mới',
      description: 'Học sinh đặt câu hỏi về useEffect',
      studentName: 'Trần Thị B',
      className: 'ReactJS Nâng cao',
      timestamp: new Date(Date.now() - 1800000).toISOString()
    },
    {
      id: '3',
      type: 'grade' as const,
      title: 'Đã chấm bài',
      description: 'Bài kiểm tra tuần 4',
      className: 'JavaScript Cơ bản',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: 'success' as const
    },
    {
      id: '4',
      type: 'attendance' as const,
      title: 'Điểm danh hoàn tất',
      description: 'Buổi học ngày 08/01/2025',
      className: 'Web Development',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      status: 'success' as const
    }
  ];

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Chào mừng trở lại, Giáo viên! 👋</h1>
        <p className="text-blue-100">
          Hôm nay là {new Date().toLocaleDateString('vi-VN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Stats Cards */}
      <TeacherDashboardStats stats={stats} loading={loading} />

      {/* Quick Actions */}
      <TeacherQuickActions
        onCreateAssignment={() => navigate('/teacher/assignments/create')}
        onUploadMaterial={() => navigate('/teacher/materials/upload')}
        onMarkAttendance={() => navigate('/teacher/attendance')}
        onScheduleClass={() => navigate('/teacher/calendar')}
        onGradeSubmissions={() => navigate('/teacher/grading')}
        onViewReports={() => navigate('/teacher/reports')}
      />

      {/* Charts */}
      <TeacherDashboardCharts
        attendanceData={attendanceData}
        gradeDistribution={gradeDistribution}
        weeklyActivity={weeklyActivity}
        loading={loading}
      />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TeacherUpcomingDeadlines
          deadlines={deadlines}
          loading={loading}
          onViewAll={() => navigate('/teacher/assignments')}
        />
        
        <TeacherRecentActivity
          activities={activities}
          loading={loading}
          onViewAll={() => navigate('/teacher/activity')}
        />
      </div>
    </div>
  );
};

export default TeacherDashboard;
