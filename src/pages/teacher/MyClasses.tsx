import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Calendar, BookOpen, MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
import DataTable, { ColumnDef } from '../../components/common/DataTable';
import FilterBar, { FilterConfig } from '../../components/common/FilterBar';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmDialog from '../../components/common/ConfirmDialog';

interface Class {
  id: string;
  name: string;
  code: string;
  subject: string;
  schedule: string;
  room: string;
  totalStudents: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'upcoming' | 'completed';
}

const MyClasses: React.FC = () => {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>({});

  // Mock data - Replace with API
  const classes: Class[] = [
    {
      id: '1',
      name: 'Lớp ReactJS Nâng cao',
      code: 'REACT-ADV-01',
      subject: 'ReactJS',
      schedule: 'Thứ 2, 4, 6 - 18:00-20:00',
      room: 'Phòng 301',
      totalStudents: 30,
      startDate: '2025-01-01',
      endDate: '2025-03-31',
      status: 'active'
    },
    {
      id: '2',
      name: 'Lớp JavaScript Cơ bản',
      code: 'JS-BASIC-02',
      subject: 'JavaScript',
      schedule: 'Thứ 3, 5, 7 - 19:00-21:00',
      room: 'Phòng 205',
      totalStudents: 25,
      startDate: '2025-01-15',
      endDate: '2025-04-15',
      status: 'active'
    },
    {
      id: '3',
      name: 'Lớp Web Development',
      code: 'WEB-DEV-03',
      subject: 'Web Development',
      schedule: 'Thứ 2, 4 - 19:00-21:30',
      room: 'Phòng 402',
      totalStudents: 28,
      startDate: '2025-02-01',
      endDate: '2025-05-01',
      status: 'upcoming'
    },
    {
      id: '4',
      name: 'Lớp TypeScript Pro',
      code: 'TS-PRO-04',
      subject: 'TypeScript',
      schedule: 'Thứ 3, 5 - 18:30-20:30',
      room: 'Phòng 303',
      totalStudents: 20,
      startDate: '2024-10-01',
      endDate: '2024-12-31',
      status: 'completed'
    },
    {
      id: '5',
      name: 'Lớp Node.js Backend',
      code: 'NODE-BE-05',
      subject: 'Node.js',
      schedule: 'Thứ 6, 7 - 18:00-20:30',
      room: 'Phòng 501',
      totalStudents: 22,
      startDate: '2025-01-10',
      endDate: '2025-04-10',
      status: 'active'
    }
  ];

  const filterConfigs: FilterConfig[] = [
    {
      type: 'select',
      name: 'status',
      label: 'Trạng thái',
      options: [
        { value: 'active', label: 'Đang học' },
        { value: 'upcoming', label: 'Sắp diễn ra' },
        { value: 'completed', label: 'Đã kết thúc' }
      ]
    },
    {
      type: 'select',
      name: 'subject',
      label: 'Môn học',
      options: [
        { value: 'ReactJS', label: 'ReactJS' },
        { value: 'JavaScript', label: 'JavaScript' },
        { value: 'TypeScript', label: 'TypeScript' },
        { value: 'Node.js', label: 'Node.js' },
        { value: 'Web Development', label: 'Web Development' }
      ]
    }
  ];

  const columns: ColumnDef<Class>[] = [
    {
      key: 'code',
      header: 'Mã lớp',
      width: '120px',
      render: (row) => (
        <span className="font-mono text-sm font-semibold text-blue-600">{row.code}</span>
      )
    },
    {
      key: 'name',
      header: 'Tên lớp',
      render: (row) => (
        <div>
          <div className="font-semibold text-gray-900">{row.name}</div>
          <div className="text-xs text-gray-500">{row.subject}</div>
        </div>
      )
    },
    {
      key: 'schedule',
      header: 'Lịch học',
      render: (row) => (
        <div className="text-sm">
          <div className="flex items-center gap-1 text-gray-900">
            <Calendar className="w-4 h-4" />
            <span>{row.schedule}</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">{row.room}</div>
        </div>
      )
    },
    {
      key: 'totalStudents',
      header: 'Học sinh',
      width: '100px',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="font-semibold">{row.totalStudents}</span>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Trạng thái',
      width: '140px',
      render: (row) => <StatusBadge status={row.status} />
    }
  ];

  const handleDeleteClass = (classItem: Class) => {
    setSelectedClass(classItem);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    console.log('Deleting class:', selectedClass);
    setDeleteDialogOpen(false);
    setSelectedClass(null);
    // TODO: Call API to delete
  };

  const renderActions = (row: Class) => (
    <>
      <button
        onClick={() => navigate(`/teacher/classes/${row.id}`)}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        title="Xem chi tiết"
      >
        <Eye className="w-4 h-4" />
      </button>
      <button
        onClick={() => navigate(`/teacher/classes/${row.id}/edit`)}
        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        title="Chỉnh sửa"
      >
        <Edit className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleDeleteClass(row)}
        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        title="Xóa"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-blue-600" />
            Quản lý lớp học
          </h1>
          <p className="text-gray-600 mt-1">Danh sách các lớp học bạn đang giảng dạy</p>
        </div>
        <button
          onClick={() => navigate('/teacher/classes/create')}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transform hover:scale-105 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Tạo lớp mới</span>
        </button>
      </div>

      {/* Filters */}
      <FilterBar
        filters={filterConfigs}
        onFilterChange={setFilters}
        searchPlaceholder="Tìm kiếm lớp học..."
      />

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={classes}
        actions={renderActions}
        onRowClick={(row) => navigate(`/teacher/classes/${row.id}`)}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        type="danger"
        title="Xóa lớp học"
        message={`Bạn có chắc chắn muốn xóa lớp "${selectedClass?.name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa lớp"
        cancelText="Hủy"
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setSelectedClass(null);
        }}
      />
    </div>
  );
};

export default MyClasses;
