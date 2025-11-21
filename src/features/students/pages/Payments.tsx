import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Receipt, 
  Download,
  DollarSign,
  Calendar,
  TrendingUp,
  Filter,
  Search,
  FileText,
  Wallet,
  Building2,
  Smartphone,
  CheckCircle2
} from 'lucide-react';
import { SEOHead } from '../../../components/common/SEOHead';

interface Payment {
  id: string;
  amount: number;
  method: string;
  date: string;
  status: 'completed' | 'pending' | 'overdue';
  description: string;
  receiptNumber?: string;
  installmentPlan?: {
    total: number;
    paid: number;
    remaining: number;
    nextDueDate?: string;
  };
  category?: 'tuition' | 'materials' | 'exam' | 'other';
}

interface PaymentSummary {
  totalFee: number;
  paidAmount: number;
  remainingAmount: number;
  nextDueDate?: string;
  installmentCount?: number;
  completedInstallments?: number;
}

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [summary, setSummary] = useState<PaymentSummary>({
    totalFee: 0,
    paidAmount: 0,
    remainingAmount: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'overdue'>('all');

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      // TODO: Integrate with Supabase API
      // const data = await studentService.getPayments();
      
      // Mock data
      const mockPayments: Payment[] = [
        {
          id: '1',
          amount: 5000000,
          method: 'bank_transfer',
          date: '2025-11-01',
          status: 'completed',
          description: 'Học phí tháng 11/2025',
          receiptNumber: 'HD001',
          category: 'tuition',
          installmentPlan: {
            total: 3,
            paid: 1,
            remaining: 2,
            nextDueDate: '2025-12-01'
          }
        },
        {
          id: '2',
          amount: 5000000,
          method: 'cash',
          date: '2025-10-01',
          status: 'completed',
          description: 'Học phí tháng 10/2025',
          receiptNumber: 'HD002',
          category: 'tuition'
        },
        {
          id: '3',
          amount: 5000000,
          method: 'pending',
          date: '2025-12-01',
          status: 'pending',
          description: 'Học phí tháng 12/2025',
          category: 'tuition',
          installmentPlan: {
            total: 3,
            paid: 1,
            remaining: 2,
            nextDueDate: '2025-12-15'
          }
        },
        {
          id: '4',
          amount: 500000,
          method: 'bank_transfer',
          date: '2025-09-15',
          status: 'completed',
          description: 'Tài liệu học tập',
          receiptNumber: 'HD003',
          category: 'materials'
        },
        {
          id: '5',
          amount: 300000,
          method: 'online',
          date: '2025-08-20',
          status: 'completed',
          description: 'Phí thi giữa kỳ',
          receiptNumber: 'HD004',
          category: 'exam'
        }
      ];

      const mockSummary: PaymentSummary = {
        totalFee: 15800000,
        paidAmount: 10800000,
        remainingAmount: 5000000,
        nextDueDate: '2025-12-15',
        installmentCount: 3,
        completedInstallments: 1
      };

      setPayments(mockPayments);
      setSummary(mockSummary);
    } catch (error) {
      console.error('Failed to load payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'overdue':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Đã thanh toán';
      case 'pending':
        return 'Chờ thanh toán';
      case 'overdue':
        return 'Quá hạn';
      default:
        return status;
    }
  };

  const getCategoryInfo = (category?: string) => {
    switch (category) {
      case 'tuition':
        return { label: 'Học phí', color: 'bg-blue-100 text-blue-700', icon: CreditCard };
      case 'materials':
        return { label: 'Tài liệu', color: 'bg-purple-100 text-purple-700', icon: FileText };
      case 'exam':
        return { label: 'Thi cử', color: 'bg-orange-100 text-orange-700', icon: Receipt };
      default:
        return { label: 'Khác', color: 'bg-gray-100 text-gray-700', icon: Wallet };
    }
  };

  const getMethodText = (method: string) => {
    switch (method) {
      case 'bank_transfer':
        return 'Chuyển khoản';
      case 'cash':
        return 'Tiền mặt';
      case 'online':
        return 'Online';
      default:
        return method;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'bank_transfer':
        return <Building2 className="w-4 h-4" />;
      case 'cash':
        return <Wallet className="w-4 h-4" />;
      case 'online':
        return <Smartphone className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesSearch = 
      searchQuery === '' ||
      payment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.receiptNumber?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin thanh toán...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="Quản lý học phí - DMT Education"
        description="Theo dõi lịch sử thanh toán và học phí"
        keywords={["học phí", "thanh toán", "hóa đơn"]}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Wallet className="w-8 h-8 text-blue-600" />
                  Quản lý học phí
                </h1>
                <p className="text-gray-600">
                  Theo dõi lịch sử thanh toán và học phí còn lại
                </p>
              </div>
            </div>

            {/* Payment Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tổng học phí</p>
                    <p className="mt-2 text-2xl font-bold text-gray-900">
                      {formatCurrency(summary.totalFee)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                </div>
                {summary.installmentCount && (
                  <p className="text-xs text-gray-500">
                    Kỳ thanh toán: {summary.completedInstallments}/{summary.installmentCount}
                  </p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Đã thanh toán</p>
                    <p className="mt-2 text-2xl font-bold text-green-600">
                      {formatCurrency(summary.paidAmount)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(summary.paidAmount / summary.totalFee) * 100}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-2 bg-green-600 rounded-full"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Còn lại</p>
                    <p className="mt-2 text-2xl font-bold text-red-600">
                      {formatCurrency(summary.remainingAmount)}
                    </p>
                    {summary.nextDueDate && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>Hạn: {new Date(summary.nextDueDate).toLocaleDateString('vi-VN')}</span>
                      </div>
                    )}
                  </div>
                  <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Search & Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6 flex flex-col sm:flex-row gap-4"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm thanh toán..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto">
              {[
                { key: 'all', label: 'Tất cả', icon: Filter },
                { key: 'completed', label: 'Đã thanh toán', icon: CheckCircle2 },
                { key: 'pending', label: 'Chờ thanh toán', icon: Clock },
                { key: 'overdue', label: 'Quá hạn', icon: AlertCircle }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setStatusFilter(key as any)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
                    statusFilter === key
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Payment History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-blue-600" />
                Lịch sử thanh toán ({filteredPayments.length})
              </h2>
            </div>

            <AnimatePresence>
              {filteredPayments.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12"
                >
                  <CreditCard className="mx-auto h-20 w-20 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Không có thanh toán nào</h3>
                  <p className="text-sm text-gray-500">
                    {searchQuery ? 'Thử tìm kiếm với từ khóa khác' : 'Lịch sử thanh toán của bạn sẽ hiển thị tại đây'}
                  </p>
                </motion.div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ngày
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mô tả
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Phương thức
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Số tiền
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trạng thái
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Hành động
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredPayments.map((payment, index) => (
                        <motion.tr
                          key={payment.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2 text-sm text-gray-900">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              {new Date(payment.date).toLocaleDateString('vi-VN')}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{payment.description}</div>
                              {payment.category && (
                                <span className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${getCategoryInfo(payment.category).color}`}>
                                  {React.createElement(getCategoryInfo(payment.category).icon, { className: 'w-3 h-3' })}
                                  {getCategoryInfo(payment.category).label}
                                </span>
                              )}
                              {payment.installmentPlan && (
                                <div className="mt-2">
                                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                                    <span>Trả góp: {payment.installmentPlan.paid}/{payment.installmentPlan.total} kỳ</span>
                                  </div>
                                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                                    <div 
                                      className="h-1.5 bg-blue-600 rounded-full"
                                      style={{ width: `${(payment.installmentPlan.paid / payment.installmentPlan.total) * 100}%` }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              {getMethodIcon(payment.method)}
                              {getMethodText(payment.method)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            {formatCurrency(payment.amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(payment.status)}
                              <span className="text-sm text-gray-700">
                                {getStatusText(payment.status)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {payment.status === 'completed' && payment.receiptNumber && (
                              <button
                                className="inline-flex items-center space-x-1 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                onClick={() => {
                                  console.log('Download receipt:', payment.receiptNumber);
                                }}
                              >
                                <Download className="w-4 h-4" />
                                <span>Tải HĐ</span>
                              </button>
                            )}
                            {payment.status === 'pending' && (
                              <button
                                className="inline-flex items-center space-x-1 px-3 py-1.5 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-all"
                                onClick={() => {
                                  console.log('Process payment:', payment.id);
                                }}
                              >
                                <Receipt className="w-4 h-4" />
                                <span>Thanh toán</span>
                              </button>
                            )}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Info Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 bg-blue-50 rounded-xl border border-blue-200 p-6"
          >
            <div className="flex items-start gap-3">
              <DollarSign className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Thông tin thanh toán</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Hỗ trợ thanh toán trực tuyến qua ngân hàng và ví điện tử</li>
                  <li>• Thanh toán trả góp với lãi suất 0% cho khóa học dài hạn</li>
                  <li>• Tự động nhận hóa đơn điện tử sau khi thanh toán thành công</li>
                  <li>• Liên hệ phòng kế toán nếu có thắc mắc về học phí: 0123.456.789</li>
                </ul>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </>
  );
};

export default Payments;
