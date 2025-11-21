import React, { useState } from 'react';
import { X, User, Mail, Phone, MapPin, Calendar, CreditCard, BookOpen, Clock, FileText } from 'lucide-react';
import { Student } from '../../../services/admin';

interface StudentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
}

const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  isOpen,
  onClose,
  student
}) => {
  const [activeTab, setActiveTab] = useState('info');

  if (!isOpen) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'graduated': return 'bg-blue-100 text-blue-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'partial': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Đang học';
      case 'inactive': return 'Tạm dừng';
      case 'graduated': return 'Tốt nghiệp';
      case 'suspended': return 'Bị đình chỉ';
      default: return status;
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Đã thanh toán';
      case 'pending': return 'Chờ thanh toán';
      case 'overdue': return 'Quá hạn';
      case 'partial': return 'Thanh toán một phần';
      default: return status;
    }
  };

  // Mock data for additional information
  const enrollmentHistory = [
    { course: 'IELTS 6.5', startDate: '2025-08-01', status: 'Đang học', progress: 75 },
    { course: 'TOEIC 800+', startDate: '2025-06-01', status: 'Hoàn thành', progress: 100 }
  ];

  const paymentHistory = [
    { date: '2025-08-01', amount: 2500000, description: 'Học phí IELTS 6.5', status: 'Đã thanh toán' },
    { date: '2025-06-01', amount: 2000000, description: 'Học phí TOEIC 800+', status: 'Đã thanh toán' },
    { date: '2025-09-01', amount: 500000, description: 'Tài liệu học tập', status: 'Chờ thanh toán' }
  ];

  const attendanceData = [
    { date: '2025-09-01', status: 'Có mặt', course: 'IELTS 6.5' },
    { date: '2025-08-30', status: 'Có mặt', course: 'IELTS 6.5' },
    { date: '2025-08-28', status: 'Vắng mặt', course: 'IELTS 6.5' },
    { date: '2025-08-26', status: 'Có mặt', course: 'IELTS 6.5' }
  ];

  const tabs = [
    { id: 'info', name: 'Thông tin cá nhân', icon: User },
    { id: 'courses', name: 'Khóa học', icon: BookOpen },
    { id: 'payments', name: 'Thanh toán', icon: CreditCard },
    { id: 'attendance', name: 'Điểm danh', icon: Clock }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-12 w-12">
                  <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-lg font-medium text-white">
                      {student.fullName.charAt(0)}
                    </span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{student.fullName}</h3>
                  <p className="text-sm text-gray-500">{student.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(student.status)}`}>
                  {getStatusText(student.status)}
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
                    <h4 className="text-sm font-medium text-gray-500 mb-3">THÔNG TIN CÁ NHÂN</h4>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-900">{student.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-900">{student.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-900">
                          {new Date(student.dateOfBirth).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="w-4 h-4 text-gray-400 mr-3 mt-0.5" />
                        <span className="text-sm text-gray-900">{student.address}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3">THÔNG TIN PHỤ HUYNH</h4>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-900">{student.parentName || 'Chưa cập nhật'}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-900">{student.parentPhone || 'Chưa cập nhật'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-3">THÔNG TIN ĐĂNG KÝ</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-gray-600">Ngày đăng ký</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {new Date(student.enrollmentDate).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-gray-600">Trạng thái học tập</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(student.status)}`}>
                        {getStatusText(student.status)}
                      </span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-gray-600">Trạng thái thanh toán</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(student.paymentStatus)}`}>
                        {getPaymentStatusText(student.paymentStatus)}
                      </span>
                    </div>
                  </div>
                </div>

                {student.notes && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3">GHI CHÚ</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-700">{student.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'courses' && (
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900">Lịch sử khóa học</h4>
                {enrollmentHistory.map((enrollment, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-md font-medium text-gray-900">{enrollment.course}</h5>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        enrollment.status === 'Đang học' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {enrollment.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">
                        Bắt đầu: {new Date(enrollment.startDate).toLocaleDateString('vi-VN')}
                      </span>
                      <span className="text-sm text-gray-600">{enrollment.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${enrollment.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900">Lịch sử thanh toán</h4>
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số tiền</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paymentHistory.map((payment, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(payment.date).toLocaleDateString('vi-VN')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {payment.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(payment.amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              payment.status === 'Đã thanh toán' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {payment.status}
                            </span>
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
                <div className="grid grid-cols-1 gap-3">
                  {attendanceData.map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${
                          record.status === 'Có mặt' ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(record.date).toLocaleDateString('vi-VN')}
                          </p>
                          <p className="text-xs text-gray-500">{record.course}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        record.status === 'Có mặt' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {record.status}
                      </span>
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

export default StudentDetailModal;
