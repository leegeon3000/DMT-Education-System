import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/userSlice';
import { RootState } from '../../store';
import { 
  Home, 
  BookOpen, 
  Calendar, 
  Video, 
  FileText, 
  Award, 
  CreditCard, 
  Bell, 
  MessageSquare,
  LogOut,
  User,
  Menu,
  X,
  ChevronDown,
  Search,
  Settings
} from 'lucide-react';
import { NotificationBell } from '../notifications';
import '../../styles/admin-animations.css';

const StudentLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth/login');
  };

  const navigation = [
    { 
      name: 'Tổng quan', 
      href: '/students/dashboard', 
      icon: Home,
      current: location.pathname === '/students/dashboard'
    },
    { 
      name: 'Lịch học', 
      href: '/students/schedule', 
      icon: Calendar,
      current: location.pathname === '/students/schedule'
    },
    { 
      name: 'Video bài giảng', 
      href: '/students/videos', 
      icon: Video,
      current: location.pathname === '/students/videos'
    },
    { 
      name: 'Tài liệu', 
      href: '/students/materials', 
      icon: FileText,
      current: location.pathname === '/students/materials'
    },
    { 
      name: 'Bảng điểm', 
      href: '/students/transcript', 
      icon: Award,
      current: location.pathname === '/students/transcript'
    },
    { 
      name: 'Học phí', 
      href: '/students/payments', 
      icon: CreditCard,
      current: location.pathname === '/students/payments'
    },
    { 
      name: 'Khảo sát', 
      href: '/students/surveys', 
      icon: MessageSquare,
      current: location.pathname === '/students/surveys'
    },
    { 
      name: 'Thông báo', 
      href: '/students/notifications', 
      icon: Bell,
      current: location.pathname === '/students/notifications'
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
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
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-20 px-6 border-b border-slate-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <div>
              <span className="text-xl font-bold text-white">DMT Student</span>
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
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="ml-3 text-left">
                  <p className="text-sm font-semibold text-white">{user?.name || 'Học viên'}</p>
                  <p className="text-xs text-slate-400">{user?.student_code || 'HS-000'}</p>
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
                  <Home className="w-4 h-4 mr-3 text-red-400" />
                  <span>Trở lại trang chủ</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/students/settings');
                    setUserMenuOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors border-b border-slate-700"
                >
                  <Settings className="w-4 h-4 mr-3 text-red-400" />
                  <span>Cài đặt</span>
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
                  placeholder="Tìm kiếm khóa học, tài liệu..."
                  className="w-80 pl-10 pr-4 py-2.5 bg-gray-100/80 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>

              {/* Notification Bell */}
              <NotificationBell />

              {/* User avatar - minimal on top bar since full info is in sidebar */}
              <div className="hidden lg:flex items-center space-x-3 pl-4 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{user?.name || 'Học viên'}</p>
                  <p className="text-xs text-gray-500">{user?.student_code || 'HS-000'}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center ring-2 ring-red-300">
                  <User className="w-5 h-5 text-red-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <main className="p-6">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
