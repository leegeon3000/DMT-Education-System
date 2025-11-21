import React from 'react';
import { 
  Target, 
  Trophy, 
  Star, 
  Users, 
  BookOpen, 
  Award,
  TrendingUp,
  Heart,
  Zap,
  Shield,
  Lightbulb,
  Globe
} from 'lucide-react';

const AboutSection: React.FC = () => {
  const milestones = [
    { year: '2010', title: 'Thành lập', description: 'DMT Education được thành lập với sứ mệnh đổi mới giáo dục Việt Nam' },
    { year: '2015', title: 'Mở rộng quy mô', description: 'Khai trương 3 cơ sở mới tại TP.HCM, phục vụ 5,000+ học viên' },
    { year: '2020', title: 'Chuyển đổi số', description: 'Ra mắt nền tảng học trực tuyến, tiên phong trong giáo dục online' },
    { year: '2025', title: 'Đối tác quốc tế', description: 'Hợp tác với Microsoft, Google và các tổ chức giáo dục hàng đầu' }
  ];

  const values = [
    { icon: Heart, title: 'Tâm huyết', description: 'Đặt tâm huyết vào từng học viên', color: '#ef4444' },
    { icon: Zap, title: 'Đổi mới', description: 'Không ngừng đổi mới phương pháp', color: '#f59e0b' },
    { icon: Shield, title: 'Uy tín', description: 'Xây dựng niềm tin qua chất lượng', color: '#3b82f6' },
    { icon: Lightbulb, title: 'Sáng tạo', description: 'Khuyến khích tư duy sáng tạo', color: '#06b6d4' }
  ];

  const stats = [
    { value: '2,000+', label: 'Học viên', color: '#3b82f6' },
    { value: '50+', label: 'Giảng viên', color: '#ec4899' },
    { value: '10+', label: 'Năm kinh nghiệm', color: '#10b981' },
    { value: '20+', label: 'Khóa học', color: '#f59e0b' }
  ];

  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div style={{ background: 'white' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        padding: '100px 20px 80px',
        textAlign: 'center',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          pointerEvents: 'none'
        }} />
        
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-block',
            padding: '8px 20px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '50px',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '24px',
            backdropFilter: 'blur(10px)'
          }}>
            <Star className="w-4 h-4 inline mr-1" fill="currentColor" />
            Về chúng tôi
          </div>
          
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
            fontWeight: '800',
            marginBottom: '24px',
            lineHeight: 1.2
          }}>
            DMT Education
          </h1>
          
          <p style={{
            fontSize: '1.25rem',
            lineHeight: 1.8,
            opacity: 0.95,
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            Hơn 15 năm kinh nghiệm trong lĩnh vực giáo dục, chúng tôi tự hào là đơn vị tiên phong 
            mang đến giải pháp đào tạo chất lượng cao, phát triển toàn diện cho học viên
          </p>

          {/* Stats Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '30px',
            marginTop: '60px',
            maxWidth: '600px',
            margin: '60px auto 0'
          }}>
            {stats.map((stat, index) => (
              <div key={index}>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: '800',
                  marginBottom: '8px'
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: '0.9rem',
                  opacity: 0.9
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Showcase - Học sinh và giáo viên */}
      <section style={{
        padding: '80px 20px',
        background: 'white'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
            marginBottom: '40px'
          }}>
            {/* Image 1 - Học sinh hoạt động */}
            <div style={{
              position: 'relative',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              height: '500px'
            }}>
              <img
                src="/images/ANH-HOC-SINH/DMT-25-38.jpg"
                alt="Học sinh DMT đạt thành tích xuất sắc"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'top',
                  transition: 'transform 0.5s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '20px',
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                color: 'white'
              }}>
                <p style={{ fontWeight: '600', fontSize: '1.1rem' }}>Học sinh xuất sắc</p>
                <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>Thành tích ấn tượng</p>
              </div>
            </div>

            {/* Image 2 - Giáo viên */}
            <div style={{
              position: 'relative',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              height: '500px'
            }}>
              <img
                src="/images/ANH-GV/DMT-25-21.png"
                alt="Giáo viên DMT Education tận tâm"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'top',
                  transition: 'transform 0.5s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '20px',
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                color: 'white'
              }}>
                <p style={{ fontWeight: '600', fontSize: '1.1rem' }}>Đội ngũ giáo viên</p>
                <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>Chuyên nghiệp & tận tâm</p>
              </div>
            </div>

            {/* Image 3 - Hoạt động học tập */}
            <div style={{
              position: 'relative',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              height: '500px'
            }}>
              <img
                src="/images/ANH-HOC-SINH/DMT-25-29.jpg"
                alt="Học sinh tham gia hoạt động nhóm"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  transition: 'transform 0.5s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '20px',
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                color: 'white'
              }}>
                <p style={{ fontWeight: '600', fontSize: '1.1rem' }}>Hoạt động nhóm</p>
                <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>Học tập hiệu quả</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision, Mission, Values */}
      <section style={{
        padding: '80px 20px',
        background: '#f9fafb'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '60px'
          }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 2.5rem)',
              fontWeight: '800',
              color: '#111827',
              marginBottom: '16px'
            }}>
              Định hướng chiến lược
            </h2>
            <p style={{
              fontSize: '1.1rem',
              color: '#6b7280',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Ba trụ cột xây dựng nền tảng vững chắc cho sự phát triển bền vững
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px'
          }}>
            {/* Vision */}
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '40px',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
            }}>
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px'
              }}>
                <Target size={32} color="white" />
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '12px'
              }}>
                Tầm nhìn
              </h3>
              <p style={{
                fontSize: '1rem',
                color: '#6b7280',
                lineHeight: 1.7
              }}>
                Trở thành hệ thống giáo dục hàng đầu Việt Nam, tiên phong trong đổi mới sáng tạo, 
                phát triển thế hệ công dân toàn cầu với tư duy phản biện và kỹ năng vượt trội
              </p>
            </div>

            {/* Mission */}
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '40px',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
            }}>
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px'
              }}>
                <Trophy size={32} color="white" />
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '12px'
              }}>
                Sứ mệnh
              </h3>
              <p style={{
                fontSize: '1rem',
                color: '#6b7280',
                lineHeight: 1.7
              }}>
                Cung cấp chương trình đào tạo chất lượng cao chuẩn quốc tế, môi trường học tập 
                chuyên nghiệp, nuôi dưỡng đam mê và phát triển tiềm năng của mỗi học viên
              </p>
            </div>

            {/* Core Values */}
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '40px',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
            }}>
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px'
              }}>
                <Star size={32} color="white" fill="white" />
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '12px'
              }}>
                Giá trị cốt lõi
              </h3>
              <p style={{
                fontSize: '1rem',
                color: '#6b7280',
                lineHeight: 1.7
              }}>
                Đổi mới sáng tạo, trung thực chính trực, tôn trọng con người, trách nhiệm xã hội 
                và phát triển bền vững là nền tảng cho mọi hoạt động của chúng tôi
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Grid */}
      <section style={{
        padding: '80px 20px',
        background: 'white'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '60px'
          }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 2.5rem)',
              fontWeight: '800',
              color: '#111827',
              marginBottom: '16px'
            }}>
              Giá trị văn hóa
            </h2>
            <p style={{
              fontSize: '1.1rem',
              color: '#6b7280',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Bốn giá trị cốt lõi định hình văn hóa doanh nghiệp của DMT Education
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '30px'
          }}>
            {values.map((value, index) => (
              <div key={index} style={{
                background: '#f9fafb',
                borderRadius: '16px',
                padding: '32px',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                border: '2px solid transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.borderColor = value.color;
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f9fafb';
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: value.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  boxShadow: `0 10px 20px ${value.color}33`
                }}>
                  <value.icon size={36} color="white" />
                </div>
                <h4 style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: '#111827',
                  marginBottom: '8px'
                }}>
                  {value.title}
                </h4>
                <p style={{
                  fontSize: '0.95rem',
                  color: '#6b7280',
                  lineHeight: 1.6
                }}>
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section style={{
        padding: '80px 20px',
        background: 'linear-gradient(to bottom, #f9fafb, white)'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '60px'
          }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 2.5rem)',
              fontWeight: '800',
              color: '#111827',
              marginBottom: '16px'
            }}>
              Hành trình phát triển
            </h2>
            <p style={{
              fontSize: '1.1rem',
              color: '#6b7280',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Từ những ngày đầu thành lập đến vị thế hàng đầu như ngày hôm nay
            </p>
          </div>

          <div style={{ position: 'relative' }}>
            {/* Timeline line */}
            {!isMobile && (
              <div style={{
                position: 'absolute',
                left: '50%',
                top: 0,
                bottom: 0,
                width: '2px',
                background: 'linear-gradient(to bottom, #3b82f6, #8b5cf6)',
                transform: 'translateX(-50%)'
              }} />
            )}

            {milestones.map((milestone, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '60px',
                position: 'relative',
                flexDirection: isMobile ? 'column' : index % 2 === 0 ? 'row' : 'row-reverse'
              }}>
                <div style={{
                  flex: 1,
                  padding: isMobile ? '0' : index % 2 === 0 ? '0 40px 0 0' : '0 0 0 40px',
                  textAlign: isMobile ? 'center' : index % 2 === 0 ? 'right' : 'left'
                }}>
                  <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                    <div style={{
                      fontSize: '2rem',
                      fontWeight: '800',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      marginBottom: '8px'
                    }}>
                      {milestone.year}
                    </div>
                    <h4 style={{
                      fontSize: '1.25rem',
                      fontWeight: '700',
                      color: '#111827',
                      marginBottom: '8px'
                    }}>
                      {milestone.title}
                    </h4>
                    <p style={{
                      fontSize: '0.95rem',
                      color: '#6b7280',
                      lineHeight: 1.6
                    }}>
                      {milestone.description}
                    </p>
                  </div>
                </div>

                {/* Timeline dot */}
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  border: '4px solid white',
                  boxShadow: '0 0 0 4px #e0e7ff',
                  position: isMobile ? 'static' : 'absolute',
                  left: isMobile ? 'auto' : '50%',
                  transform: isMobile ? 'none' : 'translateX(-50%)',
                  margin: isMobile ? '20px 0' : '0',
                  zIndex: 1
                }} />

                {!isMobile && <div style={{ flex: 1 }} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section style={{
        padding: '80px 20px',
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Award size={48} style={{ margin: '0 auto 24px', opacity: 0.9 }} />
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 2.5rem)',
            fontWeight: '800',
            marginBottom: '16px'
          }}>
            Thành tựu nổi bật
          </h2>
          <p style={{
            fontSize: '1.1rem',
            opacity: 0.9,
            maxWidth: '700px',
            margin: '0 auto 60px',
            lineHeight: 1.7
          }}>
            Được công nhận bởi các tổ chức uy tín trong và ngoài nước
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '30px'
          }}>
            {[
              { icon: Trophy, title: 'Top 10 Trung tâm', desc: 'Giáo dục xuất sắc VN 2024' },
              { icon: Star, title: 'ISO 9001:2015', desc: 'Chứng nhận chất lượng quốc tế' },
              { icon: Globe, title: 'Đối tác Microsoft', desc: 'Education Partner 2023' },
              { icon: TrendingUp, title: '98% Hài lòng', desc: 'Khảo sát học viên 2024' }
            ].map((achievement, index) => (
              <div key={index} style={{
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '32px',
                transition: 'transform 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
              }}>
                <achievement.icon size={40} style={{ margin: '0 auto 16px' }} />
                <h4 style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  marginBottom: '8px'
                }}>
                  {achievement.title}
                </h4>
                <p style={{
                  fontSize: '0.95rem',
                  opacity: 0.9
                }}>
                  {achievement.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '100px 20px',
        background: 'white',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Users size={48} color="#3b82f6" style={{ margin: '0 auto 24px' }} />
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 2.5rem)',
            fontWeight: '800',
            color: '#111827',
            marginBottom: '20px'
          }}>
            Hãy cùng chúng tôi xây dựng tương lai
          </h2>
          <p style={{
            fontSize: '1.1rem',
            color: '#6b7280',
            marginBottom: '40px',
            lineHeight: 1.7
          }}>
            Tham gia cộng đồng 2,000+ học viên đang theo đuổi ước mơ cùng DMT Education. 
            Đăng ký tư vấn miễn phí ngay hôm nay!
          </p>
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <a href="/courses" style={{
              display: 'inline-block',
              padding: '16px 36px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: 'white',
              borderRadius: '50px',
              fontWeight: '600',
              fontSize: '1.05rem',
              textDecoration: 'none',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(59, 130, 246, 0.4)';
            }}>
              Khám phá khóa học
            </a>
            <a href="/schedule" style={{
              display: 'inline-block',
              padding: '16px 36px',
              background: 'white',
              color: '#3b82f6',
              border: '2px solid #3b82f6',
              borderRadius: '50px',
              fontWeight: '600',
              fontSize: '1.05rem',
              textDecoration: 'none',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#3b82f6';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.color = '#3b82f6';
            }}>
              Xem lịch học
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutSection;
