import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { SEOHead } from '../../../components/common';
import StatCard from '../../../components/common/StatCard';
import PageHeader from '../../../components/common/PageHeader';
import teacherAPI, { TeacherStats, ClassData, UpcomingSession, PendingSubmission } from '../../../services/teacherAPI';
import { selectCurrentUser } from '../../../store/slices/userSlice';
import { FileText, ClipboardList, Users, Clock, Calendar, AlertTriangle, BookOpen, BarChart, Download, CheckCircle, Plus, Pin, TrendingUp, Award, Target, Activity } from 'lucide-react';

interface DashboardStats {
  totalAssignments: number;
  pendingGrading: number;
  totalStudents: number;
  upcomingDeadlines: number;
}

interface UpcomingDeadline {
  id: string;
  title: string;
  type: string;
  dueDate: string;
  pendingSubmissions: number;
}

interface RecentActivity {
  id: string;
  type: 'submission' | 'graded' | 'created';
  description: string;
  timestamp: string;
}

const TeacherDashboard: React.FC = () => {
  const user = useSelector(selectCurrentUser);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalAssignments: 0,
    pendingGrading: 0,
    totalStudents: 0,
    upcomingDeadlines: 0
  });
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>([]);
  const [pendingSubmissions, setPendingSubmissions] = useState<PendingSubmission[]>([]);

  const [upcomingDeadlines] = useState<UpcomingDeadline[]>([
    {
      id: '1',
      title: 'Kiểm tra Toán học - Chương 3',
      type: 'quiz',
      dueDate: '2025-08-16',
      pendingSubmissions: 5
    },
    {
      id: '2',
      title: 'Bài tập Vật lý - Động học',
      type: 'homework',
      dueDate: '2025-08-18',
      pendingSubmissions: 12
    },
    {
      id: '3',
      title: 'Kiểm tra giữa kỳ Hóa học',
      type: 'midterm',
      dueDate: '2025-08-20',
      pendingSubmissions: 0
    }
  ]);

  const [recentActivities] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'submission',
      description: 'Nguyễn Văn A nộp bài tập Toán học',
      timestamp: '2025-08-14T10:30:00'
    },
    {
      id: '2',
      type: 'graded',
      description: 'Đã chấm xong bài kiểm tra Vật lý cho lớp 10A',
      timestamp: '2025-08-14T09:15:00'
    },
    {
      id: '3',
      type: 'created',
      description: 'Tạo bài tập mới: Phương trình bậc hai',
      timestamp: '2025-08-13T16:45:00'
    }
  ]);

  useEffect(() => {
    const fetchTeacherData = async () => {
      if (!user?.teacher_id) {
        setError('Teacher ID not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch all data in parallel
        const [statsData, classesData, sessionsData, submissionsData] = await Promise.all([
          teacherAPI.getTeachingStats(user.teacher_id).catch(() => null),
          teacherAPI.getMyClasses(user.teacher_id).catch(() => []),
          teacherAPI.getUpcomingSessions(user.teacher_id, 7).catch(() => []),
          teacherAPI.getPendingGrading(user.teacher_id).catch(() => []),
        ]);

        // Update stats from API
        if (statsData) {
          setStats({
            totalAssignments: 12, // TODO: Add to API
            pendingGrading: statsData.pendingGrading || 0,
            totalStudents: statsData.totalStudents || 0,
            upcomingDeadlines: sessionsData.length || 0,
          });
        }

        setClasses(classesData);
        setUpcomingSessions(sessionsData);
        setPendingSubmissions(submissionsData);
      } catch (err: any) {
        console.error('Error fetching teacher data:', err);
        setError(err.response?.data?.error || err.message || 'Failed to load teacher data');
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [user?.teacher_id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN');
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'submission': return <Download size={16} />;
      case 'graded': return <CheckCircle size={16} />;
      case 'created': return <Plus size={16} />;
      default: return <Pin size={16} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'midterm': return 'bg-red-100 text-red-700';
      case 'quiz': return 'bg-blue-100 text-blue-700';
      case 'homework': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <>
        <SEOHead title="Dashboard Giáo viên - DMT Education" />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-gray-200 border-t-red-500 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Đang tải dữ liệu...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <SEOHead title="Dashboard Giáo viên - DMT Education" />
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
            <div>
              <p className="text-red-800 font-semibold">Lỗi: {error}</p>
              <p className="text-red-600 text-sm mt-1">Vui lòng thử lại sau hoặc liên hệ quản trị viên.</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead 
        title="Dashboard Giáo viên - DMT Education"
        description="Dashboard quản lý giảng dạy cho giáo viên"
        keywords="giáo viên, dashboard, quản lý, bài tập, chấm điểm"
      />
      
      {/* Modern Background */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-red-50/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-2">
                  Chào mừng trở lại, Thầy/Cô! 👋
                </h1>
                <p className="text-gray-600">
                  Hôm nay là {formatDate(new Date().toISOString())} - Chúc bạn một ngày làm việc hiệu quả!
                </p>
              </div>
              <div className="hidden md:flex gap-3">
                <Link
                  to="/teacher/assignments/create"
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Plus size={20} />
                  Tạo bài tập mới
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Modern Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Tổng bài tập</p>
                    <h3 className="text-3xl font-bold text-gray-900">{stats.totalAssignments}</h3>
                    <p className="text-xs text-gray-500 mt-1">Đang hoạt động</p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp size={16} className="mr-1" />
                  <span>+12% so với tháng trước</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Cần chấm điểm</p>
                    <h3 className="text-3xl font-bold text-red-600">{stats.pendingGrading}</h3>
                    <p className="text-xs text-gray-500 mt-1">Bài nộp mới</p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-lg">
                    <ClipboardList className="w-6 h-6 text-white" />
                  </div>
                </div>
                <Link
                  to="/teacher/grading"
                  className="text-sm text-red-600 hover:text-red-700 font-medium inline-flex items-center"
                >
                  Chấm điểm ngay →
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Tổng học sinh</p>
                    <h3 className="text-3xl font-bold text-gray-900">{stats.totalStudents}</h3>
                    <p className="text-xs text-gray-500 mt-1">Đang học</p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <Award size={16} className="mr-1" />
                  <span>Điểm TB: 8.5/10</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Deadline sắp tới</p>
                    <h3 className="text-3xl font-bold text-orange-600">{stats.upcomingDeadlines}</h3>
                    <p className="text-xs text-gray-500 mt-1">Trong 7 ngày</p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center text-sm text-orange-600">
                  <AlertTriangle size={16} className="mr-1" />
                  <span>Cần theo dõi</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upcoming Deadlines - 2 columns */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-2"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-red-600" />
                    Deadline sắp tới
                  </h2>
                  <Link
                    to="/teacher/assignments"
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Xem tất cả →
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {upcomingDeadlines.map((deadline, index) => (
                    <motion.div
                      key={deadline.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:shadow-md transition-all"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">
                            {deadline.title}
                          </h3>
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(deadline.type)}`}>
                              {deadline.type === 'quiz' ? 'Kiểm tra' : 
                               deadline.type === 'homework' ? 'Bài tập' : 
                               deadline.type === 'midterm' ? 'Giữa kỳ' : 'Cuối kỳ'}
                            </span>
                            <span className="text-sm text-gray-600 flex items-center gap-1">
                              <Calendar size={14} />
                              {formatDate(deadline.dueDate)}
                            </span>
                          </div>
                          {deadline.pendingSubmissions > 0 && (
                            <div className="mt-2 flex items-center gap-1 text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded-md inline-flex">
                              <AlertTriangle size={14} />
                              <span>{deadline.pendingSubmissions} bài chưa nộp</span>
                            </div>
                          )}
                        </div>
                        <button className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          Xem chi tiết
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Recent Activities - 1 column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-red-600" />
                  Hoạt động gần đây
                </h2>
                
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0"
                    >
                      <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 font-medium mb-1">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDateTime(activity.timestamp)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-red-600" />
              Thao tác nhanh
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { to: '/teacher/assignments', icon: FileText, label: 'Tạo bài tập mới', color: 'from-blue-500 to-blue-600' },
                { to: '/teacher/grading', icon: ClipboardList, label: 'Chấm điểm', color: 'from-red-500 to-red-600' },
                { to: '/teacher/materials', icon: BookOpen, label: 'Upload tài liệu', color: 'from-green-500 to-green-600' },
                { to: '/teacher/reports', icon: BarChart, label: 'Xem báo cáo', color: 'from-purple-500 to-purple-600' }
              ].map((action, index) => (
                <Link
                  key={action.to}
                  to={action.to}
                  className="group"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 + index * 0.05 }}
                    className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all text-center"
                  >
                    <div className={`w-12 h-12 mx-auto mb-3 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-900 group-hover:text-red-600 transition-colors">
                      {action.label}
                    </span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default TeacherDashboard;
