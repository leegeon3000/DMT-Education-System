import React from 'react';
import { COLORS } from '../../constants';
import { BookOpen, GraduationCap, Target, Trophy } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section
      id="home"
      style={{
        padding: '100px 1rem',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: `${COLORS.backgrounds.main}, ${COLORS.backgrounds.pattern}`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '10%',
        width: '200px',
        height: '200px',
        background: 'rgba(220, 38, 38, 0.03)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite'
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '5%',
        width: '150px',
        height: '150px',
        background: 'rgba(220, 38, 38, 0.02)',
        borderRadius: '50%',
        animation: 'float 10s ease-in-out infinite reverse'
      }}></div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        textAlign: 'center'
      }}>
        {/* Hero Main Content */}
        <div style={{
          marginBottom: '60px'
        }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: '800',
            color: COLORS.neutral.gray900,
            lineHeight: '1.1',
            marginBottom: '25px'
          }}>
            Phát triển{' '}
            <span style={{
              color: COLORS.primary.main
            }}>
              Tư duy Logic
            </span>
            {' '}& Sáng tạo
          </h1>
          
          <p style={{
            fontSize: '1.125rem',
            color: COLORS.neutral.gray600,
            marginBottom: '35px',
            lineHeight: '1.7',
            maxWidth: '600px',
            margin: '0 auto 35px auto'
          }}>
            Phương pháp giáo dục tiên tiến, giúp học sinh phát triển tư duy logic, 
            sáng tạo và kỹ năng giải quyết vấn đề một cách hiệu quả với công nghệ hiện đại.
          </p>
          
          <div style={{ 
            display: 'flex', 
            gap: '15px', 
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginBottom: '60px'
          }}>
            <button style={{
              background: COLORS.primary.main,
              color: 'white',
              padding: '15px 30px',
              borderRadius: '30px',
              border: 'none',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(220, 38, 38, 0.25)',
              transition: 'all 0.3s ease'
            }}>
              Bắt đầu học ngay
            </button>
            <button style={{
              border: `2px solid ${COLORS.primary.main}`,
              color: COLORS.primary.main,
              padding: '13px 28px',
              borderRadius: '30px',
              background: 'transparent',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>
              Tìm hiểu thêm
            </button>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '60px'
        }}>
          {/* Feature Card 1 */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '30px 20px',
            textAlign: 'center',
            border: '1px solid #f1f5f9',
            borderTop: '3px solid #dc2626',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            transition: 'transform 0.3s ease'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: '#dc2626',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '24px'
            }}>
              <BookOpen size={24} />
            </div>
            <h4 style={{
              fontWeight: '700',
              color: '#1e293b',
              marginBottom: '12px',
              fontSize: '1.1rem'
            }}>
              Chương trình đa dạng
            </h4>
            <p style={{
              fontSize: '0.9rem',
              color: '#64748b',
              lineHeight: '1.5'
            }}>
              Toán học, IELTS, Lập trình
            </p>
          </div>

          {/* Feature Card 2 */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '30px 20px',
            textAlign: 'center',
            border: '1px solid #f1f5f9',
            borderTop: '3px solid #3b82f6',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            transition: 'transform 0.3s ease'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: '#3b82f6',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '24px'
            }}>
              <GraduationCap size={24} />
            </div>
            <h4 style={{
              fontWeight: '700',
              color: '#1e293b',
              marginBottom: '12px',
              fontSize: '1.1rem'
            }}>
              Giáo viên chuyên nghiệp
            </h4>
            <p style={{
              fontSize: '0.9rem',
              color: '#64748b',
              lineHeight: '1.5'
            }}>
              Đội ngũ giàu kinh nghiệm
            </p>
          </div>

          {/* Feature Card 3 */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '30px 20px',
            textAlign: 'center',
            border: '1px solid #f1f5f9',
            borderTop: '3px solid #10b981',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            transition: 'transform 0.3s ease'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: '#10b981',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '24px'
            }}>
              <Target size={24} />
            </div>
            <h4 style={{
              fontWeight: '700',
              color: '#1e293b',
              marginBottom: '12px',
              fontSize: '1.1rem'
            }}>
              Học tập hiệu quả
            </h4>
            <p style={{
              fontSize: '0.9rem',
              color: '#64748b',
              lineHeight: '1.5'
            }}>
              Phương pháp hiện đại
            </p>
          </div>

          {/* Feature Card 4 */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '30px 20px',
            textAlign: 'center',
            border: '1px solid #f1f5f9',
            borderTop: '3px solid #f59e0b',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            transition: 'transform 0.3s ease'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: '#f59e0b',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '24px'
            }}>
              <Trophy size={24} />
            </div>
            <h4 style={{
              fontWeight: '700',
              color: '#1e293b',
              marginBottom: '12px',
              fontSize: '1.1rem'
            }}>
              Thành tích nổi bật
            </h4>
            <p style={{
              fontSize: '0.9rem',
              color: '#64748b',
              lineHeight: '1.5'
            }}>
              Kết quả ấn tượng
            </p>
          </div>
        </div>

        {/* Statistics Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          textAlign: 'center',
          marginTop: '40px'
        }}>
          <div>
            <div style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: '800',
              color: '#dc2626',
              marginBottom: '8px'
            }}>
              15+
            </div>
            <div style={{
              fontSize: '1rem',
              color: '#64748b',
              fontWeight: '500'
            }}>
              Năm kinh nghiệm
            </div>
          </div>

          <div>
            <div style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: '800',
              color: '#3b82f6',
              marginBottom: '8px'
            }}>
              5000+
            </div>
            <div style={{
              fontSize: '1rem',
              color: '#64748b',
              fontWeight: '500'
            }}>
              Học sinh thành công
            </div>
          </div>

          <div>
            <div style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: '800',
              color: '#10b981',
              marginBottom: '8px'
            }}>
              30+
            </div>
            <div style={{
              fontSize: '1rem',
              color: '#64748b',
              fontWeight: '500'
            }}>
              Giảng viên chuyên nghiệp
            </div>
          </div>

          <div>
            <div style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: '800',
              color: '#f59e0b',
              marginBottom: '8px'
            }}>
              95%
            </div>
            <div style={{
              fontSize: '1rem',
              color: '#64748b',
              fontWeight: '500'
            }}>
              Tỷ lệ đậu IELTS 6.5+
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          
          #home * {
            outline: none !important;
            -webkit-tap-highlight-color: transparent !important;
          }
          
          #home *:focus,
          #home *:focus-visible {
            outline: none !important;
            border: none !important;
          }
          
          @media (max-width: 768px) {
            section {
              padding: 60px 1rem !important;
            }
          }
        `}
      </style>
    </section>
  );
};

export default Hero;
