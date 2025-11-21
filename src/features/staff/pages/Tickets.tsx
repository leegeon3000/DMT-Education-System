import React, { useState, useEffect } from 'react';
import { SEOHead } from '../../../components/common';
import {
  Ticket,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  MessageCircle,
  Filter,
  Plus,
  Search,
  TrendingUp,
  XCircle
} from 'lucide-react';

interface SupportTicket {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  category: 'technical' | 'billing' | 'academic' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed';
  createdBy: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  responseCount: number;
}

const StaffTickets: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      // TODO: Integrate with API
      
      const mockTickets: SupportTicket[] = [
        {
          id: '1',
          ticketNumber: 'TK-001',
          title: 'Không thể đăng nhập vào hệ thống',
          description: 'Em không thể đăng nhập vào hệ thống từ sáng nay',
          category: 'technical',
          priority: 'high',
          status: 'in_progress',
          createdBy: 'Nguyễn Văn A (HS001)',
          assignedTo: 'Nhân viên IT',
          createdAt: '2025-10-01T08:30:00Z',
          updatedAt: '2025-10-01T09:15:00Z',
          responseCount: 3
        },
        {
          id: '2',
          ticketNumber: 'TK-002',
          title: 'Thắc mắc về học phí',
          description: 'Cho em hỏi về chính sách giảm giá học phí cho học sinh đăng ký nhiều khóa',
          category: 'billing',
          priority: 'medium',
          status: 'open',
          createdBy: 'Trần Thị B (HS025)',
          createdAt: '2025-10-01T10:00:00Z',
          updatedAt: '2025-10-01T10:00:00Z',
          responseCount: 0
        },
        {
          id: '3',
          ticketNumber: 'TK-003',
          title: 'Yêu cầu thay đổi lịch học',
          description: 'Em muốn chuyển từ lớp thứ 2-4-6 sang lớp thứ 3-5-7',
          category: 'academic',
          priority: 'medium',
          status: 'waiting',
          createdBy: 'Lê Văn C (HS042)',
          assignedTo: 'Nhân viên học vụ',
          createdAt: '2025-09-30T14:20:00Z',
          updatedAt: '2025-10-01T08:00:00Z',
          responseCount: 2
        },
        {
          id: '4',
          ticketNumber: 'TK-004',
          title: 'Không tải được tài liệu PDF',
          description: 'Tài liệu môn Toán không tải được, báo lỗi',
          category: 'technical',
          priority: 'urgent',
          status: 'open',
          createdBy: 'Phạm Thị D (HS033)',
          createdAt: '2025-10-01T11:30:00Z',
          updatedAt: '2025-10-01T11:30:00Z',
          responseCount: 0
        },
        {
          id: '5',
          ticketNumber: 'TK-005',
          title: 'Xác nhận hoàn thành khóa học',
          description: 'Em đã hoàn thành khóa học Vật Lý, xin cấp chứng nhận',
          category: 'general',
          priority: 'low',
          status: 'resolved',
          createdBy: 'Hoàng Văn E (HS018)',
          assignedTo: 'Nhân viên học vụ',
          createdAt: '2025-09-28T09:00:00Z',
          updatedAt: '2025-09-30T16:00:00Z',
          responseCount: 5
        }
      ];

      setTickets(mockTickets);
    } catch (error) {
      console.error('Failed to load tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-700 border-cyan-200';
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'closed':
      case 'resolved':
        return 'bg-green-100 text-green-700';
      case 'in_progress':
        return 'bg-blue-100 text-blue-700';
      case 'waiting':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'closed':
      case 'resolved':
        return <CheckCircle className="w-4 h-4" />;
      case 'in_progress':
        return <Clock className="w-4 h-4" />;
      case 'waiting':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Ticket className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'closed':
        return 'Đã đóng';
      case 'resolved':
        return 'Đã giải quyết';
      case 'in_progress':
        return 'Đang xử lý';
      case 'waiting':
        return 'Chờ phản hồi';
      default:
        return 'Mới';
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'technical':
        return 'Kỹ thuật';
      case 'billing':
        return 'Tài chính';
      case 'academic':
        return 'Học vụ';
      default:
        return 'Chung';
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesFilter = filter === 'all' || ticket.status === filter;
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const ticketStats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="Quản lý Tickets - DMT Education"
        description="Theo dõi và xử lý yêu cầu hỗ trợ"
      />

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Quản lý yêu cầu hỗ trợ
              </h1>
              <p className="mt-1 text-gray-600">
                Theo dõi và xử lý các yêu cầu hỗ trợ từ học sinh và phụ huynh
              </p>
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all shadow-sm">
              <Plus size={20} />
              <span>Tạo ticket mới</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng ticket</p>
                  <p className="mt-2 text-3xl font-bold text-cyan-600">{ticketStats.total}</p>
                </div>
                <div className="p-3 bg-cyan-100 rounded-lg">
                  <Ticket size={24} className="text-cyan-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Mới</p>
                  <p className="mt-2 text-3xl font-bold text-cyan-600">{ticketStats.open}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <AlertCircle size={24} className="text-cyan-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Đang xử lý</p>
                  <p className="mt-2 text-3xl font-bold text-blue-600">{ticketStats.inProgress}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Clock size={24} className="text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Đã giải quyết</p>
                  <p className="mt-2 text-3xl font-bold text-green-600">{ticketStats.resolved}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle size={24} className="text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo số ticket hoặc tiêu đề..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
            <div className="flex space-x-2 overflow-x-auto">
              {[
                { key: 'all', label: 'Tất cả', count: ticketStats.total },
                { key: 'open', label: 'Mới', count: ticketStats.open },
                { key: 'in_progress', label: 'Đang xử lý', count: ticketStats.inProgress },
                { key: 'resolved', label: 'Đã giải quyết', count: ticketStats.resolved },
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-4 py-2 font-medium text-sm rounded-lg whitespace-nowrap transition-all ${
                    filter === key
                      ? 'bg-orange-600 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {label} ({count})
                </button>
              ))}
            </div>
          </div>

          {/* Tickets List */}
          <div className="space-y-3">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="mt-1">
                      <div className={`p-2 rounded-lg ${getStatusColor(ticket.status)}`}>
                        {getStatusIcon(ticket.status)}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 flex-wrap gap-2">
                        <span className="text-xs font-mono text-gray-500 font-medium">{ticket.ticketNumber}</span>
                        <h3 className="text-base font-semibold text-gray-900">
                          {ticket.title}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority === 'urgent' && 'Khẩn cấp'}
                          {ticket.priority === 'high' && 'Cao'}
                          {ticket.priority === 'medium' && 'Trung bình'}
                          {ticket.priority === 'low' && 'Thấp'}
                        </span>
                      </div>
                      
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">{ticket.description}</p>
                      
                      <div className="mt-3 flex items-center flex-wrap gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <User size={16} />
                          <span>{ticket.createdBy}</span>
                        </div>
                        {ticket.assignedTo && (
                          <div className="flex items-center gap-1">
                            <span className="text-xs">→</span>
                            <span>{ticket.assignedTo}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <MessageCircle size={16} />
                          <span>{ticket.responseCount} phản hồi</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Filter size={16} />
                          <span>{getCategoryText(ticket.category)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="ml-4 flex flex-col items-end space-y-2">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                      {getStatusText(ticket.status)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(ticket.updatedAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTickets.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
              <Ticket className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Không có ticket</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm 
                  ? 'Không tìm thấy ticket phù hợp với từ khóa tìm kiếm' 
                  : 'Chưa có yêu cầu hỗ trợ nào'}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StaffTickets;
