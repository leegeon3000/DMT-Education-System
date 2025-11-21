import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  AcademicCapIcon,
  BookOpenIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  UserGroupIcon,
  ArrowRightIcon,
  SparklesIcon,
  LightBulbIcon,
  TrophyIcon,
  ShieldCheckIcon,
  ChevronDownIcon,
  StarIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon,
  FaceFrownIcon,
  ExclamationTriangleIcon,
  MapIcon
} from '@heroicons/react/24/outline';
import { publicCoursesApi } from '../../services/publicApi';

interface Course {
  id: number;
  name: string;
  code: string;
  description?: string;
  price?: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration_weeks: number;
  total_sessions: number;
  category?: string;
  subjects?: { name: string; code: string };
  students?: number;
  thumbnail?: string;
  instructor?: string;
}

// Helper functions
const getCourseImage = (courseName: string): string => {
  const name = courseName.toLowerCase();
  
  if (name.includes('toán') && name.includes('thcs')) return 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=225&fit=crop';
  if (name.includes('toán') && name.includes('thpt')) return 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=400&h=225&fit=crop';
  if (name.includes('văn') && name.includes('thcs')) return 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=225&fit=crop';
  if (name.includes('văn') && name.includes('thpt')) return 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=225&fit=crop';
  if (name.includes('anh') && name.includes('thcs')) return 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=225&fit=crop';
  if (name.includes('anh') && (name.includes('thpt') || name.includes('ielts'))) return 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=225&fit=crop';
  if (name.includes('lý')) return 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400&h=225&fit=crop';
  if (name.includes('hóa')) return 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=225&fit=crop';
  if (name.includes('sinh')) return 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=400&h=225&fit=crop';
  
  return 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=225&fit=crop';
};

const getInstructorName = (subjectName: string): string => {
  const name = subjectName.toLowerCase();
  
  if (name.includes('toán')) return Math.random() > 0.5 ? 'Thầy Nguyễn Văn Hùng' : 'Cô Phạm Thị Lan';
  if (name.includes('văn')) return Math.random() > 0.5 ? 'Cô Trần Thị Mai' : 'Thầy Lê Minh Tuấn';
  if (name.includes('anh')) return Math.random() > 0.5 ? 'Ms. Nguyễn Hải Yến' : 'Mr. David Smith';
  if (name.includes('lý')) return Math.random() > 0.5 ? 'Thầy Vũ Quang Minh' : 'Cô Đỗ Thị Lan';
  if (name.includes('hóa')) return Math.random() > 0.5 ? 'Thầy Nguyễn Đức Anh' : 'Cô Trương Thị Hương';
  if (name.includes('sinh')) return Math.random() > 0.5 ? 'Cô Lê Thu Hà' : 'Thầy Phạm Quốc Huy';
  
  return 'Giảng viên DMT';
};

const EnhancedCoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await publicCoursesApi.getAll({ 
          page: 1, 
          limit: 50,
          is_active: true 
        });
        
        // Transform API data
        const transformedCourses = response.data.map((course: any) => ({
          ...course,
          students: Math.floor(Math.random() * 300) + 50,
          thumbnail: getCourseImage(course.subjects?.name || course.name),
          instructor: getInstructorName(course.subjects?.name || course.name),
          category: course.subjects?.code || 'general'
        }));
        
        setCourses(transformedCourses);
        console.log('✅ Courses loaded from database:', transformedCourses.length);
      } catch (error) {
        console.error('❌ Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Student problems data
  const studentProblems = [
    {
      icon: 'QuestionMarkCircleIcon',
      title: 'Không biết bắt đầu từ đâu',
      description: 'Kiến thức quá rộng, tài liệu quá nhiều, cần lộ trình rõ ràng hiệu quả'
    },
    {
      icon: 'BookOpenIcon',
      title: 'Phương pháp học chưa hiệu quả',
      description: 'Học tích lũy kiểu cũ tốn sức, gặp đề khó lại bí'
    },
    {
      icon: 'FaceFrownIcon',
      title: 'Kẹt điểm, mất động lực',
      description: 'Học hoài không tiến bộ, không tự tin, chán nản muốn bỏ cuộc'
    },
    {
      icon: 'ExclamationTriangleIcon',
      title: 'Không ai theo sát',
      description: 'Tự học không ai nhắc nhở, không ai chỉnh lỗi, không biết đúng sai'
    }
  ];

  // DMT Solutions
  const dmtSolutions = [
    {
      icon: 'MapIcon',
      title: 'Lộ trình cá nhân hóa, tinh gọn',
      description: 'Học trọng tâm, phát huy điểm mạnh khắc phục điểm yếu để tối đa điểm số',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: 'LightBulbIcon',
      title: 'Phương pháp dạy hiện đại',
      description: 'Học thông minh, học bản chất, giải quyết hiệu quả mọi vấn đề của người học',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: 'ChartBarIcon',
      title: 'Cam kết đầu ra rõ ràng',
      description: 'Tăng tối thiểu 1-1.5 điểm sau mỗi khóa học, đã học là đạt kết quả',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: 'AcademicCapIcon',
      title: 'Đội ngũ giáo viên tận tâm',
      description: 'Giáo viên giàu kinh nghiệm và công nghệ hỗ trợ đồng hành 24/7',
      color: 'from-orange-500 to-red-500'
    }
  ];

  // Learning paths
  const learningPaths = [
    {
      level: 'Xây nền',
      title: 'Xây dựng nền tảng',
      description: 'Xây nền từ đầu, làm quen định dạng bài học và tư duy học đúng từ gốc',
      duration: '9 tuần - 27 buổi',
      target: 'Phù hợp người mất gốc',
      output: 'Đầu ra 4.0-5.0 điểm',
      color: 'bg-blue-500',
      goals: [
        'Làm quen format bài học',
        'Học ngữ pháp, từ vựng nền tảng',
        'Luyện nghe - nói theo tình huống',
        'Tạo nền tư duy mạch lạc'
      ]
    },
    {
      level: 'Tăng tốc',
      title: 'Bứt phá kỹ năng',
      description: 'Bứt phá điểm số với phương pháp hiện đại - học sâu, rèn kỹ toàn diện',
      duration: '9 tuần - 27 buổi',
      target: 'Đầu vào 5.0 hoặc tương đương',
      output: 'Đầu ra 6.0-6.5 điểm',
      color: 'bg-purple-500',
      goals: [
        'Đảm bảo đầu ra 6.5+',
        'Nắm chắc dạng bài từng kỹ năng',
        'Luyện phản xạ ngôn ngữ tự nhiên',
        'Làm chủ từ vựng, cấu trúc học thuật'
      ]
    },
    {
      level: 'Về đích',
      title: 'Chinh phục đỉnh cao',
      description: 'Luyện đề chuyên sâu, tối ưu điểm để chinh phục đỉnh cao với tư duy học thuật',
      duration: '9 tuần - 27 buổi',
      target: 'Đầu vào 6.0 trở lên',
      output: 'Đầu ra 7.5+ điểm',
      color: 'bg-red-500',
      goals: [
        'Đảm bảo đầu ra 7.5+',
        'Tập trung viết luận mạch lạc, rõ ý',
        'Nâng phản biện và phát triển ý tưởng',
        'Thực hành chuyên sâu đề khó'
      ]
    }
  ];

  // Student reviews
  const studentReviews = [
    {
      name: 'Nguyễn Kim Thoa',
      role: 'Chuyên viên kế toán',
      avatar: 'https://ui-avatars.com/api/?name=Nguyen+Kim+Thoa&size=128&background=3b82f6&color=fff&rounded=true',
      rating: 5,
      review: 'Trước đây chị bị mất gốc tiếng Anh. Sau một buổi học ở DMT, chị có thể về nói một câu và tự tin là câu đó đúng ngữ pháp, đúng ý, đúng cấu trúc luôn.',
      score: '7.0 Overall'
    },
    {
      name: 'Đức Trí - Minh Trí',
      role: 'THPT Chuyên Lê Hồng Phong',
      avatar: 'https://ui-avatars.com/api/?name=Duc+Tri&size=128&background=10b981&color=fff&rounded=true',
      rating: 5,
      review: 'DMT dạy hay "không phải bàn"! Học ở DMT rất là vui, không ngại lặn lội đi học mỗi ngày. Một điều gì đó ở DMT đã tạo động lực cho em.',
      score: '8.0 Overall'
    },
    {
      name: 'Thanh Hà',
      role: 'Cựu sinh viên ĐH Ngoại Thương',
      avatar: 'https://ui-avatars.com/api/?name=Thanh+Ha&size=128&background=f59e0b&color=fff&rounded=true',
      rating: 5,
      review: 'Học Online rất tiện trong việc sắp xếp thời gian và công việc. Mình cũng được tiếp cận với những dạng bài trong các buổi học thêm cuối tuần miễn phí.',
      score: '8.0 Overall'
    }
  ];

  // FAQs
  const faqs = [
    {
      question: 'Phương pháp dạy tại DMT Education là gì?',
      answer: 'Phương pháp học tại DMT chú trọng tư duy, vận dụng; không phải học mẹo, học tủ. Mình học để hiểu rõ bản chất vấn đề, giúp học viên có lối tư duy ngôn ngữ logic, khoa học hơn.'
    },
    {
      question: 'Trước đây em chưa từng học thì có thể tham gia được không?',
      answer: 'Khóa học ở DMT sẽ hướng dẫn và giới thiệu từ đầu, nên học viên chưa từng tiếp xúc vẫn hoàn toàn có thể theo kịp.'
    },
    {
      question: 'Giáo viên tại DMT là ai?',
      answer: 'Là các thầy cô có bằng cấp chuyên môn từ 8.0 trở lên, giáo viên dạy chuyên về kỹ năng nào thì có điểm ở kỹ năng đó cao. Các thầy cô là những người trẻ nhiệt huyết và cực kỳ tâm lý với học viên.'
    },
    {
      question: 'Học tại DMT được đảm bảo đầu ra như thế nào?',
      answer: 'DMT có đảm bảo đầu ra, miễn là học viên thỏa đầu vào của lớp, đi học chuyên cần trên 90% số buổi học và làm đủ bài tập theo phương pháp. Nếu chưa đủ điểm đầu ra DMT sẽ xếp học lại miễn phí.'
    },
    {
      question: 'Nghỉ học có được học bù không?',
      answer: 'DMT hỗ trợ học bù trong trường hợp bất khả kháng (ốm đau, bệnh tật, các kỳ thi quan trọng). Để đảm bảo hiệu quả học, 1 khóa mình nghỉ tối đa 2 ngày.'
    }
  ];

  const formatPrice = (price?: number) => {
    if (!price) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 bg-gradient-to-br from-red-600 via-rose-600 to-pink-600 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Khóa học chất lượng cao
            </h1>
            <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto opacity-95">
              Các khóa học tại DMT Education luôn cam kết đảm bảo đầu ra cho học viên<br/>
              với phương pháp giảng dạy hiện đại và đội ngũ giáo viên tận tâm
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20"
              >
                <div className="text-3xl font-bold mb-1">1.5-2</div>
                <div className="text-sm opacity-90">Điểm cải thiện trung bình</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20"
              >
                <div className="text-3xl font-bold mb-1">1000+</div>
                <div className="text-sm opacity-90">Học viên đạt mục tiêu</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20"
              >
                <div className="text-3xl font-bold mb-1">100+</div>
                <div className="text-sm opacity-90">Học viên đạt điểm cao</div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={() => navigate('/contact')}
                className="px-8 py-4 bg-white text-red-600 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
              >
                Liên hệ tư vấn ngay
              </button>
              <button
                onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-red-600 transition-all"
              >
                Xem khóa học
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Problems Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-blue-700 mb-4">
              Vấn đề học viên thường gặp phải
            </h2>
            <p className="text-xl text-gray-600">
              Chúng tôi hiểu những khó khăn của bạn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {studentProblems.map((problem, index) => {
              const iconComponents: { [key: string]: any } = {
                'QuestionMarkCircleIcon': QuestionMarkCircleIcon,
                'BookOpenIcon': BookOpenIcon,
                'FaceFrownIcon': FaceFrownIcon,
                'ExclamationTriangleIcon': ExclamationTriangleIcon
              };
              const IconComponent = iconComponents[problem.icon];
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="w-16 h-16 mb-4 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <IconComponent className="w-10 h-10 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-700 mb-3">{problem.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{problem.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-blue-700 mb-4">
              Giải pháp của DMT Education
            </h2>
            <p className="text-xl text-gray-600">
              Phương pháp học tập hiện đại, hiệu quả vượt trội
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {dmtSolutions.map((solution, index) => {
              const iconComponents: { [key: string]: any } = {
                'MapIcon': MapIcon,
                'LightBulbIcon': LightBulbIcon,
                'ChartBarIcon': ChartBarIcon,
                'AcademicCapIcon': AcademicCapIcon
              };
              const IconComponent = iconComponents[solution.icon];
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${solution.color} opacity-10 rounded-2xl group-hover:opacity-20 transition-opacity`} />
                  <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border-2 border-gray-100 group-hover:border-transparent">
                    <div className={`w-16 h-16 mb-4 bg-gradient-to-r ${solution.color} rounded-2xl flex items-center justify-center`}>
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{solution.title}</h3>
                    <p className="text-gray-600 text-lg leading-relaxed">{solution.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Learning Paths Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-blue-700 mb-4">
              Lộ trình học tiêu chuẩn tại DMT
            </h2>
            <p className="text-xl text-gray-600">
              Ba cấp độ học tập từ cơ bản đến nâng cao
            </p>
          </div>

          <div className="space-y-8">
            {learningPaths.map((path, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white rounded-3xl shadow-xl overflow-hidden"
              >
                <div className="grid md:grid-cols-3 gap-8 p-8">
                  {/* Left: Level Badge */}
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className={`w-24 h-24 ${path.color} rounded-full flex items-center justify-center mb-4`}>
                      <span className="text-white text-4xl font-bold">{index + 1}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{path.level}</h3>
                    <p className="text-lg text-gray-600 font-semibold">{path.title}</p>
                    <p className="text-gray-500 mt-4">{path.description}</p>
                  </div>

                  {/* Middle: Goals */}
                  <div className="md:col-span-1">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <TrophyIcon className="w-6 h-6 mr-2 text-yellow-500" />
                      MỤC TIÊU
                    </h4>
                    <ul className="space-y-3">
                      {path.goals.map((goal, i) => (
                        <li key={i} className="flex items-start">
                          <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-1" />
                          <span className="text-gray-700">{goal}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right: Info */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="text-sm font-bold text-blue-600 mb-2 uppercase">Thông tin học tập</h4>
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-700">
                          <ClockIcon className="w-5 h-5 mr-2" />
                          <span>{path.duration}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <UserGroupIcon className="w-5 h-5 mr-2" />
                          <span>{path.target}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <ChartBarIcon className="w-5 h-5 mr-2" />
                          <span>{path.output}</span>
                        </div>
                      </div>
                    </div>
                    <button className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl font-bold hover:shadow-lg transition-all">
                      Tìm hiểu thêm
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Grid - Existing courses with id="courses" */}
      <section id="courses" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-blue-700 mb-4">
              Khóa học nổi bật
            </h2>
            <p className="text-xl text-gray-600">
              Chương trình đào tạo toàn diện từ cơ bản đến nâng cao
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.slice(0, 6).map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all group"
                >
                  <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-blue-600 font-bold text-sm">{formatPrice(course.price)}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="text-xs font-semibold text-blue-600 uppercase mb-2">{course.subjects?.name}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {course.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span className="flex items-center">
                        <ClockIcon className="w-4 h-4 mr-1" />
                        {course.duration_weeks} tuần
                      </span>
                      <span className="flex items-center">
                        <UserGroupIcon className="w-4 h-4 mr-1" />
                        {course.students || 0} HV
                      </span>
                    </div>
                    <button className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                      Đăng ký ngay
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/courses')}
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl font-bold hover:shadow-xl transition-all inline-flex items-center"
            >
              Xem tất cả khóa học
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* Student Reviews */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-blue-700 mb-4">
              Học viên nói gì khi học tại DMT
            </h2>
            <p className="text-xl text-gray-600">
              Hàng nghìn học viên hài lòng với chất lượng đào tạo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {studentReviews.map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex items-center mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed">"{review.review}"</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center">
                    <img 
                      src={review.avatar} 
                      alt={review.name}
                      className="w-12 h-12 rounded-full mr-3"
                    />
                    <div>
                      <div className="font-bold text-gray-900">{review.name}</div>
                      <div className="text-sm text-gray-500">{review.role}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">{review.score}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-blue-700 mb-4">
              Thắc mắc thường gặp
            </h2>
            <p className="text-xl text-gray-600">
              Giải đáp những câu hỏi phổ biến nhất
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-500 transition-colors"
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-bold text-gray-900 text-lg pr-4">{faq.question}</span>
                  <ChevronDownIcon
                    className={`w-6 h-6 text-blue-600 flex-shrink-0 transition-transform ${
                      expandedFAQ === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedFAQ === index && (
                  <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-red-600 via-rose-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Đăng ký test đầu vào miễn phí<br/>và nhận tư vấn
            </h2>
            <p className="text-xl mb-12 opacity-95">
              Để được tư vấn chi tiết về lộ trình học phù hợp, vui lòng liên hệ với chúng tôi
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:1800969639"
                className="px-8 py-4 bg-white text-red-600 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all inline-flex items-center justify-center"
              >
                <ChatBubbleLeftRightIcon className="w-6 h-6 mr-2" />
                Gọi điện liên hệ
              </a>
              <button
                onClick={() => navigate('/contact')}
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-red-600 transition-all inline-flex items-center justify-center"
              >
                <HeartIcon className="w-6 h-6 mr-2" />
                Nhận tư vấn qua email
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default EnhancedCoursesPage;
