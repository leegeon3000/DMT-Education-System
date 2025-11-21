import React, { useState, useEffect } from 'react';
import { X, Save, User, Mail, Phone, Lock, Shield, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface Role {
  id: string;
  name: string;
  description: string;
  color: string;
  permissions: string[];
  isSystem: boolean;
}

interface UserAccount {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phone?: string;
  avatar?: string;
  role: Role;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  loginAttempts: number;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  passwordExpiry?: string;
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Partial<UserAccount>, password?: string) => void;
  user?: UserAccount;
  isEditing?: boolean;
  roles: Role[];
}

const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSave,
  user,
  isEditing = false,
  roles
}) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    phone: '',
    roleId: '',
    status: 'active' as 'active' | 'inactive' | 'suspended' | 'pending',
    sessionTimeout: 240,
    twoFactorEnabled: false,
    sendWelcomeEmail: true
  });

  const [passwordData, setPasswordData] = useState({
    password: '',
    confirmPassword: '',
    mustChangePassword: true
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user && isEditing) {
      setFormData({
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone || '',
        roleId: user.role.id,
        status: user.status,
        sessionTimeout: user.sessionTimeout,
        twoFactorEnabled: user.twoFactorEnabled,
        sendWelcomeEmail: false
      });
    } else {
      setFormData({
        username: '',
        email: '',
        fullName: '',
        phone: '',
        roleId: '',
        status: 'active',
        sessionTimeout: 240,
        twoFactorEnabled: false,
        sendWelcomeEmail: true
      });
    }
    
    setPasswordData({
      password: '',
      confirmPassword: '',
      mustChangePassword: true
    });
    
    setErrors({});
  }, [user, isEditing, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Tên đăng nhập là bắt buộc';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ tên là bắt buộc';
    }

    // Phone validation
    if (formData.phone && !/^[0-9+\-\s()]+$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    // Role validation
    if (!formData.roleId) {
      newErrors.roleId = 'Vai trò là bắt buộc';
    }

    // Password validation for new users
    if (!isEditing) {
      if (!passwordData.password) {
        newErrors.password = 'Mật khẩu là bắt buộc';
      } else if (passwordData.password.length < 8) {
        newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordData.password)) {
        newErrors.password = 'Mật khẩu phải chứa ít nhất 1 chữ thường, 1 chữ hoa và 1 số';
      }

      if (passwordData.password !== passwordData.confirmPassword) {
        newErrors.confirmPassword = 'Xác nhận mật khẩu không khớp';
      }
    }

    // Password validation for editing (if password is provided)
    if (isEditing && passwordData.password) {
      if (passwordData.password.length < 8) {
        newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordData.password)) {
        newErrors.password = 'Mật khẩu phải chứa ít nhất 1 chữ thường, 1 chữ hoa và 1 số';
      }

      if (passwordData.password !== passwordData.confirmPassword) {
        newErrors.confirmPassword = 'Xác nhận mật khẩu không khớp';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const selectedRole = roles.find(r => r.id === formData.roleId);
    if (!selectedRole) return;

    const userData: Partial<UserAccount> = {
      username: formData.username,
      email: formData.email,
      fullName: formData.fullName,
      phone: formData.phone || undefined,
      role: selectedRole,
      status: formData.status,
      sessionTimeout: formData.sessionTimeout,
      twoFactorEnabled: formData.twoFactorEnabled,
      ...(isEditing ? {} : {
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        loginAttempts: 0,
        isEmailVerified: false,
        isPhoneVerified: false
      })
    };

    const password = passwordData.password || undefined;
    onSave(userData, password);
    onClose();
  };

  const generateRandomPassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    
    // Ensure at least one of each required character type
    password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)]; // lowercase
    password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)]; // uppercase
    password += "0123456789"[Math.floor(Math.random() * 10)]; // number
    password += "!@#$%^&*"[Math.floor(Math.random() * 8)]; // special char
    
    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
    
    // Shuffle the password
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    
    setPasswordData({
      ...passwordData,
      password,
      confirmPassword: password
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin cơ bản</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Tên đăng nhập *
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.username ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="username"
                  disabled={isEditing} // Username cannot be changed
                />
                {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="user@dmt.edu.vn"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ tên *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.fullName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nguyễn Văn A"
                />
                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0123456789"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Role and Permissions */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Vai trò & quyền hạn</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Shield className="w-4 h-4 inline mr-1" />
                  Vai trò *
                </label>
                <select
                  value={formData.roleId}
                  onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.roleId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Chọn vai trò</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name} - {role.description}
                    </option>
                  ))}
                </select>
                {errors.roleId && <p className="text-red-500 text-sm mt-1">{errors.roleId}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                  <option value="pending">Chờ xác nhận</option>
                  <option value="suspended">Bị khóa</option>
                </select>
              </div>
            </div>
          </div>

          {/* Password Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {isEditing ? 'Đổi mật khẩu (tùy chọn)' : 'Mật khẩu'}
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <Lock className="w-4 h-4 inline mr-1" />
                    Mật khẩu {!isEditing && '*'}
                  </label>
                  {!isEditing && (
                    <button
                      type="button"
                      onClick={generateRandomPassword}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Tạo mật khẩu tự động
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordData.password}
                    onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={isEditing ? 'Để trống nếu không muốn đổi mật khẩu' : 'Nhập mật khẩu'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              {(passwordData.password || !isEditing) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Xác nhận mật khẩu {!isEditing && '*'}
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Nhập lại mật khẩu"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>
              )}

              {passwordData.password && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="mustChangePassword"
                    checked={passwordData.mustChangePassword}
                    onChange={(e) => setPasswordData({ ...passwordData, mustChangePassword: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="mustChangePassword" className="ml-2 block text-sm text-gray-700">
                    Yêu cầu đổi mật khẩu khi đăng nhập lần đầu
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Security Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Cài đặt bảo mật</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thời gian hết hạn phiên (phút)
                </label>
                <select
                  value={formData.sessionTimeout}
                  onChange={(e) => setFormData({ ...formData, sessionTimeout: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={30}>30 phút</option>
                  <option value={60}>1 giờ</option>
                  <option value={120}>2 giờ</option>
                  <option value={240}>4 giờ</option>
                  <option value={480}>8 giờ</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="twoFactorEnabled"
                  checked={formData.twoFactorEnabled}
                  onChange={(e) => setFormData({ ...formData, twoFactorEnabled: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="twoFactorEnabled" className="ml-2 block text-sm text-gray-700">
                  Kích hoạt xác thực 2 yếu tố (2FA)
                </label>
              </div>

              {!isEditing && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="sendWelcomeEmail"
                    checked={formData.sendWelcomeEmail}
                    onChange={(e) => setFormData({ ...formData, sendWelcomeEmail: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="sendWelcomeEmail" className="ml-2 block text-sm text-gray-700">
                    Gửi email chào mừng với thông tin đăng nhập
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Password Security Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
              <div className="ml-3">
                <h4 className="text-sm font-medium text-blue-800">
                  Yêu cầu bảo mật mật khẩu
                </h4>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Ít nhất 8 ký tự</li>
                    <li>Chứa ít nhất 1 chữ thường, 1 chữ hoa và 1 số</li>
                    <li>Khuyến khích sử dụng ký tự đặc biệt</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {isEditing ? 'Cập nhật' : 'Tạo tài khoản'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
