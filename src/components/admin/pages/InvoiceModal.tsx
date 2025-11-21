import React, { useState, useEffect } from 'react';
import { X, Save, FileText, Calendar, DollarSign, Users, BookOpen, Calculator, Tag } from 'lucide-react';

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

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (invoice: Partial<Invoice>) => void;
  invoice?: Invoice;
  isEditing?: boolean;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  invoice,
  isEditing = false
}) => {
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    studentId: '',
    studentName: '',
    courseId: '',
    courseName: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'draft' as const,
    items: [] as InvoiceItem[],
    subtotal: 0,
    tax: 0,
    discount: 0,
    total: 0,
    notes: '',
    paymentMethod: '',
    paymentDate: ''
  });

  const [currentItem, setCurrentItem] = useState({
    description: '',
    quantity: 1,
    unitPrice: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (invoice && isEditing) {
      setFormData({
        invoiceNumber: invoice.invoiceNumber,
        studentId: invoice.studentId,
        studentName: invoice.studentName,
        courseId: invoice.courseId,
        courseName: invoice.courseName,
        issueDate: invoice.issueDate,
        dueDate: invoice.dueDate,
        status: invoice.status,
        items: invoice.items || [],
        subtotal: invoice.subtotal,
        tax: invoice.tax,
        discount: invoice.discount,
        total: invoice.total,
        notes: invoice.notes || '',
        paymentMethod: invoice.paymentMethod || '',
        paymentDate: invoice.paymentDate || ''
      });
    } else {
      const invoiceNumber = `INV-${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
      setFormData({
        invoiceNumber,
        studentId: '',
        studentName: '',
        courseId: '',
        courseName: '',
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'draft',
        items: [],
        subtotal: 0,
        tax: 0,
        discount: 0,
        total: 0,
        notes: '',
        paymentMethod: '',
        paymentDate: ''
      });
    }
    setErrors({});
  }, [invoice, isEditing, isOpen]);

  const calculateTotals = (items: InvoiceItem[], tax: number, discount: number) => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = (subtotal * tax) / 100;
    const discountAmount = (subtotal * discount) / 100;
    const total = subtotal + taxAmount - discountAmount;
    
    return { subtotal, taxAmount, discountAmount, total };
  };

  const addItem = () => {
    if (!currentItem.description.trim() || currentItem.quantity <= 0 || currentItem.unitPrice <= 0) {
      return;
    }

    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      description: currentItem.description,
      quantity: currentItem.quantity,
      unitPrice: currentItem.unitPrice,
      amount: currentItem.quantity * currentItem.unitPrice
    };

    const updatedItems = [...formData.items, newItem];
    const { subtotal, taxAmount, total } = calculateTotals(updatedItems, formData.tax, formData.discount);

    setFormData({
      ...formData,
      items: updatedItems,
      subtotal,
      total
    });

    setCurrentItem({
      description: '',
      quantity: 1,
      unitPrice: 0
    });
  };

  const removeItem = (itemId: string) => {
    const updatedItems = formData.items.filter(item => item.id !== itemId);
    const { subtotal, total } = calculateTotals(updatedItems, formData.tax, formData.discount);

    setFormData({
      ...formData,
      items: updatedItems,
      subtotal,
      total
    });
  };

  const updateTaxOrDiscount = (field: 'tax' | 'discount', value: number) => {
    const { subtotal, total } = calculateTotals(
      formData.items,
      field === 'tax' ? value : formData.tax,
      field === 'discount' ? value : formData.discount
    );

    setFormData({
      ...formData,
      [field]: value,
      subtotal,
      total
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.studentName.trim()) {
      newErrors.studentName = 'Tên học viên là bắt buộc';
    }

    if (!formData.courseName.trim()) {
      newErrors.courseName = 'Tên khóa học là bắt buộc';
    }

    if (formData.items.length === 0) {
      newErrors.items = 'Cần ít nhất một mục trong hóa đơn';
    }

    if (!formData.issueDate) {
      newErrors.issueDate = 'Ngày phát hành là bắt buộc';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Ngày đến hạn là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Chỉnh sửa hóa đơn' : 'Tạo hóa đơn mới'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Invoice Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-1" />
                Số hóa đơn
              </label>
              <input
                type="text"
                value={formData.invoiceNumber}
                onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                readOnly
              />
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
                <option value="draft">Bản nháp</option>
                <option value="sent">Đã gửi</option>
                <option value="paid">Đã thanh toán</option>
                <option value="overdue">Quá hạn</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Ngày phát hành *
              </label>
              <input
                type="date"
                value={formData.issueDate}
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.issueDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.issueDate && <p className="text-red-500 text-sm mt-1">{errors.issueDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Ngày đến hạn *
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.dueDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>}
            </div>
          </div>

          {/* Student and Course Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin học viên & khóa học</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="w-4 h-4 inline mr-1" />
                  Tên học viên *
                </label>
                <input
                  type="text"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.studentName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nhập tên học viên"
                />
                {errors.studentName && <p className="text-red-500 text-sm mt-1">{errors.studentName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <BookOpen className="w-4 h-4 inline mr-1" />
                  Tên khóa học *
                </label>
                <input
                  type="text"
                  value={formData.courseName}
                  onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.courseName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nhập tên khóa học"
                />
                {errors.courseName && <p className="text-red-500 text-sm mt-1">{errors.courseName}</p>}
              </div>
            </div>
          </div>

          {/* Invoice Items */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Chi tiết hóa đơn</h3>
              {errors.items && <p className="text-red-500 text-sm">{errors.items}</p>}
            </div>

            {/* Add Item Form */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <input
                    type="text"
                    value={currentItem.description}
                    onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Mô tả dịch vụ/sản phẩm"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    value={currentItem.quantity}
                    onChange={(e) => setCurrentItem({ ...currentItem, quantity: parseInt(e.target.value) || 1 })}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Số lượng"
                  />
                </div>
                <div className="flex">
                  <input
                    type="number"
                    value={currentItem.unitPrice}
                    onChange={(e) => setCurrentItem({ ...currentItem, unitPrice: parseInt(e.target.value) || 0 })}
                    min="0"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Đơn giá"
                  />
                  <button
                    type="button"
                    onClick={addItem}
                    className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                  >
                    Thêm
                  </button>
                </div>
              </div>
            </div>

            {/* Items List */}
            {formData.items.length > 0 && (
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {formData.items.map((item) => (
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Totals */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Tag className="w-4 h-4 inline mr-1" />
                  Thuế (%)
                </label>
                <input
                  type="number"
                  value={formData.tax}
                  onChange={(e) => updateTaxOrDiscount('tax', parseFloat(e.target.value) || 0)}
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Tag className="w-4 h-4 inline mr-1" />
                  Giảm giá (%)
                </label>
                <input
                  type="number"
                  value={formData.discount}
                  onChange={(e) => updateTaxOrDiscount('discount', parseFloat(e.target.value) || 0)}
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tạm tính:</span>
                  <span>{formData.subtotal.toLocaleString('vi-VN')} VNĐ</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Thuế:</span>
                  <span>{((formData.subtotal * formData.tax) / 100).toLocaleString('vi-VN')} VNĐ</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Giảm giá:</span>
                  <span>-{((formData.subtotal * formData.discount) / 100).toLocaleString('vi-VN')} VNĐ</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t pt-2">
                  <span>Tổng cộng:</span>
                  <span className="text-blue-600">{formData.total.toLocaleString('vi-VN')} VNĐ</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ghi chú
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ghi chú thêm cho hóa đơn..."
            />
          </div>

          {/* Payment Information (if paid) */}
          {formData.status === 'paid' && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-green-800 mb-4">Thông tin thanh toán</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">
                    Phương thức thanh toán
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full px-3 py-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Chọn phương thức</option>
                    <option value="cash">Tiền mặt</option>
                    <option value="bank_transfer">Chuyển khoản</option>
                    <option value="credit_card">Thẻ tín dụng</option>
                    <option value="e_wallet">Ví điện tử</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">
                    Ngày thanh toán
                  </label>
                  <input
                    type="date"
                    value={formData.paymentDate}
                    onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                    className="w-full px-3 py-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
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
              {isEditing ? 'Cập nhật hóa đơn' : 'Tạo hóa đơn'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceModal;
