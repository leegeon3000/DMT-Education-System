import React, { useState, useEffect } from 'react';
import { X, Save, DollarSign, Calendar, CreditCard, FileText, Users, BookOpen, Hash, Banknote, Building2, Smartphone } from 'lucide-react';

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

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Partial<Transaction>) => void;
  transaction?: Transaction;
  isEditing?: boolean;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  transaction,
  isEditing = false
}) => {
  const [formData, setFormData] = useState({
    type: 'income' as const,
    category: '',
    amount: 0,
    description: '',
    date: new Date().toISOString().split('T')[0],
    status: 'completed' as const,
    studentId: '',
    studentName: '',
    courseId: '',
    courseName: '',
    invoiceId: '',
    paymentMethod: 'cash' as const,
    reference: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (transaction && isEditing) {
      setFormData({
        type: transaction.type,
        category: transaction.category,
        amount: transaction.amount,
        description: transaction.description,
        date: transaction.date,
        status: transaction.status,
        studentId: transaction.studentId || '',
        studentName: transaction.studentName || '',
        courseId: transaction.courseId || '',
        courseName: transaction.courseName || '',
        invoiceId: transaction.invoiceId || '',
        paymentMethod: transaction.paymentMethod,
        reference: transaction.reference || ''
      });
    } else {
      setFormData({
        type: 'income',
        category: '',
        amount: 0,
        description: '',
        date: new Date().toISOString().split('T')[0],
        status: 'completed',
        studentId: '',
        studentName: '',
        courseId: '',
        courseName: '',
        invoiceId: '',
        paymentMethod: 'cash',
        reference: ''
      });
    }
    setErrors({});
  }, [transaction, isEditing, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.description.trim()) {
      newErrors.description = 'Mô tả giao dịch là bắt buộc';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Danh mục là bắt buộc';
    }

    if (formData.amount <= 0) {
      newErrors.amount = 'Số tiền phải lớn hơn 0';
    }

    if (!formData.date) {
      newErrors.date = 'Ngày giao dịch là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const transactionData = {
      ...formData,
      studentId: formData.studentId || undefined,
      studentName: formData.studentName || undefined,
      courseId: formData.courseId || undefined,
      courseName: formData.courseName || undefined,
      invoiceId: formData.invoiceId || undefined,
      reference: formData.reference || undefined
    };

    onSave(transactionData);
    onClose();
  };

  const incomeCategories = [
    'Học phí',
    'Phí đăng ký',
    'Phí tài liệu',
    'Phí thi thử',
    'Khác'
  ];

  const expenseCategories = [
    'Lương giáo viên',
    'Lương nhân viên',
    'Vận hành',
    'Marketing',
    'Tài liệu',
    'Thiết bị',
    'Thuê mặt bằng',
    'Điện nước',
    'Khác'
  ];

  const categories = formData.type === 'income' ? incomeCategories : expenseCategories;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Chỉnh sửa giao dịch' : 'Ghi nhận thu/chi mới'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại giao dịch *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="relative">
                <input
                  type="radio"
                  value="income"
                  checked={formData.type === 'income'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any, category: '' })}
                  className="sr-only"
                />
                <div className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  formData.type === 'income'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    <span className="font-medium">Thu</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Học phí, phí dịch vụ</p>
                </div>
              </label>
              <label className="relative">
                <input
                  type="radio"
                  value="expense"
                  checked={formData.type === 'expense'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any, category: '' })}
                  className="sr-only"
                />
                <div className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  formData.type === 'expense'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    <span className="font-medium">Chi</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Lương, vận hành</p>
                </div>
              </label>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Danh mục *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Chọn danh mục</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Số tiền (VNĐ) *
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) || 0 })}
                min="0"
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.amount ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Ngày giao dịch *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="completed">Hoàn thành</option>
                <option value="pending">Chờ xử lý</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-1" />
              Mô tả giao dịch *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Mô tả chi tiết về giao dịch..."
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <CreditCard className="w-4 h-4 inline mr-1" />
              Phương thức thanh toán
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { value: 'cash', label: 'Tiền mặt', icon: <Banknote size={20} /> },
                { value: 'bank_transfer', label: 'Chuyển khoản', icon: <Building2 size={20} /> },
                { value: 'credit_card', label: 'Thẻ tín dụng', icon: <CreditCard size={20} /> },
                { value: 'e_wallet', label: 'Ví điện tử', icon: <Smartphone size={20} /> }
              ].map((method) => (
                <label key={method.value} className="relative">
                  <input
                    type="radio"
                    value={method.value}
                    checked={formData.paymentMethod === method.value}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                    className="sr-only"
                  />
                  <div className={`p-3 border-2 rounded-lg cursor-pointer transition-colors text-center ${
                    formData.paymentMethod === method.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}>
                    <div className="flex justify-center mb-1">{method.icon}</div>
                    <div className="text-xs font-medium">{method.label}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Student and Course Information (for income) */}
          {formData.type === 'income' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-t pt-4">
                Thông tin liên quan
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="w-4 h-4 inline mr-1" />
                    Học viên
                  </label>
                  <input
                    type="text"
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tên học viên (tùy chọn)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <BookOpen className="w-4 h-4 inline mr-1" />
                    Khóa học
                  </label>
                  <input
                    type="text"
                    value={formData.courseName}
                    onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tên khóa học (tùy chọn)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Hash className="w-4 h-4 inline mr-1" />
                    Mã hóa đơn
                  </label>
                  <input
                    type="text"
                    value={formData.invoiceId}
                    onChange={(e) => setFormData({ ...formData, invoiceId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Mã hóa đơn liên quan (tùy chọn)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã tham chiếu
                  </label>
                  <input
                    type="text"
                    value={formData.reference}
                    onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Mã giao dịch ngân hàng (tùy chọn)"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Reference for expense */}
          {formData.type === 'expense' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã tham chiếu
              </label>
              <input
                type="text"
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Mã giao dịch, số hóa đơn (tùy chọn)"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {isEditing ? 'Cập nhật' : 'Ghi nhận'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
