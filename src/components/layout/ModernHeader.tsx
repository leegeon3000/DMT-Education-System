import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// @ts-ignore - Framer Motion types issue in Vite
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
  AcademicCapIcon,
  UserGroupIcon,
  CalendarIcon,
  MegaphoneIcon,
  InformationCircleIcon,
  ChartBarIcon,
  BookOpenIcon,
  Cog6ToothIcon,
  ClipboardDocumentListIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';
import useAuth from '../../hooks/useAuth';
import { useSelector } from 'react-redux';
import { selectUserRole } from '../../store/slices/userSlice';
import { Role } from '../../types';

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { name: 'Trang chủ', path: '/', icon: HomeIcon },
  { name: 'Khóa học', path: '/courses', icon: AcademicCapIcon },
  { name: 'Giảng viên', path: '/teachers', icon: UserGroupIcon },
  { name: 'Lịch học', path: '/schedule', icon: CalendarIcon },
  { name: 'Thông báo', path: '/announcements', icon: MegaphoneIcon },
  { name: 'Giới thiệu', path: '/about', icon: InformationCircleIcon },
];

const ModernHeader: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  let userRole = useSelector(selectUserRole);
  
  // Fallback: Get role from localStorage if Redux doesn't have it
  if (!userRole && isAuthenticated) {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        const roleId = user.role_id;
        // Map role_id to Role enum
        switch (roleId) {
          case 1:
            userRole = Role.ADMIN;
            break;
          case 2:
            userRole = Role.STAFF;
            break;
          case 3:
            userRole = Role.TEACHER;
            break;
          case 4:
            userRole = Role.STUDENT;
            break;
        }
      }
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
    }
  }
  
  // Debug: Log auth state
  console.log('ModernHeader - isAuthenticated:', isAuthenticated);
  console.log('ModernHeader - userRole:', userRole);
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  // Get menu items based on user role
  const getUserMenuItems = () => {
    if (!userRole) return [];

    switch (userRole) {
      case Role.ADMIN:
        return [
          { path: '/admin/dashboard', label: 'Dashboard', icon: ChartBarIcon },
          { path: '/admin/settings', label: 'Cài đặt', icon: Cog6ToothIcon },
        ];
      
      case Role.TEACHER:
        return [
          { path: '/teacher/dashboard', label: 'Dashboard', icon: ChartBarIcon },
          { path: '/teacher/classes', label: 'Lớp học', icon: AcademicCapIcon },
          { path: '/teacher/assignments', label: 'Bài tập', icon: ClipboardDocumentListIcon },
          { path: '/teacher/attendance', label: 'Điểm danh', icon: UserGroupIcon },
          { path: '/teacher/materials', label: 'Tài liệu', icon: BookOpenIcon },
        ];
      
      case Role.STUDENT:
        return [
          { path: '/students/dashboard', label: 'Dashboard', icon: ChartBarIcon },
          { path: '/students/schedule', label: 'Lịch học', icon: CalendarIcon },
          { path: '/students/materials', label: 'Tài liệu', icon: BookOpenIcon },
          { path: '/students/transcript', label: 'Bảng điểm', icon: ClipboardDocumentListIcon },
        ];
      
      case Role.STAFF:
        return [
          { path: '/staff/dashboard', label: 'Dashboard', icon: ChartBarIcon },
          { path: '/staff/students', label: 'Quản lý học sinh', icon: UserGroupIcon },
          { path: '/staff/enrollments', label: 'Ghi danh', icon: ClipboardDocumentListIcon },
          { path: '/staff/tickets', label: 'Hỗ trợ', icon: BriefcaseIcon },
        ];
      
      default:
        return [
          { path: '/profile', label: 'Trang cá nhân', icon: UserCircleIcon },
          { path: '/settings', label: 'Cài đặt', icon: Cog6ToothIcon },
        ];
    }
  };

  const menuItems = getUserMenuItems();
  
  // Debug: Log menu items
  console.log('ModernHeader - menuItems:', menuItems);

  const handleLogout = () => {
    // Clear auth data
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsUserMenuOpen(false);
    // Redirect to login
    navigate('/login');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-lg'
          : 'bg-white/60 backdrop-blur-md shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.img
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              src="/logo-dmt.png"
              alt="DMT Education"
              className="h-10 lg:h-12 w-auto rounded-lg shadow-md"
            />
            <div className="hidden sm:block">
              <div className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                DMT Education
              </div>
              <div className="text-xs text-gray-600 font-medium">
                Nâng tầm tri thức
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative px-4 py-2 rounded-lg transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 transition-colors ${
                      active ? 'text-red-600' : 'text-gray-600 group-hover:text-red-600'
                    }`} />
                    <span className={`text-sm font-semibold transition-colors ${
                      active ? 'text-red-600' : 'text-gray-700 group-hover:text-red-600'
                    }`}>
                      {item.name}
                    </span>
                  </div>
                  
                  {/* Active indicator */}
                  {active && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-red-50 rounded-lg -z-10"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  
                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gray-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity -z-20" />
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Search"
            >
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-700" />
            </motion.button>

            {/* Login / User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 text-white hover:shadow-lg transition-all"
                >
                  <UserCircleIcon className="w-5 h-5" />
                  <span className="hidden sm:block text-sm font-semibold">
                    Tài khoản
                  </span>
                </motion.button>

                {/* User Dropdown */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                    >
                      {menuItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Icon className="w-4 h-4" />
                            {item.label}
                          </Link>
                        );
                      })}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3 border-t border-gray-100"
                      >
                        <ArrowRightOnRectangleIcon className="w-4 h-4" />
                        Đăng xuất
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <UserCircleIcon className="w-5 h-5" />
                Đăng nhập
              </motion.button>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6 text-gray-700" />
              ) : (
                <Bars3Icon className="w-6 h-6 text-gray-700" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-100"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      active
                        ? 'bg-red-50 text-red-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-semibold">{item.name}</span>
                  </Link>
                );
              })}
              
              {!isAuthenticated && (
                <button
                  onClick={() => navigate('/login')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold shadow-lg"
                >
                  <UserCircleIcon className="w-5 h-5" />
                  Đăng nhập
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: -20 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Tìm kiếm</h3>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm khóa học, giảng viên..."
                  autoFocus
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Tìm
                </button>
              </form>
              
              <div className="mt-6">
                <p className="text-sm text-gray-500 mb-3">Tìm kiếm phổ biến:</p>
                <div className="flex flex-wrap gap-2">
                  {['Toán học', 'Vật lý', 'Hóa học', 'Tiếng Anh'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        setSearchQuery(tag);
                        handleSearch(new Event('submit') as any);
                      }}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default ModernHeader;
