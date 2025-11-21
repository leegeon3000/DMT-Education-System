import React, { useState, useEffect } from 'react';
import { BarChart3, Users, BookOpen, DollarSign, Calendar, TrendingUp, Bell, Settings } from 'lucide-react';
import adminService from '../../services/admin';
import DashboardStats from './components/DashboardStats';
import DashboardCharts from './components/DashboardCharts';
import RecentActivity from './components/RecentActivity';
import QuickActions from './components/QuickActions';

interface DashboardData {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalClasses: number;
  monthlyRevenue: number;
  attendanceRate: number;
  newEnrollments: number;
  activeClasses: number;
  recentTransactions: any[];
  studentTrends: any[];
  revenueTrends: any[];
  coursesDistribution: any[];
}

const AdminDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalStudents: 0,
    totalTeachers: 0,
    totalCourses: 0,
    totalClasses: 0,
    monthlyRevenue: 0,
    attendanceRate: 0,
    newEnrollments: 0,
    activeClasses: 0,
    recentTransactions: [],
    studentTrends: [],
    revenueTrends: [],
    coursesDistribution: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    fetchDashboardData();
  }, [selectedPeriod]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, userTrendsResponse, revenueTrendsResponse] = await Promise.all([
        adminService.dashboardStats(),
        adminService.trendUsers(selectedPeriod),
        adminService.trendRevenue(selectedPeriod)
      ]);

      setDashboardData({
        ...statsResponse.data,
        studentTrends: userTrendsResponse.data,
        revenueTrends: revenueTrendsResponse.data
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set mock data for development
      setDashboardData({
        totalStudents: 245,
        totalTeachers: 18,
        totalCourses: 12,
        totalClasses: 35,
        monthlyRevenue: 125000000,
        attendanceRate: 87.5,
        newEnrollments: 23,
        activeClasses: 28,
        recentTransactions: [
          { id: '1', student: 'Nguyễn Văn A', amount: 2500000, course: 'IELTS 6.5', date: '2025-09-03' },
          { id: '2', student: 'Trần Thị B', amount: 3000000, course: 'TOEIC 800+', date: '2025-09-02' },
          { id: '3', student: 'Lê Văn C', amount: 2000000, course: 'Giao tiếp cơ bản', date: '2025-09-01' }
        ],
        studentTrends: [
          { month: 'T1', students: 180 },
          { month: 'T2', students: 195 },
          { month: 'T3', students: 210 },
          { month: 'T4', students: 225 },
          { month: 'T5', students: 235 },
          { month: 'T6', students: 245 }
        ],
        revenueTrends: [
          { month: 'T1', revenue: 85000000 },
          { month: 'T2', revenue: 92000000 },
          { month: 'T3', revenue: 105000000 },
          { month: 'T4', revenue: 118000000 },
          { month: 'T5', revenue: 125000000 },
          { month: 'T6', revenue: 135000000 }
        ],
        coursesDistribution: [
          { name: 'IELTS', value: 35, color: '#3B82F6' },
          { name: 'TOEIC', value: 25, color: '#10B981' },
          { name: 'Giao tiếp', value: 20, color: '#F59E0B' },
          { name: 'Business English', value: 15, color: '#EF4444' },
          { name: 'Khác', value: 5, color: '#dc2626' }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Dashboard Quản Lý
          </h1>
          <p className="text-gray-600 mt-2 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            Tổng quan hoạt động trung tâm DMT
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:border-gray-300 transition-colors"
          >
            <option value="week">📅 7 ngày qua</option>
            <option value="month">📅 30 ngày qua</option>
            <option value="quarter">📅 3 tháng qua</option>
            <option value="year">📅 12 tháng qua</option>
          </select>
          <button className="flex items-center px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all shadow-md">
            <Settings className="w-4 h-4 mr-2" />
            Cài đặt
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stagger-children">
        <DashboardStats data={dashboardData} formatCurrency={formatCurrency} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
        <DashboardCharts 
          studentTrends={dashboardData.studentTrends}
          revenueTrends={dashboardData.revenueTrends}
          coursesDistribution={dashboardData.coursesDistribution}
          formatCurrency={formatCurrency}
        />
        
        {/* Recent Activity */}
        <div className="space-y-6">
          <RecentActivity transactions={dashboardData.recentTransactions} formatCurrency={formatCurrency} />
          <QuickActions />
        </div>
      </div>

      {/* Alerts & Notifications */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mr-3">
              <Bell className="w-5 h-5 text-white" />
            </div>
            Thông báo quan trọng
          </h3>
          <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-semibold transition-colors">
            Xem tất cả →
          </button>
        </div>
        <div className="space-y-4">
          <div className="flex items-start p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 rounded-xl hover:shadow-md transition-shadow">
            <div className="flex-shrink-0 w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">⚠️</span>
            </div>
            <div className="flex-1 ml-4">
              <p className="text-sm font-semibold text-gray-900">
                Lớp IELTS 6.5 - Sáng thứ 2 có 3 học viên vắng mặt liên tiếp
              </p>
              <p className="text-xs text-gray-500 mt-1 flex items-center">
                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>
                2 giờ trước
              </p>
            </div>
          </div>
          <div className="flex items-start p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 rounded-xl hover:shadow-md transition-shadow">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-400 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">📝</span>
            </div>
            <div className="flex-1 ml-4">
              <p className="text-sm font-semibold text-gray-900">
                Có 5 đơn đăng ký khóa học mới cần duyệt
              </p>
              <p className="text-xs text-gray-500 mt-1 flex items-center">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                4 giờ trước
              </p>
            </div>
          </div>
          <div className="flex items-start p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-400 rounded-xl hover:shadow-md transition-shadow">
            <div className="flex-shrink-0 w-10 h-10 bg-green-400 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">🎉</span>
            </div>
            <div className="flex-1 ml-4">
              <p className="text-sm font-semibold text-gray-900">
                Doanh thu tháng này đã vượt mục tiêu 15%
              </p>
              <p className="text-xs text-gray-500 mt-1 flex items-center">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                1 ngày trước
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
