import React from 'react';
import { Users, BookOpen, CheckSquare, TrendingUp } from 'lucide-react';

export interface StatCardData {
  id: string;
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
}

export interface TeacherDashboardStatsProps {
  stats: {
    totalStudents: number;
    activeClasses: number;
    pendingAssignments: number;
    attendanceRate: number;
  };
  loading?: boolean;
}

export const TeacherDashboardStats: React.FC<TeacherDashboardStatsProps> = ({
  stats,
  loading = false
}) => {
  const statCards: StatCardData[] = [
    {
      id: 'students',
      title: 'Tổng số học sinh',
      value: stats.totalStudents,
      change: 5,
      changeLabel: 'so với tháng trước',
      icon: <Users className="w-6 h-6" />,
      iconBgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      id: 'classes',
      title: 'Lớp đang dạy',
      value: stats.activeClasses,
      icon: <BookOpen className="w-6 h-6" />,
      iconBgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      id: 'assignments',
      title: 'Bài tập chờ chấm',
      value: stats.pendingAssignments,
      change: -12,
      changeLabel: 'so với tuần trước',
      icon: <CheckSquare className="w-6 h-6" />,
      iconBgColor: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    {
      id: 'attendance',
      title: 'Tỷ lệ điểm danh',
      value: `${stats.attendanceRate}%`,
      change: 2.5,
      changeLabel: 'so với tháng trước',
      icon: <TrendingUp className="w-6 h-6" />,
      iconBgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 animate-pulse">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
                <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => (
        <div
          key={stat.id}
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-all duration-300 group"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
              
              {stat.change !== undefined && (
                <div className="flex items-center gap-1 text-xs">
                  <span className={`font-semibold ${
                    stat.change > 0 ? 'text-green-600' : stat.change < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {stat.change > 0 ? '+' : ''}{stat.change}%
                  </span>
                  <span className="text-gray-500">{stat.changeLabel}</span>
                </div>
              )}
            </div>
            
            <div className={`${stat.iconBgColor} ${stat.iconColor} p-3 rounded-lg group-hover:scale-110 transition-transform duration-300`}>
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeacherDashboardStats;
