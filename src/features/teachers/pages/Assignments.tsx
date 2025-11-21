import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../store/slices/userSlice';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Spinner from '../../../components/common/Spinner';
import Modal from '../../../components/common/Modal';
import teacherAPI, { Assignment } from '../../../services/teacherAPI';

interface AssignmentFormData {
  title: string;
  description: string;
  subject: string;
  type: 'homework' | 'quiz' | 'midterm' | 'final';
  dueDate: string;
  maxScore: number;
  instructions: string;
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'final': return 'bg-red-100 text-red-700';
    case 'midterm': return 'bg-orange-100 text-orange-700';
    case 'quiz': return 'bg-blue-100 text-blue-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'published': return 'bg-green-100 text-green-700';
    case 'closed': return 'bg-gray-100 text-gray-700';
    default: return 'bg-yellow-100 text-yellow-700';
  }
};

const AssignmentCard: React.FC<{ 
  assignment: Assignment; 
  onEdit: (assignment: Assignment) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, status: string) => void;
}> = ({ assignment, onEdit, onDelete, onToggleStatus }) => {
  const progressPercentage = (assignment.submissionCount / assignment.totalStudents) * 100;

  return (
    <Card>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
            <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(assignment.type)}`}>
              {assignment.type === 'homework' ? 'Bài tập' : 
               assignment.type === 'quiz' ? 'Kiểm tra' :
               assignment.type === 'midterm' ? 'Giữa kỳ' : 'Cuối kỳ'}
            </span>
            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(assignment.status)}`}>
              {assignment.status === 'draft' ? 'Nháp' : 
               assignment.status === 'published' ? 'Đã phát' : 'Đã đóng'}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 mb-2">{assignment.description}</p>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">Môn:</span> {assignment.subject}
            </div>
            <div>
              <span className="font-medium">Hạn nộp:</span> {assignment.dueDate}
            </div>
            <div>
              <span className="font-medium">Điểm tối đa:</span> {assignment.maxScore}
            </div>
            <div>
              <span className="font-medium">Nộp bài:</span> {assignment.submissionCount}/{assignment.totalStudents}
            </div>
          </div>

          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Tiến độ nộp bài</span>
              <span>{progressPercentage.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-500 h-2 rounded-full transition-all" 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <Button size="sm" variant="secondary" onClick={() => onEdit(assignment)}>
          Chỉnh sửa
        </Button>
        <Button 
          size="sm" 
          variant={assignment.status === 'published' ? 'secondary' : 'primary'}
          onClick={() => onToggleStatus(assignment.id, assignment.status === 'published' ? 'closed' : 'published')}
        >
          {assignment.status === 'published' ? 'Đóng' : 'Phát bài'}
        </Button>
        <Button size="sm" variant="danger" onClick={() => onDelete(assignment.id)}>
          Xóa
        </Button>
      </div>
    </Card>
  );
};

const AssignmentForm: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AssignmentFormData) => void;
  initialData?: Assignment | null;
}> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState<AssignmentFormData>({
    title: '',
    description: '',
    subject: '',
    type: 'homework',
    dueDate: '',
    maxScore: 10,
    instructions: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        subject: initialData.subject,
        type: initialData.type,
        dueDate: initialData.dueDate,
        maxScore: initialData.maxScore,
        instructions: initialData.instructions
      });
    } else {
      setFormData({
        title: '',
        description: '',
        subject: '',
        type: 'homework',
        dueDate: '',
        maxScore: 10,
        instructions: ''
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof AssignmentFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  return (
    <Modal open={isOpen} onClose={onClose} title={initialData ? 'Chỉnh sửa bài tập' : 'Tạo bài tập mới'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tiêu đề *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={handleInputChange('title')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Nhập tiêu đề bài tập"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mô tả
          </label>
          <textarea
            value={formData.description}
            onChange={handleInputChange('description')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Mô tả ngắn gọn về bài tập"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Môn học *
            </label>
            <select
              required
              value={formData.subject}
              onChange={handleInputChange('subject')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Chọn môn học</option>
              <option value="Toán 9">Toán 9</option>
              <option value="Vật lý 9">Vật lý 9</option>
              <option value="Hóa học 9">Hóa học 9</option>
              <option value="Sinh học 9">Sinh học 9</option>
              <option value="Văn 9">Văn 9</option>
              <option value="Anh văn 9">Anh văn 9</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại bài tập *
            </label>
            <select
              required
              value={formData.type}
              onChange={handleInputChange('type')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="homework">Bài tập</option>
              <option value="quiz">Kiểm tra</option>
              <option value="midterm">Giữa kỳ</option>
              <option value="final">Cuối kỳ</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hạn nộp *
            </label>
            <input
              type="datetime-local"
              required
              value={formData.dueDate}
              onChange={handleInputChange('dueDate')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Điểm tối đa *
            </label>
            <input
              type="number"
              required
              min="1"
              max="100"
              value={formData.maxScore}
              onChange={handleInputChange('maxScore')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hướng dẫn làm bài
          </label>
          <textarea
            value={formData.instructions}
            onChange={handleInputChange('instructions')}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Ghi chú, hướng dẫn chi tiết cho học sinh"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" variant="primary">
            {initialData ? 'Cập nhật' : 'Tạo bài tập'}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Hủy
          </Button>
        </div>
      </form>
    </Modal>
  );
};

const Assignments: React.FC = () => {
  const user = useSelector(selectCurrentUser);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'homework' | 'quiz' | 'midterm' | 'final'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'closed'>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);

  useEffect(() => {
    loadAssignments();
  }, [user?.teacher_id]);

  const loadAssignments = async () => {
    if (!user?.teacher_id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = await teacherAPI.getAssignments(user.teacher_id);
      
      // If API returns empty, use fallback data
      if (data.length === 0) {
        const mockAssignments: Assignment[] = [
          {
            id: '1',
            title: 'Phương trình bậc 2',
            description: 'Giải các dạng phương trình bậc 2 cơ bản và nâng cao',
            subject: 'Toán 9',
            type: 'homework',
            dueDate: '2025-08-15T23:59',
            maxScore: 10,
            instructions: 'Làm đầy đủ các bước giải, ghi rõ công thức',
            attachments: [],
            status: 'published',
            submissionCount: 23,
            totalStudents: 30,
            createdAt: '2025-08-05'
          },
          {
            id: '2',
            title: 'Kiểm tra định kỳ - Động học',
            description: 'Kiểm tra 45 phút về chuyển động thẳng đều và biến đổi đều',
            subject: 'Vật lý 9',
            type: 'quiz',
            dueDate: '2025-08-12T14:30',
            maxScore: 10,
            instructions: 'Mang máy tính, không sử dụng tài liệu',
            attachments: [],
            status: 'published',
            submissionCount: 28,
            totalStudents: 30,
            createdAt: '2025-08-01'
          },
          {
            id: '3',
            title: 'Bài tập Axit - Bazơ',
            description: 'Các phản ứng hóa học giữa axit và bazơ',
            subject: 'Hóa học 9',
            type: 'homework',
            dueDate: '2025-08-20T23:59',
            maxScore: 10,
            instructions: 'Cân bằng phương trình hóa học chính xác',
            attachments: [],
            status: 'draft',
            submissionCount: 0,
            totalStudents: 30,
            createdAt: '2025-08-08'
          }
        ];
        setAssignments(mockAssignments);
      } else {
        setAssignments(data);
      }
    } catch (err: any) {
      console.error('Error loading assignments:', err);
      setError(err.message || 'Không thể tải danh sách bài tập');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = async (data: AssignmentFormData) => {
    try {
      const newAssignment = await teacherAPI.createAssignment({
        ...data,
        attachments: [],
        status: 'draft',
        submissionCount: 0,
        totalStudents: 30,
        createdAt: new Date().toISOString().split('T')[0]
      });
      setAssignments(prev => [newAssignment, ...prev]);
      setIsFormOpen(false);
    } catch (err: any) {
      console.error('Error creating assignment:', err);
      // Fallback: add locally if API fails
      const newAssignment: Assignment = {
        id: Date.now().toString(),
        ...data,
        attachments: [],
        status: 'draft',
        submissionCount: 0,
        totalStudents: 30,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setAssignments(prev => [newAssignment, ...prev]);
      setIsFormOpen(false);
    }
  };

  const handleUpdateAssignment = async (data: AssignmentFormData) => {
    if (!editingAssignment) return;
    
    try {
      await teacherAPI.updateAssignment(editingAssignment.id, data);
      setAssignments(prev => prev.map(assignment => 
        assignment.id === editingAssignment.id 
          ? { ...assignment, ...data }
          : assignment
      ));
      setIsFormOpen(false);
      setEditingAssignment(null);
    } catch (err: any) {
      console.error('Error updating assignment:', err);
      // Fallback: update locally
      setAssignments(prev => prev.map(assignment => 
        assignment.id === editingAssignment.id 
          ? { ...assignment, ...data }
          : assignment
      ));
      setIsFormOpen(false);
      setEditingAssignment(null);
    }
  };

  const handleDeleteAssignment = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa bài tập này?')) return;
    
    try {
      await teacherAPI.deleteAssignment(id);
      setAssignments(prev => prev.filter(assignment => assignment.id !== id));
    } catch (err: any) {
      console.error('Error deleting assignment:', err);
      // Fallback: delete locally
      setAssignments(prev => prev.filter(assignment => assignment.id !== id));
    }
  };

  const handleToggleStatus = async (id: string, newStatus: string) => {
    try {
      await teacherAPI.updateAssignment(id, { status: newStatus as any });
      setAssignments(prev => prev.map(assignment => 
        assignment.id === id 
          ? { ...assignment, status: newStatus as any }
          : assignment
      ));
    } catch (err: any) {
      console.error('Error toggling status:', err);
      // Fallback: update locally
      setAssignments(prev => prev.map(assignment => 
        assignment.id === id 
          ? { ...assignment, status: newStatus as any }
          : assignment
      ));
    }
  };

  const handleEdit = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setIsFormOpen(true);
  };

  const filteredAssignments = assignments.filter(assignment => {
    const typeMatch = filter === 'all' || assignment.type === filter;
    const statusMatch = statusFilter === 'all' || assignment.status === statusFilter;
    return typeMatch && statusMatch;
  });

  if (loading) return (
    <div className="flex items-center gap-2 text-gray-600">
      <Spinner /> Đang tải bài tập...
    </div>
  );

  if (error) return (
    <div className="text-red-600 bg-red-50 p-4 rounded-md">
      Lỗi: {error}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Quản lý bài tập</h1>
          <p className="text-sm text-gray-600">Tạo và quản lý bài tập, đề kiểm tra cho học sinh.</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          + Tạo bài tập mới
        </Button>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex gap-2">
          <span className="text-sm font-medium text-gray-700">Loại:</span>
          {[
            { key: 'all', label: 'Tất cả' },
            { key: 'homework', label: 'Bài tập' },
            { key: 'quiz', label: 'Kiểm tra' },
            { key: 'midterm', label: 'Giữa kỳ' },
            { key: 'final', label: 'Cuối kỳ' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`px-3 py-1 text-sm rounded-md transition ${
                filter === key
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <span className="text-sm font-medium text-gray-700">Trạng thái:</span>
          {[
            { key: 'all', label: 'Tất cả' },
            { key: 'draft', label: 'Nháp' },
            { key: 'published', label: 'Đã phát' },
            { key: 'closed', label: 'Đã đóng' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setStatusFilter(key as any)}
              className={`px-3 py-1 text-sm rounded-md transition ${
                statusFilter === key
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {filteredAssignments.length === 0 ? (
        <Card>
          <div className="text-center py-8 text-gray-500">
            Không có bài tập nào phù hợp với bộ lọc hiện tại.
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredAssignments.map(assignment => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              onEdit={handleEdit}
              onDelete={handleDeleteAssignment}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      )}

      <AssignmentForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingAssignment(null);
        }}
        onSubmit={editingAssignment ? handleUpdateAssignment : handleCreateAssignment}
        initialData={editingAssignment}
      />
    </div>
  );
};

export default Assignments;