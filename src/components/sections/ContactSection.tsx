import React, { useState } from 'react';
import { CheckCircle, Lightbulb, XCircle, MessageCircle } from 'lucide-react';
import { Icons } from '../common/Icons';
import { useOptimizedAnimation } from '../../hooks/useOptimizedAnimation';
import { BackgroundSection, SECTION_BACKGROUNDS } from '../common';

interface FormData {
  name: string;
  phone: string;
  email: string;
  course: string;
  message: string;
}

const ContactSection: React.FC = () => {
  const { ref: contactRef, inView: contactInView } = useOptimizedAnimation();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    course: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setFormData({
        name: '',
        phone: '',
        email: '',
        course: '',
        message: ''
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  return (
    <BackgroundSection
      id="contact"
      backgroundImage={SECTION_BACKGROUNDS.contact.image}
      overlay={SECTION_BACKGROUNDS.contact.overlay}
      overlayColor={SECTION_BACKGROUNDS.contact.overlayColor}
      parallax={SECTION_BACKGROUNDS.contact.parallax}
      style={{
        padding: '80px 1rem',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div ref={contactRef}>
        {/* Enhanced Background Pattern for better visibility */}
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255, 215, 0, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255, 140, 0, 0.1) 0%, transparent 50%)',
          zIndex: 0
        }}></div>

        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1
        }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div className={`transform transition-all duration-1000 ${contactInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 style={{
              fontSize: '42px',
              fontWeight: '800',
              color: 'white', // Changed to white for better contrast
              marginBottom: '20px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}>
              Liên hệ tư vấn
            </h2>
            <p style={{
              fontSize: '18px',
              color: 'rgba(255, 255, 255, 0.9)', // Changed to white with transparency
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: '1.6',
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
            }}>
              Để lại thông tin để được tư vấn miễn phí về khóa học phù hợp nhất với bạn
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
          gap: '60px',
          alignItems: 'start'
        }}>
          {/* Contact Form */}
          <div 
            className={`transform transition-all duration-1000 delay-200 ${contactInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            style={{
              background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)',
              borderRadius: '20px',
              padding: '40px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.5)'
            }}
          >
            <h3 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '30px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              Đăng ký tư vấn miễn phí
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Họ và tên *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Nhập họ và tên của bạn"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '2px solid #e5e7eb',
                    fontSize: '16px',
                    transition: 'all 0.3s ease',
                    backgroundColor: '#fff'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#dc2626';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Số điện thoại *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="Nhập số điện thoại"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '2px solid #e5e7eb',
                    fontSize: '16px',
                    transition: 'all 0.3s ease',
                    backgroundColor: '#fff'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#dc2626';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Nhập email của bạn"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '2px solid #e5e7eb',
                    fontSize: '16px',
                    transition: 'all 0.3s ease',
                    backgroundColor: '#fff'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#dc2626';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Khóa học quan tâm
                </label>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '2px solid #e5e7eb',
                    fontSize: '16px',
                    transition: 'all 0.3s ease',
                    backgroundColor: '#fff'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#dc2626';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <option value="">Chọn khóa học</option>
                  <option value="ielts-intensive">IELTS Intensive</option>
                  <option value="toan-tu-duy">Toán Tư duy</option>
                  <option value="lap-trinh-junior">Lập trình Junior</option>
                  <option value="tieng-viet-nang-cao">Tiếng Việt nâng cao</option>
                  <option value="khoa-hoc-tu-nhien">Khoa học tự nhiên</option>
                  <option value="ielts-junior">IELTS Junior</option>
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Lời nhắn
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Để lại lời nhắn hoặc câu hỏi của bạn..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '2px solid #e5e7eb',
                    fontSize: '16px',
                    transition: 'all 0.3s ease',
                    backgroundColor: '#fff',
                    resize: 'vertical'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#dc2626';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  background: isSubmitting ? '#9ca3af' : 'linear-gradient(135deg, #dc2626, #f43f5e)',
                  color: 'white',
                  padding: '15px 30px',
                  borderRadius: '25px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 8px 25px rgba(220, 38, 38, 0.3)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(220, 38, 38, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(220, 38, 38, 0.3)';
                  }
                }}
              >
                {isSubmitting ? (
                  <>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid #ffffff',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    Đang gửi...
                  </>
                ) : (
                  <>
                    Gửi thông tin tư vấn
                  </>
                )}
              </button>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  backgroundColor: '#d1fae5',
                  border: '1px solid #10b981',
                  color: '#065f46',
                  fontSize: '14px',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}>
                  <CheckCircle size={18} /> Cảm ơn bạn! Chúng tôi sẽ liên hệ với bạn trong 24h.
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  backgroundColor: '#fee2e2',
                  border: '1px solid #ef4444',
                  color: '#991b1b',
                  fontSize: '14px',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}>
                  <XCircle size={18} /> Có lỗi xảy ra. Vui lòng thử lại hoặc gọi hotline.
                </div>
              )}
            </form>
          </div>

          {/* Contact Information */}
          <div 
            className={`transform transition-all duration-1000 delay-400 ${contactInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '30px'
            }}
          >
            {/* Hotline */}
            <div style={{
              background: 'linear-gradient(135deg, #fff 0%, #f0f9ff 100%)',
              borderRadius: '20px',
              padding: '30px',
              boxShadow: '0 15px 35px rgba(59, 130, 246, 0.1)',
              border: '2px solid rgba(59, 130, 246, 0.1)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '15px',
                  color: 'white',
                  boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)'
                }}>
                  <Icons.ContactPhone />
                </div>
                <div>
                  <h4 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#111827',
                    marginBottom: '4px'
                  }}>
                    Hotline tư vấn
                  </h4>
                  <p style={{
                    fontSize: '13px',
                    color: '#6b7280'
                  }}>
                    Hỗ trợ 24/7
                  </p>
                </div>
              </div>
              <a 
                href="tel:0772305566"
                style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#3b82f6',
                  textDecoration: 'none',
                  display: 'block',
                  textAlign: 'center',
                  padding: '10px',
                  borderRadius: '10px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#3b82f6';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#3b82f6';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                077 230 5566
              </a>
            </div>

            {/* Quick Contact Methods */}
            <div style={{
              background: 'linear-gradient(135deg, #fff 0%, #f0fdf4 100%)',
              borderRadius: '20px',
              padding: '30px',
              boxShadow: '0 15px 35px rgba(34, 197, 94, 0.1)',
              border: '2px solid rgba(34, 197, 94, 0.1)'
            }}>
              <h4 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <Icons.Gift />
                Liên hệ nhanh
              </h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <a
                  href="https://zalo.me/0772305566"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    backgroundColor: '#0068ff',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 104, 255, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <MessageCircle size={18} />
                  Chat Zalo
                </a>

                <a
                  href="https://m.me/dmteducation"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    backgroundColor: '#1877f2',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(24, 119, 242, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <Icons.Facebook />
                  Messenger
                </a>

                <a
                  href="mailto:info@dmteducation.vn"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    backgroundColor: '#059669',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(5, 150, 105, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <Icons.Email />
                  Email
                </a>
              </div>
            </div>

            {/* Working Hours */}
            <div style={{
              background: 'linear-gradient(135deg, #fff 0%, #fefce8 100%)',
              borderRadius: '20px',
              padding: '30px',
              boxShadow: '0 15px 35px rgba(245, 158, 11, 0.1)',
              border: '2px solid rgba(245, 158, 11, 0.1)'
            }}>
              <h4 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <Icons.Calendar />
                Giờ làm việc
              </h4>
              
              <div style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6' }}>
                <div style={{ marginBottom: '8px' }}>
                  <strong>Thứ 2 - Thứ 6:</strong> 7:00 - 21:00
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <strong>Thứ 7 - Chủ nhật:</strong> 8:00 - 20:00
                </div>
                <div style={{
                  marginTop: '15px',
                  padding: '10px',
                  backgroundColor: 'rgba(245, 158, 11, 0.1)',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: '#92400e'
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Lightbulb size={16} /> <strong>Lưu ý:</strong>
                  </span> Tư vấn online 24/7 qua Zalo/Facebook
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* CSS Animation */}
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </BackgroundSection>
  );
};

export default ContactSection;