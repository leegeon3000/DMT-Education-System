import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  TrendingUp, 
  Award, 
  Calendar, 
  FileText,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Target,
  Trophy,
  Star,
  MessageSquare,
  Download,
  Filter,
  ChevronDown
} from 'lucide-react';
import SEOHead from '../../../components/common/SEOHead';

interface Grade {
  id: string;
  subject: string;
  assignment: string;
  score: number;
  maxScore: number;
  percentage: number;
  grade: string;
  teacher: string;
  comment: string;
  date: string;
  type: 'homework' | 'quiz' | 'midterm' | 'final';
  semester?: number;
  status?: 'excellent' | 'good' | 'average' | 'poor';
}

interface SubjectSummary {
  subject: string;
  avgScore: number;
  totalAssignments: number;
  grade: string;
  color: string;
  trend?: 'up' | 'down' | 'stable';
  icon?: string;
}

const getGradeColor = (percentage: number) => {
  if (percentage >= 90) return 'text-green-600 bg-green-50';
  if (percentage >= 80) return 'text-blue-600 bg-blue-50';
  if (percentage >= 70) return 'text-yellow-600 bg-yellow-50';
  if (percentage >= 60) return 'text-orange-600 bg-orange-50';
  return 'text-red-600 bg-red-50';
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'final': return 'bg-red-100 text-red-700';
    case 'midterm': return 'bg-orange-100 text-orange-700';
    case 'quiz': return 'bg-blue-100 text-blue-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const GradeCard: React.FC<{ grade: Grade }> = ({ grade }) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-shadow"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getTypeColor(grade.type)}`}>
            {grade.type === 'final' ? <Trophy className="w-4 h-4" /> :
             grade.type === 'midterm' ? <Award className="w-4 h-4" /> :
             grade.type === 'quiz' ? <FileText className="w-4 h-4" /> : 
             <BookOpen className="w-4 h-4" />}
          </div>
          <h3 className="font-semibold text-gray-900">{grade.assignment}</h3>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <BookOpen className="w-4 h-4" />
          <span>{grade.subject}</span>
          <span className="text-gray-400">•</span>
          <span>{grade.teacher}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
          <Calendar className="w-3 h-3" />
          <span>{grade.date}</span>
        </div>
      </div>
      
      <div className="text-right">
        <div className={`px-4 py-2 rounded-xl font-bold text-lg ${getGradeColor(grade.percentage)}`}>
          {grade.score}/{grade.maxScore}
        </div>
        <div className="mt-1 flex items-center justify-end gap-1">
          <span className="text-sm font-semibold text-gray-700">{grade.percentage}%</span>
          <span className="text-xs text-gray-500">({grade.grade})</span>
        </div>
        {grade.percentage >= 90 && (
          <div className="mt-1 flex items-center justify-end gap-1 text-yellow-600">
            <Star className="w-3 h-3 fill-current" />
            <span className="text-xs font-medium">Xuất sắc</span>
          </div>
        )}
      </div>
    </div>
    
    {/* Progress Bar */}
    <div className="w-full bg-gray-100 rounded-full h-2 mb-3 overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${grade.percentage}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`h-2 rounded-full ${
          grade.percentage >= 90 ? 'bg-green-600' :
          grade.percentage >= 80 ? 'bg-blue-600' :
          grade.percentage >= 70 ? 'bg-yellow-600' :
          grade.percentage >= 60 ? 'bg-orange-600' : 
          'bg-red-600'
        }`}
      />
    </div>
    
    {grade.comment && (
      <div className="mt-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
        <div className="flex items-start gap-2">
          <MessageSquare className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-blue-900 mb-1">Nhận xét từ giáo viên:</p>
            <p className="text-sm text-gray-700">{grade.comment}</p>
          </div>
        </div>
      </div>
    )}
  </motion.div>
);

const SubjectCard: React.FC<{ summary: SubjectSummary }> = ({ summary }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-shadow"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            summary.avgScore >= 9 ? 'bg-green-100' :
            summary.avgScore >= 8 ? 'bg-blue-100' :
            summary.avgScore >= 7 ? 'bg-yellow-100' :
            summary.avgScore >= 6 ? 'bg-orange-100' : 'bg-red-100'
          }`}>
            <BookOpen className={`w-5 h-5 ${
              summary.avgScore >= 9 ? 'text-green-600' :
              summary.avgScore >= 8 ? 'text-blue-600' :
              summary.avgScore >= 7 ? 'text-yellow-600' :
              summary.avgScore >= 6 ? 'text-orange-600' : 'text-red-600'
            }`} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{summary.subject}</h3>
            <p className="text-xs text-gray-500">{summary.totalAssignments} bài đánh giá</p>
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className={`px-4 py-2 rounded-xl font-bold text-lg ${summary.color}`}>
          {summary.avgScore.toFixed(1)}
        </div>
        <p className="text-xs text-gray-600 mt-1 font-medium">Điểm {summary.grade}</p>
        {summary.trend && (
          <div className={`flex items-center justify-end gap-1 mt-1 text-xs font-medium ${
            summary.trend === 'up' ? 'text-green-600' :
            summary.trend === 'down' ? 'text-red-600' : 'text-gray-500'
          }`}>
            <TrendingUp className={`w-3 h-3 ${
              summary.trend === 'down' ? 'rotate-180' : ''
            }`} />
            <span>{summary.trend === 'up' ? 'Tăng' : summary.trend === 'down' ? 'Giảm' : 'Ổn định'}</span>
          </div>
        )}
      </div>
    </div>
    
    <div className="space-y-2">
      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(summary.avgScore / 10) * 100}%` }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className={`h-3 rounded-full ${
            summary.avgScore >= 9 ? 'bg-green-600' :
            summary.avgScore >= 8 ? 'bg-blue-600' :
            summary.avgScore >= 7 ? 'bg-yellow-600' :
            summary.avgScore >= 6 ? 'bg-orange-600' : 
            'bg-red-600'
          }`}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>0</span>
        <span>5</span>
        <span>10</span>
      </div>
    </div>
  </motion.div>
);

const Transcript: React.FC = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [summaries, setSummaries] = useState<SubjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'homework' | 'quiz' | 'midterm' | 'final'>('all');

  useEffect(() => {
    const loadTranscript = async () => {
      try {
        setLoading(true);
        // Mock data since API might not be ready
        const mockGrades: Grade[] = [
          {
            id: '1',
            subject: 'Toán 9',
            assignment: 'Phương trình bậc 2',
            score: 8.5,
            maxScore: 10,
            percentage: 85,
            grade: 'B+',
            teacher: 'Thầy Minh',
            comment: 'Làm tốt, cần chú ý thêm về giải phương trình có nghiệm kép',
            date: '15/11/2025',
            type: 'homework',
            semester: 1,
            status: 'good'
          },
          {
            id: '2',
            subject: 'Vật lý 9',
            assignment: 'Kiểm tra giữa kỳ',
            score: 9.0,
            maxScore: 10,
            percentage: 90,
            grade: 'A-',
            teacher: 'Cô Hương',
            comment: 'Rất tốt! Hiểu sâu về động học chất điểm',
            date: '12/11/2025',
            type: 'midterm',
            semester: 1,
            status: 'excellent'
          },
          {
            id: '3',
            subject: 'Hóa học 9',
            assignment: 'Bài tập Axit-Bazơ',
            score: 7.5,
            maxScore: 10,
            percentage: 75,
            grade: 'B',
            teacher: 'Thầy Đức',
            comment: 'Cần ôn lại phần cân bằng phương trình hóa học',
            date: '10/11/2025',
            type: 'homework',
            semester: 1,
            status: 'average'
          },
          {
            id: '4',
            subject: 'Toán 9',
            assignment: 'Kiểm tra 15 phút - Hàm số',
            score: 9.5,
            maxScore: 10,
            percentage: 95,
            grade: 'A',
            teacher: 'Thầy Minh',
            comment: 'Xuất sắc! Nắm vững khái niệm hàm số bậc nhất',
            date: '08/11/2025',
            type: 'quiz',
            semester: 1,
            status: 'excellent'
          },
          {
            id: '5',
            subject: 'Vật lý 9',
            assignment: 'Bài tập Động lực học',
            score: 8.0,
            maxScore: 10,
            percentage: 80,
            grade: 'B+',
            teacher: 'Cô Hương',
            comment: 'Tốt, cần luyện thêm bài tập về lực ma sát',
            date: '05/11/2025',
            type: 'homework',
            semester: 1,
            status: 'good'
          },
          {
            id: '6',
            subject: 'Hóa học 9',
            assignment: 'Thí nghiệm - Phản ứng hóa học',
            score: 6.5,
            maxScore: 10,
            percentage: 65,
            grade: 'C+',
            teacher: 'Thầy Đức',
            comment: 'Cần cẩn thận hơn trong thao tác thí nghiệm',
            date: '03/11/2025',
            type: 'quiz',
            semester: 1,
            status: 'average'
          }
        ];

        const mockSummaries: SubjectSummary[] = [
          {
            subject: 'Toán 9',
            avgScore: 8.7,
            totalAssignments: 8,
            grade: 'A-',
            color: 'text-blue-600 bg-blue-50',
            trend: 'up',
            icon: '📐'
          },
          {
            subject: 'Vật lý 9',
            avgScore: 8.8,
            totalAssignments: 6,
            grade: 'A-',
            color: 'text-green-600 bg-green-50',
            trend: 'stable',
            icon: '⚛️'
          },
          {
            subject: 'Hóa học 9',
            avgScore: 7.4,
            totalAssignments: 5,
            grade: 'B',
            color: 'text-yellow-600 bg-yellow-50',
            trend: 'down',
            icon: '🧪'
          },
          {
            subject: 'Tiếng Anh 9',
            avgScore: 9.1,
            totalAssignments: 7,
            grade: 'A',
            color: 'text-purple-600 bg-purple-50',
            trend: 'up',
            icon: '🇬🇧'
          }
        ];

        setGrades(mockGrades);
        setSummaries(mockSummaries);
      } catch (err: any) {
        setError(err.message || 'Không thể tải bảng điểm');
      } finally {
        setLoading(false);
      }
    };

    loadTranscript();
  }, []);

  const filteredGrades = grades.filter(grade => 
    filter === 'all' || grade.type === filter
  );

  const overallAvg = summaries.reduce((acc, s) => acc + s.avgScore, 0) / summaries.length;
  const totalAssignments = grades.length;
  const excellentCount = grades.filter(g => g.percentage >= 90).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Đang tải bảng điểm...</p>
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
                <p className="text-red-600 text-sm mt-1">Không thể tải bảng điểm.</p>
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
        title="Bảng điểm - DMT Education"
        description="Xem điểm số và nhận xét từ giáo viên"
        keywords="điểm số, học tập, nhận xét"
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
                  <BarChart3 className="w-8 h-8 text-blue-600" />
                  Bảng điểm & Nhận xét
                </h1>
                <p className="text-gray-600">
                  Theo dõi kết quả học tập và phản hồi từ giáo viên
                </p>
              </div>
              <button className="px-4 py-2 bg-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-700 transition-all flex items-center gap-2 shadow-md">
                <Download className="w-4 h-4" />
                Xuất PDF
              </button>
            </div>

            {/* Overall Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{overallAvg.toFixed(1)}</p>
                    <p className="text-xs text-gray-600">Điểm TB</p>
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
                    <Trophy className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{excellentCount}</p>
                    <p className="text-xs text-gray-600">Điểm xuất sắc</p>
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
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{totalAssignments}</p>
                    <p className="text-xs text-gray-600">Bài đã chấm</p>
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
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{summaries.length}</p>
                    <p className="text-xs text-gray-600">Môn học</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Subject Summaries */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="w-6 h-6 text-blue-600" />
              Tổng kết môn học
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {summaries.map((summary, index) => (
                <motion.div
                  key={summary.subject}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + index * 0.05 }}
                >
                  <SubjectCard summary={summary} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-6"
          >
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {[
                { key: 'all', label: 'Tất cả', icon: Filter },
                { key: 'homework', label: 'Bài tập', icon: BookOpen },
                { key: 'quiz', label: 'Kiểm tra', icon: FileText },
                { key: 'midterm', label: 'Giữa kỳ', icon: Award },
                { key: 'final', label: 'Cuối kỳ', icon: Trophy }
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

          {/* Grade Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-blue-600" />
              Chi tiết điểm số ({filteredGrades.length})
            </h2>
            
            <AnimatePresence mode="wait">
              {filteredGrades.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-12 text-center"
                >
                  <FileText className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-2">Không có điểm nào</p>
                  <p className="text-gray-400 text-sm">Chưa có điểm trong danh mục này</p>
                </motion.div>
              ) : (
                <motion.div
                  key="grades-list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid gap-4"
                >
                  {filteredGrades.map((grade, index) => (
                    <motion.div
                      key={grade.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <GradeCard grade={grade} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Info Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-8 bg-blue-50 rounded-xl border border-blue-200 p-6"
          >
            <div className="flex items-start gap-3">
              <BarChart3 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Thống kê và phân tích</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Điểm được cập nhật ngay sau khi giáo viên chấm</li>
                  <li>• Nhận thông báo khi có điểm mới</li>
                  <li>• Xuất bảng điểm PDF để lưu trữ hoặc in ấn</li>
                  <li>• So sánh tiến độ với điểm trung bình lớp (nếu có)</li>
                  <li>• Xem biểu đồ xu hướng điểm số theo thời gian</li>
                </ul>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </>
  );
};

export default Transcript;