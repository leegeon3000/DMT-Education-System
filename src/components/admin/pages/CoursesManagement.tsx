import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Search, Filter, Edit, Trash2, Eye, Users, Calendar, DollarSign, Clock } from 'lucide-react';
import AdminLayout from '../AdminLayoutNew';
import adminService, { Course } from '../../../services/admin';
import CourseModal from './CourseModal';
import CourseDetailModal from './CourseDetailModal';

const CoursesManagement: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | undefined>();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, [searchTerm, statusFilter, levelFilter, categoryFilter]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      // Mock data for development
      setCourses([
        {
          id: '1',
          title: 'IELTS 6.5 Foundation',
          description: 'Khóa học IELTS cơ bản nhằm giúp học viên đạt được 6.5 band trong kỳ thi IELTS',
          category: 'IELTS',
          level: 'intermediate',
          duration: 12,
          schedule: 'T2,T4,T6 - 8:00-10:00',
          startDate: '2025-09-15',
          endDate: '2025-12-15',
          maxStudents: 15,
          currentStudents: 12,
          teacherId: 'teacher1',
          price: 2500000,
          status: 'upcoming',
          materials: ['Cambridge IELTS 15', 'Vocabulary Builder', 'Grammar in Use'],
          location: 'Phòng 201'
        },
        {
          id: '2',
          title: 'TOEIC 800+ Advanced',
          description: 'Khóa học TOEIC nâng cao giúp học viên đạt 800+ điểm trong kỳ thi TOEIC',
          category: 'TOEIC',
          level: 'advanced',
          duration: 10,
          schedule: 'T3,T5,T7 - 14:00-16:00',
          startDate: '2025-09-10',
          endDate: '2025-11-20',
          maxStudents: 20,
          currentStudents: 18,
          teacherId: 'teacher2',
          price: 3000000,
          status: 'ongoing',
          materials: ['ETS TOEIC Practice', 'Business Vocabulary', 'Listening Skills'],
          location: 'Phòng 102'
        },
        {
          id: '3',
          title: 'English Communication Basics',
          description: 'Khóa học giao tiếp tiếng Anh cơ bản cho người mới bắt đầu',
          category: 'Giao tiếp',
          level: 'beginner',
          duration: 8,
          schedule: 'T2,T4 - 19:00-21:00',
          startDate: '2025-07-01',
          endDate: '2025-08-30',
          maxStudents: 12,
          currentStudents: 12,
          teacherId: 'teacher3',
          price: 2000000,
          status: 'completed',
          materials: ['English Conversation', 'Basic Grammar', 'Pronunciation Guide'],
          location: 'Phòng 103'
        },
        {
          id: '4',
          title: 'Business English Professional',
          description: 'Khóa học tiếng Anh thương mại cho môi trường công sở',
          category: 'Business',
          level: 'advanced',
          duration: 16,
          schedule: 'T7,CN - 9:00-12:00',
          startDate: '2025-10-01',
          endDate: '2026-02-01',
          maxStudents: 10,
          currentStudents: 5,
          teacherId: 'teacher4',
          price: 4000000,
          status: 'upcoming',
          materials: ['Business English in Use', 'Email Writing', 'Presentation Skills'],
          location: 'Phòng 301'
        }
      ]);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const getOccupancyColor = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  const handleCreateCourse = () => {
    setSelectedCourse(undefined);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleViewCourse = (course: Course) => {
    setSelectedCourse(course);
    setShowDetailModal(true);
  };

  const handleSaveCourse = async (courseData: Partial<Course>) => {
    try {
      if (isEditing && selectedCourse) {
        // Update existing course
        console.log('Updating course:', courseData);
      } else {
        // Create new course
        console.log('Creating course:', courseData);
      }
      fetchCourses();
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khóa học này?')) {
      try {
        console.log('Deleting course:', courseId);
        fetchCourses();
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  if (loading) {
    return (
      <AdminLayout currentPage="courses">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPage="courses">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý khóa học</h1>
            <p className="text-gray-600 mt-1">Quản lý chương trình và nội dung học tập</p>
          </div>
          <button 
            onClick={handleCreateCourse}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tạo khóa học mới
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng khóa học</p>
                <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đang diễn ra</p>
                <p className="text-2xl font-bold text-gray-900">
                  {courses.filter(c => c.status === 'ongoing').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Users className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng học viên</p>
                <p className="text-2xl font-bold text-gray-900">
                  {courses.reduce((total, c) => total + c.currentStudents, 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Doanh thu dự kiến</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(courses.reduce((total, c) => total + (c.price * c.currentStudents), 0)).slice(0, -2)}tr
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tên khóa học..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả</option>
                <option value="upcoming">Sắp khai giảng</option>
                <option value="ongoing">Đang diễn ra</option>
                <option value="completed">Hoàn thành</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cấp độ</label>
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả cấp độ</option>
                <option value="beginner">Cơ bản</option>
                <option value="intermediate">Trung cấp</option>
                <option value="advanced">Nâng cao</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả danh mục</option>
                <option value="IELTS">IELTS</option>
                <option value="TOEIC">TOEIC</option>
                <option value="Giao tiếp">Giao tiếp</option>
                <option value="Business">Business</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Thao tác</label>
              <button className="flex items-center w-full px-3 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-md hover:bg-gray-100">
                <Filter className="w-4 h-4 mr-2" />
                Bộ lọc nâng cao
              </button>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(course.status)}`}>
                    {getStatusText(course.status)}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Danh mục:</span>
                    <span className="text-sm font-medium text-gray-900">{course.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Cấp độ:</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(course.level)}`}>
                      {getLevelText(course.level)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Thời lượng:</span>
                    <span className="text-sm font-medium text-gray-900">{course.duration} tuần</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Học phí:</span>
                    <span className="text-sm font-bold text-blue-600">{formatCurrency(course.price)}</span>
                  </div>
                </div>

                {/* Progress and Students */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Học viên</span>
                    <span className={getOccupancyColor(course.currentStudents, course.maxStudents)}>
                      {course.currentStudents}/{course.maxStudents}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(course.currentStudents / course.maxStudents) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Schedule and Location */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{course.schedule}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>
                      {new Date(course.startDate).toLocaleDateString('vi-VN')} - {new Date(course.endDate).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleViewCourse(course)}
                      className="text-blue-600 hover:text-blue-900" 
                      title="Xem chi tiết"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleEditCourse(course)}
                      className="text-indigo-600 hover:text-indigo-900" 
                      title="Chỉnh sửa"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteCourse(course.id)}
                      className="text-red-600 hover:text-red-900" 
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {courses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có khóa học nào</h3>
            <p className="text-gray-500 mb-4">Bắt đầu bằng cách tạo khóa học đầu tiên</p>
            <button 
              onClick={handleCreateCourse}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tạo khóa học mới
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <CourseModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveCourse}
        course={selectedCourse}
        isEditing={isEditing}
      />

      {selectedCourse && (
        <CourseDetailModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          course={selectedCourse}
        />
      )}
    </AdminLayout>
  );
};

export default CoursesManagement;
