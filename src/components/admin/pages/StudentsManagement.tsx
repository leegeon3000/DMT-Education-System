import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, Download, Upload, Edit, Trash2, Eye, Mail, Phone } from 'lucide-react';
import AdminLayout from '../AdminLayoutNew';
import adminService, { Student } from '../../../services/admin';
import StudentModal from './StudentModal';
import StudentDetailModal from './StudentDetailModal';

const StudentsManagement: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const studentsPerPage = 10;

  useEffect(() => {
    fetchStudents();
  }, [currentPage, searchTerm, statusFilter, courseFilter]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await adminService.listStudents({
        search: searchTerm,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        course: courseFilter !== 'all' ? courseFilter : undefined,
        page: currentPage,
        limit: studentsPerPage
      });
      setStudents(response.data.students || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      // Mock data for development
      setStudents([
        {
          id: '1',
          fullName: 'Nguyễn Văn A',
          email: 'nguyenvana@email.com',
          phone: '0987654321',
          address: '123 Đường ABC, TP.HCM',
          dateOfBirth: '1995-01-15',
          enrollmentDate: '2025-08-01',
          status: 'active',
          courseIds: ['course1', 'course2'],
          paymentStatus: 'paid',
          parentName: 'Nguyễn Văn B',
          parentPhone: '0987654322'
        },
        {
          id: '2',
          fullName: 'Trần Thị B',
          email: 'tranthib@email.com',
          phone: '0987654323',
          address: '456 Đường DEF, TP.HCM',
          dateOfBirth: '1998-03-20',
          enrollmentDate: '2025-07-15',
          status: 'active',
          courseIds: ['course1'],
          paymentStatus: 'pending',
          parentName: 'Trần Văn C',
          parentPhone: '0987654324'
        },
        {
          id: '3',
          fullName: 'Lê Văn C',
          email: 'levanc@email.com',
          phone: '0987654325',
          address: '789 Đường GHI, TP.HCM',
          dateOfBirth: '1997-07-10',
          enrollmentDate: '2025-06-01',
          status: 'inactive',
          courseIds: ['course3'],
          paymentStatus: 'overdue',
          parentName: 'Lê Thị D',
          parentPhone: '0987654326'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStudent = () => {
    setSelectedStudent(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsDetailModalOpen(true);
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa học viên này?')) {
      try {
        await adminService.deleteStudent(studentId);
        fetchStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('Có lỗi xảy ra khi xóa học viên');
      }
    }
  };

  const handleSaveStudent = async (studentData: Partial<Student>) => {
    try {
      if (modalMode === 'create') {
        await adminService.createStudent(studentData);
      } else {
        await adminService.updateStudent(selectedStudent!.id, studentData);
      }
      setIsModalOpen(false);
      fetchStudents();
    } catch (error) {
      console.error('Error saving student:', error);
      alert('Có lỗi xảy ra khi lưu thông tin học viên');
    }
  };

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

  if (loading) {
    return (
      <AdminLayout currentPage="students">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPage="students">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý học viên</h1>
            <p className="text-gray-600 mt-1">Quản lý thông tin và hoạt động học tập</p>
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </button>
            <button className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            <button 
              onClick={handleCreateStudent}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm học viên
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Search className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng học viên</p>
                <p className="text-2xl font-bold text-gray-900">{students.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Search className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đang học</p>
                <p className="text-2xl font-bold text-gray-900">
                  {students.filter(s => s.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Search className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Chờ thanh toán</p>
                <p className="text-2xl font-bold text-gray-900">
                  {students.filter(s => s.paymentStatus === 'pending' || s.paymentStatus === 'overdue').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <Search className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Quá hạn thanh toán</p>
                <p className="text-2xl font-bold text-gray-900">
                  {students.filter(s => s.paymentStatus === 'overdue').length}
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
                  placeholder="Tên, email, số điện thoại..."
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
                <option value="active">Đang học</option>
                <option value="inactive">Tạm dừng</option>
                <option value="graduated">Tốt nghiệp</option>
                <option value="suspended">Bị đình chỉ</option>
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

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Học viên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Liên hệ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày đăng ký
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thanh toán
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {student.fullName.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{student.fullName}</div>
                          <div className="text-sm text-gray-500">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        {student.phone}
                      </div>
                      {student.parentPhone && (
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <span className="mr-1">PH:</span>
                          {student.parentPhone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(student.enrollmentDate).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(student.status)}`}>
                        {getStatusText(student.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(student.paymentStatus)}`}>
                        {getPaymentStatusText(student.paymentStatus)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewStudent(student)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditStudent(student)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(student.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 border border-gray-200 rounded-lg sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <p className="text-sm text-gray-700">
                Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">{students.length}</span> trong tổng số <span className="font-medium">{students.length}</span> học viên
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Trước
              </button>
              <button className="px-3 py-1 text-sm bg-blue-600 text-white border border-blue-600 rounded-md">
                1
              </button>
              <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isModalOpen && (
        <StudentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveStudent}
          student={selectedStudent}
          mode={modalMode}
        />
      )}

      {isDetailModalOpen && selectedStudent && (
        <StudentDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          student={selectedStudent}
        />
      )}
    </AdminLayout>
  );
};

export default StudentsManagement;
