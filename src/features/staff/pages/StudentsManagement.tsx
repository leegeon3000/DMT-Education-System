import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEOHead } from '../../../components/common';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Edit, 
  Eye, 
  Trash2,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  FileText,
  Mail,
  Phone
} from 'lucide-react';

interface Student {
  id: number;
  student_code: string;
  full_name: string;
  phone: string;
  email: string;
  school_level: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'GRADUATED';
  created_at: string;
}

const StudentsManagement: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);

  // Mock data
  const mockStudents: Student[] = [
    {
      id: 1,
      student_code: 'HS2025001',
      full_name: 'Nguyễn Văn A',
      phone: '0901234567',
      email: 'nguyenvana@example.com',
      school_level: 'THPT',
      status: 'ACTIVE',
      created_at: '2025-01-15'
    },
    {
      id: 2,
      student_code: 'HS2025002',
      full_name: 'Trần Thị B',
      phone: '0902345678',
      email: 'tranthib@example.com',
      school_level: 'THCS',
      status: 'ACTIVE',
      created_at: '2025-01-16'
    },
    {
      id: 3,
      student_code: 'HS2025003',
      full_name: 'Lê Văn C',
      phone: '0903456789',
      email: 'levanc@example.com',
      school_level: 'THPT',
      status: 'SUSPENDED',
      created_at: '2025-01-17'
    },
    {
      id: 4,
      student_code: 'HS2025004',
      full_name: 'Phạm Thị D',
      phone: '0904567890',
      email: 'phamthid@example.com',
      school_level: 'Đại học',
      status: 'ACTIVE',
      created_at: '2025-01-18'
    },
    {
      id: 5,
      student_code: 'HS2025005',
      full_name: 'Hoàng Văn E',
      phone: '0905678901',
      email: 'hoangvane@example.com',
      school_level: 'THPT',
      status: 'ACTIVE',
      created_at: '2025-01-19'
    },
  ];

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await studentsAPI.getAll();
      setTimeout(() => {
        setStudents(mockStudents);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Failed to fetch students:', error);
      setStudents(mockStudents);
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.student_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.phone.includes(searchQuery) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLevel = !filterLevel || student.school_level === filterLevel;
    const matchesStatus = !filterStatus || student.status === filterStatus;

    return matchesSearch && matchesLevel && matchesStatus;
  });

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedStudents(paginatedStudents.map(s => s.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectStudent = (id: number) => {
    setSelectedStudents(prev => 
      prev.includes(id) 
        ? prev.filter(sId => sId !== id)
        : [...prev, id]
    );
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      ACTIVE: 'bg-green-100 text-green-700',
      SUSPENDED: 'bg-red-100 text-red-700',
      GRADUATED: 'bg-blue-100 text-blue-700',
    };
    const labels = {
      ACTIVE: 'Đang học',
      SUSPENDED: 'Tạm ngưng',
      GRADUATED: 'Đã tốt nghiệp',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const handleExport = () => {
    alert('Xuất Excel - Chức năng đang phát triển');
  };

  return (
    <>
      <SEOHead
        title="Quản lý học viên - DMT Education"
        description="Quản lý danh sách học viên"
      />

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Quản lý học viên
                </h1>
                <p className="text-gray-600 mt-1">Tổng: {filteredStudents.length} học viên</p>
              </div>
              <button
                onClick={() => navigate('/staff/students/register')}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-all shadow-sm"
              >
                <Plus size={20} />
                Đăng ký mới
              </button>
            </div>

            {/* Filters & Search */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative md:col-span-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Tìm theo tên, mã, SĐT, email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>

                <select
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="">Tất cả cấp học</option>
                  <option value="Tiểu học">Tiểu học</option>
                  <option value="THCS">THCS</option>
                  <option value="THPT">THPT</option>
                  <option value="Đại học">Đại học</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="ACTIVE">Đang học</option>
                  <option value="SUSPENDED">Tạm ngưng</option>
                  <option value="GRADUATED">Đã tốt nghiệp</option>
                </select>
              </div>

              {selectedStudents.length > 0 && (
                <div className="mt-4 flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    Đã chọn {selectedStudents.length} học viên
                  </span>
                  <button
                    onClick={handleExport}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Xuất Excel
                  </button>
                  <button className="text-sm text-cyan-600 hover:text-red-700 font-medium">
                    Xóa đã chọn
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-red-500 rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Đang tải...</p>
              </div>
            ) : paginatedStudents.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <UserX size={48} className="mx-auto mb-4 text-gray-400" />
                <p>Không tìm thấy học viên</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={selectedStudents.length === paginatedStudents.length}
                            onChange={handleSelectAll}
                            className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                          />
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Mã HS
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Họ và tên
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Liên hệ
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Cấp học
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Trạng thái
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Ngày đăng ký
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {paginatedStudents.map((student) => (
                        <tr 
                          key={student.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-4">
                            <input
                              type="checkbox"
                              checked={selectedStudents.includes(student.id)}
                              onChange={() => handleSelectStudent(student.id)}
                              className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                            />
                          </td>
                          <td className="px-4 py-4">
                            <span className="font-mono text-sm font-medium text-gray-900">
                              {student.student_code}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold mr-3">
                                {student.full_name.charAt(0)}
                              </div>
                              <span className="font-medium text-gray-900">{student.full_name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm space-y-1">
                              <div className="flex items-center text-gray-600">
                                <Phone size={14} className="mr-2" />
                                {student.phone}
                              </div>
                              <div className="flex items-center text-gray-600">
                                <Mail size={14} className="mr-2" />
                                {student.email}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm text-gray-900">{student.school_level}</span>
                          </td>
                          <td className="px-4 py-4">
                            {getStatusBadge(student.status)}
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm text-gray-600">
                              {new Date(student.created_at).toLocaleDateString('vi-VN')}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => alert(`Xem chi tiết: ${student.full_name}`)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Xem chi tiết"
                              >
                                <Eye size={18} />
                              </button>
                              <button
                                onClick={() => alert(`Sửa: ${student.full_name}`)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Chỉnh sửa"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Xóa học viên ${student.full_name}?`)) {
                                    alert('Xóa - Chức năng đang phát triển');
                                  }
                                }}
                                className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                                title="Xóa"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Hiển thị {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredStudents.length)} / {filteredStudents.length}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded-lg ${
                          currentPage === page
                            ? 'bg-cyan-500 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentsManagement;
