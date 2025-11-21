import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Download, Star, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import DataTable, { ColumnDef } from '../../components/common/DataTable';
import FilterBar, { FilterConfig } from '../../components/common/FilterBar';
import StatusBadge from '../../components/common/StatusBadge';

interface Submission {
  id: string;
  studentId: string;
  studentName: string;
  studentCode: string;
  submittedDate: string;
  score?: number;
  status: 'graded' | 'pending' | 'late';
  fileUrl?: string;
  comment?: string;
}

const Grading: React.FC = () => {
  const navigate = useNavigate();
  const { assignmentId } = useParams();
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [showGradingModal, setShowGradingModal] = useState(false);
  const [gradingData, setGradingData] = useState({ score: '', comment: '' });

  // Mock data
  const assignmentInfo = {
    title: 'Bài tập tuần 5 - React Hooks',
    className: 'Lớp ReactJS Nâng cao',
    dueDate: '08/01/2025',
    totalStudents: 30
  };

  const submissions: Submission[] = [
    {
      id: '1',
      studentId: 'S001',
      studentName: 'Nguyễn Văn A',
      studentCode: 'HS001',
      submittedDate: '2025-01-07T14:30:00',
      score: 9.5,
      status: 'graded',
      fileUrl: '/files/submission1.pdf',
      comment: 'Bài làm tốt, code clean và có comments chi tiết'
    },
    {
      id: '2',
      studentId: 'S002',
      studentName: 'Trần Thị B',
      studentCode: 'HS002',
      submittedDate: '2025-01-08T10:15:00',
      status: 'pending',
      fileUrl: '/files/submission2.pdf'
    },
    {
      id: '3',
      studentId: 'S003',
      studentName: 'Lê Văn C',
      studentCode: 'HS003',
      submittedDate: '2025-01-09T08:20:00',
      status: 'late',
      fileUrl: '/files/submission3.pdf'
    },
    {
      id: '4',
      studentId: 'S004',
      studentName: 'Phạm Thị D',
      studentCode: 'HS004',
      submittedDate: '2025-01-07T20:45:00',
      score: 8.0,
      status: 'graded',
      fileUrl: '/files/submission4.pdf',
      comment: 'Tốt, cần cải thiện error handling'
    },
    {
      id: '5',
      studentId: 'S005',
      studentName: 'Hoàng Văn E',
      studentCode: 'HS005',
      submittedDate: '2025-01-08T16:30:00',
      status: 'pending',
      fileUrl: '/files/submission5.pdf'
    }
  ];

  const filterConfigs: FilterConfig[] = [
    {
      type: 'select',
      name: 'status',
      label: 'Trạng thái',
      options: [
        { value: 'graded', label: 'Đã chấm' },
        { value: 'pending', label: 'Chờ chấm' },
        { value: 'late', label: 'Nộp muộn' }
      ]
    }
  ];

  const columns: ColumnDef<Submission>[] = [
    {
      key: 'studentCode',
      header: 'Mã HS',
      width: '100px',
      render: (row) => (
        <span className="font-mono text-sm font-semibold text-blue-600">{row.studentCode}</span>
      )
    },
    {
      key: 'studentName',
      header: 'Họ tên',
      render: (row) => (
        <span className="font-semibold text-gray-900">{row.studentName}</span>
      )
    },
    {
      key: 'submittedDate',
      header: 'Ngày nộp',
      width: '160px',
      render: (row) => (
        <span className="text-sm text-gray-700">
          {new Date(row.submittedDate).toLocaleString('vi-VN')}
        </span>
      )
    },
    {
      key: 'score',
      header: 'Điểm',
      width: '100px',
      render: (row) => (
        row.score !== undefined ? (
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="font-bold text-lg">{row.score}</span>
          </div>
        ) : (
          <span className="text-gray-400 text-sm">Chưa chấm</span>
        )
      )
    },
    {
      key: 'status',
      header: 'Trạng thái',
      width: '120px',
      render: (row) => (
        <StatusBadge 
          status={row.status === 'graded' ? 'completed' : row.status === 'late' ? 'warning' : 'pending'} 
        />
      )
    }
  ];

  const handleGrade = (submission: Submission) => {
    setSelectedSubmission(submission);
    setGradingData({
      score: submission.score?.toString() || '',
      comment: submission.comment || ''
    });
    setShowGradingModal(true);
  };

  const submitGrade = () => {
    console.log('Grading submission:', selectedSubmission?.id, gradingData);
    setShowGradingModal(false);
    setSelectedSubmission(null);
    setGradingData({ score: '', comment: '' });
    // TODO: Call API to save grade
  };

  const renderActions = (row: Submission) => (
    <>
      {row.fileUrl && (
        <a
          href={row.fileUrl}
          download
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="Tải xuống"
        >
          <Download className="w-4 h-4" />
        </a>
      )}
      <button
        onClick={() => handleGrade(row)}
        className="px-3 py-1.5 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors font-medium"
      >
        {row.status === 'graded' ? 'Sửa điểm' : 'Chấm điểm'}
      </button>
    </>
  );

  const gradedCount = submissions.filter(s => s.status === 'graded').length;
  const avgScore = submissions
    .filter(s => s.score !== undefined)
    .reduce((sum, s) => sum + (s.score || 0), 0) / (gradedCount || 1);

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <button
            onClick={() => navigate('/teacher/assignments')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại danh sách bài tập</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{assignmentInfo.title}</h1>
          <p className="text-gray-600 mt-1">
            {assignmentInfo.className} • Hạn nộp: {assignmentInfo.dueDate}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Đã nộp</p>
              <p className="text-xl font-bold text-gray-900">
                {submissions.length}/{assignmentInfo.totalStudents}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Đã chấm</p>
              <p className="text-xl font-bold text-gray-900">
                {gradedCount}/{submissions.length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Điểm TB</p>
              <p className="text-xl font-bold text-gray-900">{avgScore.toFixed(1)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Nộp muộn</p>
              <p className="text-xl font-bold text-gray-900">
                {submissions.filter(s => s.status === 'late').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <FilterBar
        filters={filterConfigs}
        onFilterChange={setFilters}
        searchPlaceholder="Tìm kiếm học sinh..."
      />

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={submissions}
        actions={renderActions}
      />

      {/* Grading Modal */}
      {showGradingModal && selectedSubmission && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm" onClick={() => setShowGradingModal(false)}></div>
          
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Chấm điểm - {selectedSubmission.studentName}
              </h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Điểm số (0-10)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.5"
                    value={gradingData.score}
                    onChange={(e) => setGradingData({ ...gradingData, score: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập điểm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nhận xét
                  </label>
                  <textarea
                    value={gradingData.comment}
                    onChange={(e) => setGradingData({ ...gradingData, comment: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Nhập nhận xét cho học sinh..."
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowGradingModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={submitGrade}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Lưu điểm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Grading;
