import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEOHead } from '../../../components/common';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Users, 
  GraduationCap,
  CheckCircle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

interface StudentFormData {
  // Personal Info
  full_name: string;
  birth_date: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  phone: string;
  email: string;
  address: string;
  
  // Parent Info
  parent_name: string;
  parent_phone: string;
  parent_email: string;
  parent_relationship: string;
  
  // Academic Info
  school_level: string;
  current_school: string;
  subjects_of_interest: string[];
}

const StudentRegistration: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<StudentFormData>({
    full_name: '',
    birth_date: '',
    gender: 'MALE',
    phone: '',
    email: '',
    address: '',
    parent_name: '',
    parent_phone: '',
    parent_email: '',
    parent_relationship: 'Phụ huynh',
    school_level: '',
    current_school: '',
    subjects_of_interest: [],
  });

  const steps = [
    { number: 1, title: 'Thông tin cá nhân', icon: User },
    { number: 2, title: 'Thông tin phụ huynh', icon: Users },
    { number: 3, title: 'Thông tin học vụ', icon: GraduationCap },
    { number: 4, title: 'Xác nhận', icon: CheckCircle },
  ];

  const handleInputChange = (field: keyof StudentFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // TODO: Call API to register student
      console.log('Submitting:', formData);
      
      alert('Đăng ký thành công! Mã học viên: HS2025XXX');
      navigate('/staff/students');
    } catch (error) {
      alert('Đăng ký thất bại');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Thông tin cá nhân</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Nguyễn Văn A"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày sinh <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.birth_date}
                  onChange={(e) => handleInputChange('birth_date', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giới tính <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                  <option value="OTHER">Khác</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="0901234567"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="nguyenvana@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Địa chỉ <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                rows={3}
                placeholder="123 Đường ABC, Quận XYZ, TP.HCM"
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Thông tin phụ huynh</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Họ tên phụ huynh <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.parent_name}
                onChange={(e) => handleInputChange('parent_name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Nguyễn Văn B"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mối quan hệ <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.parent_relationship}
                onChange={(e) => handleInputChange('parent_relationship', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="Cha">Cha</option>
                <option value="Mẹ">Mẹ</option>
                <option value="Anh/Chị">Anh/Chị</option>
                <option value="Người giám hộ">Người giám hộ</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại phụ huynh <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.parent_phone}
                onChange={(e) => handleInputChange('parent_phone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="0901234567"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email phụ huynh <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.parent_email}
                onChange={(e) => handleInputChange('parent_email', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="phuhuynh@example.com"
                required
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Thông tin học vụ</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cấp học <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.school_level}
                onChange={(e) => handleInputChange('school_level', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                required
              >
                <option value="">-- Chọn cấp học --</option>
                <option value="Tiểu học">Tiểu học</option>
                <option value="THCS">THCS</option>
                <option value="THPT">THPT</option>
                <option value="Đại học">Đại học</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trường đang học
              </label>
              <input
                type="text"
                value={formData.current_school}
                onChange={(e) => handleInputChange('current_school', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="THPT Lê Quý Đôn"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Môn học quan tâm
              </label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {['Toán', 'Vật lý', 'Hóa học', 'Sinh học', 'Tiếng Anh', 'IELTS'].map(subject => (
                  <label key={subject} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.subjects_of_interest.includes(subject)}
                      onChange={(e) => {
                        const newSubjects = e.target.checked
                          ? [...formData.subjects_of_interest, subject]
                          : formData.subjects_of_interest.filter(s => s !== subject);
                        handleInputChange('subjects_of_interest', newSubjects);
                      }}
                      className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                    />
                    <span className="text-sm text-gray-700">{subject}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Xác nhận thông tin</h3>
            
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Thông tin cá nhân</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-600">Họ tên:</span> <span className="font-medium">{formData.full_name}</span></div>
                  <div><span className="text-gray-600">Ngày sinh:</span> <span className="font-medium">{formData.birth_date}</span></div>
                  <div><span className="text-gray-600">Giới tính:</span> <span className="font-medium">{formData.gender === 'MALE' ? 'Nam' : 'Nữ'}</span></div>
                  <div><span className="text-gray-600">SĐT:</span> <span className="font-medium">{formData.phone}</span></div>
                  <div className="col-span-2"><span className="text-gray-600">Email:</span> <span className="font-medium">{formData.email}</span></div>
                  <div className="col-span-2"><span className="text-gray-600">Địa chỉ:</span> <span className="font-medium">{formData.address}</span></div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-900 mb-3">Thông tin phụ huynh</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-600">Họ tên:</span> <span className="font-medium">{formData.parent_name}</span></div>
                  <div><span className="text-gray-600">Quan hệ:</span> <span className="font-medium">{formData.parent_relationship}</span></div>
                  <div><span className="text-gray-600">SĐT:</span> <span className="font-medium">{formData.parent_phone}</span></div>
                  <div><span className="text-gray-600">Email:</span> <span className="font-medium">{formData.parent_email}</span></div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-900 mb-3">Thông tin học vụ</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-600">Cấp học:</span> <span className="font-medium">{formData.school_level}</span></div>
                  <div><span className="text-gray-600">Trường:</span> <span className="font-medium">{formData.current_school}</span></div>
                  <div className="col-span-2">
                    <span className="text-gray-600">Môn quan tâm:</span> 
                    <span className="font-medium ml-2">{formData.subjects_of_interest.join(', ')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <SEOHead
        title="Đăng ký học viên mới - DMT Education"
        description="Đăng ký học viên mới vào hệ thống"
      />

      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Đăng ký học viên mới
            </h1>
            <p className="text-gray-600">Hoàn thành các bước để tạo tài khoản học viên</p>
          </div>

          {/* Step Indicator */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;

                return (
                  <React.Fragment key={step.number}>
                    <div className="flex flex-col items-center flex-1">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                        isCompleted 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : isActive 
                          ? 'bg-cyan-500 border-red-500 text-white' 
                          : 'bg-white border-gray-300 text-gray-400'
                      }`}>
                        <Icon size={20} />
                      </div>
                      <div className="mt-2 text-center">
                        <p className={`text-sm font-medium ${
                          isActive ? 'text-cyan-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          Bước {step.number}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">{step.title}</p>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`h-1 flex-1 mx-4 rounded ${
                        currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ArrowLeft size={20} />
              Quay lại
            </button>

            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all"
              >
                Tiếp theo
                <ArrowRight size={20} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all"
              >
                <CheckCircle size={20} />
                Hoàn thành đăng ký
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentRegistration;
