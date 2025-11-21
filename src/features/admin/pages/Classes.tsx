import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  Calendar, 
  Clock, 
  Users, 
  Trash2, 
  Edit, 
  MoreHorizontal,
  ClipboardList,
  BookOpen,
  ChevronDown,
  UserCheck,
  CheckCircle,
  XCircle,
  CalendarDays
} from 'lucide-react';
import { apiClient } from '../../../services/auth';

// API response interface (uppercase fields from SQL Server)
interface ClassFromAPI {
  ID: number;
  CODE: string;
  NAME: string;
  COURSE_ID: number;
  TEACHER_ID: number;
  CAPACITY: number;
  CURRENT_STUDENTS: number;
  START_DATE: string;
  END_DATE: string;
  SCHEDULE_DAYS: string;
  SCHEDULE_TIME: string;
  CLASSROOM: string;
  STATUS: string;
  CREATED_AT: string;
  course_name: string;
  subject_id: number;
  subject_name: string;
  teacher_name: string;
}

// Normalized interface for component use (lowercase)
interface Class {
  id: string;
  name: string;
  courseId: string;
  courseName: string;
  teacherId: string;
  teacherName: string;
  schedule: string[];
  startDate: string;
  endDate: string;
  totalSessions: number;
  completedSessions: number;
  room: string;
  capacity: number;
  enrolledStudents: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  days: string[];
  time: string;
}

// Helper function to normalize API data to component interface
const normalizeClass = (apiClass: ClassFromAPI): Class => {
  // Map SQL Server status to component status
  const statusMap: { [key: string]: 'upcoming' | 'ongoing' | 'completed' | 'cancelled' } = {
    'PLANNING': 'upcoming',
    'ACTIVE': 'ongoing',
    'COMPLETED': 'completed',
    'CANCELLED': 'cancelled'
  };

  // Parse schedule days (e.g., "MONDAY,WEDNESDAY" -> ["Thứ 2", "Thứ 4"])
  const dayMap: { [key: string]: string } = {
    'MONDAY': 'Thứ 2',
    'TUESDAY': 'Thứ 3',
    'WEDNESDAY': 'Thứ 4',
    'THURSDAY': 'Thứ 5',
    'FRIDAY': 'Thứ 6',
    'SATURDAY': 'Thứ 7',
    'SUNDAY': 'Chủ nhật'
  };

  const scheduleDays = apiClass.SCHEDULE_DAYS 
    ? apiClass.SCHEDULE_DAYS.split(',').map(day => dayMap[day.trim()] || day)
    : [];

  const scheduleTime = apiClass.SCHEDULE_TIME || '';

  return {
    id: apiClass.ID.toString(),
    name: apiClass.NAME,
    courseId: apiClass.COURSE_ID.toString(),
    courseName: apiClass.course_name || 'N/A',
    teacherId: apiClass.TEACHER_ID.toString(),
    teacherName: apiClass.teacher_name || 'N/A',
    schedule: scheduleDays.map(day => `${day}: ${scheduleTime}`),
    startDate: apiClass.START_DATE ? apiClass.START_DATE.split('T')[0] : '',
    endDate: apiClass.END_DATE ? apiClass.END_DATE.split('T')[0] : '',
    totalSessions: 24, // Default, could be calculated
    completedSessions: 0, // Not available in current schema
    room: apiClass.CLASSROOM || 'N/A',
    capacity: apiClass.CAPACITY,
    enrolledStudents: apiClass.CURRENT_STUDENTS,
    status: statusMap[apiClass.STATUS] || 'upcoming',
    days: scheduleDays,
    time: scheduleTime
  };
};

interface Course {
  id: string;
  name: string;
}

interface Teacher {
  id: string;
  name: string;
}

interface Room {
  id: string;
  name: string;
  capacity: number;
}

const ClassCard: React.FC<{
  classItem: Class;
  onEdit: (classItem: Class) => void;
  onDelete: (id: string) => void;
}> = ({ classItem, onEdit, onDelete }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusText = (status: string) => {
    switch(status) {
      case 'upcoming': return 'Sắp diễn ra';
      case 'ongoing': return 'Đang diễn ra';
      case 'completed': return 'Đã hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const progressPercentage = Math.round((classItem.completedSessions / classItem.totalSessions) * 100);
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-lg text-gray-900">{classItem.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{classItem.courseName}</p>
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)} 
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <MoreHorizontal size={18} className="text-gray-500" />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 top-8 z-10 bg-white shadow-lg rounded-md py-2 w-48">
                <button 
                  onClick={() => { onEdit(classItem); setShowDropdown(false); }}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
                >
                  <Edit size={16} className="mr-2" /> Chỉnh sửa
                </button>
                <button 
                  onClick={() => { onDelete(classItem.id); setShowDropdown(false); }}
                  className="px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left flex items-center"
                >
                  <Trash2 size={16} className="mr-2" /> Xóa
                </button>
                <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center">
                  <ClipboardList size={16} className="mr-2" /> Điểm danh
                </button>
                <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center">
                  <UserCheck size={16} className="mr-2" /> Quản lý học sinh
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-y-2 text-sm">
          <div className="flex items-center">
            <BookOpen size={16} className="text-gray-400 mr-2" />
            <span className="text-gray-700">Phòng: {classItem.room}</span>
          </div>
          
          <div className="flex items-center">
            <Users size={16} className="text-gray-400 mr-2" />
            <span className="text-gray-700">{classItem.enrolledStudents}/{classItem.capacity} học sinh</span>
          </div>
          
          <div className="flex items-center">
            <Calendar size={16} className="text-gray-400 mr-2" />
            <span className="text-gray-700">{classItem.days.join(', ')}</span>
          </div>
          
          <div className="flex items-center">
            <Clock size={16} className="text-gray-400 mr-2" />
            <span className="text-gray-700">{classItem.time}</span>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Giảng viên</span>
            <span className="font-medium">{classItem.teacherName}</span>
          </div>
          
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Thời gian</span>
            <span className="font-medium">
              {new Date(classItem.startDate).toLocaleDateString('vi-VN')} - {new Date(classItem.endDate).toLocaleDateString('vi-VN')}
            </span>
          </div>
          
          <div className="flex justify-between text-sm mb-3">
            <span className="text-gray-600">Buổi học</span>
            <span className="font-medium">{classItem.completedSessions}/{classItem.totalSessions}</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-100 p-4 flex justify-between items-center bg-gray-50">
        <span className={`px-2.5 py-1 rounded-full text-xs ${getStatusColor(classItem.status)}`}>
          {getStatusText(classItem.status)}
        </span>
        
        <button className="text-blue-600 hover:underline text-sm flex items-center">
          <CalendarDays size={14} className="mr-1" /> 
          Lịch học chi tiết
        </button>
      </div>
    </div>
  );
};

const ClassModal: React.FC<{
  classItem?: Class;
  isOpen: boolean;
  onClose: () => void;
  onSave: (classData: Partial<Class>) => void;
  courses: Course[];
  teachers: Teacher[];
  rooms: Room[];
}> = ({ classItem, isOpen, onClose, onSave, courses, teachers, rooms }) => {
  const [formData, setFormData] = useState<Partial<Class>>({
    name: '',
    courseId: '',
    teacherId: '',
    schedule: [],
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0],
    totalSessions: 24,
    completedSessions: 0,
    room: '',
    capacity: 30,
    enrolledStudents: 0,
    status: 'upcoming',
    days: [],
    time: '18:00 - 20:00'
  });
  
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  
  const daysOfWeek = [
    { value: 'Thứ 2', label: 'Thứ 2' },
    { value: 'Thứ 3', label: 'Thứ 3' },
    { value: 'Thứ 4', label: 'Thứ 4' },
    { value: 'Thứ 5', label: 'Thứ 5' },
    { value: 'Thứ 6', label: 'Thứ 6' },
    { value: 'Thứ 7', label: 'Thứ 7' },
    { value: 'Chủ nhật', label: 'Chủ nhật' }
  ];
  
  useEffect(() => {
    if (classItem) {
      setFormData({
        ...classItem,
        startDate: new Date(classItem.startDate).toISOString().split('T')[0],
        endDate: new Date(classItem.endDate).toISOString().split('T')[0],
      });
      setSelectedDays(classItem.days);
    } else {
      setFormData({
        name: '',
        courseId: '',
        teacherId: '',
        schedule: [],
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0],
        totalSessions: 24,
        completedSessions: 0,
        room: '',
        capacity: 30,
        enrolledStudents: 0,
        status: 'upcoming',
        days: [],
        time: '18:00 - 20:00'
      });
      setSelectedDays([]);
    }
  }, [classItem]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDayToggle = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      days: selectedDays
    });
  };

  const handleRoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRoom = rooms.find(room => room.id === e.target.value);
    if (selectedRoom) {
      setFormData(prev => ({
        ...prev,
        room: selectedRoom.name,
        capacity: selectedRoom.capacity
      }));
    }
  };
  
  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const courseId = e.target.value;
    const course = courses.find(c => c.id === courseId);
    
    setFormData(prev => ({
      ...prev,
      courseId,
      courseName: course?.name || ''
    }));
  };
  
  const handleTeacherChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const teacherId = e.target.value;
    const teacher = teachers.find(t => t.id === teacherId);
    
    setFormData(prev => ({
      ...prev,
      teacherId,
      teacherName: teacher?.name || ''
    }));
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto py-10">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {classItem ? 'Chỉnh sửa lớp học' : 'Thêm lớp học mới'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên lớp học</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Khóa học</label>
                <select
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleCourseChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Chọn khóa học</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giảng viên</label>
                <select
                  name="teacherId"
                  value={formData.teacherId}
                  onChange={handleTeacherChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Chọn giảng viên</option>
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phòng học</label>
                <select
                  name="room"
                  value={rooms.find(r => r.name === formData.room)?.id || ''}
                  onChange={handleRoomChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Chọn phòng học</option>
                  {rooms.map(room => (
                    <option key={room.id} value={room.id}>
                      {room.name} (Sức chứa: {room.capacity})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày kết thúc</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tổng số buổi học</label>
                <input
                  type="number"
                  name="totalSessions"
                  value={formData.totalSessions}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                  min="1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số buổi đã học</label>
                <input
                  type="number"
                  name="completedSessions"
                  value={formData.completedSessions}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số học sinh đã đăng ký</label>
                <input
                  type="number"
                  name="enrolledStudents"
                  value={formData.enrolledStudents}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="upcoming">Sắp diễn ra</option>
                  <option value="ongoing">Đang diễn ra</option>
                  <option value="completed">Đã hoàn thành</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian học</label>
                <input
                  type="text"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  placeholder="Ví dụ: 18:00 - 20:00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày học trong tuần</label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map(day => (
                    <button
                      type="button"
                      key={day.value}
                      onClick={() => handleDayToggle(day.value)}
                      className={`px-3 py-1.5 rounded-md text-sm ${
                        selectedDays.includes(day.value) 
                          ? 'bg-blue-100 text-blue-700 border-blue-300 border' 
                          : 'bg-gray-100 text-gray-700 border-gray-200 border'
                      }`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {classItem ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ClassesPage: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentClass, setCurrentClass] = useState<Class | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Mock data for courses, teachers, and rooms
  const [courses, setCourses] = useState<Course[]>([
    { id: 'course1', name: 'Toán học nâng cao' },
    { id: 'course2', name: 'Tiếng Anh giao tiếp' },
    { id: 'course3', name: 'Vật lý đại cương' },
    { id: 'course4', name: 'Hóa học cơ bản' },
    { id: 'course5', name: 'Lập trình Python' },
    { id: 'course6', name: 'Ngữ văn và văn học' }
  ]);
  
  const [teachers, setTeachers] = useState<Teacher[]>([
    { id: 'teacher1', name: 'Nguyễn Văn Anh' },
    { id: 'teacher2', name: 'Trần Thị Bình' },
    { id: 'teacher3', name: 'Lê Văn Cường' },
    { id: 'teacher4', name: 'Phạm Thị Dung' }
  ]);
  
  const [rooms, setRooms] = useState<Room[]>([
    { id: 'room1', name: 'P.101', capacity: 30 },
    { id: 'room2', name: 'P.102', capacity: 25 },
    { id: 'room3', name: 'P.201', capacity: 40 },
    { id: 'room4', name: 'P.202', capacity: 35 },
    { id: 'room5', name: 'P.301', capacity: 20 },
    { id: 'room6', name: 'P.302', capacity: 15 }
  ]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get('/classes', {
          params: {
            limit: 100  // Get all classes
          }
        });

        if (response.data.success) {
          const normalizedClasses = response.data.data.map(normalizeClass);
          setClasses(normalizedClasses);
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
        setClasses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClasses();
  }, []);
  
  const filteredClasses = classes.filter(cls => {
    const matchesSearch = cls.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         cls.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.teacherName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || cls.status === statusFilter;
    const matchesCourse = !courseFilter || cls.courseId === courseFilter;
    
    return matchesSearch && matchesStatus && matchesCourse;
  });
  
  const handleEdit = (classItem: Class) => {
    setCurrentClass(classItem);
    setIsModalOpen(true);
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lớp học này?')) {
      setClasses(classes.filter(cls => cls.id !== id));
    }
  };
  
  const handleSaveClass = (classData: Partial<Class>) => {
    if (currentClass) {
      // Update existing class
      const updatedClass = {
        ...currentClass,
        ...classData,
        courseName: courses.find(c => c.id === classData.courseId)?.name || currentClass.courseName,
        teacherName: teachers.find(t => t.id === classData.teacherId)?.name || currentClass.teacherName
      };
      
      setClasses(classes.map(cls => 
        cls.id === currentClass.id ? updatedClass as Class : cls
      ));
    } else {
      // Add new class
      const newClass: Class = {
        id: `class-${Date.now()}`,
        name: classData.name || '',
        courseId: classData.courseId || '',
        courseName: courses.find(c => c.id === classData.courseId)?.name || '',
        teacherId: classData.teacherId || '',
        teacherName: teachers.find(t => t.id === classData.teacherId)?.name || '',
        schedule: classData.schedule || [],
        startDate: classData.startDate || new Date().toISOString(),
        endDate: classData.endDate || new Date().toISOString(),
        totalSessions: classData.totalSessions || 0,
        completedSessions: classData.completedSessions || 0,
        room: classData.room || '',
        capacity: classData.capacity || 0,
        enrolledStudents: classData.enrolledStudents || 0,
        status: classData.status as 'upcoming' | 'ongoing' | 'completed' | 'cancelled',
        days: classData.days || [],
        time: classData.time || ''
      };
      
      setClasses([...classes, newClass]);
    }
    
    setIsModalOpen(false);
    setCurrentClass(undefined);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Quản lý lớp học</h1>
        <button 
          onClick={() => { setCurrentClass(undefined); setIsModalOpen(true); }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
        >
          <Plus size={18} className="mr-1" /> Thêm lớp học
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên lớp, khóa học, giảng viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 border border-gray-300 bg-white rounded-md hover:bg-gray-50 flex items-center"
            >
              <Filter size={18} className="mr-1" /> Bộ lọc
            </button>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="upcoming">Sắp diễn ra</option>
              <option value="ongoing">Đang diễn ra</option>
              <option value="completed">Đã hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
            
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tất cả khóa học</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        {showFilters && (
          <div className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giảng viên</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Tất cả giảng viên</option>
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phòng học</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Tất cả phòng học</option>
                  {rooms.map(room => (
                    <option key={room.id} value={room.id}>{room.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian học</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Tất cả thời gian</option>
                  <option value="morning">Buổi sáng (7:00 - 12:00)</option>
                  <option value="afternoon">Buổi chiều (13:00 - 17:00)</option>
                  <option value="evening">Buổi tối (18:00 - 21:00)</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex justify-between">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="hasCapacity" className="rounded text-blue-600 focus:ring-blue-500" />
                <label htmlFor="hasCapacity" className="text-sm text-gray-700">Còn chỗ trống</label>
              </div>
              
              <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                Áp dụng
              </button>
            </div>
          </div>
        )}
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredClasses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map(classItem => (
              <ClassCard
                key={classItem.id}
                classItem={classItem}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            Không tìm thấy lớp học nào phù hợp với tiêu chí tìm kiếm
          </div>
        )}
      </div>
      
      {isModalOpen && (
        <ClassModal
          classItem={currentClass}
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setCurrentClass(undefined); }}
          onSave={handleSaveClass}
          courses={courses}
          teachers={teachers}
          rooms={rooms}
        />
      )}
    </div>
  );
};

export default ClassesPage;
