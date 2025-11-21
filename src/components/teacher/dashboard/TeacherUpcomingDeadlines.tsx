import React from 'react';
import { Clock, Calendar, AlertCircle, BookOpen, FileText } from 'lucide-react';
import { StatusBadge } from '../../common/StatusBadge';

export interface Deadline {
  id: string;
  type: 'assignment' | 'exam' | 'material' | 'meeting';
  title: string;
  className: string;
  dueDate: string;
  dueTime?: string;
  status: 'upcoming' | 'today' | 'overdue';
  submissionCount?: number;
  totalStudents?: number;
}

export interface TeacherUpcomingDeadlinesProps {
  deadlines: Deadline[];
  loading?: boolean;
  onViewAll?: () => void;
}

const typeConfig = {
  assignment: {
    icon: <FileText className="w-5 h-5" />,
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-600',
    label: 'Bài tập'
  },
  exam: {
    icon: <BookOpen className="w-5 h-5" />,
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-600',
    label: 'Kiểm tra'
  },
  material: {
    icon: <FileText className="w-5 h-5" />,
    bgColor: 'bg-green-100',
    textColor: 'text-green-600',
    label: 'Tài liệu'
  },
  meeting: {
    icon: <Calendar className="w-5 h-5" />,
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-600',
    label: 'Họp'
  }
};

export const TeacherUpcomingDeadlines: React.FC<TeacherUpcomingDeadlinesProps> = ({
  deadlines,
  loading = false,
  onViewAll
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hôm nay';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Ngày mai';
    } else {
      return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4 animate-pulse">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
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
        <h3 className="text-lg font-bold text-gray-900">Deadline sắp tới</h3>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            Xem tất cả
          </button>
        )}
      </div>

      {deadlines.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Không có deadline sắp tới</p>
        </div>
      ) : (
        <div className="space-y-3">
          {deadlines.map((deadline) => {
            const config = typeConfig[deadline.type];
            
            return (
              <div
                key={deadline.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className={`${config.bgColor} ${config.textColor} p-2 rounded-lg flex-shrink-0`}>
                    {config.icon}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 truncate">{deadline.title}</h4>
                      <StatusBadge 
                        status={deadline.status === 'overdue' ? 'error' : deadline.status === 'today' ? 'warning' : 'upcoming'} 
                        size="sm"
                        showIcon={false}
                      />
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{deadline.className}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(deadline.dueDate)}</span>
                        {deadline.dueTime && <span>• {deadline.dueTime}</span>}
                      </div>
                      
                      {deadline.submissionCount !== undefined && deadline.totalStudents !== undefined && (
                        <div className="flex items-center gap-1">
                          <span className="font-medium">
                            {deadline.submissionCount}/{deadline.totalStudents}
                          </span>
                          <span>đã nộp</span>
                        </div>
                      )}
                    </div>

                    {deadline.status === 'overdue' && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span className="font-medium">Đã quá hạn</span>
                      </div>
                    )}
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

export default TeacherUpcomingDeadlines;
