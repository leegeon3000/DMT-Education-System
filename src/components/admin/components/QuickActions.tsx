import React from 'react';
import { Plus, UserPlus, BookOpen, Calendar, DollarSign, Mail, FileText, Settings } from 'lucide-react';

const QuickActions: React.FC = () => {
  const actions = [
    {
      title: 'Thêm học viên',
      description: 'Đăng ký học viên mới',
      icon: UserPlus,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => console.log('Add student')
    },
    {
      title: 'Tạo khóa học',
      description: 'Khóa học mới',
      icon: BookOpen,
      color: 'bg-green-500 hover:bg-green-600',
      action: () => console.log('Create course')
    },
    {
      title: 'Lên lịch',
      description: 'Lịch học mới',
      icon: Calendar,
      color: 'bg-red-500 hover:bg-red-600',
      action: () => console.log('Schedule class')
    },
    {
      title: 'Thu học phí',
      description: 'Ghi nhận thanh toán',
      icon: DollarSign,
      color: 'bg-orange-500 hover:bg-orange-600',
      action: () => console.log('Collect payment')
    },
    {
      title: 'Gửi thông báo',
      description: 'Thông báo chung',
      icon: Mail,
      color: 'bg-red-500 hover:bg-red-600',
      action: () => console.log('Send notification')
    },
    {
      title: 'Báo cáo',
      description: 'Xuất báo cáo',
      icon: FileText,
      color: 'bg-indigo-500 hover:bg-indigo-600',
      action: () => console.log('Generate report')
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Settings className="w-5 h-5 mr-2 text-gray-500" />
          Thao tác nhanh
        </h3>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <button
              key={index}
              onClick={action.action}
              className={`p-4 rounded-lg text-white transition-colors ${action.color} group`}
            >
              <div className="flex flex-col items-center text-center">
                <IconComponent className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">{action.title}</span>
                <span className="text-xs opacity-90 mt-1">{action.description}</span>
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Additional quick stats */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Lớp hôm nay</p>
            <p className="text-xl font-bold text-gray-900">8</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Cần xử lý</p>
            <p className="text-xl font-bold text-red-600">3</p>
          </div>
        </div>
      </div>
      
      {/* Quick help */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">?</span>
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-blue-900">Cần hỗ trợ?</p>
            <p className="text-xs text-blue-700 mt-1">
              Liên hệ bộ phận IT hoặc xem hướng dẫn sử dụng
            </p>
            <button className="text-xs text-blue-600 font-medium mt-1 hover:underline">
              Xem hướng dẫn →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
