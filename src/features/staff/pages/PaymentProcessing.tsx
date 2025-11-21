import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEOHead } from '../../../components/common';
import { 
  Search, 
  CreditCard, 
  DollarSign, 
  FileText, 
  CheckCircle,
  AlertCircle,
  Printer,
  Send
} from 'lucide-react';

interface Student {
  id: number;
  student_code: string;
  full_name: string;
  phone: string;
  email: string;
}

interface Enrollment {
  id: number;
  class_name: string;
  total_fee: number;
  paid_amount: number;
  discount_percent: number;
  remaining: number;
}

const PaymentProcessing: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'search' | 'enrollment' | 'payment' | 'confirm'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [paymentData, setPaymentData] = useState({
    amount: 0,
    method: 'CASH',
    transaction_reference: '',
    notes: ''
  });

  // Mock data
  const mockStudents: Student[] = [
    {
      id: 1,
      student_code: 'HS2025001',
      full_name: 'Nguyễn Văn A',
      phone: '0901234567',
      email: 'nguyenvana@example.com'
    },
    {
      id: 2,
      student_code: 'HS2025002',
      full_name: 'Trần Thị B',
      phone: '0902345678',
      email: 'tranthib@example.com'
    }
  ];

  const mockEnrollments: Enrollment[] = [
    {
      id: 1,
      class_name: 'Toán 10A - Học kỳ 1',
      total_fee: 5000000,
      paid_amount: 2000000,
      discount_percent: 10,
      remaining: 2500000
    },
    {
      id: 2,
      class_name: 'Vật lý 10B - Học kỳ 1',
      total_fee: 4000000,
      paid_amount: 0,
      discount_percent: 0,
      remaining: 4000000
    }
  ];

  const filteredStudents = searchQuery 
    ? mockStudents.filter(s => 
        s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.student_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.phone.includes(searchQuery)
      )
    : [];

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    setStep('enrollment');
  };

  const handleSelectEnrollment = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setPaymentData(prev => ({ ...prev, amount: enrollment.remaining }));
    setStep('payment');
  };

  const handleSubmit = async () => {
    try {
      // TODO: Call API
      console.log('Processing payment:', {
        student: selectedStudent,
        enrollment: selectedEnrollment,
        payment: paymentData
      });
      
      setStep('confirm');
    } catch (error) {
      alert('Không thể ghi nhận thanh toán');
    }
  };

  const handlePrint = () => {
    alert('In biên lai - Chức năng đang phát triển');
  };

  const handleSendEmail = () => {
    alert('Gửi email - Chức năng đang phát triển');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const renderStepContent = () => {
    switch (step) {
      case 'search':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Tìm kiếm học viên</h3>
            
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Nhập tên, mã học viên hoặc số điện thoại..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                autoFocus
              />
            </div>

            {searchQuery && filteredStudents.length > 0 && (
              <div className="border border-gray-200 rounded-lg divide-y">
                {filteredStudents.map(student => (
                  <button
                    key={student.id}
                    onClick={() => handleSelectStudent(student)}
                    className="w-full p-4 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{student.full_name}</p>
                        <p className="text-sm text-gray-600">
                          {student.student_code} • {student.phone}
                        </p>
                      </div>
                      <CheckCircle size={20} className="text-gray-400" />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {searchQuery && filteredStudents.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle size={48} className="mx-auto mb-3 text-gray-400" />
                <p>Không tìm thấy học viên</p>
              </div>
            )}
          </div>
        );

      case 'enrollment':
        return (
          <div className="space-y-6">
            <div>
              <button
                onClick={() => setStep('search')}
                className="text-sm text-blue-600 hover:text-blue-700 mb-4"
              >
                ← Chọn học viên khác
              </button>
              <h3 className="text-xl font-bold text-gray-900">
                Chọn lớp học - {selectedStudent?.full_name}
              </h3>
              <p className="text-sm text-gray-600">Mã: {selectedStudent?.student_code}</p>
            </div>

            <div className="space-y-4">
              {mockEnrollments.map(enrollment => (
                <div
                  key={enrollment.id}
                  onClick={() => handleSelectEnrollment(enrollment)}
                  className="border-2 border-gray-200 rounded-lg p-4 hover:border-cyan-500 cursor-pointer transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{enrollment.class_name}</h4>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      enrollment.remaining > 0 
                        ? 'bg-yellow-100 text-yellow-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {enrollment.remaining > 0 ? 'Chưa thanh toán đủ' : 'Đã thanh toán'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Tổng học phí:</span>
                      <p className="font-semibold text-gray-900">{formatCurrency(enrollment.total_fee)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Giảm giá:</span>
                      <p className="font-semibold text-gray-900">{enrollment.discount_percent}%</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Đã thanh toán:</span>
                      <p className="font-semibold text-green-600">{formatCurrency(enrollment.paid_amount)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Còn lại:</span>
                      <p className="font-semibold text-cyan-600">{formatCurrency(enrollment.remaining)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-6">
            <div>
              <button
                onClick={() => setStep('enrollment')}
                className="text-sm text-blue-600 hover:text-blue-700 mb-4"
              >
                ← Chọn lớp khác
              </button>
              <h3 className="text-xl font-bold text-gray-900">Thông tin thanh toán</h3>
            </div>

            {/* Fee Details */}
            <div className="bg-cyan-50 rounded-lg p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Học viên</p>
                  <p className="font-semibold">{selectedStudent?.full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Lớp học</p>
                  <p className="font-semibold">{selectedEnrollment?.class_name}</p>
                </div>
              </div>
              <div className="border-t border-blue-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tổng học phí:</span>
                  <span className="font-medium">{formatCurrency(selectedEnrollment?.total_fee || 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Đã thanh toán:</span>
                  <span className="font-medium text-green-600">{formatCurrency(selectedEnrollment?.paid_amount || 0)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-blue-200 pt-2">
                  <span>Còn lại:</span>
                  <span className="text-cyan-600">{formatCurrency(selectedEnrollment?.remaining || 0)}</span>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số tiền thanh toán <span className="text-cyan-500">*</span>
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="number"
                    value={paymentData.amount}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                    max={selectedEnrollment?.remaining || 0}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Tối đa: {formatCurrency(selectedEnrollment?.remaining || 0)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phương thức thanh toán <span className="text-cyan-500">*</span>
                </label>
                <select
                  value={paymentData.method}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, method: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="CASH">Tiền mặt</option>
                  <option value="BANK_TRANSFER">Chuyển khoản</option>
                  <option value="CREDIT_CARD">Thẻ tín dụng</option>
                  <option value="E_WALLET">Ví điện tử</option>
                </select>
              </div>

              {paymentData.method !== 'CASH' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã giao dịch
                  </label>
                  <input
                    type="text"
                    value={paymentData.transaction_reference}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, transaction_reference: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="TXN123456"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú
                </label>
                <textarea
                  value={paymentData.notes}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Ghi chú thêm về thanh toán..."
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!paymentData.amount || paymentData.amount <= 0}
              className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Ghi nhận thanh toán
            </button>
          </div>
        );

      case 'confirm':
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={40} className="text-green-600" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Thanh toán thành công!
              </h3>
              <p className="text-gray-600">
                Đã ghi nhận thanh toán {formatCurrency(paymentData.amount)}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 text-left">
              <h4 className="font-semibold text-gray-900 mb-4">Thông tin giao dịch</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã biên lai:</span>
                  <span className="font-medium">BL{Date.now()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Học viên:</span>
                  <span className="font-medium">{selectedStudent?.full_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lớp học:</span>
                  <span className="font-medium">{selectedEnrollment?.class_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số tiền:</span>
                  <span className="font-medium text-green-600">{formatCurrency(paymentData.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phương thức:</span>
                  <span className="font-medium">{paymentData.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Thời gian:</span>
                  <span className="font-medium">{new Date().toLocaleString('vi-VN')}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handlePrint}
                className="flex-1 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
              >
                <Printer size={20} />
                In biên lai
              </button>
              <button
                onClick={handleSendEmail}
                className="flex-1 py-3 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-600 transition-all flex items-center justify-center gap-2"
              >
                <Send size={20} />
                Gửi email
              </button>
            </div>

            <button
              onClick={() => {
                setStep('search');
                setSelectedStudent(null);
                setSelectedEnrollment(null);
                setSearchQuery('');
                setPaymentData({ amount: 0, method: 'CASH', transaction_reference: '', notes: '' });
              }}
              className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
            >
              Ghi nhận thanh toán mới
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <SEOHead
        title="Ghi nhận thanh toán - DMT Education"
        description="Ghi nhận thanh toán học phí"
      />

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Ghi nhận thanh toán
            </h1>
            <p className="text-gray-600">Xử lý thanh toán học phí cho học viên</p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            {renderStepContent()}
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentProcessing;
