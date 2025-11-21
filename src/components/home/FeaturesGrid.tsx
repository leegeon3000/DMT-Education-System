import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  TrophyIcon,
  SparklesIcon,
  FireIcon,
  StarIcon
} from '@heroicons/react/24/solid';
import { staggerContainer, staggerItem } from '../../utils/animations';

interface Achievement {
  id: number;
  image: string;
  title: string;
  description: string;
  stats: string;
  gradient: string;
  icon: React.ComponentType<{ className?: string }>;
}

const achievements: Achievement[] = [
  {
    id: 1,
    image: '/images/ANH-HOC-SINH/DMT-25-36.png',
    title: 'Thành tích học tập vượt trội',
    description: 'Học sinh DMT đạt điểm cao trong các kỳ thi THPT QG, vào lớp 10 chuyên',
    stats: '95% đạt điểm 8+',
    gradient: 'from-yellow-400 to-orange-500',
    icon: TrophyIcon
  },
  {
    id: 2,
    image: '/images/ANH-HOC-SINH/DMT-25-48.png',
    title: 'Lớp học tương tác & Sáng tạo',
    description: 'Phương pháp giảng dạy hiện đại, khuyến khích tư duy phản biện và sáng tạo',
    stats: '100% tương tác',
    gradient: 'from-purple-400 to-pink-500',
    icon: StarIcon
  },
  {
    id: 3,
    image: '/images/ANH-HOC-SINH/DMT-25-38.jpg',
    title: 'Học viên xuất sắc toàn diện',
    description: 'Phát triển cả kiến thức, kỹ năng và phẩm chất đạo đức cho học sinh',
    stats: 'Phát triển 360°',
    gradient: 'from-blue-400 to-cyan-500',
    icon: SparklesIcon
  },
  {
    id: 4,
    image: '/images/ANH-HOC-SINH/DMT-25-26_1.png',
    title: 'Học tập nhóm hiệu quả',
    description: 'Hoạt động nhóm giúp học sinh phát triển kỹ năng làm việc team và giao tiếp',
    stats: 'Kỹ năng mềm tốt',
    gradient: 'from-red-400 to-rose-500',
    icon: FireIcon
  }
];

const FeaturesGrid: React.FC = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section id="features" className="py-20 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 -left-20 w-96 h-96 bg-gradient-to-br from-red-200/20 to-pink-200/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-block px-4 py-2 bg-gradient-to-r from-red-100 to-rose-100 text-red-600 rounded-full text-sm font-semibold mb-4"
          >
             Thành tích nổi bật
          </motion.span>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Hành trình{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-rose-600 to-pink-600">
              Tỏa sáng
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Những thành tích xuất sắc của học viên DMT - Minh chứng cho chất lượng đào tạo
          </p>
        </motion.div>

        {/* Achievements grid with images */}
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {achievements.map((achievement, index) => {
            const IconComponent = achievement.icon;
            return (
              <motion.div
                key={achievement.id}
                variants={staggerItem}
                onHoverStart={() => setHoveredId(achievement.id)}
                onHoverEnd={() => setHoveredId(null)}
                className="group relative"
              >
                <motion.div
                  whileHover={{ y: -8 }}
                  className="relative h-full bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
                >
                  {/* Image with overlay */}
                  <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
                        backgroundSize: '20px 20px'
                      }} />
                    </div>
                    
                    <motion.img
                      src={achievement.image}
                      alt={achievement.title}
                      className="w-full h-full object-cover relative z-10"
                      style={{
                        objectPosition: achievement.image.includes('DMT-25-26_1') ? '50% 30%' : achievement.image.includes('DMT-25-38') ? '50% 20%' : achievement.image.includes('DMT-25-36') ? '50% 15%' : achievement.image.includes('DMT-25-48') ? '50% 20%' : 'top'
                      }}
                      animate={hoveredId === achievement.id ? { scale: 1.1 } : { scale: 1 }}
                      transition={{ duration: 0.6 }}
                      onError={(e) => {
                        // Fallback if image fails to load
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    {/* Gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${achievement.gradient} opacity-40 group-hover:opacity-60 transition-opacity duration-500 z-20`} />
                    
                    {/* Floating icon with gradient background */}
                    <motion.div
                      animate={hoveredId === achievement.id ? { scale: 1.2, rotate: 360 } : { scale: 1, rotate: 0 }}
                      transition={{ duration: 0.6 }}
                      className="absolute top-6 right-6 z-30"
                    >
                      <div className={`p-4 bg-gradient-to-br ${achievement.gradient} rounded-2xl shadow-2xl ring-4 ring-white/50`}>
                        <IconComponent className="w-8 h-8 text-white drop-shadow-lg" />
                      </div>
                    </motion.div>

                    {/* Decorative circles */}
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className={`absolute top-10 right-10 w-32 h-32 bg-gradient-to-br ${achievement.gradient} rounded-full blur-2xl opacity-30 z-10`}
                    />

                    {/* Stats badge */}
                    <motion.div
                      initial={{ x: -100, opacity: 0 }}
                      animate={inView ? { x: 0, opacity: 1 } : {}}
                      transition={{ delay: index * 0.1 }}
                      className="absolute bottom-6 left-6 z-30"
                    >
                      <div className="bg-white/95 backdrop-blur-sm px-5 py-3 rounded-full shadow-lg border-2 border-white">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold bg-gradient-to-r ${achievement.gradient} bg-clip-text text-transparent`}>
                            {achievement.stats}
                          </span>
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <span className="text-xl"></span>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="p-6 relative">
                    {/* Decorative corner element */}
                    <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${achievement.gradient} opacity-5 rounded-bl-3xl`} />
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-red-600 group-hover:to-rose-600 transition-all duration-300">
                      {achievement.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-base">
                      {achievement.description}
                    </p>

                    {/* Animated line with dots */}
                    <div className="mt-6 flex items-center gap-2">
                      <motion.div
                        className={`h-1.5 bg-gradient-to-r ${achievement.gradient} rounded-full shadow-lg`}
                        initial={{ width: "30%" }}
                        animate={hoveredId === achievement.id ? { width: "100%" } : { width: "30%" }}
                        transition={{ duration: 0.4 }}
                      />
                      {hoveredId === achievement.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={`w-2 h-2 rounded-full bg-gradient-to-r ${achievement.gradient}`}
                        />
                      )}
                    </div>

                    {/* Small icon indicator */}
                    <motion.div
                      className="absolute bottom-8 right-8"
                      animate={hoveredId === achievement.id ? { rotate: 360, scale: 1.2 } : { rotate: 0, scale: 1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${achievement.gradient} opacity-10 flex items-center justify-center`}>
                        <IconComponent className="w-5 h-5 text-gray-400" />
                      </div>
                    </motion.div>
                  </div>

                  {/* Glow effect */}
                  <AnimatePresence>
                    {hoveredId === achievement.id && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`absolute -inset-1 bg-gradient-to-r ${achievement.gradient} rounded-3xl opacity-30 blur-2xl -z-10`}
                      />
                    )}
                  </AnimatePresence>
                </motion.div>
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
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-block"
          >
            <a
              href="/courses"
              className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-full font-semibold shadow-lg hover:shadow-2xl transition-all relative overflow-hidden"
            >
              <span className="relative z-10">Bắt đầu hành trình của bạn</span>
              <motion.svg
                className="w-5 h-5 ml-2 relative z-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </motion.svg>
              
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
