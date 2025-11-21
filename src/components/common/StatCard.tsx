import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  trend?: number;
  subtitle?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  trend, 
  subtitle,
  action 
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-2">{value}</h3>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      
      {trend !== undefined && (
        <div className="mt-3 flex items-center text-sm">
          <span className={trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-500'}>
            {trend > 0 ? '↑' : trend < 0 ? '↓' : '→'} {Math.abs(trend)}%
          </span>
          <span className="text-gray-500 ml-2">so với tháng trước</span>
        </div>
      )}
      
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
        >
          {action.label} →
        </button>
      )}
    </div>
  );
};

export default StatCard;
