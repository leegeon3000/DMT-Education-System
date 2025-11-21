import React from 'react';
import { Users, BookOpen, DollarSign, Calendar, TrendingUp, UserCheck } from 'lucide-react';

interface DashboardStatsProps {
  data: {
    totalStudents: number;
    totalTeachers: number;
    totalCourses: number;
    totalClasses: number;
    monthlyRevenue: number;
    attendanceRate: number;
    newEnrollments: number;
    activeClasses: number;
  };
  formatCurrency: (amount: number) => string;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ data, formatCurrency }) => {
  const stats = [
    {
      title: 'Tổng học viên',
      value: data.totalStudents,
      icon: Users,
      color: 'bg-blue-500',
      trend: '+12%',
      trendColor: 'text-green-600'
    },
    {
      title: 'Giáo viên',
      value: data.totalTeachers,
      icon: UserCheck,
      color: 'bg-green-500',
      trend: '+2',
      trendColor: 'text-green-600'
    },
    {
      title: 'Khóa học',
      value: data.totalCourses,
      icon: BookOpen,
      color: 'bg-red-500',
      trend: '+1',
      trendColor: 'text-green-600'
    },
    {
      title: 'Lớp học',
      value: data.totalClasses,
      icon: Calendar,
      color: 'bg-orange-500',
      trend: '+5',
      trendColor: 'text-green-600'
    },
    {
      title: 'Doanh thu tháng',
      value: formatCurrency(data.monthlyRevenue),
      icon: DollarSign,
      color: 'bg-red-500',
      trend: '+15%',
      trendColor: 'text-green-600',
      isLarge: true
    },
    {
      title: 'Tỉ lệ điểm danh',
      value: `${data.attendanceRate}%`,
      icon: TrendingUp,
      color: 'bg-indigo-500',
      trend: '+2.5%',
      trendColor: 'text-green-600'
    },
    {
      title: 'Đăng ký mới',
      value: data.newEnrollments,
      icon: Users,
      color: 'bg-pink-500',
      trend: '+8',
      trendColor: 'text-green-600'
    },
    {
      title: 'Lớp đang học',
      value: data.activeClasses,
      icon: Calendar,
      color: 'bg-cyan-500',
      trend: '+3',
      trendColor: 'text-green-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div
            key={index}
            className={`group bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${
              stat.isLarge ? 'md:col-span-2' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">{stat.title}</p>
                <p className={`font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent ${stat.isLarge ? 'text-3xl' : 'text-2xl'}`}>
                  {stat.value}
                </p>
                <div className="flex items-center mt-3 space-x-2">
                  <div className="flex items-center px-2 py-1 bg-green-50 rounded-lg">
                    <svg className="w-3 h-3 text-green-600 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className={`text-xs font-bold ${stat.trendColor}`}>
                      {stat.trend}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">từ tháng trước</span>
                </div>
              </div>
              <div className={`p-4 rounded-2xl ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <IconComponent className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
