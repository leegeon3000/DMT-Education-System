import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import DataTable, { ColumnDef } from '../../components/common/DataTable';
import FilterBar, { FilterConfig } from '../../components/common/FilterBar';
import StatusBadge from '../../components/common/StatusBadge';

interface Assignment {
  id: string;
  title: string;
  className: string;
  classId: string;
  dueDate: string;
  totalSubmissions: number;
  totalStudents: number;
  status: 'active' | 'upcoming' | 'expired';
  type: string;
  createdDate: string;
}

const Assignments: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<Record<string, any>>({});

  // Mock data
  const assignments: Assignment[] = [
    {
      id: '1',
      title: 'Bài tập tuần 5 - React Hooks',
      className: 'Lớp ReactJS Nâng cao',
      classId: '1',
      dueDate: new Date().toISOString(),
      totalSubmissions: 18,
      totalStudents: 30,
      status: 'active',
      type: 'Bài tập',
      createdDate: '2025-01-01'
    },
    {
      id: '2',
      title: 'Kiểm tra giữa kỳ',
      className: 'Lớp JavaScript Cơ bản',
      classId: '2',
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
      totalSubmissions: 0,
      totalStudents: 25,
      status: 'upcoming',
      type: 'Kiểm tra',
      createdDate: '2025-01-05'
    },
    {
      id: '3',
      title: 'Project cuối khóa',
      className: 'Lớp Web Development',
      classId: '3',
      dueDate: new Date(Date.now() - 86400000).toISOString(),
      totalSubmissions: 20,
      totalStudents: 28,
      status: 'expired',
      type: 'Project',
      createdDate: '2024-12-01'
    },
    {
      id: '4',
      title: 'Bài tập về TypeScript Generics',
      className: 'Lớp TypeScript Pro',
      classId: '4',
      dueDate: new Date(Date.now() + 86400000 * 7).toISOString(),
      totalSubmissions: 5,
      totalStudents: 20,
      status: 'active',
      type: 'Bài tập',
      createdDate: '2025-01-08'
    }
  ];

  const filterConfigs: FilterConfig[] = [
    {
      type: 'select',
      name: 'status',
      label: 'Trạng thái',
      options: [
        { value: 'active', label: 'Đang mở' },
        { value: 'upcoming', label: 'Sắp tới' },
        { value: 'expired', label: 'Đã hết hạn' }
      ]
    },
    {
      type: 'select',
      name: 'type',
      label: 'Loại',
      options: [
        { value: 'Bài tập', label: 'Bài tập' },
        { value: 'Kiểm tra', label: 'Kiểm tra' },
        { value: 'Project', label: 'Project' }
      ]
    },
    {
      type: 'daterange',
      name: 'dateRange',
      label: 'Thời gian'
    }
  ];

  const columns: ColumnDef<Assignment>[] = [
    {
      key: 'title',
      header: 'Tiêu đề',
      render: (row) => (
        <div>
          <div className="font-semibold text-gray-900">{row.title}</div>
          <div className="text-xs text-gray-500 mt-1">{row.className}</div>
        </div>
      )
    },
    {
      key: 'type',
      header: 'Loại',
      width: '120px',
      render: (row) => (
        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
          {row.type}
        </span>
      )
    },
    {
      key: 'dueDate',
      header: 'Hạn nộp',
      width: '140px',
      render: (row) => (
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>{new Date(row.dueDate).toLocaleDateString('vi-VN')}</span>
        </div>
      )
    },
    {
      key: 'submissions',
      header: 'Bài nộp',
      width: '120px',
      render: (row) => {
        const percentage = (row.totalSubmissions / row.totalStudents) * 100;
        return (
          <div>
            <div className="text-sm font-semibold">
              {row.totalSubmissions}/{row.totalStudents}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
              <div
                className={`h-1.5 rounded-full ${
                  percentage >= 80 ? 'bg-green-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        );
      }
    },
    {
      key: 'status',
      header: 'Trạng thái',
      width: '140px',
      render: (row) => <StatusBadge status={row.status} />
    }
  ];

  const renderActions = (row: Assignment) => (
    <>
      <button
        onClick={() => navigate(`/teacher/assignments/${row.id}`)}
        className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
      >
        Xem chi tiết
      </button>
      <button
        onClick={() => navigate(`/teacher/grading/${row.id}`)}
        className="px-3 py-1.5 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors font-medium"
      >
        Chấm bài
      </button>
    </>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-7 h-7 text-blue-600" />
            Quản lý bài tập
          </h1>
          <p className="text-gray-600 mt-1">Theo dõi và quản lý bài tập của các lớp</p>
        </div>
        <button
          onClick={() => navigate('/teacher/assignments/create')}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transform hover:scale-105 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Tạo bài tập mới</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Tổng bài tập</p>
              <p className="text-xl font-bold text-gray-900">{assignments.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Đang mở</p>
              <p className="text-xl font-bold text-gray-900">
                {assignments.filter(a => a.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Sắp tới</p>
              <p className="text-xl font-bold text-gray-900">
                {assignments.filter(a => a.status === 'upcoming').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 text-red-600 rounded-lg">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Đã hết hạn</p>
              <p className="text-xl font-bold text-gray-900">
                {assignments.filter(a => a.status === 'expired').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <FilterBar
        filters={filterConfigs}
        onFilterChange={setFilters}
        searchPlaceholder="Tìm kiếm bài tập..."
      />

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={assignments}
        actions={renderActions}
        onRowClick={(row) => navigate(`/teacher/assignments/${row.id}`)}
      />
    </div>
  );
};

export default Assignments;
