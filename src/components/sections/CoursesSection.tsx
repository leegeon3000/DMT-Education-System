import React, { useState, useEffect } from 'react';
import { BookOpen, Loader, Calculator, Globe, Laptop, Book } from 'lucide-react';
import { COLORS } from '../../constants';
import { coursesApi } from '../../services/courses';

interface Course {
  id: number;
  name: string;
  code: string;
  description?: string;
  price?: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration_weeks: number;
  total_sessions: number;
  is_active: boolean;
  subjects?: {
    name: string;
    code: string;
  };
}

const CoursesSection: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await coursesApi.getAll({ page: 1, limit: 6, is_active: true });
        if (response.success && response.data && response.data.length > 0) {
          setCourses(response.data);
        } else {
          // Fallback to mock data if no courses returned
          console.warn('No courses returned from API, using mock data');
          setCourses([
            {
              id: 1,
              subject_id: 1,
              code: 'MATH-01',
              name: 'Toán cơ bản lớp 8-9',
              description: 'Khóa học toán học cơ bản dành cho học sinh lớp 8-9',
              duration_weeks: 12,
              total_sessions: 24,
              price: 2000000,
              level: 'beginner' as const,
              is_active: true,
              created_at: new Date().toISOString(),
              subjects: {
                id: 1,
                name: 'Toán học',
                code: 'MATH',
                description: 'Môn Toán'
              }
            },
            {
              id: 2,
              subject_id: 2,
              code: 'ENG-01',
              name: 'Tiếng Anh giao tiếp',
              description: 'Khóa học tiếng Anh giao tiếp cơ bản',
              duration_weeks: 16,
              total_sessions: 32,
              price: 2500000,
              level: 'intermediate' as const,
              is_active: true,
              created_at: new Date().toISOString(),
              subjects: {
                id: 2,
                name: 'Tiếng Anh',
                code: 'ENG',
                description: 'Môn Tiếng Anh'
              }
            },
            {
              id: 3,
              subject_id: 3,
              code: 'PROG-01',
              name: 'Lập trình Python cơ bản',
              description: 'Khóa học lập trình Python cho người mới bắt đầu',
              duration_weeks: 20,
              total_sessions: 40,
              price: 3000000,
              level: 'beginner' as const,
              is_active: true,
              created_at: new Date().toISOString(),
              subjects: {
                id: 3,
                name: 'Lập trình',
                code: 'PROG',
                description: 'Môn Lập trình'
              }
            }
          ]);
        }
      } catch (err: any) {
        console.error('Error fetching courses:', err);
        // Use mock data on error
        console.warn('API error, using mock data');
        setCourses([
          {
            id: 1,
            subject_id: 1,
            code: 'MATH-01',
            name: 'Toán cơ bản lớp 8-9',
            description: 'Khóa học toán học cơ bản dành cho học sinh lớp 8-9',
            duration_weeks: 12,
            total_sessions: 24,
            price: 2000000,
            level: 'beginner' as const,
            is_active: true,
            created_at: new Date().toISOString(),
            subjects: {
              id: 1,
              name: 'Toán học',
              code: 'MATH',
              description: 'Môn Toán'
            }
          },
          {
            id: 2,
            subject_id: 2,
            code: 'ENG-01',
            name: 'Tiếng Anh giao tiếp',
            description: 'Khóa học tiếng Anh giao tiếp cơ bản',
            duration_weeks: 16,
            total_sessions: 32,
            price: 2500000,
            level: 'intermediate' as const,
            is_active: true,
            created_at: new Date().toISOString(),
            subjects: {
              id: 2,
              name: 'Tiếng Anh',
              code: 'ENG',
              description: 'Môn Tiếng Anh'
            }
          },
          {
            id: 3,
            subject_id: 3,
            code: 'PROG-01',
            name: 'Lập trình Python cơ bản',
            description: 'Khóa học lập trình Python cho người mới bắt đầu',
            duration_weeks: 20,
            total_sessions: 40,
            price: 3000000,
            level: 'beginner' as const,
            is_active: true,
            created_at: new Date().toISOString(),
            subjects: {
              id: 3,
              name: 'Lập trình',
              code: 'PROG',
              description: 'Môn Lập trình'
            }
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner': return 'Cơ bản';
      case 'intermediate': return 'Trung cấp';
      case 'advanced': return 'Nâng cao';
      default: return level;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return '#10b981';
      case 'intermediate': return '#3b82f6';
      case 'advanced': return '#dc2626';
      default: return COLORS.primary.main;
    }
  };

  const formatPrice = (price?: number) => {
    if (!price) return 'Liên hệ';
    return `${(price / 1000000).toFixed(1)}M VNĐ`;
  };

  if (loading) {
    return (
      <section style={{
        padding: '80px 20px',
        textAlign: 'center',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Loader className="animate-spin" size={24} />
          <span>Đang tải khóa học...</span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section style={{
        padding: '80px 20px',
        textAlign: 'center',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ color: COLORS.primary.main }}>{error}</div>
      </section>
    );
  }

  return (
    <section
      id="courses"
      style={{
        padding: '80px 20px',
        textAlign: 'center',
        background: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '8%',
        width: '100px',
        height: '100px',
        background: 'rgba(255, 255, 255, 0)',
        borderRadius: '50%',
        animation: 'float 7s ease-in-out infinite'
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '12%',
        width: '80px',
        height: '80px',
        background: 'rgba(255, 255, 255, 0)',
        borderRadius: '50%',
        animation: 'float 9s ease-in-out infinite reverse'
      }}></div>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{
          fontSize: '40px',
          fontWeight: '700',
          color: COLORS.neutral.gray900,
          marginBottom: '16px'
        }}>
          Khóa học của chúng tôi
        </h2>
        <p style={{
          fontSize: '18px',
          color: COLORS.neutral.gray600,
          marginBottom: '60px',
          maxWidth: '600px',
          margin: '0 auto 60px'
        }}>
          Chương trình học được thiết kế khoa học, phù hợp với từng độ tuổi
        </p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px',
          marginBottom: '60px'
        }}>
          {courses.length > 0 ? (
            courses.map((course) => (
              <div key={course.id} style={{
                background: '#ffffff',
                padding: '40px 30px',
                borderRadius: '16px',
                border: '1px solid #f1f5f9',
                borderTop: `4px solid ${getLevelColor(course.level)}`,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
              }}
              >
                <div style={{ 
                  marginBottom: '20px',
                  display: 'flex',
                  justifyContent: 'center',
                  color: getLevelColor(course.level)
                }}>
                  {course.subjects?.name?.includes('Toán') ? <Calculator size={48} strokeWidth={1.5} /> :
                   course.subjects?.name?.includes('Văn') || course.subjects?.name?.includes('Ngữ') ? <BookOpen size={48} strokeWidth={1.5} /> :
                   course.subjects?.name?.includes('Anh') || course.subjects?.name?.includes('English') ? <Globe size={48} strokeWidth={1.5} /> :
                   course.subjects?.name?.includes('Lập trình') || course.subjects?.name?.includes('CNTT') ? <Laptop size={48} strokeWidth={1.5} /> :
                   <Book size={48} strokeWidth={1.5} />}
                </div>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#1e293b',
                  marginBottom: '16px'
                }}>
                  {course.name}
                </h3>
                <p style={{
                  color: '#64748b',
                  fontSize: '16px',
                  lineHeight: '1.6',
                  marginBottom: '24px',
                  minHeight: '72px'
                }}>
                  {course.description || 'Khóa học chất lượng cao với giáo viên giàu kinh nghiệm'}
                </p>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '20px',
                  borderTop: '1px solid #e2e8f0',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ 
                      fontSize: '14px', 
                      color: '#64748b',
                      background: '#f8fafc',
                      padding: '4px 12px',
                      borderRadius: '12px'
                    }}>
                      {getLevelText(course.level)}
                    </span>
                    <span style={{ 
                      fontSize: '14px', 
                      color: '#64748b',
                      background: '#f8fafc',
                      padding: '4px 12px',
                      borderRadius: '12px'
                    }}>
                      {course.duration_weeks} tuần
                    </span>
                  </div>
                  <span style={{ 
                    fontSize: '18px', 
                    fontWeight: '700', 
                    color: getLevelColor(course.level)
                  }}>
                    {formatPrice(course.price)}
                  </span>
                </div>
                {course.subjects && (
                  <div style={{
                    marginTop: '12px',
                    fontSize: '13px',
                    color: '#94a3b8',
                    textAlign: 'center'
                  }}>
                    Môn: {course.subjects.name}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '40px',
              color: '#64748b'
            }}>
              Hiện tại chưa có khóa học nào được kích hoạt
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div style={{
          background: '#ffffff',
          padding: '40px',
          borderRadius: '16px',
          border: '1px solid #f1f5f9',
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
        }}>
          <h3 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#1e293b',
            marginBottom: '16px'
          }}>
            Tư vấn chương trình học phù hợp
          </h3>
          <p style={{
            color: '#64748b',
            fontSize: '16px',
            marginBottom: '24px'
          }}>
            Đội ngũ chuyên gia của chúng tôi sẽ tư vấn chương trình học phù hợp nhất cho con bạn
          </p>
          <button style={{
            background: COLORS.primary.main,
            color: 'white',
            padding: '12px 32px',
            borderRadius: '25px',
            border: 'none',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(220, 38, 38, 0.25)',
            transition: 'all 0.3s ease'
          }}>
            Đăng ký tư vấn miễn phí
          </button>
        </div>
      </div>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
          }
          
          #courses * {
            outline: none !important;
            -webkit-tap-highlight-color: transparent !important;
          }
          
          #courses *:focus,
          #courses *:focus-visible,
          #courses *:hover {
            outline: none !important;
          }
          
          #courses div:focus {
            outline: none !important;
            border: none !important;
          }
        `}
      </style>
    </section>
  );
};

export default CoursesSection;
