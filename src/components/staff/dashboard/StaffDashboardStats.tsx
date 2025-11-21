import React from 'react';
import { UserPlusIcon, BanknotesIcon, ChatBubbleLeftRightIcon, CalendarDaysIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export interface StaffStatCardData {
  id: string;
  title: string;
  value: number | string;
  subtitle: string;
  icon: React.ComponentType<any>;
  iconBgColor: string;
  iconColor: string;
  actionLabel: string;
  onAction: () => void;
}

export interface StaffDashboardStatsProps {
  stats: {
    pendingRegistrations: number;
    pendingPayments: number;
    newTickets: number;
    todayClasses: number;
  };
  loading?: boolean;
  onNavigate: (path: string) => void;
}

export const StaffDashboardStats: React.FC<StaffDashboardStatsProps> = ({
  stats,
  loading = false,
  onNavigate
}) => {
  const statCards: StaffStatCardData[] = [
    {
      id: 'registrations',
      title: 'Đăng ký chờ duyệt',
      value: stats.pendingRegistrations,
      subtitle: 'Học viên mới',
      icon: UserPlusIcon,
      iconBgColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
      iconColor: 'text-white',
      actionLabel: 'Xem danh sách',
      onAction: () => onNavigate('/staff/students/register')
    },
    {
      id: 'payments',
      title: 'Thanh toán chờ xử lý',
      value: stats.pendingPayments,
      subtitle: 'Giao dịch',
      icon: BanknotesIcon,
      iconBgColor: 'bg-gradient-to-br from-green-500 to-green-600',
      iconColor: 'text-white',
      actionLabel: 'Xử lý ngay',
      onAction: () => onNavigate('/staff/payments')
    },
    {
      id: 'tickets',
      title: 'Tickets mới',
      value: stats.newTickets,
      subtitle: 'Cần trả lời',
      icon: ChatBubbleLeftRightIcon,
      iconBgColor: 'bg-gradient-to-br from-red-500 to-red-600',
      iconColor: 'text-white',
      actionLabel: 'Trả lời',
      onAction: () => onNavigate('/staff/tickets')
    },
    {
      id: 'classes',
      title: 'Lớp học hôm nay',
      value: stats.todayClasses,
      subtitle: 'Lớp đang diễn ra',
      icon: CalendarDaysIcon,
      iconBgColor: 'bg-gradient-to-br from-purple-500 to-purple-600',
      iconColor: 'text-white',
      actionLabel: 'Xem lịch',
      onAction: () => onNavigate('/staff/schedule')
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((card) => (
        <div
          key={card.id}
          className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
              <h3 className="text-3xl font-bold text-gray-900">{card.value}</h3>
              <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
            </div>
            <div className={`p-3 ${card.iconBgColor} rounded-lg`}>
              <card.icon className="w-6 h-6 text-white" />
            </div>
          </div>
          <button
            onClick={card.onAction}
            className={`text-sm font-medium inline-flex items-center gap-1 hover:underline ${
              card.id === 'registrations' ? 'text-blue-600 hover:text-blue-700' :
              card.id === 'payments' ? 'text-green-600 hover:text-green-700' :
              card.id === 'tickets' ? 'text-red-600 hover:text-red-700' :
              'text-purple-600 hover:text-purple-700'
            }`}
          >
            {card.actionLabel} <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default StaffDashboardStats;
