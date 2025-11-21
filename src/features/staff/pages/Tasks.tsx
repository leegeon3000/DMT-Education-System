import React, { useState, useEffect } from 'react';
import { SEOHead } from '../../../components/common';
import { 
  CheckSquare, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  Plus,
  Calendar,
  User,
  Flag,
  Filter,
  Search,
  MoreVertical
} from 'lucide-react';

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assignee: string;
  due_date: string;
  category: string;
  created_at: string;
}

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const mockTasks: Task[] = [
    {
      id: 1,
      title: 'Xử lý yêu cầu hoàn tiền học viên HS2025001',
      description: 'Kiểm tra điều kiện và gửi yêu cầu lên phòng Tài chính',
      status: 'TODO',
      priority: 'HIGH',
      assignee: 'Nguyễn Thị Staff',
      due_date: '2025-11-18',
      category: 'Tài chính',
      created_at: '2025-11-15T08:00:00'
    },
    {
      id: 2,
      title: 'Cập nhật thông tin lớp học mới học kỳ 2',
      description: 'Nhập thông tin 5 lớp học mới vào hệ thống',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      assignee: 'Nguyễn Thị Staff',
      due_date: '2025-11-20',
      category: 'Học vụ',
      created_at: '2025-11-14T10:30:00'
    },
    {
      id: 3,
      title: 'Gọi điện xác nhận đăng ký lớp IELTS',
      description: 'Xác nhận với 8 học viên đã đăng ký lớp IELTS Foundation',
      status: 'REVIEW',
      priority: 'MEDIUM',
      assignee: 'Trần Văn Admin',
      due_date: '2025-11-17',
      category: 'Tuyển sinh',
      created_at: '2025-11-13T14:20:00'
    },
    {
      id: 4,
      title: 'Chuẩn bị tài liệu cho sự kiện Tư vấn hướng nghiệp',
      description: 'In tài liệu, chuẩn bị booth, danh sách học viên tham gia',
      status: 'TODO',
      priority: 'URGENT',
      assignee: 'Nguyễn Thị Staff',
      due_date: '2025-11-17',
      category: 'Sự kiện',
      created_at: '2025-11-15T09:00:00'
    },
    {
      id: 5,
      title: 'Kiểm tra và duyệt chứng chỉ hoàn thành khóa học',
      description: 'Duyệt chứng chỉ cho 12 học viên hoàn thành khóa Vật Lý',
      status: 'DONE',
      priority: 'LOW',
      assignee: 'Lê Thị Manager',
      due_date: '2025-11-15',
      category: 'Học vụ',
      created_at: '2025-11-10T11:00:00'
    },
    {
      id: 6,
      title: 'Tổng hợp báo cáo doanh thu tháng 10',
      description: 'Lập báo cáo chi tiết doanh thu và gửi cho Ban Giám đốc',
      status: 'DONE',
      priority: 'HIGH',
      assignee: 'Nguyễn Thị Staff',
      due_date: '2025-11-05',
      category: 'Báo cáo',
      created_at: '2025-11-01T08:30:00'
    },
  ];

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      setTimeout(() => {
        setTasks(mockTasks);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      setTasks(mockTasks);
      setLoading(false);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filterStatus === 'ALL' || task.status === filterStatus;
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TODO': return 'bg-gray-100 text-gray-700';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700';
      case 'REVIEW': return 'bg-yellow-100 text-yellow-700';
      case 'DONE': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'TODO': return <AlertCircle size={16} />;
      case 'IN_PROGRESS': return <Clock size={16} />;
      case 'REVIEW': return <Flag size={16} />;
      case 'DONE': return <CheckCircle size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'TODO': return 'Chờ xử lý';
      case 'IN_PROGRESS': return 'Đang làm';
      case 'REVIEW': return 'Chờ duyệt';
      case 'DONE': return 'Hoàn thành';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'text-cyan-600 bg-red-100';
      case 'HIGH': return 'text-orange-600 bg-orange-100';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100';
      case 'LOW': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'Khẩn cấp';
      case 'HIGH': return 'Cao';
      case 'MEDIUM': return 'Trung bình';
      case 'LOW': return 'Thấp';
      default: return priority;
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const tasksByStatus = {
    TODO: filteredTasks.filter(t => t.status === 'TODO'),
    IN_PROGRESS: filteredTasks.filter(t => t.status === 'IN_PROGRESS'),
    REVIEW: filteredTasks.filter(t => t.status === 'REVIEW'),
    DONE: filteredTasks.filter(t => t.status === 'DONE'),
  };

  const stats = [
    { label: 'Tổng nhiệm vụ', value: tasks.length, icon: CheckSquare, color: 'text-cyan-600', bg: 'bg-cyan-100' },
    { label: 'Chờ xử lý', value: tasks.filter(t => t.status === 'TODO').length, icon: AlertCircle, color: 'text-gray-600', bg: 'bg-gray-100' },
    { label: 'Đang làm', value: tasks.filter(t => t.status === 'IN_PROGRESS').length, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Hoàn thành', value: tasks.filter(t => t.status === 'DONE').length, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
  ];

  return (
    <>
      <SEOHead
        title="Nhiệm vụ - DMT Education"
        description="Quản lý nhiệm vụ công việc"
      />

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Nhiệm vụ công việc
                </h1>
                <p className="text-gray-600 mt-1">Quản lý và theo dõi tiến độ công việc</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-sm">
                <Plus size={20} />
                Tạo nhiệm vụ mới
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{stat.label}</p>
                        <p className={`text-2xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
                      </div>
                      <div className={`p-3 ${stat.bg} rounded-lg`}>
                        <Icon size={24} className={stat.color} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Tìm kiếm nhiệm vụ..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="ALL">Tất cả trạng thái</option>
                  <option value="TODO">Chờ xử lý</option>
                  <option value="IN_PROGRESS">Đang làm</option>
                  <option value="REVIEW">Chờ duyệt</option>
                  <option value="DONE">Hoàn thành</option>
                </select>
              </div>
            </div>
          </div>

          {/* Kanban Board */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
                <div key={status} className="bg-gray-100/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium ${getStatusColor(status)}`}>
                        {getStatusIcon(status)}
                        {getStatusLabel(status)}
                      </span>
                      <span className="text-sm text-gray-600">({statusTasks.length})</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {statusTasks.map(task => (
                      <div
                        key={task.id}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                            {task.title}
                          </h3>
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreVertical size={16} />
                          </button>
                        </div>

                        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                          {task.description}
                        </p>

                        <div className="flex items-center gap-2 mb-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {getPriorityLabel(task.priority)}
                          </span>
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
                            {task.category}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span className={isOverdue(task.due_date) ? 'text-cyan-600 font-medium' : ''}>
                              {formatDate(task.due_date)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User size={14} />
                            <span>{task.assignee.split(' ')[0]}</span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {statusTasks.length === 0 && (
                      <div className="text-center py-8 text-gray-400 text-sm">
                        Không có nhiệm vụ
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Tasks;