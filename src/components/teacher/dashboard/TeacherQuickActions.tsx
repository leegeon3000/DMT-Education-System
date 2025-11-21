import React from 'react';
import { Plus, Upload, Calendar, Users, FileText, ClipboardList } from 'lucide-react';

export interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  bgGradient: string;
  hoverGradient: string;
  onClick: () => void;
}

export interface TeacherQuickActionsProps {
  onCreateAssignment?: () => void;
  onUploadMaterial?: () => void;
  onMarkAttendance?: () => void;
  onScheduleClass?: () => void;
  onGradeSubmissions?: () => void;
  onViewReports?: () => void;
}

export const TeacherQuickActions: React.FC<TeacherQuickActionsProps> = ({
  onCreateAssignment,
  onUploadMaterial,
  onMarkAttendance,
  onScheduleClass,
  onGradeSubmissions,
  onViewReports
}) => {
  const actions: QuickAction[] = [
    {
      id: 'create-assignment',
      label: 'Tạo bài tập',
      icon: <Plus className="w-6 h-6" />,
      bgGradient: 'from-blue-500 to-blue-600',
      hoverGradient: 'hover:from-blue-600 hover:to-blue-700',
      onClick: onCreateAssignment || (() => {})
    },
    {
      id: 'upload-material',
      label: 'Tải tài liệu',
      icon: <Upload className="w-6 h-6" />,
      bgGradient: 'from-purple-500 to-purple-600',
      hoverGradient: 'hover:from-purple-600 hover:to-purple-700',
      onClick: onUploadMaterial || (() => {})
    },
    {
      id: 'mark-attendance',
      label: 'Điểm danh',
      icon: <Users className="w-6 h-6" />,
      bgGradient: 'from-green-500 to-green-600',
      hoverGradient: 'hover:from-green-600 hover:to-green-700',
      onClick: onMarkAttendance || (() => {})
    },
    {
      id: 'schedule-class',
      label: 'Lịch giảng dạy',
      icon: <Calendar className="w-6 h-6" />,
      bgGradient: 'from-orange-500 to-orange-600',
      hoverGradient: 'hover:from-orange-600 hover:to-orange-700',
      onClick: onScheduleClass || (() => {})
    },
    {
      id: 'grade-submissions',
      label: 'Chấm bài',
      icon: <FileText className="w-6 h-6" />,
      bgGradient: 'from-pink-500 to-pink-600',
      hoverGradient: 'hover:from-pink-600 hover:to-pink-700',
      onClick: onGradeSubmissions || (() => {})
    },
    {
      id: 'view-reports',
      label: 'Báo cáo',
      icon: <ClipboardList className="w-6 h-6" />,
      bgGradient: 'from-teal-500 to-teal-600',
      hoverGradient: 'hover:from-teal-600 hover:to-teal-700',
      onClick: onViewReports || (() => {})
    }
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Thao tác nhanh</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className={`flex flex-col items-center justify-center p-4 bg-gradient-to-br ${action.bgGradient} ${action.hoverGradient} text-white rounded-xl shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 group`}
          >
            <div className="mb-2 group-hover:scale-110 transition-transform">
              {action.icon}
            </div>
            <span className="text-xs font-medium text-center leading-tight">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TeacherQuickActions;
