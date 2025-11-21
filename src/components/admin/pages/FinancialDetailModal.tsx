import React from 'react';
import { X, Calendar, DollarSign, CreditCard, FileText, Users, BookOpen, Tag, Hash, CheckCircle, Clock, XCircle } from 'lucide-react';

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

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  issueDate: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  notes?: string;
  paymentMethod?: string;
  paymentDate?: string;
}

interface FinancialDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Transaction | Invoice | null;
  type: 'transaction' | 'invoice';
}

const FinancialDetailModal: React.FC<FinancialDetailModalProps> = ({
  isOpen,
  onClose,
  data,
  type
}) => {
  if (!isOpen || !data) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'paid':
        return 'text-green-600 bg-green-100';
      case 'pending':
      case 'sent':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      case 'draft':
        return 'text-gray-600 bg-gray-100';
      case 'overdue':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'paid':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
      case 'sent':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
      case 'overdue':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      completed: 'Hoàn thành',
      pending: 'Chờ xử lý',
      cancelled: 'Đã hủy',
      draft: 'Bản nháp',
      sent: 'Đã gửi',
      paid: 'Đã thanh toán',
      overdue: 'Quá hạn'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getPaymentMethodText = (method: string) => {
    const methodMap = {
      cash: 'Tiền mặt',
      bank_transfer: 'Chuyển khoản',
      credit_card: 'Thẻ tín dụng',
      e_wallet: 'Ví điện tử'
    };
    return methodMap[method as keyof typeof methodMap] || method;
  };

  const renderTransactionDetail = (transaction: Transaction) => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              transaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}>
              <DollarSign className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {transaction.type === 'income' ? 'Giao dịch thu' : 'Giao dịch chi'}
              </h3>
              <p className="text-sm text-gray-600">Mã: {transaction.id}</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getStatusColor(transaction.status)}`}>
            {getStatusIcon(transaction.status)}
            <span className="ml-1">{getStatusText(transaction.status)}</span>
          </div>
        </div>
        
        <div className="text-center">
          <div className={`text-3xl font-bold ${
            transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
          }`}>
            {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toLocaleString('vi-VN')} VNĐ
          </div>
          <p className="text-gray-600 mt-1">{transaction.category}</p>
        </div>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 text-gray-400 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Ngày giao dịch</p>
              <p className="font-medium">{new Date(transaction.date).toLocaleDateString('vi-VN')}</p>
            </div>
          </div>

          <div className="flex items-center">
            <CreditCard className="w-5 h-5 text-gray-400 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Phương thức thanh toán</p>
              <p className="font-medium">{getPaymentMethodText(transaction.paymentMethod)}</p>
            </div>
          </div>

          {transaction.reference && (
            <div className="flex items-center">
              <Hash className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Mã tham chiếu</p>
                <p className="font-medium">{transaction.reference}</p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {transaction.studentName && (
            <div className="flex items-center">
              <Users className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Học viên</p>
                <p className="font-medium">{transaction.studentName}</p>
              </div>
            </div>
          )}

          {transaction.courseName && (
            <div className="flex items-center">
              <BookOpen className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Khóa học</p>
                <p className="font-medium">{transaction.courseName}</p>
              </div>
            </div>
          )}

          {transaction.invoiceId && (
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Hóa đơn liên quan</p>
                <p className="font-medium">{transaction.invoiceId}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-start">
          <FileText className="w-5 h-5 text-gray-400 mr-3 mt-1" />
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-1">Mô tả giao dịch</p>
            <p className="text-gray-900">{transaction.description}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInvoiceDetail = (invoice: Invoice) => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Hóa đơn #{invoice.invoiceNumber}
              </h3>
              <p className="text-sm text-gray-600">Mã: {invoice.id}</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getStatusColor(invoice.status)}`}>
            {getStatusIcon(invoice.status)}
            <span className="ml-1">{getStatusText(invoice.status)}</span>
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600">
            {invoice.total.toLocaleString('vi-VN')} VNĐ
          </div>
          <p className="text-gray-600 mt-1">Tổng giá trị hóa đơn</p>
        </div>
      </div>

      {/* Invoice Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center">
            <Users className="w-5 h-5 text-gray-400 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Học viên</p>
              <p className="font-medium">{invoice.studentName}</p>
            </div>
          </div>

          <div className="flex items-center">
            <BookOpen className="w-5 h-5 text-gray-400 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Khóa học</p>
              <p className="font-medium">{invoice.courseName}</p>
            </div>
          </div>

          <div className="flex items-center">
            <Calendar className="w-5 h-5 text-gray-400 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Ngày phát hành</p>
              <p className="font-medium">{new Date(invoice.issueDate).toLocaleDateString('vi-VN')}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 text-gray-400 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Ngày đến hạn</p>
              <p className="font-medium">{new Date(invoice.dueDate).toLocaleDateString('vi-VN')}</p>
            </div>
          </div>

          {invoice.paymentMethod && (
            <div className="flex items-center">
              <CreditCard className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Phương thức thanh toán</p>
                <p className="font-medium">{getPaymentMethodText(invoice.paymentMethod)}</p>
              </div>
            </div>
          )}

          {invoice.paymentDate && (
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Ngày thanh toán</p>
                <p className="font-medium">{new Date(invoice.paymentDate).toLocaleDateString('vi-VN')}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Invoice Items */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">Chi tiết hóa đơn</h4>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mô tả
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số lượng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đơn giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thành tiền
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoice.items?.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.unitPrice.toLocaleString('vi-VN')} VNĐ
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.amount.toLocaleString('vi-VN')} VNĐ
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Tạm tính:</span>
            <span>{invoice.subtotal.toLocaleString('vi-VN')} VNĐ</span>
          </div>
          {invoice.tax > 0 && (
            <div className="flex justify-between text-sm">
              <span>Thuế ({invoice.tax}%):</span>
              <span>{((invoice.subtotal * invoice.tax) / 100).toLocaleString('vi-VN')} VNĐ</span>
            </div>
          )}
          {invoice.discount > 0 && (
            <div className="flex justify-between text-sm">
              <span>Giảm giá ({invoice.discount}%):</span>
              <span className="text-red-600">-{((invoice.subtotal * invoice.discount) / 100).toLocaleString('vi-VN')} VNĐ</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-semibold border-t pt-2">
            <span>Tổng cộng:</span>
            <span className="text-purple-600">{invoice.total.toLocaleString('vi-VN')} VNĐ</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start">
            <FileText className="w-5 h-5 text-blue-400 mr-3 mt-1" />
            <div className="flex-1">
              <p className="text-sm text-blue-600 mb-1">Ghi chú</p>
              <p className="text-blue-900">{invoice.notes}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {type === 'transaction' ? 'Chi tiết giao dịch' : 'Chi tiết hóa đơn'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {type === 'transaction' ? renderTransactionDetail(data as Transaction) : renderInvoiceDetail(data as Invoice)}
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinancialDetailModal;
