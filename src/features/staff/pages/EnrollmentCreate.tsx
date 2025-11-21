import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEOHead } from '../../../components/common';
import { 
  Search,
  User,
  BookOpen,
  CreditCard,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Users,
  DollarSign,
  AlertCircle,
  Clock,
  MapPin
} from 'lucide-react';

interface Student {
  id: number;
  student_code: string;
  full_name: string;
  phone: string;
  email: string;
}

interface Class {
  id: number;
  class_code: string;
  class_name: string;
  teacher_name: string;
  schedule: string;
  start_date: string;
  end_date: string;
  capacity: number;
  enrolled: number;
  fee: number;
  location: string;
}

const EnrollmentCreate: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Step 1: Student Selection
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  // Step 2: Class Selection
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  
  // Step 3: Payment & Discount
  const [discountPercent, setDiscountPercent] = useState(0);
  const [paymentPlan, setPaymentPlan] = useState<'FULL' | 'INSTALLMENT'>('FULL');
  const [initialPayment, setInitialPayment] = useState(0);
  const [notes, setNotes] = useState('');

  // Mock data
  const mockStudents: Student[] = [
    { id: 1, student_code: 'HS2025001', full_name: 'Nguyễn Văn A', phone: '0901234567', email: 'nguyenvana@email.com' },
    { id: 2, student_code: 'HS2025002', full_name: 'Trần Thị B', phone: '0902345678', email: 'tranthib@email.com' },
    { id: 3, student_code: 'HS2025003', full_name: 'Lê Văn C', phone: '0903456789', email: 'levanc@email.com' },
  ];

  const mockClasses: Class[] = [
    {
      id: 1,
      class_code: 'TOAN10A-HK1',
      class_name: 'Toán 10A - Học kỳ 1',
      teacher_name: 'Thầy Nguyễn Văn B',
      schedule: 'Thứ 2, 4, 6 (18:00-20:00)',
      start_date: '2025-02-01',
      end_date: '2025-05-31',
      capacity: 25,
      enrolled: 18,
      fee: 5000000,
      location: 'Phòng 301 - Tòa A'
    },
    {
      id: 2,
      class_code: 'VATLY11B-HK1',
      class_name: 'Vật lý 11B - Học kỳ 1',
      teacher_name: 'Cô Phạm Thị C',
      schedule: 'Thứ 3, 5, 7 (19:00-21:00)',
      start_date: '2025-02-05',
      end_date: '2025-06-15',
      capacity: 20,
      enrolled: 15,
      fee: 4500000,
      location: 'Phòng 205 - Tòa B'
    },
    {
      id: 3,
      class_code: 'IELTS-FOUND-2025',
      class_name: 'IELTS Foundation',
      teacher_name: 'Ms. Sarah Johnson',
      schedule: 'Thứ 2, 4, 6 (17:00-19:00)',
      start_date: '2025-02-10',
      end_date: '2025-06-20',
      capacity: 15,
      enrolled: 14,
      fee: 6000000,
      location: 'Phòng 102 - Tòa C'
    },
  ];

  const filteredStudents = mockStudents.filter(student =>
    student.full_name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    student.student_code.toLowerCase().includes(studentSearch.toLowerCase()) ||
    student.phone.includes(studentSearch)
  );

  const calculateFinalFee = () => {
    if (!selectedClass) return 0;
    const discount = (selectedClass.fee * discountPercent) / 100;
    return selectedClass.fee - discount;
  };

  const handleSubmit = () => {
    if (!selectedStudent || !selectedClass) {
      alert('Vui lòng hoàn tất tất cả các bước!');
      return;
    }

    const enrollmentData = {
      student: selectedStudent,
      class: selectedClass,
      discount_percent: discountPercent,
      payment_plan: paymentPlan,
      initial_payment: paymentPlan === 'INSTALLMENT' ? initialPayment : calculateFinalFee(),
      notes: notes
    };

    console.log('Enrollment data:', enrollmentData);
    alert('Đăng ký lớp thành công! Đang chuyển hướng...');
    navigate('/staff/enrollments');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const steps = [
    { number: 1, title: 'Chọn học viên', icon: User },
    { number: 2, title: 'Chọn lớp học', icon: BookOpen },
    { number: 3, title: 'Thanh toán & Giảm giá', icon: CreditCard },
    { number: 4, title: 'Xác nhận', icon: CheckCircle },
  ];

  return (
    <>
      <SEOHead
        title="Tạo đăng ký lớp mới - DMT Education"
        description="Đăng ký học viên vào lớp học"
      />

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Tạo đăng ký lớp mới
            </h1>
            <p className="text-gray-600 mt-1">Đăng ký học viên vào lớp học</p>
          </div>

          {/* Step Indicator */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;
                
                return (
                  <React.Fragment key={step.number}>
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          isCompleted
                            ? 'bg-green-500 text-white'
                            : isActive
                            ? 'bg-cyan-600 text-white'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        <Icon size={24} />
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          isActive ? 'text-cyan-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                        }`}
                      >
                        {step.title}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`flex-1 h-1 mx-4 rounded ${
                          currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* Step 1: Student Selection */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Tìm và chọn học viên</h3>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Tìm theo tên, mã học viên, số điện thoại..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>

                <div className="grid gap-3 max-h-96 overflow-y-auto">
                  {filteredStudents.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <User size={48} className="mx-auto mb-2 text-gray-400" />
                      <p>Không tìm thấy học viên</p>
                    </div>
                  ) : (
                    filteredStudents.map(student => (
                      <div
                        key={student.id}
                        onClick={() => setSelectedStudent(student)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedStudent?.id === student.id
                            ? 'border-cyan-500 bg-cyan-50'
                            : 'border-gray-200 hover:border-cyan-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-900">{student.full_name}</p>
                            <p className="text-sm text-gray-600 mt-1">Mã: {student.student_code}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                              <span>📞 {student.phone}</span>
                              <span>✉️ {student.email}</span>
                            </div>
                          </div>
                          {selectedStudent?.id === student.id && (
                            <CheckCircle className="text-cyan-500" size={24} />
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Class Selection */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Chọn lớp học</h3>
                
                {selectedStudent && (
                  <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-cyan-800">
                      <strong>Học viên:</strong> {selectedStudent.full_name} ({selectedStudent.student_code})
                    </p>
                  </div>
                )}

                <div className="grid gap-4 max-h-96 overflow-y-auto">
                  {mockClasses.map(cls => {
                    const spotsLeft = cls.capacity - cls.enrolled;
                    const isFull = spotsLeft === 0;
                    
                    return (
                      <div
                        key={cls.id}
                        onClick={() => !isFull && setSelectedClass(cls)}
                        className={`p-4 border rounded-lg transition-all ${
                          isFull
                            ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                            : selectedClass?.id === cls.id
                            ? 'border-cyan-500 bg-cyan-50 cursor-pointer'
                            : 'border-gray-200 hover:border-cyan-300 hover:bg-gray-50 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-gray-900">{cls.class_name}</h4>
                              {isFull && (
                                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                                  Hết chỗ
                                </span>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <User size={16} />
                                <span>{cls.teacher_name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock size={16} />
                                <span>{cls.schedule}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar size={16} />
                                <span>{formatDate(cls.start_date)} - {formatDate(cls.end_date)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin size={16} />
                                <span>{cls.location}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users size={16} />
                                <span>{cls.enrolled}/{cls.capacity} học viên</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <DollarSign size={16} />
                                <span className="font-semibold text-green-600">{formatCurrency(cls.fee)}</span>
                              </div>
                            </div>
                          </div>
                          
                          {selectedClass?.id === cls.id && (
                            <CheckCircle className="text-cyan-500 ml-4" size={24} />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Payment & Discount */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Thông tin thanh toán</h3>
                
                {selectedStudent && selectedClass && (
                  <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 mb-4 space-y-2">
                    <p className="text-sm text-cyan-800">
                      <strong>Học viên:</strong> {selectedStudent.full_name}
                    </p>
                    <p className="text-sm text-cyan-800">
                      <strong>Lớp học:</strong> {selectedClass.class_name}
                    </p>
                    <p className="text-sm text-cyan-800">
                      <strong>Học phí gốc:</strong> {formatCurrency(selectedClass.fee)}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giảm giá (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                  {discountPercent > 0 && selectedClass && (
                    <p className="text-sm text-green-600 mt-1">
                      Giảm: {formatCurrency((selectedClass.fee * discountPercent) / 100)}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hình thức thanh toán
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      onClick={() => setPaymentPlan('FULL')}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        paymentPlan === 'FULL'
                          ? 'border-cyan-500 bg-cyan-50'
                          : 'border-gray-300 hover:border-cyan-300'
                      }`}
                    >
                      <p className="font-medium text-gray-900">Thanh toán đầy đủ</p>
                      <p className="text-sm text-gray-600 mt-1">Thanh toán toàn bộ học phí</p>
                    </div>
                    <div
                      onClick={() => setPaymentPlan('INSTALLMENT')}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        paymentPlan === 'INSTALLMENT'
                          ? 'border-cyan-500 bg-cyan-50'
                          : 'border-gray-300 hover:border-cyan-300'
                      }`}
                    >
                      <p className="font-medium text-gray-900">Thanh toán theo đợt</p>
                      <p className="text-sm text-gray-600 mt-1">Chia nhỏ học phí</p>
                    </div>
                  </div>
                </div>

                {paymentPlan === 'INSTALLMENT' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số tiền thanh toán đợt đầu
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={calculateFinalFee()}
                      value={initialPayment}
                      onChange={(e) => setInitialPayment(Number(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="Nhập số tiền thanh toán đợt đầu"
                    />
                    {initialPayment > 0 && (
                      <p className="text-sm text-orange-600 mt-1">
                        Còn lại: {formatCurrency(calculateFinalFee() - initialPayment)}
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Ghi chú thêm (nếu có)..."
                  />
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-lg font-semibold text-green-800">
                    Tổng học phí sau giảm giá: {formatCurrency(calculateFinalFee())}
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Xác nhận thông tin</h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Thông tin học viên</h4>
                    {selectedStudent && (
                      <div className="space-y-2 text-sm">
                        <p><strong>Họ tên:</strong> {selectedStudent.full_name}</p>
                        <p><strong>Mã học viên:</strong> {selectedStudent.student_code}</p>
                        <p><strong>Điện thoại:</strong> {selectedStudent.phone}</p>
                        <p><strong>Email:</strong> {selectedStudent.email}</p>
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Thông tin lớp học</h4>
                    {selectedClass && (
                      <div className="space-y-2 text-sm">
                        <p><strong>Lớp học:</strong> {selectedClass.class_name}</p>
                        <p><strong>Mã lớp:</strong> {selectedClass.class_code}</p>
                        <p><strong>Giáo viên:</strong> {selectedClass.teacher_name}</p>
                        <p><strong>Lịch học:</strong> {selectedClass.schedule}</p>
                        <p><strong>Thời gian:</strong> {formatDate(selectedClass.start_date)} - {formatDate(selectedClass.end_date)}</p>
                        <p><strong>Địa điểm:</strong> {selectedClass.location}</p>
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Thông tin thanh toán</h4>
                    {selectedClass && (
                      <div className="space-y-2 text-sm">
                        <p><strong>Học phí gốc:</strong> {formatCurrency(selectedClass.fee)}</p>
                        {discountPercent > 0 && (
                          <p className="text-green-600">
                            <strong>Giảm giá {discountPercent}%:</strong> -{formatCurrency((selectedClass.fee * discountPercent) / 100)}
                          </p>
                        )}
                        <p><strong>Tổng học phí:</strong> <span className="text-lg text-cyan-600 font-bold">{formatCurrency(calculateFinalFee())}</span></p>
                        <p><strong>Hình thức:</strong> {paymentPlan === 'FULL' ? 'Thanh toán đầy đủ' : 'Thanh toán theo đợt'}</p>
                        {paymentPlan === 'INSTALLMENT' && (
                          <>
                            <p><strong>Đợt đầu:</strong> {formatCurrency(initialPayment)}</p>
                            <p className="text-orange-600"><strong>Còn lại:</strong> {formatCurrency(calculateFinalFee() - initialPayment)}</p>
                          </>
                        )}
                        {notes && <p><strong>Ghi chú:</strong> {notes}</p>}
                      </div>
                    )}
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium mb-1">Lưu ý quan trọng:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Vui lòng kiểm tra kỹ thông tin trước khi xác nhận</li>
                        <li>Sau khi đăng ký, học viên sẽ nhận được email xác nhận</li>
                        <li>Liên hệ phòng học vụ nếu cần thay đổi thông tin</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  if (currentStep > 1) setCurrentStep(currentStep - 1);
                  else navigate('/staff/enrollments');
                }}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft size={20} />
                {currentStep === 1 ? 'Hủy' : 'Quay lại'}
              </button>

              {currentStep < 4 ? (
                <button
                  onClick={() => {
                    if (currentStep === 1 && !selectedStudent) {
                      alert('Vui lòng chọn học viên!');
                      return;
                    }
                    if (currentStep === 2 && !selectedClass) {
                      alert('Vui lòng chọn lớp học!');
                      return;
                    }
                    if (currentStep === 3 && paymentPlan === 'INSTALLMENT' && initialPayment === 0) {
                      alert('Vui lòng nhập số tiền thanh toán đợt đầu!');
                      return;
                    }
                    setCurrentStep(currentStep + 1);
                  }}
                  className="flex items-center gap-2 px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-all shadow-sm"
                >
                  Tiếp tục
                  <ArrowRight size={20} />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-sm"
                >
                  <CheckCircle size={20} />
                  Xác nhận đăng ký
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EnrollmentCreate;
