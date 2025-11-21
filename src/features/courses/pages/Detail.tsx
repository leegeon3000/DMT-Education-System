import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCourseDetail, CourseCardData } from '../api';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorMessage from '../../../components/common/ErrorMessage';

const CourseDetail = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const [course, setCourse] = useState<CourseCardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCourseDetail = async () => {
            if (!courseId) {
                setError('ID khóa học không hợp lệ');
                setLoading(false);
                return;
            }
            
            try {
                const data = await getCourseDetail(courseId);
                setCourse(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải thông tin khóa học');
            } finally {
                setLoading(false);
            }
        };

        fetchCourseDetail();
    }, [courseId]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorMessage message={error} />;
    }

    if (!course) {
        return <ErrorMessage message="Không tìm thấy thông tin khóa học" />;
    }

    return (
        <div className="course-detail" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>{course.title}</h1>
            <p style={{ marginTop: '1rem', color: '#4B5563' }}>{course.description}</p>
            <h2 style={{ marginTop: '1.5rem', fontSize: '1.25rem' }}>Giảng viên: {course.instructor}</h2>
            <h3 style={{ marginTop: '1rem' }}>Thời gian: {course.duration}</h3>
            <h3 style={{ marginTop: '1rem' }}>Giá: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)}</h3>
            {course.studentsCount && (
                <h3 style={{ marginTop: '1rem' }}>Học viên: {course.studentsCount} người</h3>
            )}
            <button 
                style={{
                    marginTop: '1.5rem',
                    backgroundColor: '#3B82F6',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563EB'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3B82F6'}
            >
                Đăng ký ngay
            </button>
        </div>
    );
};

export default CourseDetail;