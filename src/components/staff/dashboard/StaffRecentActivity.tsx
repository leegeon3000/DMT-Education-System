import React from 'react';
import { motion } from 'framer-motion';
import {
  UserPlusIcon,
  BanknotesIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export interface StaffActivity {
  id: string;
  type: 'registration' | 'payment' | 'enrollment' | 'ticket' | 'class';
  title: string;
  description: string;
  studentName?: string;
  timestamp: string;
  status?: 'success' | 'warning' | 'info' | 'error';
  metadata?: any;
}

export interface StaffRecentActivityProps {
  activities: StaffActivity[];
  loading?: boolean;
  onViewAll?: () => void;
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'registration': return UserPlusIcon;
    case 'payment': return BanknotesIcon;
    case 'enrollment': return AcademicCapIcon;
    case 'ticket': return ChatBubbleLeftRightIcon;
    case 'class': return CalendarIcon;
    default: return ClockIcon;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case 'registration': return 'bg-blue-100 text-blue-600';
    case 'payment': return 'bg-green-100 text-green-600';
    case 'enrollment': return 'bg-purple-100 text-purple-600';
    case 'ticket': return 'bg-red-100 text-red-600';
    case 'class': return 'bg-orange-100 text-orange-600';
    default: return 'bg-gray-100 text-gray-600';
  }
};

const getStatusBadge = (status?: string) => {
  switch (status) {
    case 'success': return 'bg-green-100 text-green-800';
    case 'warning': return 'bg-yellow-100 text-yellow-800';
    case 'error': return 'bg-red-100 text-red-800';
    default: return 'bg-blue-100 text-blue-800';
  }
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Vừa xong';
  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  return `${days} ngày trước`;
};

export const StaffRecentActivity: React.FC<StaffRecentActivityProps> = ({
  activities,
  loading = false,
  onViewAll
}) => {
  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Hoạt động gần đây</h2>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-red-600 to-rose-600 rounded-full"></span>
          Hoạt động gần đây
        </h2>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-sm font-medium text-red-600 hover:text-red-700 hover:underline"
          >
            Xem tất cả
          </button>
        )}
      </div>

      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity, index) => {
            const Icon = getActivityIcon(activity.type);
            const iconColor = getActivityColor(activity.type);

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className={`w-10 h-10 ${iconColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-600 mt-0.5">{activity.description}</p>
                      {activity.studentName && (
                        <p className="text-xs text-gray-500 mt-1">
                          Học viên: {activity.studentName}
                        </p>
                      )}
                    </div>
                    
                    {activity.status && (
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(activity.status)} whitespace-nowrap`}>
                        {activity.status === 'success' ? 'Thành công' :
                         activity.status === 'warning' ? 'Chú ý' :
                         activity.status === 'error' ? 'Lỗi' : 'Mới'}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <ClockIcon className="w-3 h-3" />
                    {formatTimestamp(activity.timestamp)}
                  </p>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Chưa có hoạt động nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffRecentActivity;
