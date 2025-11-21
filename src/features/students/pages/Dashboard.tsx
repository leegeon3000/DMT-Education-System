import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { Link } from 'react-router-dom';
import { 
  Hand, 
  Loader2, 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  Award,
  Video,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  BarChart3,
  Target
} from 'lucide-react';
import { reportsAPI } from '../../../services/dmtAPI';
import type { StudentReport } from '../../../services/dmtAPI';
import { SEOHead } from '../../../components/common';

const StatCard: React.FC<{ 
  title: string; 
  value: string | number; 
  hint?: string;
  icon: any;
  color: string;
  trend?: string;
}> = ({ title, value, hint, icon: Icon, color, trend }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    cyan: 'bg-cyan-100 text-cyan-600',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span className="text-xs font-medium text-green-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {trend}
          </span>
        )}
      </div>
      <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {hint && <p className="text-xs text-gray-500 mt-2">{hint}</p>}
    </div>
  );
};

const QuickLink: React.FC<{ 
  to: string; 
  label: string; 
  desc: string;
  icon: any;
  color: string;
}> = ({ to, label, desc, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-100',
    green: 'bg-green-50 text-green-600 group-hover:bg-green-100',
    orange: 'bg-orange-50 text-orange-600 group-hover:bg-orange-100',
    cyan: 'bg-cyan-50 text-cyan-600 group-hover:bg-cyan-100',
  };

  return (
    <Link 
      to={to} 
      className="group bg-white rounded-xl border border-gray-200 p-4 hover:border-green-300 hover:shadow-md transition-all"
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg transition-colors ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">{label}</p>
          <p className="text-xs text-gray-500 mt-1">{desc}</p>
        </div>
        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors" />
      </div>
    </Link>
  );
};

const Dashboard: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<StudentReport | null>(null);
  const [attendanceRate, setAttendanceRate] = useState<number | null>(null);
  const [averageGrade, setAverageGrade] = useState<number | null>(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!user.student_id) {
        setError('Student ID not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch student report
        const reportData = await reportsAPI.getStudentReport(user.student_id);
        setReport(reportData);

        // Fetch attendance rate and average grade
        const [attendanceData, gradeData] = await Promise.all([
          reportsAPI.getAttendanceRate(user.student_id).catch(() => ({ data: { attendance_rate: null } })),
          reportsAPI.getAverageGrade(user.student_id).catch(() => ({ data: { average_grade: null } })),
        ]);

        setAttendanceRate(attendanceData.data?.attendance_rate || null);
        setAverageGrade(gradeData.data?.average_grade || null);
      } catch (err: any) {
        console.error('Error fetching student data:', err);
        setError(err.response?.data?.error || err.message || 'Failed to load student data');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [user.student_id]);

  if (loading) {
    return (
      <>
        <SEOHead title="Dashboard - DMT Education" description="Tổng quan học tập" />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-10 h-10 animate-spin text-green-600 mx-auto mb-3" />
            <span className="text-gray-600">Đang tải dữ liệu...</span>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <SEOHead title="Dashboard - DMT Education" description="Tổng quan học tập" />
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
            <div>
              <p className="text-red-800 font-semibold">Lỗi: {error}</p>
              <p className="text-red-600 text-sm mt-1">Vui lòng thử lại sau hoặc liên hệ quản trị viên.</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  const completedCourses = report?.enrollments?.filter(e => e.status === 'COMPLETED').length || 0;
  const activeCourses = report?.enrollments?.filter(e => e.status === 'ACTIVE').length || 0;
  const pendingAssignments = report?.pending_assignments?.length || 0;

  return (
    <>
      <SEOHead 
        title="Dashboard - DMT Education" 
        description="Tổng quan học tập của học viên"
        keywords="dashboard, học tập, DMT Education"
      />

      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg shadow-red-500/30">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                Xin chào, {user.name || 'Học viên'}! <Hand size={28} className="animate-wave" />
              </h1>
              <p className="mt-2 text-red-100">
                Mã học sinh: <span className="font-semibold text-white">{user.student_code || 'N/A'}</span>
                {report?.student_info && (
                  <> • Cấp học: <span className="font-semibold text-white">{report.student_info.school_level}</span></>
                )}
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                <Calendar className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm font-medium">Hôm nay</p>
                <p className="text-xs text-red-100">{new Date().toLocaleDateString('vi-VN')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Khóa đang học" 
            value={activeCourses} 
            hint={`${completedCourses} khóa đã hoàn thành`}
            icon={BookOpen}
            color="blue"
            trend="+2 khóa mới"
          />
          <StatCard 
            title="Bài tập cần nộp" 
            value={pendingAssignments}
            icon={Target}
            color="orange"
          />
          <StatCard 
            title="Tỷ lệ điểm danh" 
            value={attendanceRate !== null ? `${attendanceRate.toFixed(1)}%` : 'N/A'}
            icon={CheckCircle}
            color="green"
            trend={attendanceRate && attendanceRate > 90 ? 'Xuất sắc' : undefined}
          />
          <StatCard 
            title="Điểm trung bình" 
            value={averageGrade !== null ? averageGrade.toFixed(2) : 'N/A'}
            icon={Award}
            color="cyan"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content - Left Side */}
          <div className="space-y-6 lg:col-span-2">
            {/* Active Classes */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-red-600" />
                  Các lớp học đang tham gia
                </h2>
                <Link to="/students/schedule" className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1">
                  Xem tất cả <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              
              {report?.enrollments && report.enrollments.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {report.enrollments.slice(0, 4).map((enrollment, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:border-red-300 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-500">{enrollment.class_name}</p>
                          <p className="text-sm font-bold text-gray-900 mt-1">{enrollment.course_name}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${
                          enrollment.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                          enrollment.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {enrollment.status === 'ACTIVE' ? 'Đang học' : 
                           enrollment.status === 'COMPLETED' ? 'Hoàn thành' : enrollment.status}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {enrollment.attendance_rate !== undefined && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Điểm danh
                            </span>
                            <span className="font-semibold text-gray-900">{enrollment.attendance_rate.toFixed(0)}%</span>
                          </div>
                        )}
                        {enrollment.average_grade !== undefined && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600 flex items-center gap-1">
                              <Award className="w-3 h-3" />
                              Điểm TB
                            </span>
                            <span className="font-semibold text-gray-900">{enrollment.average_grade.toFixed(2)}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <span className={`text-xs px-2 py-1 rounded font-medium ${
                          enrollment.payment_status === 'PAID' ? 'bg-green-100 text-green-700' :
                          enrollment.payment_status === 'PARTIAL' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {enrollment.payment_status === 'PAID' ? '✓ Đã đóng đủ' :
                           enrollment.payment_status === 'PARTIAL' ? '⚠ Đóng một phần' :
                           '✗ Chưa đóng'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Chưa có lớp học nào</p>
                </div>
              )}
            </div>
            
            {/* Pending Assignments */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  Bài tập cần nộp
                </h2>
              </div>
              
              {report?.pending_assignments && report.pending_assignments.length > 0 ? (
                <ul className="space-y-3">
                  {report.pending_assignments.map((assignment, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-100 rounded-lg hover:border-orange-300 transition-all">
                      <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900">{assignment.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{assignment.class_name}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Hạn: {new Date(assignment.due_date).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      </div>
                      <button className="px-3 py-1 bg-orange-600 text-white text-xs font-medium rounded hover:bg-orange-700 transition-colors flex-shrink-0">
                        Nộp bài
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Không có bài tập nào cần nộp</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar - Right Side */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Liên kết nhanh</h2>
              <div className="space-y-3">
                <QuickLink 
                  to="/students/schedule" 
                  label="Thời khóa biểu" 
                  desc="Xem lịch học cá nhân"
                  icon={Calendar}
                  color="blue"
                />
                <QuickLink 
                  to="/students/videos" 
                  label="Video bài học" 
                  desc="Xem lại buổi học"
                  icon={Video}
                  color="green"
                />
                <QuickLink 
                  to="/students/materials" 
                  label="Tài liệu" 
                  desc="PDF & tài nguyên"
                  icon={FileText}
                  color="orange"
                />
                <QuickLink 
                  to="/students/transcript" 
                  label="Bảng điểm" 
                  desc="Điểm & nhận xét"
                  icon={Award}
                  color="cyan"
                />
              </div>
            </div>
            
            {/* Student Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Thông tin học vụ</h2>
              {report?.student_info && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Tổng số lớp:</span>
                    <span className="font-semibold text-gray-900">{report.student_info.total_enrollments}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Lớp đang học:</span>
                    <span className="font-semibold text-red-600">{report.student_info.active_enrollments}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Email:</span>
                    <span className="font-medium text-xs text-gray-900 break-all">{report.student_info.email}</span>
                  </div>
                  {report.student_info.phone && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-600">Điện thoại:</span>
                      <span className="font-medium text-gray-900">{report.student_info.phone}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Learning Progress */}
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border border-red-200 p-6">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-5 h-5 text-red-600" />
                <h3 className="font-bold text-gray-900">Tiến độ học tập</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">Hoàn thành khóa học</span>
                    <span className="font-semibold text-gray-900">
                      {report?.student_info ? 
                        Math.round((completedCourses / (report.student_info.total_enrollments || 1)) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-white rounded-full h-2">
                    <div 
                      className="bg-red-600 h-2 rounded-full transition-all"
                      style={{ 
                        width: `${report?.student_info ? 
                          Math.round((completedCourses / (report.student_info.total_enrollments || 1)) * 100) : 0}%` 
                      }}
                    />
                  </div>
                </div>
                {attendanceRate !== null && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">Điểm danh</span>
                      <span className="font-semibold text-gray-900">{attendanceRate.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-white rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{ width: `${attendanceRate}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;