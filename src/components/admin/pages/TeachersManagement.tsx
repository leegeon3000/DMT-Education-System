import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, Filter, Edit, Trash2, Eye, Calendar, Clock, DollarSign, Award, Phone, Mail, MapPin, BookOpen, TrendingUp, Star } from 'lucide-react';
import AdminLayout from '../AdminLayoutNew';
import TeacherModal from './TeacherModal';
import TeacherDetailModal from './TeacherDetailModal';

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
  totalClasses: number;
  totalStudents: number;
  hoursThisMonth: number;
  avatar?: string;
  bio?: string;
  certifications: string[];
  languages: string[];
}

const TeachersManagement: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [specializationFilter, setSpecializationFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | undefined>();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchTeachers();
  }, [searchTerm, statusFilter, levelFilter, specializationFilter]);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      // Mock data for development
      setTeachers([
        {
          id: '1',
          name: 'Ms. Nguyễn Thị Lan',
          email: 'lan.nguyen@dmtedu.com',
          phone: '0901234567',
          address: 'Quận 1, TP.HCM',
          specialization: ['IELTS', 'Academic Writing'],
          level: 'expert',
          status: 'active',
          hireDate: '2020-03-15',
          salary: 15000000,
          experience: 8,
          totalClasses: 45,
          totalStudents: 320,
          hoursThisMonth: 85,
          bio: 'Giáo viên IELTS với 8 năm kinh nghiệm, từng đạt 8.5 IELTS Overall',
          certifications: ['IELTS Certificate', 'TESOL Certificate', 'Cambridge CELTA'],
          languages: ['Tiếng Việt', 'English (C2)', 'French (B1)']
        },
        {
          id: '2',
          name: 'Mr. Trần Văn Nam',
          email: 'nam.tran@dmtedu.com',
          phone: '0907654321',
          address: 'Quận 3, TP.HCM',
          specialization: ['TOEIC', 'Business English'],
          level: 'senior',
          status: 'active',
          hireDate: '2019-08-20',
          salary: 12000000,
          experience: 5,
          totalClasses: 38,
          totalStudents: 280,
          hoursThisMonth: 72,
          bio: 'Chuyên gia TOEIC và English for Business với kinh nghiệm tại các công ty đa quốc gia',
          certifications: ['TOEIC Certificate', 'Business English Certificate'],
          languages: ['Tiếng Việt', 'English (C1)', 'Japanese (A2)']
        },
        {
          id: '3',
          name: 'Ms. Lê Thị Hoa',
          email: 'hoa.le@dmtedu.com',
          phone: '0909876543',
          address: 'Quận 7, TP.HCM',
          specialization: ['Giao tiếp', 'Speaking'],
          level: 'senior',
          status: 'active',
          hireDate: '2021-01-10',
          salary: 11000000,
          experience: 4,
          totalClasses: 30,
          totalStudents: 210,
          hoursThisMonth: 78,
          bio: 'Giáo viên năng động, chuyên về Speaking và Communication Skills',
          certifications: ['TESOL Certificate', 'Speaking Skills Certificate'],
          languages: ['Tiếng Việt', 'English (C1)']
        },
        {
          id: '4',
          name: 'Mr. Phạm Minh Tuấn',
          email: 'tuan.pham@dmtedu.com',
          phone: '0905432198',
          address: 'Quận 2, TP.HCM',
          specialization: ['Grammar', 'Foundation'],
          level: 'junior',
          status: 'active',
          hireDate: '2023-06-01',
          salary: 8000000,
          experience: 2,
          totalClasses: 25,
          totalStudents: 180,
          hoursThisMonth: 68,
          bio: 'Giáo viên trẻ, nhiệt huyết với nền tảng Grammar vững chắc',
          certifications: ['TESOL Certificate'],
          languages: ['Tiếng Việt', 'English (B2)']
        },
        {
          id: '5',
          name: 'Ms. Võ Thị Mai',
          email: 'mai.vo@dmtedu.com',
          phone: '0903456789',
          address: 'Quận 10, TP.HCM',
          specialization: ['Kids English', 'Phonics'],
          level: 'senior',
          status: 'on-leave',
          hireDate: '2018-09-12',
          salary: 13000000,
          experience: 7,
          totalClasses: 40,
          totalStudents: 250,
          hoursThisMonth: 0,
          bio: 'Chuyên gia giảng dạy tiếng Anh cho trẻ em, có kinh nghiệm với Phonics',
          certifications: ['TESOL Certificate', 'Teaching Kids Certificate'],
          languages: ['Tiếng Việt', 'English (C1)']
        }
      ]);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'on-leave': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Đang hoạt động';
      case 'inactive': return 'Không hoạt động';
      case 'on-leave': return 'Nghỉ phép';
      default: return status;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'junior': return 'bg-blue-100 text-blue-800';
      case 'senior': return 'bg-purple-100 text-purple-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'junior': return 'Junior';
      case 'senior': return 'Senior';
      case 'expert': return 'Expert';
      default: return level;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };



  const handleCreateTeacher = () => {
    setSelectedTeacher(undefined);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEditTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleViewTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setShowDetailModal(true);
  };

  const handleSaveTeacher = async (teacherData: Partial<Teacher>) => {
    try {
      if (isEditing && selectedTeacher) {
        console.log('Updating teacher:', teacherData);
      } else {
        console.log('Creating teacher:', teacherData);
      }
      fetchTeachers();
    } catch (error) {
      console.error('Error saving teacher:', error);
    }
  };

  const handleDeleteTeacher = async (teacherId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa giáo viên này?')) {
      try {
        console.log('Deleting teacher:', teacherId);
        fetchTeachers();
      } catch (error) {
        console.error('Error deleting teacher:', error);
      }
    }
  };

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || teacher.status === statusFilter;
    const matchesLevel = levelFilter === 'all' || teacher.level === levelFilter;
    const matchesSpecialization = specializationFilter === 'all' || 
                                 teacher.specialization.some(spec => spec.includes(specializationFilter));
    
    return matchesSearch && matchesStatus && matchesLevel && matchesSpecialization;
  });

  if (loading) {
    return (
      <AdminLayout currentPage="teachers">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPage="teachers">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý giáo viên</h1>
            <p className="text-gray-600 mt-1">Quản lý đội ngũ giáo viên và phân công giảng dạy</p>
          </div>
          <button 
            onClick={handleCreateTeacher}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm giáo viên mới
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng giáo viên</p>
                <p className="text-2xl font-bold text-gray-900">{teachers.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
                <p className="text-2xl font-bold text-gray-900">
                  {teachers.filter(t => t.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Giờ dạy tháng này</p>
                <p className="text-2xl font-bold text-gray-900">
                  {teachers.reduce((total, t) => total + t.hoursThisMonth, 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đánh giá TB</p>
                <p className="text-2xl font-bold text-gray-900">
                  N/A
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
                  placeholder="Tên hoặc email..."
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
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Không hoạt động</option>
                <option value="on-leave">Nghỉ phép</option>
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
                <option value="junior">Junior</option>
                <option value="senior">Senior</option>
                <option value="expert">Expert</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chuyên môn</label>
              <select
                value={specializationFilter}
                onChange={(e) => setSpecializationFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả chuyên môn</option>
                <option value="IELTS">IELTS</option>
                <option value="TOEIC">TOEIC</option>
                <option value="Giao tiếp">Giao tiếp</option>
                <option value="Business">Business</option>
                <option value="Kids">Kids English</option>
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

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher) => (
            <div key={teacher.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                {/* Teacher Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {teacher.name.split(' ').pop()?.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-gray-900">{teacher.name}</h3>
                      <p className="text-sm text-gray-600">{teacher.specialization.join(', ')}</p>
                    </div>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(teacher.status)}`}>
                    {getStatusText(teacher.status)}
                  </span>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    <span className="truncate">{teacher.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    <span>{teacher.phone}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{teacher.address}</span>
                  </div>
                </div>

                {/* Level and Experience */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(teacher.level)}`}>
                      {getLevelText(teacher.level)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {teacher.experience} năm kinh nghiệm
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Lớp học:</span>
                    <span className="text-sm font-medium">{teacher.totalClasses}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Học viên:</span>
                    <span className="text-sm font-medium">{teacher.totalStudents}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Giờ tháng này:</span>
                    <span className="text-sm font-medium text-blue-600">{teacher.hoursThisMonth}h</span>
                  </div>
                </div>

                {/* Salary */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Lương cơ bản:</span>
                    <span className="text-sm font-bold text-green-600">
                      {formatCurrency(teacher.salary)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    Tham gia {new Date(teacher.hireDate).toLocaleDateString('vi-VN')}
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleViewTeacher(teacher)}
                      className="text-blue-600 hover:text-blue-900" 
                      title="Xem chi tiết"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleEditTeacher(teacher)}
                      className="text-indigo-600 hover:text-indigo-900" 
                      title="Chỉnh sửa"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteTeacher(teacher.id)}
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
        {filteredTeachers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy giáo viên nào</h3>
            <p className="text-gray-500 mb-4">Thử thay đổi bộ lọc hoặc thêm giáo viên mới</p>
            <button 
              onClick={handleCreateTeacher}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm giáo viên mới
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <TeacherModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveTeacher}
        teacher={selectedTeacher}
        isEditing={isEditing}
      />

      {selectedTeacher && (
        <TeacherDetailModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          teacher={selectedTeacher}
        />
      )}
    </AdminLayout>
  );
};

export default TeachersManagement;
