import React, { useState, useEffect } from 'react';
import { DollarSign, Plus, Search, Filter, Eye, Edit, Trash2, Download, CreditCard, TrendingUp, TrendingDown, Receipt, Users, Calendar, AlertCircle, CheckCircle, Clock, Banknote, Building2, Smartphone, Wallet } from 'lucide-react';
import AdminLayout from '../AdminLayoutNew';
import PaymentModal from './PaymentModal';
import InvoiceModal from './InvoiceModal';
import FinancialDetailModal from './FinancialDetailModal';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
  studentId?: string;
  studentName?: string;
  courseId?: string;
  courseName?: string;
  invoiceId?: string;
  paymentMethod: 'cash' | 'bank_transfer' | 'credit_card' | 'e_wallet';
  reference?: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  amount: number;
  dueDate: string;
  issueDate: string;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  paymentDate?: string;
  paymentMethod?: string;
  discount?: number;
  taxAmount?: number;
  totalAmount: number;
}

const FinancialManagement: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Transaction | Invoice | undefined>();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchFinancialData();
  }, [searchTerm, statusFilter, typeFilter, dateFilter]);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      // Mock data for development
      setTransactions([
        {
          id: '1',
          type: 'income',
          category: 'Học phí',
          amount: 2500000,
          description: 'Học phí khóa IELTS 6.5 Foundation',
          date: '2025-09-01',
          status: 'completed',
          studentId: 'ST001',
          studentName: 'Nguyễn Văn An',
          courseId: 'C001',
          courseName: 'IELTS 6.5 Foundation',
          invoiceId: 'INV001',
          paymentMethod: 'bank_transfer',
          reference: 'TF20250901001'
        },
        {
          id: '2',
          type: 'income',
          category: 'Học phí',
          amount: 3000000,
          description: 'Học phí khóa TOEIC 800+ Advanced',
          date: '2025-09-02',
          status: 'completed',
          studentId: 'ST002',
          studentName: 'Trần Thị Bình',
          courseId: 'C002',
          courseName: 'TOEIC 800+ Advanced',
          invoiceId: 'INV002',
          paymentMethod: 'credit_card',
          reference: 'CC20250902001'
        },
        {
          id: '3',
          type: 'expense',
          category: 'Lương giáo viên',
          amount: 15000000,
          description: 'Lương tháng 8/2025 - Ms. Nguyễn Thị Lan',
          date: '2025-09-01',
          status: 'completed',
          paymentMethod: 'bank_transfer',
          reference: 'SAL20250901001'
        },
        {
          id: '4',
          type: 'income',
          category: 'Học phí',
          amount: 2000000,
          description: 'Học phí khóa English Communication',
          date: '2025-09-03',
          status: 'pending',
          studentId: 'ST003',
          studentName: 'Lê Minh Cường',
          courseId: 'C003',
          courseName: 'English Communication Basics',
          invoiceId: 'INV003',
          paymentMethod: 'cash'
        },
        {
          id: '5',
          type: 'expense',
          category: 'Vận hành',
          amount: 5000000,
          description: 'Tiền điện, nước, internet tháng 8',
          date: '2025-09-01',
          status: 'completed',
          paymentMethod: 'bank_transfer',
          reference: 'OP20250901001'
        }
      ]);

      setInvoices([
        {
          id: 'INV001',
          invoiceNumber: 'HD-2025-001',
          studentId: 'ST001',
          studentName: 'Nguyễn Văn An',
          courseId: 'C001',
          courseName: 'IELTS 6.5 Foundation',
          amount: 2500000,
          dueDate: '2025-09-15',
          issueDate: '2025-09-01',
          status: 'paid',
          paymentDate: '2025-09-01',
          paymentMethod: 'bank_transfer',
          discount: 0,
          taxAmount: 0,
          totalAmount: 2500000
        },
        {
          id: 'INV002',
          invoiceNumber: 'HD-2025-002',
          studentId: 'ST002',
          studentName: 'Trần Thị Bình',
          courseId: 'C002',
          courseName: 'TOEIC 800+ Advanced',
          amount: 3000000,
          dueDate: '2025-09-16',
          issueDate: '2025-09-02',
          status: 'paid',
          paymentDate: '2025-09-02',
          paymentMethod: 'credit_card',
          discount: 0,
          taxAmount: 0,
          totalAmount: 3000000
        },
        {
          id: 'INV003',
          invoiceNumber: 'HD-2025-003',
          studentId: 'ST003',
          studentName: 'Lê Minh Cường',
          courseId: 'C003',
          courseName: 'English Communication Basics',
          amount: 2000000,
          dueDate: '2025-09-17',
          issueDate: '2025-09-03',
          status: 'pending',
          discount: 200000,
          taxAmount: 0,
          totalAmount: 1800000
        },
        {
          id: 'INV004',
          invoiceNumber: 'HD-2025-004',
          studentId: 'ST004',
          studentName: 'Phạm Thị Dung',
          courseId: 'C004',
          courseName: 'Business English Professional',
          amount: 4000000,
          dueDate: '2025-08-30',
          issueDate: '2025-08-15',
          status: 'overdue',
          discount: 0,
          taxAmount: 0,
          totalAmount: 4000000
        }
      ]);
    } catch (error) {
      console.error('Error fetching financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Hoàn thành';
      case 'paid': return 'Đã thanh toán';
      case 'pending': return 'Chờ xử lý';
      case 'overdue': return 'Quá hạn';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'cash': return <Banknote size={16} />;
      case 'bank_transfer': return <Building2 size={16} />;
      case 'credit_card': return <CreditCard size={16} />;
      case 'e_wallet': return <Smartphone size={16} />;
      default: return <Wallet size={16} />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const calculateStats = () => {
    const totalIncome = transactions
      .filter(t => t.type === 'income' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = transactions
      .filter(t => t.type === 'expense' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const pendingPayments = invoices
      .filter(i => i.status === 'pending' || i.status === 'overdue')
      .reduce((sum, i) => sum + i.totalAmount, 0);
    
    const overdueCount = invoices.filter(i => i.status === 'overdue').length;

    return {
      totalIncome,
      totalExpense,
      profit: totalIncome - totalExpense,
      pendingPayments,
      overdueCount
    };
  };

  const stats = calculateStats();

  const handleCreatePayment = () => {
    setSelectedItem(undefined);
    setIsEditing(false);
    setShowPaymentModal(true);
  };

  const handleCreateInvoice = () => {
    setSelectedItem(undefined);
    setIsEditing(false);
    setShowInvoiceModal(true);
  };

  const handleEditItem = (item: Transaction | Invoice) => {
    setSelectedItem(item);
    setIsEditing(true);
    if ('type' in item) {
      setShowPaymentModal(true);
    } else {
      setShowInvoiceModal(true);
    }
  };

  const handleViewItem = (item: Transaction | Invoice) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  const handleSavePayment = async (paymentData: Partial<Transaction>) => {
    try {
      if (isEditing && selectedItem) {
        console.log('Updating payment:', paymentData);
      } else {
        console.log('Creating payment:', paymentData);
      }
      fetchFinancialData();
    } catch (error) {
      console.error('Error saving payment:', error);
    }
  };

  const handleSaveInvoice = async (invoiceData: Partial<Invoice>) => {
    try {
      if (isEditing && selectedItem) {
        console.log('Updating invoice:', invoiceData);
      } else {
        console.log('Creating invoice:', invoiceData);
      }
      fetchFinancialData();
    } catch (error) {
      console.error('Error saving invoice:', error);
    }
  };

  const handleDeleteItem = async (id: string, type: 'transaction' | 'invoice') => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa ${type === 'transaction' ? 'giao dịch' : 'hóa đơn'} này?`)) {
      try {
        console.log(`Deleting ${type}:`, id);
        fetchFinancialData();
      } catch (error) {
        console.error(`Error deleting ${type}:`, error);
      }
    }
  };

  if (loading) {
    return (
      <AdminLayout currentPage="financial">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPage="financial">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý tài chính</h1>
            <p className="text-gray-600 mt-1">Theo dõi thu chi, hóa đơn và báo cáo tài chính</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={handleCreatePayment}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ghi nhận thu/chi
            </button>
            <button 
              onClick={handleCreateInvoice}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Receipt className="w-4 h-4 mr-2" />
              Tạo hóa đơn
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng thu</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalIncome).slice(0, -2)}tr</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng chi</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(stats.totalExpense).slice(0, -2)}tr</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Lợi nhuận</p>
                <p className={`text-2xl font-bold ${stats.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(stats.profit).slice(0, -2)}tr
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
                <p className="text-sm font-medium text-gray-600">Chờ thanh toán</p>
                <p className="text-2xl font-bold text-yellow-600">{formatCurrency(stats.pendingPayments).slice(0, -2)}tr</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Quá hạn</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdueCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Tổng quan', icon: TrendingUp },
                { id: 'transactions', label: 'Giao dịch', icon: CreditCard },
                { id: 'invoices', label: 'Hóa đơn', icon: Receipt },
                { id: 'reports', label: 'Báo cáo', icon: DollarSign }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Revenue Chart Placeholder */}
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Biểu đồ doanh thu</h3>
                  <p className="text-gray-500">Biểu đồ thống kê doanh thu theo thời gian sẽ được hiển thị ở đây</p>
                </div>

                {/* Recent Transactions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Giao dịch gần đây</h3>
                  <div className="space-y-3">
                    {transactions.slice(0, 5).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-3 ${
                            transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                          <div>
                            <p className="font-medium text-gray-900">{transaction.description}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(transaction.date).toLocaleDateString('vi-VN')} • {getPaymentMethodIcon(transaction.paymentMethod)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${
                            transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </p>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                            {getStatusText(transaction.status)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'transactions' && (
              <div className="space-y-4">
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Tất cả loại</option>
                    <option value="income">Thu</option>
                    <option value="expense">Chi</option>
                  </select>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="pending">Chờ xử lý</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Tất cả thời gian</option>
                    <option value="today">Hôm nay</option>
                    <option value="week">Tuần này</option>
                    <option value="month">Tháng này</option>
                    <option value="quarter">Quý này</option>
                  </select>
                </div>

                {/* Transactions Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mô tả</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loại</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số tiền</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">PT Thanh toán</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {transactions.map((transaction) => (
                        <tr key={transaction.id}>
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{transaction.description}</div>
                              {transaction.studentName && (
                                <div className="text-sm text-gray-500">{transaction.studentName}</div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {transaction.type === 'income' ? 'Thu' : 'Chi'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`font-medium ${
                              transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {formatCurrency(transaction.amount)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(transaction.date).toLocaleDateString('vi-VN')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                              {getStatusText(transaction.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {getPaymentMethodIcon(transaction.paymentMethod)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button 
                                onClick={() => handleViewItem(transaction)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleEditItem(transaction)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteItem(transaction.id, 'transaction')}
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
            )}

            {activeTab === 'invoices' && (
              <div className="space-y-4">
                {/* Invoice Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <div>
                        <p className="text-sm text-green-600">Đã thanh toán</p>
                        <p className="text-lg font-bold text-green-900">
                          {invoices.filter(i => i.status === 'paid').length}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-yellow-600 mr-2" />
                      <div>
                        <p className="text-sm text-yellow-600">Chờ thanh toán</p>
                        <p className="text-lg font-bold text-yellow-900">
                          {invoices.filter(i => i.status === 'pending').length}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                      <div>
                        <p className="text-sm text-red-600">Quá hạn</p>
                        <p className="text-lg font-bold text-red-900">
                          {invoices.filter(i => i.status === 'overdue').length}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <DollarSign className="w-5 h-5 text-blue-600 mr-2" />
                      <div>
                        <p className="text-sm text-blue-600">Tổng giá trị</p>
                        <p className="text-lg font-bold text-blue-900">
                          {formatCurrency(invoices.reduce((sum, i) => sum + i.totalAmount, 0)).slice(0, -2)}tr
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Invoices Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số HĐ</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Học viên</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khóa học</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số tiền</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày hạn</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {invoices.map((invoice) => (
                        <tr key={invoice.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(invoice.issueDate).toLocaleDateString('vi-VN')}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{invoice.studentName}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{invoice.courseName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{formatCurrency(invoice.totalAmount)}</div>
                            {invoice.discount && invoice.discount > 0 && (
                              <div className="text-sm text-green-600">Giảm {formatCurrency(invoice.discount)}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(invoice.dueDate).toLocaleDateString('vi-VN')}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                              {getStatusText(invoice.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button 
                                onClick={() => handleViewItem(invoice)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Xem chi tiết"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button 
                                className="text-green-600 hover:text-green-900"
                                title="Tải xuống"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleEditItem(invoice)}
                                className="text-indigo-600 hover:text-indigo-900"
                                title="Chỉnh sửa"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteItem(invoice.id, 'invoice')}
                                className="text-red-600 hover:text-red-900"
                                title="Xóa"
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
            )}

            {activeTab === 'reports' && (
              <div className="space-y-6">
                <div className="text-center py-12">
                  <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Báo cáo tài chính</h3>
                  <p className="text-gray-500 mb-4">Các báo cáo tài chính chi tiết sẽ được hiển thị ở đây</p>
                  <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Download className="w-4 h-4 mr-2" />
                    Xuất báo cáo
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSave={handleSavePayment}
        transaction={selectedItem as Transaction}
        isEditing={isEditing}
      />

      <InvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        onSave={handleSaveInvoice}
        invoice={selectedItem as Invoice}
        isEditing={isEditing}
      />

      {selectedItem && (
        <FinancialDetailModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          item={selectedItem}
        />
      )}
    </AdminLayout>
  );
};

export default FinancialManagement;
