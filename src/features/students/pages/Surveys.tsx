import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  Star,
  ListTodo,
  MessageSquare,
  TrendingUp,
  Award,
  Calendar,
  AlertCircle,
  Play,
  Eye
} from 'lucide-react';
import { SEOHead } from '../../../components/common/SEOHead';

interface Survey {
  id: string;
  title: string;
  description: string;
  deadline?: string;
  status: 'pending' | 'completed';
  courseTitle: string;
  questionCount: number;
  completedAt?: string;
  rating?: number;
  priority?: 'high' | 'medium' | 'low';
  category?: 'course' | 'teacher' | 'facility' | 'general';
}

const Surveys: React.FC = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSurveys();
  }, []);

  const loadSurveys = async () => {
    try {
      setLoading(true);
      // TODO: Integrate with Supabase API
      // const data = await studentService.getSurveys();
      
      // Mock data
      const mockSurveys: Survey[] = [
        {
          id: '1',
          title: 'Khảo sát đánh giá khóa học Toán 10',
          description: 'Vui lòng đánh giá chất lượng giảng dạy và nội dung khóa học',
          deadline: '2025-11-30',
          status: 'pending',
          courseTitle: 'Toán 10 - Nâng cao',
          questionCount: 10,
          priority: 'high',
          category: 'course'
        },
        {
          id: '2',
          title: 'Khảo sát hài lòng về giáo viên',
          description: 'Đánh giá về phương pháp giảng dạy của giáo viên',
          status: 'completed',
          courseTitle: 'Vật Lý 10',
          questionCount: 8,
          completedAt: '2025-11-10',
          rating: 5,
          priority: 'medium',
          category: 'teacher'
        },
        {
          id: '3',
          title: 'Khảo sát chất lượng dịch vụ',
          description: 'Đánh giá về cơ sở vật chất và dịch vụ hỗ trợ',
          deadline: '2025-12-05',
          status: 'pending',
          courseTitle: 'Chung',
          questionCount: 12,
          priority: 'medium',
          category: 'facility'
        },
        {
          id: '4',
          title: 'Đánh giá học kỳ 1',
          description: 'Khảo sát tổng quan về học kỳ vừa qua',
          status: 'completed',
          courseTitle: 'Chung',
          questionCount: 15,
          completedAt: '2025-10-28',
          rating: 4,
          priority: 'low',
          category: 'general'
        },
        {
          id: '5',
          title: 'Khảo sát chương trình học',
          description: 'Ý kiến về nội dung và chương trình giảng dạy',
          deadline: '2025-11-25',
          status: 'pending',
          courseTitle: 'Hóa học 10',
          questionCount: 10,
          priority: 'low',
          category: 'course'
        }
      ];

      setSurveys(mockSurveys);
    } catch (error) {
      console.error('Failed to load surveys:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSurveys = surveys.filter(survey => {
    if (filter === 'all') return true;
    return survey.status === filter;
  });

  const pendingCount = surveys.filter(s => s.status === 'pending').length;
  const completedCount = surveys.filter(s => s.status === 'completed').length;
  const avgRating = surveys
    .filter(s => s.rating)
    .reduce((acc, s) => acc + (s.rating || 0), 0) / surveys.filter(s => s.rating).length || 0;

  const getCategoryInfo = (category?: string) => {
    switch (category) {
      case 'course':
        return { label: 'Khóa học', color: 'bg-red-100 text-red-700', icon: FileText };
      case 'teacher':
        return { label: 'Giáo viên', color: 'bg-orange-100 text-orange-700', icon: Award };
      case 'facility':
        return { label: 'Cơ sở', color: 'bg-yellow-100 text-yellow-700', icon: TrendingUp };
      default:
        return { label: 'Chung', color: 'bg-gray-100 text-gray-700', icon: MessageSquare };
    }
  };

  const handleStartSurvey = (surveyId: string) => {
    // TODO: Navigate to survey form
    console.log('Start survey:', surveyId);
  };

  const getDaysRemaining = (deadline?: string) => {
    if (!deadline) return null;
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <>
        <SEOHead
          title="Khảo sát - DMT Education"
          description="Hoàn thành khảo sát đánh giá"
          keywords={["khảo sát", "đánh giá", "phản hồi"]}
        />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-gray-200 border-t-red-500 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Đang tải khảo sát...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead
        title="Khảo sát - DMT Education"
        description="Hoàn thành khảo sát đánh giá"
        keywords={["khảo sát", "đánh giá", "phản hồi"]}
      />

      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <ListTodo className="w-8 h-8 text-red-600" />
                Khảo sát & Đánh giá
              </h1>
              <p className="text-gray-600">
                Hoàn thành khảo sát để giúp chúng tôi cải thiện chất lượng giảng dạy
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
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{surveys.length}</p>
                    <p className="text-xs text-gray-600">Tổng khảo sát</p>
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
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
                    <p className="text-xs text-gray-600">Chưa hoàn thành</p>
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
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{completedCount}</p>
                    <p className="text-xs text-gray-600">Đã hoàn thành</p>
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
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-yellow-600 fill-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{avgRating.toFixed(1)}</p>
                    <p className="text-xs text-gray-600">Điểm TB</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Filter Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-1 inline-flex"
          >
            {[
              { key: 'all', label: `Tất cả (${surveys.length})` },
              { key: 'pending', label: `Chưa hoàn thành (${pendingCount})` },
              { key: 'completed', label: `Đã hoàn thành (${completedCount})` }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`px-6 py-2 text-sm font-medium rounded-lg transition-all ${
                  filter === key
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {label}
              </button>
            ))}
          </motion.div>

          {/* Surveys List */}
          <AnimatePresence>
            {filteredSurveys.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-12 text-center"
              >
                <FileText className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Không có khảo sát {filter === 'pending' ? 'chưa hoàn thành' : filter === 'completed' ? 'đã hoàn thành' : ''}
                </h3>
                <p className="text-sm text-gray-500">
                  {filter === 'pending' 
                    ? 'Bạn đã hoàn thành tất cả khảo sát' 
                    : 'Chưa có khảo sát nào'}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="surveys-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid gap-4"
              >
                {filteredSurveys.map((survey, index) => {
                  const daysRemaining = getDaysRemaining(survey.deadline);
                  const isUrgent = daysRemaining !== null && daysRemaining <= 3;
                  const categoryInfo = getCategoryInfo(survey.category);

                  return (
                    <motion.div
                      key={survey.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -2 }}
                      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              survey.status === 'completed' 
                                ? 'bg-green-600' 
                                : 'bg-red-600'
                            }`}>
                              {survey.status === 'completed' ? (
                                <CheckCircle className="w-6 h-6 text-white" />
                              ) : (
                                <FileText className="w-6 h-6 text-white" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-gray-900 mb-1">
                                {survey.title}
                              </h3>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">{survey.courseTitle}</span>
                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${categoryInfo.color}`}>
                                  {categoryInfo.label}
                                </span>
                                {survey.priority === 'high' && (
                                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700">
                                    Ưu tiên cao
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <p className="text-sm text-gray-700 mb-4">
                            {survey.description}
                          </p>

                          <div className="flex items-center flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <MessageSquare className="w-4 h-4" />
                              <span>{survey.questionCount} câu hỏi</span>
                            </div>

                            {survey.deadline && survey.status === 'pending' && (
                              <div className={`flex items-center gap-1 ${
                                isUrgent ? 'text-red-600 font-semibold' : ''
                              }`}>
                                <Clock className="w-4 h-4" />
                                <span>
                                  {daysRemaining !== null && daysRemaining > 0
                                    ? `Còn ${daysRemaining} ngày`
                                    : 'Hết hạn'}
                                </span>
                              </div>
                            )}

                            {survey.completedAt && (
                              <div className="flex items-center gap-1 text-green-600">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {new Date(survey.completedAt).toLocaleDateString('vi-VN')}
                                </span>
                              </div>
                            )}

                            {survey.rating && (
                              <div className="flex items-center gap-1 text-yellow-600">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`w-4 h-4 ${i < survey.rating! ? 'fill-yellow-600' : 'fill-gray-200'}`}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="ml-4">
                          {survey.status === 'pending' ? (
                            <button
                              onClick={() => handleStartSurvey(survey.id)}
                              className="px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-all shadow-md flex items-center gap-2"
                            >
                              <Play className="w-4 h-4" />
                              Bắt đầu
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStartSurvey(survey.id)}
                              className="px-5 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              Xem lại
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Info Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 bg-red-50 rounded-xl border border-red-200 p-6"
          >
            <div className="flex items-start gap-3">
              <MessageSquare className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Về khảo sát</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Khảo sát giúp chúng tôi hiểu rõ hơn về trải nghiệm học tập của bạn</li>
                  <li>• Thông tin của bạn được bảo mật và chỉ sử dụng để cải thiện chất lượng</li>
                  <li>• Hoàn thành khảo sát đúng hạn để nhận phần thưởng hấp dẫn</li>
                  <li>• Mỗi khảo sát chỉ mất 5-10 phút để hoàn thành</li>
                </ul>
              </div>
            </div>
          </motion.div>
      </div>
    </>
  );
};

export default Surveys;
