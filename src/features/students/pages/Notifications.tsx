import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Trash2, 
  Mail, 
  MailOpen, 
  FileText, 
  BarChart3, 
  CreditCard, 
  Settings,
  Filter,
  BookOpen,
  AlertCircle,
  Info,
  Calendar,
  Award
} from 'lucide-react';
import { SEOHead } from '../../../components/common/SEOHead';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'general' | 'assignment' | 'grade' | 'payment' | 'system';
  isRead: boolean;
  createdAt: string;
  priority?: 'high' | 'medium' | 'low';
  actionUrl?: string;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      // TODO: Integrate with Supabase API
      // const data = await studentService.getNotifications();
      
      // Mock data
      const mockNotifications: Notification[] = [
        {
          id: '1',
          title: 'Bài tập mới đã được giao',
          message: 'Giáo viên đã giao bài tập "Phương trình bậc 2" cho khóa Toán 10. Hạn nộp: 25/11/2025',
          type: 'assignment',
          isRead: false,
          createdAt: '2025-11-18T10:30:00Z',
          priority: 'high',
          actionUrl: '/student/schedule'
        },
        {
          id: '2',
          title: 'Điểm kiểm tra đã được cập nhật',
          message: 'Điểm kiểm tra môn Vật Lý đã được cập nhật. Xem chi tiết tại bảng điểm.',
          type: 'grade',
          isRead: false,
          createdAt: '2025-11-17T14:20:00Z',
          priority: 'medium',
          actionUrl: '/student/transcript'
        },
        {
          id: '3',
          title: 'Nhắc nhở thanh toán học phí',
          message: 'Học phí tháng 12/2025 sắp đến hạn. Vui lòng thanh toán trước ngày 15/12/2025.',
          type: 'payment',
          isRead: true,
          createdAt: '2025-11-15T09:00:00Z',
          priority: 'high',
          actionUrl: '/student/payments'
        },
        {
          id: '4',
          title: 'Lịch học đã được cập nhật',
          message: 'Lịch học môn Hóa học đã được thay đổi. Vui lòng kiểm tra lại thời khóa biểu.',
          type: 'general',
          isRead: true,
          createdAt: '2025-11-12T16:45:00Z',
          priority: 'medium',
          actionUrl: '/student/schedule'
        },
        {
          id: '5',
          title: 'Bảo trì hệ thống',
          message: 'Hệ thống sẽ bảo trì từ 23:00 - 23:30 tối nay. Vui lòng không đăng nhập trong thời gian này.',
          type: 'system',
          isRead: true,
          createdAt: '2025-11-10T18:00:00Z',
          priority: 'low'
        },
        {
          id: '6',
          title: 'Khảo sát mới',
          message: 'Có khảo sát mới về chất lượng giảng dạy. Vui lòng hoàn thành trước ngày 20/11/2025.',
          type: 'general',
          isRead: false,
          createdAt: '2025-11-09T11:15:00Z',
          priority: 'medium',
          actionUrl: '/student/surveys'
        },
        {
          id: '7',
          title: 'Chúc mừng đạt điểm cao',
          message: 'Chúc mừng bạn đã đạt 9.5 điểm kiểm tra Toán học! Tiếp tục phát huy nhé!',
          type: 'grade',
          isRead: true,
          createdAt: '2025-11-08T15:30:00Z',
          priority: 'low'
        }
      ];

      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      // TODO: API call to mark as read
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === id ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // TODO: API call to mark all as read
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, isRead: true }))
      );
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // TODO: API call to delete notification
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'assignment':
        return <FileText className="w-5 h-5" />;
      case 'grade':
        return <BarChart3 className="w-5 h-5" />;
      case 'payment':
        return <CreditCard className="w-5 h-5" />;
      case 'system':
        return <Settings className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getTypeBgColor = (type: string, priority?: string) => {
    if (priority === 'high') {
      return 'bg-red-600';
    }
    switch (type) {
      case 'assignment':
        return 'bg-blue-600';
      case 'grade':
        return 'bg-green-600';
      case 'payment':
        return 'bg-yellow-600';
      case 'system':
        return 'bg-gray-600';
      default:
        return 'bg-cyan-600';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'assignment':
        return 'Bài tập';
      case 'grade':
        return 'Điểm số';
      case 'payment':
        return 'Học phí';
      case 'system':
        return 'Hệ thống';
      default:
        return 'Chung';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Vừa xong';
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    if (diffInHours < 48) return 'Hôm qua';
    
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const filteredNotifications = notifications.filter(notif => {
    const matchesReadFilter = filter === 'all' || (filter === 'unread' && !notif.isRead);
    const matchesTypeFilter = typeFilter === 'all' || notif.type === typeFilter;
    return matchesReadFilter && matchesTypeFilter;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const typeCount = (type: string) => notifications.filter(n => n.type === type).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Đang tải thông báo...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="Thông báo - DMT Education"
        description="Xem thông báo và cập nhật mới nhất"
        keywords={["thông báo", "cập nhật", "tin tức"]}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Bell className="w-8 h-8 text-blue-600" />
                  Thông báo
                </h1>
                <p className="text-gray-600">
                  {unreadCount > 0 ? `Bạn có ${unreadCount} thông báo chưa đọc` : 'Bạn đã đọc tất cả thông báo'}
                </p>
              </div>

              {unreadCount > 0 && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={handleMarkAllAsRead}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white text-sm font-semibold rounded-lg hover:bg-cyan-700 transition-all shadow-md"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span>Đánh dấu đã đọc tất cả</span>
                </motion.button>
              )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Bell className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
                    <p className="text-xs text-gray-600">Tổng thông báo</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <MailOpen className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
                    <p className="text-xs text-gray-600">Chưa đọc</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{typeCount('assignment')}</p>
                    <p className="text-xs text-gray-600">Bài tập</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{typeCount('grade')}</p>
                    <p className="text-xs text-gray-600">Điểm số</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-1 inline-flex">
                {[
                  { key: 'all', label: `Tất cả (${notifications.length})` },
                  { key: 'unread', label: `Chưa đọc (${unreadCount})` }
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key as any)}
                    className={`px-6 py-2 text-sm font-medium rounded-lg transition-all ${
                      filter === key
                        ? 'bg-cyan-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 overflow-x-auto">
                {[
                  { key: 'all', label: 'Tất cả', icon: Filter },
                  { key: 'assignment', label: 'Bài tập', icon: FileText },
                  { key: 'grade', label: 'Điểm', icon: BarChart3 },
                  { key: 'payment', label: 'Học phí', icon: CreditCard },
                  { key: 'system', label: 'Hệ thống', icon: Settings }
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setTypeFilter(key)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
                      typeFilter === key
                        ? 'bg-white border-2 border-blue-500 text-blue-600 shadow-sm'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Notifications List */}
          <AnimatePresence>
            {filteredNotifications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-12 text-center"
              >
                <Bell className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {filter === 'unread' ? 'Không có thông báo chưa đọc' : 'Chưa có thông báo'}
                </h3>
                <p className="text-sm text-gray-500">
                  {filter === 'unread' 
                    ? 'Bạn đã đọc tất cả thông báo' 
                    : 'Thông báo của bạn sẽ hiển thị tại đây'}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="notifications-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {filteredNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ x: 4 }}
                    className={`bg-white rounded-xl border transition-all ${
                      notification.isRead 
                        ? 'border-gray-200' 
                        : 'border-blue-200 shadow-md'
                    }`}
                  >
                    <div className="p-5">
                      <div className="flex items-start gap-4">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${getTypeBgColor(notification.type, notification.priority)} flex items-center justify-center text-white shadow-md`}>
                          {getTypeIcon(notification.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className={`text-base font-bold ${
                                  notification.isRead ? 'text-gray-700' : 'text-gray-900'
                                }`}>
                                  {notification.title}
                                </h3>
                                {!notification.isRead && (
                                  <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse"></span>
                                )}
                                {notification.priority === 'high' && (
                                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-700">
                                    Ưu tiên
                                  </span>
                                )}
                              </div>
                              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                                {getTypeLabel(notification.type)}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 ml-4">
                              {!notification.isRead && (
                                <button
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                                  title="Đánh dấu đã đọc"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(notification.id)}
                                className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                title="Xóa"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <p className={`text-sm mb-3 ${
                            notification.isRead ? 'text-gray-500' : 'text-gray-700'
                          }`}>
                            {notification.message}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(notification.createdAt)}</span>
                            </div>

                            {notification.actionUrl && (
                              <button
                                onClick={() => window.location.href = notification.actionUrl!}
                                className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                              >
                                Xem chi tiết →
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Info Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 bg-blue-50 rounded-xl border border-blue-200 p-6"
          >
            <div className="flex items-start gap-3">
              <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Về thông báo</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Bạn sẽ nhận thông báo về bài tập, điểm số, và học phí qua hệ thống</li>
                  <li>• Thông báo quan trọng sẽ được đánh dấu ưu tiên</li>
                  <li>• Bật thông báo trình duyệt để không bỏ lỡ cập nhật quan trọng</li>
                  <li>• Thông báo sẽ tự động xóa sau 30 ngày</li>
                </ul>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </>
  );
};

export default Notifications;
