import React, { useEffect, useState } from 'react';
import { getStudentSchedule } from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Download,
  Bell,
  Grid3x3,
  List,
  AlertCircle
} from 'lucide-react';
import { SEOHead } from '../../../components/common';

interface ScheduleItem {
  id: string;
  subject: string;
  time: string;
  teacher: string;
  room: string;
  date: string;
  type: 'class' | 'exam' | 'assignment';
  status: 'upcoming' | 'ongoing' | 'completed';
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'exam': return 'bg-red-100 text-red-700';
    case 'assignment': return 'bg-yellow-100 text-yellow-700';
    default: return 'bg-blue-100 text-blue-700';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ongoing': return 'bg-green-500';
    case 'completed': return 'bg-gray-400';
    default: return 'bg-primary-500';
  }
};

const ScheduleCard: React.FC<{ item: ScheduleItem }> = ({ item }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.01 }}
    className="relative bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-lg transition-all"
  >
    <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${getStatusColor(item.status)}`} />
    <div className="pl-4">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg mb-1">{item.subject}</h3>
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <User className="w-4 h-4" />
            {item.teacher}
          </p>
        </div>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getTypeColor(item.type)}`}>
          {item.type === 'class' ? 'Lớp học' : item.type === 'exam' ? 'Kiểm tra' : 'Bài tập'}
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-4 h-4 text-blue-500" />
          <div>
            <p className="font-medium text-gray-900">{item.time}</p>
            <p className="text-xs text-gray-500">Thời gian</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4 text-green-500" />
          <div>
            <p className="font-medium text-gray-900">{item.room}</p>
            <p className="text-xs text-gray-500">Phòng học</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-4 h-4 text-purple-500" />
          <div>
            <p className="font-medium text-gray-900">{item.date}</p>
            <p className="text-xs text-gray-500">Ngày học</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${getStatusColor(item.status)}`} />
          <span className="text-xs text-gray-600 font-medium">
            {item.status === 'upcoming' ? 'Sắp tới' : 
             item.status === 'ongoing' ? 'Đang diễn ra' : 'Đã hoàn thành'}
          </span>
        </div>
        <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
          Chi tiết →
        </button>
      </div>
    </div>
  </motion.div>
);

const Schedule: React.FC = () => {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'today' | 'week'>('week');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedWeek, setSelectedWeek] = useState(0);

  useEffect(() => {
    const loadSchedule = async () => {
      try {
        setLoading(true);
        // Mock data since API might not be ready
        const mockSchedule: ScheduleItem[] = [
          {
            id: '1',
            subject: 'Toán 9',
            time: '08:00 - 09:30',
            teacher: 'Thầy Minh',
            room: 'A101',
            date: '09/08/2025',
            type: 'class',
            status: 'upcoming'
          },
          {
            id: '2',
            subject: 'Vật lý 9',
            time: '10:00 - 11:30',
            teacher: 'Cô Hương',
            room: 'B203',
            date: '09/08/2025',
            type: 'class',
            status: 'upcoming'
          },
          {
            id: '3',
            subject: 'Hóa học 9',
            time: '14:00 - 15:30',
            teacher: 'Thầy Đức',
            room: 'C105',
            date: '09/08/2025',
            type: 'exam',
            status: 'upcoming'
          },
          {
            id: '4',
            subject: 'Toán 9 - Bài tập',
            time: '23:59',
            teacher: 'Thầy Minh',
            room: 'Online',
            date: '10/08/2025',
            type: 'assignment',
            status: 'upcoming'
          }
        ];
        setSchedule(mockSchedule);
      } catch (err: any) {
        setError(err.message || 'Không thể tải thời khóa biểu');
      } finally {
        setLoading(false);
      }
    };

    loadSchedule();
  }, []);

  const filteredSchedule = schedule.filter(item => {
    const today = new Date().toDateString();
    const itemDate = new Date(item.date.split('/').reverse().join('-')).toDateString();
    
    if (filter === 'today') return itemDate === today;
    if (filter === 'week') {
      const weekFromNow = new Date();
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      return new Date(item.date.split('/').reverse().join('-')) <= weekFromNow;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Đang tải thời khóa biểu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 font-semibold">Lỗi: {error}</p>
                <p className="text-red-600 text-sm mt-1">Vui lòng thử lại sau.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getWeekDates = () => {
    const now = new Date();
    now.setDate(now.getDate() + selectedWeek * 7);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });
  };

  return (
    <>
      <SEOHead
        title="Thời khóa biểu - DMT Education"
        description="Lịch học cá nhân của học viên DMT Education"
        keywords="thời khóa biểu, lịch học, học tập"
      />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Thời khóa biểu
                </h1>
                <p className="text-gray-600">
                  Lịch học và deadline bài tập của bạn
                </p>
              </div>
              
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Bell className="w-4 h-4" />
                  <span className="text-sm font-medium">Nhắc nhở</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-all">
                  <Download className="w-4 h-4" />
                  <span className="text-sm font-medium">Tải xuống</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Filters & View Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex gap-2">
              {[
                { key: 'today', label: 'Hôm nay', icon: Calendar },
                { key: 'week', label: 'Tuần này', icon: Filter },
                { key: 'all', label: 'Tất cả', icon: Grid3x3 }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key as any)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
                    filter === key
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

          {/* Week Navigator */}
          {filter === 'week' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-4 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setSelectedWeek(selectedWeek - 1)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h3 className="font-semibold text-gray-900">
                  {selectedWeek === 0 ? 'Tuần này' : `Tuần ${selectedWeek > 0 ? '+' : ''}${selectedWeek}`}
                </h3>
                <button
                  onClick={() => setSelectedWeek(selectedWeek + 1)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {getWeekDates().map((date, index) => {
                  const isToday = date.toDateString() === new Date().toDateString();
                  const daySchedule = schedule.filter(item => {
                    const itemDate = new Date(item.date.split('/').reverse().join('-')).toDateString();
                    return itemDate === date.toDateString();
                  });
                  
                  return (
                    <div
                      key={index}
                      className={`text-center p-3 rounded-lg transition-colors ${
                        isToday ? 'bg-cyan-600 text-white' : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <p className={`text-xs font-medium ${isToday ? 'text-blue-100' : 'text-gray-600'}`}>
                        {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][index]}
                      </p>
                      <p className={`text-lg font-bold ${isToday ? 'text-white' : 'text-gray-900'}`}>
                        {date.getDate()}
                      </p>
                      {daySchedule.length > 0 && (
                        <p className={`text-xs mt-1 ${isToday ? 'text-blue-100' : 'text-gray-500'}`}>
                          {daySchedule.length} lớp
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Schedule List/Grid */}
          <AnimatePresence>
            {filteredSchedule.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-12 text-center"
              >
                <Calendar className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">Không có lịch học</p>
                <p className="text-gray-400 text-sm">Bạn chưa có lịch học nào trong khoảng thời gian này</p>
              </motion.div>
            ) : (
              <motion.div
                key={viewMode}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : 'space-y-4'}
              >
                {filteredSchedule.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ScheduleCard item={item} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 bg-blue-50 rounded-xl border border-blue-200 p-6"
          >
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              Tính năng hỗ trợ
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5" />
                <div>
                  <p className="font-medium text-gray-900">Nhận thông báo nhắc nhở</p>
                  <p className="text-gray-600 text-xs">Qua email và SMS trước giờ học</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5" />
                <div>
                  <p className="font-medium text-gray-900">Đồng bộ Google Calendar</p>
                  <p className="text-gray-600 text-xs">Tự động cập nhật lịch học</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5" />
                <div>
                  <p className="font-medium text-gray-900">Cảnh báo deadline</p>
                  <p className="text-gray-600 text-xs">Nhắc nhở bài tập sắp hết hạn</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5" />
                <div>
                  <p className="font-medium text-gray-900">Gửi feedback</p>
                  <p className="text-gray-600 text-xs">Liên hệ trực tiếp với giáo viên</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </>
  );
};

export default Schedule;