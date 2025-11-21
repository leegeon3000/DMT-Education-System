import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Users,
  Book,
  User,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Download,
  ChevronDown,
  ChevronUp,
  Filter,
  Search
} from 'lucide-react';
import { adminService } from '../../../services/admin';

// Types
interface AttendanceRecord {
  id: string;
  date: string;
  courseId: string;
  courseName: string;
  teacherId: string;
  teacherName: string;
  attendanceRate: number;
  totalStudents: number;
  presentStudents: number;
  absentStudents: number;
  notes?: string;
}

interface StudentAttendance {
  studentId: string;
  studentName: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  arrivalTime?: string;
  note?: string;
}

interface AttendanceDetail {
  id: string;
  date: string;
  courseId: string;
  courseName: string;
  teacherId: string;
  teacherName: string;
  attendanceRate: number;
  students: StudentAttendance[];
}

// Sample data
const mockAttendanceData: AttendanceRecord[] = [
  {
    id: 'ATT-23001',
    date: '2023-11-15',
    courseId: 'CRS-2001',
    courseName: 'Tiếng Anh nâng cao',
    teacherId: 'TCH-001',
    teacherName: 'Nguyễn Thị Ánh',
    attendanceRate: 85,
    totalStudents: 20,
    presentStudents: 17,
    absentStudents: 3,
    notes: 'Buổi học diễn ra tốt đẹp'
  },
  {
    id: 'ATT-23002',
    date: '2023-11-15',
    courseId: 'CRS-2003',
    courseName: 'Luyện thi IELTS',
    teacherId: 'TCH-002',
    teacherName: 'Trần Văn Bình',
    attendanceRate: 95,
    totalStudents: 15,
    presentStudents: 14,
    absentStudents: 1,
    notes: 'Một học viên báo ốm'
  },
  {
    id: 'ATT-23003',
    date: '2023-11-16',
    courseId: 'CRS-2002',
    courseName: 'Tiếng Anh giao tiếp',
    teacherId: 'TCH-003',
    teacherName: 'Lê Thị Cúc',
    attendanceRate: 75,
    totalStudents: 12,
    presentStudents: 9,
    absentStudents: 3,
    notes: 'Trời mưa lớn ảnh hưởng đến việc đi lại'
  },
  {
    id: 'ATT-23004',
    date: '2023-11-16',
    courseId: 'CRS-2005',
    courseName: 'Luyện thi TOEIC',
    teacherId: 'TCH-004',
    teacherName: 'Phạm Văn Dũng',
    attendanceRate: 100,
    totalStudents: 10,
    presentStudents: 10,
    absentStudents: 0,
    notes: 'Điểm danh đầy đủ'
  },
  {
    id: 'ATT-23005',
    date: '2023-11-17',
    courseId: 'CRS-2001',
    courseName: 'Tiếng Anh nâng cao',
    teacherId: 'TCH-001',
    teacherName: 'Nguyễn Thị Ánh',
    attendanceRate: 80,
    totalStudents: 20,
    presentStudents: 16,
    absentStudents: 4,
    notes: 'Ngày cuối tuần, một số học viên về quê'
  },
  {
    id: 'ATT-23006',
    date: '2023-11-17',
    courseId: 'CRS-2004',
    courseName: 'Tiếng Anh cho trẻ em',
    teacherId: 'TCH-005',
    teacherName: 'Hoàng Thị Em',
    attendanceRate: 90,
    totalStudents: 15,
    presentStudents: 13,
    absentStudents: 2,
    notes: 'Hai học viên báo nghỉ có phép'
  },
  {
    id: 'ATT-23007',
    date: '2023-11-18',
    courseId: 'CRS-2006',
    courseName: 'Tiếng Anh thương mại',
    teacherId: 'TCH-006',
    teacherName: 'Vũ Văn Giang',
    attendanceRate: 85,
    totalStudents: 18,
    presentStudents: 15,
    absentStudents: 3,
    notes: ''
  },
  {
    id: 'ATT-23008',
    date: '2023-11-19',
    courseId: 'CRS-2008',
    courseName: 'Tiếng Anh chuyên ngành IT',
    teacherId: 'TCH-007',
    teacherName: 'Đinh Văn Hiếu',
    attendanceRate: 83,
    totalStudents: 12,
    presentStudents: 10,
    absentStudents: 2,
    notes: 'Lớp học online, có vấn đề kết nối'
  },
  {
    id: 'ATT-23009',
    date: '2023-11-19',
    courseId: 'CRS-2003',
    courseName: 'Luyện thi IELTS',
    teacherId: 'TCH-002',
    teacherName: 'Trần Văn Bình',
    attendanceRate: 93,
    totalStudents: 15,
    presentStudents: 14,
    absentStudents: 1,
    notes: ''
  },
  {
    id: 'ATT-23010',
    date: '2023-11-20',
    courseId: 'CRS-2005',
    courseName: 'Luyện thi TOEIC',
    teacherId: 'TCH-004',
    teacherName: 'Phạm Văn Dũng',
    attendanceRate: 90,
    totalStudents: 10,
    presentStudents: 9,
    absentStudents: 1,
    notes: 'Buổi ôn tập trước thi thử'
  },
];

// Generate attendance details
const mockAttendanceDetails: { [key: string]: AttendanceDetail } = {};
mockAttendanceData.forEach(record => {
  const studentStatuses: ('present' | 'absent' | 'late' | 'excused')[] = ['present', 'absent', 'late', 'excused'];
  
  const students: StudentAttendance[] = Array.from({ length: record.totalStudents }, (_, i) => ({
    studentId: `STU-${1000 + i}`,
    studentName: `Học viên ${i + 1}`,
    status: i < record.presentStudents 
      ? (Math.random() > 0.8 ? 'late' : 'present')
      : (Math.random() > 0.5 ? 'absent' : 'excused'),
    arrivalTime: Math.random() > 0.8 ? '08:15:00' : '08:00:00',
    note: ''
  }));

  mockAttendanceDetails[record.id] = {
    ...record,
    students
  };
});

const AttendanceReport: React.FC = () => {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [filteredData, setFilteredData] = useState<AttendanceRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [courseFilter, setCourseFilter] = useState<string>('');
  const [showDetails, setShowDetails] = useState<boolean>(false);
  
  // Aggregate stats
  const [stats, setStats] = useState({
    averageAttendance: 0,
    totalClasses: 0,
    highAttendanceClasses: 0,
    lowAttendanceClasses: 0
  });

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        setIsLoading(true);
        // Simulate API call with mock data
        await new Promise(resolve => setTimeout(resolve, 800));
        setAttendanceData(mockAttendanceData);
        setFilteredData(mockAttendanceData);

        // Calculate stats
        const avgAttendance = mockAttendanceData.reduce((sum, record) => sum + record.attendanceRate, 0) / mockAttendanceData.length;
        const highAttendance = mockAttendanceData.filter(record => record.attendanceRate >= 90).length;
        const lowAttendance = mockAttendanceData.filter(record => record.attendanceRate < 75).length;

        setStats({
          averageAttendance: parseFloat(avgAttendance.toFixed(2)),
          totalClasses: mockAttendanceData.length,
          highAttendanceClasses: highAttendance,
          lowAttendanceClasses: lowAttendance
        });
      } catch (err) {
        console.error('Error fetching attendance data:', err);
        setError('Không thể tải dữ liệu điểm danh. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendanceData();
  }, []);

  useEffect(() => {
    // Apply filters
    let result = [...attendanceData];

    if (searchTerm) {
      result = result.filter(record => 
        record.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.teacherName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (dateFilter) {
      result = result.filter(record => record.date === dateFilter);
    }

    if (courseFilter) {
      result = result.filter(record => record.courseId === courseFilter);
    }

    setFilteredData(result);
  }, [attendanceData, searchTerm, dateFilter, courseFilter]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDateFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateFilter(e.target.value);
  };

  const handleCourseFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCourseFilter(e.target.value);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setDateFilter('');
    setCourseFilter('');
  };

  const handleViewDetails = (recordId: string) => {
    setSelectedRecord(mockAttendanceDetails[recordId]);
    setShowDetails(true);
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
  const uniqueCourses = Array.from(new Set(attendanceData.map(record => record.courseId)))
    .map(courseId => {
      const course = attendanceData.find(record => record.courseId === courseId);
      return {
        id: courseId,
        name: course?.courseName || ''
      };
    });

  // Get unique dates for filter
  const uniqueDates = Array.from(new Set(attendanceData.map(record => record.date))).sort();

  // Helper for attendance rate color
  const getAttendanceRateColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 75) return 'text-amber-600';
    return 'text-red-600';
  };

  // Helper for attendance status icon
  const getStatusIcon = (status: 'present' | 'absent' | 'late' | 'excused') => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'absent':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'late':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'excused':
        return <FileText className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  // Helper for attendance status label
  const getStatusLabel = (status: 'present' | 'absent' | 'late' | 'excused') => {
    switch (status) {
      case 'present':
        return 'Có mặt';
      case 'absent':
        return 'Vắng mặt';
      case 'late':
        return 'Đi muộn';
      case 'excused':
        return 'Có phép';
      default:
        return '';
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-full mx-auto">
      {/* Header section */}
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Báo cáo điểm danh</h1>
          <p className="mt-2 text-sm text-gray-700">
            Thống kê và theo dõi tình hình điểm danh của học viên theo lớp học và thời gian.
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
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Tổng số buổi học</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.totalClasses}</div>
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
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Tỉ lệ điểm danh trung bình</dt>
                  <dd>
                    <div className="text-lg font-medium text-indigo-600">{stats.averageAttendance}%</div>
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
                <CheckCircle className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Lớp điểm danh tốt (≥90%)</dt>
                  <dd>
                    <div className="text-lg font-medium text-green-600">{stats.highAttendanceClasses}</div>
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
                <XCircle className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{"Lớp điểm danh thấp (<75%)"}</dt>
                  <dd>
                    <div className="text-lg font-medium text-red-600">{stats.lowAttendanceClasses}</div>
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
            <input
              type="date"
              value={dateFilter}
              onChange={handleDateFilterChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
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
                      Mã buổi học
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày học
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Khóa học
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giảng viên
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tỉ lệ điểm danh
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số học viên có mặt
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
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
                      <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                        Không tìm thấy dữ liệu điểm danh nào
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {record.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(record.date).toLocaleDateString('vi-VN')}
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
                          <span className={getAttendanceRateColor(record.attendanceRate)}>
                            {record.attendanceRate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.presentStudents}/{record.totalStudents}
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

      {/* Attendance Detail Modal */}
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
                      Chi tiết điểm danh {selectedRecord.id}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm text-gray-500">Lớp học</p>
                        <p className="font-medium">{selectedRecord.courseName}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm text-gray-500">Giảng viên</p>
                        <p className="font-medium">{selectedRecord.teacherName}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm text-gray-500">Ngày học</p>
                        <p className="font-medium">{new Date(selectedRecord.date).toLocaleDateString('vi-VN')}</p>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="text-md font-medium mb-2">Danh sách học viên</h4>
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
                                Trạng thái
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Giờ đến
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ghi chú
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
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <div className="flex items-center">
                                    {getStatusIcon(student.status)}
                                    <span className="ml-2">{getStatusLabel(student.status)}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {student.arrivalTime || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {student.note || '-'}
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

export default AttendanceReport;
