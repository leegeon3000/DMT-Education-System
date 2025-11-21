import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Download, 
  Filter, 
  Calendar, 
  FileSpreadsheet, 
  FileText, 
  Printer,
  TrendingUp,
  TrendingDown,
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  PieChart,
  LineChart,
  Eye,
  Settings,
  RefreshCw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface ReportItem {
  id: string;
  name: string;
  description: string;
  category: string;
  type: 'table' | 'chart' | 'dashboard';
  lastGenerated: string;
}

interface MetricData {
  name: string;
  value: number;
}

interface CourseData {
  name: string;
  value: number;
  color: string;
}

const ReportsDataExport: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'reports' | 'analytics' | 'export'>('reports');
  const [selectedDateRange, setSelectedDateRange] = useState('this-month');
  const [selectedFormat, setSelectedFormat] = useState<'excel' | 'csv' | 'pdf' | 'json'>('excel');
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);

  // Dữ liệu mẫu cho biểu đồ
  const studentGrowthData: MetricData[] = [
    { name: 'T1', value: 120 },
    { name: 'T2', value: 135 },
    { name: 'T3', value: 148 },
    { name: 'T4', value: 162 },
    { name: 'T5', value: 175 },
    { name: 'T6', value: 190 }
  ];

  const revenueData: MetricData[] = [
    { name: 'T1', value: 25000000 },
    { name: 'T2', value: 28000000 },
    { name: 'T3', value: 32000000 },
    { name: 'T4', value: 35000000 },
    { name: 'T5', value: 38000000 },
    { name: 'T6', value: 42000000 }
  ];

  const courseDistributionData: CourseData[] = [
    { name: 'Toán học', value: 35, color: '#3B82F6' },
    { name: 'Tiếng Anh', value: 25, color: '#10B981' },
    { name: 'Vật lý', value: 20, color: '#F59E0B' },
    { name: 'Hóa học', value: 20, color: '#EF4444' }
  ];

  const performanceMetrics = [
    { label: 'Tổng học sinh', value: '1,245', trend: '+12%', isPositive: true, icon: Users },
    { label: 'Tổng khóa học', value: '48', trend: '+3%', isPositive: true, icon: BookOpen },
    { label: 'Giáo viên hoạt động', value: '32', trend: '+5%', isPositive: true, icon: GraduationCap },
    { label: 'Doanh thu tháng', value: '42.5M VNĐ', trend: '+18%', isPositive: true, icon: DollarSign }
  ];

  const availableReports: ReportItem[] = [
    {
      id: 'student-report',
      name: 'Báo cáo học sinh',
      description: 'Thống kê chi tiết về học sinh, điểm danh, kết quả học tập',
      category: 'Học sinh',
      type: 'table',
      lastGenerated: '2024-01-15 14:30'
    },
    {
      id: 'financial-report',
      name: 'Báo cáo tài chính',
      description: 'Doanh thu, chi phí, lợi nhuận theo thời gian',
      category: 'Tài chính',
      type: 'chart',
      lastGenerated: '2024-01-15 09:15'
    },
    {
      id: 'teacher-performance',
      name: 'Hiệu suất giáo viên',
      description: 'Đánh giá hiệu suất và phản hồi từ học sinh',
      category: 'Giáo viên',
      type: 'dashboard',
      lastGenerated: '2024-01-14 16:45'
    },
    {
      id: 'course-analytics',
      name: 'Phân tích khóa học',
      description: 'Thống kê về độ phổ biến và hiệu quả các khóa học',
      category: 'Khóa học',
      type: 'chart',
      lastGenerated: '2024-01-13 11:20'
    }
  ];

  const toggleCardExpansion = (cardId: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  const handleExport = async (format: string, reportId?: string) => {
    setIsGenerating(true);
    // Mô phỏng quá trình xuất báo cáo
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
    
    // Tạo file mẫu
    const filename = `bao-cao-${reportId || 'tong-hop'}-${new Date().toISOString().split('T')[0]}.${format}`;
    console.log(`Đã xuất báo cáo: ${filename}`);
  };

  const SimpleBarChart: React.FC<{ data: MetricData[]; color: string; showValues?: boolean }> = ({ data, color, showValues = true }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    
    return (
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center">
            <div className="w-12 text-sm text-gray-600">{item.name}</div>
            <div className="flex-1 ml-3">
              <div className="h-8 bg-gray-200 rounded overflow-hidden">
                <div 
                  className={`h-full ${color} transition-all duration-500`}
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                />
              </div>
            </div>
            {showValues && (
              <div className="w-20 text-sm text-gray-800 ml-3 text-right">
                {item.value > 1000000 ? `${(item.value / 1000000).toFixed(1)}M` : item.value.toLocaleString()}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const SimplePieChart: React.FC<{ data: CourseData[] }> = ({ data }) => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <div className="flex-1">
                <div className="text-sm font-medium">{item.name}</div>
                <div className="text-xs text-gray-500">{item.value}%</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <div className="flex h-6 rounded-full overflow-hidden">
            {data.map((item, index) => (
              <div 
                key={item.name}
                className="h-full transition-all duration-300"
                style={{ 
                  backgroundColor: item.color, 
                  width: `${item.value}%` 
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Báo cáo & Xuất dữ liệu</h1>
          <p className="text-gray-600 mt-1">Tạo báo cáo, phân tích dữ liệu và xuất thông tin</p>
        </div>
        <div className="flex items-center space-x-3">
          <select 
            value={selectedDateRange}
            onChange={(e) => setSelectedDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="today">Hôm nay</option>
            <option value="this-week">Tuần này</option>
            <option value="this-month">Tháng này</option>
            <option value="this-quarter">Quý này</option>
            <option value="this-year">Năm này</option>
            <option value="custom">Tùy chọn</option>
          </select>
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <RefreshCw size={16} />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'reports', label: 'Báo cáo', icon: FileText },
            { id: 'analytics', label: 'Phân tích', icon: BarChart3 },
            { id: 'export', label: 'Xuất dữ liệu', icon: Download }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          {/* Báo cáo có sẵn */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Báo cáo có sẵn</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableReports.map(report => (
                <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{report.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                      {report.category}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mb-3">
                    Cập nhật: {report.lastGenerated}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      {report.type === 'table' && <FileText size={14} className="text-gray-400" />}
                      {report.type === 'chart' && <BarChart3 size={14} className="text-gray-400" />}
                      {report.type === 'dashboard' && <PieChart size={14} className="text-gray-400" />}
                      <span className="text-xs text-gray-500 capitalize">{report.type}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Eye size={14} />
                      </button>
                      <button 
                        onClick={() => handleExport('excel', report.id)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <Download size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Chỉ số hiệu suất */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <metric.icon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  {metric.isPositive ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${metric.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.trend}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">so với tháng trước</span>
                </div>
              </div>
            ))}
          </div>

          {/* Biểu đồ phân tích */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Biểu đồ tăng trưởng học sinh */}
            <div className="bg-white p-6 rounded-lg border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Tăng trưởng học sinh</h3>
                <button 
                  onClick={() => toggleCardExpansion('student-growth')}
                  className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
                >
                  <LineChart className="text-blue-500" size={20} />
                  {expandedCards.has('student-growth') ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>
              <div className={`transition-all duration-300 ${expandedCards.has('student-growth') ? 'h-80' : 'h-40'}`}>
                <SimpleBarChart data={studentGrowthData} color="bg-blue-500" />
              </div>
            </div>

            {/* Biểu đồ doanh thu */}
            <div className="bg-white p-6 rounded-lg border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Doanh thu theo tháng</h3>
                <button 
                  onClick={() => toggleCardExpansion('revenue')}
                  className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
                >
                  <BarChart3 className="text-green-500" size={20} />
                  {expandedCards.has('revenue') ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>
              <div className={`transition-all duration-300 ${expandedCards.has('revenue') ? 'h-80' : 'h-40'}`}>
                <SimpleBarChart data={revenueData} color="bg-green-500" />
              </div>
            </div>

            {/* Biểu đồ phân bố khóa học */}
            <div className="bg-white p-6 rounded-lg border lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Phân bố khóa học</h3>
                <button 
                  onClick={() => toggleCardExpansion('course-distribution')}
                  className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
                >
                  <PieChart className="text-purple-500" size={20} />
                  {expandedCards.has('course-distribution') ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>
              <div className={`transition-all duration-300 ${expandedCards.has('course-distribution') ? 'h-60' : 'h-32'}`}>
                <SimplePieChart data={courseDistributionData} />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'export' && (
        <div className="space-y-6">
          {/* Tùy chọn xuất dữ liệu */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Xuất dữ liệu</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chọn định dạng */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Định dạng file
                </label>
                <div className="space-y-3">
                  {[
                    { id: 'excel', label: 'Excel (.xlsx)', icon: FileSpreadsheet, description: 'Phù hợp cho phân tích dữ liệu' },
                    { id: 'csv', label: 'CSV (.csv)', icon: FileText, description: 'Định dạng đơn giản, tương thích cao' },
                    { id: 'pdf', label: 'PDF (.pdf)', icon: FileText, description: 'Báo cáo chính thức, in ấn' },
                    { id: 'json', label: 'JSON (.json)', icon: FileText, description: 'Dữ liệu thô cho lập trình viên' }
                  ].map(format => (
                    <label key={format.id} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="export-format"
                        value={format.id}
                        checked={selectedFormat === format.id}
                        onChange={(e) => setSelectedFormat(e.target.value as any)}
                        className="text-blue-600"
                      />
                      <format.icon size={20} className="text-gray-400" />
                      <div className="flex-1">
                        <div className="font-medium">{format.label}</div>
                        <div className="text-sm text-gray-500">{format.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Chọn nội dung xuất */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Nội dung xuất
                </label>
                <div className="space-y-2">
                  {[
                    'Danh sách học sinh',
                    'Thông tin giáo viên',
                    'Lịch học',
                    'Dữ liệu tài chính',
                    'Báo cáo hiệu suất',
                    'Thống kê khóa học'
                  ].map(item => (
                    <label key={item} className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="text-blue-600" />
                      <span className="text-sm">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                <Calendar size={16} className="inline mr-1" />
                Khoảng thời gian: {selectedDateRange === 'this-month' ? 'Tháng này' : 'Tùy chọn'}
              </div>
              <button 
                onClick={() => handleExport(selectedFormat)}
                disabled={isGenerating}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isGenerating ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : (
                  <Download size={16} />
                )}
                <span>{isGenerating ? 'Đang xuất...' : 'Xuất dữ liệu'}</span>
              </button>
            </div>
          </div>

          {/* Lịch sử xuất */}
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Lịch sử xuất gần đây</h3>
            <div className="space-y-3">
              {[
                { name: 'bao-cao-hoc-sinh-2024-01.xlsx', date: '2024-01-15 14:30', size: '2.3 MB', type: 'excel' },
                { name: 'du-lieu-tai-chinh-thang12.pdf', date: '2024-01-10 09:15', size: '1.8 MB', type: 'pdf' },
                { name: 'thong-ke-khoa-hoc-2023.csv', date: '2024-01-05 16:45', size: '856 KB', type: 'csv' }
              ].map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileSpreadsheet size={20} className="text-gray-400" />
                    <div>
                      <div className="font-medium">{file.name}</div>
                      <div className="text-sm text-gray-500">{file.date} • {file.size}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Download size={16} />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Printer size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsDataExport;
