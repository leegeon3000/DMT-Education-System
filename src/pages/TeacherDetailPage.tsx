import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { SEOHead } from '../components/common';
import { teachersApi, Teacher } from '../services/academic';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  BookOpen,
  Users,
  GraduationCap,
  Briefcase,
  Star,
  ChevronLeft,
  Loader,
  TrendingUp,
  Clock,
  CheckCircle,
} from 'lucide-react';

interface TeacherPerformance {
  total_classes: number;
  total_students: number;

  attendance_rate: number;
}

interface TeacherClass {
  id: number;
  class_code: string;
  start_date: string;
  end_date: string;
  schedule: string;
  status: string;
  courses: {
    id: number;
    name: string;
    description: string;
  };
}

const TeacherDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [performance, setPerformance] = useState<TeacherPerformance | null>(null);
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'classes' | 'performance'>('overview');

  useEffect(() => {
    const fetchTeacherData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        const [teacherRes, performanceRes, classesRes] = await Promise.all([
          teachersApi.getById(Number(id)),
          teachersApi.getPerformance(Number(id)),
          teachersApi.getClasses(Number(id)),
        ]);

        if (teacherRes.success && teacherRes.data) {
          setTeacher(teacherRes.data);
        } else {
          throw new Error('Không tìm thấy thông tin giảng viên');
        }

        if (performanceRes.success && performanceRes.data) {
          setPerformance(performanceRes.data);
        }

        if (classesRes.success && classesRes.data) {
          setClasses(classesRes.data);
        }
      } catch (err: any) {
        console.error('Error fetching teacher data:', err);
        
        // Provide more specific error messages
        if (err.response?.status === 404) {
          setError('Không tìm thấy giảng viên với ID này. Vui lòng kiểm tra lại đường dẫn.');
        } else if (err.response?.status === 401 || err.response?.status === 403) {
          setError('Bạn cần đăng nhập để xem thông tin chi tiết giảng viên.');
        } else {
          setError(err.message || 'Không thể tải thông tin giảng viên. Vui lòng thử lại sau.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '16px',
        }}>
          <Loader className="animate-spin" size={40} color="#f59e0b" />
          <p style={{ color: '#6b7280', fontSize: '16px' }}>Đang tải thông tin giảng viên...</p>
        </div>
      </Layout>
    );
  }

  if (error || !teacher) {
    return (
      <Layout>
        <div style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '16px',
        }}>
          <p style={{ color: '#dc2626', fontSize: '18px', fontWeight: '600' }}>
            {error || 'Không tìm thấy thông tin giảng viên'}
          </p>
          <button
            onClick={() => navigate('/teachers')}
            style={{
              padding: '10px 24px',
              background: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
            }}
          >
            Quay lại danh sách
          </button>
        </div>
      </Layout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#10b981';
      case 'completed':
        return '#6b7280';
      case 'upcoming':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Đang diễn ra';
      case 'completed':
        return 'Đã kết thúc';
      case 'upcoming':
        return 'Sắp diễn ra';
      default:
        return status;
    }
  };

  return (
    <>
      <SEOHead
        title={`${teacher.users.full_name} - Giảng viên DMT Education`}
        description={`Thông tin chi tiết về giảng viên ${teacher.users.full_name} tại DMT Education`}
        keywords={`${teacher.users.full_name}, giảng viên, ${teacher.specialization}, DMT Education`}
      />

      <Layout>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '40px 20px',
        }}>
          {/* Back Button */}
          <button
            onClick={() => navigate('/teachers')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: 'transparent',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '24px',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f9fafb';
              e.currentTarget.style.borderColor = '#d1d5db';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
          >
            <ChevronLeft size={18} />
            Quay lại danh sách
          </button>

          {/* Teacher Profile Header */}
          <div style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            borderRadius: '16px',
            padding: '40px',
            marginBottom: '32px',
            boxShadow: '0 10px 40px rgba(245, 158, 11, 0.2)',
          }}>
            <div style={{
              display: 'flex',
              gap: '32px',
              alignItems: 'start',
              flexWrap: 'wrap',
            }}>
              {/* Avatar */}
              <div style={{
                width: '160px',
                height: '160px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '5px solid white',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                flexShrink: 0,
              }}>
                <img
                  src={teacher.users.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.users.full_name)}&size=160&background=random`}
                  alt={teacher.users.full_name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>

              {/* Info */}
              <div style={{ flex: 1, color: 'white' }}>
                <div style={{
                  display: 'inline-block',
                  padding: '6px 14px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  marginBottom: '12px',
                }}>
                  {teacher.teacher_code || 'N/A'}
                </div>

                <h1 style={{
                  fontSize: '36px',
                  fontWeight: '800',
                  marginBottom: '8px',
                  color: 'white',
                }}>
                  {teacher.users.full_name}
                </h1>

                <div style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <BookOpen size={20} />
                  {teacher.subjects?.name || teacher.specialization || 'Giảng viên'}
                </div>

                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '20px',
                  marginTop: '20px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Briefcase size={18} />
                    <span>{teacher.years_experience || 0} năm kinh nghiệm</span>
                  </div>
                  {teacher.degree && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <GraduationCap size={18} />
                      <span>{teacher.degree}</span>
                    </div>
                  )}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '4px 12px',
                    background: teacher.users.status ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    borderRadius: '20px',
                  }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: teacher.users.status ? '#10b981' : '#ef4444',
                    }} />
                    <span>{teacher.users.status ? 'Đang hoạt động' : 'Không hoạt động'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '32px',
            borderBottom: '2px solid #e5e7eb',
          }}>
            {[
              { id: 'overview' as const, label: 'Tổng quan', icon: User },
              { id: 'classes' as const, label: 'Lớp học', icon: BookOpen },
              { id: 'performance' as const, label: 'Hiệu suất', icon: TrendingUp },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: `3px solid ${activeTab === tab.id ? '#f59e0b' : 'transparent'}`,
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: activeTab === tab.id ? '700' : '500',
                  color: activeTab === tab.id ? '#f59e0b' : '#6b7280',
                  transition: 'all 0.3s ease',
                }}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '24px',
              }}>
                {/* Contact Information */}
                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    marginBottom: '20px',
                    color: '#1f2937',
                  }}>
                    Thông tin liên hệ
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Mail size={18} color="#f59e0b" />
                      <span style={{ color: '#6b7280' }}>{teacher.users.email}</span>
                    </div>
                    {teacher.users.phone && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Phone size={18} color="#f59e0b" />
                        <span style={{ color: '#6b7280' }}>{teacher.users.phone}</span>
                      </div>
                    )}
                    {teacher.users.address && (
                      <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                        <MapPin size={18} color="#f59e0b" style={{ marginTop: '2px' }} />
                        <span style={{ color: '#6b7280' }}>{teacher.users.address}</span>
                      </div>
                    )}
                    {teacher.users.birth_date && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Calendar size={18} color="#f59e0b" />
                        <span style={{ color: '#6b7280' }}>
                          {new Date(teacher.users.birth_date).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Academic Information */}
                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    marginBottom: '20px',
                    color: '#1f2937',
                  }}>
                    Thông tin học thuật
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {teacher.degree && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Award size={18} color="#f59e0b" />
                        <div>
                          <div style={{ fontSize: '12px', color: '#9ca3af' }}>Bằng cấp</div>
                          <div style={{ fontWeight: '600', color: '#374151' }}>{teacher.degree}</div>
                        </div>
                      </div>
                    )}
                    {teacher.specialization && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <BookOpen size={18} color="#f59e0b" />
                        <div>
                          <div style={{ fontSize: '12px', color: '#9ca3af' }}>Chuyên môn</div>
                          <div style={{ fontWeight: '600', color: '#374151' }}>{teacher.specialization}</div>
                        </div>
                      </div>
                    )}
                    {teacher.subjects && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <GraduationCap size={18} color="#f59e0b" />
                        <div>
                          <div style={{ fontSize: '12px', color: '#9ca3af' }}>Môn học chính</div>
                          <div style={{ fontWeight: '600', color: '#374151' }}>{teacher.subjects.name}</div>
                        </div>
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Clock size={18} color="#f59e0b" />
                      <div>
                        <div style={{ fontSize: '12px', color: '#9ca3af' }}>Kinh nghiệm</div>
                        <div style={{ fontWeight: '600', color: '#374151' }}>
                          {teacher.years_experience || 0} năm
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Classes Tab */}
            {activeTab === 'classes' && (
              <div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  marginBottom: '20px',
                  color: '#1f2937',
                }}>
                  Danh sách lớp học ({classes.length})
                </h3>
                {classes.length === 0 ? (
                  <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '60px 20px',
                    textAlign: 'center',
                    color: '#9ca3af',
                  }}>
                    <BookOpen size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                    <p>Chưa có lớp học nào</p>
                  </div>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '20px',
                  }}>
                    {classes.map((cls) => (
                      <div
                        key={cls.id}
                        style={{
                          background: 'white',
                          borderRadius: '12px',
                          padding: '20px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                          border: '1px solid #e5e7eb',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-4px)';
                          e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'start',
                          marginBottom: '12px',
                        }}>
                          <div style={{
                            fontSize: '12px',
                            fontWeight: '700',
                            color: '#f59e0b',
                          }}>
                            {cls.class_code}
                          </div>
                          <div style={{
                            padding: '4px 10px',
                            background: `${getStatusColor(cls.status)}20`,
                            color: getStatusColor(cls.status),
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '600',
                          }}>
                            {getStatusText(cls.status)}
                          </div>
                        </div>

                        <h4 style={{
                          fontSize: '16px',
                          fontWeight: '700',
                          marginBottom: '8px',
                          color: '#1f2937',
                        }}>
                          {cls.courses?.name || 'Khóa học'}
                        </h4>

                        {cls.courses?.description && (
                          <p style={{
                            fontSize: '13px',
                            color: '#6b7280',
                            marginBottom: '12px',
                            lineHeight: '1.5',
                          }}>
                            {cls.courses.description}
                          </p>
                        )}

                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                          paddingTop: '12px',
                          borderTop: '1px solid #f3f4f6',
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '13px',
                            color: '#6b7280',
                          }}>
                            <Calendar size={14} />
                            <span>
                              {new Date(cls.start_date).toLocaleDateString('vi-VN')} -{' '}
                              {new Date(cls.end_date).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                          {cls.schedule && (
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              fontSize: '13px',
                              color: '#6b7280',
                            }}>
                              <Clock size={14} />
                              <span>{cls.schedule}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Performance Tab */}
            {activeTab === 'performance' && performance && (
              <div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  marginBottom: '20px',
                  color: '#1f2937',
                }}>
                  Thống kê hiệu suất
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '20px',
                }}>
                  {/* Total Classes */}
                  <div style={{
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    borderRadius: '16px',
                    padding: '24px',
                    color: 'white',
                    boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)',
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                    }}>
                      <BookOpen size={32} style={{ opacity: 0.9 }} />
                      <div style={{
                        fontSize: '32px',
                        fontWeight: '800',
                      }}>
                        {performance.total_classes}
                      </div>
                    </div>
                    <div style={{ fontSize: '14px', opacity: 0.9 }}>Tổng số lớp</div>
                  </div>

                  {/* Total Students */}
                  <div style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    borderRadius: '16px',
                    padding: '24px',
                    color: 'white',
                    boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)',
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                    }}>
                      <Users size={32} style={{ opacity: 0.9 }} />
                      <div style={{
                        fontSize: '32px',
                        fontWeight: '800',
                      }}>
                        {performance.total_students}
                      </div>
                    </div>
                    <div style={{ fontSize: '14px', opacity: 0.9 }}>Tổng số học sinh</div>
                  </div>

                  {/* Attendance Rate */}
                  <div style={{
                    background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                    borderRadius: '16px',
                    padding: '24px',
                    color: 'white',
                    boxShadow: '0 8px 20px rgba(139, 92, 246, 0.3)',
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                    }}>
                      <CheckCircle size={32} style={{ opacity: 0.9 }} />
                      <div style={{
                        fontSize: '32px',
                        fontWeight: '800',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}>
                        {performance.attendance_rate.toFixed(1)}
                        <span style={{ fontSize: '18px', opacity: 0.8 }}>%</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '14px', opacity: 0.9 }}>Tỷ lệ tham dự</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default TeacherDetailPage;
