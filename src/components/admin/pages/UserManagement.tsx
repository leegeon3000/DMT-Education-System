import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Shield, 
  Lock, 
  Unlock,
  UserCheck,
  UserX,
  Settings,
  Key,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Crown,
  User,
  GraduationCap,
  UserCog
} from 'lucide-react';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

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
  sessionTimeout: number; // minutes
  passwordExpiry?: string;
}

const UserManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'permissions'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // Mock permissions data
  const [permissions] = useState<Permission[]>([
    { id: 'user_read', name: 'Xem người dùng', description: 'Xem danh sách và thông tin người dùng', category: 'Người dùng' },
    { id: 'user_write', name: 'Quản lý người dùng', description: 'Tạo, sửa, xóa người dùng', category: 'Người dùng' },
    { id: 'student_read', name: 'Xem học viên', description: 'Xem thông tin học viên', category: 'Học viên' },
    { id: 'student_write', name: 'Quản lý học viên', description: 'Quản lý thông tin học viên', category: 'Học viên' },
    { id: 'teacher_read', name: 'Xem giáo viên', description: 'Xem thông tin giáo viên', category: 'Giáo viên' },
    { id: 'teacher_write', name: 'Quản lý giáo viên', description: 'Quản lý thông tin giáo viên', category: 'Giáo viên' },
    { id: 'course_read', name: 'Xem khóa học', description: 'Xem thông tin khóa học', category: 'Khóa học' },
    { id: 'course_write', name: 'Quản lý khóa học', description: 'Quản lý khóa học', category: 'Khóa học' },
    { id: 'finance_read', name: 'Xem tài chính', description: 'Xem báo cáo tài chính', category: 'Tài chính' },
    { id: 'finance_write', name: 'Quản lý tài chính', description: 'Quản lý thu chi, hóa đơn', category: 'Tài chính' },
    { id: 'system_settings', name: 'Cài đặt hệ thống', description: 'Cấu hình hệ thống', category: 'Hệ thống' },
    { id: 'backup_restore', name: 'Sao lưu & khôi phục', description: 'Sao lưu và khôi phục dữ liệu', category: 'Hệ thống' }
  ]);

  // Mock roles data
  const [roles, setRoles] = useState<Role[]>([
    {
      id: 'admin',
      name: 'Quản trị viên',
      description: 'Quyền truy cập đầy đủ hệ thống',
      color: 'red',
      permissions: permissions.map(p => p.id),
      isSystem: true
    },
    {
      id: 'manager',
      name: 'Quản lý',
      description: 'Quản lý trung tâm, không bao gồm cài đặt hệ thống',
      color: 'blue',
      permissions: ['user_read', 'student_read', 'student_write', 'teacher_read', 'teacher_write', 'course_read', 'course_write', 'finance_read', 'finance_write'],
      isSystem: false
    },
    {
      id: 'teacher',
      name: 'Giáo viên',
      description: 'Quyền dành cho giáo viên',
      color: 'green',
      permissions: ['student_read', 'course_read'],
      isSystem: false
    },
    {
      id: 'staff',
      name: 'Nhân viên',
      description: 'Quyền dành cho nhân viên hỗ trợ',
      color: 'yellow',
      permissions: ['student_read', 'student_write', 'course_read'],
      isSystem: false
    }
  ]);

  // Mock users data
  const [users, setUsers] = useState<UserAccount[]>([
    {
      id: 'user-1',
      username: 'admin',
      email: 'admin@dmt.edu.vn',
      fullName: 'Quản trị viên hệ thống',
      phone: '0123456789',
      role: roles[0],
      status: 'active',
      lastLogin: '2024-01-15T14:30:00',
      createdAt: '2023-01-01',
      updatedAt: '2024-01-15',
      loginAttempts: 0,
      isEmailVerified: true,
      isPhoneVerified: true,
      twoFactorEnabled: true,
      sessionTimeout: 480
    },
    {
      id: 'user-2',
      username: 'manager1',
      email: 'manager@dmt.edu.vn',
      fullName: 'Nguyễn Văn Quản lý',
      phone: '0987654321',
      role: roles[1],
      status: 'active',
      lastLogin: '2024-01-14T16:45:00',
      createdAt: '2023-06-15',
      updatedAt: '2024-01-10',
      loginAttempts: 0,
      isEmailVerified: true,
      isPhoneVerified: false,
      twoFactorEnabled: false,
      sessionTimeout: 240
    },
    {
      id: 'user-3',
      username: 'teacher1',
      email: 'teacher1@dmt.edu.vn',
      fullName: 'Trần Thị Giáo viên',
      role: roles[2],
      status: 'inactive',
      createdAt: '2023-09-01',
      updatedAt: '2024-01-05',
      loginAttempts: 2,
      isEmailVerified: true,
      isPhoneVerified: false,
      twoFactorEnabled: false,
      sessionTimeout: 120
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'inactive': return <XCircle className="w-4 h-4 text-gray-500" />;
      case 'suspended': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'pending': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default: return <XCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleIcon = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case 'quản trị viên': return <Crown className="w-4 h-4" />;
      case 'quản lý': return <UserCog className="w-4 h-4" />;
      case 'giáo viên': return <GraduationCap className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getRoleColor = (color: string) => {
    const colors = {
      red: 'bg-red-100 text-red-800',
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      purple: 'bg-purple-100 text-purple-800',
      gray: 'bg-gray-100 text-gray-800'
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    const matchesRole = filterRole === 'all' || user.role.id === filterRole;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Quản lý người dùng & phân quyền
        </h1>
        <p className="text-gray-600">
          Quản lý tài khoản người dùng, vai trò và phân quyền hệ thống
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Tài khoản người dùng
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'roles'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Shield className="w-4 h-4 inline mr-2" />
            Vai trò
          </button>
          <button
            onClick={() => setActiveTab('permissions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'permissions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Key className="w-4 h-4 inline mr-2" />
            Quyền hạn
          </button>
        </nav>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <>
          {/* Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex flex-1 items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm người dùng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
                <option value="suspended">Bị khóa</option>
                <option value="pending">Chờ xác nhận</option>
              </select>

              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả vai trò</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm người dùng
            </button>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Người dùng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vai trò
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bảo mật
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Đăng nhập cuối
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                            {user.fullName.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.fullName}
                            </div>
                            <div className="text-sm text-gray-500">
                              <Mail className="w-3 h-3 inline mr-1" />
                              {user.email}
                            </div>
                            {user.phone && (
                              <div className="text-xs text-gray-400">
                                <Phone className="w-3 h-3 inline mr-1" />
                                {user.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role.color)}`}>
                          {getRoleIcon(user.role.name)}
                          <span className="ml-1">{user.role.name}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(user.status)}
                          <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                            {user.status === 'active' ? 'Hoạt động' :
                             user.status === 'inactive' ? 'Không hoạt động' :
                             user.status === 'suspended' ? 'Bị khóa' : 'Chờ xác nhận'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${user.isEmailVerified ? 'bg-green-400' : 'bg-red-400'}`} 
                               title={user.isEmailVerified ? 'Email đã xác thực' : 'Email chưa xác thực'} />
                          <div className={`w-2 h-2 rounded-full ${user.twoFactorEnabled ? 'bg-green-400' : 'bg-gray-300'}`}
                               title={user.twoFactorEnabled ? '2FA đã bật' : '2FA chưa bật'} />
                          {user.loginAttempts > 0 && (
                            <span className="text-red-600 flex items-center" title={`${user.loginAttempts} lần đăng nhập thất bại`}>
                              <AlertTriangle size={14} />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.lastLogin ? (
                          <div>
                            <div>{new Date(user.lastLogin).toLocaleDateString('vi-VN')}</div>
                            <div className="text-xs text-gray-400">
                              {new Date(user.lastLogin).toLocaleTimeString('vi-VN')}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">Chưa đăng nhập</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowEditModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900"
                          title="Cài đặt bảo mật"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                        {user.status === 'active' ? (
                          <button
                            className="text-red-600 hover:text-red-900"
                            title="Khóa tài khoản"
                          >
                            <Lock className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            className="text-green-600 hover:text-green-900"
                            title="Mở khóa tài khoản"
                          >
                            <Unlock className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          className="text-red-600 hover:text-red-900"
                          title="Xóa tài khoản"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Roles Tab */}
      {activeTab === 'roles' && (
        <>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Vai trò hệ thống</h2>
              <p className="text-sm text-gray-600">Quản lý các vai trò và quyền hạn</p>
            </div>
            <button
              onClick={() => setShowRoleModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm vai trò
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role) => (
              <div key={role.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getRoleColor(role.color)}`}>
                      {getRoleIcon(role.name)}
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">{role.name}</h3>
                      {role.isSystem && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          Hệ thống
                        </span>
                      )}
                    </div>
                  </div>
                  {!role.isSystem && (
                    <div className="flex space-x-1">
                      <button
                        onClick={() => {
                          setSelectedRole(role);
                          setShowRoleModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-4">{role.description}</p>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Quyền hạn ({role.permissions.length})
                  </h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {role.permissions.slice(0, 5).map((permissionId) => {
                      const permission = permissions.find(p => p.id === permissionId);
                      return permission ? (
                        <div key={permission.id} className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                          {permission.name}
                        </div>
                      ) : null;
                    })}
                    {role.permissions.length > 5 && (
                      <div className="text-xs text-gray-500 text-center py-1">
                        +{role.permissions.length - 5} quyền khác
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    Số người dùng: {users.filter(u => u.role.id === role.id).length}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Permissions Tab */}
      {activeTab === 'permissions' && (
        <div>
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900">Danh sách quyền hạn</h2>
            <p className="text-sm text-gray-600">Tất cả quyền hạn có sẵn trong hệ thống</p>
          </div>

          <div className="space-y-6">
            {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
              <div key={category} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">{category}</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryPermissions.map((permission) => (
                      <div key={permission.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{permission.name}</h4>
                          <Key className="w-4 h-4 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{permission.description}</p>
                        <div className="text-xs text-gray-500">
                          ID: <code className="bg-gray-100 px-1 rounded">{permission.id}</code>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng người dùng</p>
              <p className="text-2xl font-semibold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
              <p className="text-2xl font-semibold text-gray-900">
                {users.filter(u => u.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Vai trò</p>
              <p className="text-2xl font-semibold text-gray-900">{roles.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Key className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Quyền hạn</p>
              <p className="text-2xl font-semibold text-gray-900">{permissions.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
