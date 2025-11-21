import React from 'react';
import { Clock, User, MessageSquare, FileText, CheckCircle, AlertCircle } from 'lucide-react';

export interface Activity {
  id: string;
  type: 'submission' | 'comment' | 'grade' | 'material' | 'attendance';
  title: string;
  description: string;
  studentName?: string;
  className?: string;
  timestamp: string;
  status?: 'success' | 'warning' | 'info';
}

export interface TeacherRecentActivityProps {
  activities: Activity[];
  loading?: boolean;
  onViewAll?: () => void;
}

const activityConfig = {
  submission: {
    icon: <FileText className="w-5 h-5" />,
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-200'
  },
  comment: {
    icon: <MessageSquare className="w-5 h-5" />,
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-600',
    borderColor: 'border-purple-200'
  },
  grade: {
    icon: <CheckCircle className="w-5 h-5" />,
    bgColor: 'bg-green-100',
    textColor: 'text-green-600',
    borderColor: 'border-green-200'
  },
  material: {
    icon: <FileText className="w-5 h-5" />,
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-600',
    borderColor: 'border-orange-200'
  },
  attendance: {
    icon: <CheckCircle className="w-5 h-5" />,
    bgColor: 'bg-teal-100',
    textColor: 'text-teal-600',
    borderColor: 'border-teal-200'
  }
};

export const TeacherRecentActivity: React.FC<TeacherRecentActivityProps> = ({
  activities,
  loading = false,
  onViewAll
}) => {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} ngày trước`;
    
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-start gap-3 animate-pulse">
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
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Hoạt động gần đây</h3>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            Xem tất cả
          </button>
        )}
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Chưa có hoạt động nào</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const config = activityConfig[activity.type];
            
            return (
              <div key={activity.id} className="relative">
                {/* Timeline connector */}
                {index < activities.length - 1 && (
                  <div className="absolute left-5 top-12 w-0.5 h-full bg-gray-200"></div>
                )}
                
                <div className="flex items-start gap-3">
                  <div className={`${config.bgColor} ${config.textColor} p-2 rounded-lg flex-shrink-0 relative z-10`}>
                    {config.icon}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{activity.title}</h4>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {formatTimestamp(activity.timestamp)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-1">{activity.description}</p>
                    
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      {activity.studentName && (
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{activity.studentName}</span>
                        </div>
                      )}
                      {activity.className && (
                        <span className="px-2 py-0.5 bg-gray-100 rounded-full">
                          {activity.className}
                        </span>
                      )}
                      {activity.status === 'warning' && (
                        <div className="flex items-center gap-1 text-orange-600">
                          <AlertCircle className="w-3 h-3" />
                          <span>Cần xem xét</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TeacherRecentActivity;
