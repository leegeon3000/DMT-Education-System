import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, CheckCircle, XCircle, Clock } from 'lucide-react';
import DataTable, { ColumnDef } from '../../components/common/DataTable';
import FilterBar, { FilterConfig } from '../../components/common/FilterBar';
import StatusBadge from '../../components/common/StatusBadge';

interface AttendanceRecord {
  id: string;
  className: string;
  classId: string;
  date: string;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  attendanceRate: number;
  status: 'completed' | 'pending' | 'upcoming';
}

const Attendance: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [showMarkAttendanceModal, setShowMarkAttendanceModal] = useState(false);

  // Mock data
  const attendanceRecords: AttendanceRecord[] = [
    {
      id: '1',
      className: 'Lớp ReactJS Nâng cao',
      classId: '1',
      date: new Date().toISOString(),
      totalStudents: 30,
      presentCount: 28,
      absentCount: 2,
      lateCount: 0,
      attendanceRate: 93.3,
      status: 'completed'
    },
    {
      id: '2',
      className: 'Lớp JavaScript Cơ bản',
      classId: '2',
      date: new Date(Date.now() - 86400000).toISOString(),
      totalStudents: 25,
      presentCount: 23,
      absentCount: 1,
      lateCount: 1,
      attendanceRate: 92,
      status: 'completed'
    },
    {
      id: '3',
      className: 'Lớp Web Development',
      classId: '3',
      date: new Date(Date.now() + 86400000).toISOString(),
      totalStudents: 28,
      presentCount: 0,
      absentCount: 0,
      lateCount: 0,
      attendanceRate: 0,
      status: 'upcoming'
    },
    {
      id: '4',
      className: 'Lớp Node.js Backend',
      classId: '5',
      date: new Date().toISOString(),
      totalStudents: 22,
      presentCount: 0,
      absentCount: 0,
      lateCount: 0,
      attendanceRate: 0,
      status: 'pending'
    }
  ];

  const filterConfigs: FilterConfig[] = [
    {
      type: 'select',
      name: 'status',
      label: 'Trạng thái',
      options: [
        { value: 'completed', label: 'Đã điểm danh' },
        { value: 'pending', label: 'Chưa điểm danh' },
        { value: 'upcoming', label: 'Sắp tới' }
      ]
    },
    {
      type: 'daterange',
      name: 'dateRange',
      label: 'Khoảng thời gian'
    }
  ];

  const columns: ColumnDef<AttendanceRecord>[] = [
    {
      key: 'className',
      header: 'Lớp học',
      render: (row) => (
        <span className="font-semibold text-gray-900">{row.className}</span>
      )
    },
    {
      key: 'date',
      header: 'Ngày học',
      width: '140px',
      render: (row) => (
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{new Date(row.date).toLocaleDateString('vi-VN')}</span>
        </div>
      )
    },
    {
      key: 'present',
      header: 'Có mặt',
      width: '100px',
      render: (row) => (
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="font-semibold text-green-700">{row.presentCount}</span>
        </div>
      )
    },
    {
      key: 'absent',
      header: 'Vắng',
      width: '100px',
      render: (row) => (
        <div className="flex items-center gap-2">
          <XCircle className="w-4 h-4 text-red-500" />
          <span className="font-semibold text-red-700">{row.absentCount}</span>
        </div>
      )
    },
    {
      key: 'late',
      header: 'Muộn',
      width: '100px',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-yellow-500" />
          <span className="font-semibold text-yellow-700">{row.lateCount}</span>
        </div>
      )
    },
    {
      key: 'attendanceRate',
      header: 'Tỷ lệ',
      width: '120px',
      render: (row) => (
        row.status === 'completed' ? (
          <div>
            <div className="text-sm font-semibold text-gray-900">{row.attendanceRate.toFixed(1)}%</div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
              <div
                className={`h-1.5 rounded-full ${
                  row.attendanceRate >= 90 ? 'bg-green-500' : row.attendanceRate >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${row.attendanceRate}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <span className="text-gray-400 text-sm">-</span>
        )
      )
    },
    {
      key: 'status',
      header: 'Trạng thái',
      width: '140px',
      render: (row) => <StatusBadge status={row.status} />
    }
  ];

  const handleMarkAttendance = (record: AttendanceRecord) => {
    setSelectedRecord(record);
    setShowMarkAttendanceModal(true);
  };

  const renderActions = (row: AttendanceRecord) => (
    <>
      {row.status === 'completed' ? (
        <>
          <button
            onClick={() => navigate(`/teacher/attendance/${row.id}`)}
            className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
          >
            Xem chi tiết
          </button>
          <button
            onClick={() => handleMarkAttendance(row)}
            className="px-3 py-1.5 text-sm bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Chỉnh sửa
          </button>
        </>
      ) : row.status === 'pending' ? (
        <button
          onClick={() => handleMarkAttendance(row)}
          className="px-3 py-1.5 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors font-medium"
        >
          Điểm danh
        </button>
      ) : (
        <span className="text-xs text-gray-400">Chưa đến giờ</span>
      )}
    </>
  );

  const totalClasses = attendanceRecords.filter(r => r.status === 'completed').length;
  const avgAttendanceRate = totalClasses > 0
    ? attendanceRecords
        .filter(r => r.status === 'completed')
        .reduce((sum, r) => sum + r.attendanceRate, 0) / totalClasses
    : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-7 h-7 text-blue-600" />
            Quản lý điểm danh
          </h1>
          <p className="text-gray-600 mt-1">Theo dõi điểm danh của các lớp học</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Tổng buổi học</p>
              <p className="text-xl font-bold text-gray-900">{attendanceRecords.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Đã điểm danh</p>
              <p className="text-xl font-bold text-gray-900">
                {attendanceRecords.filter(r => r.status === 'completed').length}
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
              <p className="text-xs text-gray-500">Chờ điểm danh</p>
              <p className="text-xl font-bold text-gray-900">
                {attendanceRecords.filter(r => r.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Tỷ lệ TB</p>
              <p className="text-xl font-bold text-gray-900">{avgAttendanceRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>
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
        data={attendanceRecords}
        actions={renderActions}
      />

      {/* Mark Attendance Modal */}
      {showMarkAttendanceModal && selectedRecord && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm" onClick={() => setShowMarkAttendanceModal(false)}></div>
          
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Điểm danh - {selectedRecord.className}
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Ngày: {new Date(selectedRecord.date).toLocaleDateString('vi-VN')}
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600">
                  Tính năng điểm danh chi tiết sẽ được triển khai ở giai đoạn sau. 
                  Bao gồm danh sách học sinh với các trạng thái: Có mặt, Vắng mặt, Muộn, Có phép.
                </p>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => setShowMarkAttendanceModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
