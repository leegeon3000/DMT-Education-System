import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEOHead } from '../../../components/common';
import { 
  Search, 
  Filter, 
  Calendar,
  Users,
  Clock,
  MapPin,
  User,
  ChevronRight,
  Eye,
  Edit,
  BookOpen,
  TrendingUp
} from 'lucide-react';

interface ClassInfo {
  class_id: string;
  class_code: string;
  class_name: string;
  course_name: string;
  teacher_name: string;
  total_students: number;
  max_students: number;
  schedule: string;
  room: string;
  start_date: string;
  end_date: string;
  status: 'ACTIVE' | 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
}

const Classes: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCourse, setFilterCourse] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      
      // Mock data
      const mockClasses: ClassInfo[] = [
        {
          class_id: '1',
          class_code: 'TOÁN10A-2025',
          class_name: 'Toán 10A - Học kỳ 1',
          course_name: 'Toán học lớp 10',
          teacher_name: 'Nguyễn Văn A',
          total_students: 25,
          max_students: 30,
          schedule: 'T2, T4, T6: 18h00-20h00',
          room: 'Phòng 301',
          start_date: '2025-01-15',
          end_date: '2025-05-15',
          status: 'ACTIVE'
        },
        {
          class_id: '2',
          class_code: 'LÝ11B-2025',
          class_name: 'Vật lý 11B - Học kỳ 1',
          course_name: 'Vật lý lớp 11',
          teacher_name: 'Trần Thị B',
          total_students: 20,
          max_students: 25,
          schedule: 'T3, T5, T7: 19h00-21h00',
          room: 'Phòng 205',
          start_date: '2025-02-01',
          end_date: '2025-06-01',
          status: 'UPCOMING'
        },
        {
          class_id: '3',
          class_code: 'HÓA12A-2024',
          class_name: 'Hóa học 12A - Học kỳ 2',
          course_name: 'Hóa học lớp 12',
          teacher_name: 'Lê Văn C',
          total_students: 28,
          max_students: 30,
          schedule: 'T2, T4, T6: 17h00-19h00',
          room: 'Phòng 102',
          start_date: '2024-09-01',
          end_date: '2024-12-31',
          status: 'COMPLETED'
        }
      ];

      setClasses(mockClasses);
    } catch (error) {
      console.error('Failed to fetch classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      ACTIVE: 'bg-green-100 text-green-700 border border-green-200',
      UPCOMING: 'bg-blue-100 text-blue-700 border border-blue-200',
      COMPLETED: 'bg-gray-100 text-gray-700 border border-gray-200',
      CANCELLED: 'bg-red-100 text-red-700 border border-red-200'
    };

    const labels = {
      ACTIVE: 'Đang diễn ra',
      UPCOMING: 'Sắp diễn ra',
      COMPLETED: 'Đã kết thúc',
      CANCELLED: 'Đã hủy'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const filteredClasses = classes.filter(cls => {
    const matchesSearch = 
      cls.class_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.class_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.course_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.teacher_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = !filterStatus || cls.status === filterStatus;
    const matchesCourse = !filterCourse || cls.course_name === filterCourse;

    return matchesSearch && matchesStatus && matchesCourse;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="Quản lý lớp học - DMT Education"
        description="Quản lý danh sách lớp học"
      />

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Quản lý lớp học
            </h1>
            <p className="text-gray-600 mt-1">Tổng: {filteredClasses.length} lớp học</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Đang diễn ra</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    {classes.filter(c => c.status === 'ACTIVE').length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <BookOpen size={24} className="text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Sắp diễn ra</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">
                    {classes.filter(c => c.status === 'UPCOMING').length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Calendar size={24} className="text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng học viên</p>
                  <p className="text-2xl font-bold text-cyan-600 mt-1">
                    {classes.reduce((sum, c) => sum + c.total_students, 0)}
                  </p>
                </div>
                <div className="p-3 bg-cyan-100 rounded-lg">
                  <Users size={24} className="text-cyan-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tỷ lệ lấp đầy</p>
                  <p className="text-2xl font-bold text-orange-600 mt-1">
                    {Math.round((classes.reduce((sum, c) => sum + c.total_students, 0) / classes.reduce((sum, c) => sum + c.max_students, 0)) * 100)}%
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <TrendingUp size={24} className="text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Tìm theo tên lớp, mã lớp, giáo viên..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="ACTIVE">Đang diễn ra</option>
                <option value="UPCOMING">Sắp diễn ra</option>
                <option value="COMPLETED">Đã kết thúc</option>
                <option value="CANCELLED">Đã hủy</option>
              </select>

              <select
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="">Tất cả môn học</option>
                <option value="Toán học lớp 10">Toán học lớp 10</option>
                <option value="Vật lý lớp 11">Vật lý lớp 11</option>
                <option value="Hóa học lớp 12">Hóa học lớp 12</option>
              </select>
            </div>
          </div>

          {/* Classes List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {filteredClasses.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen size={48} className="mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500 text-lg">Không tìm thấy lớp học nào</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mã lớp
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tên lớp / Môn học
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Giáo viên
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lịch học
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Học viên
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredClasses.map((cls) => (
                      <tr key={cls.class_id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-mono text-sm font-medium text-cyan-600">
                            {cls.class_code}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{cls.class_name}</p>
                            <p className="text-sm text-gray-600">{cls.course_name}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                              <User size={16} className="text-blue-600" />
                            </div>
                            <span className="text-sm text-gray-900">{cls.teacher_name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm space-y-1">
                            <div className="flex items-center text-gray-600">
                              <Clock size={14} className="mr-2" />
                              {cls.schedule}
                            </div>
                            <div className="flex items-center text-gray-600">
                              <MapPin size={14} className="mr-2" />
                              {cls.room}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <span className="font-medium text-gray-900">{cls.total_students}</span>
                            <span className="text-gray-600">/{cls.max_students}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div 
                              className="bg-cyan-600 h-1.5 rounded-full" 
                              style={{ width: `${(cls.total_students / cls.max_students) * 100}%` }}
                            ></div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(cls.status)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => navigate(`/staff/classes/${cls.class_id}`)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Xem chi tiết"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => navigate(`/staff/classes/${cls.class_id}/edit`)}
                              className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                              title="Chỉnh sửa"
                            >
                              <Edit size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Classes;
