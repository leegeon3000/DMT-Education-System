import React, { useEffect, useState } from 'react';
import { adminService } from '../../../services/admin';
import Spinner from '../../../components/common/Spinner';
import { reportsAPI } from '../../../services/dmtAPI';
import { 
  BarChart3, 
  Users, 
  BookOpen, 
  Calendar, 
  CreditCard, 
  TrendingUp, 
  UserCheck,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  Bell
} from 'lucide-react';
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface StatCardProps { 
  title: string; 
  value: string | number; 
  icon: React.ReactElement;
  change?: number;
  sub?: string; 
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, change, sub }) => {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          {(change || sub) && (
            <div className="mt-2 flex items-center">
              {change !== undefined && (
                <span className={`flex items-center text-sm ${
                  isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {isPositive && <ArrowUpRight size={16} className="mr-1" />}
                  {isNegative && <ArrowDownRight size={16} className="mr-1" />}
                  {Math.abs(change)}%
                </span>
              )}
              {sub && <span className="text-sm text-gray-500 ml-2">{sub}</span>}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${
          title.includes('Học sinh') ? 'bg-blue-50 text-blue-600' : 
          title.includes('Giáo viên') ? 'bg-red-50 text-red-600' : 
          title.includes('Khóa học') ? 'bg-amber-50 text-amber-600' : 
          title.includes('Doanh thu') ? 'bg-emerald-50 text-emerald-600' :
          'bg-gray-50 text-gray-600'
        }`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const ChartCard: React.FC<{ 
  title: string; 
  children: React.ReactNode; 
  viewAll?: string;
  className?: string;
}> = ({ title, children, viewAll, className }) => (
  <div className={`bg-white rounded-xl border border-gray-200 p-6 shadow-sm ${className}`}>
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {viewAll && (
        <a href={viewAll} className="text-sm font-medium text-primary-600 hover:text-primary-700">
          Xem tất cả
        </a>
      )}
    </div>
    {children}
  </div>
);

// Bar chart component
const BarChart: React.FC<{ data: number[]; labels: string[] }> = ({ data, labels }) => {
  const max = Math.max(...data);
  
  return (
    <div className="w-full">
      <div className="grid grid-cols-7 gap-2 h-44">
        {data.map((value, idx) => (
          <div key={idx} className="flex flex-col items-center justify-end">
            <div className="w-full rounded-t-sm bg-primary-100 relative overflow-hidden">
              <div 
                className="absolute bottom-0 w-full bg-primary-500 transition-all duration-700"
                style={{ height: `${(value / max) * 100}%`, animationDelay: `${idx * 100}ms` }}
              />
              <div className="h-32 w-full"></div>
            </div>
            <span className="text-xs text-gray-600 mt-2">{labels[idx]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Line chart component
const LineChart: React.FC<{ data: number[]; labels: string[] }> = ({ data, labels }) => {
  const max = Math.max(...data) * 1.2; // Add some padding at the top
  const min = Math.min(0, ...data) * 0.9; // Add some padding at the bottom if negative
  const range = max - min;
  
  // Convert data points to SVG coordinates
  const points = data.map((value, idx) => {
    const x = (idx / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <div className="w-full h-44">
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        {/* Horizontal grid lines */}
        {[0, 25, 50, 75, 100].map((y) => (
          <line 
            key={y} 
            x1="0" 
            y1={y} 
            x2="100" 
            y2={y} 
            stroke="#f1f5f9" 
            strokeWidth="1"
          />
        ))}
        
        {/* Data line */}
        <polyline
          points={points}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Data points */}
        {data.map((value, idx) => {
          const x = (idx / (data.length - 1)) * 100;
          const y = 100 - ((value - min) / range) * 100;
          return (
            <circle
              key={idx}
              cx={x}
              cy={y}
              r="2"
              fill="#3b82f6"
              stroke="#ffffff"
              strokeWidth="1"
            />
          );
        })}
        
        {/* Fill area under the curve */}
        <polygon
          points={`${points} 100,100 0,100`}
          fill="url(#blue-gradient)"
          fillOpacity="0.2"
        />
        
        {/* Define gradient */}
        <defs>
          <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* X-axis labels */}
      <div className="grid grid-cols-7 gap-2 mt-2">
        {labels.map((label, idx) => (
          <div key={idx} className="text-xs text-gray-500 text-center truncate">
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};

// Activity item component
interface ActivityItem {
  id: string | number;
  text: string;
  time: string;
  type?: 'info' | 'warning' | 'success' | 'error';
}

const ActivityCard: React.FC<{ activity: ActivityItem }> = ({ activity }) => {
  const iconMap = {
    info: <Bell size={14} className="text-blue-600" />,
    warning: <AlertCircle size={14} className="text-amber-600" />,
    success: <UserCheck size={14} className="text-green-600" />,
    error: <AlertCircle size={14} className="text-red-600" />,
  };

  const icon = iconMap[activity.type || 'info'];

  return (
    <div className="flex items-start gap-3 py-3">
      <div className="rounded-full p-1 bg-gray-100">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-700">{activity.text}</p>
        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true); 
      setError(null);
      try {
        // PHASE A: Call getSystemOverview() API
        const overviewData = await reportsAPI.getSystemOverview();
        
        // PHASE B: Call getRevenue(2025) API
        const revenue2025 = await reportsAPI.getRevenue(2025);
        
        // PHASE C: Get recent enrollments for activity feed
        const recentEnrollmentsData = await reportsAPI.getRecentEnrollments(7);
        
        // PHASE D: Get top courses by enrollment
        const topCoursesData = await reportsAPI.getTopCourses(5);
        
        // Format revenue data for Recharts
        const monthNames = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
        const formattedRevenue = (revenue2025?.monthly_revenue || []).map((item) => ({
          month: monthNames[item.month - 1],
          revenue: item.revenue,
          revenueFormatted: new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
          }).format(item.revenue)
        }));
        
        setRevenueData(formattedRevenue);
        
        // Generate week signups data from recent enrollments
        const now = new Date();
        const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
        const weekSignups = Array(7).fill(0);
        const weekLabels = Array(7).fill('').map((_, i) => {
          const d = new Date(now);
          d.setDate(d.getDate() - (6 - i));
          return weekDays[d.getDay()];
        });
        
        // Count enrollments by day
        if (recentEnrollmentsData?.data) {
          recentEnrollmentsData.data.forEach((enrollment: any) => {
            const enrollDate = new Date(enrollment.enrollment_date || enrollment.created_at);
            const daysDiff = Math.floor((now.getTime() - enrollDate.getTime()) / (1000 * 60 * 60 * 24));
            if (daysDiff >= 0 && daysDiff < 7) {
              weekSignups[6 - daysDiff]++;
            }
          });
        }
        
        // Format top courses for display
        const newEnrollments = (topCoursesData?.data || []).slice(0, 5).map((cls: any) => ({
          course: cls.name || cls.class_name,
          count: cls.current_students || 0
        }));
        
        // Generate activity feed from real data
        const recentActivities: ActivityItem[] = [];
        if (recentEnrollmentsData?.data) {
          recentEnrollmentsData.data.slice(0, 6).forEach((enrollment: any, idx: number) => {
            const timeAgo = getTimeAgo(enrollment.enrollment_date || enrollment.created_at);
            recentActivities.push({
              id: enrollment.id,
              text: `Học sinh ${enrollment.student_name || 'Unknown'} đăng ký ${enrollment.class_name || enrollment.course_name || 'khóa học'}`,
              time: timeAgo,
              type: 'success'
            });
          });
        }
        
        // Calculate changes (mock for now - can add previous month data later)
        const studentChange = 12.5;
        const teacherChange = 8.3;
        const courseChange = 15.2;
        const revenueChange = 23.4;
        
        // Map API data to state
        setStats({
          totalStudents: overviewData.total_students || 0,
          totalTeachers: overviewData.total_teachers || 0,
          totalCourses: overviewData.active_classes || 0,
          monthRevenue: new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
          }).format(overviewData.revenue_this_month || overviewData.revenue_this_year || 0),
          pendingPayments: overviewData.pending_payments || 0,
          attendanceRate: 95.2, // Will add this to stored procedure later
          studentChange,
          teacherChange,
          courseChange,
          revenueChange,
          weekSignups: weekSignups.length > 0 ? weekSignups : [0, 0, 0, 0, 0, 0, 0],
          weekLabels,
          recentActivities: recentActivities.length > 0 ? recentActivities : [
            { id: 1, text: 'Chưa có hoạt động gần đây', time: 'Bây giờ', type: 'info' }
          ],
          newEnrollments: newEnrollments.length > 0 ? newEnrollments : [
            { course: 'Chưa có dữ liệu', count: 0 }
          ],
          upcomingEvents: [
            { title: 'Họp phụ huynh Toán 9A', time: '24/11 - 18:00', location: 'Phòng 305' },
            { title: 'Workshop Kỹ năng học tập', time: '25/11 - 14:30', location: 'Phòng Đa năng' },
            { title: 'Thi thử Tiếng Anh', time: '26/11 - 08:00', location: 'Phòng 201-204' },
            { title: 'Khai giảng lớp Lý 12', time: '27/11 - 19:00', location: 'Phòng 102' },
          ]
        });
        setLoading(false);
      } catch (e: any) {
        console.error('Error loading admin dashboard:', e);
        
        // Check if it's an authentication/authorization error
        if (e.response?.status === 401 || e.response?.status === 403) {
          setError('Bạn không có quyền truy cập trang này. Vui lòng đăng nhập với tài khoản Admin.');
        } else if (e.response?.status === 400) {
          setError('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.');
        } else {
          setError(e?.response?.data?.error || e?.message || 'Không thể tải dữ liệu. Vui lòng thử lại sau.');
        }
        
        setLoading(false);
      }
    };
    
    load();
  }, []);
  
  // Helper function to calculate time ago
  const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Vừa xong';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} phút trước`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} giờ trước`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <Spinner size={40} />
        <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-red-600">
        <AlertCircle size={48} />
        <p className="mt-4">{error}</p>
        <button 
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          onClick={() => window.location.reload()}
        >
          Tải lại trang
        </button>
      </div>
    );
  }

  const s = stats || {};

  return (
    <div className="max-w-[1500px] mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Bảng điều khiển</h1>
        <p className="mt-1 text-gray-600">Xem nhanh tổng quan về hoạt động của trung tâm.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 mb-8">
        <StatCard 
          title="Tổng số học sinh" 
          value={s.totalStudents || 0} 
          icon={<Users size={24} />}
          change={s.studentChange}
          sub="So với tháng trước"
        />
        
        <StatCard 
          title="Tổng số giáo viên" 
          value={s.totalTeachers || 0} 
          icon={<UserCheck size={24} />}
          change={s.teacherChange}
          sub="So với tháng trước"
        />
        
        <StatCard 
          title="Tổng số khóa học" 
          value={s.totalCourses || 0} 
          icon={<BookOpen size={24} />}
          change={s.courseChange}
          sub="So với tháng trước"
        />
        
        <StatCard 
          title="Doanh thu tháng" 
          value={s.monthRevenue || 0} 
          icon={<CreditCard size={24} />}
          change={s.revenueChange}
          sub="So với tháng trước"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartCard title="Học sinh đăng ký (7 ngày qua)">
          <BarChart 
            data={s.weekSignups || [0, 0, 0, 0, 0, 0, 0]} 
            labels={s.weekLabels || ['', '', '', '', '', '', '']} 
          />
        </ChartCard>
        
        <ChartCard title="Doanh thu năm 2025 (theo tháng)">
          <ResponsiveContainer width="100%" height={200}>
            <RechartsBarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: '#666', fontSize: 12 }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#666', fontSize: 12 }}
                tickLine={false}
                tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
              />
              <Tooltip 
                formatter={(value: any) => new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(value)}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Bar 
                dataKey="revenue" 
                fill="#3b82f6" 
                radius={[8, 8, 0, 0]}
                name="Doanh thu"
              />
            </RechartsBarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Additional stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <ChartCard title="Tỷ lệ điểm danh" className="lg:col-span-1">
          <div className="flex flex-col items-center justify-center h-[160px]">
            <div className="relative flex items-center justify-center w-32 h-32">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="10"
                />
                
                {/* Progress arc */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#4ade80"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${s.attendanceRate ? (s.attendanceRate / 100) * 251.2 : 0} 251.2`}
                  strokeDashoffset="62.8" // 251.2 / 4 to start at the top
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-900">{s.attendanceRate || 0}%</span>
                <span className="text-xs text-gray-500">Điểm danh</span>
              </div>
            </div>
          </div>
        </ChartCard>
        
        <ChartCard title="Top khóa học đăng ký mới" viewAll="/admin/courses" className="lg:col-span-1">
          <div className="space-y-3">
            {(s.newEnrollments || []).map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="text-sm text-gray-700 truncate max-w-[70%]">{item.course}</span>
                <div className="flex items-center gap-2">
                  <div className="bg-primary-100 h-2 rounded-full w-16">
                    <div 
                      className="bg-primary-500 h-2 rounded-full" 
                      style={{ 
                        width: `${(item.count / Math.max(...(s.newEnrollments || []).map((i: any) => i.count))) * 100}%` 
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
        
        <ChartCard title="Sự kiện sắp tới" viewAll="/admin/schedule" className="lg:col-span-1">
          <div className="space-y-3">
            {(s.upcomingEvents || []).map((event: any, idx: number) => (
              <div key={idx} className="flex gap-3 items-start">
                <div className="bg-primary-50 text-primary-700 p-2 rounded text-xs font-medium flex flex-col items-center min-w-[50px]">
                  <span>{event.time.split(' - ')[0]}</span>
                  <span>{event.time.split(' - ')[1]}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{event.title}</p>
                  <p className="text-xs text-gray-500">{event.location}</p>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Recent activities */}
      <ChartCard title="Hoạt động gần đây" viewAll="/admin/activities">
        <div className="divide-y divide-gray-100">
          {(s.recentActivities || []).map((activity: ActivityItem) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      </ChartCard>
    </div>
  );
};

export default AdminDashboard;