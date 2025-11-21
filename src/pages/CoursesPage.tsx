import React from 'react';
import { SEOHead } from '../components/common';
import Layout from '../components/layout/Layout';
import EnhancedCoursesPage from '../components/courses/EnhancedCoursesPage';

const CoursesPage: React.FC = () => {
  return (
    <>
      <SEOHead 
        title="DMT Education - Khóa học đa dạng chất lượng cao"
        description="Khám phá các khóa học chất lượng từ Toán, Lý, Hóa, Văn đến Tiếng Anh. Giảng viên chuyên nghiệp, phương pháp hiện đại, cam kết đầu ra."
        keywords="DMT Education, khóa học, toán học, vật lý, hóa học, văn học, tiếng Anh, sinh học, học trực tuyến"
      />
      
      <Layout>
        <EnhancedCoursesPage />
      </Layout>
    </>
  );
};

export default CoursesPage;
