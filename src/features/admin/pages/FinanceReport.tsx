import React, { useEffect, useState } from 'react';
import { 
  BarChart3, 
  Download,
  Calendar, 
  CreditCard, 
  TrendingUp, 
  ChevronDown, 
  Filter,
  DollarSign,
  Wallet,
  ReceiptText,
  Printer
} from 'lucide-react';
import Spinner from '../../../components/common/Spinner';

// Mock financial data
interface MonthlyRevenue {
  month: string;
  year: number;
  tuitionFees: number;
  bookSales: number;
  examFees: number;
  otherIncome: number;
}

interface Expense {
  id: string;
  date: string;
  category: string;
  amount: number;
  description: string;
  paymentMethod: string;
}

interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  amount: number;
  paymentMethod: string;
  courseId: string;
  courseName: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  note?: string;
}

// Mock data
const mockMonthlyRevenue: MonthlyRevenue[] = Array.from({ length: 12 }, (_, idx) => {
  const month = new Date(2023, idx, 1).toLocaleString('vi-VN', { month: 'short' });
  const baseAmount = 400000000 + Math.random() * 200000000;
  
  return {
    month,
    year: 2023,
    tuitionFees: Math.round(baseAmount * 0.7),
    bookSales: Math.round(baseAmount * 0.1),
    examFees: Math.round(baseAmount * 0.15),
    otherIncome: Math.round(baseAmount * 0.05)
  };
});

const mockExpenses: Expense[] = Array.from({ length: 20 }, (_, idx) => {
  const categories = [
    'Lương nhân viên', 'Tiền thuê nhà', 'Tiền điện', 'Tiền nước', 
    'Tiếp thị và quảng cáo', 'Trang thiết bị', 'Bảo trì', 'Khác'
  ];
  
  const date = new Date(2023, Math.floor(idx / 2), Math.floor(1 + Math.random() * 28));
  
  return {
    id: `EXP${(idx + 1).toString().padStart(4, '0')}`,
    date: date.toLocaleDateString('vi-VN'),
    category: categories[idx % categories.length],
    amount: Math.round((100000000 + Math.random() * 100000000) / 10),
    description: `Chi phí ${categories[idx % categories.length].toLowerCase()} tháng ${date.getMonth() + 1}`,
    paymentMethod: ['Chuyển khoản', 'Tiền mặt', 'Thẻ tín dụng'][idx % 3]
  };
});

const mockPayments: Payment[] = Array.from({ length: 50 }, (_, idx) => {
  const date = new Date(2023, Math.floor(idx / 5), Math.floor(1 + Math.random() * 28));
  const statuses: ('completed' | 'pending' | 'failed' | 'refunded')[] = ['completed', 'pending', 'failed', 'refunded'];
  const paymentMethods = ['Chuyển khoản', 'Tiền mặt', 'Thẻ tín dụng', 'Ví điện tử', 'Thanh toán online'];
  const courses = [
    'Toán học nâng cao', 'Vật lý cơ bản', 'Hóa học chuyên sâu', 
    'Tiếng Anh giao tiếp', 'Ngữ văn và văn học'
  ];
  
  return {
    id: `PAY${(idx + 1).toString().padStart(4, '0')}`,
    studentId: `STD${Math.floor(1000 + Math.random() * 9000)}`,
    studentName: ['Nguyễn Văn An', 'Trần Thị Bình', 'Lê Hoàng Cường', 'Phạm Minh Đức', 'Hoàng Thị Em'][idx % 5],
    date: date.toLocaleDateString('vi-VN'),
    amount: Math.round(5000000 + Math.random() * 5000000),
    paymentMethod: paymentMethods[idx % paymentMethods.length],
    courseId: `CRS${Math.floor(1000 + Math.random() * 9000)}`,
    courseName: courses[idx % courses.length],
    status: Math.random() > 0.8 ? statuses[1 + Math.floor(Math.random() * 3)] : 'completed',
    note: Math.random() > 0.8 ? 'Thanh toán một phần' : undefined
  };
});

// Chart Components
const BarChart: React.FC<{ data: MonthlyRevenue[] }> = ({ data }) => {
  const totalRevenueByMonth = data.map(item => 
    item.tuitionFees + item.bookSales + item.examFees + item.otherIncome
  );
  
  const maxRevenue = Math.max(...totalRevenueByMonth);
  const categories = ['Học phí', 'Sách giáo khoa', 'Phí thi', 'Thu nhập khác'];
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#dc2626'];
  
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[700px]">
        <div className="flex items-end h-64 gap-4 mt-6">
          {data.map((item, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center">
              <div className="w-full flex flex-col-reverse h-56">
                {/* Other Income */}
                <div 
                  className="w-full bg-red-500" 
                  style={{ 
                    height: `${(item.otherIncome / maxRevenue) * 100}%`,
                    transition: 'height 1s ease'
                  }} 
                  title={`Thu nhập khác: ${formatCurrency(item.otherIncome)}`}
                />
                
                {/* Exam Fees */}
                <div 
                  className="w-full bg-amber-500" 
                  style={{ 
                    height: `${(item.examFees / maxRevenue) * 100}%`,
                    transition: 'height 1s ease'
                  }} 
                  title={`Phí thi: ${formatCurrency(item.examFees)}`}
                />
                
                {/* Book Sales */}
                <div 
                  className="w-full bg-emerald-500" 
                  style={{ 
                    height: `${(item.bookSales / maxRevenue) * 100}%`,
                    transition: 'height 1s ease'
                  }} 
                  title={`Sách giáo khoa: ${formatCurrency(item.bookSales)}`}
                />
                
                {/* Tuition Fees */}
                <div 
                  className="w-full bg-blue-500" 
                  style={{ 
                    height: `${(item.tuitionFees / maxRevenue) * 100}%`,
                    transition: 'height 1s ease'
                  }} 
                  title={`Học phí: ${formatCurrency(item.tuitionFees)}`}
                />
              </div>
              <div className="text-xs font-medium text-gray-600 mt-2">
                {item.month}
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-8 gap-6">
          {categories.map((category, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: colors[idx] }}
              />
              <span className="text-xs text-gray-700">{category}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount);
};

const FinanceReport: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'expenses'>('overview');
  const [yearFilter, setYearFilter] = useState(2023);
  const [monthFilter, setMonthFilter] = useState<number | null>(null);
  
  // Processed data
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  
  // Summary data
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    pendingPayments: 0,
    completedPayments: 0,
    refundedPayments: 0
  });

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setMonthlyRevenue(mockMonthlyRevenue);
      setPayments(mockPayments);
      setExpenses(mockExpenses);
      
      // Calculate summary
      const totalRevenue = mockMonthlyRevenue.reduce(
        (sum, item) => sum + item.tuitionFees + item.bookSales + item.examFees + item.otherIncome, 
        0
      );
      
      const totalExpenses = mockExpenses.reduce((sum, item) => sum + item.amount, 0);
      const pendingPayments = mockPayments.filter(p => p.status === 'pending').length;
      const completedPayments = mockPayments.filter(p => p.status === 'completed').length;
      const refundedPayments = mockPayments.filter(p => p.status === 'refunded').length;
      
      setSummary({
        totalRevenue,
        totalExpenses,
        netProfit: totalRevenue - totalExpenses,
        pendingPayments,
        completedPayments,
        refundedPayments
      });
      
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter data based on year and month
  const filteredMonthlyRevenue = monthlyRevenue.filter(item => item.year === yearFilter);
  
  const filteredPayments = payments.filter(payment => {
    const paymentDate = new Date(payment.date.split('/').reverse().join('-'));
    return (
      paymentDate.getFullYear() === yearFilter && 
      (monthFilter === null || paymentDate.getMonth() === monthFilter - 1)
    );
  });
  
  const filteredExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date.split('/').reverse().join('-'));
    return (
      expenseDate.getFullYear() === yearFilter && 
      (monthFilter === null || expenseDate.getMonth() === monthFilter - 1)
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size={40} />
        <span className="ml-3 text-gray-600">Đang tải dữ liệu tài chính...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Báo cáo tài chính</h1>
          <p className="text-gray-600">Xem tổng quan tài chính và chi tiết các khoản thu chi</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => alert('Chức năng xuất báo cáo sẽ được bổ sung sau')}
            className="px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-1"
          >
            <Download size={18} />
            <span className="hidden sm:inline-block">Xuất báo cáo</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-1"
          >
            <Printer size={18} />
            <span className="hidden sm:inline-block">In báo cáo</span>
          </button>
        </div>
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm font-medium text-gray-500">Tổng doanh thu</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.totalRevenue)}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 text-blue-500">
              <Wallet size={22} />
            </div>
          </div>
          <div className="flex items-center text-xs">
            <TrendingUp size={14} className="text-green-500 mr-1" />
            <span className="text-green-500 font-medium">12.5%</span>
            <span className="text-gray-500 ml-1">so với năm trước</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm font-medium text-gray-500">Tổng chi phí</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.totalExpenses)}</p>
            </div>
            <div className="p-3 rounded-lg bg-red-50 text-red-500">
              <CreditCard size={22} />
            </div>
          </div>
          <div className="flex items-center text-xs">
            <TrendingUp size={14} className="text-red-500 mr-1" />
            <span className="text-red-500 font-medium">8.3%</span>
            <span className="text-gray-500 ml-1">so với năm trước</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm font-medium text-gray-500">Lợi nhuận</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.netProfit)}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-50 text-green-500">
              <DollarSign size={22} />
            </div>
          </div>
          <div className="flex items-center text-xs">
            <TrendingUp size={14} className="text-green-500 mr-1" />
            <span className="text-green-500 font-medium">15.2%</span>
            <span className="text-gray-500 ml-1">so với năm trước</span>
          </div>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'overview'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('overview')}
        >
          Tổng quan
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'payments'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('payments')}
        >
          Khoản thu
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'expenses'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('expenses')}
        >
          Khoản chi
        </button>
      </div>
      
      {/* Filter Controls */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Năm</label>
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          >
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tháng</label>
          <select
            value={monthFilter === null ? '' : monthFilter}
            onChange={(e) => setMonthFilter(e.target.value ? parseInt(e.target.value) : null)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          >
            <option value="">Tất cả tháng</option>
            {Array.from({ length: 12 }, (_, idx) => (
              <option key={idx} value={idx + 1}>
                Tháng {idx + 1}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Tab Content */}
      {activeTab === 'overview' && (
        <>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Doanh thu theo tháng</h3>
            <BarChart data={filteredMonthlyRevenue} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Chi phí theo danh mục</h3>
              <div className="space-y-3">
                {/* Group expenses by category and calculate total */}
                {Object.entries(filteredExpenses.reduce((acc, expense) => {
                  if (!acc[expense.category]) acc[expense.category] = 0;
                  acc[expense.category] += expense.amount;
                  return acc;
                }, {} as Record<string, number>))
                  .sort(([, a], [, b]) => b - a)
                  .map(([category, amount], idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ 
                            backgroundColor: [
                              '#3b82f6', '#10b981', '#f59e0b', '#dc2626',
                              '#ef4444', '#ec4899', '#14b8a6', '#6366f1'
                            ][idx % 8]
                          }}
                        />
                        <span className="text-sm text-gray-700">{category}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(amount)}
                      </span>
                    </div>
                  ))
                }
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Trạng thái thanh toán</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-gray-600">Đã thanh toán</div>
                    <div className="text-sm font-medium text-gray-900">{summary.completedPayments}</div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(summary.completedPayments / payments.length) * 100}%` }}
                    />
                  </div>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-gray-600">Đang chờ</div>
                    <div className="text-sm font-medium text-gray-900">{summary.pendingPayments}</div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ width: `${(summary.pendingPayments / payments.length) * 100}%` }}
                    />
                  </div>
                </div>
                
                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-gray-600">Hoàn tiền</div>
                    <div className="text-sm font-medium text-gray-900">{summary.refundedPayments}</div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ width: `${(summary.refundedPayments / payments.length) * 100}%` }}
                    />
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-gray-600">Thất bại</div>
                    <div className="text-sm font-medium text-gray-900">
                      {payments.filter(p => p.status === 'failed').length}
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gray-500 h-2 rounded-full" 
                      style={{ 
                        width: `${(payments.filter(p => p.status === 'failed').length / payments.length) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      
      {activeTab === 'payments' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Học sinh
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khóa học
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày thanh toán
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phương thức
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{payment.studentName}</div>
                      <div className="text-xs text-gray-500">{payment.studentId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.courseName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.paymentMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          payment.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : payment.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : payment.status === 'failed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {payment.status === 'completed'
                          ? 'Đã thanh toán'
                          : payment.status === 'pending'
                          ? 'Đang chờ'
                          : payment.status === 'failed'
                          ? 'Thất bại'
                          : 'Hoàn tiền'}
                      </span>
                    </td>
                  </tr>
                ))}
                
                {filteredPayments.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                      Không có khoản thanh toán nào phù hợp với bộ lọc
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {filteredPayments.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-500">
              Hiển thị {filteredPayments.length} khoản thanh toán
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'expenses' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Danh mục
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mô tả
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày chi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phương thức
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {expense.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {expense.category}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {expense.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {expense.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(expense.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {expense.paymentMethod}
                    </td>
                  </tr>
                ))}
                
                {filteredExpenses.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                      Không có khoản chi nào phù hợp với bộ lọc
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {filteredExpenses.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-500">
              Hiển thị {filteredExpenses.length} khoản chi
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FinanceReport;
