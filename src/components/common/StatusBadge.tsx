import React from 'react';
import { CheckCircle, Clock, XCircle, AlertCircle, Pause, PlayCircle } from 'lucide-react';

export type StatusType = 
  | 'active' 
  | 'inactive' 
  | 'completed' 
  | 'pending' 
  | 'cancelled' 
  | 'expired'
  | 'upcoming'
  | 'ongoing'
  | 'success'
  | 'error'
  | 'warning'
  | 'info';

export interface StatusBadgeProps {
  status: StatusType;
  customText?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const statusConfig: Record<StatusType, {
  text: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  icon?: React.ReactNode;
}> = {
  active: {
    text: 'Hoạt động',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200',
    icon: <CheckCircle className="w-4 h-4" />
  },
  inactive: {
    text: 'Không hoạt động',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-200',
    icon: <Pause className="w-4 h-4" />
  },
  completed: {
    text: 'Hoàn thành',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    icon: <CheckCircle className="w-4 h-4" />
  },
  pending: {
    text: 'Chờ xử lý',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    borderColor: 'border-yellow-200',
    icon: <Clock className="w-4 h-4" />
  },
  cancelled: {
    text: 'Đã hủy',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
    icon: <XCircle className="w-4 h-4" />
  },
  expired: {
    text: 'Hết hạn',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-200',
    icon: <AlertCircle className="w-4 h-4" />
  },
  upcoming: {
    text: 'Sắp tới',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
    icon: <Clock className="w-4 h-4" />
  },
  ongoing: {
    text: 'Đang diễn ra',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200',
    icon: <PlayCircle className="w-4 h-4" />
  },
  success: {
    text: 'Thành công',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200',
    icon: <CheckCircle className="w-4 h-4" />
  },
  error: {
    text: 'Lỗi',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
    icon: <XCircle className="w-4 h-4" />
  },
  warning: {
    text: 'Cảnh báo',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-200',
    icon: <AlertCircle className="w-4 h-4" />
  },
  info: {
    text: 'Thông tin',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    icon: <AlertCircle className="w-4 h-4" />
  }
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base'
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  customText,
  showIcon = true,
  size = 'md',
  className = ''
}) => {
  const config = statusConfig[status];
  
  if (!config) {
    console.warn(`Unknown status type: ${status}`);
    return null;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${config.bgColor} ${config.textColor} ${config.borderColor} ${sizeClasses[size]} ${className}`}
    >
      {showIcon && config.icon}
      <span>{customText || config.text}</span>
    </span>
  );
};

export default StatusBadge;
