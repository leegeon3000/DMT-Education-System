import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import {
  UserGroupIcon,
  AcademicCapIcon,
  BookOpenIcon,
  TrophyIcon,
  StarIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { fadeInUp } from '../../utils/animations';

interface Stat {
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  suffix: string;
  label: string;
  color: string;
  gradient: string;
}

const stats: Stat[] = [
  {
    icon: UserGroupIcon,
    value: 2000,
    suffix: '+',
    label: 'Học viên đã đào tạo',
    color: '#DC2626',
    gradient: 'from-red-500 to-red-600'
  },
  {
    icon: AcademicCapIcon,
    value: 50,
    suffix: '+',
    label: 'Giảng viên chất lượng',
    color: '#F43F5E',
    gradient: 'from-rose-500 to-rose-600'
  },
  {
    icon: BookOpenIcon,
    value: 20,
    suffix: '+',
    label: 'Khóa học đa dạng',
    color: '#EC4899',
    gradient: 'from-pink-500 to-pink-600'
  },
  {
    icon: TrophyIcon,
    value: 95,
    suffix: '%',
    label: 'Tỷ lệ hài lòng',
    color: '#F97316',
    gradient: 'from-orange-500 to-orange-600'
  },
  {
    icon: StarIcon,
    value: 98,
    suffix: '%',
    label: 'Đạt mục tiêu học tập',
    color: '#10B981',
    gradient: 'from-green-500 to-green-600'
  },
  {
    icon: SparklesIcon,
    value: 10,
    suffix: '+',
    label: 'Năm kinh nghiệm',
    color: '#06B6D4',
    gradient: 'from-cyan-500 to-cyan-600'
  }
];

const StatisticsBar: React.FC = () => {
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true
  });

  return (
    <section className="py-20 bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-red-200 to-rose-200 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-br from-pink-200 to-orange-200 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-white/80 backdrop-blur-sm text-red-600 rounded-full text-sm font-semibold mb-4 shadow-sm">
            Thành tích của chúng tôi
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Con số ấn tượng
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hơn 10 năm đồng hành cùng hàng ngàn học viên trên hành trình chinh phục tri thức
          </p>
        </motion.div>

        {/* Statistics grid */}
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            
            return (
              <motion.div
                key={index}
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                {/* Card */}
                <div className="relative h-full p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden">
                  {/* Background gradient on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  {/* Icon */}
                  <div className="relative mb-6 flex justify-center">
                    <div className={`p-4 bg-gradient-to-br ${stat.gradient} rounded-2xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Counter */}
                  <div className="text-center relative">
                    <div className="text-5xl font-bold mb-2">
                      {inView ? (
                        <span className={`bg-clip-text text-transparent bg-gradient-to-r ${stat.gradient}`}>
                          <CountUp
                            start={0}
                            end={stat.value}
                            duration={2.5}
                            delay={index * 0.1}
                            decimals={stat.value % 1 !== 0 ? 1 : 0}
                            separator=","
                          />
                          {stat.suffix}
                        </span>
                      ) : (
                        <span className={`bg-clip-text text-transparent bg-gradient-to-r ${stat.gradient}`}>
                          0{stat.suffix}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 font-medium text-lg">
                      {stat.label}
                    </p>
                  </div>

                  {/* Decorative line */}
                  <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${stat.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
                </div>

                {/* Glow effect */}
                <div 
                  className={`absolute -inset-0.5 bg-gradient-to-r ${stat.gradient} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300 -z-10`}
                  style={{ filter: 'blur(20px)' }}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Additional info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg">
            <div className="flex -space-x-2 mr-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-red-400 to-rose-400 flex items-center justify-center text-white text-xs font-bold"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-gray-900">
                Tham gia cùng hàng ngàn học viên
              </div>
              <div className="text-xs text-gray-600">
                Đăng ký ngay để nhận ưu đãi đặc biệt
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatisticsBar;
