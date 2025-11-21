import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  ClockIcon,
  UserGroupIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { ImageGenerator, IllustrationGenerator } from '../../utils/imageGenerator';
import { staggerContainer, staggerItem, cardHover } from '../../utils/animations';

interface Course {
  id: number;
  title: string;
  category: string;
  description: string;
  level: string;
  duration: string;
  students: number;
  price: number;
  instructor: string;
}

const courses: Course[] = [
  {
    id: 1,
    title: 'Toán THCS - Nền tảng vững chắc',
    category: 'math',
    description: 'Chương trình Toán cấp 2 toàn diện: Đại số, Hình học, ôn thi chuyển cấp',
    level: 'Cấp 2',
    duration: '9 tháng',
    students: 320,
    price: 2400000,
    instructor: 'Thầy Nguyễn Văn Hùng'
  },
  {
    id: 2,
    title: 'Toán THPT - Luyện thi đại học',
    category: 'math',
    description: 'Toán nâng cao cấp 3: Giải tích, Hình học không gian, luyện đề thi THPT',
    level: 'Cấp 3',
    duration: '10 tháng',
    students: 280,
    price: 3200000,
    instructor: 'Cô Phạm Thị Lan'
  },
  {
    id: 3,
    title: 'Ngữ Văn THCS - Kỹ năng đọc hiểu',
    category: 'literature',
    description: 'Phát triển tư duy văn học, kỹ năng làm bài văn nghị luận và tả',
    level: 'Cấp 2',
    duration: '9 tháng',
    students: 245,
    price: 2200000,
    instructor: 'Cô Trần Thị Mai'
  },
  {
    id: 4,
    title: 'Ngữ Văn THPT - Luyện thi chuyên sâu',
    category: 'literature',
    description: 'Phân tích tác phẩm văn học, kỹ năng làm bài luận, nghị luận xã hội',
    level: 'Cấp 3',
    duration: '10 tháng',
    students: 210,
    price: 2800000,
    instructor: 'Thầy Lê Minh Tuấn'
  },
  {
    id: 5,
    title: 'Tiếng Anh THCS - Giao tiếp cơ bản',
    category: 'english',
    description: 'Tiếng Anh giao tiếp, ngữ pháp, từ vựng theo chương trình cấp 2',
    level: 'Cấp 2',
    duration: '9 tháng',
    students: 380,
    price: 2600000,
    instructor: 'Ms. Nguyễn Hải Yến'
  },
  {
    id: 6,
    title: 'Tiếng Anh THPT - Luyện thi THPT & IELTS',
    category: 'english',
    description: 'Tiếng Anh nâng cao: Reading, Writing, Listening, Speaking, luyện đề',
    level: 'Cấp 3',
    duration: '10 tháng',
    students: 295,
    price: 3400000,
    instructor: 'Mr. David Smith'
  },
  {
    id: 7,
    title: 'iSmart - Toán tư duy sáng tạo',
    category: 'ismart',
    description: 'Phát triển tư duy logic, giải toán nâng cao qua phần mềm iSmart',
    level: 'Cấp 2 & 3',
    duration: '6 tháng',
    students: 156,
    price: 1800000,
    instructor: 'Thầy Hoàng Đức Minh'
  },
  {
    id: 8,
    title: 'Luyện thi học sinh giỏi Toán',
    category: 'math',
    description: 'Chuyên đề nâng cao, bồi dưỡng học sinh giỏi cấp tỉnh, quốc gia',
    level: 'Nâng cao',
    duration: '8 tháng',
    students: 85,
    price: 4200000,
    instructor: 'Thầy Phan Văn Thành'
  },
  {
    id: 9,
    title: 'Luyện thi vào lớp 10 chuyên',
    category: 'exam',
    description: 'Ôn luyện chuyên sâu Toán, Văn, Anh để vào các trường chuyên',
    level: 'Cấp 2',
    duration: '7 tháng',
    students: 165,
    price: 3800000,
    instructor: 'Cô Nguyễn Thị Hà'
  }
];

const CoursesShowcase: React.FC = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm font-semibold mb-4">
            Khóa học nổi bật
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Các khóa học THCS & THPT
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Chương trình học chất lượng cao cho học sinh cấp 2 và cấp 3 với đội ngũ giáo viên giỏi, phương pháp hiện đại
          </p>
        </motion.div>

        {/* Courses grid */}
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {courses.map((course, index) => {
            // Map each course to a unique image URL
            const thumbnailMap: Record<number, string> = {
              1: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=225&fit=crop', // Toán THCS - Math formulas
              2: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=400&h=225&fit=crop', // Toán THPT - Advanced math
              3: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=225&fit=crop', // Văn THCS - Books and writing
              4: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=225&fit=crop', // Văn THPT - Literature books
              5: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=225&fit=crop', // Anh THCS - English learning
              6: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=225&fit=crop', // Anh THPT - English books
              7: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=225&fit=crop', // iSmart - Technology learning
              8: 'https://images.unsplash.com/photo-1596496050827-8299e0220de1?w=400&h=225&fit=crop', // HSG Toán - Advanced math trophy
              9: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=225&fit=crop'  // Luyện thi lớp 10 chuyên - Students studying for entrance exam
            };
            
            const thumbnail = thumbnailMap[course.id] || ImageGenerator.generateCourseThumbnail(
              course.category,
              course.title,
              400,
              225
            );

            return (
              <motion.div
                key={course.id}
                variants={staggerItem}
                initial="rest"
                whileHover="hover"
                animate="rest"
                className="group relative"
              >
                {/* Card */}
                <motion.div
                  variants={cardHover}
                  className="relative h-full bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 flex flex-col"
                >
                  {/* Thumbnail */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Level badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 rounded-full text-xs font-semibold shadow-lg">
                        {course.level}
                      </span>
                    </div>

                    {/* Price tag */}
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full text-xs font-bold shadow-lg">
                        {formatPrice(course.price)}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 flex flex-col">
                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                      {course.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                      {course.description}
                    </p>

                    {/* Instructor */}
                    <div className="flex items-center mb-4 pb-4 border-b border-gray-100">
                      <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                        <img
                          src={ImageGenerator.generateAvatar(course.instructor, 32)}
                          alt={course.instructor}
                          className="w-full h-full"
                        />
                      </div>
                      <span className="text-sm text-gray-700 font-medium">
                        {course.instructor}
                      </span>
                    </div>

                    {/* Meta info */}
                    <div className="flex items-center justify-around text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <ClockIcon className="w-4 h-4 mr-1" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <UserGroupIcon className="w-4 h-4 mr-1" />
                        <span>{course.students} học viên</span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center group-hover:from-rose-600 group-hover:to-red-600"
                    >
                      Đăng ký ngay
                      <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </div>

                  {/* Hover gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </motion.div>

                {/* Glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-rose-500 rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300 -z-10" />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <motion.a
            href="/courses"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Xem tất cả các lớp học
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default CoursesShowcase;
