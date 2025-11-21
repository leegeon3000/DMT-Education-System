import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Activity, 
  Shield, 
  Database, 
  Wifi, 
  Clock, 
  Users, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  BarChart3,
  Monitor,
  Cpu,
  HardDrive,
  Network,
  Bug,
  TestTube,
  Zap,
  Globe,
  Lock,
  Eye
} from 'lucide-react';

interface SystemMetric {
  name: string;
  value: string;
  status: 'good' | 'warning' | 'error';
  description: string;
}

interface TestResult {
  module: string;
  testName: string;
  status: 'passed' | 'failed' | 'warning';
  duration: string;
  details?: string;
}

interface PerformanceData {
  metric: string;
  current: number;
  optimal: number;
  unit: string;
  status: 'good' | 'warning' | 'error';
}

const SystemIntegration: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'testing' | 'security'>('overview');
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [lastTestRun, setLastTestRun] = useState('2024-01-15 14:30:25');

  const systemMetrics: SystemMetric[] = [
    { name: 'Trạng thái hệ thống', value: 'Hoạt động tốt', status: 'good', description: 'Tất cả services đang chạy bình thường' },
    { name: 'Kết nối cơ sở dữ liệu', value: 'Kết nối', status: 'good', description: 'Kết nối DB ổn định, độ trễ < 50ms' },
    { name: 'API Response Time', value: '245ms', status: 'warning', description: 'Thời gian phản hồi hơi chậm' },
    { name: 'Người dùng online', value: '127', status: 'good', description: '127 người dùng đang truy cập' },
    { name: 'Tải CPU', value: '34%', status: 'good', description: 'Mức sử dụng CPU trong giới hạn' },
    { name: 'Bộ nhớ sử dụng', value: '2.1GB', status: 'good', description: 'Còn 5.9GB bộ nhớ khả dụng' }
  ];

  const performanceData: PerformanceData[] = [
    { metric: 'Page Load Time', current: 1.2, optimal: 1.0, unit: 's', status: 'warning' },
    { metric: 'API Response', current: 245, optimal: 200, unit: 'ms', status: 'warning' },
    { metric: 'Database Query', current: 120, optimal: 100, unit: 'ms', status: 'warning' },
    { metric: 'Memory Usage', current: 2100, optimal: 4000, unit: 'MB', status: 'good' },
    { metric: 'CPU Usage', current: 34, optimal: 70, unit: '%', status: 'good' },
    { metric: 'Network Latency', current: 45, optimal: 50, unit: 'ms', status: 'good' }
  ];

  const testResults: TestResult[] = [
    { module: 'Dashboard', testName: 'Tải dữ liệu tổng quan', status: 'passed', duration: '0.8s' },
    { module: 'Học sinh', testName: 'CRUD operations', status: 'passed', duration: '1.2s' },
    { module: 'Lớp học', testName: 'Phân công giáo viên', status: 'passed', duration: '0.9s' },
    { module: 'Khóa học', testName: 'Tạo khóa học mới', status: 'passed', duration: '1.1s' },
    { module: 'Giáo viên', testName: 'Quản lý lịch dạy', status: 'warning', duration: '2.3s', details: 'Chậm hơn mong đợi' },
    { module: 'Tài chính', testName: 'Tính toán học phí', status: 'passed', duration: '0.7s' },
    { module: 'Thông báo', testName: 'Gửi thông báo hàng loạt', status: 'passed', duration: '1.5s' },
    { module: 'Người dùng', testName: 'Phân quyền truy cập', status: 'passed', duration: '0.6s' },
    { module: 'Báo cáo', testName: 'Xuất dữ liệu Excel', status: 'failed', duration: '5.2s', details: 'Timeout khi xuất file lớn' }
  ];

  const moduleIntegrations = [
    { 
      name: 'Dashboard ↔ Tất cả modules', 
      status: 'good', 
      description: 'Hiển thị dữ liệu từ tất cả các modules',
      dependencies: ['Học sinh', 'Giáo viên', 'Khóa học', 'Tài chính']
    },
    { 
      name: 'Học sinh ↔ Lớp học', 
      status: 'good', 
      description: 'Đăng ký và chuyển lớp học sinh',
      dependencies: ['Tài chính', 'Thông báo']
    },
    { 
      name: 'Giáo viên ↔ Lớp học', 
      status: 'good', 
      description: 'Phân công và quản lý lịch dạy',
      dependencies: ['Khóa học', 'Thông báo']
    },
    { 
      name: 'Tài chính ↔ Học sinh', 
      status: 'warning', 
      description: 'Quản lý học phí và thanh toán',
      dependencies: ['Thông báo', 'Báo cáo']
    },
    { 
      name: 'Báo cáo ↔ Tất cả modules', 
      status: 'warning', 
      description: 'Thu thập và phân tích dữ liệu',
      dependencies: ['Dashboard']
    }
  ];

  const securityChecks = [
    { check: 'Xác thực người dùng', status: 'passed', description: 'JWT tokens hoạt động bình thường' },
    { check: 'Phân quyền truy cập', status: 'passed', description: 'Role-based access control' },
    { check: 'Mã hóa dữ liệu', status: 'passed', description: 'HTTPS và mã hóa DB' },
    { check: 'Session management', status: 'passed', description: 'Session timeout và security' },
    { check: 'Input validation', status: 'warning', description: 'Cần cải thiện validation cho một số form' },
    { check: 'SQL Injection prevention', status: 'passed', description: 'Sử dụng prepared statements' }
  ];

  const runSystemTests = async () => {
    setIsRunningTests(true);
    // Mô phỏng chạy tests
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsRunningTests(false);
    setLastTestRun(new Date().toLocaleString('vi-VN'));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
      case 'passed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
      case 'passed':
        return 'text-green-600 bg-green-50';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50';
      case 'error':
      case 'failed':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tích hợp & Kiểm thử hệ thống</h1>
          <p className="text-gray-600 mt-1">Giám sát hiệu suất, kiểm thử tích hợp và bảo mật hệ thống</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-sm text-gray-500">
            <Clock size={16} className="inline mr-1" />
            Cập nhật: {lastTestRun}
          </div>
          <button 
            onClick={runSystemTests}
            disabled={isRunningTests}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isRunningTests ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : (
              <TestTube size={16} />
            )}
            <span>{isRunningTests ? 'Đang kiểm thử...' : 'Chạy kiểm thử'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Tổng quan', icon: Monitor },
            { id: 'performance', label: 'Hiệu suất', icon: Zap },
            { id: 'testing', label: 'Kiểm thử', icon: TestTube },
            { id: 'security', label: 'Bảo mật', icon: Shield }
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
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* System Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {systemMetrics.map((metric, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{metric.name}</h3>
                  {getStatusIcon(metric.status)}
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {metric.value}
                </div>
                <p className="text-sm text-gray-600">{metric.description}</p>
              </div>
            ))}
          </div>

          {/* Module Integration Status */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Trạng thái tích hợp modules</h2>
            <div className="space-y-4">
              {moduleIntegrations.map((integration, index) => (
                <div key={index} className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-medium">{integration.name}</h3>
                      {getStatusIcon(integration.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{integration.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {integration.dependencies.map((dep, depIndex) => (
                        <span key={depIndex} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                          {dep}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(integration.status)}`}>
                    {integration.status === 'good' ? 'Hoạt động' : 'Cảnh báo'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="space-y-6">
          {/* Performance Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {performanceData.map((data, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">{data.metric}</h3>
                  {getStatusIcon(data.status)}
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Hiện tại</span>
                    <span className="font-medium">{data.current}{data.unit}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tối ưu</span>
                    <span className="text-gray-500">{data.optimal}{data.unit}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        data.status === 'good' ? 'bg-green-500' : 
                        data.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ 
                        width: data.metric.includes('Usage') 
                          ? `${(data.current / data.optimal) * 100}%`
                          : `${Math.min((data.optimal / data.current) * 100, 100)}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* System Resources */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Tài nguyên hệ thống</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Cpu, label: 'CPU', value: '34%', status: 'good' },
                { icon: HardDrive, label: 'Disk', value: '67%', status: 'warning' },
                { icon: Database, label: 'Memory', value: '26%', status: 'good' },
                { icon: Network, label: 'Network', value: '12%', status: 'good' }
              ].map((resource, index) => (
                <div key={index} className="text-center p-4 border rounded-lg">
                  <resource.icon className={`w-8 h-8 mx-auto mb-2 ${
                    resource.status === 'good' ? 'text-green-500' : 'text-yellow-500'
                  }`} />
                  <div className="font-medium">{resource.label}</div>
                  <div className="text-2xl font-bold text-gray-900">{resource.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'testing' && (
        <div className="space-y-6">
          {/* Test Results Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tests Passed</p>
                  <p className="text-3xl font-bold text-green-600">
                    {testResults.filter(t => t.status === 'passed').length}
                  </p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Warnings</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {testResults.filter(t => t.status === 'warning').length}
                  </p>
                </div>
                <AlertTriangle className="w-12 h-12 text-yellow-500" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Failed</p>
                  <p className="text-3xl font-bold text-red-600">
                    {testResults.filter(t => t.status === 'failed').length}
                  </p>
                </div>
                <XCircle className="w-12 h-12 text-red-500" />
              </div>
            </div>
          </div>

          {/* Detailed Test Results */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Kết quả kiểm thử chi tiết</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Module</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Test Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {testResults.map((test, index) => (
                    <tr key={index}>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{test.module}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-600">{test.testName}</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(test.status)}
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(test.status)}`}>
                            {test.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {test.duration}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {test.details || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Security Checks */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Kiểm tra bảo mật</h2>
            <div className="space-y-4">
              {securityChecks.map((check, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(check.status)}
                    <div>
                      <h3 className="font-medium text-gray-900">{check.check}</h3>
                      <p className="text-sm text-gray-600">{check.description}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(check.status)}`}>
                    {check.status === 'passed' ? 'Đã kiểm tra' : 'Cần cải thiện'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Security Recommendations */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Khuyến nghị bảo mật</h2>
            <div className="space-y-3">
              {[
                'Cập nhật thường xuyên các dependency',
                'Thực hiện backup dữ liệu định kỳ',
                'Giám sát logs truy cập bất thường',
                'Cải thiện validation đầu vào',
                'Thực hiện penetration testing',
                'Đào tạo nhân viên về bảo mật'
              ].map((recommendation, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertTriangle size={16} className="text-yellow-600" />
                  <span className="text-sm text-yellow-800">{recommendation}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemIntegration;
