import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/solid';
import { ImageGenerator } from '../../utils/imageGenerator';
import { fadeInUp } from '../../utils/animations';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  course: string;
  avatar: string;
  content: string;
  date: string;
  achievement: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Nguyễn Minh Anh',
    role: 'Học sinh lớp 12',
    course: 'Toán THPT - Luyện thi THPT QG',
    avatar: '',
    content: 'Trung tâm DMT đã giúp con thay đổi hoàn toàn cách học Toán! Từ một học sinh trung bình, con đã đạt 9.5 điểm Toán trong kỳ thi THPT. Thầy giảng dạy rất tận tâm, bài tập phong phú và luôn hỗ trợ con 24/7.',
    date: 'Tháng 10, 2024',
    achievement: 'Đạt 9.5 điểm Toán THPT QG 2024'
  },
  {
    id: 2,
    name: 'Trần Văn Bình',
    role: 'Học sinh lớp 9',
    course: 'iSmart - Toán tư duy',
    avatar: '',
    content: 'iSmart thực sự là khóa học tuyệt vời! Con không chỉ học Toán mà còn phát triển tư duy logic và sáng tạo. Các bài tập thú vị giúp con yêu thích Toán hơn rất nhiều. Giờ con luôn tự tin khi làm bài.',
    date: 'Tháng 9, 2024',
    achievement: 'Giải Nhì Olympic Toán cấp Thành phố'
  },
  {
    id: 3,
    name: 'Lê Thị Cẩm Ly',
    role: 'Học sinh lớp 11',
    course: 'Ngữ Văn THPT',
    avatar: '',
    content: 'Cô giáo dạy Văn rất tâm huyết và hiểu rõ tâm lý học sinh. Từ việc phân tích tác phẩm đến kỹ năng làm bài nghị luận, con đều được hướng dẫn chi tiết. Điểm Văn của con đã từ 6 lên 8.5!',
    date: 'Tháng 8, 2024',
    achievement: 'Điểm Văn từ 6.0 lên 8.5 chỉ sau 3 tháng'
  },
  {
    id: 4,
    name: 'Phạm Quốc Đạt',
    role: 'Học sinh lớp 10',
    course: 'Tiếng Anh THPT',
    avatar: '',
    content: 'Sau 6 tháng học, con đã tự tin giao tiếp tiếng Anh và đạt band 6.5 IELTS. Thầy cô bản ngữ rất nhiệt tình, phương pháp giảng dạy hiệu quả và lớp học nhỏ giúp con có nhiều cơ hội thực hành.',
    date: 'Tháng 7, 2024',
    achievement: 'IELTS 6.5 ở tuổi 15'
  },
  {
    id: 5,
    name: 'Hoàng Thị Mai',
    role: 'Học sinh lớp 8',
    course: 'Toán THCS',
    avatar: '',
    content: 'Toán THCS tại DMT giúp con nắm vững kiến thức nền tảng! Từ hình học đến đại số, mọi thứ đều được giải thích rõ ràng và dễ hiểu. Thầy luôn kiên nhẫn giải đáp mọi thắc mắc của con.',
    date: 'Tháng 6, 2024',
    achievement: 'Học sinh giỏi Toán 3 năm liên tiếp'
  },
  {
    id: 6,
    name: 'Vũ Minh Tuấn',
    role: 'Học sinh lớp 9',
    course: 'Luyện thi vào lớp 10 chuyên',
    avatar: '',
    content: 'Khóa luyện thi vào lớp 10 chuyên rất chuyên sâu và bài bản! Từ Toán, Văn đến Tiếng Anh, tất cả đều được ôn tập kỹ lưỡng. Đề thi thử sát với đề thật giúp con tự tin hơn rất nhiều.',
    date: 'Tháng 5, 2024',
    achievement: 'Đỗ vào lớp 10 chuyên Toán - THPT Lê Hồng Phong'
  }
];

const TestimonialsSlider: React.FC = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Generate avatars
  const testimonialsWithAvatars = testimonials.map(testimonial => ({
    ...testimonial,
    avatar: ImageGenerator.generateAvatar(testimonial.name, 80)
  }));

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      handleNext();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonialsWithAvatars.length);
  };

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentIndex((prev) => 
      prev === 0 ? testimonialsWithAvatars.length - 1 : prev - 1
    );
  };

  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
      scale: 0.8
    })
  };

  const currentTestimonial = testimonialsWithAvatars[currentIndex];

  return (
    <section className="py-20 bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-pink-100 text-pink-600 rounded-full text-sm font-semibold mb-4">
            Học viên nói gì về chúng tôi
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Câu chuyện thành công
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hơn 2,000+ học viên đã thay đổi cuộc sống và đạt được thành tích xuất sắc cùng DMT Education
          </p>
        </motion.div>

        <div ref={ref} className="relative">
          {/* Main slider */}
          <div className="relative h-[500px] sm:h-[450px] flex items-center">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                  scale: { duration: 0.2 }
                }}
                className="absolute inset-0"
              >
                <div className="h-full flex items-center justify-center px-4">
                  <div className="max-w-4xl w-full">
                    {/* Card */}
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                      <div className="grid md:grid-cols-5 gap-0">
                        {/* Left side - Avatar & Info */}
                        <div className="md:col-span-2 bg-gradient-to-br from-red-600 to-rose-600 p-8 flex flex-col items-center justify-center text-white relative overflow-hidden">
                          {/* Pattern background */}
                          <div className="absolute inset-0 opacity-10">
                            <img
                              src={ImageGenerator.generatePatternBackground('circles', '#ffffff')}
                              alt="pattern"
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Content */}
                          <div className="relative z-10 text-center">
                            {/* Quote icon */}
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.2, type: "spring" }}
                              className="mb-6"
                            >
                              <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                </svg>
                              </div>
                            </motion.div>

                            {/* Avatar */}
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.3, type: "spring" }}
                              className="mb-4"
                            >
                              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden ring-4 ring-white/30 shadow-xl">
                                <img
                                  src={currentTestimonial.avatar}
                                  alt={currentTestimonial.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </motion.div>

                            {/* Name & Role */}
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4 }}
                            >
                              <h3 className="text-2xl font-bold mb-1">
                                {currentTestimonial.name}
                              </h3>
                              <p className="text-sm opacity-90 mb-2">
                                {currentTestimonial.role}
                              </p>
                              <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold">
                                {currentTestimonial.course}
                              </span>
                            </motion.div>
                          </div>
                        </div>

                        {/* Right side - Testimonial */}
                        <div className="md:col-span-3 p-8 flex flex-col justify-center">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                          >
                            {/* Content */}
                            <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                              "{currentTestimonial.content}"
                            </p>

                            {/* Achievement badge */}
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-4 border border-green-100">
                              <div className="flex items-start">
                                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                                <div>
                                  <div className="text-xs text-green-600 font-semibold mb-1">
                                    THÀNH TÍCH
                                  </div>
                                  <div className="text-sm text-gray-800 font-medium">
                                    {currentTestimonial.achievement}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Date */}
                            <p className="text-sm text-gray-500">
                              {currentTestimonial.date}
                            </p>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation arrows */}
            <button
              onClick={() => {
                handlePrevious();
                setIsAutoPlaying(false);
              }}
              className="absolute left-0 sm:-left-16 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-800 hover:bg-gradient-to-r hover:from-red-600 hover:to-rose-600 hover:text-white transition-all group"
            >
              <ChevronLeftIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>

            <button
              onClick={() => {
                handleNext();
                setIsAutoPlaying(false);
              }}
              className="absolute right-0 sm:-right-16 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-800 hover:bg-gradient-to-r hover:from-red-600 hover:to-rose-600 hover:text-white transition-all group"
            >
              <ChevronRightIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* Dots navigation */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonialsWithAvatars.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`transition-all ${
                  index === currentIndex
                    ? 'w-8 h-3 bg-gradient-to-r from-red-600 to-rose-600'
                    : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
                } rounded-full`}
              />
            ))}
          </div>

          {/* Auto-play indicator */}
          <div className="text-center mt-4">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              {isAutoPlaying ? '⏸️ Tạm dừng' : '▶️ Tự động phát'}
            </button>
          </div>
        </div>

        {/* Bottom stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-16 grid grid-cols-3 gap-8 text-center max-w-3xl mx-auto"
        >
          <div>
            <div className="text-3xl font-bold text-gray-900 mb-2">2,000+</div>
            <div className="text-sm text-gray-600">Học viên hài lòng</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900 mb-2">95%</div>
            <div className="text-sm text-gray-600">Tỷ lệ hoàn thành</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900 mb-2">90%</div>
            <div className="text-sm text-gray-600">Đạt mục tiêu học tập</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSlider;
