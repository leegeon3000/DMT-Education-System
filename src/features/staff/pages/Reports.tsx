import React, { useState } from 'react';
import { SEOHead } from '../../../components/common';
import {
  TrendingUp,
  Users,
  DollarSign,
  BookOpen,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Activity,
  FileText,
  ArrowUp,
  ArrowDown,
  ChevronRight
} from 'lucide-react';

const Reports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('overview');

  const reportCategories = [
    {
      id: 'overview',
      name: 'Tổng quan',
      icon: BarChart3,
      description: 'Báo cáo tổng hợp các chỉ số chính',
      color: 'blue'
    },
    {
      id: 'academic',
      name: 'Học vụ',
      icon: BookOpen,
      description: 'Báo cáo về hoạt động học tập',
      color: 'green'
    },
    {
      id: 'financial',
      name: 'Tài chính',
      icon: DollarSign,
      description: 'Báo cáo doanh thu và thanh toán',
      color: 'cyan'
    },
    {
      id: 'students',
      name: 'Học viên',
      icon: Users,
      description: 'Thống kê học viên và tuyển sinh',
      color: 'orange'
    }
  ];

  const stats = [
    {
      label: 'Tổng doanh thu',
      value: '₫45,500,000',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'green'
    },
    {
      label: 'Học viên mới',
      value: '24',
      change: '+8.3%',
      trend: 'up',
      icon: Users,
      color: 'blue'
    },
    {
      label: 'Lớp đang hoạt động',
      value: '12',
      change: '+2',
      trend: 'up',
      icon: BookOpen,
      color: 'cyan'
    },
    {
      label: 'Tỷ lệ tham dự',
      value: '92%',
      change: '-1.2%',
      trend: 'down',
      icon: Activity,
      color: 'orange'
    }
  ];

  const recentReports = [
    {
      id: 1,
      name: 'Báo cáo doanh thu tháng 11/2025',
      type: 'Tài chính',
      date: '2025-11-15',
      size: '2.4 MB',
      status: 'completed'
    },
    {
      id: 2,
      name: 'Thống kê học viên Q4/2025',
      type: 'Học viên',
      date: '2025-11-10',
      size: '1.8 MB',
      status: 'completed'
    },
    {
      id: 3,
      name: 'Báo cáo học vụ tuần 46',
      type: 'Học vụ',
      date: '2025-11-08',
      size: '1.2 MB',
      status: 'completed'
    }
  ];

  const quickActions = [
    {
      label: 'Xuất báo cáo Excel',
      icon: Download,
      action: 'export-excel'
    },
    {
      label: 'Xuất báo cáo PDF',
      icon: FileText,
      action: 'export-pdf'
    },
    {
      label: 'Lên lịch báo cáo',
      icon: Calendar,
      action: 'schedule'
    }
  ];

  const handleExport = (format: string) => {
    alert(`Xuất báo cáo dạng ${format.toUpperCase()} - Chức năng đang phát triển`);
  };

  return (
    <>
      <SEOHead
        title="Báo cáo & Thống kê - DMT Education"
        description="Xem và xuất các báo cáo thống kê"
      />

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Báo cáo & Thống kê
              </h1>
              <p className="text-gray-600 mt-1">
                Xem và xuất các báo cáo về hoạt động của trung tâm
              </p>
            </div>

            {/* Period Selector */}
            <div className="flex items-center gap-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="today">Hôm nay</option>
                <option value="week">Tuần này</option>
                <option value="month">Tháng này</option>
                <option value="quarter">Quý này</option>
                <option value="year">Năm này</option>
                <option value="custom">Tùy chọn</option>
              </select>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const TrendIcon = stat.trend === 'up' ? ArrowUp : ArrowDown;
              
              return (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                      <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                    <span className={`flex items-center text-sm font-medium ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <TrendIcon className="w-4 h-4 mr-1" />
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              );
            })}
          </div>

          {/* Report Categories */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Loại báo cáo
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {reportCategories.map((category) => {
                const Icon = category.icon;
                const isSelected = selectedReport === category.id;
                
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedReport(category.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className={`p-2 w-12 h-12 rounded-lg mb-3 ${
                      isSelected ? `bg-${category.color}-500` : `bg-${category.color}-100`
                    }`}>
                      <Icon className={`w-8 h-8 ${
                        isSelected ? 'text-white' : `text-${category.color}-600`
                      }`} />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {category.name}
                    </h3>
                    <p className="text-xs text-gray-600">
                      {category.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Report Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Chart Placeholder */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Biểu đồ thống kê
                  </h2>
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <BarChart3 size={20} />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <PieChart size={20} />
                    </button>
                  </div>
                </div>
                
                {/* Mock Chart */}
                <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
                  <div className="text-center text-gray-500">
                    <BarChart3 size={48} className="mx-auto mb-3 text-gray-400" />
                    <p className="text-sm">Biểu đồ sẽ được hiển thị tại đây</p>
                    <p className="text-xs mt-1">Chọn loại báo cáo và khoảng thời gian</p>
                  </div>
                </div>
              </div>

              {/* Recent Reports */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Báo cáo gần đây
                </h2>
                <div className="space-y-3">
                  {recentReports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-cyan-100 rounded-lg">
                          <FileText className="w-5 h-5 text-cyan-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{report.name}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-600 mt-1">
                            <span>{report.type}</span>
                            <span>•</span>
                            <span>{new Date(report.date).toLocaleDateString('vi-VN')}</span>
                            <span>•</span>
                            <span>{report.size}</span>
                          </div>
                        </div>
                      </div>
                      <button className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors">
                        <Download size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Thao tác nhanh
                </h2>
                <div className="space-y-3">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => handleExport(action.action)}
                        className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-cyan-50 rounded-lg transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white group-hover:bg-cyan-100 rounded-lg transition-colors">
                            <Icon className="w-5 h-5 text-gray-600 group-hover:text-cyan-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {action.label}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-cyan-600" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Report Templates */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Mẫu báo cáo
                </h2>
                <div className="space-y-2">
                  {[
                    'Báo cáo doanh thu hàng tháng',
                    'Thống kê tuyển sinh',
                    'Báo cáo học vụ',
                    'Tổng hợp thanh toán',
                    'Phân tích hiệu suất'
                  ].map((template, index) => (
                    <button
                      key={index}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      {template}
                    </button>
                  ))}
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="p-2 bg-cyan-100 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-cyan-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-cyan-900 mb-1">
                      Mẹo sử dụng
                    </h3>
                    <p className="text-xs text-cyan-700">
                      Bạn có thể lên lịch gửi báo cáo tự động qua email mỗi tuần hoặc mỗi tháng
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reports;
