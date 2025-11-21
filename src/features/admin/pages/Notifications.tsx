import React, { useEffect, useState } from 'react';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Spinner from '../../../components/common/Spinner';
import Modal from '../../../components/common/Modal';

interface NotificationTemplate {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'push' | 'system';
  subject: string;
  content: string;
  variables: string[];
  isActive: boolean;
  usageCount: number;
  lastUsed?: string;
}

interface NotificationSend {
  id: string;
  templateId: string;
  templateName: string;
  recipients: {
    type: 'all' | 'role' | 'individual' | 'course';
    targets: string[];
    count: number;
  };
  type: 'email' | 'sms' | 'push' | 'system';
  status: 'draft' | 'sending' | 'sent' | 'failed';
  sentAt?: string;
  deliveredCount: number;
  failedCount: number;
  openRate?: number;
  clickRate?: number;
}

interface NotificationStats {
  totalSent: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  failureRate: number;
  activeTemplates: number;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'sent': return 'bg-green-100 text-green-700';
    case 'sending': return 'bg-blue-100 text-blue-700';
    case 'failed': return 'bg-red-100 text-red-700';
    default: return 'bg-yellow-100 text-yellow-700';
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'email': return 'bg-blue-100 text-blue-700';
    case 'sms': return 'bg-green-100 text-green-700';
    case 'push': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const NotificationTemplateCard: React.FC<{
  template: NotificationTemplate;
  onEdit: (template: NotificationTemplate) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, isActive: boolean) => void;
  onSend: (template: NotificationTemplate) => void;
}> = ({ template, onEdit, onDelete, onToggleStatus, onSend }) => {
  return (
    <Card>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-gray-900">{template.name}</h3>
            <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(template.type)}`}>
              {template.type.toUpperCase()}
            </span>
            <span className={`px-2 py-1 text-xs rounded-full ${
              template.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
            }`}>
              {template.isActive ? 'Kích hoạt' : 'Tạm dừng'}
            </span>
          </div>
          
          <p className="text-sm font-medium text-gray-800 mb-1">{template.subject}</p>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.content}</p>
          
          <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">Biến:</span> {template.variables.length}
            </div>
            <div>
              <span className="font-medium">Đã dùng:</span> {template.usageCount} lần
            </div>
            <div>
              <span className="font-medium">Lần cuối:</span> {template.lastUsed || 'Chưa dùng'}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <Button size="sm" variant="primary" onClick={() => onSend(template)}>
          Gửi thông báo
        </Button>
        <Button size="sm" variant="secondary" onClick={() => onEdit(template)}>
          Chỉnh sửa
        </Button>
        <Button 
          size="sm" 
          variant={template.isActive ? 'outline' : 'primary'}
          onClick={() => onToggleStatus(template.id, !template.isActive)}
        >
          {template.isActive ? 'Tạm dừng' : 'Kích hoạt'}
        </Button>
        <Button size="sm" variant="danger" onClick={() => onDelete(template.id)}>
          Xóa
        </Button>
      </div>
    </Card>
  );
};

const TemplateForm: React.FC<{
  open: boolean;
  onClose: () => void;
  onSubmit: (template: Omit<NotificationTemplate, 'id' | 'usageCount' | 'lastUsed'>) => void;
  initialData?: NotificationTemplate | null;
}> = ({ open, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'email' as 'email' | 'sms' | 'push' | 'system',
    subject: '',
    content: '',
    variables: [] as string[],
    isActive: true
  });
  
  const [newVariable, setNewVariable] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        type: initialData.type,
        subject: initialData.subject,
        content: initialData.content,
        variables: initialData.variables,
        isActive: initialData.isActive
      });
    } else {
      setFormData({
        name: '',
        type: 'email',
        subject: '',
        content: '',
        variables: [],
        isActive: true
      });
    }
  }, [initialData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addVariable = () => {
    if (newVariable && !formData.variables.includes(newVariable)) {
      setFormData(prev => ({
        ...prev,
        variables: [...prev.variables, newVariable]
      }));
      setNewVariable('');
    }
  };

  const removeVariable = (variable: string) => {
    setFormData(prev => ({
      ...prev,
      variables: prev.variables.filter(v => v !== variable)
    }));
  };

  return (
    <Modal open={open} onClose={onClose} title={initialData ? 'Chỉnh sửa mẫu' : 'Tạo mẫu thông báo'}>
      <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên mẫu *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="VD: Thông báo bài tập mới"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Loại thông báo *
          </label>
          <select
            required
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="push">Push Notification</option>
            <option value="system">Thông báo hệ thống</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tiêu đề *
          </label>
          <input
            type="text"
            required
            value={formData.subject}
            onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Tiêu đề thông báo"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nội dung *
          </label>
          <textarea
            required
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Nội dung thông báo. Sử dụng {{tên_biến}} để chèn biến động."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Biến động
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newVariable}
              onChange={(e) => setNewVariable(e.target.value)}
              placeholder="Tên biến (VD: student_name)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <Button type="button" size="sm" onClick={addVariable}>
              Thêm
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.variables.map(variable => (
              <span
                key={variable}
                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded"
              >
                {variable}
                <button
                  type="button"
                  onClick={() => removeVariable(variable)}
                  className="text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="mr-2"
            />
            Kích hoạt mẫu
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" variant="primary">
            {initialData ? 'Cập nhật' : 'Tạo mẫu'}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Hủy
          </Button>
        </div>
      </form>
    </Modal>
  );
};

const SendNotificationForm: React.FC<{
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  template: NotificationTemplate | null;
}> = ({ open, onClose, onSubmit, template }) => {
  const [formData, setFormData] = useState({
    recipientType: 'role' as 'all' | 'role' | 'individual' | 'course',
    selectedRoles: [] as string[],
    selectedUsers: [] as string[],
    selectedCourses: [] as string[],
    scheduleType: 'now' as 'now' | 'schedule',
    scheduleDate: '',
    scheduleTime: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!template) return null;

  return (
    <Modal open={open} onClose={onClose} title={`Gửi: ${template.name}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Người nhận *
          </label>
          <select
            required
            value={formData.recipientType}
            onChange={(e) => setFormData(prev => ({ ...prev, recipientType: e.target.value as any }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">Tất cả người dùng</option>
            <option value="role">Theo vai trò</option>
            <option value="course">Theo khóa học</option>
            <option value="individual">Chọn cá nhân</option>
          </select>
        </div>

        {formData.recipientType === 'role' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chọn vai trò
            </label>
            <div className="space-y-2">
              {['teacher', 'student', 'staff'].map(role => (
                <label key={role} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.selectedRoles.includes(role)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData(prev => ({
                          ...prev,
                          selectedRoles: [...prev.selectedRoles, role]
                        }));
                      } else {
                        setFormData(prev => ({
                          ...prev,
                          selectedRoles: prev.selectedRoles.filter(r => r !== role)
                        }));
                      }
                    }}
                    className="mr-2"
                  />
                  {role === 'teacher' ? 'Giáo viên' : 
                   role === 'student' ? 'Học sinh' : 'Nhân viên'}
                </label>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Thời gian gửi
          </label>
          <select
            value={formData.scheduleType}
            onChange={(e) => setFormData(prev => ({ ...prev, scheduleType: e.target.value as any }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="now">Gửi ngay</option>
            <option value="schedule">Hẹn giờ</option>
          </select>
        </div>

        {formData.scheduleType === 'schedule' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày
              </label>
              <input
                type="date"
                required
                value={formData.scheduleDate}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduleDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giờ
              </label>
              <input
                type="time"
                required
                value={formData.scheduleTime}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduleTime: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button type="submit" variant="primary">
            {formData.scheduleType === 'now' ? 'Gửi ngay' : 'Hẹn giờ gửi'}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Hủy
          </Button>
        </div>
      </form>
    </Modal>
  );
};

const Notifications: React.FC = () => {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [notifications, setNotifications] = useState<NotificationSend[]>([]);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'templates' | 'history' | 'stats'>('templates');
  const [isTemplateFormOpen, setIsTemplateFormOpen] = useState(false);
  const [isSendFormOpen, setIsSendFormOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null);
  const [sendingTemplate, setSendingTemplate] = useState<NotificationTemplate | null>(null);

  useEffect(() => {
    loadNotificationData();
  }, []);

  const loadNotificationData = async () => {
    try {
      setLoading(true);
      // Mock data since API might not be ready
      const mockTemplates: NotificationTemplate[] = [
        {
          id: '1',
          name: 'Thông báo bài tập mới',
          type: 'email',
          subject: 'Bài tập mới: {{assignment_name}}',
          content: 'Xin chào {{student_name}}, bạn có bài tập mới "{{assignment_name}}" cần hoàn thành trước {{due_date}}.',
          variables: ['student_name', 'assignment_name', 'due_date'],
          isActive: true,
          usageCount: 45,
          lastUsed: '2025-08-08'
        },
        {
          id: '2',
          name: 'Nhắc nhở học phí',
          type: 'sms',
          subject: 'Nhắc nhở thanh toán học phí',
          content: 'Kính gửi {{parent_name}}, học phí tháng {{month}} của {{student_name}} sẽ đến hạn {{due_date}}.',
          variables: ['parent_name', 'student_name', 'month', 'due_date'],
          isActive: true,
          usageCount: 120,
          lastUsed: '2025-08-07'
        },
        {
          id: '3',
          name: 'Chúc mừng hoàn thành khóa học',
          type: 'email',
          subject: 'Chúc mừng bạn hoàn thành {{course_name}}',
          content: 'Chúc mừng {{student_name}} đã hoàn thành khóa học {{course_name}} với điểm số {{final_score}}.',
          variables: ['student_name', 'course_name', 'final_score'],
          isActive: false,
          usageCount: 8,
          lastUsed: '2025-08-05'
        }
      ];

      const mockNotifications: NotificationSend[] = [
        {
          id: '1',
          templateId: '1',
          templateName: 'Thông báo bài tập mới',
          recipients: {
            type: 'role',
            targets: ['student'],
            count: 150
          },
          type: 'email',
          status: 'sent',
          sentAt: '2025-08-08 10:30',
          deliveredCount: 147,
          failedCount: 3,
          openRate: 78.2,
          clickRate: 45.6
        },
        {
          id: '2',
          templateId: '2',
          templateName: 'Nhắc nhở học phí',
          recipients: {
            type: 'role',
            targets: ['student'],
            count: 80
          },
          type: 'sms',
          status: 'sent',
          sentAt: '2025-08-07 14:15',
          deliveredCount: 78,
          failedCount: 2,
          openRate: 95.0
        }
      ];

      const mockStats: NotificationStats = {
        totalSent: 1250,
        deliveryRate: 96.8,
        openRate: 72.4,
        clickRate: 38.9,
        failureRate: 3.2,
        activeTemplates: 8
      };

      setTemplates(mockTemplates);
      setNotifications(mockNotifications);
      setStats(mockStats);
    } catch (err: any) {
      setError(err.message || 'Không thể tải dữ liệu thông báo');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = async (templateData: Omit<NotificationTemplate, 'id' | 'usageCount' | 'lastUsed'>) => {
    try {
      const newTemplate: NotificationTemplate = {
        ...templateData,
        id: Date.now().toString(),
        usageCount: 0
      };
      setTemplates(prev => [newTemplate, ...prev]);
      setIsTemplateFormOpen(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUpdateTemplate = async (templateData: Omit<NotificationTemplate, 'id' | 'usageCount' | 'lastUsed'>) => {
    if (!editingTemplate) return;
    
    try {
      setTemplates(prev => prev.map(template => 
        template.id === editingTemplate.id 
          ? { ...template, ...templateData }
          : template
      ));
      setIsTemplateFormOpen(false);
      setEditingTemplate(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa mẫu thông báo này?')) return;
    
    try {
      setTemplates(prev => prev.filter(template => template.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleToggleTemplateStatus = async (id: string, isActive: boolean) => {
    try {
      setTemplates(prev => prev.map(template => 
        template.id === id ? { ...template, isActive } : template
      ));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSendNotification = async (sendData: any) => {
    try {
      const newNotification: NotificationSend = {
        id: Date.now().toString(),
        templateId: sendingTemplate!.id,
        templateName: sendingTemplate!.name,
        recipients: {
          type: sendData.recipientType,
          targets: sendData.selectedRoles || sendData.selectedUsers || sendData.selectedCourses || ['all'],
          count: 100 // Mock count
        },
        type: sendingTemplate!.type,
        status: 'sending',
        deliveredCount: 0,
        failedCount: 0
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      setIsSendFormOpen(false);
      setSendingTemplate(null);
      
      // Simulate sending process
      setTimeout(() => {
        setNotifications(prev => prev.map(notif => 
          notif.id === newNotification.id 
            ? { ...notif, status: 'sent', sentAt: new Date().toLocaleString('vi-VN'), deliveredCount: 98, failedCount: 2 }
            : notif
        ));
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEditTemplate = (template: NotificationTemplate) => {
    setEditingTemplate(template);
    setIsTemplateFormOpen(true);
  };

  const handleSendTemplate = (template: NotificationTemplate) => {
    setSendingTemplate(template);
    setIsSendFormOpen(true);
  };

  if (loading) return (
    <div className="flex items-center gap-2 text-gray-600">
      <Spinner /> Đang tải dữ liệu thông báo...
    </div>
  );

  if (error) return (
    <div className="text-red-600 bg-red-50 p-4 rounded-md">
      Lỗi: {error}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Quản lý thông báo</h1>
          <p className="text-sm text-gray-600">Tạo và gửi thông báo đến học sinh, giáo viên</p>
        </div>
        <Button onClick={() => setIsTemplateFormOpen(true)}>
          + Tạo mẫu thông báo
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{stats.totalSent}</div>
              <div className="text-sm text-gray-600">Tổng gửi</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.deliveryRate}%</div>
              <div className="text-sm text-gray-600">Tỷ lệ gửi thành công</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.openRate}%</div>
              <div className="text-sm text-gray-600">Tỷ lệ mở</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.clickRate}%</div>
              <div className="text-sm text-gray-600">Tỷ lệ click</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-700">{stats.failureRate}%</div>
              <div className="text-sm text-gray-600">Tỷ lệ thất bại</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.activeTemplates}</div>
              <div className="text-sm text-gray-600">Mẫu đang hoạt động</div>
            </div>
          </Card>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-1 border-b border-gray-200">
        {[
          { key: 'templates', label: 'Mẫu thông báo' },
          { key: 'history', label: 'Lịch sử gửi' },
          { key: 'stats', label: 'Thống kê' }
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`px-4 py-2 text-sm font-medium transition ${
              activeTab === key
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'templates' && (
        <div className="grid gap-4">
          {templates.map(template => (
            <NotificationTemplateCard
              key={template.id}
              template={template}
              onEdit={handleEditTemplate}
              onDelete={handleDeleteTemplate}
              onToggleStatus={handleToggleTemplateStatus}
              onSend={handleSendTemplate}
            />
          ))}
          
          {templates.length === 0 && (
            <Card>
              <div className="text-center py-8 text-gray-500">
                Chưa có mẫu thông báo nào. Tạo mẫu đầu tiên để bắt đầu.
              </div>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Lịch sử gửi thông báo</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mẫu thông báo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Người nhận
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời gian
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kết quả
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {notifications.map(notification => (
                  <tr key={notification.id}>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{notification.templateName}</div>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${getTypeColor(notification.type)}`}>
                        {notification.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {notification.recipients.type === 'all' ? 'Tất cả' :
                       notification.recipients.type === 'role' ? `Vai trò: ${notification.recipients.targets.join(', ')}` :
                       `${notification.recipients.count} người`}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(notification.status)}`}>
                        {notification.status === 'sent' ? 'Đã gửi' :
                         notification.status === 'sending' ? 'Đang gửi' :
                         notification.status === 'failed' ? 'Thất bại' : 'Nháp'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {notification.sentAt || '--'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {notification.status === 'sent' && (
                        <div>
                          <div>Thành công: {notification.deliveredCount}</div>
                          <div>Thất bại: {notification.failedCount}</div>
                          {notification.openRate && (
                            <div>Tỷ lệ mở: {notification.openRate}%</div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <TemplateForm
        open={isTemplateFormOpen}
        onClose={() => {
          setIsTemplateFormOpen(false);
          setEditingTemplate(null);
        }}
        onSubmit={editingTemplate ? handleUpdateTemplate : handleCreateTemplate}
        initialData={editingTemplate}
      />

      <SendNotificationForm
        open={isSendFormOpen}
        onClose={() => {
          setIsSendFormOpen(false);
          setSendingTemplate(null);
        }}
        onSubmit={handleSendNotification}
        template={sendingTemplate}
      />
    </div>
  );
};

export default Notifications;