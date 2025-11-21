import React from 'react';
import { motion } from 'framer-motion';
import {
  UserPlusIcon,
  BanknotesIcon,
  AcademicCapIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  BellAlertIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

export interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  path: string;
}

export interface StaffQuickActionsProps {
  onRegisterStudent: () => void;
  onProcessPayment: () => void;
  onCreateEnrollment: () => void;
  onViewSchedule: () => void;
  onHandleTicket: () => void;
  onViewReports: () => void;
  onCreateNotification?: () => void;
  onManageDocuments?: () => void;
}

export const StaffQuickActions: React.FC<StaffQuickActionsProps> = ({
  onRegisterStudent,
  onProcessPayment,
  onCreateEnrollment,
  onViewSchedule,
  onHandleTicket,
  onViewReports,
  onCreateNotification,
  onManageDocuments
}) => {
  const actions: (QuickAction & { onClick: () => void })[] = [
    {
      id: 'register',
      label: 'Đăng ký học viên',
      icon: UserPlusIcon,
      color: 'from-blue-500 to-blue-600',
      path: '/staff/students/register',
      onClick: onRegisterStudent
    },
    {
      id: 'payment',
      label: 'Ghi nhận thanh toán',
      icon: BanknotesIcon,
      color: 'from-green-500 to-green-600',
      path: '/staff/payments/process',
      onClick: onProcessPayment
    },
    {
      id: 'enrollment',
      label: 'Đăng ký lớp học',
      icon: AcademicCapIcon,
      color: 'from-purple-500 to-purple-600',
      path: '/staff/enrollments/create',
      onClick: onCreateEnrollment
    },
    {
      id: 'schedule',
      label: 'Quản lý lịch học',
      icon: CalendarDaysIcon,
      color: 'from-red-500 to-red-600',
      path: '/staff/schedule',
      onClick: onViewSchedule
    },
    {
      id: 'ticket',
      label: 'Xử lý ticket',
      icon: ChatBubbleLeftRightIcon,
      color: 'from-orange-500 to-orange-600',
      path: '/staff/tickets',
      onClick: onHandleTicket
    },
    {
      id: 'reports',
      label: 'Xem báo cáo',
      icon: ChartBarIcon,
      color: 'from-indigo-500 to-indigo-600',
      path: '/staff/reports',
      onClick: onViewReports
    }
  ];

  // Add optional actions if provided
  if (onCreateNotification) {
    actions.push({
      id: 'notification',
      label: 'Tạo thông báo',
      icon: BellAlertIcon,
      color: 'from-pink-500 to-pink-600',
      path: '/staff/notifications',
      onClick: onCreateNotification
    });
  }

  if (onManageDocuments) {
    actions.push({
      id: 'documents',
      label: 'Quản lý tài liệu',
      icon: DocumentTextIcon,
      color: 'from-teal-500 to-teal-600',
      path: '/staff/documents',
      onClick: onManageDocuments
    });
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span className="w-1 h-6 bg-gradient-to-b from-red-600 to-rose-600 rounded-full"></span>
        Thao tác nhanh
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={action.onClick}
            className="group flex flex-col items-center justify-center p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all"
          >
            <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              <action.icon className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-900 text-center group-hover:text-red-600 transition-colors">
              {action.label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default StaffQuickActions;
