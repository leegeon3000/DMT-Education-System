import React from 'react';
import { motion } from 'framer-motion';
import {
  UserPlusIcon,
  BanknotesIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export interface PendingTask {
  id: string;
  type: 'registration' | 'payment' | 'ticket' | 'enrollment';
  title: string;
  description: string;
  count: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  color: string;
  icon: React.ComponentType<any>;
  action: {
    label: string;
    onClick: () => void;
  };
}

export interface StaffPendingTasksProps {
  tasks: PendingTask[];
  loading?: boolean;
}

export const StaffPendingTasks: React.FC<StaffPendingTasksProps> = ({
  tasks,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Nhiệm vụ hôm nay</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 bg-gray-50 rounded-lg animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default tasks if none provided
  const displayTasks = tasks.length > 0 ? tasks : [];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-red-200 bg-red-50';
      case 'high': return 'border-orange-200 bg-orange-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      default: return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span className="w-1 h-6 bg-gradient-to-b from-red-600 to-rose-600 rounded-full"></span>
        Nhiệm vụ hôm nay
      </h2>
      
      <div className="space-y-4">
        {displayTasks.length > 0 ? (
          displayTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between p-4 rounded-lg border ${getPriorityColor(task.priority)} hover:shadow-md transition-all`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${task.color} rounded-lg flex items-center justify-center`}>
                  <task.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{task.title}</h3>
                  <p className="text-sm text-gray-600">{task.description}</p>
                </div>
              </div>
              <button
                onClick={task.action.onClick}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:shadow-lg transition-all whitespace-nowrap"
              >
                {task.action.label}
              </button>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            <CheckCircleIcon className="w-16 h-16 mx-auto mb-3 text-green-400" />
            <p className="text-lg font-medium text-gray-900 mb-1">Tuyệt vời!</p>
            <p>Không có nhiệm vụ nào cần xử lý</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffPendingTasks;
