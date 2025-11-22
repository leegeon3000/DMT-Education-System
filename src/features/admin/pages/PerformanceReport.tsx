import React, { useState, useEffect } from 'react';
import { apiClient } from '../../../services/auth';
import {
  Award,
  BarChart,
  Users,
  Book,
  Calendar,
  TrendingUp,
  TrendingDown,
  User,
  Download,
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
  XCircle
} from 'lucide-react';

// Types
interface PerformanceData {
  id: string;
  courseId: string;
  courseName: string;
  teacherId: string;
  teacherName: string;
  month: string;
  year: number;
  averageScore: number;
  passRate: number;
  attendanceRate: number;
  totalStudents: number;
  highPerformers: number;
  lowPerformers: number;
  improvementRate: number;
  notes?: string;
}

interface StudentPerformance {
  studentId: string;
  studentName: string;
  currentScore: number;
  previousScore: number;
  attendance: number;
  assignments: number;
  improvement: number;
}

interface CoursePerformance {
  id: string;
  courseId: string;
  courseName: string;
  month: string;
  year: number;
  averageScore: number;
  students: StudentPerformance[];
}

// Sample data
const mockPerformanceData: PerformanceData[] = [
  {
    id: 'PERF-2301',
    courseId: 'CRS-2001',
    courseName: 'Tiếng Anh nâng cao',
    teacherId: 'TCH-001',
    teacherName: 'Nguyễn Thị Ánh',
    month: '11',
    year: 2023,
    averageScore: 82.5,
    passRate: 90,
    attendanceRate: 85,
    totalStudents: 20,
    highPerformers: 8,
    lowPerformers: 2,
    improvementRate: 15,
    notes: 'Kết quả tốt, đa số học viên có tiến bộ so với tháng trước'
  },
  {
    id: 'PERF-2302',
    courseId: 'CRS-2003',
    courseName: 'Luyện thi IELTS',
    teacherId: 'TCH-002',
    teacherName: 'Trần Văn Bình',
    month: '11',
    year: 2023,
    averageScore: 78.3,
    passRate: 85,
    attendanceRate: 95,
    totalStudents: 15,
    highPerformers: 5,
    lowPerformers: 1,
    improvementRate: 20,
    notes: 'Đáng chú ý cải thiện ở phần Speaking và Listening'
  },
  {
    id: 'PERF-2303',
    courseId: 'CRS-2002',
    courseName: 'Tiếng Anh giao tiếp',
    teacherId: 'TCH-003',
    teacherName: 'Lê Thị Cúc',
    month: '11',
    year: 2023,
    averageScore: 76.0,
    passRate: 80,
    attendanceRate: 75,
    totalStudents: 12,
    highPerformers: 3,
    lowPerformers: 2,
    improvementRate: 8,
    notes: 'Cần chú ý cải thiện tỉ lệ điểm danh của lớp'
  },
  {
    id: 'PERF-2304',
    courseId: 'CRS-2005',
    courseName: 'Luyện thi TOEIC',
    teacherId: 'TCH-004',
    teacherName: 'Phạm Văn Dũng',
    month: '11',
    year: 2023,
    averageScore: 85.7,
    passRate: 95,
    attendanceRate: 100,
    totalStudents: 10,
    highPerformers: 7,
    lowPerformers: 0,
    improvementRate: 25,
    notes: 'Kết quả xuất sắc, đặc biệt phần Reading và Listening'
  },
  {
    id: 'PERF-2305',
    courseId: 'CRS-2004',
    courseName: 'Tiếng Anh cho trẻ em',
    teacherId: 'TCH-005',
    teacherName: 'Hoàng Thị Em',
    month: '11',
    year: 2023,
    averageScore: 89.2,
    passRate: 100,
    attendanceRate: 90,
    totalStudents: 15,
    highPerformers: 10,
    lowPerformers: 0,
    improvementRate: 18,
    notes: 'Phương pháp học qua trò chơi tương tác rất hiệu quả'
  },
  {
    id: 'PERF-2306',
    courseId: 'CRS-2006',
    courseName: 'Tiếng Anh thương mại',
    teacherId: 'TCH-006',
    teacherName: 'Vũ Văn Giang',
    month: '11',
    year: 2023,
    averageScore: 80.1,
    passRate: 88,
    attendanceRate: 85,
    totalStudents: 18,
    highPerformers: 6,
    lowPerformers: 2,
    improvementRate: 12,
    notes: 'Học viên thích ứng tốt với các tình huống thực tế'
  },
  {
    id: 'PERF-2307',
    courseId: 'CRS-2008',
    courseName: 'Tiếng Anh chuyên ngành IT',
    teacherId: 'TCH-007',
    teacherName: 'Đinh Văn Hiếu',
    month: '10',
    year: 2023,
    averageScore: 83.5,
    passRate: 90,
    attendanceRate: 83,
    totalStudents: 12,
    highPerformers: 5,
    lowPerformers: 1,
    improvementRate: 15,
    notes: 'Học viên nắm vững các thuật ngữ chuyên ngành'
  },
  {
    id: 'PERF-2308',
    courseId: 'CRS-2005',
    courseName: 'Luyện thi TOEIC',
    teacherId: 'TCH-004',
    teacherName: 'Phạm Văn Dũng',
    month: '10',
    year: 2023,
    averageScore: 82.3,
    passRate: 90,
    attendanceRate: 95,
    totalStudents: 10,
    highPerformers: 6,
    lowPerformers: 1,
    improvementRate: 15,
    notes: 'Phương pháp ôn luyện theo dạng đề có hiệu quả'
  },
];

// Generate student performance data for each course
const mockCoursePerformance: { [key: string]: CoursePerformance } = {};
mockPerformanceData.forEach(record => {
  const students: StudentPerformance[] = Array.from({ length: record.totalStudents }, (_, i) => {
    const currentScore = Math.min(100, Math.max(50, record.averageScore + (Math.random() * 20 - 10)));
    const previousScore = Math.min(100, Math.max(50, currentScore - (Math.random() * record.improvementRate)));
    const attendance = Math.min(100, Math.max(60, record.attendanceRate + (Math.random() * 20 - 10)));
    
    return {
      studentId: `STU-${1000 + i}`,
      studentName: `Học viên ${i + 1}`,
      currentScore,
      previousScore,
      attendance,
      assignments: Math.floor(Math.random() * 10) + 5, // 5-15 assignments
      improvement: ((currentScore - previousScore) / previousScore) * 100
    };
  });

  mockCoursePerformance[record.id] = {
    id: record.id,
    courseId: record.courseId,
    courseName: record.courseName,
    month: record.month,
    year: record.year,
    averageScore: record.averageScore,
    students
  };
});

const PerformanceReport: React.FC = () => {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [filteredData, setFilteredData] = useState<PerformanceData[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<CoursePerformance | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [monthFilter, setMonthFilter] = useState<string>('');
  const [courseFilter, setCourseFilter] = useState<string>('');
  const [showDetails, setShowDetails] = useState<boolean>(false);
  
  // Aggregate stats
  const [stats, setStats] = useState({
    averageScore: 0,
    totalCourses: 0,
    highPerforming: 0,
    lowPerforming: 0,
    overallImprovement: 0
  });

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch performance reports from API
        const response = await apiClient.get('/performance/reports');
        setPerformanceData(response.data);
        setFilteredData(response.data);

        // Fetch summary statistics from API
        const summaryResponse = await apiClient.get('/performance/summary');
        setStats(summaryResponse.data);
      } catch (err: any) {
        console.error('Error fetching performance data:', err);
        setError('Không thể tải dữ liệu hiệu suất. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPerformanceData();
  }, []);

  useEffect(() => {
    // Apply filters
    let result = [...performanceData];

    if (searchTerm) {
      result = result.filter(record => 
        record.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.teacherName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (monthFilter) {
      result = result.filter(record => record.month === monthFilter);
    }

    if (courseFilter) {
      result = result.filter(record => record.courseId === courseFilter);
    }

    setFilteredData(result);
  }, [performanceData, searchTerm, monthFilter, courseFilter]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleMonthFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMonthFilter(e.target.value);
  };

  const handleCourseFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCourseFilter(e.target.value);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setMonthFilter('');
    setCourseFilter('');
  };

  const handleViewDetails = async (recordId: string) => {
    try {
      const response = await apiClient.get(`/performance/reports/${recordId}`);
      setSelectedRecord(response.data);
      setShowDetails(true);
    } catch (err: any) {
      console.error('Error fetching performance details:', err);
      setError('Không thể tải chi tiết hiệu suất');
    }
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedRecord(null);
  };

  const handleExportReport = () => {
    // Implementation for exporting data to CSV or PDF
    alert('Xuất báo cáo đang được phát triển');
  };

  // Get unique courses for filter dropdown
  const uniqueCourses = Array.from(new Set(performanceData.map(record => record.courseId)))
    .map(courseId => {
      const course = performanceData.find(record => record.courseId === courseId);
      return {
        id: courseId,
        name: course?.courseName || ''
      };
    });

  // Get unique months for filter
  const uniqueMonths = Array.from(new Set(performanceData.map(record => record.month))).sort();

  // Helper for score color
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 75) return 'text-amber-600';
    return 'text-red-600';
  };
  
  // Helper for improvement color and icon
  const getImprovementDisplay = (rate: number) => {
    if (rate > 15) {
      return {
        icon: <TrendingUp className="h-4 w-4 mr-1 text-green-500" />,
        color: 'text-green-600'
      };
    } else if (rate > 5) {
      return {
        icon: <TrendingUp className="h-4 w-4 mr-1 text-amber-500" />,
        color: 'text-amber-600'
      };
    } else if (rate > 0) {
      return {
        icon: <TrendingUp className="h-4 w-4 mr-1 text-gray-500" />,
        color: 'text-gray-600'
      };
    } else {
      return {
        icon: <TrendingDown className="h-4 w-4 mr-1 text-red-500" />,
        color: 'text-red-600'
      };
    }
  };

  // Helper function to get month name
  const getMonthName = (monthNumber: string) => {
    const months = [
      'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 
      'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];
    return months[parseInt(monthNumber) - 1];
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-full mx-auto">
      {/* Header section */}
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Báo cáo hiệu suất</h1>
          <p className="mt-2 text-sm text-gray-700">
            Theo dõi và đánh giá hiệu quả học tập của học viên theo các khóa học và thời gian.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-2">
          <button
            onClick={handleExportReport}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Download className="h-4 w-4 mr-2" />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Điểm trung bình</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.averageScore}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Book className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Tổng số khóa học</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.totalCourses}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Tỉ lệ cải thiện</dt>
                  <dd>
                    <div className="text-lg font-medium text-indigo-600">{stats.overallImprovement}%</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Award className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Hiệu suất cao</dt>
                  <dd>
                    <div className="text-lg font-medium text-green-600">{stats.highPerforming}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingDown className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Hiệu suất thấp</dt>
                  <dd>
                    <div className="text-lg font-medium text-red-600">{stats.lowPerforming}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="p-4 sm:p-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="relative rounded-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Tìm kiếm theo lớp học, giáo viên..."
            />
          </div>

          <div>
            <select
              value={monthFilter}
              onChange={handleMonthFilterChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Tất cả tháng</option>
              {uniqueMonths.map(month => (
                <option key={month} value={month}>{getMonthName(month)}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={courseFilter}
              onChange={handleCourseFilterChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Tất cả khóa học</option>
              {uniqueCourses.map(course => (
                <option key={course.id} value={course.id}>{course.name}</option>
              ))}
            </select>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Đặt lại
            </button>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="flex flex-col bg-white shadow rounded-lg">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden border-b border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mã báo cáo
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thời gian
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Khóa học
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giảng viên
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Điểm trung bình
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tỉ lệ đạt
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cải thiện
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                        <div className="flex justify-center items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Đang tải dữ liệu...
                        </div>
                      </td>
                    </tr>
                  ) : filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                        Không tìm thấy dữ liệu hiệu suất nào
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {record.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getMonthName(record.month)}/{record.year}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <Book className="h-5 w-5 mr-2 text-gray-400" />
                            {record.courseName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <User className="h-5 w-5 mr-2 text-gray-400" />
                            {record.teacherName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <span className={getScoreColor(record.averageScore)}>
                            {record.averageScore.toFixed(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.passRate}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center">
                            {getImprovementDisplay(record.improvementRate).icon}
                            <span className={getImprovementDisplay(record.improvementRate).color}>
                              {record.improvementRate}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          <button
                            onClick={() => handleViewDetails(record.id)}
                            className="text-indigo-600 hover:text-indigo-900 focus:outline-none"
                          >
                            Xem chi tiết
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Detail Modal */}
      {showDetails && selectedRecord && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Chi tiết hiệu suất học tập - {selectedRecord.courseName} ({getMonthName(selectedRecord.month)}/{selectedRecord.year})
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm text-gray-500">Khóa học</p>
                        <p className="font-medium">{selectedRecord.courseName}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm text-gray-500">Điểm trung bình</p>
                        <p className={`font-medium ${getScoreColor(selectedRecord.averageScore)}`}>
                          {selectedRecord.averageScore.toFixed(1)}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm text-gray-500">Tổng số học viên</p>
                        <p className="font-medium">{selectedRecord.students.length}</p>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="text-md font-medium mb-2">Hiệu suất học viên</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Mã học viên
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tên học viên
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Điểm hiện tại
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Điểm trước đây
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tỉ lệ cải thiện
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Điểm danh
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {selectedRecord.students.map((student) => (
                              <tr key={student.studentId}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {student.studentId}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {student.studentName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <span className={getScoreColor(student.currentScore)}>
                                    {student.currentScore.toFixed(1)}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {student.previousScore.toFixed(1)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  <div className="flex items-center">
                                    {getImprovementDisplay(student.improvement).icon}
                                    <span className={getImprovementDisplay(student.improvement).color}>
                                      {student.improvement.toFixed(1)}%
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {student.attendance.toFixed(1)}%
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  onClick={handleCloseDetails}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceReport;
