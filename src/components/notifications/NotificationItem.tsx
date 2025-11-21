import React from 'react';
import { 
  Bell, 
  AlertCircle, 
  Info, 
  CheckCircle, 
  Calendar,
  BookOpen,
  DollarSign,
  Users,
  Settings,
  MessageSquare
} from 'lucide-react';
import { Notification } from '../../services/notifications';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (notificationId: number) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead
}) => {
  const getIcon = (type: string) => {
    const iconClass = "w-5 h-5";
    
    switch (type) {
      case 'success':
        return <CheckCircle className={`${iconClass} text-green-500`} />;
      case 'warning':
        return <AlertCircle className={`${iconClass} text-yellow-500`} />;
      case 'error':
        return <AlertCircle className={`${iconClass} text-red-500`} />;
      case 'attendance':
        return <Calendar className={`${iconClass} text-blue-500`} />;
      case 'assignment':
        return <BookOpen className={`${iconClass} text-purple-500`} />;
      case 'payment':
        return <DollarSign className={`${iconClass} text-green-500`} />;
      case 'class':
        return <Users className={`${iconClass} text-indigo-500`} />;
      case 'system':
        return <Settings className={`${iconClass} text-gray-500`} />;
      case 'message':
        return <MessageSquare className={`${iconClass} text-blue-500`} />;
      default:
        return <Info className={`${iconClass} text-blue-500`} />;
    }
  };

  const getTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInMins = Math.floor(diffInMs / (1000 * 60));
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

      if (diffInMins < 1) return 'Vừa xong';
      if (diffInMins < 60) return `${diffInMins} phút trước`;
      if (diffInHours < 24) return `${diffInHours} giờ trước`;
      if (diffInDays < 7) return `${diffInDays} ngày trước`;
      
      return date.toLocaleDateString('vi-VN');
    } catch (error) {
      return dateString;
    }
  };

  const handleClick = () => {
    if (!notification.is_read) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
        !notification.is_read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
      }`}
    >
      <div className="flex items-start space-x-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          {getIcon(notification.type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <p className={`text-sm font-medium ${
            !notification.is_read 
              ? 'text-gray-900 dark:text-white' 
              : 'text-gray-700 dark:text-gray-300'
          }`}>
            {notification.title}
          </p>

          {/* Message */}
          {notification.message && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {notification.message}
            </p>
          )}

          {/* Time */}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
            {getTimeAgo(notification.created_at)}
          </p>
        </div>

        {/* Unread indicator */}
        {!notification.is_read && (
          <div className="flex-shrink-0">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;
