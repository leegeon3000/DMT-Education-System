import React, { useEffect, useState } from 'react';
import { apiClient } from '../../../services/auth';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Spinner from '../../../components/common/Spinner';

interface SystemSettings {
  general: {
    siteName: string;
    siteDescription: string;
    adminEmail: string;
    timezone: string;
    language: string;
    maintenanceMode: boolean;
    registrationEnabled: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
    passwordPolicy: {
      minLength: number;
      requiresSpecialChar: boolean;
      requiresNumber: boolean;
      requiresUppercase: boolean;
      requiresLowercase: boolean;
    };
    ipWhitelist: string[];
    rateLimiting: {
      enabled: boolean;
      maxRequests: number;
      timeWindow: number;
    };
  };
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
    encryption: 'none' | 'tls' | 'ssl';
  };
  payment: {
    currency: string;
    taxRate: number;
    paymentMethods: {
      vnpay: boolean;
      momo: boolean;
      banking: boolean;
      cash: boolean;
    };
    autoReminder: boolean;
    reminderDays: number;
  };
  notification: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    defaultLanguage: string;
    batchSize: number;
    retryAttempts: number;
  };
  storage: {
    maxFileSize: number;
    allowedFileTypes: string[];
    storageQuota: number;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
    backupRetention: number;
  };
}

const SettingsSection: React.FC<{
  title: string;
  description: string;
  children: React.ReactNode;
}> = ({ title, description, children }) => {
  return (
    <Card>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      {children}
    </Card>
  );
};

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'email' | 'payment' | 'notification' | 'storage'>('general');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      
      // Fetch settings from API
      const response = await apiClient.get('/settings');
      setSettings(response.data);
    } catch (err: any) {
      setError(err.message || 'Không thể tải cài đặt hệ thống');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!settings) return;
    
    try {
      setSaving(true);
      
      // Convert settings object to flat array for API
      const settingsArray: Array<{category: string; key: string; value: any}> = [];
      Object.entries(settings).forEach(([category, categorySettings]) => {
        Object.entries(categorySettings).forEach(([key, value]) => {
          settingsArray.push({ category: category.toUpperCase(), key, value });
        });
      });
      
      await apiClient.put('/settings', { settings: settingsArray });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const updateSettings = (section: keyof SystemSettings, updates: any) => {
    if (!settings) return;
    setSettings(prev => ({
      ...prev!,
      [section]: { ...prev![section], ...updates }
    }));
  };

  const updateNestedSettings = (section: keyof SystemSettings, subsection: string, updates: any) => {
    if (!settings) return;
    setSettings(prev => ({
      ...prev!,
      [section]: {
        ...prev![section],
        [subsection]: { ...(prev![section] as any)[subsection], ...updates }
      }
    }));
  };

  if (loading) return (
    <div className="flex items-center gap-2 text-gray-600">
      <Spinner /> Đang tải cài đặt hệ thống...
    </div>
  );

  if (error) return (
    <div className="text-red-600 bg-red-50 p-4 rounded-md">
      Lỗi: {error}
    </div>
  );

  if (!settings) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Cài đặt hệ thống</h1>
          <p className="text-sm text-gray-600">Quản lý cấu hình và thiết lập hệ thống</p>
        </div>
        <Button 
          onClick={handleSaveSettings} 
          disabled={saving}
          variant="primary"
        >
          {saving ? <Spinner /> : null}
          {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 border-b border-gray-200 overflow-x-auto">
        {[
          { key: 'general', label: 'Tổng quan' },
          { key: 'security', label: 'Bảo mật' },
          { key: 'email', label: 'Email' },
          { key: 'payment', label: 'Thanh toán' },
          { key: 'storage', label: 'Lưu trữ' }
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition ${
              activeTab === key
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <SettingsSection
            title="Thông tin chung"
            description="Cấu hình thông tin cơ bản của hệ thống"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên hệ thống
                </label>
                <input
                  type="text"
                  value={settings.general.siteName}
                  onChange={(e) => updateSettings('general', { siteName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email quản trị
                </label>
                <input
                  type="email"
                  value={settings.general.adminEmail}
                  onChange={(e) => updateSettings('general', { adminEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Múi giờ
                </label>
                <select
                  value={settings.general.timezone}
                  onChange={(e) => updateSettings('general', { timezone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="Asia/Ho_Chi_Minh">Việt Nam (GMT+7)</option>
                  <option value="Asia/Bangkok">Bangkok (GMT+7)</option>
                  <option value="Asia/Singapore">Singapore (GMT+8)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngôn ngữ mặc định
                </label>
                <select
                  value={settings.general.language}
                  onChange={(e) => updateSettings('general', { language: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="vi">Tiếng Việt</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả hệ thống
              </label>
              <textarea
                value={settings.general.siteDescription}
                onChange={(e) => updateSettings('general', { siteDescription: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div className="flex gap-4 mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.general.maintenanceMode}
                  onChange={(e) => updateSettings('general', { maintenanceMode: e.target.checked })}
                  className="mr-2"
                />
                Chế độ bảo trì
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.general.registrationEnabled}
                  onChange={(e) => updateSettings('general', { registrationEnabled: e.target.checked })}
                  className="mr-2"
                />
                Cho phép đăng ký mới
              </label>
            </div>
          </SettingsSection>
        </div>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <SettingsSection
            title="Xác thực và phiên đăng nhập"
            description="Cấu hình bảo mật cho việc đăng nhập"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thời gian phiên (phút)
                </label>
                <input
                  type="number"
                  value={settings.security.sessionTimeout}
                  onChange={(e) => updateSettings('security', { sessionTimeout: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số lần đăng nhập tối đa
                </label>
                <input
                  type="number"
                  value={settings.security.maxLoginAttempts}
                  onChange={(e) => updateSettings('security', { maxLoginAttempts: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.security.twoFactorAuth}
                  onChange={(e) => updateSettings('security', { twoFactorAuth: e.target.checked })}
                  className="mr-2"
                />
                Bắt buộc xác thực 2 yếu tố (2FA)
              </label>
            </div>
          </SettingsSection>

          <SettingsSection
            title="Chính sách mật khẩu"
            description="Thiết lập yêu cầu cho mật khẩu người dùng"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Độ dài tối thiểu
                </label>
                <input
                  type="number"
                  value={settings.security.passwordPolicy.minLength}
                  onChange={(e) => updateNestedSettings('security', 'passwordPolicy', { minLength: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.security.passwordPolicy.requiresSpecialChar}
                  onChange={(e) => updateNestedSettings('security', 'passwordPolicy', { requiresSpecialChar: e.target.checked })}
                  className="mr-2"
                />
                Yêu cầu ký tự đặc biệt
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.security.passwordPolicy.requiresNumber}
                  onChange={(e) => updateNestedSettings('security', 'passwordPolicy', { requiresNumber: e.target.checked })}
                  className="mr-2"
                />
                Yêu cầu số
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.security.passwordPolicy.requiresUppercase}
                  onChange={(e) => updateNestedSettings('security', 'passwordPolicy', { requiresUppercase: e.target.checked })}
                  className="mr-2"
                />
                Yêu cầu chữ hoa
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.security.passwordPolicy.requiresLowercase}
                  onChange={(e) => updateNestedSettings('security', 'passwordPolicy', { requiresLowercase: e.target.checked })}
                  className="mr-2"
                />
                Yêu cầu chữ thường
              </label>
            </div>
          </SettingsSection>
        </div>
      )}

      {/* Email Settings */}
      {activeTab === 'email' && (
        <div className="space-y-6">
          <SettingsSection
            title="Cấu hình SMTP"
            description="Thiết lập máy chủ email để gửi thông báo"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SMTP Host
                </label>
                <input
                  type="text"
                  value={settings.email.smtpHost}
                  onChange={(e) => updateSettings('email', { smtpHost: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SMTP Port
                </label>
                <input
                  type="number"
                  value={settings.email.smtpPort}
                  onChange={(e) => updateSettings('email', { smtpPort: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email người gửi
                </label>
                <input
                  type="email"
                  value={settings.email.fromEmail}
                  onChange={(e) => updateSettings('email', { fromEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên người gửi
                </label>
                <input
                  type="text"
                  value={settings.email.fromName}
                  onChange={(e) => updateSettings('email', { fromName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </SettingsSection>
        </div>
      )}

      {/* Payment Settings */}
      {activeTab === 'payment' && (
        <div className="space-y-6">
          <SettingsSection
            title="Cấu hình thanh toán"
            description="Thiết lập phương thức thanh toán và chính sách"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đơn vị tiền tệ
                </label>
                <select
                  value={settings.payment.currency}
                  onChange={(e) => updateSettings('payment', { currency: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="VND">Việt Nam Đồng (VND)</option>
                  <option value="USD">US Dollar (USD)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thuế VAT (%)
                </label>
                <input
                  type="number"
                  value={settings.payment.taxRate}
                  onChange={(e) => updateSettings('payment', { taxRate: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="font-medium text-gray-900 mb-3">Phương thức thanh toán</h4>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.payment.paymentMethods.vnpay}
                    onChange={(e) => updateNestedSettings('payment', 'paymentMethods', { vnpay: e.target.checked })}
                    className="mr-2"
                  />
                  VNPay
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.payment.paymentMethods.momo}
                    onChange={(e) => updateNestedSettings('payment', 'paymentMethods', { momo: e.target.checked })}
                    className="mr-2"
                  />
                  MoMo
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.payment.paymentMethods.banking}
                    onChange={(e) => updateNestedSettings('payment', 'paymentMethods', { banking: e.target.checked })}
                    className="mr-2"
                  />
                  Chuyển khoản ngân hàng
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.payment.paymentMethods.cash}
                    onChange={(e) => updateNestedSettings('payment', 'paymentMethods', { cash: e.target.checked })}
                    className="mr-2"
                  />
                  Tiền mặt
                </label>
              </div>
            </div>
          </SettingsSection>
        </div>
      )}

      {/* Storage Settings */}
      {activeTab === 'storage' && (
        <div className="space-y-6">
          <SettingsSection
            title="Quản lý tệp tin"
            description="Cấu hình giới hạn và loại tệp tin được phép"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kích thước tệp tối đa (MB)
                </label>
                <input
                  type="number"
                  value={settings.storage.maxFileSize}
                  onChange={(e) => updateSettings('storage', { maxFileSize: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hạn ngạch lưu trữ (GB)
                </label>
                <input
                  type="number"
                  value={settings.storage.storageQuota}
                  onChange={(e) => updateSettings('storage', { storageQuota: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại tệp được phép
              </label>
              <input
                type="text"
                value={settings.storage.allowedFileTypes.join(', ')}
                onChange={(e) => updateSettings('storage', { allowedFileTypes: e.target.value.split(',').map(type => type.trim()) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="pdf, doc, jpg, png (cách nhau bởi dấu phẩy)"
              />
            </div>
          </SettingsSection>

          <SettingsSection
            title="Sao lưu dữ liệu"
            description="Cấu hình tần suất và thời gian lưu trữ bản sao lưu"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tần suất sao lưu
                </label>
                <select
                  value={settings.storage.backupFrequency}
                  onChange={(e) => updateSettings('storage', { backupFrequency: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="daily">Hàng ngày</option>
                  <option value="weekly">Hàng tuần</option>
                  <option value="monthly">Hàng tháng</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thời gian lưu trữ (ngày)
                </label>
                <input
                  type="number"
                  value={settings.storage.backupRetention}
                  onChange={(e) => updateSettings('storage', { backupRetention: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </SettingsSection>
        </div>
      )}
    </div>
  );
};

export default Settings;
