import React, { useEffect, useState } from 'react';
import { getStudentMaterials } from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  File, 
  Presentation, 
  Image as ImageIcon, 
  Download, 
  Lock, 
  Search,
  Filter,
  Eye,
  FolderOpen,
  AlertCircle,
  BookOpen,
  Calendar,
  HardDrive
} from 'lucide-react';
import { SEOHead } from '../../../components/common';

interface Material {
  id: string;
  title: string;
  description: string;
  fileType: 'pdf' | 'doc' | 'ppt' | 'image';
  size: string;
  downloadCount: number;
  maxDownloads: number;
  url: string;
  uploadDate: string;
  hasWatermark: boolean;
  category?: string;
  previewUrl?: string;
}

const MaterialCard: React.FC<{ material: Material; onPreview: () => void }> = ({ material, onPreview }) => {
  const getFileIcon = (type: string) => {
    const iconClass = "w-12 h-12";
    switch (type) {
      case 'pdf': return <FileText className={iconClass} />;
      case 'doc': return <File className={iconClass} />;
      case 'ppt': return <Presentation className={iconClass} />;
      case 'image': return <ImageIcon className={iconClass} />;
      default: return <FolderOpen className={iconClass} />;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'pdf': return 'bg-red-600';
      case 'doc': return 'bg-blue-600';
      case 'ppt': return 'bg-orange-600';
      case 'image': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  const canDownload = material.downloadCount < material.maxDownloads;
  const progressPercent = (material.downloadCount / material.maxDownloads) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-xl transition-all"
    >
      <div className="flex items-start gap-5">
        <div className={`p-4 rounded-xl ${getIconColor(material.fileType)} text-white flex-shrink-0`}>
          {getFileIcon(material.fileType)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="mb-3">
            {material.category && (
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                {material.category}
              </span>
            )}
          </div>
          
          <h3 className="font-bold text-gray-900 text-lg mb-2">{material.title}</h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{material.description}</p>
          
          <div className="flex flex-wrap items-center gap-4 mb-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <HardDrive className="w-3 h-3" />
              {material.size}
            </span>
            <span className="px-2 py-0.5 bg-gray-100 rounded-md font-medium">
              {material.fileType.toUpperCase()}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {material.uploadDate}
            </span>
            {material.hasWatermark && (
              <span className="text-blue-600 flex items-center gap-1 font-medium">
                <Lock size={12} /> Watermark
              </span>
            )}
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-600 mb-2">
              <span className="font-medium">Lượt tải: {material.downloadCount}/{material.maxDownloads}</span>
              <span className={canDownload ? 'text-green-600' : 'text-red-600'}>
                {canDownload ? `Còn ${material.maxDownloads - material.downloadCount}` : 'Hết lượt'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full transition-all ${
                  canDownload ? 'bg-green-600' : 'bg-red-600'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex gap-2">
            {material.previewUrl && (
              <button 
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                onClick={onPreview}
              >
                <Eye className="w-4 h-4" />
                Xem trước
              </button>
            )}
            <button 
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
                canDownload
                  ? 'bg-cyan-600 text-white hover:bg-cyan-700 shadow-md'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
              onClick={() => canDownload && window.open(material.url, '_blank')}
              disabled={!canDownload}
            >
              <Download className="w-4 h-4" />
              {canDownload ? 'Tải xuống' : 'Hết lượt tải'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Materials: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pdf' | 'doc' | 'ppt' | 'image'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewMaterial, setPreviewMaterial] = useState<Material | null>(null);

  useEffect(() => {
    const loadMaterials = async () => {
      try {
        setLoading(true);
        // Mock data since API might not be ready
        const mockMaterials: Material[] = [
          {
            id: '1',
            title: 'Bài tập Toán 9 - Chương 1',
            description: 'Tập hợp các bài tập về phương trình và hệ phương trình',
            fileType: 'pdf',
            size: '2.4 MB',
            downloadCount: 2,
            maxDownloads: 5,
            url: '#',
            uploadDate: '05/11/2025',
            hasWatermark: true,
            category: 'Toán học',
            previewUrl: '#'
          },
          {
            id: '2',
            title: 'Lý thuyết Vật lý 9',
            description: 'Tài liệu tổng hợp lý thuyết cơ bản về động học',
            fileType: 'pdf',
            size: '1.8 MB',
            downloadCount: 1,
            maxDownloads: 3,
            url: '#',
            uploadDate: '03/11/2025',
            hasWatermark: true,
            category: 'Vật lý',
            previewUrl: '#'
          },
          {
            id: '3',
            title: 'Slide bài giảng Hóa học',
            description: 'Các khái niệm cơ bản về axit, bazơ và muối',
            fileType: 'ppt',
            size: '5.2 MB',
            downloadCount: 0,
            maxDownloads: 2,
            url: '#',
            uploadDate: '01/11/2025',
            hasWatermark: false,
            category: 'Hóa học'
          },
          {
            id: '4',
            title: 'Đề cương ôn tập Toán 9',
            description: 'Tổng hợp kiến thức và bài tập ôn tập học kỳ 1',
            fileType: 'doc',
            size: '1.2 MB',
            downloadCount: 3,
            maxDownloads: 5,
            url: '#',
            uploadDate: '28/10/2025',
            hasWatermark: true,
            category: 'Toán học',
            previewUrl: '#'
          },
          {
            id: '5',
            title: 'Hình ảnh minh họa Vật lý',
            description: 'Các hình ảnh minh họa thí nghiệm vật lý',
            fileType: 'image',
            size: '8.5 MB',
            downloadCount: 0,
            maxDownloads: 3,
            url: '#',
            uploadDate: '25/10/2025',
            hasWatermark: false,
            category: 'Vật lý'
          }
        ];
        setMaterials(mockMaterials);
      } catch (err: any) {
        setError(err.message || 'Không thể tải tài liệu');
      } finally {
        setLoading(false);
      }
    };

    loadMaterials();
  }, []);

  const filteredMaterials = materials.filter(material => {
    const matchesFilter = filter === 'all' || material.fileType === filter;
    const matchesSearch = 
      searchQuery === '' ||
      material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: materials.length,
    pdf: materials.filter(m => m.fileType === 'pdf').length,
    doc: materials.filter(m => m.fileType === 'doc').length,
    ppt: materials.filter(m => m.fileType === 'ppt').length,
    totalSize: materials.reduce((acc, m) => {
      const size = parseFloat(m.size);
      return acc + size;
    }, 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Đang tải tài liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 font-semibold">Lỗi: {error}</p>
                <p className="text-red-600 text-sm mt-1">Không thể tải tài liệu.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="Tài liệu khóa học - DMT Education"
        description="Tải về tài liệu học tập"
        keywords="tài liệu, pdf, học tập"
      />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <FolderOpen className="w-8 h-8 text-blue-600" />
                  Tài liệu khóa học
                </h1>
                <p className="text-gray-600">
                  Tải về tài liệu học tập với giới hạn số lần tải
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FolderOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                    <p className="text-xs text-gray-600">Tổng tài liệu</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.pdf}</p>
                    <p className="text-xs text-gray-600">File PDF</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Presentation className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.ppt}</p>
                    <p className="text-xs text-gray-600">File PPT</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <HardDrive className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalSize.toFixed(1)}</p>
                    <p className="text-xs text-gray-600">MB Tổng dung lượng</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Search & Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6 flex flex-col sm:flex-row gap-4"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm tài liệu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto">
              {[
                { key: 'all', label: 'Tất cả', icon: Filter },
                { key: 'pdf', label: 'PDF', icon: FileText },
                { key: 'doc', label: 'Word', icon: File },
                { key: 'ppt', label: 'PPT', icon: Presentation },
                { key: 'image', label: 'Hình', icon: ImageIcon }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key as any)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
                    filter === key
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Materials List */}
          <AnimatePresence>
            {filteredMaterials.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-12 text-center"
              >
                <FolderOpen className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">Không có tài liệu nào</p>
                <p className="text-gray-400 text-sm">
                  {searchQuery ? 'Thử tìm kiếm với từ khóa khác' : 'Chưa có tài liệu trong danh mục này'}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="materials-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid gap-6"
              >
                {filteredMaterials.map((material, index) => (
                  <motion.div
                    key={material.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <MaterialCard 
                      material={material} 
                      onPreview={() => setPreviewMaterial(material)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Info Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 bg-blue-50 rounded-xl border border-blue-200 p-6"
          >
            <div className="flex items-start gap-3">
              <BookOpen className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Quy định sử dụng tài liệu</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Tài liệu có watermark, không được chỉnh sửa hoặc phân phối</li>
                  <li>• Số lượt tải giới hạn theo từng tài liệu</li>
                  <li>• Chỉ sử dụng cho mục đích học tập cá nhân</li>
                  <li>• Liên hệ giáo viên nếu cần tải thêm hoặc hết lượt</li>
                </ul>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewMaterial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setPreviewMaterial(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{previewMaterial.title}</h2>
                  <p className="text-gray-600">{previewMaterial.description}</p>
                </div>
                <button
                  onClick={() => setPreviewMaterial(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="aspect-video bg-gray-100 rounded-lg mb-6 flex items-center justify-center">
                <p className="text-gray-500">Xem trước tài liệu sẽ được hiển thị ở đây</p>
              </div>
              
              <button
                className="w-full bg-cyan-600 text-white py-3 rounded-lg font-semibold hover:bg-cyan-700 transition-all"
                onClick={() => window.open(previewMaterial.url, '_blank')}
              >
                Tải xuống tài liệu
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Materials;