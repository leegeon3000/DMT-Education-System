import React, { useState, useEffect } from 'react';
// @ts-ignore - Framer Motion types issue
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  BookOpenIcon,
  ClockIcon,
  UserGroupIcon,
  ArrowRightIcon,
  FunnelIcon,
  XMarkIcon,
  AcademicCapIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { ImageGenerator } from '../../utils/imageGenerator';
import { fadeInUp, staggerContainer, staggerItem } from '../../utils/animations';
import { publicCoursesApi, type PublicCourse } from '../../services/publicApi';
import Loader from '../common/Loader';

interface Course {
  id: number;
  name: string;
  code: string;
  description?: string;
  price?: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration_weeks: number;
  total_sessions: number;
  is_active: boolean;
  category?: string;
  subjects?: {
    id?: number;
    name: string;
    code: string;
    description?: string;
  };
  students?: number;
  thumbnail?: string;
  instructor?: string;
  created_at?: string;
}

const categories = [
  { id: 'all', name: 'Tất cả', icon: SparklesIcon },
  { id: 'science', name: 'Khoa học', icon: BookOpenIcon },
  { id: 'language', name: 'Ngoại ngữ', icon: AcademicCapIcon },
  { id: 'math', name: 'Toán học', icon: ClockIcon },
  { id: 'literature', name: 'Văn học', icon: UserGroupIcon },
];

const levels = [
  { id: 'all', name: 'Tất cả trình độ' },
  { id: 'beginner', name: 'Cơ bản' },
  { id: 'intermediate', name: 'Trung cấp' },
  { id: 'advanced', name: 'Nâng cao' },
];

const priceRanges = [
  { id: 'all', name: 'Tất cả' },
  { id: 'free', name: 'Miễn phí' },
  { id: 'under2m', name: 'Dưới 2 triệu' },
  { id: '2to5m', name: '2-5 triệu' },
  { id: 'above5m', name: 'Trên 5 triệu' },
];

// Helper functions to map subjects to categories and get images
const getCategoryFromSubject = (subjectCode?: string): string => {
  if (!subjectCode) return 'programming';
  
  const code = subjectCode.toUpperCase();
  if (code.includes('MATH') || code.includes('PHY') || code.includes('CHEM') || code.includes('BIO')) return 'math';
  if (code.includes('ENG') || code.includes('LIT') || code.includes('HIST') || code.includes('GEO') || code.includes('CIVIC')) return 'language';
  return 'programming';
};

const getCourseImage = (courseName: string): string => {
  const name = courseName.toLowerCase();
  
  if (name.includes('toán') && name.includes('thcs')) return 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=225&fit=crop';
  if (name.includes('toán') && name.includes('thpt')) return 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=400&h=225&fit=crop';
  if (name.includes('văn') && name.includes('thcs')) return 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=225&fit=crop';
  if (name.includes('văn') && name.includes('thpt')) return 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=225&fit=crop';
  if (name.includes('anh') && name.includes('thcs')) return 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=225&fit=crop';
  if (name.includes('anh') && (name.includes('thpt') || name.includes('ielts'))) return 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=225&fit=crop';
  if (name.includes('ismart')) return 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=225&fit=crop';
  if (name.includes('giỏi')) return 'https://images.unsplash.com/photo-1596496050827-8299e0220de1?w=400&h=225&fit=crop';
  if (name.includes('lớp 10')) return 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=225&fit=crop';
  if (name.includes('lý') && name.includes('thcs')) return 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400&h=225&fit=crop';
  if (name.includes('lý') && name.includes('thpt')) return 'https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=400&h=225&fit=crop';
  if (name.includes('hóa') && name.includes('thcs')) return 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=225&fit=crop';
  if (name.includes('hóa') && name.includes('thpt')) return 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=400&h=225&fit=crop';
  if (name.includes('sinh') && name.includes('thcs')) return 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=400&h=225&fit=crop';
  if (name.includes('sinh') && name.includes('thpt')) return 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&h=225&fit=crop';
  if (name.includes('sử')) return 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400&h=225&fit=crop';
  if (name.includes('địa')) return 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=400&h=225&fit=crop';
  if (name.includes('gdcd')) return 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=225&fit=crop';
  
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
  if (name.includes('sử')) return 'Thầy Hoàng Văn Nam';
  if (name.includes('địa')) return 'Cô Bùi Thị Ngọc';
  if (name.includes('gdcd')) return 'Thầy Trần Minh Đức';
  
  return 'Giảng viên DMT';
};

// Legacy mock courses data - will be removed after API integration
const mockCourses: Course[] = [
  {
    id: 1,
    name: 'Toán THCS - Nền tảng vững chắc',
    code: 'MATH-THCS',
    description: 'Chương trình Toán cấp 2 toàn diện: Đại số, Hình học, ôn thi chuyển cấp',
    price: 2400000,
    level: 'intermediate',
    duration_weeks: 36,
    total_sessions: 108,
    is_active: true,
    category: 'math',
    students: 320,
    subjects: { name: 'Toán học', code: 'MATH' },
    instructor: 'Thầy Nguyễn Văn Hùng',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=225&fit=crop'
  },
  {
    id: 2,
    name: 'Toán THPT - Luyện thi đại học',
    code: 'MATH-THPT',
    description: 'Toán nâng cao cấp 3: Giải tích, Hình học không gian, luyện đề thi THPT',
    price: 3200000,
    level: 'advanced',
    duration_weeks: 40,
    total_sessions: 120,
    is_active: true,
    category: 'math',
    students: 280,
    subjects: { name: 'Toán học', code: 'MATH' },
    instructor: 'Cô Phạm Thị Lan',
    thumbnail: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=400&h=225&fit=crop'
  },
  {
    id: 3,
    name: 'Ngữ Văn THCS - Kỹ năng đọc hiểu',
    code: 'LIT-THCS',
    description: 'Phát triển tư duy văn học, kỹ năng làm bài văn nghị luận và tả',
    price: 2200000,
    level: 'intermediate',
    duration_weeks: 36,
    total_sessions: 108,
    is_active: true,
    category: 'language',
    students: 245,
    subjects: { name: 'Ngữ Văn', code: 'LIT' },
    instructor: 'Cô Trần Thị Mai',
    thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=225&fit=crop'
  },
  {
    id: 4,
    name: 'Ngữ Văn THPT - Luyện thi chuyên sâu',
    code: 'LIT-THPT',
    description: 'Phân tích tác phẩm văn học, kỹ năng làm bài luận, nghị luận xã hội',
    price: 2800000,
    level: 'advanced',
    duration_weeks: 40,
    total_sessions: 120,
    is_active: true,
    category: 'language',
    students: 210,
    subjects: { name: 'Ngữ Văn', code: 'LIT' },
    instructor: 'Thầy Lê Minh Tuấn',
    thumbnail: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=225&fit=crop'
  },
  {
    id: 5,
    name: 'Tiếng Anh THCS - Giao tiếp cơ bản',
    code: 'ENG-THCS',
    description: 'Tiếng Anh giao tiếp, ngữ pháp, từ vựng theo chương trình cấp 2',
    price: 2600000,
    level: 'beginner',
    duration_weeks: 36,
    total_sessions: 108,
    is_active: true,
    category: 'language',
    students: 380,
    subjects: { name: 'Tiếng Anh', code: 'ENG' },
    instructor: 'Ms. Nguyễn Hải Yến',
    thumbnail: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=225&fit=crop'
  },
  {
    id: 6,
    name: 'Tiếng Anh THPT - Luyện thi THPT & IELTS',
    code: 'ENG-THPT',
    description: 'Tiếng Anh nâng cao: Reading, Writing, Listening, Speaking, luyện đề',
    price: 3400000,
    level: 'advanced',
    duration_weeks: 40,
    total_sessions: 120,
    is_active: true,
    category: 'language',
    students: 295,
    subjects: { name: 'Tiếng Anh', code: 'ENG' },
    instructor: 'Mr. David Smith',
    thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=225&fit=crop'
  },
  {
    id: 7,
    name: 'iSmart - Toán tư duy sáng tạo',
    code: 'ISMART-101',
    description: 'Phát triển tư duy logic, giải toán nâng cao qua phần mềm iSmart',
    price: 1800000,
    level: 'intermediate',
    duration_weeks: 24,
    total_sessions: 72,
    is_active: true,
    category: 'programming',
    students: 156,
    subjects: { name: 'iSmart', code: 'ISMART' },
    instructor: 'Thầy Hoàng Đức Minh',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=225&fit=crop'
  },
  {
    id: 8,
    name: 'Luyện thi học sinh giỏi Toán',
    code: 'MATH-HSG',
    description: 'Chuyên đề nâng cao, bồi dưỡng học sinh giỏi cấp tỉnh, quốc gia',
    price: 4200000,
    level: 'advanced',
    duration_weeks: 32,
    total_sessions: 96,
    is_active: true,
    category: 'math',
    students: 85,
    subjects: { name: 'Toán học', code: 'MATH' },
    instructor: 'Thầy Phan Văn Thành',
    thumbnail: 'https://images.unsplash.com/photo-1596496050827-8299e0220de1?w=400&h=225&fit=crop'
  },
  {
    id: 9,
    name: 'Luyện thi vào lớp 10 chuyên',
    code: 'EXAM-L10',
    description: 'Ôn luyện chuyên sâu Toán, Văn, Anh để vào các trường chuyên',
    price: 3800000,
    level: 'advanced',
    duration_weeks: 28,
    total_sessions: 84,
    is_active: true,
    category: 'math',
    students: 165,
    subjects: { name: 'Luyện thi', code: 'EXAM' },
    instructor: 'Cô Nguyễn Thị Hà',
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=225&fit=crop'
  },
  {
    id: 10,
    name: 'Vật Lý THCS - Khám phá thế giới tự nhiên',
    code: 'PHY-THCS',
    description: 'Vật lý cơ bản: Cơ học, Nhiệt học, Điện học, thí nghiệm thực hành',
    price: 2300000,
    level: 'beginner',
    duration_weeks: 36,
    total_sessions: 108,
    is_active: true,
    category: 'math',
    students: 198,
    subjects: { name: 'Vật Lý', code: 'PHY' },
    instructor: 'Thầy Vũ Quang Minh',
    thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400&h=225&fit=crop'
  },
  {
    id: 11,
    name: 'Vật Lý THPT - Luyện thi đại học',
    code: 'PHY-THPT',
    description: 'Vật lý nâng cao: Điện từ học, Dao động sóng, Quang học, Hạt nhân',
    price: 3100000,
    level: 'advanced',
    duration_weeks: 40,
    total_sessions: 120,
    is_active: true,
    category: 'math',
    students: 172,
    subjects: { name: 'Vật Lý', code: 'PHY' },
    instructor: 'Cô Đỗ Thị Lan',
    thumbnail: 'https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=400&h=225&fit=crop'
  },
  {
    id: 12,
    name: 'Hóa Học THCS - Nền tảng cơ bản',
    code: 'CHEM-THCS',
    description: 'Hóa học cấp 2: Nguyên tử, phân tử, phản ứng hóa học, thí nghiệm',
    price: 2400000,
    level: 'beginner',
    duration_weeks: 36,
    total_sessions: 108,
    is_active: true,
    category: 'math',
    students: 215,
    subjects: { name: 'Hóa Học', code: 'CHEM' },
    instructor: 'Thầy Nguyễn Đức Anh',
    thumbnail: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=225&fit=crop'
  },
  {
    id: 13,
    name: 'Hóa Học THPT - Luyện thi chuyên sâu',
    code: 'CHEM-THPT',
    description: 'Hóa học hữu cơ, vô cơ, phân tích, giải bài tập nâng cao',
    price: 3300000,
    level: 'advanced',
    duration_weeks: 40,
    total_sessions: 120,
    is_active: true,
    category: 'math',
    students: 189,
    subjects: { name: 'Hóa Học', code: 'CHEM' },
    instructor: 'Cô Trương Thị Hương',
    thumbnail: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=400&h=225&fit=crop'
  },
  {
    id: 14,
    name: 'Sinh Học THCS - Khám phá sự sống',
    code: 'BIO-THCS',
    description: 'Sinh học cơ bản: Tế bào, cơ thể người, thực vật, động vật',
    price: 2100000,
    level: 'beginner',
    duration_weeks: 36,
    total_sessions: 108,
    is_active: true,
    category: 'math',
    students: 203,
    subjects: { name: 'Sinh Học', code: 'BIO' },
    instructor: 'Cô Lê Thu Hà',
    thumbnail: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=400&h=225&fit=crop'
  },
  {
    id: 15,
    name: 'Sinh Học THPT - Di truyền & Tiến hóa',
    code: 'BIO-THPT',
    description: 'Sinh học phân tử, di truyền học, tiến hóa, sinh thái học',
    price: 2900000,
    level: 'advanced',
    duration_weeks: 40,
    total_sessions: 120,
    is_active: true,
    category: 'math',
    students: 167,
    subjects: { name: 'Sinh Học', code: 'BIO' },
    instructor: 'Thầy Phạm Quốc Huy',
    thumbnail: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&h=225&fit=crop'
  },
  {
    id: 16,
    name: 'Lịch Sử Việt Nam - Truyền thống dân tộc',
    code: 'HIST-VN',
    description: 'Lịch sử Việt Nam từ xa xưa đến hiện đại, các mốc lịch sử quan trọng',
    price: 2000000,
    level: 'intermediate',
    duration_weeks: 36,
    total_sessions: 108,
    is_active: true,
    category: 'language',
    students: 143,
    subjects: { name: 'Lịch Sử', code: 'HIST' },
    instructor: 'Thầy Hoàng Văn Nam',
    thumbnail: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400&h=225&fit=crop'
  },
  {
    id: 17,
    name: 'Địa Lý Việt Nam & Thế Giới',
    code: 'GEO-101',
    description: 'Địa lý tự nhiên, kinh tế, xã hội Việt Nam và các châu lục',
    price: 2200000,
    level: 'intermediate',
    duration_weeks: 36,
    total_sessions: 108,
    is_active: true,
    category: 'language',
    students: 176,
    subjects: { name: 'Địa Lý', code: 'GEO' },
    instructor: 'Cô Bùi Thị Ngọc',
    thumbnail: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=400&h=225&fit=crop'
  },
  {
    id: 18,
    name: 'GDCD - Kỹ năng sống',
    code: 'CIVIC-101',
    description: 'Giáo dục công dân, kỹ năng sống, tư duy phản biện, đạo đức',
    price: 1500000,
    level: 'beginner',
    duration_weeks: 24,
    total_sessions: 72,
    is_active: true,
    category: 'language',
    students: 128,
    subjects: { name: 'GDCD', code: 'CIVIC' },
    instructor: 'Thầy Trần Minh Đức',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=225&fit=crop'
  }
];

const ModernCoursesPage: React.FC = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        
        // Try to load from API first (public endpoint - no auth required)
        try {
          const response = await publicCoursesApi.getAll({ 
            page: 1, 
            limit: 50, // Giảm limit xuống để load nhanh hơn
            is_active: true 
          });
          
          // Transform API data to match our Course interface
          const transformedCourses: Course[] = response.data.map((course: any) => ({
            ...course,
            students: Math.floor(Math.random() * 300) + 50, // Mock student count for now
            thumbnail: getCourseImage(course.subjects?.name || course.name),
            instructor: getInstructorName(course.subjects?.name || course.name),
            category: getCategoryFromSubject(course.subjects?.code)
          }));
          
          setCourses(transformedCourses);
          setFilteredCourses(transformedCourses);
        } catch (apiErr: any) {
          // Nếu API lỗi (chưa login hoặc lỗi khác), fallback về mock data
          console.warn('API error, using mock data:', apiErr.message);
          setCourses(mockCourses);
          setFilteredCourses(mockCourses);
        }
      } catch (err: any) {
        console.error('Error loading courses:', err);
        setError(err.message || 'Không thể tải danh sách khóa học');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filter courses
  useEffect(() => {
    let filtered = courses;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(course =>
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    // Level filter
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(course => course.level === selectedLevel);
    }

    // Price filter
    if (selectedPriceRange !== 'all') {
      filtered = filtered.filter(course => {
        const price = course.price || 0;
        switch (selectedPriceRange) {
          case 'free': return price === 0;
          case 'under2m': return price > 0 && price < 2000000;
          case '2to5m': return price >= 2000000 && price <= 5000000;
          case 'above5m': return price > 5000000;
          default: return true;
        }
      });
    }

    setFilteredCourses(filtered);
  }, [searchQuery, selectedCategory, selectedLevel, selectedPriceRange, courses]);

  const formatPrice = (price?: number) => {
    if (!price) return 'Miễn phí';
    return `${(price / 1000000).toFixed(1)}tr`;
  };

  const getLevelBadge = (level: string) => {
    const badges = {
      beginner: { text: 'Cơ bản', color: 'bg-green-100 text-green-700' },
      intermediate: { text: 'Trung cấp', color: 'bg-yellow-100 text-yellow-700' },
      advanced: { text: 'Nâng cao', color: 'bg-red-100 text-red-700' },
    };
    return badges[level as keyof typeof badges] || badges.beginner;
  };

  // Skeleton card component
  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-6">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-full mb-4" />
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-4" />
        <div className="flex gap-4 mb-4">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-4 bg-gray-200 rounded w-1/4" />
        </div>
        <div className="h-10 bg-gray-200 rounded" />
      </div>
    </div>
  );

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không thể tải khóa học</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-12 bg-gradient-to-br from-red-600 via-rose-600 to-pink-600 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full mb-4"
            >
              <SparklesIcon className="w-4 h-4 mr-1.5" />
              <span className="text-xs font-semibold">{courses.length}+ khóa học</span>
            </motion.div>

            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              Khóa học phù hợp với bạn
            </h1>

            <p className="text-base text-white/90 max-w-xl mx-auto mb-6">
              Chương trình đào tạo từ cơ bản đến nâng cao
            </p>

            {/* Search bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm khóa học..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-5 py-3 pl-12 bg-white rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/50 shadow-xl"
                />
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center gap-1.5"
                >
                  <FunnelIcon className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm">Lọc</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories Tabs */}
      <section className="sticky top-16 lg:top-20 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 py-4 overflow-x-auto scrollbar-hide">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-red-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Filters Sidebar (Mobile) */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={() => setShowFilters(false)}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Bộ lọc</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Level Filter */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Trình độ</h4>
              <div className="space-y-2">
                {levels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setSelectedLevel(level.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      selectedLevel === level.id
                        ? 'bg-red-100 text-red-700 font-semibold'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {level.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Mức giá</h4>
              <div className="space-y-2">
                {priceRanges.map((range) => (
                  <button
                    key={range.id}
                    onClick={() => setSelectedPriceRange(range.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      selectedPriceRange === range.id
                        ? 'bg-red-100 text-red-700 font-semibold'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {range.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedLevel('all');
                setSelectedPriceRange('all');
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Xóa tất cả bộ lọc
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {/* Filters Sidebar (Desktop) */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-32 bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <AdjustmentsHorizontalIcon className="w-6 h-6 text-red-600" />
                  Bộ lọc
                </h3>

                {/* Level Filter */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Trình độ</h4>
                  <div className="space-y-2">
                    {levels.map((level) => (
                      <button
                        key={level.id}
                        onClick={() => setSelectedLevel(level.id)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                          selectedLevel === level.id
                            ? 'bg-red-100 text-red-700 font-semibold'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {level.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Mức giá</h4>
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <button
                        key={range.id}
                        onClick={() => setSelectedPriceRange(range.id)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                          selectedPriceRange === range.id
                            ? 'bg-red-100 text-red-700 font-semibold'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {range.name}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedLevel('all');
                    setSelectedPriceRange('all');
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            </div>

            {/* Course Cards Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  {filteredCourses.length} khóa học
                </h2>
              </div>

              <motion.div
                ref={ref}
                variants={staggerContainer}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {loading ? (
                  // Show skeleton cards while loading
                  Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))
                ) : filteredCourses.map((course, index) => {
                  const levelBadge = getLevelBadge(course.level);
                  const thumbnail = ImageGenerator.generateCourseThumbnail(
                    course.subjects?.name || 'Course',
                    course.category || 'general'
                  );

                  return (
                    <motion.div
                      key={course.id}
                      variants={staggerItem}
                      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                    >
                      {/* Thumbnail */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={course.thumbnail || thumbnail}
                          alt={course.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        
                        {/* Level Badge */}
                        <div className="absolute top-4 left-4">
                          <span className={`px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold shadow-lg text-gray-900`}>
                            {levelBadge.text}
                          </span>
                        </div>

                        {/* Price */}
                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full text-xs font-bold shadow-lg">
                            {formatPrice(course.price)}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex flex-col h-[360px]">
                        <div className="mb-3">
                          <span className="text-xs font-semibold text-red-600 uppercase tracking-wide">
                            {course.subjects?.name}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors min-h-[56px]">
                          {course.name}
                        </h3>

                        <p className="text-sm text-gray-600 mb-4 line-clamp-3 min-h-[60px]">
                          {course.description}
                        </p>

                        {/* Instructor */}
                        {course.instructor && (
                          <div className="flex items-center mb-4 pb-4 border-b border-gray-100">
                            <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                              <img
                                src={ImageGenerator.generateAvatar(course.instructor, 32)}
                                alt={course.instructor}
                                className="w-full h-full"
                              />
                            </div>
                            <span className="text-sm text-gray-700 font-medium truncate">
                              {course.instructor}
                            </span>
                          </div>
                        )}

                        {/* Stats */}
                        <div className="flex items-center justify-around text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <ClockIcon className="w-4 h-4" />
                            <span>{course.duration_weeks} tuần</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <UserGroupIcon className="w-4 h-4" />
                            <span>{course.students || 0} học viên</span>
                          </div>
                        </div>

                        {/* CTA Button - Always at bottom */}
                        <div className="mt-auto">
                          <button className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group-hover:from-rose-600 group-hover:to-red-600">
                            Đăng ký ngay
                            <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </div>

                      {/* Hover gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      
                      {/* Hover glow effect */}
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-rose-500 rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300 -z-10" />
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* No results */}
              {!loading && filteredCourses.length === 0 && (
                <div className="text-center py-16">
                  <BookOpenIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Không tìm thấy khóa học nào
                  </h3>
                  <p className="text-gray-600">
                    Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ModernCoursesPage;
