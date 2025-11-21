import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Download, Eye, Trash2, Upload } from 'lucide-react';
import DataTable, { ColumnDef } from '../../components/common/DataTable';
import FilterBar, { FilterConfig } from '../../components/common/FilterBar';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmDialog from '../../components/common/ConfirmDialog';

interface Material {
  id: string;
  title: string;
  description: string;
  className: string;
  classId: string;
  type: 'pdf' | 'doc' | 'video' | 'link' | 'other';
  fileSize?: string;
  uploadDate: string;
  downloads: number;
  status: 'active' | 'archived';
  fileUrl?: string;
}

const Materials: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

  // Mock data
  const materials: Material[] = [
    {
      id: '1',
      title: 'Slide bài giảng - React Hooks',
      description: 'Tổng quan về useState, useEffect, useContext và custom hooks',
      className: 'Lớp ReactJS Nâng cao',
      classId: '1',
      type: 'pdf',
      fileSize: '2.3 MB',
      uploadDate: '2025-01-05',
      downloads: 28,
      status: 'active',
      fileUrl: '/materials/react-hooks.pdf'
    },
    {
      id: '2',
      title: 'Video hướng dẫn - Async/Await',
      description: 'Giải thích chi tiết về asynchronous programming trong JavaScript',
      className: 'Lớp JavaScript Cơ bản',
      classId: '2',
      type: 'video',
      fileSize: '45 MB',
      uploadDate: '2025-01-03',
      downloads: 23,
      status: 'active',
      fileUrl: '/materials/async-await.mp4'
    },
    {
      id: '3',
      title: 'Tài liệu tham khảo - TypeScript Generics',
      description: 'Hướng dẫn sử dụng Generics trong TypeScript',
      className: 'Lớp TypeScript Pro',
      classId: '4',
      type: 'doc',
      fileSize: '1.8 MB',
      uploadDate: '2024-12-20',
      downloads: 18,
      status: 'archived',
      fileUrl: '/materials/ts-generics.docx'
    },
    {
      id: '4',
      title: 'Link tham khảo - MDN Web Docs',
      description: 'Tài liệu chính thức về Web APIs',
      className: 'Lớp Web Development',
      classId: '3',
      type: 'link',
      uploadDate: '2025-01-01',
      downloads: 15,
      status: 'active',
      fileUrl: 'https://developer.mozilla.org'
    }
  ];

  const filterConfigs: FilterConfig[] = [
    {
      type: 'select',
      name: 'type',
      label: 'Loại tài liệu',
      options: [
        { value: 'pdf', label: 'PDF' },
        { value: 'doc', label: 'Document' },
        { value: 'video', label: 'Video' },
        { value: 'link', label: 'Link' },
        { value: 'other', label: 'Khác' }
      ]
    },
    {
      type: 'select',
      name: 'status',
      label: 'Trạng thái',
      options: [
        { value: 'active', label: 'Đang sử dụng' },
        { value: 'archived', label: 'Đã lưu trữ' }
      ]
    },
    {
      type: 'daterange',
      name: 'dateRange',
      label: 'Ngày tải lên'
    }
  ];

  const getTypeIcon = (type: string) => {
    const icons = {
      pdf: '📄',
      doc: '📝',
      video: '🎥',
      link: '🔗',
      other: '📎'
    };
    return icons[type as keyof typeof icons] || '📎';
  };

  const columns: ColumnDef<Material>[] = [
    {
      key: 'title',
      header: 'Tiêu đề',
      render: (row) => (
        <div className="flex items-start gap-3">
          <span className="text-2xl">{getTypeIcon(row.type)}</span>
          <div>
            <div className="font-semibold text-gray-900">{row.title}</div>
            <div className="text-xs text-gray-500 mt-1">{row.description}</div>
          </div>
        </div>
      )
    },
    {
      key: 'className',
      header: 'Lớp học',
      width: '200px',
      render: (row) => (
        <span className="text-sm text-gray-700">{row.className}</span>
      )
    },
    {
      key: 'fileSize',
      header: 'Kích thước',
      width: '100px',
      render: (row) => (
        <span className="text-sm text-gray-600">{row.fileSize || '-'}</span>
      )
    },
    {
      key: 'downloads',
      header: 'Lượt tải',
      width: '100px',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Download className="w-4 h-4 text-gray-400" />
          <span className="font-semibold text-gray-900">{row.downloads}</span>
        </div>
      )
    },
    {
      key: 'uploadDate',
      header: 'Ngày tải lên',
      width: '120px',
      render: (row) => (
        <span className="text-sm text-gray-700">
          {new Date(row.uploadDate).toLocaleDateString('vi-VN')}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Trạng thái',
      width: '140px',
      render: (row) => <StatusBadge status={row.status === 'archived' ? 'inactive' : 'active'} />
    }
  ];

  const handleDelete = (material: Material) => {
    setSelectedMaterial(material);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    console.log('Deleting material:', selectedMaterial);
    setDeleteDialogOpen(false);
    setSelectedMaterial(null);
    // TODO: Call API to delete
  };

  const renderActions = (row: Material) => (
    <>
      {row.fileUrl && (
        <>
          <button
            onClick={() => window.open(row.fileUrl, '_blank')}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Xem"
          >
            <Eye className="w-4 h-4" />
          </button>
          <a
            href={row.fileUrl}
            download
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Tải xuống"
          >
            <Download className="w-4 h-4" />
          </a>
        </>
      )}
      <button
        onClick={() => handleDelete(row)}
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
            <FileText className="w-7 h-7 text-blue-600" />
            Quản lý tài liệu
          </h1>
          <p className="text-gray-600 mt-1">Tài liệu học tập cho các lớp học</p>
        </div>
        <button
          onClick={() => navigate('/teacher/materials/upload')}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transform hover:scale-105 transition-all"
        >
          <Upload className="w-5 h-5" />
          <span>Tải tài liệu lên</span>
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
              <p className="text-xs text-gray-500">Tổng tài liệu</p>
              <p className="text-xl font-bold text-gray-900">{materials.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Tổng lượt tải</p>
              <p className="text-xl font-bold text-gray-900">
                {materials.reduce((sum, m) => sum + m.downloads, 0)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📄</span>
            <div>
              <p className="text-xs text-gray-500">PDF</p>
              <p className="text-xl font-bold text-gray-900">
                {materials.filter(m => m.type === 'pdf').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎥</span>
            <div>
              <p className="text-xs text-gray-500">Video</p>
              <p className="text-xl font-bold text-gray-900">
                {materials.filter(m => m.type === 'video').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <FilterBar
        filters={filterConfigs}
        onFilterChange={setFilters}
        searchPlaceholder="Tìm kiếm tài liệu..."
      />

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={materials}
        actions={renderActions}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        type="danger"
        title="Xóa tài liệu"
        message={`Bạn có chắc chắn muốn xóa tài liệu "${selectedMaterial?.title}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa tài liệu"
        cancelText="Hủy"
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setSelectedMaterial(null);
        }}
      />
    </div>
  );
};

export default Materials;
