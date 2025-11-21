import React, { useState, useEffect } from 'react';
import { SEOHead } from '../../../components/common';
import { motion } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  Clock,
  Users,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit,
  Eye,
  Filter,
  Download
} from 'lucide-react';

interface ClassSession {
  id: number;
  class_name: string;
  teacher_name: string;
  room: string;
  start_time: string;
  end_time: string;
  day_of_week: string;
  current_students: number;
  capacity: number;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

const Schedule: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  const [sessions, setSessions] = useState<ClassSession[]>([]);
  const [filterRoom, setFilterRoom] = useState('');
  const [filterTeacher, setFilterTeacher] = useState('');

  // Mock data
  const mockSessions: ClassSession[] = [
    {
      id: 1,
      class_name: 'Toán 10A',
      teacher_name: 'Nguyễn Văn A',
      room: 'P.201',
      start_time: '18:00',
      end_time: '20:00',
      day_of_week: 'MONDAY',
      current_students: 25,
      capacity: 30,
      status: 'SCHEDULED'
    },
    {
      id: 2,
      class_name: 'Vật lý 11B',
      teacher_name: 'Trần Thị B',
      room: 'P.202',
      start_time: '18:30',
      end_time: '20:30',
      day_of_week: 'MONDAY',
      current_students: 22,
      capacity: 25,
      status: 'SCHEDULED'
    },
    {
      id: 3,
      class_name: 'Hóa học 12C',
      teacher_name: 'Lê Văn C',
      room: 'P.203',
      start_time: '19:00',
      end_time: '21:00',
      day_of_week: 'TUESDAY',
      current_students: 20,
      capacity: 25,
      status: 'SCHEDULED'
    },
    {
      id: 4,
      class_name: 'IELTS 6.5',
      teacher_name: 'Phạm Thị D',
      room: 'P.301',
      start_time: '18:00',
      end_time: '20:00',
      day_of_week: 'WEDNESDAY',
      current_students: 15,
      capacity: 20,
      status: 'SCHEDULED'
    },
    {
      id: 5,
      class_name: 'Toán 12A',
      teacher_name: 'Hoàng Văn E',
      room: 'P.201',
      start_time: '18:00',
      end_time: '20:00',
      day_of_week: 'THURSDAY',
      current_students: 28,
      capacity: 30,
      status: 'SCHEDULED'
    },
    {
      id: 6,
      class_name: 'Sinh học 10B',
      teacher_name: 'Nguyễn Thị F',
      room: 'P.204',
      start_time: '19:00',
      end_time: '21:00',
      day_of_week: 'FRIDAY',
      current_students: 18,
      capacity: 25,
      status: 'SCHEDULED'
    }
  ];

  useEffect(() => {
    setSessions(mockSessions);
  }, []);

  const getWeekDays = (date: Date) => {
    const days = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + 1); // Monday

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays(currentDate);
  const dayNames = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  const dayNamesVi = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];

  const getSessionsForDay = (dayName: string) => {
    return sessions.filter(s => s.day_of_week === dayName);
  };

  const handlePrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const getStatusColor = (status: string) => {
    const colors = {
      SCHEDULED: 'bg-blue-100 text-blue-700 border-blue-200',
      IN_PROGRESS: 'bg-green-100 text-green-700 border-green-200',
      COMPLETED: 'bg-gray-100 text-gray-700 border-gray-200',
      CANCELLED: 'bg-red-100 text-red-700 border-cyan-200'
    };
    return colors[status as keyof typeof colors] || colors.SCHEDULED;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      SCHEDULED: 'Đã lên lịch',
      IN_PROGRESS: 'Đang diễn ra',
      COMPLETED: 'Hoàn thành',
      CANCELLED: 'Đã hủy'
    };
    return labels[status as keyof typeof labels] || status;
  };

  return (
    <>
      <SEOHead
        title="Lịch học - DMT Education"
        description="Quản lý lịch học và thời khóa biểu"
      />

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Lịch học
                </h1>
                <p className="text-gray-600 mt-1">Quản lý thời khóa biểu lớp học</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => alert('Tạo lịch mới - Chức năng đang phát triển')}
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-all shadow-sm"
                >
                  <Plus size={20} />
                  Thêm lịch
                </button>
                <button
                  onClick={() => alert('Xuất lịch - Chức năng đang phát triển')}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                >
                  <Download size={20} />
                  Xuất lịch
                </button>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handlePrevWeek}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={handleToday}
                    className="px-4 py-2 bg-cyan-100 text-cyan-700 rounded-lg font-medium hover:bg-cyan-200 transition-colors"
                  >
                    Hôm nay
                  </button>
                  <button
                    onClick={handleNextWeek}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                  <div className="text-lg font-semibold text-gray-900">
                    Tuần {weekDays[0].toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })} - {weekDays[6].toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </div>
                </div>

                <div className="flex gap-3">
                  <select
                    value={filterRoom}
                    onChange={(e) => setFilterRoom(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  >
                    <option value="">Tất cả phòng</option>
                    <option value="P.201">P.201</option>
                    <option value="P.202">P.202</option>
                    <option value="P.203">P.203</option>
                    <option value="P.301">P.301</option>
                  </select>

                  <select
                    value={filterTeacher}
                    onChange={(e) => setFilterTeacher(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  >
                    <option value="">Tất cả giáo viên</option>
                    <option value="Nguyễn Văn A">Nguyễn Văn A</option>
                    <option value="Trần Thị B">Trần Thị B</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Week View Calendar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-7 border-b border-gray-200">
              {dayNamesVi.map((dayName, index) => {
                const date = weekDays[index];
                const isToday = date.toDateString() === new Date().toDateString();
                
                return (
                  <div
                    key={dayName}
                    className={`p-4 text-center border-r border-gray-200 last:border-r-0 ${
                      isToday ? 'bg-cyan-50' : ''
                    }`}
                  >
                    <div className="text-sm font-medium text-gray-600">{dayName}</div>
                    <div className={`text-2xl font-bold mt-1 ${
                      isToday ? 'text-cyan-600' : 'text-gray-900'
                    }`}>
                      {date.getDate()}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Schedule Grid */}
            <div className="grid grid-cols-7">
              {dayNames.map((dayName, dayIndex) => {
                const daySessions = getSessionsForDay(dayName);
                const isToday = weekDays[dayIndex].toDateString() === new Date().toDateString();

                return (
                  <div
                    key={dayName}
                    className={`min-h-[500px] border-r border-gray-200 last:border-r-0 p-3 space-y-2 ${
                      isToday ? 'bg-cyan-50/30' : 'bg-white'
                    }`}
                  >
                    {daySessions.map((session) => (
                      <motion.div
                        key={session.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`${getStatusColor(session.status)} border-2 rounded-lg p-3 cursor-pointer hover:shadow-md transition-all`}
                        onClick={() => alert(`Chi tiết: ${session.class_name}`)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="font-semibold text-sm">{session.class_name}</div>
                          <span className="text-xs px-2 py-0.5 bg-white/50 rounded">
                            {session.room}
                          </span>
                        </div>

                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-1">
                            <Clock size={12} />
                            <span>{session.start_time} - {session.end_time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users size={12} />
                            <span>{session.current_students}/{session.capacity}</span>
                          </div>
                          <div className="flex items-center gap-1 truncate">
                            <Users size={12} />
                            <span className="truncate">{session.teacher_name}</span>
                          </div>
                        </div>

                        <div className="flex gap-1 mt-2 pt-2 border-t border-current/20">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              alert(`Xem chi tiết: ${session.class_name}`);
                            }}
                            className="flex-1 py-1 bg-white/50 rounded text-xs hover:bg-white/80 transition-colors"
                          >
                            <Eye size={12} className="inline mr-1" />
                            Xem
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              alert(`Sửa: ${session.class_name}`);
                            }}
                            className="flex-1 py-1 bg-white/50 rounded text-xs hover:bg-white/80 transition-colors"
                          >
                            <Edit size={12} className="inline mr-1" />
                            Sửa
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Statistics Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng lớp tuần này</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{sessions.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CalendarIcon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng học viên</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {sessions.reduce((sum, s) => sum + s.current_students, 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Phòng đang dùng</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {new Set(sessions.map(s => s.room)).size}
                  </p>
                </div>
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-cyan-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tỷ lệ lấp đầy</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {Math.round(
                      (sessions.reduce((sum, s) => sum + s.current_students, 0) /
                        sessions.reduce((sum, s) => sum + s.capacity, 0)) *
                        100
                    )}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Schedule;
