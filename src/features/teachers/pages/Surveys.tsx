import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Spinner from '../../../components/common/Spinner';
import Modal from '../../../components/common/Modal';

interface SurveyQuestion {
  id: string;
  type: 'rating' | 'text' | 'multiple_choice' | 'yes_no';
  question: string;
  options?: string[];
  required: boolean;
}

interface Survey {
  id: string;
  title: string;
  description: string;
  questions: SurveyQuestion[];
  targetStudents: string[];
  condition: string;
  status: 'draft' | 'active' | 'closed';
  responseCount: number;
  totalTargets: number;
  createdAt: string;
  endDate?: string;
}

interface SurveyResponse {
  studentId: string;
  studentName: string;
  submittedAt: string;
  answers: { questionId: string; answer: string | number }[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-700';
    case 'closed': return 'bg-gray-100 text-gray-700';
    default: return 'bg-yellow-100 text-yellow-700';
  }
};

const SurveyCard: React.FC<{ 
  survey: Survey; 
  onEdit: (survey: Survey) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, status: string) => void;
  onViewResponses: (survey: Survey) => void;
}> = ({ survey, onEdit, onDelete, onToggleStatus, onViewResponses }) => {
  const responseRate = (survey.responseCount / survey.totalTargets) * 100;

  return (
    <Card>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-gray-900">{survey.title}</h3>
            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(survey.status)}`}>
              {survey.status === 'draft' ? 'Nháp' : 
               survey.status === 'active' ? 'Đang mở' : 'Đã đóng'}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 mb-2">{survey.description}</p>
          
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">Điều kiện:</span> {survey.condition}
            </div>
            <div>
              <span className="font-medium">Câu hỏi:</span> {survey.questions.length}
            </div>
            <div>
              <span className="font-medium">Tạo lúc:</span> {survey.createdAt}
            </div>
            {survey.endDate && (
              <div>
                <span className="font-medium">Kết thúc:</span> {survey.endDate}
              </div>
            )}
          </div>

          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Tỷ lệ phản hồi</span>
              <span>{survey.responseCount}/{survey.totalTargets} ({responseRate.toFixed(0)}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-500 h-2 rounded-full transition-all" 
                style={{ width: `${responseRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <Button size="sm" variant="secondary" onClick={() => onEdit(survey)}>
          Chỉnh sửa
        </Button>
        <Button 
          size="sm" 
          variant={survey.status === 'active' ? 'secondary' : 'primary'}
          onClick={() => onToggleStatus(survey.id, survey.status === 'active' ? 'closed' : 'active')}
        >
          {survey.status === 'active' ? 'Đóng khảo sát' : 'Mở khảo sát'}
        </Button>
        <Button size="sm" variant="outline" onClick={() => onViewResponses(survey)}>
          Xem kết quả ({survey.responseCount})
        </Button>
        <Button size="sm" variant="danger" onClick={() => onDelete(survey.id)}>
          Xóa
        </Button>
      </div>
    </Card>
  );
};

const SurveyForm: React.FC<{
  open: boolean;
  onClose: () => void;
  onSubmit: (survey: Omit<Survey, 'id' | 'responseCount' | 'createdAt'>) => void;
  initialData?: Survey | null;
}> = ({ open, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    condition: 'Đã hoàn thành bài học',
    endDate: '',
    targetStudents: [] as string[]
  });
  
  const [questions, setQuestions] = useState<SurveyQuestion[]>([
    {
      id: '1',
      type: 'rating' as const,
      question: 'Bạn đánh giá như thế nào về chất lượng bài giảng?',
      required: true
    }
  ]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        condition: initialData.condition,
        endDate: initialData.endDate || '',
        targetStudents: initialData.targetStudents
      });
      setQuestions(initialData.questions);
    }
  }, [initialData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      questions,
      status: 'draft',
      totalTargets: 30 // Mock value
    });
  };

  const addQuestion = () => {
    const newQuestion: SurveyQuestion = {
      id: Date.now().toString(),
      type: 'rating',
      question: '',
      required: false
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index: number, field: keyof SurveyQuestion, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  return (
    <Modal open={open} onClose={onClose} title={initialData ? 'Chỉnh sửa khảo sát' : 'Tạo khảo sát mới'}>
      <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tiêu đề khảo sát *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="VD: Đánh giá chất lượng môn Toán 9"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mô tả
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Mô tả mục đích và nội dung khảo sát"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Điều kiện tham gia *
            </label>
            <select
              required
              value={formData.condition}
              onChange={(e) => setFormData(prev => ({ ...prev, condition: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="Đã hoàn thành bài học">Đã hoàn thành bài học</option>
              <option value="Đã nộp bài tập">Đã nộp bài tập</option>
              <option value="Tham gia đủ 80% buổi học">Tham gia đủ 80% buổi học</option>
              <option value="Không có điều kiện">Không có điều kiện</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày kết thúc
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Câu hỏi khảo sát
            </label>
            <Button type="button" size="sm" onClick={addQuestion}>
              + Thêm câu hỏi
            </Button>
          </div>
          
          <div className="space-y-3">
            {questions.map((question, index) => (
              <div key={question.id} className="border border-gray-200 rounded-md p-3">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-gray-700">Câu {index + 1}</span>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Xóa
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <select
                    value={question.type}
                    onChange={(e) => updateQuestion(index, 'type', e.target.value)}
                    className="px-2 py-1 text-sm border border-gray-300 rounded"
                  >
                    <option value="rating">Đánh giá (1-5 sao)</option>
                    <option value="text">Trả lời tự do</option>
                    <option value="multiple_choice">Trắc nghiệm</option>
                    <option value="yes_no">Có/Không</option>
                  </select>
                  
                  <label className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={question.required}
                      onChange={(e) => updateQuestion(index, 'required', e.target.checked)}
                      className="mr-1"
                    />
                    Bắt buộc
                  </label>
                </div>
                
                <input
                  type="text"
                  value={question.question}
                  onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                  placeholder="Nhập nội dung câu hỏi"
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                />
                
                {question.type === 'multiple_choice' && (
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="Các lựa chọn (cách nhau bởi dấu |)"
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                      onChange={(e) => updateQuestion(index, 'options', e.target.value.split('|'))}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" variant="primary">
            {initialData ? 'Cập nhật' : 'Tạo khảo sát'}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Hủy
          </Button>
        </div>
      </form>
    </Modal>
  );
};

const ResponsesModal: React.FC<{
  open: boolean;
  onClose: () => void;
  survey: Survey | null;
}> = ({ open, onClose, survey }) => {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);

  useEffect(() => {
    if (survey && open) {
      // Mock responses data
      setResponses([
        {
          studentId: 's1',
          studentName: 'Nguyễn Văn An',
          submittedAt: '2025-08-14 10:30',
          answers: [
            { questionId: '1', answer: 4 }
          ]
        },
        {
          studentId: 's2',
          studentName: 'Trần Thị Bình',
          submittedAt: '2025-08-14 15:20',
          answers: [
            { questionId: '1', answer: 5 }
          ]
        }
      ]);
    }
  }, [survey, open]);

  if (!survey) return null;

  return (
    <Modal open={open} onClose={onClose} title={`Kết quả khảo sát: ${survey.title}`}>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        <div className="text-sm text-gray-600">
          <p>Tổng phản hồi: {responses.length}/{survey.totalTargets}</p>
          <p>Tỷ lệ: {((responses.length / survey.totalTargets) * 100).toFixed(0)}%</p>
        </div>

        {survey.questions.map(question => (
          <div key={question.id} className="border border-gray-200 rounded-md p-3">
            <h4 className="font-medium text-gray-900 mb-2">{question.question}</h4>
            
            {question.type === 'rating' && (
              <div>
                {responses.map(response => {
                  const answer = response.answers.find(a => a.questionId === question.id);
                  const rating = answer?.answer as number || 0;
                  return (
                    <div key={response.studentId} className="flex justify-between items-center text-sm">
                      <span>{response.studentName}</span>
                      <span className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={16} 
                            fill={i < rating ? 'currentColor' : 'none'}
                            className={i < rating ? 'text-yellow-400' : 'text-gray-300'}
                          />
                        ))}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </Modal>
  );
};

const Surveys: React.FC = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'draft' | 'active' | 'closed'>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSurvey, setEditingSurvey] = useState<Survey | null>(null);
  const [responsesModalSurvey, setResponsesModalSurvey] = useState<Survey | null>(null);

  useEffect(() => {
    loadSurveys();
  }, []);

  const loadSurveys = async () => {
    try {
      setLoading(true);
      // Mock data since API might not be ready
      const mockSurveys: Survey[] = [
        {
          id: '1',
          title: 'Đánh giá chất lượng môn Toán 9',
          description: 'Khảo sát ý kiến học sinh về phương pháp giảng dạy và nội dung môn Toán 9',
          questions: [
            {
              id: '1',
              type: 'rating',
              question: 'Bạn đánh giá như thế nào về chất lượng bài giảng?',
              required: true
            },
            {
              id: '2',
              type: 'text',
              question: 'Bạn có góp ý gì để cải thiện chất lượng học tập?',
              required: false
            }
          ],
          targetStudents: [],
          condition: 'Đã hoàn thành bài học',
          status: 'active',
          responseCount: 18,
          totalTargets: 30,
          createdAt: '2025-08-10',
          endDate: '2025-08-20'
        },
        {
          id: '2',
          title: 'Phản hồi về bài tập Phương trình',
          description: 'Thu thập ý kiến về độ khó và tính hữu ích của bài tập',
          questions: [
            {
              id: '1',
              type: 'rating',
              question: 'Mức độ khó của bài tập như thế nào?',
              required: true
            }
          ],
          targetStudents: [],
          condition: 'Đã nộp bài tập',
          status: 'draft',
          responseCount: 0,
          totalTargets: 25,
          createdAt: '2025-08-14'
        }
      ];
      setSurveys(mockSurveys);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách khảo sát');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSurvey = async (surveyData: Omit<Survey, 'id' | 'responseCount' | 'createdAt'>) => {
    try {
      const newSurvey: Survey = {
        ...surveyData,
        id: Date.now().toString(),
        responseCount: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setSurveys(prev => [newSurvey, ...prev]);
      setIsFormOpen(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUpdateSurvey = async (surveyData: Omit<Survey, 'id' | 'responseCount' | 'createdAt'>) => {
    if (!editingSurvey) return;
    
    try {
      setSurveys(prev => prev.map(survey => 
        survey.id === editingSurvey.id 
          ? { ...survey, ...surveyData }
          : survey
      ));
      setIsFormOpen(false);
      setEditingSurvey(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteSurvey = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa khảo sát này?')) return;
    
    try {
      setSurveys(prev => prev.filter(survey => survey.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleToggleStatus = async (id: string, newStatus: string) => {
    try {
      setSurveys(prev => prev.map(survey => 
        survey.id === id 
          ? { ...survey, status: newStatus as any }
          : survey
      ));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEdit = (survey: Survey) => {
    setEditingSurvey(survey);
    setIsFormOpen(true);
  };

  const filteredSurveys = surveys.filter(survey => 
    filter === 'all' || survey.status === filter
  );

  if (loading) return (
    <div className="flex items-center gap-2 text-gray-600">
      <Spinner /> Đang tải khảo sát...
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
          <h1 className="text-xl font-semibold text-gray-900">Khảo sát ý kiến</h1>
          <p className="text-sm text-gray-600">Tạo khảo sát lấy ý kiến học sinh. Có thể đặt điều kiện tham gia.</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          + Tạo khảo sát mới
        </Button>
      </div>

      <div className="flex gap-2">
        <span className="text-sm font-medium text-gray-700">Trạng thái:</span>
        {[
          { key: 'all', label: 'Tất cả' },
          { key: 'draft', label: 'Nháp' },
          { key: 'active', label: 'Đang mở' },
          { key: 'closed', label: 'Đã đóng' }
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

      {filteredSurveys.length === 0 ? (
        <Card>
          <div className="text-center py-8 text-gray-500">
            Không có khảo sát nào phù hợp với bộ lọc hiện tại.
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredSurveys.map(survey => (
            <SurveyCard
              key={survey.id}
              survey={survey}
              onEdit={handleEdit}
              onDelete={handleDeleteSurvey}
              onToggleStatus={handleToggleStatus}
              onViewResponses={setResponsesModalSurvey}
            />
          ))}
        </div>
      )}

      <SurveyForm
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingSurvey(null);
        }}
        onSubmit={editingSurvey ? handleUpdateSurvey : handleCreateSurvey}
        initialData={editingSurvey}
      />

      <ResponsesModal
        open={!!responsesModalSurvey}
        onClose={() => setResponsesModalSurvey(null)}
        survey={responsesModalSurvey}
      />
    </div>
  );
};

export default Surveys;