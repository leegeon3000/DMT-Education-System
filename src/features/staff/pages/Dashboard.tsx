import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SEOHead } from '../../../components/common';
import StatCard from '../../../components/common/StatCard';
import PageHeader from '../../../components/common/PageHeader';
import staffAPI, { StaffStats } from '../../../services/staffAPI';
import {
  UserPlusIcon,
  BanknotesIcon,
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ClipboardDocumentListIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

const StaffDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StaffStats | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      try {
        const statsData = await staffAPI.getStats();
        setStats(statsData);
      } catch (apiError) {
        console.warn('API not available, using mock data:', apiError);
        
        // Mock data fallback
        setStats({
          pendingRegistrations: 5,
          pendingPayments: 12,
          newTickets: 3,
          todayClasses: 8,
          monthlyRevenue: 45000000,
          activeStudents: 234,
        });
      }
    } catch (error) {
      console.error('Failed to fetch staff dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <>
      <SEOHead
        title="Dashboard Nhân viên - DMT Education"
        description="Dashboard quản lý học vụ và hỗ trợ"
        keywords="nhân viên, dashboard, học vụ, hỗ trợ"
      />

      {/* Modern Background with Gradient */}
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Chào {new Date().getHours() < 12 ? 'buổi sáng' : new Date().getHours() < 18 ? 'buổi chiều' : 'buổi tối'}! 🌟
                </h1>
                <p className="text-gray-600">
                  {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Modern Stats Cards - 4 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Đăng ký chờ duyệt</p>
                    <h3 className="text-3xl font-bold text-gray-900">{stats?.pendingRegistrations || 0}</h3>
                    <p className="text-xs text-gray-500 mt-1">Học viên mới</p>
                  </div>
                  <div className="p-3 bg-blue-600 rounded-lg">
                    <UserPlusIcon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <button
                  onClick={() => navigate('/staff/registrations')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
                >
                  Xem danh sách <ArrowRightIcon className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Thanh toán chờ xử lý</p>
                    <h3 className="text-3xl font-bold text-green-600">{stats?.pendingPayments || 0}</h3>
                    <p className="text-xs text-gray-500 mt-1">Giao dịch</p>
                  </div>
                  <div className="p-3 bg-green-600 rounded-lg">
                    <BanknotesIcon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <button
                  onClick={() => navigate('/staff/payments')}
                  className="text-sm text-green-600 hover:text-green-700 font-medium inline-flex items-center gap-1"
                >
                  Xử lý ngay <ArrowRightIcon className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Tickets mới</p>
                    <h3 className="text-3xl font-bold text-red-600">{stats?.newTickets || 0}</h3>
                    <p className="text-xs text-gray-500 mt-1">Cần trả lời</p>
                  </div>
                  <div className="p-3 bg-red-600 rounded-lg">
                    <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <button
                  onClick={() => navigate('/staff/tickets')}
                  className="text-sm text-red-600 hover:text-red-700 font-medium inline-flex items-center gap-1"
                >
                  Trả lời <ArrowRightIcon className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Lớp học hôm nay</p>
                    <h3 className="text-3xl font-bold text-cyan-600">{stats?.todayClasses || 0}</h3>
                    <p className="text-xs text-gray-500 mt-1">Lớp đang diễn ra</p>
                  </div>
                  <div className="p-3 bg-cyan-600 rounded-lg">
                    <CalendarDaysIcon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <button
                  onClick={() => navigate('/staff/schedule')}
                  className="text-sm text-cyan-600 hover:text-cyan-700 font-medium inline-flex items-center gap-1"
                >
                  Xem lịch <ArrowRightIcon className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Revenue & Students Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Doanh thu tháng này</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">
                      {formatCurrency(stats?.monthlyRevenue || 0)}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-green-600 mt-2">
                      <ArrowTrendingUpIcon className="w-4 h-4" />
                      <span>+15% so với tháng trước</span>
                    </div>
                  </div>
                  <div className="p-3 bg-green-600 rounded-lg">
                    <ChartBarIcon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => navigate('/staff/reports/finance')}
                    className="text-sm font-medium text-red-600 hover:text-red-700 inline-flex items-center gap-1"
                  >
                    Xem báo cáo chi tiết <ArrowRightIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Học viên đang hoạt động</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">
                      {stats?.activeStudents || 0}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-blue-600 mt-2">
                      <CheckCircleIcon className="w-4 h-4" />
                      <span>Đang học tại trung tâm</span>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-600 rounded-lg">
                    <UserGroupIcon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => navigate('/staff/students')}
                    className="text-sm font-medium text-red-600 hover:text-red-700 inline-flex items-center gap-1"
                  >
                    Quản lý học viên <ArrowRightIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-8"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ClockIcon className="w-5 h-5 text-red-600" />
              Thao tác nhanh
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  label: 'Đăng ký học viên',
                  icon: UserPlusIcon,
                  color: 'blue-600',
                  path: '/staff/students/register'
                },
                {
                  label: 'Ghi nhận thanh toán',
                  icon: BanknotesIcon,
                  color: 'green-600',
                  path: '/staff/payments/process'
                },
                {
                  label: 'Đăng ký lớp học',
                  icon: AcademicCapIcon,
                  color: 'cyan-600',
                  path: '/staff/enrollments/create'
                },
                {
                  label: 'Quản lý lịch học',
                  icon: CalendarDaysIcon,
                  color: 'red-600',
                  path: '/staff/schedule'
                }
              ].map((action, index) => (
                <motion.button
                  key={action.path}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.05 }}
                  onClick={() => navigate(action.path)}
                  className="group flex flex-col items-center justify-center p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all"
                >
                  <div className={`w-12 h-12 bg-${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-900 text-center group-hover:text-red-600 transition-colors">
                    {action.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Today's Tasks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <ClipboardDocumentListIcon className="w-5 h-5 text-red-600" />
                Nhiệm vụ hôm nay
              </h2>
              
              <div className="space-y-4">
                {stats && stats.pendingRegistrations > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.0 }}
                    className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <UserPlusIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Xử lý đăng ký mới</h3>
                        <p className="text-sm text-gray-600">{stats.pendingRegistrations} đăng ký đang chờ duyệt</p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate('/staff/registrations')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg transition-all"
                    >
                      Xử lý ngay
                    </button>
                  </motion.div>
                )}

                {stats && stats.pendingPayments > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.1 }}
                    className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                        <BanknotesIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Thanh toán chờ xử lý</h3>
                        <p className="text-sm text-gray-600">{stats.pendingPayments} giao dịch cần ghi nhận</p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate('/staff/payments')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 hover:shadow-lg transition-all"
                    >
                      Xem chi tiết
                    </button>
                  </motion.div>
                )}

                {stats && stats.newTickets > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 }}
                    className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                        <ChatBubbleLeftRightIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Tickets hỗ trợ mới</h3>
                        <p className="text-sm text-gray-600">{stats.newTickets} yêu cầu hỗ trợ cần trả lời</p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate('/staff/tickets')}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 hover:shadow-lg transition-all"
                    >
                      Trả lời ngay
                    </button>
                  </motion.div>
                )}

                {(!stats || (stats.pendingRegistrations === 0 && stats.pendingPayments === 0 && stats.newTickets === 0)) && (
                  <div className="text-center py-12 text-gray-500">
                    <CheckCircleIcon className="w-16 h-16 mx-auto mb-3 text-green-400" />
                    <p className="text-lg font-medium text-gray-900 mb-1">Tuyệt vời!</p>
                    <p>Không có nhiệm vụ nào cần xử lý</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default StaffDashboard;
