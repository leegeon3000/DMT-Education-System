import React from 'react';
import { Trophy, GraduationCap, Star, Users, Medal, CheckCircle } from 'lucide-react';
import { COLORS } from '../../constants';

const AchievementsSection: React.FC = () => {
  return (
    <section
      id="achievements"
      style={{
        padding: '80px 20px',
        textAlign: 'center',
        background: '#ffffff',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '10%',
        width: '120px',
        height: '120px',
        background: 'rgba(220, 38, 38, 0.04)',
        borderRadius: '50%',
        animation: 'float 9s ease-in-out infinite'
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: '5%',
        width: '80px',
        height: '80px',
        background: 'rgba(220, 38, 38, 0.06)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite reverse'
      }}></div>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section Title */}
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: COLORS.neutral.gray800,
          marginBottom: '1rem',
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px'
        }}>
          <Trophy size={32} /> Thành Tích & Chứng Nhận
        </h2>
        
        <p style={{
          fontSize: '1.1rem',
          color: COLORS.neutral.gray600,
          marginBottom: '60px',
          maxWidth: '600px',
          margin: '0 auto 60px auto'
        }}>
          Được công nhận bởi các tổ chức giáo dục uy tín và đạt nhiều giải thưởng danh giá
        </p>

        {/* Achievements Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '30px',
          marginBottom: '60px'
        }}>
          {/* Achievement Card 1 */}
          <div className="achievement-card" style={{
            background: COLORS.neutral.white,
            borderRadius: '16px',
            padding: '30px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            borderTop: `4px solid ${COLORS.primary.main}`,
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            outline: 'none'
          }}>
            <div style={{
              position: 'absolute',
              top: '-50%',
              right: '-50%',
              width: '100px',
              height: '100px',
              background: `radial-gradient(circle, rgba(220, 38, 38, 0.05) 0%, transparent 70%)`,
              borderRadius: '50%'
            }}></div>
            
            <div style={{
              fontSize: '3rem',
              marginBottom: '20px',
              position: 'relative',
              zIndex: 2
            }}><GraduationCap size={48} /></div>
            
            <h3 style={{
              fontSize: '1.4rem',
              fontWeight: 'bold',
              color: COLORS.neutral.gray800,
              marginBottom: '15px'
            }}>
              Chứng Nhận Giáo Dục
            </h3>
            
            <p style={{
              color: COLORS.neutral.gray600,
              lineHeight: '1.6',
              marginBottom: '20px'
            }}>
              Được Bộ Giáo Dục công nhận là trung tâm đào tạo chất lượng cao
            </p>
            
            <div style={{
              color: COLORS.primary.main,
              fontWeight: 'bold',
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}>
              <CheckCircle size={18} /> Chứng nhận chính thức
            </div>
          </div>

          {/* Achievement Card 2 */}
          <div className="achievement-card" style={{
            background: COLORS.neutral.white,
            borderRadius: '16px',
            padding: '30px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            borderTop: `4px solid ${COLORS.secondary.blue}`,
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            outline: 'none'
          }}>
            <div style={{
              position: 'absolute',
              top: '-50%',
              right: '-50%',
              width: '100px',
              height: '100px',
              background: `radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)`,
              borderRadius: '50%'
            }}></div>
            
            <div style={{
              fontSize: '3rem',
              marginBottom: '20px',
              position: 'relative',
              zIndex: 2
            }}><Medal size={48} className="text-yellow-500" /></div>
            
            <h3 style={{
              fontSize: '1.4rem',
              fontWeight: 'bold',
              color: COLORS.neutral.gray800,
              marginBottom: '15px'
            }}>
              Giải Thưởng Xuất Sắc
            </h3>
            
            <p style={{
              color: COLORS.neutral.gray600,
              lineHeight: '1.6',
              marginBottom: '20px'
            }}>
              Top 10 trung tâm giáo dục tốt nhất khu vực miền Nam năm 2024
            </p>
            
            <div style={{
              color: COLORS.secondary.blue,
              fontWeight: 'bold',
              fontSize: '1.1rem'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                Chất lượng giảng dạy
              </span>
            </div>
          </div>

          {/* Achievement Card 3 */}
          <div className="achievement-card" style={{
            background: COLORS.neutral.white,
            borderRadius: '16px',
            padding: '30px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            borderTop: `4px solid ${COLORS.secondary.green}`,
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            outline: 'none'
          }}>
            <div style={{
              position: 'absolute',
              top: '-50%',
              right: '-50%',
              width: '100px',
              height: '100px',
              background: `radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 70%)`,
              borderRadius: '50%'
            }}></div>
            
            <div style={{
              fontSize: '3rem',
              marginBottom: '20px',
              position: 'relative',
              zIndex: 2
            }}><Users size={48} /></div>
            
            <h3 style={{
              fontSize: '1.4rem',
              fontWeight: 'bold',
              color: COLORS.neutral.gray800,
              marginBottom: '15px'
            }}>
              Học Viên Thành Công
            </h3>
            
            <p style={{
              color: COLORS.neutral.gray600,
              lineHeight: '1.6',
              marginBottom: '20px'
            }}>
              95% học viên hoàn thành khóa học và đạt kết quả xuất sắc
            </p>
            
            <div style={{
              color: COLORS.secondary.green,
              fontWeight: 'bold',
              fontSize: '1.1rem'
            }}>
              Tỷ lệ thành công cao
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '30px',
          marginTop: '60px'
        }}>
          {/* Stat 1 */}
          <div style={{
            textAlign: 'center',
            padding: '20px'
          }}>
            <div style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: COLORS.primary.main,
              marginBottom: '10px'
            }}>
              1000+
            </div>
            <div style={{
              color: COLORS.neutral.gray600,
              fontSize: '1.1rem'
            }}>
              Học viên đã tốt nghiệp
            </div>
          </div>

          {/* Stat 2 */}
          <div style={{
            textAlign: 'center',
            padding: '20px'
          }}>
            <div style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: COLORS.secondary.blue,
              marginBottom: '10px'
            }}>
              95%
            </div>
            <div style={{
              color: COLORS.neutral.gray600,
              fontSize: '1.1rem'
            }}>
              Tỷ lệ thành công
            </div>
          </div>

          {/* Stat 3 */}
          <div style={{
            textAlign: 'center',
            padding: '20px'
          }}>
            <div style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: COLORS.secondary.green,
              marginBottom: '10px'
            }}>
              50+
            </div>
            <div style={{
              color: COLORS.neutral.gray600,
              fontSize: '1.1rem'
            }}>
              Giáo viên chuyên nghiệp
            </div>
          </div>

          {/* Stat 4 */}
          <div style={{
            textAlign: 'center',
            padding: '20px'
          }}>
            <div style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: COLORS.secondary.orange,
              marginBottom: '10px'
            }}>
              10+
            </div>
            <div style={{
              color: COLORS.neutral.gray600,
              fontSize: '1.1rem'
            }}>
              Năm kinh nghiệm
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        
        #achievements * {
          outline: none !important;
          -webkit-tap-highlight-color: transparent !important;
        }
        
        #achievements *:focus,
        #achievements *:focus-visible {
          outline: none !important;
          border: none !important;
        }
        
        #achievements .achievement-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </section>
  );
};

export default AchievementsSection;
