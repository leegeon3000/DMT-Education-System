import React from 'react';
import { GraduationCap, Clock, Users } from 'lucide-react';

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description: string;
    instructor: string;
    duration: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    price: number;
    thumbnail?: string;
    studentsCount?: number;
  };
  onClick?: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onClick }) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return '#10B981';
      case 'intermediate': return '#F59E0B';
      case 'advanced': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(price);
  };

  return (
    <div 
      onClick={onClick}
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        border: '1px solid #E5E7EB',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
    >
      {/* Course Thumbnail */}
      <div style={{
        width: '100%',
        height: '180px',
        backgroundColor: '#F3F4F6',
        backgroundImage: course.thumbnail ? `url(${course.thumbnail})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '1.2rem',
        fontWeight: '600'
      }}>
        {!course.thumbnail && course.title}
      </div>

      {/* Course Content */}
      <div style={{ padding: '1.5rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#111827',
              margin: 0,
              flex: 1,
              lineHeight: '1.4'
            }}>
              {course.title}
            </h3>
            <span style={{
              padding: '0.25rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: '500',
              backgroundColor: getLevelColor(course.level) + '20',
              color: getLevelColor(course.level),
              marginLeft: '0.5rem'
            }}>
              {course.level}
            </span>
          </div>
          
          <p style={{
            color: '#6B7280',
            fontSize: '0.9rem',
            margin: '0 0 0.75rem 0',
            lineHeight: '1.5'
          }}>
            {course.description}
          </p>
        </div>

        {/* Course Info */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '1rem',
          fontSize: '0.85rem',
          color: '#6B7280'
        }}>
          <div>
            <div style={{ marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GraduationCap size={16} /> {course.instructor}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={16} /> {course.duration}
            </div>
          </div>
          {course.studentsCount && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <Users size={16} /> {course.studentsCount} học viên
              </div>
            </div>
          )}
        </div>

        {/* Price */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '1rem',
          borderTop: '1px solid #E5E7EB'
        }}>
          <span style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#059669'
          }}>
            {formatPrice(course.price)}
          </span>
          <button style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#3B82F6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.9rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563EB'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3B82F6'}
          >
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
