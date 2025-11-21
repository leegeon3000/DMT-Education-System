import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, Users, DollarSign, Clock, BookOpen, MapPin, FileText } from 'lucide-react';
import { Course } from '../../../services/admin';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (course: Partial<Course>) => void;
  course?: Course;
  isEditing?: boolean;
}

const CourseModal: React.FC<CourseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  course,
  isEditing = false
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'beginner',
    duration: 8,
    schedule: '',
    startDate: '',
    endDate: '',
    maxStudents: 15,
    teacherId: '',
    price: 0,
    status: 'upcoming',
    materials: [''],
    location: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (course && isEditing) {
      setFormData({
        title: course.title,
        description: course.description,
        category: course.category,
        level: course.level,
        duration: course.duration,
        schedule: course.schedule,
        startDate: course.startDate,
        endDate: course.endDate,
        maxStudents: course.maxStudents,
        teacherId: course.teacherId,
        price: course.price,
        status: course.status,
        materials: course.materials || [''],
        location: course.location || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: '',
        level: 'beginner',
        duration: 8,
        schedule: '',
        startDate: '',
        endDate: '',
        maxStudents: 15,
        teacherId: '',
        price: 0,
        status: 'upcoming',
        materials: [''],
        location: ''
      });
    }
    setErrors({});
  }, [course, isEditing, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Tên khóa học là bắt buộc';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Mô tả khóa học là bắt buộc';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Danh mục là bắt buộc';
    }

    if (!formData.schedule.trim()) {
      newErrors.schedule = 'Lịch học là bắt buộc';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Ngày bắt đầu là bắt buộc';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'Ngày kết thúc là bắt buộc';
    }

    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
    }

    if (formData.maxStudents <= 0) {
      newErrors.maxStudents = 'Số học viên tối đa phải lớn hơn 0';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Học phí phải lớn hơn 0';
    }

    if (!formData.teacherId) {
      newErrors.teacherId = 'Giáo viên phụ trách là bắt buộc';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Địa điểm học là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const courseData = {
      ...formData,
      materials: formData.materials.filter(material => material.trim() !== '')
    };

    onSave(courseData);
    onClose();
  };

  const handleMaterialChange = (index: number, value: string) => {
    const newMaterials = [...formData.materials];
    newMaterials[index] = value;
    setFormData({ ...formData, materials: newMaterials });
  };

  const addMaterial = () => {
    setFormData({
      ...formData,
      materials: [...formData.materials, '']
    });
  };

  const removeMaterial = (index: number) => {
    const newMaterials = formData.materials.filter((_, i) => i !== index);
    setFormData({ ...formData, materials: newMaterials });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Chỉnh sửa khóa học' : 'Tạo khóa học mới'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <BookOpen className="w-4 h-4 inline mr-2" />
                Tên khóa học *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nhập tên khóa học..."
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Mô tả khóa học *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Mô tả chi tiết về khóa học..."
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Chọn danh mục</option>
                <option value="IELTS">IELTS</option>
                <option value="TOEIC">TOEIC</option>
                <option value="Giao tiếp">Giao tiếp</option>
                <option value="Business">Business English</option>
                <option value="Academic">Academic English</option>
                <option value="Kids">Tiếng Anh trẻ em</option>
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cấp độ</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="beginner">Cơ bản</option>
                <option value="intermediate">Trung cấp</option>
                <option value="advanced">Nâng cao</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-2" />
                Thời lượng (tuần)
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-2" />
                Học phí (VNĐ) *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                min="0"
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>
          </div>

          {/* Schedule Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Lịch học *
              </label>
              <input
                type="text"
                value={formData.schedule}
                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.schedule ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="VD: T2,T4,T6 - 8:00-10:00"
              />
              {errors.schedule && <p className="text-red-500 text-sm mt-1">{errors.schedule}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ngày bắt đầu *</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.startDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ngày kết thúc *</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.endDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-2" />
                Số học viên tối đa *
              </label>
              <input
                type="number"
                value={formData.maxStudents}
                onChange={(e) => setFormData({ ...formData, maxStudents: parseInt(e.target.value) || 0 })}
                min="1"
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.maxStudents ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.maxStudents && <p className="text-red-500 text-sm mt-1">{errors.maxStudents}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Địa điểm học *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.location ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="VD: Phòng 201"
              />
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
            </div>
          </div>

          {/* Teacher and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Giáo viên phụ trách *</label>
              <select
                value={formData.teacherId}
                onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.teacherId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Chọn giáo viên</option>
                <option value="teacher1">Ms. Nguyễn Thị Lan</option>
                <option value="teacher2">Mr. Trần Văn Nam</option>
                <option value="teacher3">Ms. Lê Thị Hoa</option>
                <option value="teacher4">Mr. Phạm Minh Tuấn</option>
              </select>
              {errors.teacherId && <p className="text-red-500 text-sm mt-1">{errors.teacherId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="upcoming">Sắp khai giảng</option>
                <option value="ongoing">Đang diễn ra</option>
                <option value="completed">Hoàn thành</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
          </div>

          {/* Materials */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tài liệu học tập</label>
            <div className="space-y-2">
              {formData.materials.map((material, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={material}
                    onChange={(e) => handleMaterialChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tên tài liệu..."
                  />
                  {formData.materials.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMaterial(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addMaterial}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                + Thêm tài liệu
              </button>
            </div>
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
              {isEditing ? 'Cập nhật' : 'Tạo khóa học'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseModal;
