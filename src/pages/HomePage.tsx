import React from 'react';
import { SEOHead } from '../components/common/OptimizedComponents';
import Layout from '../components/layout/Layout';

// New modern homepage components
import HeroSection from '../components/home/HeroSection';
import FeaturesGrid from '../components/home/FeaturesGrid';
import StatisticsBar from '../components/home/StatisticsBar';
import CoursesShowcase from '../components/home/CoursesShowcase';
import TeachersShowcase from '../components/home/TeachersShowcase';
import TestimonialsSlider from '../components/home/TestimonialsSlider';
import WhyChooseUs from '../components/home/WhyChooseUs';
import CTASection from '../components/home/CTASection';
import VisualShowcase from '../components/home/VisualShowcase';

const HomePage: React.FC = () => {
  return (
    <>
      <SEOHead 
        title="DMT Education - Trung tâm dạy học THCS & THPT chất lượng cao"
        description="Trung tâm giáo dục DMT chuyên dạy học sinh cấp 2 (THCS) và cấp 3 (THPT) với các môn Toán, Văn, Anh Văn, iSmart. Hơn 15 năm kinh nghiệm, đội ngũ giáo viên giỏi, phương pháp hiện đại. Đăng ký ngay!"
        keywords="DMT Education, trung tâm học thêm, dạy học THCS, dạy học THPT, học Toán, học Văn, học Anh Văn, iSmart, giáo viên giỏi, lớp học chất lượng, ôn thi cấp 2, ôn thi cấp 3"
      />
      
      <Layout>
        {/* Hero Section - Giới thiệu trung tâm dạy học THCS & THPT */}
        <HeroSection />
        
        {/* Features Grid - Ưu điểm nổi bật của trung tâm */}
        <FeaturesGrid />
        
        {/* Statistics Bar - Thành tích và số liệu */}
        <StatisticsBar />
        
        {/* Courses Showcase - Các môn học: Toán, Văn, Anh Văn, iSmart */}
        <CoursesShowcase />
        
        {/* Visual Showcase - Trải nghiệm học tập với hình ảnh thực tế */}
        <VisualShowcase />
        
        {/* Teachers Showcase - Đội ngũ giáo viên giỏi */}
        <TeachersShowcase />
        
        {/* Testimonials Slider - Học viên đạt thành tích cao */}
        <TestimonialsSlider />
        
        {/* Why Choose Us - Tại sao chọn DMT Education */}
        <WhyChooseUs />
        
        {/* CTA Section - Đăng ký học thử & liên hệ tư vấn */}
        <CTASection />
      </Layout>
    </>
  );
};

export default HomePage;
