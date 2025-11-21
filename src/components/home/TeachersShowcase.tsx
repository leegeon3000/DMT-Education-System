import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  AcademicCapIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import {
  EnvelopeIcon,
  PhoneIcon
} from '@heroicons/react/24/solid';
import { ImageGenerator, IllustrationGenerator } from '../../utils/imageGenerator';
import { staggerContainer, staggerItem, cardHover } from '../../utils/animations';

interface Teacher {
  id: number;
  name: string;
  role: 'teacher' | 'student' | 'graduate';
  title: string;
  subject: string;
  experience: string;
  students: number;
  courses: number;
  specialties: string[];
  email: string;
  phone: string;
  bio: string;
}

const teachers: Teacher[] = [
  {
    id: 1,
    name: 'Thầy Nguyễn Văn Hùng',
    role: 'teacher',
    title: 'Giáo viên Toán THCS',
    subject: 'Toán học cấp 2',
    experience: '15 năm',
    students: 320,
    courses: 8,
    specialties: ['Đại số', 'Hình học', 'Số học', 'Ôn thi chuyển cấp'],
    email: 'hung.nguyen@dmt.edu',
    phone: '0123 456 789',
    bio: 'Giáo viên Toán THCS với 15 năm kinh nghiệm, chuyên bồi dưỡng học sinh giỏi cấp huyện và tỉnh'
  },
  {
    id: 2,
    name: 'Cô Phạm Thị Lan',
    role: 'teacher',
    title: 'Giáo viên Toán THPT',
    subject: 'Toán học cấp 3',
    experience: '12 năm',
    students: 280,
    courses: 10,
    specialties: ['Giải tích', 'Hình học không gian', 'Luyện đề THPT', 'Đại số'],
    email: 'lan.pham@dmt.edu',
    phone: '0123 456 790',
    bio: 'Thạc sĩ Toán học, chuyên luyện thi THPT Quốc gia, nhiều học sinh đạt điểm 9-10'
  },
  {
    id: 3,
    name: 'Cô Trần Thị Mai',
    role: 'teacher',
    title: 'Giáo viên Ngữ Văn THCS',
    subject: 'Ngữ Văn cấp 2',
    experience: '10 năm',
    students: 245,
    courses: 7,
    specialties: ['Văn nghị luận', 'Văn tả', 'Đọc hiểu', 'Làm văn'],
    email: 'mai.tran@dmt.edu',
    phone: '0123 456 791',
    bio: 'Giáo viên Ngữ Văn nhiệt huyết, giúp học sinh yêu thích môn Văn và viết văn hay'
  },
  {
    id: 4,
    name: 'Thầy Lê Minh Tuấn',
    role: 'teacher',
    title: 'Giáo viên Ngữ Văn THPT',
    subject: 'Ngữ Văn cấp 3',
    experience: '14 năm',
    students: 210,
    courses: 9,
    specialties: ['Phân tích tác phẩm', 'Nghị luận xã hội', 'Luyện đề THPT', 'Văn học'],
    email: 'tuan.le@dmt.edu',
    phone: '0123 456 792',
    bio: 'Giáo viên giỏi cấp tỉnh, chuyên phân tích văn học và kỹ năng làm bài thi THPT'
  },
  {
    id: 5,
    name: 'Ms. Nguyễn Hải Yến',
    role: 'teacher',
    title: 'Giáo viên Tiếng Anh THCS',
    subject: 'Tiếng Anh cấp 2',
    experience: '9 năm',
    students: 380,
    courses: 8,
    specialties: ['Giao tiếp', 'Ngữ pháp', 'Từ vựng', 'Luyện nghe nói'],
    email: 'yen.nguyen@dmt.edu',
    phone: '0123 456 793',
    bio: 'Giáo viên Tiếng Anh với phương pháp giảng dạy sinh động, giúp học sinh tự tin giao tiếp'
  },
  {
    id: 6,
    name: 'Mr. David Smith',
    role: 'teacher',
    title: 'Giáo viên Tiếng Anh THPT',
    subject: 'Tiếng Anh cấp 3',
    experience: '8 năm',
    students: 295,
    courses: 6,
    specialties: ['IELTS', 'THPT Quốc gia', 'Reading', 'Writing'],
    email: 'david.smith@dmt.edu',
    phone: '0123 456 794',
    bio: 'Giáo viên bản ngữ với chứng chỉ TESOL, chuyên luyện thi THPT và IELTS'
  },
  {
    id: 7,
    name: 'Thầy Hoàng Đức Minh',
    role: 'teacher',
    title: 'Giáo viên iSmart',
    subject: 'Toán tư duy iSmart',
    experience: '6 năm',
    students: 156,
    courses: 5,
    specialties: ['Tư duy logic', 'Toán nâng cao', 'iSmart', 'Giải toán sáng tạo'],
    email: 'minh.hoang@dmt.edu',
    phone: '0123 456 795',
    bio: 'Chuyên gia đào tạo iSmart, phát triển tư duy toán học sáng tạo cho học sinh'
  },
  {
    id: 8,
    name: 'Thầy Phan Văn Thành',
    role: 'teacher',
    title: 'Giáo viên HSG Toán',
    subject: 'Toán học sinh giỏi',
    experience: '18 năm',
    students: 85,
    courses: 12,
    specialties: ['Toán HSG', 'Olimpic', 'Chuyên đề nâng cao', 'Bồi dưỡng tỉnh'],
    email: 'thanh.phan@dmt.edu',
    phone: '0123 456 796',
    bio: 'Giáo viên giỏi cấp quốc gia, huấn luyện nhiều học sinh đạt giải HSG cấp tỉnh và quốc gia'
  }
];

const TeachersShowcase: React.FC = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const [flippedCards, setFlippedCards] = React.useState<Set<number>>(new Set());

  const toggleFlip = (id: number) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm font-semibold mb-4">
            Đội ngũ giảng viên
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Học cùng chuyên gia
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Đội ngũ giảng viên giàu kinh nghiệm, tận tâm và luôn đồng hành cùng học viên
          </p>
        </motion.div>

        {/* Teachers grid */}
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {teachers.map((teacher) => {
            const isFlipped = flippedCards.has(teacher.id);
            const characterIllustration = IllustrationGenerator.generateCharacter(teacher.role, 200);
            
            // Extract initials properly from Vietnamese names
            const getInitials = (name: string) => {
              const words = name.split(' ');
              if (words.length >= 2) {
                // Get last two words for Vietnamese names (e.g., "Văn Hùng" -> "VH")
                return words.slice(-2).map(w => w.charAt(0).toUpperCase()).join('');
              }
              return words.map(w => w.charAt(0).toUpperCase()).join('');
            };
            
            const initials = getInitials(teacher.name);
            const avatar = ImageGenerator.generateAvatar(initials, 200);

            return (
              <motion.div
                key={teacher.id}
                variants={staggerItem}
                className="group relative h-[520px]"
                style={{ perspective: '1000px' }}
              >
                <motion.div
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
                  className="relative w-full h-full"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Front of card */}
                  <div
                    className="absolute inset-0 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    {/* Character illustration background */}
                    <div className="absolute inset-0 flex items-end justify-center pb-8">
                      <img
                        src={characterIllustration}
                        alt={teacher.name}
                        className="w-48 h-48 object-contain opacity-10 group-hover:opacity-20 transition-opacity"
                      />
                    </div>

                    {/* Content */}
                    <div className="relative h-full flex flex-col p-6">
                      {/* Avatar */}
                      <div className="flex justify-center mb-4">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="relative"
                        >
                          <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-white shadow-xl">
                            <img
                              src={avatar}
                              alt={teacher.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          {/* Status indicator */}
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-lg" />
                        </motion.div>
                      </div>

                      {/* Name & Title */}
                      <div className="text-center mb-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {teacher.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {teacher.title}
                        </p>
                        <span className="inline-block px-3 py-1 bg-gradient-to-r from-red-100 to-rose-100 text-red-700 rounded-full text-xs font-semibold">
                          {teacher.subject}
                        </span>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-1">
                            <HeartIcon className="w-4 h-4 text-pink-500" />
                          </div>
                          <div className="text-lg font-bold text-gray-900">
                            {teacher.students}
                          </div>
                          <div className="text-xs text-gray-600">Học viên</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-1">
                            <AcademicCapIcon className="w-4 h-4 text-blue-500" />
                          </div>
                          <div className="text-lg font-bold text-gray-900">
                            {teacher.courses}
                          </div>
                          <div className="text-xs text-gray-600">Khóa học</div>
                        </div>
                      </div>

                      {/* Experience */}
                      <div className="text-center mb-3 pb-3 border-b border-gray-100">
                        <span className="text-sm text-gray-600">
                          <span className="font-semibold text-gray-900">{teacher.experience}</span> kinh nghiệm
                        </span>
                      </div>

                      {/* Specialties - Fixed height */}
                      <div className="mb-3 h-[68px] flex items-start">
                        <div className="flex flex-wrap gap-1.5 justify-center w-full">
                          {teacher.specialties.slice(0, 4).map((specialty, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs leading-tight"
                            >
                              {specialty}
                            </span>
                          ))}
                          {teacher.specialties.length > 4 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs">
                              +{teacher.specialties.length - 4}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Flip button - Always at bottom */}
                      <div className="mt-auto">
                        <motion.button
                          onClick={() => toggleFlip(teacher.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-2.5 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
                        >
                          Xem thông tin
                          <ChatBubbleLeftRightIcon className="w-4 h-4 ml-2" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Hover gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>

                  {/* Back of card */}
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-red-600 to-rose-600 rounded-2xl shadow-lg overflow-hidden"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)'
                    }}
                  >
                    {/* Pattern overlay */}
                    <div className="absolute inset-0 opacity-10">
                      <img
                        src={ImageGenerator.generatePatternBackground('dots', '#ffffff')}
                        alt="pattern"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="relative h-full flex flex-col p-6 text-white">
                      <div className="flex-grow">
                        {/* Bio */}
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold mb-2 opacity-90">
                            Về tôi
                          </h4>
                          <p className="text-sm leading-relaxed">
                            {teacher.bio}
                          </p>
                        </div>

                        {/* All specialties */}
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold mb-2 opacity-90">
                            Chuyên môn
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {teacher.specialties.map((specialty, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-xs"
                              >
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Contact */}
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold mb-2 opacity-90">
                            Liên hệ
                          </h4>
                          <div className="flex items-center text-sm">
                            <EnvelopeIcon className="w-4 h-4 mr-2" />
                            <span className="text-xs">{teacher.email}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <PhoneIcon className="w-4 h-4 mr-2" />
                            <span className="text-xs">{teacher.phone}</span>
                          </div>
                        </div>
                      </div>

                      {/* Flip back button */}
                      <motion.button
                        onClick={() => toggleFlip(teacher.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-2 bg-white text-red-600 rounded-xl font-semibold text-sm shadow-lg"
                      >
                        Quay lại
                      </motion.button>
                    </div>
                  </div>
                </motion.div>

                {/* Glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-rose-500 rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity -z-10" />
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
            href="/teachers"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Xem tất cả giảng viên
            <AcademicCapIcon className="w-5 h-5 ml-2" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default TeachersShowcase;
