import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  PlusCircle, 
  MoreVertical, 
  Edit, 
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  Calendar,
  BookOpen,
  AlertCircle,
  Download,
  Upload
} from 'lucide-react';
import Spinner from '../../../components/common/Spinner';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'basic' | 'intermediate' | 'advanced';
  price: number;
  duration: number; // in weeks
  startDate: string;
  teacherName: string;
  teacherId: string;
  enrolledCount: number;
  maxStudents: number;
  status: 'active' | 'inactive' | 'upcoming';
  image?: string;
}

const mockCourses: Course[] = Array.from({ length: 30 }, (_, idx) => ({
  id: `CRS${(idx + 1).toString().padStart(4, '0')}`,
  title: ['Toán học nâng cao', 'Vật lý cơ bản', 'Hóa học chuyên sâu', 'Tiếng Anh giao tiếp', 'Ngữ văn và văn học'][idx % 5] + ` ${Math.floor(idx / 5) + 10}`,
  description: 'Khóa học được thiết kế giúp học sinh nắm vững kiến thức và kỹ năng cần thiết để đạt kết quả cao trong các kỳ thi.',
  category: ['Toán học', 'Vật lý', 'Hóa học', 'Tiếng Anh', 'Ngữ văn'][idx % 5],
  level: ['basic', 'intermediate', 'advanced'][idx % 3] as 'basic' | 'intermediate' | 'advanced',
  price: Math.floor(800000 + Math.random() * 1200000),
  duration: Math.floor(8 + Math.random() * 16),
  startDate: new Date(2023, idx % 12, Math.floor(1 + Math.random() * 28)).toLocaleDateString('vi-VN'),
  teacherName: ['Nguyễn Văn A', 'Trần Thị B', 'Lê Hoàng C', 'Phạm Minh D'][idx % 4],
  teacherId: `T${(idx % 4) + 1}`,
  enrolledCount: Math.floor(5 + Math.random() * 25),
  maxStudents: 30,
  status: ['active', 'inactive', 'upcoming'][idx % 3] as 'active' | 'inactive' | 'upcoming',
  image: idx % 3 === 0 ? `/course-${(idx % 5) + 1}.jpg` : undefined
}));

interface CourseModalProps {
  course?: Course;
  onClose: () => void;
  onSave: (course: Course) => void;
}

const CourseModal: React.FC<CourseModalProps> = ({ course, onClose, onSave }) => {
  const isEdit = !!course;
  const [form, setForm] = useState<Partial<Course>>(
    course || {
      status: 'upcoming',
      level: 'basic',
      maxStudents: 30,
      duration: 8
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'maxStudents' || name === 'duration' ? parseInt(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, would validate form here
    onSave(form as Course);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">{isEdit ? 'Chỉnh sửa khóa học' : 'Thêm khóa học mới'}</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên khóa học
              </label>
              <input
                type="text"
                name="title"
                value={form.title || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả
              </label>
              <textarea
                name="description"
                value={form.description || ''}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Danh mục
              </label>
              <select
                name="category"
                value={form.category || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="" disabled>Chọn danh mục</option>
                <option value="Toán học">Toán học</option>
                <option value="Vật lý">Vật lý</option>
                <option value="Hóa học">Hóa học</option>
                <option value="Tiếng Anh">Tiếng Anh</option>
                <option value="Ngữ văn">Ngữ văn</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cấp độ
              </label>
              <select
                name="level"
                value={form.level || 'basic'}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="basic">Cơ bản</option>
                <option value="intermediate">Trung cấp</option>
                <option value="advanced">Nâng cao</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá khóa học (VND)
              </label>
              <input
                type="number"
                name="price"
                value={form.price || ''}
                onChange={handleChange}
                min="0"
                step="10000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thời gian (tuần)
              </label>
              <input
                type="number"
                name="duration"
                value={form.duration || 8}
                onChange={handleChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày bắt đầu
              </label>
              <input
                type="date"
                name="startDate"
                value={form.startDate ? new Date(form.startDate).toISOString().split('T')[0] : ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giáo viên
              </label>
              <select
                name="teacherId"
                value={form.teacherId || ''}
                onChange={(e) => {
                  const teacherMap = {
                    'T1': 'Nguyễn Văn A',
                    'T2': 'Trần Thị B',
                    'T3': 'Lê Hoàng C',
                    'T4': 'Phạm Minh D'
                  };
                  setForm(prev => ({
                    ...prev,
                    teacherId: e.target.value,
                    teacherName: teacherMap[e.target.value as keyof typeof teacherMap] || ''
                  }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="" disabled>Chọn giáo viên</option>
                <option value="T1">Nguyễn Văn A</option>
                <option value="T2">Trần Thị B</option>
                <option value="T3">Lê Hoàng C</option>
                <option value="T4">Phạm Minh D</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số học sinh tối đa
              </label>
              <input
                type="number"
                name="maxStudents"
                value={form.maxStudents || 30}
                onChange={handleChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <select
                name="status"
                value={form.status || 'upcoming'}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="active">Đang diễn ra</option>
                <option value="inactive">Đã kết thúc</option>
                <option value="upcoming">Sắp diễn ra</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ảnh khóa học (URL)
              </label>
              <input
                type="text"
                name="image"
                value={form.image || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end border-t border-gray-100 gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors"
            >
              {isEdit ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CoursesManagement: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'upcoming'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState<Course | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const pageSize = 8;

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setCourses(mockCourses);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.teacherName.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });
  
  const totalPages = Math.ceil(filteredCourses.length / pageSize);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleAddCourse = () => {
    setSelectedCourse(undefined);
    setIsModalOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleSaveCourse = (course: Course) => {
    if (selectedCourse) {
      // Edit existing course
      setCourses(prevCourses => 
        prevCourses.map(c => c.id === selectedCourse.id ? {...course, id: selectedCourse.id} : c)
      );
    } else {
      // Add new course with generated ID
      const newCourse = {
        ...course,
        id: `CRS${(courses.length + 1).toString().padStart(4, '0')}`,
        enrolledCount: 0
      };
      setCourses(prevCourses => [...prevCourses, newCourse]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteCourse = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khóa học này?')) {
      setCourses(prevCourses => prevCourses.filter(c => c.id !== id));
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const getStatusBadge = (status: 'active' | 'inactive' | 'upcoming') => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Đang diễn ra
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Đã kết thúc
          </span>
        );
      case 'upcoming':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Sắp diễn ra
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size={40} />
        <span className="ml-3 text-gray-600">Đang tải dữ liệu khóa học...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý khóa học</h1>
          <p className="text-gray-600">Quản lý thông tin và trạng thái của các khóa học</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => alert('Chức năng xuất dữ liệu sẽ được bổ sung sau')}
            className="px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-1"
          >
            <Download size={18} />
            <span className="hidden sm:inline-block">Xuất Excel</span>
          </button>
          <button
            onClick={handleAddCourse}
            className="px-3 py-2 text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors flex items-center gap-1"
          >
            <PlusCircle size={18} />
            <span>Thêm khóa học</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
        {/* Filters */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, mô tả, giáo viên..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 w-full"
            >
              <option value="all">Tất cả danh mục</option>
              <option value="Toán học">Toán học</option>
              <option value="Vật lý">Vật lý</option>
              <option value="Hóa học">Hóa học</option>
              <option value="Tiếng Anh">Tiếng Anh</option>
              <option value="Ngữ văn">Ngữ văn</option>
            </select>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 w-full"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang diễn ra</option>
              <option value="inactive">Đã kết thúc</option>
              <option value="upcoming">Sắp diễn ra</option>
            </select>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedCourses.map(course => (
          <div key={course.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="h-48 bg-gray-100 relative">
              {course.image ? (
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <BookOpen size={64} />
                </div>
              )}
              <div className="absolute top-3 right-3">
                {getStatusBadge(course.status)}
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{course.title}</h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{course.description}</p>
              
              <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                <Users size={14} />
                <span>{course.enrolledCount}/{course.maxStudents} học sinh</span>
              </div>
              
              <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                <Calendar size={14} />
                <span>Bắt đầu: {course.startDate}</span>
              </div>
              
              <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                <Clock size={14} />
                <span>{course.duration} tuần</span>
              </div>
              
              <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-100">
                <div className="text-primary-600 font-semibold">{formatPrice(course.price)}</div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert(`Xem chi tiết khóa học ${course.title}`)}
                    className="p-1.5 text-gray-500 hover:text-gray-700 transition-colors"
                    title="Xem chi tiết"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => handleEditCourse(course)}
                    className="p-1.5 text-blue-500 hover:text-blue-700 transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    className="p-1.5 text-red-500 hover:text-red-700 transition-colors"
                    title="Xóa"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {paginatedCourses.length === 0 && (
          <div className="md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col items-center justify-center bg-white rounded-lg border border-gray-200 p-8">
            <AlertCircle size={48} className="text-gray-400 mb-3" />
            <p className="text-gray-600">Không tìm thấy khóa học nào phù hợp với bộ lọc</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
                setStatusFilter('all');
              }}
              className="mt-3 px-4 py-2 text-primary-600 hover:text-primary-700 transition-colors"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {filteredCourses.length > 0 && (
        <div className="mt-8 py-3 px-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Hiển thị {paginatedCourses.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}-{Math.min(currentPage * pageSize, filteredCourses.length)} 
            {' '}trong số {filteredCourses.length} khóa học
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-md ${
                currentPage === 1 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft size={18} />
            </button>
            
            {/* Page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
              let pageNum: number;
              
              // Show first page, last page, current page, and pages around current
              if (totalPages <= 5) {
                pageNum = idx + 1;
              } else if (currentPage <= 3) {
                pageNum = idx + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + idx;
              } else {
                pageNum = currentPage - 2 + idx;
              }
              
              if (pageNum <= 0 || pageNum > totalPages) return null;
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 flex items-center justify-center rounded-md ${
                    currentPage === pageNum
                      ? 'bg-primary-50 text-primary-700 font-medium border border-primary-100'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md ${
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
      
      {/* Course Modal */}
      {isModalOpen && (
        <CourseModal
          course={selectedCourse}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveCourse}
        />
      )}
    </div>
  );
};

export default CoursesManagement;
