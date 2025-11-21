import React from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UserGroupIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

export interface StaffRevenueWidgetProps {
  monthlyRevenue: number;
  lastMonthRevenue?: number;
  growthPercentage?: number;
  activeStudents: number;
  breakdown?: {
    cash: number;
    bankTransfer: number;
    creditCard: number;
  };
  loading?: boolean;
  onViewDetails?: () => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

export const StaffRevenueWidget: React.FC<StaffRevenueWidgetProps> = ({
  monthlyRevenue,
  lastMonthRevenue,
  growthPercentage = 0,
  activeStudents,
  breakdown,
  loading = false,
  onViewDetails
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  const isGrowthPositive = growthPercentage >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Revenue Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">Doanh thu tháng này</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-2">
              {formatCurrency(monthlyRevenue)}
            </h3>
            
            {growthPercentage !== 0 && (
              <div className={`flex items-center gap-1 text-sm mt-2 ${isGrowthPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isGrowthPositive ? (
                  <ArrowTrendingUpIcon className="w-4 h-4" />
                ) : (
                  <ArrowTrendingDownIcon className="w-4 h-4" />
                )}
                <span>
                  {isGrowthPositive ? '+' : ''}{growthPercentage.toFixed(1)}% so với tháng trước
                </span>
              </div>
            )}
          </div>
          
          <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
            <ChartBarIcon className="w-8 h-8 text-white" />
          </div>
        </div>

        {breakdown && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-600 mb-2">Phân bổ theo phương thức:</p>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Tiền mặt:</span>
                <span className="font-medium">{formatCurrency(breakdown.cash)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Chuyển khoản:</span>
                <span className="font-medium">{formatCurrency(breakdown.bankTransfer)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Thẻ:</span>
                <span className="font-medium">{formatCurrency(breakdown.creditCard)}</span>
              </div>
            </div>
          </div>
        )}

        {onViewDetails && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={onViewDetails}
              className="text-sm font-medium text-red-600 hover:text-red-700 inline-flex items-center gap-1"
            >
              Xem báo cáo chi tiết <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </motion.div>

      {/* Active Students Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">Học viên đang hoạt động</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-2">
              {activeStudents.toLocaleString('vi-VN')}
            </h3>
            <div className="flex items-center gap-1 text-sm text-blue-600 mt-2">
              <span>Đang học tại trung tâm</span>
            </div>
          </div>
          
          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
            <UserGroupIcon className="w-8 h-8 text-white" />
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={onViewDetails}
            className="text-sm font-medium text-red-600 hover:text-red-700 inline-flex items-center gap-1"
          >
            Quản lý học viên <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default StaffRevenueWidget;
