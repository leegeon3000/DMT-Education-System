import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Calendar,
  DollarSign, 
  Bell, 
  FileText, 
  Settings, 
  LogOut,
  Menu,
  X,
  User,
  ChevronDown,
  Home
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { NotificationBell } from '../notifications';
import '../../styles/admin-animations.css';

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();
  
  // Mock user data for now
  const user = {
    name: 'Admin DMT',
    email: 'admin@dmt.edu.vn'
  };

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
      current: location.pathname === '/admin/dashboard'
    },
    {
      name: 'Quản lý học viên',
      href: '/admin/users/students',
      icon: Users,
      current: location.pathname.includes('/admin/users/students')
    },
    {
      name: 'Quản lý lớp học',
      href: '/admin/classes',
      icon: Calendar,
      current: location.pathname.includes('/admin/classes')
    },
    {
      name: 'Quản lý khóa học',
      href: '/admin/courses',
      icon: BookOpen,
      current: location.pathname.includes('/admin/courses')
    },
    {
      name: 'Quản lý giáo viên',
      href: '/admin/users/teachers',
      icon: GraduationCap,
      current: location.pathname.includes('/admin/users/teachers')
    },
    {
      name: 'Quản lý tài chính',
      href: '/admin/payments',
      icon: DollarSign,
      current: location.pathname.includes('/admin/payments')
    },
    {
      name: 'Thông báo & Tài liệu',
      href: '/admin/notifications',
      icon: Bell,
      current: location.pathname.includes('/admin/notifications')
    },
    {
      name: 'Quản lý nhân viên',
      href: '/admin/users/staff',
      icon: User,
      current: location.pathname.includes('/admin/users/staff')
    },
    {
      name: 'Báo cáo',
      href: '/admin/reports/attendance',
      icon: FileText,
      current: location.pathname.includes('/admin/reports')
    },
    {
      name: 'Cài đặt',
      href: '/admin/settings',
      icon: Settings,
      current: location.pathname.includes('/admin/settings')
    }
  ];

  const handleLogout = async () => {
    await auth.handleLogout();
    // Redirect to login
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm"></div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-slate-900 to-slate-800 shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-20 px-6 border-b border-slate-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <div>
              <span className="text-xl font-bold text-white">DMT Admin</span>
              <p className="text-xs text-slate-400">Education System</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
          >
            <X className="h-6 w-6 text-slate-300" />
          </button>
        </div>

        <nav className="mt-6 px-4 space-y-2 overflow-y-auto h-[calc(100vh-200px)] pb-4">
          {navigation.map((item) => {
            const IconComponent = item.icon;
            return (
              <a
                key={item.name}
                href={item.href}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  item.current
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/50'
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                }`}
              >
                <IconComponent
                  className={`mr-3 h-5 w-5 ${
                    item.current ? 'text-white' : 'text-slate-400 group-hover:text-white'
                  }`}
                />
                <span className="flex-1">{item.name}</span>
                {item.current && (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </a>
            );
          })}
        </nav>

        {/* User info at bottom */}
        <div className="absolute bottom-0 w-full p-4 border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center w-full px-4 py-3 text-sm rounded-xl hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-center flex-1">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-slate-700">
                  <span className="text-white text-sm font-bold">
                    {user?.name?.charAt(0) || 'A'}
                  </span>
                </div>
                <div className="ml-3 text-left">
                  <p className="text-sm font-semibold text-white">{user?.name || 'Admin'}</p>
                  <p className="text-xs text-slate-400">{user?.email || 'admin@dmt.edu'}</p>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {userMenuOpen && (
              <div className="absolute bottom-full left-4 right-4 mb-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
                <button
                  onClick={() => {
                    navigate('/');
                    setUserMenuOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors border-b border-slate-700"
                >
                  <Home className="w-4 h-4 mr-3 text-blue-400" />
                  <span>Trở lại trang chủ</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-3 text-red-400" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-20 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Menu className="h-6 w-6 text-gray-700" />
            </button>
            
            <div className="flex-1 flex items-center justify-end space-x-4">
              {/* Search bar */}
              <div className="hidden md:block relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm học viên, khóa học..."
                  className="w-80 pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              {/* Notifications Bell */}
              <NotificationBell />
              
              {/* User Avatar */}
              <div className="hidden md:flex items-center space-x-3 pl-4 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{user?.name || 'Admin'}</p>
                  <p className="text-xs text-gray-500">Quản trị viên</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm font-bold">
                    {user?.name?.charAt(0) || 'A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
