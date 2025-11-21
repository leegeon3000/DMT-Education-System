import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEOHead } from '../../../components/common';
import { 
  Search, 
  Filter, 
  Download, 
  Calendar,
  BookOpen,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Plus
} from 'lucide-react';

interface Enrollment {
  id: number;
  enrollment_code: string;
  student_name: string;
  student_code: string;
  class_name: string;
  class_code: string;
  teacher_name: string;
  start_date: string;
  end_date: string;
  total_fee: number;
  paid_amount: number;
  discount_percent: number;
  status: 'ACTIVE' | 'PENDING' | 'COMPLETED' | 'CANCELLED';
  enrollment_date: string;
}

const EnrollmentsManagement: React.FC = () => {
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Mock data
  const mockEnrollments: Enrollment[] = [
    {
      id: 1,
      enrollment_code: 'ENR2025001',
      student_name: 'Nguyễn Văn A',
      student_code: 'HS2025001',
      class_name: 'Toán 10A - Học kỳ 1',
      class_code: 'TOAN10A-HK1',
      teacher_name: 'Thầy Nguyễn Văn B',
      start_date: '2025-01-15',
      end_date: '2025-05-31',
      total_fee: 5000000,
      paid_amount: 2500000,
      discount_percent: 0,
      status: 'ACTIVE',
      enrollment_date: '2025-01-10T09:00:00'
    },
    {
      id: 2,
      enrollment_code: 'ENR2025002',
      student_name: 'Trần Thị B',
      student_code: 'HS2025002',
      class_name: 'Vật lý 10B - Học kỳ 1',
      class_code: 'VATLY10B-HK1',
      teacher_name: 'Cô Phạm Thị C',
      start_date: '2025-01-20',
      end_date: '2025-05-31',
      total_fee: 4000000,
      paid_amount: 4000000,
      discount_percent: 10,
      status: 'ACTIVE',
      enrollment_date: '2025-01-12T10:30:00'
    },
    {
      id: 3,
      enrollment_code: 'ENR2025003',
      student_name: 'Lê Văn C',
      student_code: 'HS2025003',
      class_name: 'Hóa học 11A - Học kỳ 1',
      class_code: 'HOAHOC11A-HK1',
      teacher_name: 'Thầy Trần Văn D',
      start_date: '2025-02-01',
      end_date: '2025-06-15',
      total_fee: 3500000,
      paid_amount: 0,
      discount_percent: 0,
      status: 'PENDING',
      enrollment_date: '2025-01-25T14:15:00'
    },
    {
      id: 4,
      enrollment_code: 'ENR2024999',
      student_name: 'Phạm Thị D',
      student_code: 'HS2024999',
      class_name: 'IELTS Foundation',
      class_code: 'IELTS-FOUND-2024',
      teacher_name: 'Ms. Sarah Johnson',
      start_date: '2024-09-01',
      end_date: '2024-12-31',
      total_fee: 6000000,
      paid_amount: 6000000,
      discount_percent: 15,
      status: 'COMPLETED',
      enrollment_date: '2024-08-20T11:00:00'
    },
    {
      id: 5,
      enrollment_code: 'ENR2025004',
      student_name: 'Hoàng Văn E',
      student_code: 'HS2025005',
      class_name: 'Sinh học 12A - Học kỳ 1',
      class_code: 'SINHHOC12A-HK1',
      teacher_name: 'Cô Lê Thị E',
      start_date: '2025-01-18',
      end_date: '2025-05-30',
      total_fee: 4500000,
      paid_amount: 1500000,
      discount_percent: 5,
      status: 'ACTIVE',
      enrollment_date: '2025-01-15T16:20:00'
    },
    {
      id: 6,
      enrollment_code: 'ENR2025005',
      student_name: 'Vũ Thị F',
      student_code: 'HS2025006',
      class_name: 'Tiếng Anh 9A',
      class_code: 'ENG9A-2025',
      teacher_name: 'Mr. David Lee',
      start_date: '2025-02-05',
      end_date: '2025-06-20',
      total_fee: 3000000,
      paid_amount: 0,
      discount_percent: 0,
      status: 'CANCELLED',
      enrollment_date: '2025-01-28T13:45:00'
    },
  ];

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      setTimeout(() => {
        setEnrollments(mockEnrollments);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Failed to fetch enrollments:', error);
      setEnrollments(mockEnrollments);
      setLoading(false);
    }
  };

  const filteredEnrollments = enrollments.filter(enrollment => {
    const matchesSearch = 
      enrollment.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enrollment.student_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enrollment.enrollment_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enrollment.class_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enrollment.class_code.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = !filterStatus || enrollment.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredEnrollments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEnrollments = filteredEnrollments.slice(startIndex, startIndex + itemsPerPage);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      ACTIVE: { bg: 'bg-green-100 text-green-700', icon: CheckCircle, label: 'Đang học' },
      PENDING: { bg: 'bg-yellow-100 text-yellow-700', icon: Clock, label: 'Chờ xác nhận' },
      COMPLETED: { bg: 'bg-blue-100 text-blue-700', icon: UserCheck, label: 'Hoàn thành' },
      CANCELLED: { bg: 'bg-red-100 text-red-700', icon: XCircle, label: 'Đã hủy' }
    };
    const badge = badges[status as keyof typeof badges];
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.bg}`}>
        <Icon size={14} />
        {badge.label}
      </span>
    );
  };

  const getRemainingAmount = (enrollment: Enrollment) => {
    const discountAmount = (enrollment.total_fee * enrollment.discount_percent) / 100;
    const finalAmount = enrollment.total_fee - discountAmount;
    return finalAmount - enrollment.paid_amount;
  };

  const getPaymentProgress = (enrollment: Enrollment) => {
    const discountAmount = (enrollment.total_fee * enrollment.discount_percent) / 100;
    const finalAmount = enrollment.total_fee - discountAmount;
    return (enrollment.paid_amount / finalAmount) * 100;
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginatedEnrollments.map(enr => enr.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleView = (enrollment: Enrollment) => {
    alert(`Xem chi tiết đăng ký ${enrollment.enrollment_code} - Chức năng đang phát triển`);
  };

  const handleEdit = (enrollment: Enrollment) => {
    alert(`Chỉnh sửa đăng ký ${enrollment.enrollment_code} - Chức năng đang phát triển`);
  };

  const handleDelete = (enrollment: Enrollment) => {
    if (confirm(`Bạn có chắc muốn xóa đăng ký ${enrollment.enrollment_code}?`)) {
      alert('Xóa đăng ký - Chức năng đang phát triển');
    }
  };

  const handleExport = () => {
    alert('Xuất Excel - Chức năng đang phát triển');
  };

  return (
    <>
      <SEOHead
        title="Quản lý đăng ký lớp - DMT Education"
        description="Quản lý đăng ký lớp học của học viên"
      />

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Quản lý đăng ký lớp
                </h1>
                <p className="text-gray-600 mt-1">Theo dõi và quản lý đăng ký lớp học</p>
              </div>
              <button
                onClick={() => navigate('/staff/enrollments/create')}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-all shadow-sm"
              >
                <Plus size={20} />
                Tạo đăng ký mới
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Đang học</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">
                      {enrollments.filter(e => e.status === 'ACTIVE').length}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle size={24} className="text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Chờ xác nhận</p>
                    <p className="text-2xl font-bold text-yellow-600 mt-1">
                      {enrollments.filter(e => e.status === 'PENDING').length}
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Clock size={24} className="text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Hoàn thành</p>
                    <p className="text-2xl font-bold text-blue-600 mt-1">
                      {enrollments.filter(e => e.status === 'COMPLETED').length}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <UserCheck size={24} className="text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Tổng số</p>
                    <p className="text-2xl font-bold text-cyan-600 mt-1">
                      {enrollments.length}
                    </p>
                  </div>
                  <div className="p-3 bg-cyan-100 rounded-lg">
                    <BookOpen size={24} className="text-cyan-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative md:col-span-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Tìm theo học viên, lớp học, mã đăng ký..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="ACTIVE">Đang học</option>
                  <option value="PENDING">Chờ xác nhận</option>
                  <option value="COMPLETED">Hoàn thành</option>
                  <option value="CANCELLED">Đã hủy</option>
                </select>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Download size={18} />
                  <span className="text-sm font-medium">Xuất Excel</span>
                </button>
                {selectedIds.length > 0 && (
                  <span className="text-sm text-gray-600">
                    Đã chọn {selectedIds.length} đăng ký
                  </span>
                )}
                <span className="text-sm text-gray-600 ml-auto">
                  Tìm thấy {filteredEnrollments.length} đăng ký
                </span>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-cyan-500 rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Đang tải...</p>
              </div>
            ) : paginatedEnrollments.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <BookOpen size={48} className="mx-auto mb-4 text-gray-400" />
                <p>Không tìm thấy đăng ký nào</p>
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
                            checked={selectedIds.length === paginatedEnrollments.length}
                            onChange={handleSelectAll}
                            className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                          />
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Mã đăng ký
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Học viên
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Lớp học
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Thời gian
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Học phí
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Trạng thái
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {paginatedEnrollments.map((enrollment) => {
                        const remaining = getRemainingAmount(enrollment);
                        const progress = getPaymentProgress(enrollment);
                        
                        return (
                          <tr 
                            key={enrollment.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-4 py-4">
                              <input
                                type="checkbox"
                                checked={selectedIds.includes(enrollment.id)}
                                onChange={() => handleSelectOne(enrollment.id)}
                                className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                              />
                            </td>
                            <td className="px-4 py-4">
                              <span className="font-mono text-sm font-medium text-cyan-600">
                                {enrollment.enrollment_code}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <div>
                                <p className="font-medium text-gray-900">{enrollment.student_name}</p>
                                <p className="text-sm text-gray-500">{enrollment.student_code}</p>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div>
                                <p className="font-medium text-gray-900">{enrollment.class_name}</p>
                                <p className="text-sm text-gray-500">{enrollment.teacher_name}</p>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm">
                                <p className="text-gray-900">{formatDate(enrollment.start_date)}</p>
                                <p className="text-gray-500">đến {formatDate(enrollment.end_date)}</p>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold text-gray-900">
                                    {formatCurrency(enrollment.paid_amount)}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    / {formatCurrency(enrollment.total_fee - (enrollment.total_fee * enrollment.discount_percent / 100))}
                                  </span>
                                </div>
                                <div className="w-32">
                                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full ${
                                        progress === 100 ? 'bg-green-500' : 
                                        progress > 50 ? 'bg-blue-500' : 
                                        progress > 0 ? 'bg-yellow-500' : 'bg-gray-300'
                                      }`}
                                      style={{ width: `${Math.min(progress, 100)}%` }}
                                    />
                                  </div>
                                  {remaining > 0 && (
                                    <p className="text-xs text-cyan-600 mt-0.5">
                                      Còn nợ: {formatCurrency(remaining)}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              {getStatusBadge(enrollment.status)}
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleView(enrollment)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Xem chi tiết"
                                >
                                  <Eye size={18} />
                                </button>
                                <button
                                  onClick={() => handleEdit(enrollment)}
                                  className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                  title="Chỉnh sửa"
                                >
                                  <Edit size={18} />
                                </button>
                                <button
                                  onClick={() => handleDelete(enrollment)}
                                  className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                                  title="Xóa"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Hiển thị {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredEnrollments.length)} / {filteredEnrollments.length}
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

export default EnrollmentsManagement;
