import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Calendar as CalendarIcon, 
  Clock,
  Users,
  BookOpen,
  MapPin,
  Download,
  Printer,
  Share2,
  Search,
  Plus
} from 'lucide-react';

interface ScheduleEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  date: string;
  className: string;
  courseId: string;
  courseName: string;
  teacherId: string;
  teacherName: string;
  roomId: string;
  roomName: string;
  studentCount: number;
  color: string;
  type: 'class' | 'exam' | 'meeting' | 'other';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}

interface Teacher {
  id: string;
  name: string;
}

interface Room {
  id: string;
  name: string;
}

interface Course {
  id: string;
  name: string;
}

interface Class {
  id: string;
  name: string;
}

const timeSlots = [
  '07:00', '08:00', '09:00', '10:00', '11:00', 
  '12:00', '13:00', '14:00', '15:00', '16:00', 
  '17:00', '18:00', '19:00', '20:00', '21:00'
];

const weekDays = [
  { short: 'CN', long: 'Chủ nhật' },
  { short: 'T2', long: 'Thứ hai' },
  { short: 'T3', long: 'Thứ ba' },
  { short: 'T4', long: 'Thứ tư' },
  { short: 'T5', long: 'Thứ năm' },
  { short: 'T6', long: 'Thứ sáu' },
  { short: 'T7', long: 'Thứ bảy' }
];

const eventColors = [
  'bg-blue-100 border-blue-300 text-blue-800',
  'bg-green-100 border-green-300 text-green-800',
  'bg-yellow-100 border-yellow-300 text-yellow-800',
  'bg-red-100 border-red-300 text-red-800',
  'bg-pink-100 border-pink-300 text-pink-800',
  'bg-indigo-100 border-indigo-300 text-indigo-800'
];

const EventDetails: React.FC<{
  event: ScheduleEvent | null;
  onClose: () => void;
}> = ({ event, onClose }) => {
  if (!event) return null;
  
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Đã lên lịch';
      case 'in-progress': return 'Đang diễn ra';
      case 'completed': return 'Đã hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };
  
  const getEventTypeText = (type: string) => {
    switch (type) {
      case 'class': return 'Lớp học';
      case 'exam': return 'Kiểm tra/Thi';
      case 'meeting': return 'Họp/Hội thảo';
      case 'other': return 'Hoạt động khác';
      default: return type;
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className={`p-4 ${event.color} border-b`}>
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg">{event.title}</h3>
            <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
              &times;
            </button>
          </div>
          <p className="text-sm mt-1">{event.className}</p>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center">
              <CalendarIcon size={16} className="mr-2 text-gray-500" />
              <span>{new Date(event.date).toLocaleDateString('vi-VN', { 
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
              })}</span>
            </div>
            
            <div className="flex items-center">
              <Clock size={16} className="mr-2 text-gray-500" />
              <span>{event.startTime} - {event.endTime}</span>
            </div>
            
            <div className="flex items-center">
              <MapPin size={16} className="mr-2 text-gray-500" />
              <span>Phòng: {event.roomName}</span>
            </div>
            
            <div className="flex items-center">
              <Users size={16} className="mr-2 text-gray-500" />
              <span>{event.studentCount} học sinh</span>
            </div>
            
            <div className="flex items-center">
              <BookOpen size={16} className="mr-2 text-gray-500" />
              <span>Khóa học: {event.courseName}</span>
            </div>
            
            <div className="border-t border-gray-200 pt-3 mt-2 grid grid-cols-2 gap-2">
              <div className="text-sm">
                <div className="text-gray-500 mb-1">Loại hoạt động</div>
                <div className="font-medium">{getEventTypeText(event.type)}</div>
              </div>
              
              <div className="text-sm">
                <div className="text-gray-500 mb-1">Trạng thái</div>
                <div className={`px-2 py-1 rounded-full text-xs inline-block font-medium ${getStatusBadgeColor(event.status)}`}>
                  {getStatusText(event.status)}
                </div>
              </div>
              
              <div className="text-sm col-span-2">
                <div className="text-gray-500 mb-1">Giáo viên</div>
                <div className="font-medium">{event.teacherName}</div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-2">
            <button className="px-3 py-1.5 border border-gray-300 rounded-md text-sm flex items-center text-gray-700 hover:bg-gray-50">
              <Share2 size={14} className="mr-1" /> Chia sẻ
            </button>
            <button className="px-3 py-1.5 border border-gray-300 rounded-md text-sm flex items-center text-gray-700 hover:bg-gray-50">
              <Printer size={14} className="mr-1" /> In lịch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AddScheduleModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventData: Partial<ScheduleEvent>) => void;
  teachers: Teacher[];
  rooms: Room[];
  courses: Course[];
  classes: Class[];
  selectedDate?: string;
}> = ({ isOpen, onClose, onSave, teachers, rooms, courses, classes, selectedDate }) => {
  const [formData, setFormData] = useState<Partial<ScheduleEvent>>({
    title: '',
    startTime: '08:00',
    endTime: '10:00',
    date: selectedDate || new Date().toISOString().split('T')[0],
    className: '',
    courseId: '',
    courseName: '',
    teacherId: '',
    teacherName: '',
    roomId: '',
    roomName: '',
    studentCount: 0,
    type: 'class',
    status: 'scheduled',
    color: eventColors[0]
  });
  
  useEffect(() => {
    if (selectedDate) {
      setFormData(prev => ({ ...prev, date: selectedDate }));
    }
  }, [selectedDate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const courseId = e.target.value;
    const selectedCourse = courses.find(c => c.id === courseId);
    if (selectedCourse) {
      setFormData(prev => ({
        ...prev,
        courseId,
        courseName: selectedCourse.name
      }));
    }
  };
  
  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const classId = e.target.value;
    const selectedClass = classes.find(c => c.id === classId);
    if (selectedClass) {
      setFormData(prev => ({
        ...prev,
        className: selectedClass.name
      }));
    }
  };
  
  const handleTeacherChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const teacherId = e.target.value;
    const selectedTeacher = teachers.find(t => t.id === teacherId);
    if (selectedTeacher) {
      setFormData(prev => ({
        ...prev,
        teacherId,
        teacherName: selectedTeacher.name
      }));
    }
  };
  
  const handleRoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const roomId = e.target.value;
    const selectedRoom = rooms.find(r => r.id === roomId);
    if (selectedRoom) {
      setFormData(prev => ({
        ...prev,
        roomId,
        roomName: selectedRoom.name
      }));
    }
  };
  
  const handleColorChange = (color: string) => {
    setFormData(prev => ({ ...prev, color }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
        <div className="p-4 bg-blue-50 border-b border-blue-100">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg text-blue-800">Thêm lịch mới</h3>
            <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
              &times;
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Loại</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="class">Lớp học</option>
                    <option value="exam">Kiểm tra/Thi</option>
                    <option value="meeting">Họp/Hội thảo</option>
                    <option value="other">Hoạt động khác</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian bắt đầu</label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian kết thúc</label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Khóa học</label>
                  <select
                    name="courseId"
                    value={formData.courseId}
                    onChange={handleCourseChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Chọn khóa học</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>{course.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lớp học</label>
                  <select
                    name="classId"
                    onChange={handleClassChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Chọn lớp học</option>
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.id}>{cls.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giáo viên</label>
                  <select
                    name="teacherId"
                    value={formData.teacherId}
                    onChange={handleTeacherChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Chọn giáo viên</option>
                    {teachers.map(teacher => (
                      <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phòng học</label>
                  <select
                    name="roomId"
                    value={formData.roomId}
                    onChange={handleRoomChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Chọn phòng</option>
                    {rooms.map(room => (
                      <option key={room.id} value={room.id}>{room.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số học sinh</label>
                  <input
                    type="number"
                    name="studentCount"
                    value={formData.studentCount}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="scheduled">Đã lên lịch</option>
                    <option value="in-progress">Đang diễn ra</option>
                    <option value="completed">Đã hoàn thành</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Màu sắc</label>
                <div className="flex flex-wrap gap-2">
                  {eventColors.map((color, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 ${color.split(' ')[0]} ${formData.color === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                      onClick={() => handleColorChange(color)}
                    ></button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SchedulePage: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  const [view, setView] = useState<'week' | 'day'>('week');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);
  
  // Mock data for teachers, rooms, courses, and classes
  const [teachers, setTeachers] = useState<Teacher[]>([
    { id: 'teacher1', name: 'Nguyễn Văn Anh' },
    { id: 'teacher2', name: 'Trần Thị Bình' },
    { id: 'teacher3', name: 'Lê Văn Cường' },
    { id: 'teacher4', name: 'Phạm Thị Dung' }
  ]);
  
  const [rooms, setRooms] = useState<Room[]>([
    { id: 'room1', name: 'P.101' },
    { id: 'room2', name: 'P.102' },
    { id: 'room3', name: 'P.201' },
    { id: 'room4', name: 'P.202' },
    { id: 'room5', name: 'P.301' },
    { id: 'room6', name: 'P.302' }
  ]);
  
  const [courses, setCourses] = useState<Course[]>([
    { id: 'course1', name: 'Toán học nâng cao' },
    { id: 'course2', name: 'Tiếng Anh giao tiếp' },
    { id: 'course3', name: 'Vật lý đại cương' },
    { id: 'course4', name: 'Hóa học cơ bản' }
  ]);
  
  const [classes, setClasses] = useState<Class[]>([
    { id: 'class1', name: 'Toán nâng cao A1' },
    { id: 'class2', name: 'Tiếng Anh giao tiếp B1' },
    { id: 'class3', name: 'Vật lý đại cương A1' },
    { id: 'class4', name: 'Hóa học cơ bản A1' }
  ]);

  useEffect(() => {
    // Mock events data
    const mockEvents: ScheduleEvent[] = [
      {
        id: '1',
        title: 'Toán học nâng cao',
        startTime: '08:00',
        endTime: '10:00',
        date: '2025-08-24',
        className: 'Toán nâng cao A1',
        courseId: 'course1',
        courseName: 'Toán học nâng cao',
        teacherId: 'teacher1',
        teacherName: 'Nguyễn Văn Anh',
        roomId: 'room1',
        roomName: 'P.101',
        studentCount: 25,
        color: 'bg-blue-100 border-blue-300 text-blue-800',
        type: 'class',
        status: 'scheduled'
      },
      {
        id: '2',
        title: 'Tiếng Anh giao tiếp',
        startTime: '10:00',
        endTime: '12:00',
        date: '2025-08-24',
        className: 'Tiếng Anh giao tiếp B1',
        courseId: 'course2',
        courseName: 'Tiếng Anh giao tiếp',
        teacherId: 'teacher2',
        teacherName: 'Trần Thị Bình',
        roomId: 'room2',
        roomName: 'P.102',
        studentCount: 20,
        color: 'bg-green-100 border-green-300 text-green-800',
        type: 'class',
        status: 'in-progress'
      },
      {
        id: '3',
        title: 'Kiểm tra giữa kỳ Vật lý',
        startTime: '13:00',
        endTime: '15:00',
        date: '2025-08-25',
        className: 'Vật lý đại cương A1',
        courseId: 'course3',
        courseName: 'Vật lý đại cương',
        teacherId: 'teacher3',
        teacherName: 'Lê Văn Cường',
        roomId: 'room3',
        roomName: 'P.201',
        studentCount: 35,
        color: 'bg-yellow-100 border-yellow-300 text-yellow-800',
        type: 'exam',
        status: 'scheduled'
      },
      {
        id: '4',
        title: 'Thực hành hóa học',
        startTime: '15:00',
        endTime: '17:00',
        date: '2025-08-25',
        className: 'Hóa học cơ bản A1',
        courseId: 'course4',
        courseName: 'Hóa học cơ bản',
        teacherId: 'teacher4',
        teacherName: 'Phạm Thị Dung',
        roomId: 'room4',
        roomName: 'P.202',
        studentCount: 15,
        color: 'bg-red-100 border-red-300 text-red-800',
        type: 'class',
        status: 'scheduled'
      },
      {
        id: '5',
        title: 'Họp giáo viên',
        startTime: '17:00',
        endTime: '18:00',
        date: '2025-08-26',
        className: '',
        courseId: '',
        courseName: '',
        teacherId: '',
        teacherName: 'Tất cả giáo viên',
        roomId: 'room5',
        roomName: 'P.301',
        studentCount: 0,
        color: 'bg-pink-100 border-pink-300 text-pink-800',
        type: 'meeting',
        status: 'scheduled'
      },
      {
        id: '6',
        title: 'Toán học nâng cao',
        startTime: '18:00',
        endTime: '20:00',
        date: '2025-08-26',
        className: 'Toán nâng cao A1',
        courseId: 'course1',
        courseName: 'Toán học nâng cao',
        teacherId: 'teacher1',
        teacherName: 'Nguyễn Văn Anh',
        roomId: 'room1',
        roomName: 'P.101',
        studentCount: 25,
        color: 'bg-blue-100 border-blue-300 text-blue-800',
        type: 'class',
        status: 'scheduled'
      },
      {
        id: '7',
        title: 'Tiếng Anh giao tiếp',
        startTime: '08:00',
        endTime: '10:00',
        date: '2025-08-27',
        className: 'Tiếng Anh giao tiếp B1',
        courseId: 'course2',
        courseName: 'Tiếng Anh giao tiếp',
        teacherId: 'teacher2',
        teacherName: 'Trần Thị Bình',
        roomId: 'room2',
        roomName: 'P.102',
        studentCount: 20,
        color: 'bg-green-100 border-green-300 text-green-800',
        type: 'class',
        status: 'scheduled'
      }
    ];
    
    setEvents(mockEvents);
  }, []);
  
  const getWeekDates = (date: Date): Date[] => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust for starting week on Monday
    const mondayOfWeek = new Date(date);
    mondayOfWeek.setDate(diff);
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const newDate = new Date(mondayOfWeek);
      newDate.setDate(mondayOfWeek.getDate() + i);
      weekDates.push(newDate);
    }
    return weekDates;
  };
  
  const weekDates = getWeekDates(currentWeek);
  
  const previousWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() - 7);
    setCurrentWeek(newDate);
  };
  
  const nextWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() + 7);
    setCurrentWeek(newDate);
  };
  
  const goToCurrentWeek = () => {
    setCurrentWeek(new Date());
  };
  
  const formatDateString = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };
  
  const getEventsForDateAndTime = (date: Date, timeSlot: string): ScheduleEvent[] => {
    const dateString = formatDateString(date);
    
    return events.filter(event => {
      if (event.date !== dateString) return false;
      
      const eventStartHour = parseInt(event.startTime.split(':')[0]);
      const timeSlotHour = parseInt(timeSlot.split(':')[0]);
      
      return eventStartHour === timeSlotHour;
    });
  };
  
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         event.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.teacherName.toLowerCase().includes(searchTerm.toLowerCase());
                         
    const matchesTeacher = !selectedTeacher || event.teacherId === selectedTeacher;
    const matchesRoom = !selectedRoom || event.roomId === selectedRoom;
    const matchesClass = !selectedClass || event.className.includes(selectedClass);
    
    return matchesSearch && matchesTeacher && matchesRoom && matchesClass;
  });
  
  const handleEventClick = (event: ScheduleEvent) => {
    setSelectedEvent(event);
  };
  
  const handleCellClick = (date: Date, timeSlot: string) => {
    setSelectedDate(formatDateString(date));
    setIsAddModalOpen(true);
  };
  
  const handleAddEvent = (eventData: Partial<ScheduleEvent>) => {
    const newEvent: ScheduleEvent = {
      id: `event-${Date.now()}`,
      title: eventData.title || '',
      startTime: eventData.startTime || '08:00',
      endTime: eventData.endTime || '10:00',
      date: eventData.date || formatDateString(new Date()),
      className: eventData.className || '',
      courseId: eventData.courseId || '',
      courseName: eventData.courseName || '',
      teacherId: eventData.teacherId || '',
      teacherName: eventData.teacherName || '',
      roomId: eventData.roomId || '',
      roomName: eventData.roomName || '',
      studentCount: eventData.studentCount || 0,
      color: eventData.color || eventColors[0],
      type: eventData.type as 'class' | 'exam' | 'meeting' | 'other',
      status: eventData.status as 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
    };
    
    setEvents([...events, newEvent]);
    setIsAddModalOpen(false);
    setSelectedDate(undefined);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Quản lý lịch học</h1>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setView('week')} 
            className={`px-4 py-2 rounded-md ${
              view === 'week' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tuần
          </button>
          <button 
            onClick={() => setView('day')} 
            className={`px-4 py-2 rounded-md ${
              view === 'day' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Ngày
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)} 
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center ml-2"
          >
            <Plus size={18} className="mr-1" /> Thêm lịch
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center mb-4 sm:mb-0">
            <button 
              onClick={previousWeek} 
              className="p-2 hover:bg-gray-100 rounded-full mr-1"
              aria-label="Previous week"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={nextWeek} 
              className="p-2 hover:bg-gray-100 rounded-full mr-3"
              aria-label="Next week"
            >
              <ChevronRight size={20} />
            </button>
            
            <h2 className="text-lg font-medium">
              {new Intl.DateTimeFormat('vi-VN', { month: 'long', year: 'numeric' }).format(weekDates[0])}
              {new Intl.DateTimeFormat('vi-VN', { month: 'long' }).format(weekDates[6]) !== 
               new Intl.DateTimeFormat('vi-VN', { month: 'long' }).format(weekDates[0]) && 
               ` - ${new Intl.DateTimeFormat('vi-VN', { month: 'long' }).format(weekDates[6])}`}
            </h2>
            
            <button 
              onClick={goToCurrentWeek} 
              className="ml-4 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Hôm nay
            </button>
          </div>
          
          <div className="flex space-x-2 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0">
              <input
                type="text"
                placeholder="Tìm kiếm lịch học..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 border border-gray-300 bg-white rounded-md hover:bg-gray-50 flex items-center"
            >
              <Filter size={18} className="mr-1" /> Bộ lọc
            </button>
            
            <button className="px-4 py-2 border border-gray-300 bg-white rounded-md hover:bg-gray-50 flex items-center">
              <Download size={18} className="mr-1" /> Xuất
            </button>
          </div>
        </div>
        
        {showFilters && (
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giáo viên</label>
                <select
                  value={selectedTeacher}
                  onChange={(e) => setSelectedTeacher(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tất cả giáo viên</option>
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phòng học</label>
                <select
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tất cả phòng học</option>
                  {rooms.map(room => (
                    <option key={room.id} value={room.id}>{room.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lớp học</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tất cả lớp học</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Calendar header */}
            <div className="grid grid-cols-8 border-b border-gray-200">
              <div className="p-3 text-gray-500 border-r border-gray-200 bg-gray-50"></div>
              {weekDates.map((date, index) => {
                const isToday = new Date().toDateString() === date.toDateString();
                return (
                  <div 
                    key={index} 
                    className={`p-3 text-center border-r border-gray-200 ${isToday ? 'bg-blue-50' : 'bg-gray-50'}`}
                  >
                    <p className={`font-medium ${isToday ? 'text-blue-600' : 'text-gray-600'}`}>
                      {weekDays[date.getDay()].short}
                    </p>
                    <p className={`${isToday ? 'bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center mx-auto' : 'text-gray-800'}`}>
                      {date.getDate()}
                    </p>
                  </div>
                );
              })}
            </div>
            
            {/* Calendar body */}
            <div>
              {timeSlots.map((timeSlot, timeIndex) => (
                <div key={timeIndex} className="grid grid-cols-8 border-b border-gray-200">
                  <div className="p-2 text-sm text-gray-500 border-r border-gray-200 flex items-center justify-center">
                    {timeSlot}
                  </div>
                  
                  {weekDates.map((date, dateIndex) => {
                    const cellEvents = getEventsForDateAndTime(date, timeSlot);
                    const isToday = new Date().toDateString() === date.toDateString();
                    
                    return (
                      <div 
                        key={dateIndex}
                        className={`p-1 border-r border-gray-200 min-h-[5rem] relative ${
                          isToday ? 'bg-blue-50/30' : ''
                        }`}
                        onClick={() => handleCellClick(date, timeSlot)}
                      >
                        {cellEvents.length > 0 ? (
                          cellEvents.map(event => (
                            <div
                              key={event.id}
                              onClick={(e) => { e.stopPropagation(); handleEventClick(event); }}
                              className={`p-2 rounded-md border ${event.color} mb-1 cursor-pointer hover:shadow-md transition-shadow overflow-hidden`}
                            >
                              <div className="font-medium text-sm truncate">{event.title}</div>
                              <div className="text-xs flex items-center mt-1">
                                <Clock size={12} className="mr-1" />
                                {event.startTime} - {event.endTime}
                              </div>
                              <div className="text-xs flex items-center mt-1">
                                <MapPin size={12} className="mr-1" />
                                {event.roomName}
                              </div>
                            </div>
                          ))
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {selectedEvent && (
        <EventDetails 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)} 
        />
      )}
      
      {isAddModalOpen && (
        <AddScheduleModal
          isOpen={isAddModalOpen}
          onClose={() => { setIsAddModalOpen(false); setSelectedDate(undefined); }}
          onSave={handleAddEvent}
          teachers={teachers}
          rooms={rooms}
          courses={courses}
          classes={classes}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
};

export default SchedulePage;
