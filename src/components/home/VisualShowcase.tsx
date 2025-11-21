import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Award, Sparkles } from 'lucide-react';

const VisualShowcase: React.FC = () => {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-50 to-rose-50 text-red-600 mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">Trải nghiệm học tập</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Phương pháp giảng dạy{' '}
            <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
              Hiện đại & Hiệu quả
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Lớp học tương tác, giáo viên tận tâm và môi trường học tập chuyên nghiệp 
            giúp học sinh phát triển toàn diện
          </p>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left: Large Featured Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
              <img
                src="/images/ANH-HOC-SINH/DMT-25-24.png"
                alt="Lớp học sinh động tại DMT Education"
                className="w-full h-[500px] object-cover object-top transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-white text-sm font-medium">Lớp học đang diễn ra</span>
                  </div>
                  <h3 className="text-white text-2xl font-bold mb-2">Lớp học tương tác sinh động</h3>
                  <p className="text-white/90 text-sm">Học sinh tích cực tham gia và phát triển tư duy</p>
                </div>
              </div>
            </div>

            {/* Floating Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6 max-w-xs"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-rose-500 flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Grid of smaller images */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 gap-6"
          >
            {/* Image 1 */}
            <div className="relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer leading-none h-[320px]">
              <img
                src="/images/ANH-HOC-SINH/DMT-25-49.png"
                alt="Hoạt động ngoại khóa DMT"
                className="w-full h-full object-cover block transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-2 text-white mb-1">
                    <BookOpen className="w-4 h-4" />
                    <span className="text-xs font-semibold">Hoạt động ngoại khóa</span>
                  </div>
                  <p className="text-white text-sm font-medium">Phát triển kỹ năng mềm</p>
                </div>
              </div>
            </div>

            {/* Image 2 */}
            <div className="relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer mt-8 leading-none h-[320px]">
              <img
                src="/images/ANH-GV/DMT-25-21.png"
                alt="Giáo viên DMT tận tâm"
                className="w-full h-full object-cover object-center block transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-2 text-white mb-1">
                    <Users className="w-4 h-4" />
                    <span className="text-xs font-semibold">Đội ngũ giáo viên</span>
                  </div>
                  <p className="text-white text-sm font-medium">Chuyên nghiệp & tận tâm</p>
                </div>
              </div>
            </div>

            {/* Info Cards */}
            <div className="col-span-2 grid grid-cols-2 gap-4 mt-4">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
                <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center mb-3">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">20+</div>
                <div className="text-sm text-gray-600">Khóa học đa dạng</div>
              </div>

              <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-6 border border-rose-100">
                <div className="w-10 h-10 rounded-lg bg-rose-500 flex items-center justify-center mb-3">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">50+</div>
                <div className="text-sm text-gray-600">Giáo viên giỏi</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 bg-gradient-to-r from-red-600 to-rose-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2">
              <h3 className="text-3xl font-bold mb-3">Sẵn sàng bắt đầu hành trình học tập?</h3>
              <p className="text-white/90 text-lg">
                Đăng ký tư vấn miễn phí ngay hôm nay để nhận lộ trình học tập phù hợp
              </p>
            </div>
            <div className="flex justify-start md:justify-end">
              <button className="px-8 py-4 bg-white text-red-600 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Đăng ký ngay
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VisualShowcase;
