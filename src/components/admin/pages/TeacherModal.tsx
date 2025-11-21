import React, { useState, useEffect } from 'react';
import { X, Save, User, Mail, Phone, MapPin, Award, DollarSign, Calendar, BookOpen, Globe, FileText } from 'lucide-react';

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
  bio?: string;
  certifications: string[];
  languages: string[];
}

interface TeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (teacher: Partial<Teacher>) => void;
  teacher?: Teacher;
  isEditing?: boolean;
}

const TeacherModal: React.FC<TeacherModalProps> = ({
  isOpen,
  onClose,
  onSave,
  teacher,
  isEditing = false
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    specialization: [''],
    level: 'junior' as const,
    status: 'active' as const,
    hireDate: '',
    salary: 0,
    experience: 0,
    bio: '',
    certifications: [''],
    languages: ['']
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (teacher && isEditing) {
      setFormData({
        name: teacher.name,
        email: teacher.email,
        phone: teacher.phone,
        address: teacher.address,
        specialization: teacher.specialization.length > 0 ? teacher.specialization : [''],
        level: teacher.level,
        status: teacher.status,
        hireDate: teacher.hireDate,
        salary: teacher.salary,
        experience: teacher.experience,
        bio: teacher.bio || '',
        certifications: teacher.certifications.length > 0 ? teacher.certifications : [''],
        languages: teacher.languages.length > 0 ? teacher.languages : ['']
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        specialization: [''],
        level: 'junior',
        status: 'active',
        hireDate: '',
        salary: 0,
        experience: 0,
        bio: '',
        certifications: [''],
        languages: ['']
      });
    }
    setErrors({});
  }, [teacher, isEditing, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Họ tên là bắt buộc';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Số điện thoại là bắt buộc';
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Địa chỉ là bắt buộc';
    }

    if (!formData.hireDate) {
      newErrors.hireDate = 'Ngày vào làm là bắt buộc';
    }

    if (formData.salary <= 0) {
      newErrors.salary = 'Lương phải lớn hơn 0';
    }

    if (formData.experience < 0) {
      newErrors.experience = 'Kinh nghiệm không thể âm';
    }

    const validSpecializations = formData.specialization.filter(spec => spec.trim() !== '');
    if (validSpecializations.length === 0) {
      newErrors.specialization = 'Ít nhất một chuyên môn là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const teacherData = {
      ...formData,
      specialization: formData.specialization.filter(spec => spec.trim() !== ''),
      certifications: formData.certifications.filter(cert => cert.trim() !== ''),
      languages: formData.languages.filter(lang => lang.trim() !== '')
    };

    onSave(teacherData);
    onClose();
  };

  const handleArrayChange = (
    field: 'specialization' | 'certifications' | 'languages',
    index: number,
    value: string
  ) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field: 'specialization' | 'certifications' | 'languages') => {
    setFormData({
      ...formData,
      [field]: [...formData[field], '']
    });
  };

  const removeArrayItem = (field: 'specialization' | 'certifications' | 'languages', index: number) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Chỉnh sửa thông tin giáo viên' : 'Thêm giáo viên mới'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Thông tin cá nhân
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nhập họ và tên..."
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="email@example.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Số điện thoại *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0901234567"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Địa chỉ *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Địa chỉ..."
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2" />
              Thông tin nghề nghiệp
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cấp độ</label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="junior">Junior</option>
                  <option value="senior">Senior</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Đang hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                  <option value="on-leave">Nghỉ phép</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Ngày vào làm *
                </label>
                <input
                  type="date"
                  value={formData.hireDate}
                  onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.hireDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.hireDate && <p className="text-red-500 text-sm mt-1">{errors.hireDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số năm kinh nghiệm
                </label>
                <input
                  type="number"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
                  min="0"
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.experience ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Lương cơ bản (VNĐ) *
                </label>
                <input
                  type="number"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: parseInt(e.target.value) || 0 })}
                  min="0"
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.salary ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="8000000"
                />
                {errors.salary && <p className="text-red-500 text-sm mt-1">{errors.salary}</p>}
              </div>
            </div>
          </div>

          {/* Specializations */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <BookOpen className="w-4 h-4 inline mr-1" />
              Chuyên môn *
            </label>
            <div className="space-y-2">
              {formData.specialization.map((spec, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <select
                    value={spec}
                    onChange={(e) => handleArrayChange('specialization', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Chọn chuyên môn</option>
                    <option value="IELTS">IELTS</option>
                    <option value="TOEIC">TOEIC</option>
                    <option value="Academic Writing">Academic Writing</option>
                    <option value="Business English">Business English</option>
                    <option value="Giao tiếp">Giao tiếp</option>
                    <option value="Speaking">Speaking</option>
                    <option value="Grammar">Grammar</option>
                    <option value="Foundation">Foundation</option>
                    <option value="Kids English">Kids English</option>
                    <option value="Phonics">Phonics</option>
                  </select>
                  {formData.specialization.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('specialization', index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('specialization')}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                + Thêm chuyên môn
              </button>
              {errors.specialization && <p className="text-red-500 text-sm mt-1">{errors.specialization}</p>}
            </div>
          </div>

          {/* Languages */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Globe className="w-4 h-4 inline mr-1" />
              Ngôn ngữ
            </label>
            <div className="space-y-2">
              {formData.languages.map((lang, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={lang}
                    onChange={(e) => handleArrayChange('languages', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="VD: English (C1)"
                  />
                  {formData.languages.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('languages', index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('languages')}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                + Thêm ngôn ngữ
              </button>
            </div>
          </div>

          {/* Certifications */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Award className="w-4 h-4 inline mr-1" />
              Chứng chỉ
            </label>
            <div className="space-y-2">
              {formData.certifications.map((cert, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={cert}
                    onChange={(e) => handleArrayChange('certifications', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tên chứng chỉ..."
                  />
                  {formData.certifications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('certifications', index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('certifications')}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                + Thêm chứng chỉ
              </button>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-1" />
              Giới thiệu
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Mô tả ngắn về giáo viên..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {isEditing ? 'Cập nhật' : 'Thêm giáo viên'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherModal;
