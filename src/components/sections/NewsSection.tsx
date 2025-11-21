import React, { useState, useEffect } from 'react';
import { AlertTriangle, Star } from 'lucide-react';
import { Icons } from '../common/Icons';
import { useOptimizedAnimation } from '../../hooks/useOptimizedAnimation';
import { newsApi, News } from '../../services/news';

const NewsSection: React.FC = () => {
  const { ref: newsRef, inView: newsInView } = useOptimizedAnimation();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await newsApi.getAll({
          status: 'published',
          limit: 3,
          page: 1
        });
        setNews(response.data);
      } catch (err: any) {
        console.error('Failed to load news:', err);
        setError('Không thể tải tin tức. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Type colors mapping
  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'news':
        return {
          bg: 'linear-gradient(135deg, #f59e0b, #d97706)',
          border: 'rgba(245, 158, 11, 0.2)',
          shadow: 'rgba(245, 158, 11, 0.4)',
          cardBg: 'linear-gradient(135deg, #fff 0%, #fefbf2 100%)',
          label: 'Tin tức'
        };
      case 'event':
        return {
          bg: 'linear-gradient(135deg, #22c55e, #16a34a)',
          border: 'rgba(34, 197, 94, 0.2)',
          shadow: 'rgba(34, 197, 94, 0.4)',
          cardBg: 'linear-gradient(135deg, #fff 0%, #f0fdf4 100%)',
          label: 'Sự kiện'
        };
      case 'announcement':
        return {
          bg: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
          border: 'rgba(59, 130, 246, 0.2)',
          shadow: 'rgba(59, 130, 246, 0.4)',
          cardBg: 'linear-gradient(135deg, #fff 0%, #f0f9ff 100%)',
          label: 'Thông báo'
        };
      default:
        return {
          bg: 'linear-gradient(135deg, #6b7280, #4b5563)',
          border: 'rgba(107, 114, 128, 0.2)',
          shadow: 'rgba(107, 114, 128, 0.4)',
          cardBg: 'linear-gradient(135deg, #fff 0%, #f9fafb 100%)',
          label: 'Khác'
        };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  return (
    <section id="news" ref={newsRef} style={{
      padding: '80px 1rem',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decorations */}
      <div style={{
        position: 'absolute',
        top: '5%',
        right: '10%',
        width: '120px',
        height: '120px',
        background: 'linear-gradient(45deg, rgba(249, 115, 22, 0.1), rgba(245, 158, 11, 0.1))',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '5%',
        width: '90px',
        height: '90px',
        background: 'linear-gradient(45deg, rgba(168, 85, 247, 0.1), rgba(147, 51, 234, 0.1))',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite reverse'
      }}></div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div className={`transform transition-all duration-1000 ${newsInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 style={{
              fontSize: '42px',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #111827, #374151)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '20px'
            }}>
              Tin tức & Sự kiện
            </h2>
            <p style={{
              fontSize: '18px',
              color: '#64748b',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Cập nhật những tin tức mới nhất về chương trình học, sự kiện và thành tích của DMT Education
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{
            textAlign: 'center',
            padding: '60px 0',
            color: '#64748b'
          }}>
            <div style={{
              display: 'inline-block',
              width: '50px',
              height: '50px',
              border: '4px solid rgba(99, 102, 241, 0.2)',
              borderTopColor: '#6366f1',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ marginTop: '20px', fontSize: '16px' }}>Đang tải tin tức...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '16px',
            border: '1px solid rgba(239, 68, 68, 0.3)'
          }}>
            <p style={{ color: '#dc2626', fontSize: '16px', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <AlertTriangle className="w-5 h-5" />
              {error}
            </p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                background: '#6366f1',
                color: 'white',
                padding: '10px 24px',
                borderRadius: '20px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                marginTop: '10px'
              }}
            >
              Thử lại
            </button>
          </div>
        )}

        {/* News Grid */}
        {!loading && !error && news.length > 0 && (
          <div 
            className={`transform transition-all duration-1000 delay-200 ${newsInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '30px'
            }}
          >
            {news.map((item, index) => {
              const typeStyle = getTypeStyle(item.type);
              return (
                <article 
                  key={item.id}
                  style={{
                    background: typeStyle.cardBg,
                    borderRadius: '24px',
                    overflow: 'hidden',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    border: `1px solid ${typeStyle.border}`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                    {item.image_url ? (
                      <img 
                        src={item.image_url}
                        alt={item.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease'
                        }}
                        onError={(e) => {
                          // Fallback image if load fails
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=400&fit=crop&auto=format&q=80';
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, #e5e7eb 0%, #f3f4f6 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#9ca3af'
                      }}>
                        <Icons.Image size={48} />
                      </div>
                    )}
                    <div style={{
                      position: 'absolute',
                      top: '15px',
                      left: '15px',
                      background: typeStyle.bg,
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '25px',
                      fontSize: '12px',
                      fontWeight: '600',
                      boxShadow: `0 4px 15px ${typeStyle.shadow}`
                    }}>
                      {typeStyle.label}
                    </div>
                    {item.is_featured && (
                      <div style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        background: 'rgba(0, 0, 0, 0.6)',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Star className="w-3 h-3" fill="currentColor" />
                        Nổi bật
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '25px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      marginBottom: '15px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        color: '#6b7280',
                        fontSize: '14px'
                      }}>
                        <div style={{ transform: 'scale(0.7)', transformOrigin: 'center' }}>
                          <Icons.Calendar />
                        </div>
                        <span>{formatDate(item.published_at || item.created_at)}</span>
                      </div>
                    </div>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#111827',
                      marginBottom: '12px',
                      lineHeight: '1.3',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {item.title}
                    </h3>
                    {item.excerpt && (
                      <p style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        lineHeight: '1.6',
                        marginBottom: '20px',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {item.excerpt}
                      </p>
                    )}
                    <button style={{
                      background: typeStyle.bg,
                      color: 'white',
                      padding: '10px 20px',
                      borderRadius: '20px',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      boxShadow: `0 4px 15px ${typeStyle.shadow}`,
                      transition: 'all 0.3s ease'
                    }}>
                      Đọc thêm
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && news.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#64748b'
          }}>
            <Icons.Newspaper size={64} style={{ opacity: 0.3, margin: '0 auto 20px' }} />
            <p style={{ fontSize: '18px', fontWeight: '600' }}>Chưa có tin tức nào</p>
            <p style={{ fontSize: '14px', marginTop: '10px' }}>Vui lòng quay lại sau để xem tin tức mới nhất</p>
          </div>
        )}

        {/* View All News Button */}
        {!loading && !error && news.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <div className={`transform transition-all duration-1000 delay-400 ${newsInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <button style={{
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                color: 'white',
                padding: '15px 40px',
                borderRadius: '30px',
                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)',
                transition: 'all 0.3s ease'
              }}>
                Xem tất cả tin tức
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsSection;
