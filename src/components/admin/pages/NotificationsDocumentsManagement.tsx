import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Eye, 
  Edit, 
  Trash2, 
  Send,
  Users,
  Calendar,
  AlertCircle,
  Info,
  CheckCircle,
  X,
  MessageSquare,
  Paperclip,
  Archive,
  FolderOpen,
  Star,
  FileIcon,
  Presentation,
  Image as ImageIcon,
  Video
} from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'error';
  priority: 'low' | 'medium' | 'high';
  status: 'draft' | 'sent' | 'scheduled';
  recipients: {
    students: boolean;
    teachers: boolean;
    specific: string[];
  };
  createdAt: string;
  scheduledAt?: string;
  sentAt?: string;
  author: string;
  readCount: number;
  totalRecipients: number;
}

interface Document {
  id: string;
  name: string;
  description: string;
  type: 'pdf' | 'doc' | 'ppt' | 'image' | 'video' | 'other';
  category: string;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
  downloadCount: number;
  isPublic: boolean;
  tags: string[];
  url: string;
}

const NotificationsDocumentsManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'notifications' | 'documents'>('notifications');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Notification | Document | null>(null);
  const [viewModal, setViewModal] = useState(false);

  // Mock data for notifications
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'notif-1',
      title: 'Thông báo điều chỉnh lịch học',
      content: 'Lịch học tuần tới sẽ được điều chỉnh do nghỉ lễ...',
      type: 'info',
      priority: 'high',
      status: 'sent',
      recipients: { students: true, teachers: true, specific: [] },
      createdAt: '2024-01-15',
      sentAt: '2024-01-15T10:00:00',
      author: 'Admin',
      readCount: 45,
      totalRecipients: 50
    },
    {
      id: 'notif-2',
      title: 'Cập nhật chính sách học phí',
      content: 'Thông báo về việc điều chỉnh học phí từ tháng 3...',
      type: 'warning',
      priority: 'medium',
      status: 'draft',
      recipients: { students: true, teachers: false, specific: [] },
      createdAt: '2024-01-14',
      author: 'Admin',
      readCount: 0,
      totalRecipients: 30
    }
  ]);

  // Mock data for documents
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 'doc-1',
      name: 'Tài liệu hướng dẫn học tập',
      description: 'Hướng dẫn chi tiết về phương pháp học hiệu quả',
      type: 'pdf',
      category: 'Tài liệu học tập',
      size: 2048000,
      uploadedAt: '2024-01-10',
      uploadedBy: 'Giáo viên A',
      downloadCount: 25,
      isPublic: true,
      tags: ['học tập', 'hướng dẫn'],
      url: '#'
    },
    {
      id: 'doc-2',
      name: 'Đề thi mẫu 2024',
      description: 'Bộ đề thi mẫu cho kỳ thi cuối năm',
      type: 'doc',
      category: 'Đề thi',
      size: 1024000,
      uploadedAt: '2024-01-08',
      uploadedBy: 'Giáo viên B',
      downloadCount: 18,
      isPublic: false,
      tags: ['đề thi', 'ôn tập'],
      url: '#'
    }
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info': return <Info className="w-4 h-4 text-blue-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <X className="w-4 h-4 text-red-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText size={20} />;
      case 'doc': return <FileIcon size={20} />;
      case 'ppt': return <Presentation size={20} />;
      case 'image': return <ImageIcon size={20} />;
      case 'video': return <Video size={20} />;
      default: return <Paperclip size={20} />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || notification.status === filterType;
    return matchesSearch && matchesFilter;
  });

  const filteredDocuments = documents.filter(document => {
    const matchesSearch = document.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         document.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || document.category === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Quản lý thông báo & tài liệu
        </h1>
        <p className="text-gray-600">
          Quản lý thông báo hệ thống và thư viện tài liệu của trung tâm
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('notifications')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'notifications'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Bell className="w-4 h-4 inline mr-2" />
            Thông báo
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'documents'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Tài liệu
          </button>
        </nav>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex flex-1 items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={`Tìm kiếm ${activeTab === 'notifications' ? 'thông báo' : 'tài liệu'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả</option>
              {activeTab === 'notifications' ? (
                <>
                  <option value="sent">Đã gửi</option>
                  <option value="draft">Bản nháp</option>
                  <option value="scheduled">Đã lên lịch</option>
                </>
              ) : (
                <>
                  <option value="Tài liệu học tập">Tài liệu học tập</option>
                  <option value="Đề thi">Đề thi</option>
                  <option value="Hướng dẫn">Hướng dẫn</option>
                </>
              )}
            </select>
          </div>
        </div>

        <div className="flex space-x-3">
          {activeTab === 'notifications' ? (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tạo thông báo
            </button>
          ) : (
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Upload className="w-4 h-4 mr-2" />
              Tải lên tài liệu
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'notifications' ? (
        /* Notifications List */
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thông báo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loại
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Độ ưu tiên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đối tượng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thống kê
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredNotifications.map((notification) => (
                  <tr key={notification.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <div className="mr-3 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {notification.content}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            <Calendar className="w-3 h-3 inline mr-1" />
                            {new Date(notification.createdAt).toLocaleDateString('vi-VN')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="capitalize text-sm text-gray-600">
                        {notification.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(notification.priority)}`}>
                        {notification.priority === 'high' ? 'Cao' : notification.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(notification.status)}`}>
                        {notification.status === 'sent' ? 'Đã gửi' : notification.status === 'draft' ? 'Bản nháp' : 'Đã lên lịch'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        {notification.recipients.students && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            Học viên
                          </span>
                        )}
                        {notification.recipients.teachers && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            Giáo viên
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {notification.status === 'sent' && (
                        <div>
                          <div className="text-xs">
                            Đã đọc: {notification.readCount}/{notification.totalRecipients}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${(notification.readCount / notification.totalRecipients) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => {
                          setSelectedItem(notification);
                          setViewModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="text-green-600 hover:text-green-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {notification.status === 'draft' && (
                        <button
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Documents Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDocuments.map((document) => (
            <div key={document.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="text-3xl">
                  {getFileIcon(document.type)}
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => {
                      setSelectedItem(document);
                      setViewModal(true);
                    }}
                    className="text-gray-400 hover:text-blue-600"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-gray-400 hover:text-green-600">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="text-gray-400 hover:text-yellow-600">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="text-gray-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="font-medium text-gray-900 mb-2 truncate">
                {document.name}
              </h3>
              
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {document.description}
              </p>

              <div className="space-y-2 text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>Danh mục:</span>
                  <span className="text-gray-700">{document.category}</span>
                </div>
                <div className="flex justify-between">
                  <span>Kích thước:</span>
                  <span className="text-gray-700">{formatFileSize(document.size)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tải xuống:</span>
                  <span className="text-gray-700">{document.downloadCount} lần</span>
                </div>
                <div className="flex justify-between">
                  <span>Ngày tải lên:</span>
                  <span className="text-gray-700">
                    {new Date(document.uploadedAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1">
                {document.tags.map((tag, index) => (
                  <span key={index} className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded ${
                  document.isPublic ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {document.isPublic ? 'Công khai' : 'Riêng tư'}
                </span>
                <div className="text-xs text-gray-500">
                  {document.uploadedBy}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Detail Modal */}
      {viewModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {activeTab === 'notifications' ? 'Chi tiết thông báo' : 'Chi tiết tài liệu'}
              </h2>
              <button
                onClick={() => {
                  setViewModal(false);
                  setSelectedItem(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'notifications' ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {(selectedItem as Notification).title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor((selectedItem as Notification).status)}`}>
                        {(selectedItem as Notification).status === 'sent' ? 'Đã gửi' : 
                         (selectedItem as Notification).status === 'draft' ? 'Bản nháp' : 'Đã lên lịch'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor((selectedItem as Notification).priority)}`}>
                        Ưu tiên {(selectedItem as Notification).priority === 'high' ? 'cao' : 
                                (selectedItem as Notification).priority === 'medium' ? 'trung bình' : 'thấp'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Nội dung:</h4>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {(selectedItem as Notification).content}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Đối tượng nhận:</h4>
                    <div className="flex space-x-2">
                      {(selectedItem as Notification).recipients.students && (
                        <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded">
                          Học viên
                        </span>
                      )}
                      {(selectedItem as Notification).recipients.teachers && (
                        <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded">
                          Giáo viên
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-6xl mb-4">
                      {getFileIcon((selectedItem as Document).type)}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {(selectedItem as Document).name}
                    </h3>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Mô tả:</h4>
                    <p className="text-gray-700">
                      {(selectedItem as Document).description}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Danh mục:</span>
                      <p className="font-medium">{(selectedItem as Document).category}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Kích thước:</span>
                      <p className="font-medium">{formatFileSize((selectedItem as Document).size)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Người tải lên:</span>
                      <p className="font-medium">{(selectedItem as Document).uploadedBy}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Lượt tải:</span>
                      <p className="font-medium">{(selectedItem as Document).downloadCount}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Thẻ tag:</h4>
                    <div className="flex flex-wrap gap-2">
                      {(selectedItem as Document).tags.map((tag, index) => (
                        <span key={index} className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setViewModal(false);
                  setSelectedItem(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Đóng
              </button>
              {activeTab === 'documents' && (
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Download className="w-4 h-4 mr-2 inline" />
                  Tải xuống
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsDocumentsManagement;
