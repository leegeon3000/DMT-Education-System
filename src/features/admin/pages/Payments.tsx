import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  UserCircle,
  BookOpen,
  DollarSign,
  ArrowUpDown,
  FileText,
  Receipt,
  CreditCard
} from 'lucide-react';
import { PaymentTransaction, PaymentStatus, PaymentMethod } from '../../../types';
import { apiClient } from '../../../services/auth';

// Interface for API response
interface PaymentFromAPI {
  ID: number;
  PAYMENT_CODE: string;
  ENROLLMENT_ID: number;
  AMOUNT: number;
  PAYMENT_DATE: string;
  PAYMENT_METHOD: string;
  STATUS: string;
  RECEIPT_NUMBER: string | null;
  DESCRIPTION: string;
  PAYMENT_DETAILS: string | null;
  CREATED_BY: string;
  CREATED_AT: string;
  UPDATED_AT: string | null;
  STUDENT_ID: number;
  STUDENT_CODE: string;
  STUDENT_NAME: string;
  STUDENT_EMAIL: string;
  CLASS_CODE: string;
  CLASS_NAME: string;
  ENROLLMENT_DATE: string;
}

// Normalize API data to match frontend interface
const normalizePayment = (payment: PaymentFromAPI): PaymentTransaction => {
  // Map database payment methods to frontend types
  const methodMap: Record<string, PaymentMethod> = {
    'CASH': 'cash',
    'BANK_TRANSFER': 'bank_transfer',
    'CREDIT_CARD': 'credit_card',
    'E_WALLET': 'e_wallet'
  };

  // Map database status to frontend types
  const statusMap: Record<string, PaymentStatus> = {
    'COMPLETED': 'completed',
    'PENDING': 'pending',
    'FAILED': 'failed',
    'REFUNDED': 'refunded'
  };

  return {
    id: payment.PAYMENT_CODE,
    date: payment.PAYMENT_DATE.split('T')[0],
    studentId: payment.STUDENT_CODE,
    studentName: payment.STUDENT_NAME,
    courseId: payment.CLASS_CODE,
    courseName: payment.CLASS_NAME,
    amount: payment.AMOUNT,
    status: statusMap[payment.STATUS] || 'pending',
    paymentMethod: methodMap[payment.PAYMENT_METHOD] || 'cash',
    description: payment.DESCRIPTION,
    receiptNumber: payment.RECEIPT_NUMBER || undefined,
    paymentDetails: payment.PAYMENT_DETAILS || undefined,
    createdBy: payment.CREATED_BY,
    createdAt: new Date(payment.CREATED_AT),
    updatedAt: payment.UPDATED_AT ? new Date(payment.UPDATED_AT) : undefined
  };
};

// Payment status badge component
const StatusBadge: React.FC<{ status: PaymentStatus }> = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'completed':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          icon: <CheckCircle className="w-4 h-4 mr-1" />,
          label: 'Hoàn tất'
        };
      case 'pending':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          icon: <AlertCircle className="w-4 h-4 mr-1" />,
          label: 'Đang chờ'
        };
      case 'failed':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          icon: <XCircle className="w-4 h-4 mr-1" />,
          label: 'Thất bại'
        };
      case 'refunded':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          icon: <CreditCard className="w-4 h-4 mr-1" />,
          label: 'Đã hoàn tiền'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          icon: <AlertCircle className="w-4 h-4 mr-1" />,
          label: 'Không xác định'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.icon}
      {config.label}
    </span>
  );
};

// Payment method badge component
const MethodBadge: React.FC<{ method: PaymentMethod }> = ({ method }) => {
  const getMethodConfig = () => {
    switch (method) {
      case 'cash':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          icon: <DollarSign className="w-4 h-4 mr-1" />,
          label: 'Tiền mặt'
        };
      case 'bank_transfer':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          icon: <Receipt className="w-4 h-4 mr-1" />,
          label: 'Chuyển khoản'
        };
      case 'credit_card':
        return {
          bg: 'bg-indigo-100',
          text: 'text-indigo-800',
          icon: <CreditCard className="w-4 h-4 mr-1" />,
          label: 'Thẻ tín dụng'
        };
      case 'e_wallet':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          icon: <CreditCard className="w-4 h-4 mr-1" />,
          label: 'Ví điện tử'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          icon: <CreditCard className="w-4 h-4 mr-1" />,
          label: 'Khác'
        };
    }
  };

  const config = getMethodConfig();

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.icon}
      {config.label}
    </span>
  );
};

// Format currency for VND
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const PaymentsManagement: React.FC = () => {
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<PaymentTransaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentTransaction | null>(null);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof PaymentTransaction; direction: 'asc' | 'desc' } | null>(
    { key: 'date', direction: 'desc' }
  );
  const [filterStatus, setFilterStatus] = useState<PaymentStatus | 'all'>('all');
  const [filterMethod, setFilterMethod] = useState<PaymentMethod | 'all'>('all');
  const [filterDateFrom, setFilterDateFrom] = useState<string>('');
  const [filterDateTo, setFilterDateTo] = useState<string>('');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch payments from API
        const response = await apiClient.get('/payments');
        
        if (response.data.success && response.data.data) {
          const normalizedPayments = response.data.data.map(normalizePayment);
          setPayments(normalizedPayments);
          setFilteredPayments(normalizedPayments);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err: any) {
        console.error('Error fetching payment data:', err);
        setError(err.response?.data?.message || 'Không thể tải dữ liệu thanh toán. Vui lòng thử lại sau.');
        setPayments([]);
        setFilteredPayments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, []);

  useEffect(() => {
    let result = [...payments];

    // Apply search filter
    if (searchTerm) {
      result = result.filter((payment) =>
        payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter((payment) => payment.status === filterStatus);
    }

    // Apply method filter
    if (filterMethod !== 'all') {
      result = result.filter((payment) => payment.paymentMethod === filterMethod);
    }

    // Apply date range filter
    if (filterDateFrom) {
      result = result.filter((payment) => 
        new Date(payment.date) >= new Date(filterDateFrom)
      );
    }
    
    if (filterDateTo) {
      result = result.filter((payment) => 
        new Date(payment.date) <= new Date(filterDateTo)
      );
    }

    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        const key = sortConfig.key;
        const aValue = a[key];
        const bValue = b[key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredPayments(result);
  }, [payments, searchTerm, sortConfig, filterStatus, filterMethod, filterDateFrom, filterDateTo]);

  const handleSort = (key: keyof PaymentTransaction) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleAddPayment = () => {
    setShowAddModal(true);
  };

  const handleEditPayment = (payment: PaymentTransaction) => {
    setSelectedPayment(payment);
    setShowEditModal(true);
  };

  const handleViewPayment = (payment: PaymentTransaction) => {
    setSelectedPayment(payment);
    setShowDetailModal(true);
  };

  const handleDeletePayment = async (paymentId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa giao dịch này không?')) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setPayments(payments.filter(payment => payment.id !== paymentId));
      } catch (err) {
        console.error('Error deleting payment:', err);
        setError('Không thể xóa giao dịch. Vui lòng thử lại sau.');
      }
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterMethod('all');
    setFilterDateFrom('');
    setFilterDateTo('');
    setSortConfig({ key: 'date', direction: 'desc' });
  };

  const handleExportData = () => {
    // Implement CSV export logic
    alert('Chức năng xuất dữ liệu đang được phát triển');
  };

  const getTotalRevenue = () => {
    return filteredPayments
      .filter(payment => payment.status === 'completed')
      .reduce((sum, payment) => sum + payment.amount, 0);
  };

  const getPendingRevenue = () => {
    return filteredPayments
      .filter(payment => payment.status === 'pending')
      .reduce((sum, payment) => sum + payment.amount, 0);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-full mx-auto">
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Quản lý thanh toán</h1>
          <p className="mt-2 text-sm text-gray-700">
            Quản lý tất cả các giao dịch thanh toán, học phí và tài chính của trung tâm.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-2">
          <button
            type="button"
            onClick={handleExportData}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Download className="h-4 w-4 mr-2" />
            Xuất dữ liệu
          </button>
          <button
            type="button"
            onClick={handleAddPayment}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm giao dịch
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Tổng doanh thu</dt>
                  <dd>
                    <div className="text-lg font-medium text-indigo-600">{formatCurrency(getTotalRevenue())}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Chờ xử lý</dt>
                  <dd>
                    <div className="text-lg font-medium text-yellow-600">{formatCurrency(getPendingRevenue())}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Tổng giao dịch</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{filteredPayments.length}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Receipt className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Giao dịch hoàn tất</dt>
                  <dd>
                    <div className="text-lg font-medium text-green-600">
                      {filteredPayments.filter(payment => payment.status === 'completed').length}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="p-4 sm:p-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="relative rounded-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Tìm kiếm theo mã, tên học viên, khóa học..."
            />
          </div>

          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as PaymentStatus | 'all')}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="completed">Hoàn tất</option>
              <option value="pending">Đang chờ</option>
              <option value="failed">Thất bại</option>
              <option value="refunded">Đã hoàn tiền</option>
            </select>
          </div>

          <div>
            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value as PaymentMethod | 'all')}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="all">Tất cả phương thức</option>
              <option value="cash">Tiền mặt</option>
              <option value="bank_transfer">Chuyển khoản</option>
              <option value="credit_card">Thẻ tín dụng</option>
              <option value="e_wallet">Ví điện tử</option>
            </select>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Đặt lại
            </button>
          </div>

          <div className="col-span-2">
            <div className="flex space-x-2">
              <div className="w-1/2">
                <label htmlFor="date-from" className="block text-xs font-medium text-gray-700">Từ ngày</label>
                <input
                  type="date"
                  id="date-from"
                  value={filterDateFrom}
                  onChange={(e) => setFilterDateFrom(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="w-1/2">
                <label htmlFor="date-to" className="block text-xs font-medium text-gray-700">Đến ngày</label>
                <input
                  type="date"
                  id="date-to"
                  value={filterDateTo}
                  onChange={(e) => setFilterDateTo(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="flex flex-col bg-white shadow rounded-lg">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden border-b border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('id')}
                    >
                      <div className="flex items-center">
                        Mã giao dịch
                        {sortConfig?.key === 'id' && (
                          <ArrowUpDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('date')}
                    >
                      <div className="flex items-center">
                        Ngày
                        {sortConfig?.key === 'date' && (
                          <ArrowUpDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Học viên
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Khóa học
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('amount')}
                    >
                      <div className="flex items-center">
                        Số tiền
                        {sortConfig?.key === 'amount' && (
                          <ArrowUpDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phương thức
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                        <div className="flex justify-center items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Đang tải dữ liệu...
                        </div>
                      </td>
                    </tr>
                  ) : filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                        Không tìm thấy giao dịch nào
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {payment.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(payment.date).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <UserCircle className="h-5 w-5 mr-2 text-gray-400" />
                            {payment.studentName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <BookOpen className="h-5 w-5 mr-2 text-gray-400" />
                            {payment.courseName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <MethodBadge method={payment.paymentMethod} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <StatusBadge status={payment.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => handleViewPayment(payment)}
                              className="text-indigo-600 hover:text-indigo-900 focus:outline-none"
                            >
                              <Eye className="h-5 w-5" aria-hidden="true" />
                            </button>
                            <button
                              onClick={() => handleEditPayment(payment)}
                              className="text-blue-600 hover:text-blue-900 focus:outline-none"
                            >
                              <Edit2 className="h-5 w-5" aria-hidden="true" />
                            </button>
                            <button
                              onClick={() => handleDeletePayment(payment.id)}
                              className="text-red-600 hover:text-red-900 focus:outline-none"
                            >
                              <Trash2 className="h-5 w-5" aria-hidden="true" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination (simplified) */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-b-lg">
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">{filteredPayments.length}</span> của{' '}
              <span className="font-medium">{filteredPayments.length}</span> kết quả
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <a
                href="#"
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Trang trước</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </a>
              <a
                href="#"
                aria-current="page"
                className="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
              >
                1
              </a>
              <a
                href="#"
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Trang sau</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </a>
            </nav>
          </div>
        </div>
      </div>

      {/* Add/Edit/Detail Modals would go here */}
    </div>
  );
};

export default PaymentsManagement;
