import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, Users, Clock, MapPin, BookOpen, User } from 'lucide-react';

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

interface ClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (classData: Partial<ClassData>) => void;
  classData?: ClassData | null;
  mode: 'create' | 'edit';
}

const ClassModal: React.FC<ClassModalProps> = ({
  isOpen,
  onClose,
  onSave,
  classData,
  mode
}) => {
  const [formData, setFormData] = useState({
    name: '',
    courseId: '',
    teacherId: '',
    startDate: '',
    endDate: '',
    schedule: '',
    maxStudents: 15,
    room: '',
    description: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mock data for dropdowns
  const courses = [
    { id: 'course1', name: 'IELTS 6.5' },
    { id: 'course2', name: 'TOEIC 800+' },
    { id: 'course3', name: 'Giao tiếp cơ bản' },
    { id: 'course4', name: 'Business English' }
  ];

  const teachers = [
    { id: 'teacher1', name: 'Cô Nguyễn Thị A' },
    { id: 'teacher2', name: 'Thầy Trần Văn B' },
    { id: 'teacher3', name: 'Cô Lê Thị C' },
    { id: 'teacher4', name: 'Thầy Phạm Văn D' }
  ];

  const rooms = [
    'Phòng 101', 'Phòng 102', 'Phòng 103', 'Phòng 201', 'Phòng 202', 'Phòng 203'
  ];

  useEffect(() => {
    if (classData && mode === 'edit') {
      setFormData({
        name: classData.name || '',
        courseId: classData.courseId || '',
        teacherId: classData.teacherId || '',
        startDate: classData.startDate || '',
        endDate: classData.endDate || '',
        schedule: classData.schedule || '',
        maxStudents: classData.maxStudents || 15,
        room: classData.room || '',
        description: classData.description || ''
      });
    } else {
      setFormData({
        name: '',
        courseId: '',
        teacherId: '',
        startDate: '',
        endDate: '',
        schedule: '',
        maxStudents: 15,
        room: '',
        description: ''
      });
    }
    setErrors({});
  }, [classData, mode, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên lớp học là bắt buộc';
    }

    if (!formData.courseId) {
      newErrors.courseId = 'Vui lòng chọn khóa học';
    }

    if (!formData.teacherId) {
      newErrors.teacherId = 'Vui lòng chọn giáo viên';
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

    if (!formData.schedule.trim()) {
      newErrors.schedule = 'Lịch học là bắt buộc';
    }

    if (!formData.room.trim()) {
      newErrors.room = 'Phòng học là bắt buộc';
    }

    if (formData.maxStudents < 1 || formData.maxStudents > 50) {
      newErrors.maxStudents = 'Sĩ số tối đa phải từ 1 đến 50';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const selectedCourse = courses.find(c => c.id === formData.courseId);
    const selectedTeacher = teachers.find(t => t.id === formData.teacherId);

    const classDataToSave: Partial<ClassData> = {
      ...formData,
      courseName: selectedCourse?.name || '',
      teacherName: selectedTeacher?.name || '',
      currentStudents: classData?.currentStudents || 0,
      status: classData?.status || 'upcoming'
    };

    onSave(classDataToSave);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'maxStudents') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                  {mode === 'create' ? 'Tạo lớp học mới' : 'Chỉnh sửa thông tin lớp học'}
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Class Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên lớp học *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nhập tên lớp học"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Course */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Khóa học *
                  </label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      name="courseId"
                      value={formData.courseId}
                      onChange={handleInputChange}
                      className={`pl-10 w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.courseId ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Chọn khóa học</option>
                      {courses.map(course => (
                        <option key={course.id} value={course.id}>{course.name}</option>
                      ))}
                    </select>
                  </div>
                  {errors.courseId && (
                    <p className="mt-1 text-sm text-red-600">{errors.courseId}</p>
                  )}
                </div>

                {/* Teacher */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giáo viên *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      name="teacherId"
                      value={formData.teacherId}
                      onChange={handleInputChange}
                      className={`pl-10 w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.teacherId ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Chọn giáo viên</option>
                      {teachers.map(teacher => (
                        <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                      ))}
                    </select>
                  </div>
                  {errors.teacherId && (
                    <p className="mt-1 text-sm text-red-600">{errors.teacherId}</p>
                  )}
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày bắt đầu *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.startDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.startDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
                  )}
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày kết thúc *
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.endDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.endDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
                  )}
                </div>

                {/* Schedule */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lịch học *
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      name="schedule"
                      value={formData.schedule}
                      onChange={handleInputChange}
                      className={`pl-10 w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.schedule ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="VD: T2,T4,T6 - 8:00-10:00"
                    />
                  </div>
                  {errors.schedule && (
                    <p className="mt-1 text-sm text-red-600">{errors.schedule}</p>
                  )}
                </div>

                {/* Room */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phòng học *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      name="room"
                      value={formData.room}
                      onChange={handleInputChange}
                      className={`pl-10 w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.room ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Chọn phòng học</option>
                      {rooms.map(room => (
                        <option key={room} value={room}>{room}</option>
                      ))}
                    </select>
                  </div>
                  {errors.room && (
                    <p className="mt-1 text-sm text-red-600">{errors.room}</p>
                  )}
                </div>

                {/* Max Students */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sĩ số tối đa *
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="number"
                      name="maxStudents"
                      value={formData.maxStudents}
                      onChange={handleInputChange}
                      min="1"
                      max="50"
                      className={`pl-10 w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.maxStudents ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.maxStudents && (
                    <p className="mt-1 text-sm text-red-600">{errors.maxStudents}</p>
                  )}
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập mô tả về lớp học..."
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className="w-full inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                <Save className="w-4 h-4 mr-2" />
                {mode === 'create' ? 'Tạo lớp học' : 'Cập nhật'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClassModal;
