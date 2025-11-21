import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../store/slices/userSlice';
import { SEOHead } from '../../../components/common';
import teacherAPI, { Student } from '../../../services/teacherAPI';
import { 
  UserCheck, 
  Users, 
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Save,
  Download,
  Filter,
  Search,
  ChevronDown,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

interface Session {
  id: number;
  session_number: number;
  date: string;
  start_time: string;
  end_time: string;
  status: 'UPCOMING' | 'IN_PROGRESS' | 'COMPLETED';
}

interface Class {
  id: number;
  class_code: string;
  class_name: string;
  total_students: number;
  schedule: string;
}

interface AttendanceRecord {
  student_id: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  notes: string;
}

const AttendanceMarking: React.FC = () => {
  const user = useSelector(selectCurrentUser);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, AttendanceRecord>>({});
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [showSessionDropdown, setShowSessionDropdown] = useState(false);

  // Mock data
  const mockClasses: Class[] = [
    {
      id: 1,
      class_code: 'TOAN10A-HK1',
      class_name: 'Toán 10A - Học kỳ 1',
      total_students: 25,
      schedule: 'Thứ 2, 4, 6 (18:00-20:00)'
    },
    {
      id: 2,
      class_code: 'VATLY11B-HK1',
      class_name: 'Vật lý 11B - Học kỳ 1',
      total_students: 20,
      schedule: 'Thứ 3, 5, 7 (19:00-21:00)'
    },
    {
      id: 3,
      class_code: 'IELTS-FOUND',
      class_name: 'IELTS Foundation',
      total_students: 15,
      schedule: 'Thứ 2, 4, 6 (17:00-19:00)'
    },
  ];

  const mockSessions: Session[] = [
    {
      id: 1,
      session_number: 1,
      date: '2025-11-18',
      start_time: '18:00',
      end_time: '20:00',
      status: 'UPCOMING'
    },
    {
      id: 2,
      session_number: 2,
      date: '2025-11-16',
      start_time: '18:00',
      end_time: '20:00',
      status: 'IN_PROGRESS'
    },
    {
      id: 3,
      session_number: 3,
      date: '2025-11-14',
      start_time: '18:00',
      end_time: '20:00',
      status: 'COMPLETED'
    },
  ];

  const mockStudents: Student[] = [
    { id: '1', studentId: 'HS2025001', student_code: 'HS2025001', name: 'Nguyễn Văn A', full_name: 'Nguyễn Văn A', email: 'student001@gmail.com', phone: '0909012345', attendance: {} },
    { id: '2', studentId: 'HS2025002', student_code: 'HS2025002', name: 'Trần Thị B', full_name: 'Trần Thị B', email: 'student002@gmail.com', phone: '0910123456', attendance: {} },
    { id: '3', studentId: 'HS2025003', student_code: 'HS2025003', name: 'Lê Văn C', full_name: 'Lê Văn C', email: 'student003@gmail.com', phone: '0911234567', attendance: {} },
    { id: '4', studentId: 'HS2025004', student_code: 'HS2025004', name: 'Phạm Thị D', full_name: 'Phạm Thị D', email: 'student004@gmail.com', phone: '0912345678', attendance: {} },
    { id: '5', studentId: 'HS2025005', student_code: 'HS2025005', name: 'Hoàng Văn E', full_name: 'Hoàng Văn E', email: 'student005@gmail.com', phone: '0913456789', attendance: {} },
    { id: '6', studentId: 'HS2025006', student_code: 'HS2025006', name: 'Vũ Thị F', full_name: 'Vũ Thị F', email: 'student006@gmail.com', phone: '0914567890', attendance: {} },
    { id: '7', studentId: 'HS2025007', student_code: 'HS2025007', name: 'Đặng Văn G', full_name: 'Đặng Văn G', email: 'student007@gmail.com', phone: '0915678901', attendance: {} },
    { id: '8', studentId: 'HS2025008', student_code: 'HS2025008', name: 'Bùi Thị H', full_name: 'Bùi Thị H', email: 'student008@gmail.com', phone: '0916789012', attendance: {} },
  ];

  useEffect(() => {
    if (selectedClass && selectedSession) {
      fetchStudents();
    }
  }, [selectedClass, selectedSession]);

  const fetchStudents = async () => {
    if (!selectedClass) return;
    
    try {
      setLoading(true);
      const data = await teacherAPI.getStudentsForAttendance(selectedClass.id);
      
      // Use API data or fallback to mock
      const studentsData = data.length > 0 ? data : mockStudents;
      setStudents(studentsData);
      
      // Initialize attendance with default values if session is new
      if (selectedSession?.status !== 'COMPLETED') {
        const defaultAttendance: Record<string, AttendanceRecord> = {};
        studentsData.forEach(student => {
          defaultAttendance[student.id] = {
            student_id: student.id,
            status: 'PRESENT',
            notes: ''
          };
        });
        setAttendance(defaultAttendance);
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch students:', error);
      // Fallback to mock data
      setStudents(mockStudents);
      setLoading(false);
    }
  };

  const handleAttendanceChange = (studentId: string, status: AttendanceRecord['status']) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        student_id: studentId,
        status: status
      }
    }));
  };

  const handleNotesChange = (studentId: string, notes: string) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        student_id: studentId,
        notes: notes
      }
    }));
  };

  const handleBulkAction = (status: AttendanceRecord['status']) => {
    const newAttendance = { ...attendance };
    filteredStudents.forEach(student => {
      newAttendance[student.id] = {
        ...newAttendance[student.id],
        student_id: student.id,
        status: status
      };
    });
    setAttendance(newAttendance);
  };

  const handleSave = () => {
    if (!selectedClass || !selectedSession) {
      alert('Vui lòng chọn lớp học và buổi học!');
      return;
    }

    const attendanceData = {
      class_id: selectedClass.id,
      session_id: selectedSession.id,
      attendance: Object.values(attendance)
    };

    console.log('Saving attendance:', attendanceData);
    alert('Lưu điểm danh thành công!');
  };

  const handleExport = () => {
    alert('Xuất báo cáo - Chức năng đang phát triển');
  };

  const getStatusColor = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'PRESENT': return 'bg-green-500';
      case 'ABSENT': return 'bg-red-500';
      case 'LATE': return 'bg-yellow-500';
      case 'EXCUSED': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'PRESENT': return 'Có mặt';
      case 'ABSENT': return 'Vắng';
      case 'LATE': return 'Muộn';
      case 'EXCUSED': return 'Có phép';
      default: return '';
    }
  };

  const getStatusIcon = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'PRESENT': return <CheckCircle size={20} />;
      case 'ABSENT': return <XCircle size={20} />;
      case 'LATE': return <Clock size={20} />;
      case 'EXCUSED': return <AlertCircle size={20} />;
      default: return null;
    }
  };

  const filteredStudents = students.filter(student =>
    student.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.student_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const attendanceStats = {
    total: students.length,
    present: Object.values(attendance).filter(a => a.status === 'PRESENT').length,
    absent: Object.values(attendance).filter(a => a.status === 'ABSENT').length,
    late: Object.values(attendance).filter(a => a.status === 'LATE').length,
    excused: Object.values(attendance).filter(a => a.status === 'EXCUSED').length,
  };

  const attendanceRate = students.length > 0 
    ? ((attendanceStats.present / students.length) * 100).toFixed(1)
    : 0;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <SEOHead
        title="Điểm danh - DMT Education"
        description="Điểm danh học viên"
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/20 to-emerald-50/30 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Điểm danh học viên
            </h1>
            <p className="text-gray-600 mt-1">Ghi nhận sự tham gia của học viên trong buổi học</p>
          </div>

          {/* Class and Session Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Class Selector */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn lớp học
              </label>
              <div className="relative">
                <button
                  onClick={() => setShowClassDropdown(!showClassDropdown)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  {selectedClass ? (
                    <div>
                      <p className="font-medium text-gray-900">{selectedClass.class_name}</p>
                      <p className="text-sm text-gray-500">{selectedClass.schedule}</p>
                    </div>
                  ) : (
                    <span className="text-gray-500">Chọn lớp học...</span>
                  )}
                  <ChevronDown className={`transition-transform ${showClassDropdown ? 'rotate-180' : ''}`} size={20} />
                </button>

                {showClassDropdown && (
                  <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                    {mockClasses.map(cls => (
                      <button
                        key={cls.id}
                        onClick={() => {
                          setSelectedClass(cls);
                          setShowClassDropdown(false);
                          setSelectedSession(null);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                      >
                        <p className="font-medium text-gray-900">{cls.class_name}</p>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <span>{cls.schedule}</span>
                          <span>{cls.total_students} học viên</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Session Selector */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn buổi học
              </label>
              <div className="relative">
                <button
                  onClick={() => selectedClass && setShowSessionDropdown(!showSessionDropdown)}
                  disabled={!selectedClass}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg text-left flex items-center justify-between transition-colors ${
                    selectedClass ? 'hover:bg-gray-50' : 'bg-gray-50 cursor-not-allowed'
                  }`}
                >
                  {selectedSession ? (
                    <div>
                      <p className="font-medium text-gray-900">
                        Buổi {selectedSession.session_number} - {formatDate(selectedSession.date)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {selectedSession.start_time} - {selectedSession.end_time}
                      </p>
                    </div>
                  ) : (
                    <span className="text-gray-500">
                      {selectedClass ? 'Chọn buổi học...' : 'Vui lòng chọn lớp trước'}
                    </span>
                  )}
                  <ChevronDown className={`transition-transform ${showSessionDropdown ? 'rotate-180' : ''}`} size={20} />
                </button>

                {showSessionDropdown && selectedClass && (
                  <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                    {mockSessions.map(session => (
                      <button
                        key={session.id}
                        onClick={() => {
                          setSelectedSession(session);
                          setShowSessionDropdown(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">
                              Buổi {session.session_number}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatDate(session.date)} • {session.start_time} - {session.end_time}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            session.status === 'COMPLETED' ? 'bg-gray-100 text-gray-700' :
                            session.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {session.status === 'COMPLETED' ? 'Đã hoàn thành' :
                             session.status === 'IN_PROGRESS' ? 'Đang diễn ra' :
                             'Sắp diễn ra'}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {selectedClass && selectedSession && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Tổng số</p>
                      <p className="text-2xl font-bold text-purple-600 mt-1">{attendanceStats.total}</p>
                    </div>
                    <Users size={24} className="text-purple-600" />
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Có mặt</p>
                      <p className="text-2xl font-bold text-green-600 mt-1">{attendanceStats.present}</p>
                    </div>
                    <CheckCircle size={24} className="text-green-600" />
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Vắng</p>
                      <p className="text-2xl font-bold text-red-600 mt-1">{attendanceStats.absent}</p>
                    </div>
                    <XCircle size={24} className="text-red-600" />
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Muộn</p>
                      <p className="text-2xl font-bold text-yellow-600 mt-1">{attendanceStats.late}</p>
                    </div>
                    <Clock size={24} className="text-yellow-600" />
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Tỷ lệ</p>
                      <p className="text-2xl font-bold text-blue-600 mt-1">{attendanceRate}%</p>
                    </div>
                    <TrendingUp size={24} className="text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Toolbar */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="flex-1 relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Tìm học viên..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex gap-2 w-full md:w-auto">
                    <button
                      onClick={() => handleBulkAction('PRESENT')}
                      className="flex-1 md:flex-none px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                    >
                      Tất cả có mặt
                    </button>
                    <button
                      onClick={() => handleBulkAction('ABSENT')}
                      className="flex-1 md:flex-none px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                    >
                      Tất cả vắng
                    </button>
                    <button
                      onClick={handleExport}
                      className="flex-1 md:flex-none px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center gap-2"
                    >
                      <Download size={16} />
                      Xuất
                    </button>
                  </div>
                </div>
              </div>

              {/* Attendance List */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                  <div className="p-12 text-center">
                    <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600">Đang tải...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Học viên
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Trạng thái
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Ghi chú
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredStudents.map((student, index) => (
                          <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-semibold">
                                  {student.full_name.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{student.full_name}</p>
                                  <p className="text-sm text-gray-500">{student.student_code}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center gap-2">
                                {(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'] as const).map(status => (
                                  <button
                                    key={status}
                                    onClick={() => handleAttendanceChange(student.id, status)}
                                    className={`relative group flex items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                                      attendance[student.id]?.status === status
                                        ? `${getStatusColor(status)} text-white shadow-sm`
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                    title={getStatusLabel(status)}
                                  >
                                    {getStatusIcon(status)}
                                    <span className="text-xs font-medium hidden md:inline">
                                      {getStatusLabel(status)}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="text"
                                value={attendance[student.id]?.notes || ''}
                                onChange={(e) => handleNotesChange(student.id, e.target.value)}
                                placeholder="Ghi chú (nếu có)..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Save Button */}
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <AlertTriangle size={16} className="text-yellow-600" />
                  <span>Nhớ lưu điểm danh sau khi hoàn tất</span>
                </div>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-sm font-medium"
                >
                  <Save size={20} />
                  Lưu điểm danh
                </button>
              </div>
            </>
          )}

          {!selectedClass && (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
              <UserCheck className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa chọn lớp học</h3>
              <p className="mt-1 text-sm text-gray-500">
                Vui lòng chọn lớp học và buổi học để bắt đầu điểm danh
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AttendanceMarking;
