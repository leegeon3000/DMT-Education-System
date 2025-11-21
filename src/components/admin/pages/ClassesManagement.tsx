import React, { useState, useEffect } from 'react';
import { Calendar, Users, Clock, Plus, Search, Filter, Edit, Trash2, Eye, UserCheck } from 'lucide-react';
import AdminLayout from '../AdminLayoutNew';
import adminService from '../../../services/admin';
import ClassModal from './ClassModal';
import ClassDetailModal from './ClassDetailModal';

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

const ClassesManagement: React.FC = () => {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  useEffect(() => {
    fetchClasses();
  }, [searchTerm, statusFilter, courseFilter]);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      // Mock data for development
      setClasses([
        {
          id: '1',
          name: 'IELTS 6.5 - Sáng T2,T4,T6',
          courseId: 'course1',
          courseName: 'IELTS 6.5',
          teacherId: 'teacher1',
          teacherName: 'Cô Nguyễn Thị A',
          startDate: '2025-08-01',
          endDate: '2025-11-30',
          schedule: 'T2,T4,T6 - 8:00-10:00',
          maxStudents: 15,
          currentStudents: 12,
          status: 'ongoing',
          room: 'Phòng 201',
          description: 'Lớp học IELTS nâng cao cho mục tiêu 6.5 band'
        },
        {
          id: '2',
          name: 'TOEIC 800+ - Chiều T3,T5,T7',
          courseId: 'course2',
          courseName: 'TOEIC 800+',
          teacherId: 'teacher2',
          teacherName: 'Thầy Trần Văn B',
          startDate: '2025-09-01',
          endDate: '2025-12-15',
          schedule: 'T3,T5,T7 - 14:00-16:00',
          maxStudents: 20,
          currentStudents: 8,
          status: 'upcoming',
          room: 'Phòng 102',
          description: 'Lớp học TOEIC cho mục tiêu 800+ điểm'
        },
        {
          id: '3',
          name: 'Giao tiếp cơ bản - Tối T2,T4',
          courseId: 'course3',
          courseName: 'Giao tiếp cơ bản',
          teacherId: 'teacher3',
          teacherName: 'Cô Lê Thị C',
          startDate: '2025-07-01',
          endDate: '2025-08-30',
          schedule: 'T2,T4 - 19:00-21:00',
          maxStudents: 12,
          currentStudents: 12,
          status: 'completed',
          room: 'Phòng 103',
          description: 'Lớp học giao tiếp tiếng Anh cơ bản'
        }
      ]);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClass = () => {
    setSelectedClass(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditClass = (classData: ClassData) => {
    setSelectedClass(classData);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleViewClass = (classData: ClassData) => {
    setSelectedClass(classData);
    setIsDetailModalOpen(true);
  };

  const handleDeleteClass = async (classId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lớp học này?')) {
      try {
        // await adminService.deleteClass(classId);
        fetchClasses();
      } catch (error) {
        console.error('Error deleting class:', error);
        alert('Có lỗi xảy ra khi xóa lớp học');
      }
    }
  };

  const handleSaveClass = async (classData: Partial<ClassData>) => {
    try {
      if (modalMode === 'create') {
        // await adminService.createClass(classData);
      } else {
        // await adminService.updateClass(selectedClass!.id, classData);
      }
      setIsModalOpen(false);
      fetchClasses();
    } catch (error) {
      console.error('Error saving class:', error);
      alert('Có lỗi xảy ra khi lưu thông tin lớp học');
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

  const getOccupancyColor = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  if (loading) {
    return (
      <AdminLayout currentPage="classes">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPage="classes">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý lớp học</h1>
            <p className="text-gray-600 mt-1">Quản lý lịch học và sĩ số lớp</p>
          </div>
          <button 
            onClick={handleCreateClass}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tạo lớp học mới
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng lớp học</p>
                <p className="text-2xl font-bold text-gray-900">{classes.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đang diễn ra</p>
                <p className="text-2xl font-bold text-gray-900">
                  {classes.filter(c => c.status === 'ongoing').length}
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
                <p className="text-sm font-medium text-gray-600">Sắp khai giảng</p>
                <p className="text-2xl font-bold text-gray-900">
                  {classes.filter(c => c.status === 'upcoming').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <UserCheck className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng học viên</p>
                <p className="text-2xl font-bold text-gray-900">
                  {classes.reduce((total, c) => total + c.currentStudents, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tên lớp, giáo viên..."
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Khóa học</label>
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả khóa học</option>
                <option value="course1">IELTS 6.5</option>
                <option value="course2">TOEIC 800+</option>
                <option value="course3">Giao tiếp cơ bản</option>
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

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classData) => (
            <div key={classData.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{classData.name}</h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(classData.status)}`}>
                    {getStatusText(classData.status)}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{classData.schedule}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span className={getOccupancyColor(classData.currentStudents, classData.maxStudents)}>
                      {classData.currentStudents}/{classData.maxStudents} học viên
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <UserCheck className="w-4 h-4 mr-2" />
                    <span>{classData.teacherName}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{classData.room}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Sĩ số</span>
                    <span>{Math.round((classData.currentStudents / classData.maxStudents) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(classData.currentStudents / classData.maxStudents) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    <p>Bắt đầu: {new Date(classData.startDate).toLocaleDateString('vi-VN')}</p>
                    <p>Kết thúc: {new Date(classData.endDate).toLocaleDateString('vi-VN')}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewClass(classData)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditClass(classData)}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Chỉnh sửa"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClass(classData.id)}
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
        {classes.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có lớp học nào</h3>
            <p className="text-gray-500 mb-4">Bắt đầu bằng cách tạo lớp học đầu tiên</p>
            <button 
              onClick={handleCreateClass}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tạo lớp học mới
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {isModalOpen && (
        <ClassModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveClass}
          classData={selectedClass}
          mode={modalMode}
        />
      )}

      {isDetailModalOpen && selectedClass && (
        <ClassDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          classData={selectedClass}
        />
      )}
    </AdminLayout>
  );
};

export default ClassesManagement;
