import React, { useState, useEffect } from 'react';
import { apiClient } from '../../../services/auth';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Spinner from '../../../components/common/Spinner';
import { Database, Download, Upload, Clock, CheckCircle, XCircle, AlertTriangle, HardDrive } from 'lucide-react';

interface BackupRecord {
  id: string;
  filename: string;
  size: number;
  created_at: string;
  type: 'manual' | 'auto';
  status: 'completed' | 'failed' | 'in_progress';
  description?: string;
}

interface BackupStats {
  totalBackups: number;
  totalSize: number;
  lastBackup: string | null;
  autoBackupEnabled: boolean;
  retentionDays: number;
}

const BackupRestore: React.FC = () => {
  const [backups, setBackups] = useState<BackupRecord[]>([]);
  const [stats, setStats] = useState<BackupStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [backupInProgress, setBackupInProgress] = useState(false);
  const [restoreInProgress, setRestoreInProgress] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    loadBackups();
    loadStats();
  }, []);

  const loadBackups = async () => {
    try {
      const response = await apiClient.get('/backup/list');
      setBackups(response.data);
    } catch (err: any) {
      console.error('Error loading backups:', err);
      setError('Không thể tải danh sách backup');
    }
  };

  const loadStats = async () => {
    try {
      const response = await apiClient.get('/backup/stats');
      setStats(response.data);
    } catch (err: any) {
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    try {
      setBackupInProgress(true);
      setError(null);
      setSuccess(null);

      const response = await apiClient.post('/backup/create', {
        description: 'Manual backup from admin panel'
      });

      setSuccess('Backup được tạo thành công!');
      await loadBackups();
      await loadStats();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tạo backup');
    } finally {
      setBackupInProgress(false);
    }
  };

  const handleDownloadBackup = async (backupId: string, filename: string) => {
    try {
      const response = await apiClient.get(`/backup/download/${backupId}`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setSuccess('Đã tải xuống backup thành công!');
    } catch (err: any) {
      setError('Không thể tải xuống backup');
    }
  };

  const handleRestoreBackup = async (backupId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn khôi phục backup này? Dữ liệu hiện tại sẽ bị ghi đè.')) {
      return;
    }

    try {
      setRestoreInProgress(true);
      setError(null);
      setSuccess(null);

      await apiClient.post(`/backup/restore/${backupId}`);

      setSuccess('Khôi phục backup thành công!');
      await loadBackups();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể khôi phục backup');
    } finally {
      setRestoreInProgress(false);
    }
  };

  const handleDeleteBackup = async (backupId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa backup này?')) {
      return;
    }

    try {
      setError(null);
      await apiClient.delete(`/backup/${backupId}`);
      setSuccess('Đã xóa backup thành công!');
      await loadBackups();
      await loadStats();
    } catch (err: any) {
      setError('Không thể xóa backup');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadRestore = async () => {
    if (!selectedFile) {
      setError('Vui lòng chọn file backup');
      return;
    }

    if (!window.confirm('Bạn có chắc chắn muốn upload và khôi phục file này?')) {
      return;
    }

    try {
      setRestoreInProgress(true);
      setError(null);
      setSuccess(null);

      const formData = new FormData();
      formData.append('file', selectedFile);

      await apiClient.post('/backup/upload-restore', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess('Upload và khôi phục thành công!');
      setSelectedFile(null);
      await loadBackups();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể upload backup');
    } finally {
      setRestoreInProgress(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN');
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-600">
        <Spinner /> Đang tải...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Backup & Restore</h1>
          <p className="text-sm text-gray-600">Quản lý sao lưu và phục hồi dữ liệu hệ thống</p>
        </div>
        <Button
          onClick={handleCreateBackup}
          disabled={backupInProgress}
          variant="primary"
        >
          {backupInProgress ? <Spinner /> : <Database className="h-4 w-4 mr-2" />}
          {backupInProgress ? 'Đang tạo backup...' : 'Tạo Backup Mới'}
        </Button>
      </div>

      {/* Notifications */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center gap-2">
          <XCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          <span>{success}</span>
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Database className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tổng số Backup</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalBackups}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <HardDrive className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tổng dung lượng</p>
                <p className="text-2xl font-semibold text-gray-900">{formatFileSize(stats.totalSize)}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Backup gần nhất</p>
                <p className="text-sm font-medium text-gray-900">
                  {stats.lastBackup ? formatDate(stats.lastBackup) : 'Chưa có'}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg ${stats.autoBackupEnabled ? 'bg-green-100' : 'bg-gray-100'}`}>
                <CheckCircle className={`h-6 w-6 ${stats.autoBackupEnabled ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Auto Backup</p>
                <p className="text-sm font-medium text-gray-900">
                  {stats.autoBackupEnabled ? 'Đã bật' : 'Đã tắt'}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Upload Restore Section */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload & Restore từ file</h3>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input
              type="file"
              accept=".bak,.sql"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
            />
            {selectedFile && (
              <p className="text-sm text-gray-600 mt-2">
                File đã chọn: {selectedFile.name} ({formatFileSize(selectedFile.size)})
              </p>
            )}
          </div>
          <Button
            onClick={handleUploadRestore}
            disabled={!selectedFile || restoreInProgress}
            variant="secondary"
          >
            {restoreInProgress ? <Spinner /> : <Upload className="h-4 w-4 mr-2" />}
            {restoreInProgress ? 'Đang restore...' : 'Upload & Restore'}
          </Button>
        </div>
      </Card>

      {/* Backups List */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Danh sách Backup</h3>
        
        {backups.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Database className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p>Chưa có backup nào</p>
            <p className="text-sm">Nhấn "Tạo Backup Mới" để tạo backup đầu tiên</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên file</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loại</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dung lượng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày tạo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {backups.map((backup) => (
                  <tr key={backup.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Database className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{backup.filename}</div>
                          {backup.description && (
                            <div className="text-sm text-gray-500">{backup.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        backup.type === 'auto' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {backup.type === 'auto' ? 'Tự động' : 'Thủ công'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatFileSize(backup.size)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(backup.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {backup.status === 'completed' && (
                        <span className="flex items-center text-green-600 text-sm">
                          <CheckCircle className="h-4 w-4 mr-1" /> Hoàn thành
                        </span>
                      )}
                      {backup.status === 'failed' && (
                        <span className="flex items-center text-red-600 text-sm">
                          <XCircle className="h-4 w-4 mr-1" /> Thất bại
                        </span>
                      )}
                      {backup.status === 'in_progress' && (
                        <span className="flex items-center text-yellow-600 text-sm">
                          <AlertTriangle className="h-4 w-4 mr-1" /> Đang xử lý
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleDownloadBackup(backup.id, backup.filename)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Tải xuống"
                        >
                          <Download className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleRestoreBackup(backup.id)}
                          disabled={backup.status !== 'completed' || restoreInProgress}
                          className="text-green-600 hover:text-green-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                          title="Khôi phục"
                        >
                          <Upload className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteBackup(backup.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Xóa"
                        >
                          <XCircle className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default BackupRestore;
