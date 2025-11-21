import React, { useState } from 'react';
import { X, Calendar, Users, Clock, DollarSign, MapPin, BookOpen, Star, MessageCircle, FileText, TrendingUp } from 'lucide-react';
import { Course } from '../../../services/admin';

interface CourseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
}

const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  isOpen,
  onClose,
  course
}) => {
  const [activeTab, setActiveTab] = useState('info');

  // Mock data for demonstration
  const students = [
    { id: '1', name: 'Nguyễn Văn An', email: 'an@email.com', phone: '0901234567', status: 'active', progress: 85 },
    { id: '2', name: 'Trần Thị Bình', email: 'binh@email.com', phone: '0907654321', status: 'active', progress: 92 },
    { id: '3', name: 'Lê Minh Cường', email: 'cuong@email.com', phone: '0909876543', status: 'active', progress: 78 },
    { id: '4', name: 'Phạm Thị Dung', email: 'dung@email.com', phone: '0905432198', status: 'active', progress: 88 }
  ];

  const assignments = [
    { id: '1', title: 'Bài tập Unit 1', dueDate: '2025-02-15', submitted: 12, total: 15 },
    { id: '2', title: 'Speaking Practice', dueDate: '2025-02-20', submitted: 10, total: 15 },
    { id: '3', title: 'Mock Test 1', dueDate: '2025-02-25', submitted: 8, total: 15 }
  ];

  const attendance = [
    { date: '2025-01-06', present: 14, total: 15 },
    { date: '2025-01-08', present: 13, total: 15 },
    { date: '2025-01-10', present: 15, total: 15 },
    { date: '2025-01-13', present: 12, total: 15 },
    { date: '2025-01-15', present: 14, total: 15 }
  ];

  const reviews = [
    { id: '1', studentName: 'Nguyễn Văn An', comment: 'Khóa học rất hay, giáo viên nhiệt tình', date: '2025-01-10' },
    { id: '2', studentName: 'Trần Thị Bình', comment: 'Nội dung phong phú, phù hợp với trình độ', date: '2025-01-08' },
    { id: '3', studentName: 'Lê Minh Cường', comment: 'Giáo viên giảng dạy dễ hiểu, tài liệu đầy đủ', date: '2025-01-05' }
  ];

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

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner': return 'Cơ bản';
      case 'intermediate': return 'Trung cấp';
      case 'advanced': return 'Nâng cao';
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
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{course.title}</h2>
            <div className="flex items-center space-x-4 mt-2">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(course.status)}`}>
                {getStatusText(course.status)}
              </span>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(course.level)}`}>
                {getLevelText(course.level)}
              </span>
              <span className="text-sm text-gray-600">{course.category}</span>
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
              { id: 'info', label: 'Thông tin', icon: BookOpen },
              { id: 'students', label: 'Học viên', icon: Users },
              { id: 'assignments', label: 'Bài tập', icon: FileText },
              { id: 'attendance', label: 'Điểm danh', icon: Calendar },
              { id: 'reviews', label: 'Đánh giá', icon: Star }
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
          {activeTab === 'info' && (
            <div className="space-y-6">
              {/* Course Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Mô tả khóa học</h3>
                  <p className="text-gray-600 leading-relaxed">{course.description}</p>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Học phí</span>
                      <span className="text-lg font-bold text-blue-600">{formatCurrency(course.price)}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Thời lượng</span>
                      <span className="font-medium">{course.duration} tuần</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Học viên</span>
                      <span className="font-medium">{course.currentStudents}/{course.maxStudents}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Schedule & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Lịch học
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{course.schedule}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      <span>
                        {new Date(course.startDate).toLocaleDateString('vi-VN')} - {new Date(course.endDate).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{course.location}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Thống kê
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Tỷ lệ lấp đầy</span>
                      <span className="font-medium">{Math.round((course.currentStudents / course.maxStudents) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(course.currentStudents / course.maxStudents) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Đánh giá trung bình</span>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        <span className="font-medium">4.8</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Materials */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Tài liệu học tập</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <ul className="space-y-2">
                    {course.materials?.map((material, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <BookOpen className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{material}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Danh sách học viên</h3>
                <span className="text-sm text-gray-600">{students.length} học viên</span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Học viên</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Liên hệ</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tiến độ</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student) => (
                      <tr key={student.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{student.email}</div>
                          <div className="text-sm text-gray-500">{student.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: `${student.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600">{student.progress}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Đang học
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'assignments' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Bài tập và kiểm tra</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Tạo bài tập mới
                </button>
              </div>
              <div className="space-y-4">
                {assignments.map((assignment) => (
                  <div key={assignment.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          Hạn nộp: {new Date(assignment.dueDate).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {assignment.submitted}/{assignment.total} đã nộp
                        </div>
                        <div className="text-xs text-gray-500">
                          {Math.round((assignment.submitted / assignment.total) * 100)}% hoàn thành
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(assignment.submitted / assignment.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'attendance' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Lịch sử điểm danh</h3>
                <span className="text-sm text-gray-600">5 buổi học gần nhất</span>
              </div>
              <div className="space-y-3">
                {attendance.map((record, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-gray-900">
                          {new Date(record.date).toLocaleDateString('vi-VN')}
                        </div>
                        <div className="text-sm text-gray-500">
                          Buổi học {index + 1}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">
                          {record.present}/{record.total} có mặt
                        </div>
                        <div className="text-sm text-gray-500">
                          {Math.round((record.present / record.total) * 100)}% tỷ lệ tham dự
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          (record.present / record.total) >= 0.9 ? 'bg-green-600' :
                          (record.present / record.total) >= 0.8 ? 'bg-yellow-600' : 'bg-red-600'
                        }`}
                        style={{ width: `${(record.present / record.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Đánh giá từ học viên</h3>
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                  <span className="font-medium">4.8</span>
                  <span className="text-sm text-gray-500 ml-1">({reviews.length} đánh giá)</span>
                </div>
              </div>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium text-gray-900">{review.studentName}</div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(review.date).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailModal;
