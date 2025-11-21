import React, { useEffect, useState } from 'react';
import { coursesApi } from '../../../services/courses';
import CourseCard from '../components/CourseCard'; // Assuming you have a CourseCard component for displaying individual courses
import Loader from '../../../components/common/Loader'; // Assuming you have a Loader component for loading state
import ErrorMessage from '../../../components/common/ErrorMessage'; // Assuming you have an ErrorMessage component for error handling

// Interface for Course data from API
interface Course {
    id: number;
    subject_id: number;
    code: string;
    name: string;
    description?: string;
    duration_weeks: number;
    total_sessions: number;
    price?: number;
    level: 'beginner' | 'intermediate' | 'advanced';
    is_active: boolean;
    created_at: string;
    subjects: {
        id: number;
        name: string;
        code: string;
        description?: string;
    };
}

// Transform API Course to CourseCardData format
interface CourseCardData {
    id: string;
    title: string;
    description: string;
    instructor: string;
    duration: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    price: number;
    thumbnail?: string;
    studentsCount?: number;
}

const transformCourse = (course: Course): CourseCardData => {
    return {
        id: course.id.toString(),
        title: course.name,
        description: course.description || '',
        instructor: course.subjects?.name || 'DMT Education',
        duration: `${course.duration_weeks} tuần`,
        level: course.level,
        price: course.price || 0,
        thumbnail: undefined,
        studentsCount: undefined
    };
};

const Catalog = () => {
    const [courses, setCourses] = useState<CourseCardData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadCourses = async () => {
            try {
                const response = await coursesApi.getAll({ page: 1, limit: 100, is_active: true });
                if (response.success) {
                    const transformedCourses = response.data.map(transformCourse);
                    setCourses(transformedCourses);
                } else {
                    setError('Không thể tải danh sách khóa học');
                }
            } catch (err) {
                console.error('Error loading courses:', err);
                setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải danh sách khóa học');
            } finally {
                setLoading(false);
            }
        };

        loadCourses();
    }, []);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <ErrorMessage message={error} />;
    }

    return (
        <div className="catalog">
            <h1 className="text-2xl font-bold mb-4">Course Catalog</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map(course => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </div>
        </div>
    );
};

export default Catalog;