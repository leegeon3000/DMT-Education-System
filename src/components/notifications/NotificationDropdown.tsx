import React, { useState, useEffect } from 'react';
import { CheckCheck, AlertCircle, Info, Bell, Calendar, BookOpen, DollarSign } from 'lucide-react';
import { notificationsApi, Notification } from '../../services/notifications';
import NotificationItem from './NotificationItem';

interface NotificationDropdownProps {
  onClose: () => void;
  onMarkAllRead: () => void;
  onNotificationRead: () => void;
  isLoading: boolean;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  onClose,
  onMarkAllRead,
  onNotificationRead,
  isLoading
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await notificationsApi.getAll({
        page: 1,
        limit: 10
      });
      setNotifications(response.data || []);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      setError('Không thể tải thông báo');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await notificationsApi.markAsRead(notificationId);
      
      // Update local state
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId
            ? { ...notif, is_read: true }
            : notif
        )
      );
      
      // Notify parent to refresh unread count
      onNotificationRead();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkAllRead = async () => {
    await onMarkAllRead();
    
    // Update local state
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, is_read: true }))
    );
  };

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-[600px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Bell className="w-5 h-5 mr-2" />
          Thông báo
        </h3>
        
        {notifications.some(n => !n.is_read) && (
          <button
            onClick={handleMarkAllRead}
            disabled={isLoading}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <CheckCheck className="w-4 h-4 mr-1" />
            Đánh dấu đã đọc
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">{error}</p>
            <button
              onClick={fetchNotifications}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              Thử lại
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <Info className="w-12 h-12 text-gray-400 mb-3" />
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Không có thông báo mới
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
          <a
            href="/notifications"
            className="block text-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            onClick={onClose}
          >
            Xem tất cả thông báo
          </a>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
