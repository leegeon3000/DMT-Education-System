import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { SEOHead } from '../components/common';
import { teachersApi, Teacher } from '../services/academic';
import {
  Search,
  Filter,
  Loader,
  User,
  Mail,
  Phone,
  BookOpen,
  Award,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Briefcase,
} from 'lucide-react';

const TeachersListPage: React.FC = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>(undefined);
  const [subjectFilter, setSubjectFilter] = useState<number | undefined>(undefined);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const limit = 12;

  useEffect(() => {
    fetchTeachers();
  }, [currentPage, searchQuery, statusFilter, subjectFilter]);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await teachersApi.getAll({
        page: currentPage,
        limit,
        search: searchQuery || undefined,
        status: statusFilter,
        main_subject_id: subjectFilter,
      });

      if (response.success && response.data) {
        setTeachers(response.data);
        if (response.pagination) {
          setTotalPages(response.pagination.pages);
          setTotalTeachers(response.pagination.total);
        }
      } else {
        throw new Error('Không thể tải danh sách giảng viên');
      }
    } catch (err: any) {
      console.error('Error fetching teachers:', err);
      
      // Check error type
      if (err.response?.status === 404) {
        setError('API endpoint không tồn tại. Vui lòng kiểm tra backend server đang chạy.');
      } else if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Bạn cần đăng nhập để xem danh sách giảng viên.');
      } else {
        setError(err.message || 'Không thể tải danh sách giảng viên. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchTeachers();
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter(undefined);
    setSubjectFilter(undefined);
    setCurrentPage(1);
  };

  return (
    <>
      <SEOHead
        title="Danh sách giảng viên - DMT Education"
        description="Xem danh sách đầy đủ các giảng viên tại DMT Education"
        keywords="giảng viên, giáo viên, DMT Education, danh sách"
      />

      <Layout>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '40px 20px',
        }}>
          {/* Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '40px',
          }}>
            <h1 style={{
              fontSize: '42px',
              fontWeight: '800',
              color: '#1f2937',
              marginBottom: '12px',
            }}>
              Đội ngũ giảng viên
            </h1>
            <p style={{
              fontSize: '18px',
              color: '#6b7280',
              maxWidth: '700px',
              margin: '0 auto',
            }}>
              Đội ngũ giảng viên giàu kinh nghiệm và tận tâm của DMT Education
            </p>
          </div>

          {/* Search and Filters */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '32px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          }}>
            <form onSubmit={handleSearch} style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              alignItems: 'end',
            }}>
              {/* Search Input */}
              <div style={{ flex: '1 1 300px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px',
                }}>
                  Tìm kiếm
                </label>
                <div style={{ position: 'relative' }}>
                  <Search
                    size={18}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#9ca3af',
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Tìm theo tên, email, mã giảng viên..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 40px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#f59e0b';
                      e.target.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div style={{ flex: '0 1 200px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px',
                }}>
                  Trạng thái
                </label>
                <select
                  value={statusFilter === undefined ? '' : statusFilter ? 'true' : 'false'}
                  onChange={(e) => {
                    const value = e.target.value;
                    setStatusFilter(value === '' ? undefined : value === 'true');
                    setCurrentPage(1);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    cursor: 'pointer',
                    background: 'white',
                  }}
                >
                  <option value="">Tất cả</option>
                  <option value="true">Đang hoạt động</option>
                  <option value="false">Không hoạt động</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '12px',
              }}>
                <button
                  type="submit"
                  style={{
                    padding: '10px 24px',
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <Search size={16} />
                  Tìm kiếm
                </button>

                <button
                  type="button"
                  onClick={resetFilters}
                  style={{
                    padding: '10px 24px',
                    background: 'white',
                    color: '#6b7280',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f9fafb';
                    e.currentTarget.style.borderColor = '#d1d5db';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }}
                >
                  Xóa bộ lọc
                </button>
              </div>
            </form>
          </div>

          {/* Results Info */}
          {!loading && (
            <div style={{
              marginBottom: '24px',
              fontSize: '14px',
              color: '#6b7280',
            }}>
              Hiển thị {teachers.length} / {totalTeachers} giảng viên
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div style={{
              minHeight: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '16px',
            }}>
              <Loader className="animate-spin" size={40} color="#f59e0b" />
              <p style={{ color: '#6b7280' }}>Đang tải danh sách giảng viên...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div style={{
              minHeight: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '16px',
            }}>
              <p style={{ color: '#dc2626', fontSize: '16px' }}>{error}</p>
              <button
                onClick={fetchTeachers}
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
                Thử lại
              </button>
            </div>
          )}

          {/* Teachers Grid */}
          {!loading && !error && teachers.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '24px',
              marginBottom: '40px',
            }}>
              {teachers.map((teacher) => (
                <div
                  key={teacher.id}
                  onClick={() => navigate(`/teachers/${teacher.id}`)}
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: '1px solid #e5e7eb',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
                  }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: '100%',
                    height: '280px',
                    overflow: 'hidden',
                    position: 'relative',
                    background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                  }}>
                    <img
                      src={teacher.users.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.users.full_name)}&size=300&background=random`}
                      alt={teacher.users.full_name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    
                    {/* Status Badge */}
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      padding: '6px 12px',
                      background: teacher.users.status
                        ? 'rgba(16, 185, 129, 0.9)'
                        : 'rgba(239, 68, 68, 0.9)',
                      color: 'white',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: '600',
                      backdropFilter: 'blur(8px)',
                    }}>
                      {teacher.users.status ? 'Đang hoạt động' : 'Không hoạt động'}
                    </div>

                    {/* Teacher Code */}
                    <div style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '12px',
                      padding: '6px 12px',
                      background: 'rgba(0, 0, 0, 0.7)',
                      color: 'white',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: '600',
                      backdropFilter: 'blur(8px)',
                    }}>
                      {teacher.teacher_code || 'N/A'}
                    </div>
                  </div>

                  {/* Info */}
                  <div style={{ padding: '20px' }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#1f2937',
                      marginBottom: '8px',
                    }}>
                      {teacher.users.full_name}
                    </h3>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '12px',
                      color: '#f59e0b',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}>
                      <BookOpen size={16} />
                      {teacher.subjects?.name || teacher.specialization || 'Giảng viên'}
                    </div>

                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      marginBottom: '16px',
                    }}>
                      {teacher.users.email && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '13px',
                          color: '#6b7280',
                        }}>
                          <Mail size={14} />
                          <span style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}>
                            {teacher.users.email}
                          </span>
                        </div>
                      )}
                      {teacher.users.phone && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '13px',
                          color: '#6b7280',
                        }}>
                          <Phone size={14} />
                          <span>{teacher.users.phone}</span>
                        </div>
                      )}
                    </div>

                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                      paddingTop: '16px',
                      borderTop: '1px solid #f3f4f6',
                    }}>
                      {teacher.degree && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 10px',
                          background: '#f3f4f6',
                          borderRadius: '12px',
                          fontSize: '11px',
                          color: '#6b7280',
                          fontWeight: '600',
                        }}>
                          <GraduationCap size={12} />
                          {teacher.degree}
                        </div>
                      )}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 10px',
                        background: '#fef3c7',
                        borderRadius: '12px',
                        fontSize: '11px',
                        color: '#92400e',
                        fontWeight: '600',
                      }}>
                        <Briefcase size={12} />
                        {teacher.years_experience || 0} năm
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && !error && teachers.length === 0 && (
            <div style={{
              minHeight: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '16px',
            }}>
              <User size={64} color="#d1d5db" />
              <p style={{ color: '#9ca3af', fontSize: '16px' }}>
                Không tìm thấy giảng viên nào
              </p>
              <button
                onClick={resetFilters}
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
                Xóa bộ lọc
              </button>
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '12px',
              marginTop: '40px',
            }}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  padding: '10px 16px',
                  background: currentPage === 1 ? '#f3f4f6' : 'white',
                  color: currentPage === 1 ? '#9ca3af' : '#374151',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== 1) {
                    e.currentTarget.style.background = '#f9fafb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== 1) {
                    e.currentTarget.style.background = 'white';
                  }
                }}
              >
                <ChevronLeft size={16} />
                Trước
              </button>

              <div style={{
                display: 'flex',
                gap: '8px',
              }}>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      style={{
                        padding: '10px 16px',
                        background: currentPage === pageNum
                          ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                          : 'white',
                        color: currentPage === pageNum ? 'white' : '#374151',
                        border: '1px solid',
                        borderColor: currentPage === pageNum ? '#f59e0b' : '#e5e7eb',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        minWidth: '44px',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (currentPage !== pageNum) {
                          e.currentTarget.style.background = '#f9fafb';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentPage !== pageNum) {
                          e.currentTarget.style.background = 'white';
                        }
                      }}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  padding: '10px 16px',
                  background: currentPage === totalPages ? '#f3f4f6' : 'white',
                  color: currentPage === totalPages ? '#9ca3af' : '#374151',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== totalPages) {
                    e.currentTarget.style.background = '#f9fafb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== totalPages) {
                    e.currentTarget.style.background = 'white';
                  }
                }}
              >
                Sau
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
};

export default TeachersListPage;
