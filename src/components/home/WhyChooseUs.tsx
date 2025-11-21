import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  CheckCircleIcon,
  AcademicCapIcon,
  UserGroupIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TrophyIcon,
  HeartIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  BookOpenIcon,
  UsersIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { fadeInUp, fadeInLeft, fadeInRight } from '../../utils/animations';

interface Benefit {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}

const benefits: Benefit[] = [
  {
    icon: AcademicCapIcon,
    title: 'Giảng viên chất lượng cao',
    description: 'Đội ngũ giảng viên giàu kinh nghiệm, tận tâm và có chứng chỉ quốc tế',
    color: 'blue'
  },
  {
    icon: ChartBarIcon,
    title: 'Theo dõi tiến độ',
    description: 'Hệ thống đánh giá và báo cáo tiến độ học tập chi tiết, minh bạch',
    color: 'pink'
  },
  {
    icon: TrophyIcon,
    title: 'Cam kết đầu ra',
    description: 'Đảm bảo đầu ra với các chứng chỉ được công nhận và hỗ trợ việc làm',
    color: 'orange'
  },
  {
    icon: SparklesIcon,
    title: 'Phương pháp hiện đại',
    description: 'Áp dụng công nghệ và phương pháp giảng dạy tiên tiến nhất',
    color: 'green'
  },
  {
    icon: ShieldCheckIcon,
    title: 'Cơ sở vật chất tốt',
    description: 'Phòng học hiện đại, thiết bị đầy đủ và môi trường học tập chuyên nghiệp',
    color: 'cyan'
  },
  {
    icon: HeartIcon,
    title: 'Hỗ trợ tận tâm 24/7',
    description: 'Đội ngũ hỗ trợ luôn sẵn sàng giải đáp mọi thắc mắc của học viên',
    color: 'red'
  }
];

const additionalFeatures = [
  {
    icon: RocketLaunchIcon,
    title: 'Hỗ trợ khởi nghiệp',
    description: 'Tư vấn và đồng hành cùng học viên có ý định khởi nghiệp'
  },
  {
    icon: UserGroupIcon,
    title: 'Cộng đồng alumni',
    description: 'Kết nối với mạng lưới cựu học viên rộng khắp các ngành nghề'
  },
  {
    icon: SparklesIcon,
    title: 'Cập nhật liên tục',
    description: 'Chương trình học được cập nhật theo xu hướng công nghệ mới nhất'
  }
];

const WhyChooseUs: React.FC = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

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
          <span className="inline-block px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold mb-4">
            Tại sao chọn DMT Education
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Chúng tôi khác biệt như thế nào?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Với hơn 15 năm kinh nghiệm, chúng tôi tự hào là đối tác tin cậy trong hành trình phát triển của bạn
          </p>
        </motion.div>

        <div ref={ref} className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Illustration */}
          <motion.div
            variants={fadeInLeft}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="relative order-2 lg:order-1"
          >
            {/* Professional teacher image */}
            <div className="relative">
              {/* Image container - highest z-index */}
              <div className="relative z-50">
                                <img
                  src="/images/ANH-GV/DMT-25-2.png"
                  alt="DMT Education"
                  className="w-full h-auto rounded-2xl border border-gray-200"
                />
                {/* Decorative badge - on top of image */}
                <div className="absolute top-8 left-8 z-[60] bg-white rounded-full p-3 shadow-lg border border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-semibold text-gray-700">DMT Teacher</span>
                  </div>
                </div>
              </div>

              {/* Stats floating cards - moved away from image */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.5, type: "spring" }}
                className="absolute -top-8 -right-8 z-[70] bg-white rounded-2xl shadow-xl p-4 border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <TrophyIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">95%</div>
                    <div className="text-xs text-gray-600">Hài lòng</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.7, type: "spring" }}
                className="absolute -bottom-8 -left-16 z-[70] bg-white rounded-2xl shadow-xl p-4 border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-500 rounded-xl flex items-center justify-center">
                    <UserGroupIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">2K+</div>
                    <div className="text-xs text-gray-600">Học viên</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right - Benefits list */}
          <motion.div
            variants={fadeInRight}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="order-1 lg:order-2"
          >
            <div className="space-y-4">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                const colorClasses = {
                  blue: 'from-blue-500 to-blue-600',
                  purple: 'from-blue-500 to-blue-600',
                  pink: 'from-pink-500 to-pink-600',
                  orange: 'from-orange-500 to-orange-600',
                  green: 'from-green-500 to-green-600',
                  cyan: 'from-cyan-500 to-cyan-600',
                  red: 'from-red-500 to-red-600',
                  yellow: 'from-yellow-500 to-yellow-600'
                };

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 50 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: index * 0.1 }}
                    className="group relative"
                  >
                    <div className="flex items-start gap-4 bg-white p-4 rounded-xl border border-gray-100 hover:border-transparent hover:shadow-lg transition-all duration-300">
                      {/* Icon */}
                      <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${colorClasses[benefit.color as keyof typeof colorClasses]} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>

                      {/* Content */}
                      <div className="flex-grow">
                        <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-red-600 group-hover:to-rose-600 transition-all">
                          {benefit.title}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {benefit.description}
                        </p>
                      </div>

                      {/* Check icon */}
                      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <CheckCircleIcon className="w-6 h-6 text-green-500" />
                      </div>

                      {/* Hover gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${colorClasses[benefit.color as keyof typeof colorClasses]} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity pointer-events-none`} />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Additional features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1 }}
              className="mt-8 bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-6 border border-red-100"
            >
              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <SparklesIcon className="w-5 h-5 text-rose-600 mr-2" />
                Giá trị cộng thêm
              </h4>
              <div className="space-y-3">
                {additionalFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <Icon className="w-4 h-4 text-rose-600" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {feature.title}
                        </div>
                        <div className="text-xs text-gray-600">
                          {feature.description}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-red-600 to-rose-600 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <circle cx="20" cy="20" r="2" fill="white" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Content */}
            <div className="relative z-10">
              <h3 className="text-3xl sm:text-4xl font-bold mb-4">
                Sẵn sàng bắt đầu hành trình của bạn?
              </h3>
              <p className="text-lg sm:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Tham gia cùng hàng ngàn học viên đã thay đổi cuộc sống và sự nghiệp với DMT Education
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="/courses"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-red-600 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all"
                >
                  Khám phá khóa học
                  <AcademicCapIcon className="w-5 h-5 ml-2" />
                </motion.a>
                <motion.a
                  href="/contact"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full font-semibold border-2 border-white/30 hover:bg-white/20 transition-all"
                >
                  Liên hệ tư vấn
                  <HeartIcon className="w-5 h-5 ml-2" />
                </motion.a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
