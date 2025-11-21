import React, { useEffect, useState } from 'react';
import { getStudentVideos } from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video as VideoIcon, 
  Play, 
  CheckCircle, 
  Clock, 
  Folder,
  Search,
  Filter,
  Download,
  Share2,
  BookOpen,
  AlertCircle
} from 'lucide-react';
import { SEOHead } from '../../../components/common';

interface Video {
  id: string;
  title: string;
  description: string;
  duration: string;
  url: string;
  thumbnail?: string;
  watchedProgress: number;
  isCompleted: boolean;
  category?: string;
  uploadDate?: string;
}

const VideoCard: React.FC<{ video: Video }> = ({ video }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.02 }}
    className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm hover:shadow-xl transition-all overflow-hidden"
  >
    <div className="aspect-video bg-gray-100 relative group cursor-pointer">
      {video.thumbnail ? (
        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <VideoIcon size={64} className="text-gray-400" />
        </div>
      )}
      
      {/* Play Button Overlay */}
      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
          <Play className="w-8 h-8 text-blue-600 ml-1" />
        </div>
      </div>
      
      {/* Duration Badge */}
      <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded-md font-medium">
        <Clock className="w-3 h-3 inline mr-1" />
        {video.duration}
      </div>
      
      {/* Completed Badge */}
      {video.isCompleted && (
        <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full p-1.5 shadow-lg">
          <CheckCircle size={16} />
        </div>
      )}
      
      {/* Progress Bar */}
      {video.watchedProgress > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-300">
          <div 
            className="h-full bg-blue-500 transition-all"
            style={{ width: `${video.watchedProgress}%` }}
          />
        </div>
      )}
    </div>
    
    <div className="p-5">
      <div className="mb-3">
        {video.category && (
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
            {video.category}
          </span>
        )}
      </div>
      
      <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">{video.title}</h3>
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{video.description}</p>
      
      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span className="font-medium">Tiến độ</span>
          <span className="font-semibold">{video.watchedProgress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-cyan-600 h-2 rounded-full transition-all" 
            style={{ width: `${video.watchedProgress}%` }}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button 
          className="flex-1 bg-cyan-600 text-white py-2.5 px-4 rounded-lg hover:bg-cyan-700 transition-all font-medium text-sm flex items-center justify-center gap-2"
          onClick={() => window.open(video.url, '_blank')}
        >
          <Play className="w-4 h-4" />
          {video.watchedProgress > 0 ? 'Tiếp tục' : 'Xem ngay'}
        </button>
        <button className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <Share2 className="w-4 h-4 text-gray-600" />
        </button>
      </div>
      
      {video.uploadDate && (
        <p className="text-xs text-gray-400 mt-3">Đăng: {video.uploadDate}</p>
      )}
    </div>
  </motion.div>
);

const Videos: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'completed' | 'in-progress'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true);
        // Fallback with mock data since API might not be ready
        const mockVideos: Video[] = [
          {
            id: '1',
            title: 'Toán 9 - Phương trình bậc 2',
            description: 'Học cách giải phương trình bậc 2 với các ví dụ cụ thể',
            duration: '45:30',
            url: '#',
            watchedProgress: 75,
            isCompleted: false,
            category: 'Toán học',
            uploadDate: '15/11/2025'
          },
          {
            id: '2',
            title: 'Lý 9 - Động học chất điểm',
            description: 'Tìm hiểu về chuyển động thẳng đều và biến đổi đều',
            duration: '38:15',
            url: '#',
            watchedProgress: 100,
            isCompleted: true,
            category: 'Vật lý',
            uploadDate: '12/11/2025'
          },
          {
            id: '3',
            title: 'Hóa 9 - Axit và bazơ',
            description: 'Khái niệm và tính chất của axit, bazơ trong hóa học',
            duration: '42:20',
            url: '#',
            watchedProgress: 0,
            isCompleted: false,
            category: 'Hóa học',
            uploadDate: '10/11/2025'
          },
          {
            id: '4',
            title: 'Toán 9 - Hàm số bậc nhất',
            description: 'Đồ thị và tính chất của hàm số bậc nhất',
            duration: '52:45',
            url: '#',
            watchedProgress: 30,
            isCompleted: false,
            category: 'Toán học',
            uploadDate: '08/11/2025'
          },
          {
            id: '5',
            title: 'Lý 9 - Định luật Ôm',
            description: 'Định luật Ôm và ứng dụng trong mạch điện',
            duration: '35:20',
            url: '#',
            watchedProgress: 100,
            isCompleted: true,
            category: 'Vật lý',
            uploadDate: '05/11/2025'
          },
          {
            id: '6',
            title: 'Hóa 9 - Muối và phản ứng trao đổi',
            description: 'Tìm hiểu về muối và các phản ứng trao đổi ion',
            duration: '40:15',
            url: '#',
            watchedProgress: 60,
            isCompleted: false,
            category: 'Hóa học',
            uploadDate: '03/11/2025'
          }
        ];
        setVideos(mockVideos);
      } catch (err: any) {
        setError(err.message || 'Không thể tải video');
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

  const filteredVideos = videos.filter(video => {
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'completed' && video.isCompleted) ||
      (filter === 'in-progress' && video.watchedProgress > 0 && !video.isCompleted);
    
    const matchesSearch = 
      searchQuery === '' ||
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.category?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: videos.length,
    completed: videos.filter(v => v.isCompleted).length,
    inProgress: videos.filter(v => v.watchedProgress > 0 && !v.isCompleted).length,
    totalDuration: videos.reduce((acc, v) => {
      const [min, sec] = v.duration.split(':').map(Number);
      return acc + min * 60 + sec;
    }, 0)
  };

  const formatTotalDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Đang tải video...</p>
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
                <p className="text-red-600 text-sm mt-1">Không thể tải video.</p>
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
        title="Video bài học - DMT Education"
        description="Xem lại các buổi học đã ghi hình"
        keywords="video, bài học, học tập"
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
                  <VideoIcon className="w-8 h-8 text-blue-600" />
                  Video bài học
                </h1>
                <p className="text-gray-600">
                  Xem lại các buổi học đã ghi hình
                </p>
              </div>
              
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Folder className="w-4 h-4" />
                  <span className="text-sm font-medium">Playlist</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-all">
                  <Download className="w-4 h-4" />
                  <span className="text-sm font-medium">Tải xuống</span>
                </button>
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
                    <VideoIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                    <p className="text-xs text-gray-600">Tổng video</p>
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
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                    <p className="text-xs text-gray-600">Đã hoàn thành</p>
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
                    <Play className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
                    <p className="text-xs text-gray-600">Đang xem</p>
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
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{formatTotalDuration(stats.totalDuration)}</p>
                    <p className="text-xs text-gray-600">Tổng thời lượng</p>
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
                placeholder="Tìm kiếm video..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-2">
              {[
                { key: 'all', label: 'Tất cả', icon: Filter },
                { key: 'in-progress', label: 'Đang xem', icon: Play },
                { key: 'completed', label: 'Hoàn thành', icon: CheckCircle }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key as any)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
                    filter === key
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Videos Grid */}
          <AnimatePresence>
            {filteredVideos.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-12 text-center"
              >
                <VideoIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">Không có video nào</p>
                <p className="text-gray-400 text-sm">
                  {searchQuery ? 'Thử tìm kiếm với từ khóa khác' : 'Chưa có video trong danh mục này'}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="video-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {filteredVideos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <VideoCard video={video} />
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
                <h3 className="font-semibold text-gray-900 mb-2">Lưu ý về bản quyền</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Video được bảo vệ bản quyền - không thể tải xuống trực tiếp</li>
                  <li>• Tối đa 3 thiết bị có thể xem đồng thời</li>
                  <li>• Video có watermark để bảo vệ quyền tác giả</li>
                  <li>• Tiến độ học tập được lưu tự động</li>
                </ul>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </>
  );
};

export default Videos;