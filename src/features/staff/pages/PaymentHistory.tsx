import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEOHead } from '../../../components/common';
import { 
  Search, 
  Filter, 
  Download, 
  Calendar,
  CreditCard,
  DollarSign,
  Eye,
  Printer,
  FileText,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';

interface Payment {
  id: number;
  receipt_number: string;
  student_name: string;
  student_code: string;
  class_name: string;
  amount: number;
  payment_method: 'CASH' | 'BANK_TRANSFER' | 'CREDIT_CARD' | 'E_WALLET';
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  transaction_reference: string;
  notes: string;
  processed_by: string;
  created_at: string;
}

const PaymentHistory: React.FC = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMethod, setFilterMethod] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Mock data
  const mockPayments: Payment[] = [
    {
      id: 1,
      receipt_number: 'BL2025001',
      student_name: 'Nguyễn Văn A',
      student_code: 'HS2025001',
      class_name: 'Toán 10A - Học kỳ 1',
      amount: 2500000,
      payment_method: 'BANK_TRANSFER',
      status: 'COMPLETED',
      transaction_reference: 'TXN123456',
      notes: 'Thanh toán đợt 1',
      processed_by: 'Nguyễn Thị Staff',
      created_at: '2025-01-15T10:30:00'
    },
    {
      id: 2,
      receipt_number: 'BL2025002',
      student_name: 'Trần Thị B',
      student_code: 'HS2025002',
      class_name: 'Vật lý 10B - Học kỳ 1',
      amount: 4000000,
      payment_method: 'CASH',
      status: 'COMPLETED',
      transaction_reference: '',
      notes: 'Thanh toán full học phí',
      processed_by: 'Nguyễn Thị Staff',
      created_at: '2025-01-16T14:20:00'
    },
    {
      id: 3,
      receipt_number: 'BL2025003',
      student_name: 'Lê Văn C',
      student_code: 'HS2025003',
      class_name: 'Hóa học 11A - Học kỳ 1',
      amount: 1500000,
      payment_method: 'E_WALLET',
      status: 'COMPLETED',
      transaction_reference: 'MOMO789012',
      notes: '',
      processed_by: 'Trần Văn Admin',
      created_at: '2025-01-17T09:15:00'
    },
    {
      id: 4,
      receipt_number: 'BL2025004',
      student_name: 'Phạm Thị D',
      student_code: 'HS2025004',
      class_name: 'IELTS Foundation',
      amount: 3000000,
      payment_method: 'CREDIT_CARD',
      status: 'PENDING',
      transaction_reference: 'CARD345678',
      notes: 'Đang chờ xác nhận ngân hàng',
      processed_by: 'Nguyễn Thị Staff',
      created_at: '2025-01-18T11:45:00'
    },
    {
      id: 5,
      receipt_number: 'BL2025005',
      student_name: 'Hoàng Văn E',
      student_code: 'HS2025005',
      class_name: 'Sinh học 12A - Học kỳ 1',
      amount: 2000000,
      payment_method: 'BANK_TRANSFER',
      status: 'COMPLETED',
      transaction_reference: 'TXN901234',
      notes: 'Thanh toán đợt 2',
      processed_by: 'Nguyễn Thị Staff',
      created_at: '2025-01-19T16:00:00'
    },
  ];

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      setTimeout(() => {
        setPayments(mockPayments);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
      setPayments(mockPayments);
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.student_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.receipt_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.class_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesMethod = !filterMethod || payment.payment_method === filterMethod;
    const matchesStatus = !filterStatus || payment.status === filterStatus;
    
    const paymentDate = new Date(payment.created_at);
    const matchesDateFrom = !dateFrom || paymentDate >= new Date(dateFrom);
    const matchesDateTo = !dateTo || paymentDate <= new Date(dateTo);

    return matchesSearch && matchesMethod && matchesStatus && matchesDateFrom && matchesDateTo;
  });

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPayments = filteredPayments.slice(startIndex, startIndex + itemsPerPage);

  const totalRevenue = filteredPayments
    .filter(p => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + p.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getMethodLabel = (method: string) => {
    const labels = {
      CASH: 'Tiền mặt',
      BANK_TRANSFER: 'Chuyển khoản',
      CREDIT_CARD: 'Thẻ tín dụng',
      E_WALLET: 'Ví điện tử'
    };
    return labels[method as keyof typeof labels];
  };

  const getMethodBadge = (method: string) => {
    const badges = {
      CASH: 'bg-green-100 text-green-700',
      BANK_TRANSFER: 'bg-blue-100 text-blue-700',
      CREDIT_CARD: 'bg-cyan-100 text-cyan-700',
      E_WALLET: 'bg-orange-100 text-orange-700'
    };
    return badges[method as keyof typeof badges];
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      COMPLETED: { bg: 'bg-green-100 text-green-700', icon: CheckCircle },
      PENDING: { bg: 'bg-yellow-100 text-yellow-700', icon: Clock },
      FAILED: { bg: 'bg-red-100 text-red-700', icon: XCircle }
    };
    const labels = {
      COMPLETED: 'Hoàn thành',
      PENDING: 'Chờ xử lý',
      FAILED: 'Thất bại'
    };
    const badge = badges[status as keyof typeof badges];
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.bg}`}>
        <Icon size={14} />
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const handleExport = () => {
    alert('Xuất Excel - Chức năng đang phát triển');
  };

  const handleViewReceipt = (payment: Payment) => {
    alert(`Xem biên lai ${payment.receipt_number} - Chức năng đang phát triển`);
  };

  const handlePrintReceipt = (payment: Payment) => {
    alert(`In biên lai ${payment.receipt_number} - Chức năng đang phát triển`);
  };

  return (
    <>
      <SEOHead
        title="Lịch sử thanh toán - DMT Education"
        description="Xem lịch sử giao dịch thanh toán"
      />

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Lịch sử thanh toán
                </h1>
                <p className="text-gray-600 mt-1">Quản lý giao dịch thanh toán học phí</p>
              </div>
              <button
                onClick={() => navigate('/staff/payments/process')}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-sm"
              >
                <DollarSign size={20} />
                Ghi nhận mới
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Tổng doanh thu</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">
                      {formatCurrency(totalRevenue)}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <TrendingUp size={24} className="text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Giao dịch hoàn thành</p>
                    <p className="text-2xl font-bold text-blue-600 mt-1">
                      {filteredPayments.filter(p => p.status === 'COMPLETED').length}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <CheckCircle size={24} className="text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Chờ xử lý</p>
                    <p className="text-2xl font-bold text-yellow-600 mt-1">
                      {filteredPayments.filter(p => p.status === 'PENDING').length}
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Clock size={24} className="text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="relative md:col-span-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Tìm theo tên, mã, biên lai..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Từ ngày"
                  />
                </div>

                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Đến ngày"
                  />
                </div>

                <select
                  value={filterMethod}
                  onChange={(e) => setFilterMethod(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Tất cả phương thức</option>
                  <option value="CASH">Tiền mặt</option>
                  <option value="BANK_TRANSFER">Chuyển khoản</option>
                  <option value="CREDIT_CARD">Thẻ tín dụng</option>
                  <option value="E_WALLET">Ví điện tử</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="COMPLETED">Hoàn thành</option>
                  <option value="PENDING">Chờ xử lý</option>
                  <option value="FAILED">Thất bại</option>
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
                <span className="text-sm text-gray-600">
                  Tìm thấy {filteredPayments.length} giao dịch
                </span>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Đang tải...</p>
              </div>
            ) : paginatedPayments.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <FileText size={48} className="mx-auto mb-4 text-gray-400" />
                <p>Không tìm thấy giao dịch</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Biên lai
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Học viên
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Lớp học
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Số tiền
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Phương thức
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Trạng thái
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Thời gian
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {paginatedPayments.map((payment) => (
                        <tr 
                          key={payment.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-4">
                            <span className="font-mono text-sm font-medium text-blue-600">
                              {payment.receipt_number}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div>
                              <p className="font-medium text-gray-900">{payment.student_name}</p>
                              <p className="text-sm text-gray-500">{payment.student_code}</p>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm text-gray-900">{payment.class_name}</span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="font-semibold text-green-600">
                              {formatCurrency(payment.amount)}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMethodBadge(payment.payment_method)}`}>
                              {getMethodLabel(payment.payment_method)}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            {getStatusBadge(payment.status)}
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm text-gray-600">
                              {formatDateTime(payment.created_at)}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleViewReceipt(payment)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Xem chi tiết"
                              >
                                <Eye size={18} />
                              </button>
                              <button
                                onClick={() => handlePrintReceipt(payment)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="In biên lai"
                              >
                                <Printer size={18} />
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
                    Hiển thị {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredPayments.length)} / {filteredPayments.length}
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
                            ? 'bg-green-500 text-white'
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

export default PaymentHistory;
