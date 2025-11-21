import React, { useState } from 'react';
import { X, Calendar, Users, Clock, MapPin, BookOpen, User, UserCheck, ClipboardList } from 'lucide-react';

interface ClassData {
  id: string;
  name: string;
  courseId: string;
  courseName: string;
  teacherId: string;
  teacherName: string;
  startDate: string;
  endDate: string;
  schedule: string;
  maxStudents: number;
  currentStudents: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  room: string;
  description?: string;
}

interface ClassDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  classData: ClassData;
}

const ClassDetailModal: React.FC<ClassDetailModalProps> = ({
  isOpen,
  onClose,
  classData
}) => {
  const [activeTab, setActiveTab] = useState('info');

  if (!isOpen) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming': return 'Sắp khai giảng';
      case 'ongoing': return 'Đang diễn ra';
      case 'completed': return 'Hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  // Mock data for students and attendance
  const students = [
    { id: '1', name: 'Nguyễn Văn A', email: 'nguyenvana@email.com', enrollDate: '2025-08-01', attendance: 95 },
    { id: '2', name: 'Trần Thị B', email: 'tranthib@email.com', enrollDate: '2025-08-01', attendance: 88 },
    { id: '3', name: 'Lê Văn C', email: 'levanc@email.com', enrollDate: '2025-08-05', attendance: 92 },
    { id: '4', name: 'Phạm Thị D', email: 'phamthid@email.com', enrollDate: '2025-08-10', attendance: 75 }
  ];

  const recentClasses = [
    { date: '2025-09-03', topic: 'Reading Skills - Part 1', attendance: 12, absent: [] },
    { date: '2025-09-01', topic: 'Listening Practice', attendance: 11, absent: ['Lê Văn C'] },
    { date: '2025-08-30', topic: 'Speaking Exercise', attendance: 12, absent: [] },
    { date: '2025-08-28', topic: 'Writing Task 1', attendance: 10, absent: ['Trần Thị B', 'Phạm Thị D'] }
  ];

  const schedule = [
    { day: 'Thứ 2', time: '8:00 - 10:00', topic: 'Reading & Vocabulary' },
    { day: 'Thứ 4', time: '8:00 - 10:00', topic: 'Listening & Grammar' },
    { day: 'Thứ 6', time: '8:00 - 10:00', topic: 'Writing & Speaking' }
  ];

  const tabs = [
    { id: 'info', name: 'Thông tin chung', icon: Calendar },
    { id: 'students', name: 'Danh sách học viên', icon: Users },
    { id: 'attendance', name: 'Điểm danh', icon: UserCheck },
    { id: 'schedule', name: 'Lịch học', icon: ClipboardList }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{classData.name}</h3>
                <p className="text-sm text-gray-500">{classData.courseName} - {classData.teacherName}</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(classData.status)}`}>
                  {getStatusText(classData.status)}
                </span>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className="w-5 h-5 mx-auto mb-1" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="px-6 py-6">
            {activeTab === 'info' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3">THÔNG TIN CƠ BẢN</h4>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <BookOpen className="w-4 h-4 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-900">{classData.courseName}</span>
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-900">{classData.teacherName}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-900">{classData.room}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-900">{classData.schedule}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3">THỜI GIAN & SĨ SỐ</h4>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-900">
                          {new Date(classData.startDate).toLocaleDateString('vi-VN')} - {new Date(classData.endDate).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-900">
                          {classData.currentStudents}/{classData.maxStudents} học viên
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-blue-600">Tỉ lệ lấp đầy</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {Math.round((classData.currentStudents / classData.maxStudents) * 100)}%
                    </p>
                    <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(classData.currentStudents / classData.maxStudents) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-green-600">Tỉ lệ điểm danh trung bình</p>
                    <p className="text-2xl font-bold text-green-900">89%</p>
                    <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                      <div className="bg-green-600 h-2 rounded-full transition-all duration-300" style={{ width: '89%' }}></div>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-purple-600">Số buổi đã học</p>
                    <p className="text-2xl font-bold text-purple-900">24/36</p>
                    <div className="w-full bg-purple-200 rounded-full h-2 mt-2">
                      <div className="bg-purple-600 h-2 rounded-full transition-all duration-300" style={{ width: '67%' }}></div>
                    </div>
                  </div>
                </div>

                {classData.description && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3">MÔ TẢ</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-700">{classData.description}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'students' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-medium text-gray-900">Danh sách học viên ({students.length})</h4>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                    Thêm học viên
                  </button>
                </div>
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Học viên</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đăng ký</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tỉ lệ điểm danh</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {students.map((student) => (
                        <tr key={student.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8">
                                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                                  <span className="text-xs font-medium text-white">
                                    {student.name.charAt(0)}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">{student.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {student.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(student.enrollDate).toLocaleDateString('vi-VN')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className={`text-sm font-medium mr-2 ${
                                student.attendance >= 90 ? 'text-green-600' :
                                student.attendance >= 80 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {student.attendance}%
                              </span>
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    student.attendance >= 90 ? 'bg-green-600' :
                                    student.attendance >= 80 ? 'bg-yellow-600' : 'bg-red-600'
                                  }`}
                                  style={{ width: `${student.attendance}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'attendance' && (
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900">Lịch sử điểm danh</h4>
                <div className="space-y-3">
                  {recentClasses.map((classSession, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">
                            {new Date(classSession.date).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <UserCheck className="w-4 h-4 text-green-500 mr-1" />
                          <span className="text-sm text-green-600 font-medium">
                            {classSession.attendance}/{classData.currentStudents}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{classSession.topic}</p>
                      {classSession.absent.length > 0 && (
                        <div className="flex items-center">
                          <span className="text-xs text-red-600 mr-2">Vắng mặt:</span>
                          <span className="text-xs text-red-600">{classSession.absent.join(', ')}</span>
                        </div>
                      )}
                      {classSession.absent.length === 0 && (
                        <div className="text-xs text-green-600">Tất cả có mặt</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900">Lịch học trong tuần</h4>
                <div className="grid grid-cols-1 gap-4">
                  {schedule.map((session, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{session.day}</p>
                            <p className="text-xs text-gray-500">{session.time}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-900">{session.topic}</p>
                          <p className="text-xs text-gray-500">{classData.room}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-3 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassDetailModal;
