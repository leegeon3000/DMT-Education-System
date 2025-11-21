import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, Filter, Edit, Trash2, MoreHorizontal, 
  Mail, Phone, Calendar, CheckCircle, XCircle, Clock,
  Download, UserCog, ShieldCheck, Award 
} from 'lucide-react';
import { apiClient } from '../../../services/auth';

// API response interface (uppercase fields from SQL Server)
interface StaffFromAPI {
  ID: number;
  USER_ID: number;
  STAFF_CODE: string;
  DEPARTMENT: string;
  POSITION: string;
  CREATED_AT: string;
  full_name: string;
  email: string;
  phone: string;
  status: string;
}

// Normalized interface for component use
interface StaffMember {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  joinDate: string;
  status: 'active' | 'on_leave' | 'inactive';
  avatar?: string;
  skills: string[];
  address?: string;
  emergencyContact?: string;
  salary?: number;
  leaveBalance: number;
  performanceRating?: number;
  responsibilities: string[];
}

// Helper function to normalize API data
const normalizeStaff = (apiStaff: StaffFromAPI): StaffMember => {
  // Map SQL Server status to component status
  const statusMap: { [key: string]: 'active' | 'on_leave' | 'inactive' } = {
    'ACTIVE': 'active',
    'INACTIVE': 'inactive',
    'ON_LEAVE': 'on_leave'
  };

  return {
    id: apiStaff.ID.toString(),
    fullName: apiStaff.full_name || 'N/A',
    email: apiStaff.email || 'N/A',
    phone: apiStaff.phone || 'N/A',
    position: apiStaff.POSITION || 'N/A',
    department: apiStaff.DEPARTMENT || 'N/A',
    joinDate: apiStaff.CREATED_AT ? apiStaff.CREATED_AT.split('T')[0] : '',
    status: statusMap[apiStaff.status] || 'active',
    avatar: undefined,
    skills: [],
    address: undefined,
    emergencyContact: undefined,
    salary: undefined,
    leaveBalance: 0,
    performanceRating: undefined,
    responsibilities: []
  };
};

const positions = [
  'Quản lý', 'Kế toán', 'Nhân sự', 'Lễ tân',
  'IT', 'Marketing', 'Tuyển sinh', 'Bảo vệ',
  'Nhân viên vệ sinh', 'Tư vấn viên'
];

const departments = [
  'Ban Giám đốc', 'Hành chính', 'Tài chính', 'Học vụ',
  'IT', 'Marketing', 'Tuyển sinh', 'Cơ sở vật chất'
];

const StaffCard: React.FC<{ 
  staff: StaffMember; 
  onEdit: (staff: StaffMember) => void; 
  onDelete: (id: string) => void; 
}> = ({ staff, onEdit, onDelete }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'on_leave': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'active': return 'Đang làm việc';
      case 'on_leave': return 'Nghỉ phép';
      case 'inactive': return 'Đã nghỉ việc';
      default: return status;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 flex items-start justify-between border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
            {staff.avatar ? (
              <img src={staff.avatar} alt={staff.fullName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white text-lg font-semibold">
                {staff.fullName.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{staff.fullName}</h3>
            <p className="text-sm text-gray-600">{staff.position}</p>
          </div>
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
                onClick={() => { onEdit(staff); setShowDropdown(false); }}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
              >
                <Edit size={16} className="mr-2" /> Chỉnh sửa
              </button>
              <button 
                onClick={() => { onDelete(staff.id); setShowDropdown(false); }}
                className="px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left flex items-center"
              >
                <Trash2 size={16} className="mr-2" /> Xóa
              </button>
              <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center">
                <Download size={16} className="mr-2" /> Xuất hồ sơ
              </button>
              <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center">
                <UserCog size={16} className="mr-2" /> Phân quyền
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4 text-sm">
        <div className="mb-4">
          <div className="grid grid-cols-2 gap-y-2">
            <div className="flex items-center">
              <Mail size={14} className="text-gray-400 mr-2" />
              <span className="text-gray-600">{staff.email}</span>
            </div>
            <div className="flex items-center">
              <Phone size={14} className="text-gray-400 mr-2" />
              <span className="text-gray-600">{staff.phone}</span>
            </div>
            <div className="flex items-center">
              <Calendar size={14} className="text-gray-400 mr-2" />
              <span className="text-gray-600">{new Date(staff.joinDate).toLocaleDateString('vi-VN')}</span>
            </div>
            <div className="flex items-center">
              <Clock size={14} className="text-gray-400 mr-2" />
              <span className="text-gray-600">Nghỉ phép: {staff.leaveBalance} ngày</span>
            </div>
          </div>
        </div>
        
        <div className="mb-3">
          <div className="text-gray-500 mb-1 text-xs font-medium uppercase">Phòng ban</div>
          <div className="flex items-center">
            <ShieldCheck size={14} className="text-blue-500 mr-2" />
            <span>{staff.department}</span>
          </div>
        </div>
        
        <div className="mb-3">
          <div className="text-gray-500 mb-1 text-xs font-medium uppercase">Kỹ năng</div>
          <div className="flex flex-wrap gap-1">
            {staff.skills.map((skill, index) => (
              <span key={index} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>
        
        <div>
          <div className="text-gray-500 mb-1 text-xs font-medium uppercase">Trách nhiệm</div>
          <ul className="list-disc list-inside text-gray-700 text-sm pl-1">
            {staff.responsibilities.slice(0, 2).map((resp, idx) => (
              <li key={idx} className="truncate">{resp}</li>
            ))}
            {staff.responsibilities.length > 2 && (
              <li className="text-gray-500 text-xs">+{staff.responsibilities.length - 2} trách nhiệm khác</li>
            )}
          </ul>
        </div>
      </div>
      
      <div className="border-t border-gray-100 p-4 flex items-center justify-between">
        <span className={`px-2.5 py-0.5 rounded-full text-xs ${getStatusColor(staff.status)}`}>
          {getStatusText(staff.status)}
        </span>
        
        {staff.performanceRating !== undefined && (
          <div className="flex items-center">
            <Award size={14} className="text-yellow-500 mr-1" />
            <span className="text-sm font-medium">{staff.performanceRating}/5</span>
          </div>
        )}
      </div>
    </div>
  );
};

const StaffModal: React.FC<{ 
  staff?: StaffMember;
  isOpen: boolean;
  onClose: () => void;
  onSave: (staffData: Partial<StaffMember>) => void;
}> = ({ staff, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<StaffMember>>({
    fullName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    joinDate: new Date().toISOString().split('T')[0],
    status: 'active',
    skills: [],
    leaveBalance: 12,
    responsibilities: []
  });

  const [responsibilityInput, setResponsibilityInput] = useState('');
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    if (staff) {
      setFormData({
        ...staff,
        joinDate: new Date(staff.joinDate).toISOString().split('T')[0]
      });
    }
  }, [staff]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addResponsibility = () => {
    if (responsibilityInput.trim()) {
      setFormData(prev => ({
        ...prev,
        responsibilities: [...(prev.responsibilities || []), responsibilityInput.trim()]
      }));
      setResponsibilityInput('');
    }
  };

  const removeResponsibility = (index: number) => {
    setFormData(prev => ({
      ...prev,
      responsibilities: prev.responsibilities?.filter((_, i) => i !== index)
    }));
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...(prev.skills || []), skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto py-10">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {staff ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chức vụ</label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Chọn chức vụ</option>
                  {positions.map(position => (
                    <option key={position} value={position}>{position}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phòng ban</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Chọn phòng ban</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày vào làm</label>
                <input
                  type="date"
                  name="joinDate"
                  value={formData.joinDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
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
                  <option value="active">Đang làm việc</option>
                  <option value="on_leave">Nghỉ phép</option>
                  <option value="inactive">Đã nghỉ việc</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Liên hệ khẩn cấp</label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lương (VNĐ)</label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số ngày nghỉ phép</label>
                <input
                  type="number"
                  name="leaveBalance"
                  value={formData.leaveBalance}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Đánh giá hiệu suất (1-5)</label>
                <input
                  type="number"
                  name="performanceRating"
                  min="1"
                  max="5"
                  step="0.1"
                  value={formData.performanceRating || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Kỹ năng</label>
                <div className="flex items-center mb-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Thêm kỹ năng"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                  >
                    Thêm
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.skills?.map((skill, index) => (
                    <div key={index} className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="ml-1.5 text-blue-700 hover:text-blue-900"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Trách nhiệm công việc</label>
                <div className="flex items-center mb-2">
                  <input
                    type="text"
                    value={responsibilityInput}
                    onChange={(e) => setResponsibilityInput(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Thêm trách nhiệm"
                  />
                  <button
                    type="button"
                    onClick={addResponsibility}
                    className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                  >
                    Thêm
                  </button>
                </div>
                <ul className="mt-2 space-y-1">
                  {formData.responsibilities?.map((resp, index) => (
                    <li key={index} className="flex items-center bg-gray-50 px-3 py-2 rounded-md">
                      <span className="flex-1">{resp}</span>
                      <button
                        type="button"
                        onClick={() => removeResponsibility(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <XCircle size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
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
              {staff ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const StaffPage: React.FC = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState<StaffMember | undefined>(undefined);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get('/staff');

        if (response.data.success) {
          const normalizedStaff = response.data.data.map(normalizeStaff);
          setStaff(normalizedStaff);
        }
      } catch (error) {
        console.error('Error fetching staff:', error);
        setStaff([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaff();
  }, []);

  const filteredStaff = staff.filter(member => {
    const matchesSearch = 
      member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = !selectedDepartment || member.department === selectedDepartment;
    const matchesStatus = !selectedStatus || member.status === selectedStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleEdit = (member: StaffMember) => {
    setCurrentStaff(member);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
      setStaff(staff.filter(member => member.id !== id));
    }
  };

  const handleSaveStaff = (staffData: Partial<StaffMember>) => {
    if (currentStaff) {
      // Update existing staff
      setStaff(staff.map(member => 
        member.id === currentStaff.id ? { ...member, ...staffData } as StaffMember : member
      ));
    } else {
      // Add new staff
      const newStaffMember: StaffMember = {
        id: `staff-${Date.now()}`,
        fullName: staffData.fullName || '',
        email: staffData.email || '',
        phone: staffData.phone || '',
        position: staffData.position || '',
        department: staffData.department || '',
        joinDate: staffData.joinDate || new Date().toISOString(),
        status: staffData.status as 'active' | 'on_leave' | 'inactive',
        avatar: staffData.avatar,
        skills: staffData.skills || [],
        address: staffData.address,
        emergencyContact: staffData.emergencyContact,
        salary: staffData.salary,
        leaveBalance: staffData.leaveBalance || 12,
        performanceRating: staffData.performanceRating,
        responsibilities: staffData.responsibilities || []
      };
      
      setStaff([...staff, newStaffMember]);
    }
    
    setIsModalOpen(false);
    setCurrentStaff(undefined);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Quản lý nhân viên</h1>
        <button 
          onClick={() => { setCurrentStaff(undefined); setIsModalOpen(true); }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
        >
          <Plus size={18} className="mr-1" /> Thêm nhân viên
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email, chức vụ..."
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
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tất cả phòng ban</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="active">Đang làm việc</option>
              <option value="on_leave">Nghỉ phép</option>
              <option value="inactive">Đã nghỉ việc</option>
            </select>
          </div>
        </div>
        
        {showFilters && (
          <div className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50">
            <h3 className="font-medium text-gray-700 mb-3">Lọc theo chức vụ</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {positions.map(position => (
                <div key={position} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`filter-${position}`}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor={`filter-${position}`} className="text-sm text-gray-700">
                    {position}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredStaff.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStaff.map(member => (
              <StaffCard
                key={member.id}
                staff={member}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            Không tìm thấy nhân viên nào phù hợp với tiêu chí tìm kiếm
          </div>
        )}
      </div>
      
      {isModalOpen && (
        <StaffModal
          staff={currentStaff}
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setCurrentStaff(undefined); }}
          onSave={handleSaveStaff}
        />
      )}
    </div>
  );
};

export default StaffPage;
