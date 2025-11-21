import React, { useState } from 'react';
import { X, User, Calendar, Award, BookOpen, Clock, DollarSign, TrendingUp, Users, BarChart3, Phone, Mail, MapPin } from 'lucide-react';

interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  specialization: string[];
  level: 'junior' | 'senior' | 'expert';
  status: 'active' | 'inactive' | 'on-leave';
  hireDate: string;
  salary: number;
  experience: number;

  totalClasses: number;
  totalStudents: number;
  hoursThisMonth: number;
  avatar?: string;
  bio?: string;
  certifications: string[];
  languages: string[];
}

interface TeacherDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: Teacher;
}

const TeacherDetailModal: React.FC<TeacherDetailModalProps> = ({
  isOpen,
  onClose,
  teacher
}) => {
  const [activeTab, setActiveTab] = useState('profile');

  // Mock data for demonstration
  const teachingSchedule = [
    { id: '1', course: 'IELTS 6.5 Foundation', class: 'IEL001', time: 'T2,T4,T6 8:00-10:00', students: 15, room: 'P201' },
    { id: '2', course: 'IELTS Writing', class: 'IEL002', time: 'T3,T5 14:00-16:00', students: 12, room: 'P102' },
    { id: '3', course: 'Academic Writing', class: 'ACA001', time: 'T7 9:00-12:00', students: 8, room: 'P301' }
  ];

  const performanceData = [
    { month: 'Tháng 1', hours: 78, students: 35 },
    { month: 'Tháng 2', hours: 82, students: 38 },
    { month: 'Tháng 3', hours: 75, students: 32 },
    { month: 'Tháng 4', hours: 85, students: 40 },
    { month: 'Tháng 5', hours: 80, students: 36 }
  ];

  const reviews = [
    { id: '1', studentName: 'Nguyễn Văn An', comment: 'Cô giảng rất hay, dễ hiểu và nhiệt tình', date: '2025-08-15', course: 'IELTS 6.5' },
    { id: '2', studentName: 'Trần Thị Bình', comment: 'Phương pháp giảng dạy hiệu quả, tiến bộ rõ rệt', date: '2025-08-10', course: 'Academic Writing' },
    { id: '3', studentName: 'Lê Minh Cường', comment: 'Cô rất tận tâm, luôn sẵn sàng giải đáp thắc mắc', date: '2025-08-05', course: 'IELTS Writing' }
  ];

  const salaryHistory = [
    { month: 'Tháng 8/2025', base: 15000000, bonus: 2000000, total: 17000000, hours: 85 },
    { month: 'Tháng 7/2025', base: 15000000, bonus: 1800000, total: 16800000, hours: 80 },
    { month: 'Tháng 6/2025', base: 15000000, bonus: 2200000, total: 17200000, hours: 88 },
    { month: 'Tháng 5/2025', base: 15000000, bonus: 1900000, total: 16900000, hours: 82 }
  ];

  if (!isOpen) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'on-leave': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Đang hoạt động';
      case 'inactive': return 'Không hoạt động';
      case 'on-leave': return 'Nghỉ phép';
      default: return status;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'junior': return 'bg-blue-100 text-blue-800';
      case 'senior': return 'bg-red-100 text-red-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'junior': return 'Junior';
      case 'senior': return 'Senior';
      case 'expert': return 'Expert';
      default: return level;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };



  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
              {teacher.name.split(' ').pop()?.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{teacher.name}</h2>
              <div className="flex items-center space-x-4 mt-2">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(teacher.status)}`}>
                  {getStatusText(teacher.status)}
                </span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(teacher.level)}`}>
                  {getLevelText(teacher.level)}
                </span>

              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'profile', label: 'Hồ sơ', icon: User },
              { id: 'schedule', label: 'Lịch dạy', icon: Calendar },
              { id: 'performance', label: 'Hiệu suất', icon: BarChart3 },
              { id: 'salary', label: 'Lương', icon: DollarSign }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    Thông tin liên hệ
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm">{teacher.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm">{teacher.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm">{teacher.address}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Thống kê tổng quan
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Kinh nghiệm:</span>
                      <span className="text-sm font-medium">{teacher.experience} năm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Tổng lớp học:</span>
                      <span className="text-sm font-medium">{teacher.totalClasses}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Tổng học viên:</span>
                      <span className="text-sm font-medium">{teacher.totalStudents}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Giờ tháng này:</span>
                      <span className="text-sm font-medium text-blue-600">{teacher.hoursThisMonth}h</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Specializations */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Chuyên môn</h4>
                <div className="flex flex-wrap gap-2">
                  {teacher.specialization.map((spec, index) => (
                    <span key={index} className="inline-flex px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bio */}
              {teacher.bio && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Giới thiệu</h4>
                  <p className="text-gray-600 leading-relaxed">{teacher.bio}</p>
                </div>
              )}

              {/* Certifications */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Chứng chỉ</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {teacher.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Award className="w-4 h-4 mr-2 text-yellow-600" />
                      <span className="text-sm">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Ngôn ngữ</h4>
                <div className="flex flex-wrap gap-2">
                  {teacher.languages.map((lang, index) => (
                    <span key={index} className="inline-flex px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Lịch dạy hiện tại</h3>
                <span className="text-sm text-gray-600">{teachingSchedule.length} lớp học</span>
              </div>
              <div className="space-y-4">
                {teachingSchedule.map((schedule) => (
                  <div key={schedule.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{schedule.course}</h4>
                        <p className="text-sm text-gray-600 mt-1">Mã lớp: {schedule.class}</p>
                        <div className="flex items-center mt-2 space-x-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="w-4 h-4 mr-1" />
                            {schedule.time}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Users className="w-4 h-4 mr-1" />
                            {schedule.students} học viên
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="w-4 h-4 mr-1" />
                            {schedule.room}
                          </div>
                        </div>
                      </div>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Đang diễn ra
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Clock className="w-6 h-6 text-blue-600 mr-2" />
                    <div>
                      <p className="text-sm text-blue-600">Giờ dạy TB/tháng</p>
                      <p className="text-xl font-bold text-blue-900">80h</p>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center">

                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Users className="w-6 h-6 text-green-600 mr-2" />
                    <div>
                      <p className="text-sm text-green-600">Học viên TB/tháng</p>
                      <p className="text-xl font-bold text-green-900">36</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Biểu đồ hiệu suất 5 tháng gần nhất</h4>
                <div className="space-y-3">
                  {performanceData.map((data, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">{data.month}</span>
                        <div className="flex items-center space-x-6">
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Giờ dạy</p>
                            <p className="font-medium">{data.hours}h</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Học viên</p>
                            <p className="font-medium">{data.students}</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 flex space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(data.hours / 100) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'salary' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <DollarSign className="w-6 h-6 text-green-600 mr-2" />
                    <div>
                      <p className="text-sm text-green-600">Lương cơ bản</p>
                      <p className="text-xl font-bold text-green-900">{formatCurrency(teacher.salary)}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <TrendingUp className="w-6 h-6 text-blue-600 mr-2" />
                    <div>
                      <p className="text-sm text-blue-600">Lương tháng này</p>
                      <p className="text-xl font-bold text-blue-900">{formatCurrency(17000000)}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Clock className="w-6 h-6 text-red-600 mr-2" />
                    <div>
                      <p className="text-sm text-red-600">Giờ dạy</p>
                      <p className="text-xl font-bold text-red-900">{teacher.hoursThisMonth}h</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Lịch sử lương</h4>
                <div className="space-y-3">
                  {salaryHistory.map((salary, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">{salary.month}</span>
                        <div className="text-right">
                          <div className="font-bold text-green-600">{formatCurrency(salary.total)}</div>
                          <div className="text-xs text-gray-500">{salary.hours} giờ</div>
                        </div>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Lương cơ bản:</span>
                          <span className="ml-2 font-medium">{formatCurrency(salary.base)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Thưởng:</span>
                          <span className="ml-2 font-medium text-blue-600">{formatCurrency(salary.bonus)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDetailModal;
