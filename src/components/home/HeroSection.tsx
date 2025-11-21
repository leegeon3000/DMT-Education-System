import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon, AcademicCapIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { Check } from 'lucide-react';
import { ImageGenerator } from '../../utils/imageGenerator';
import { fadeInUp, staggerContainer, staggerItem, floatAnimation } from '../../utils/animations';

const HeroSection: React.FC = () => {
  const meshBackground = ImageGenerator.generateMeshGradient(
    ['#3B82F6', '#8B5CF6', '#EC4899'],
    1920,
    1080
  );

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url("${meshBackground}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-rose-900/20 to-pink-900/20" />
      </div>

      {/* Floating elements */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 bg-red-500/10 rounded-full blur-xl"
        animate={floatAnimation}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-32 h-32 bg-rose-500/10 rounded-full blur-xl"
        animate={{ ...floatAnimation, transition: { ...floatAnimation.transition, delay: 1 } }}
      />
      <motion.div
        className="absolute top-1/2 left-1/4 w-24 h-24 bg-pink-500/10 rounded-full blur-xl"
        animate={{ ...floatAnimation, transition: { ...floatAnimation.transition, delay: 0.5 } }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            variants={staggerItem}
            className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white mb-6"
          >
            <SparklesIcon className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Hệ thống giáo dục hàng đầu</span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            variants={staggerItem}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Nâng tầm tri thức{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-rose-400 to-pink-400 whitespace-nowrap">
              Kiến tạo tương lai
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={staggerItem}
            className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Trung tâm DMT Education - Nơi hội tụ đội ngũ giảng viên chất lượng,
            phương pháp giảng dạy hiện đại và môi trường học tập chuyên nghiệp
          </motion.p>

          {/* Stats */}
          <motion.div
            variants={staggerItem}
            className="flex flex-wrap items-center justify-center gap-8 mb-12"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-white">2,000+</div>
              <div className="text-sm text-white/70">Học viên</div>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="text-center">
              <div className="text-3xl font-bold text-white">50+</div>
              <div className="text-sm text-white/70">Giảng viên</div>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="text-center">
              <div className="text-3xl font-bold text-white">20+</div>
              <div className="text-sm text-white/70">Khóa học</div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={staggerItem}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.a
              href="/courses"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group px-8 py-4 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all inline-flex items-center"
            >
              Khám phá khóa học
              <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </motion.a>

            <motion.a
              href="#features"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white rounded-full font-semibold text-lg hover:bg-white/20 transition-all inline-flex items-center"
            >
              <AcademicCapIcon className="w-5 h-5 mr-2" />
              Tìm hiểu thêm
            </motion.a>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            variants={staggerItem}
            className="mt-16 flex flex-wrap items-center justify-center gap-8 opacity-70"
          >
            <div className="text-sm text-white flex items-center">
              <Check className="w-4 h-4 mr-1" />
              Giảng viên chất lượng cao
            </div>
            <div className="w-px h-4 bg-white/30" />
            <div className="text-sm text-white flex items-center">
              <Check className="w-4 h-4 mr-1" />
              Cam kết đầu ra
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1, repeat: Infinity, repeatType: 'reverse' }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-white rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
