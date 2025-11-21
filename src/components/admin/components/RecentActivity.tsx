import React from 'react';
import { Clock, DollarSign, User } from 'lucide-react';

interface Transaction {
  id: string;
  student: string;
  amount: number;
  course: string;
  date: string;
}

interface RecentActivityProps {
  transactions: Transaction[];
  formatCurrency: (amount: number) => string;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ transactions, formatCurrency }) => {
  const getTimeAgo = (date: string) => {
    const now = new Date();
    const transactionDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - transactionDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Vừa xong';
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} ngày trước`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-indigo-500" />
          Hoạt động gần đây
        </h3>
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          Xem tất cả
        </button>
      </div>
      
      <div className="space-y-4">
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    Thanh toán học phí
                  </p>
                  <span className="text-sm font-semibold text-green-600">
                    {formatCurrency(transaction.amount)}
                  </span>
                </div>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <User className="w-3 h-3 mr-1" />
                  <span className="mr-2">{transaction.student}</span>
                  <span className="mr-2">•</span>
                  <span className="mr-2">{transaction.course}</span>
                  <span className="mr-2">•</span>
                  <span>{getTimeAgo(transaction.date)}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Chưa có hoạt động nào gần đây</p>
          </div>
        )}
      </div>
      
      {/* Quick stats */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-semibold text-gray-900">{transactions.length}</p>
            <p className="text-xs text-gray-500">Giao dịch hôm nay</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(transactions.reduce((sum, t) => sum + t.amount, 0))}
            </p>
            <p className="text-xs text-gray-500">Tổng thu hôm nay</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">
              {new Set(transactions.map(t => t.student)).size}
            </p>
            <p className="text-xs text-gray-500">Học viên thanh toán</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
