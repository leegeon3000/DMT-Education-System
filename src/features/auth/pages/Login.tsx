import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  BORDERS,
  SHADOWS,
  EFFECTS,
} from '../../../constants';
import authService from '../../../services/auth';
import { login as loginAction } from '../../../store/slices/userSlice';
import { Role } from '../../../types';
import { AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';

// Types
interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    full_name: string;
    role_id: number;
  };
}

// Custom SVG Icons
const EyeIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
    />
  </svg>
);

const MailIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const LockIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

const UserIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const ShieldIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
);

const ChartIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);

const BookIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    />
  </svg>
);

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loginStartTime = performance.now();
    console.log('🔐 Login attempt:', { email, password: '***' });
    setIsLoading(true);
    setError(null);

    try {
      console.log('📡 [1/4] Calling authService.login...');
      const apiStartTime = performance.now();
      const data = await authService.login({ email, password });
      const apiEndTime = performance.now();
      console.log(`✅ [2/4] API responded in ${(apiEndTime - apiStartTime).toFixed(0)}ms`, { 
        token: data.token ? 'exists' : 'missing', 
        user: data.user?.full_name 
      });

      // Save token to localStorage
      const storageStartTime = performance.now();
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      console.log(`✅ [3/4] LocalStorage saved in ${(performance.now() - storageStartTime).toFixed(0)}ms`);

      // Map role_id to Role enum
      let userRole: Role;
      switch (data.user.role_id) {
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
        default:
          userRole = Role.STUDENT;
      }

      // Dispatch login action to Redux store
      const reduxStartTime = performance.now();
      dispatch(loginAction({
        id: data.user.id.toString(),
        name: data.user.full_name,
        email: data.user.email,
        role: userRole,
        status: 'active',
        lastLogin: new Date().toISOString(),
        student_id: data.user.student_id,
        student_code: data.user.student_code,
        teacher_id: data.user.teacher_id,
        teacher_code: data.user.teacher_code,
      }));
      console.log(`✅ [4/4] Redux updated in ${(performance.now() - reduxStartTime).toFixed(0)}ms`);

      const totalTime = performance.now() - loginStartTime;
      console.log(`🎉 Total login time: ${totalTime.toFixed(0)}ms`);

      setSuccess(true);

      // Redirect immediately for faster UX
      console.log('🎯 Navigating to dashboard...');
      switch (data.user.role_id) {
        case 1: // Admin
          navigate('/admin/dashboard');
          break;
        case 2: // Staff
          navigate('/staff/dashboard');
          break;
        case 3: // Teacher
          navigate('/teacher/dashboard');
          break;
        case 4: // Student
          navigate('/students/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (err: any) {
      const errorTime = performance.now() - loginStartTime;
      console.error(`❌ Login failed after ${errorTime.toFixed(0)}ms`, err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError(
        err.response?.data?.error ||
          err.message ||
          'Đăng nhập thất bại. Vui lòng thử lại.'
      );
    } finally {
      console.log('🏁 Login process completed, isLoading:', false);
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.3)), url('/banner.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.md,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Overlay gradient for better content readability */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'linear-gradient(135deg, rgba(220, 38, 38, 0.01) 0%, rgba(244, 63, 94, 0.005) 50%, rgba(249, 115, 22, 0.01) 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Subtle decorative elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '15%',
          right: '10%',
          width: '120px',
          height: '120px',
          background: `radial-gradient(circle, rgba(${COLORS.primary.main
            .slice(1)
            .match(/.{2}/g)
            ?.map(x => parseInt(x, 16))
            .join(', ')}, 0.08) 0%, transparent 70%)`,
          borderRadius: '50%',
          filter: 'blur(20px)',
          zIndex: 1,
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: [1, 1.2, 1] }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
        style={{
          position: 'absolute',
          bottom: '20%',
          left: '8%',
          width: '150px',
          height: '150px',
          background: `radial-gradient(circle, rgba(${COLORS.primary.light
            .slice(1)
            .match(/.{2}/g)
            ?.map(x => parseInt(x, 16))
            .join(', ')}, 0.06) 0%, transparent 70%)`,
          borderRadius: '50%',
          filter: 'blur(25px)',
          zIndex: 1,
        }}
      />

      {/* Geometric shapes */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          top: '25%',
          left: '25%',
          width: '16px',
          height: '16px',
          background: COLORS.primary.main,
          borderRadius: '50%',
          opacity: 0.6,
        }}
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          bottom: '33%',
          right: '25%',
          width: '24px',
          height: '24px',
          border: `2px solid ${COLORS.primary.light}`,
          transform: 'rotate(45deg)',
          opacity: 0.5,
        }}
      />
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '160px',
          right: '33%',
          width: '12px',
          height: '12px',
          background: COLORS.secondary.orange,
          borderRadius: '50%',
          opacity: 0.7,
        }}
      />

      {/* Back to Home Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/')}
        style={{
          position: 'absolute',
          top: SPACING['2xl'],
          left: SPACING['2xl'],
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: SPACING.sm,
          padding: `${SPACING.sm} ${SPACING.md}`,
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${COLORS.neutral.gray200}`,
          borderRadius: BORDERS.radius.lg,
          color: COLORS.neutral.gray700,
          fontSize: TYPOGRAPHY.fontSize.sm,
          fontWeight: TYPOGRAPHY.fontWeight.medium,
          cursor: 'pointer',
          boxShadow: SHADOWS.sm,
          transition: EFFECTS.transition.normal,
        }}
        onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
          e.currentTarget.style.borderColor = COLORS.primary.main;
          e.currentTarget.style.color = COLORS.primary.main;
        }}
        onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
          e.currentTarget.style.borderColor = COLORS.neutral.gray200;
          e.currentTarget.style.color = COLORS.neutral.gray700;
        }}
      >
        <ArrowLeft size={18} />
        Về trang chủ
      </motion.button>

      <div
        style={{
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: SPACING['6xl'],
          position: 'relative',
          zIndex: 10,
        }}
        className="lg:justify-between"
      >
        {/* Left Side - Welcome Message */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            display: 'none',
            flexDirection: 'column',
            alignItems: 'flex-start',
            maxWidth: '576px',
          }}
          className="lg:flex"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: SPACING.md,
              marginBottom: SPACING['4xl'],
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                backgroundImage:
                  'url("/logo-dmt-main.png")',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                borderRadius: BORDERS.radius.lg,
                boxShadow: SHADOWS.sm,
              }}
            />
            <span
              style={{
                fontSize: TYPOGRAPHY.fontSize['3xl'],
                fontWeight: TYPOGRAPHY.fontWeight.bold,
                color: COLORS.neutral.gray900,
              }}
            >
              DMT Education
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{
              fontSize: TYPOGRAPHY.fontSize['5xl'],
              fontWeight: TYPOGRAPHY.fontWeight.bold,
              color: COLORS.neutral.gray900,
              marginBottom: SPACING['3xl'],
              lineHeight: TYPOGRAPHY.lineHeight.tight,
            }}
          >
            Chào mừng trở lại
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            style={{
              fontSize: TYPOGRAPHY.fontSize.xl,
              color: COLORS.neutral.gray600,
              marginBottom: SPACING['4xl'],
              lineHeight: TYPOGRAPHY.lineHeight.relaxed,
            }}
          >
            Hệ thống quản lý giáo dục hiện đại và toàn diện cho trung tâm DMT
          </motion.p>

          {/* Service Tags */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: SPACING.md,
              width: '100%',
            }}
          >
            {[
              {
                icon: UserIcon,
                text: 'Quản lý học viên',
                color: COLORS.primary.main,
              },
              {
                icon: ShieldIcon,
                text: 'Hệ thống điểm',
                color: COLORS.secondary.blue,
              },
              {
                icon: ChartIcon,
                text: 'Báo cáo thống kê',
                color: COLORS.secondary.orange,
              },
              {
                icon: BookIcon,
                text: 'Quản lý lớp học',
                color: COLORS.secondary.green,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: SPACING.md,
                  padding: SPACING.md,
                  background: COLORS.neutral.white,
                  borderRadius: BORDERS.radius.lg,
                  boxShadow: SHADOWS.sm,
                  border: `1px solid ${COLORS.neutral.gray100}`,
                  borderTop: `3px solid ${item.color}`,
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    background: item.color,
                    borderRadius: BORDERS.radius.sm,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: COLORS.neutral.white,
                  }}
                >
                  <item.icon />
                </div>
                <span
                  style={{
                    fontSize: TYPOGRAPHY.fontSize.sm,
                    fontWeight: TYPOGRAPHY.fontWeight.medium,
                    color: COLORS.neutral.gray700,
                  }}
                >
                  {item.text}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            width: '100%',
            maxWidth: '448px',
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.75)',
              backdropFilter: 'blur(40px) saturate(180%)',
              borderRadius: BORDERS.radius['3xl'],
              boxShadow:
                '0 25px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.3)',
              padding: SPACING['4xl'],
              border: `1px solid rgba(255, 255, 255, 0.4)`,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Subtle glow effect */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  'linear-gradient(135deg, rgba(220, 38, 38, 0.02), rgba(244, 63, 94, 0.01))',
                borderRadius: BORDERS.radius['3xl'],
                pointerEvents: 'none',
              }}
            />

            {/* Mobile Logo */}
            <div
              style={{
                textAlign: 'center',
                marginBottom: SPACING['4xl'],
              }}
              className="lg:hidden"
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: SPACING.md,
                  marginBottom: SPACING.md,
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundImage:
                      'url("/logo-dmt-main.png")',
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    borderRadius: BORDERS.radius.lg,
                    boxShadow: SHADOWS.sm,
                  }}
                />
                <span
                  style={{
                    fontSize: TYPOGRAPHY.fontSize.xl,
                    fontWeight: TYPOGRAPHY.fontWeight.bold,
                    color: COLORS.neutral.gray900,
                  }}
                >
                  DMT Education
                </span>
              </div>
              <h2
                style={{
                  fontSize: TYPOGRAPHY.fontSize['4xl'],
                  fontWeight: TYPOGRAPHY.fontWeight.bold,
                  color: COLORS.neutral.gray900,
                  marginBottom: SPACING.sm,
                }}
              >
                Chào mừng trở lại
              </h2>
            </div>

            <form
              onSubmit={handleSubmit}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: SPACING['3xl'],
              }}
            >
              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: 'linear-gradient(135deg, #e43535ff, #ffffffff)',
                    color: '#dc2626',
                    padding: SPACING.md,
                    borderRadius: BORDERS.radius.md,
                    fontSize: TYPOGRAPHY.fontSize.sm,
                    textAlign: 'center',
                    border: `1px solid #ff5555ff`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: SPACING.sm,
                  }}
                >
                  <AlertTriangle size={20} />
                  {error}
                </motion.div>
              )}

              {/* Success Message */}
              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
                    color: '#059669',
                    padding: SPACING.md,
                    borderRadius: BORDERS.radius.md,
                    fontSize: TYPOGRAPHY.fontSize.sm,
                    textAlign: 'center',
                    border: `1px solid #6ee7b7`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: SPACING.sm,
                  }}
                >
                  <CheckCircle size={20} />
                  Đăng nhập thành công!
                </motion.div>
              )}
              {/* Email Input */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: TYPOGRAPHY.fontSize.sm,
                    fontWeight: TYPOGRAPHY.fontWeight.medium,
                    color: COLORS.neutral.gray700,
                    marginBottom: SPACING.sm,
                  }}
                >
                  Email của bạn
                </label>
                <div style={{ position: 'relative' }}>
                  <div
                    style={{
                      position: 'absolute',
                      left: SPACING.md,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: COLORS.neutral.gray400,
                      pointerEvents: 'none',
                    }}
                  >
                    <MailIcon />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      paddingLeft: '40px',
                      paddingRight: SPACING.md,
                      paddingTop: SPACING.md,
                      paddingBottom: SPACING.md,
                      border: `${BORDERS.width.thin} solid ${COLORS.neutral.gray300}`,
                      borderRadius: BORDERS.radius.lg,
                      fontSize: TYPOGRAPHY.fontSize.base,
                      transition: EFFECTS.transition.normal,
                      background: COLORS.neutral.gray50,
                    }}
                    onFocus={e => {
                      (e.target as HTMLElement).style.borderColor =
                        COLORS.primary.main;
                      (e.target as HTMLElement).style.background =
                        COLORS.neutral.white;
                      (
                        e.target as HTMLElement
                      ).style.boxShadow = `0 0 0 3px rgba(220, 38, 38, 0.1)`;
                    }}
                    onBlur={e => {
                      (e.target as HTMLElement).style.borderColor =
                        COLORS.neutral.gray300;
                      (e.target as HTMLElement).style.background =
                        COLORS.neutral.gray50;
                      (e.target as HTMLElement).style.boxShadow = 'none';
                    }}
                    placeholder="vd. giang@metela.com"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: TYPOGRAPHY.fontSize.sm,
                    fontWeight: TYPOGRAPHY.fontWeight.medium,
                    color: COLORS.neutral.gray700,
                    marginBottom: SPACING.sm,
                  }}
                >
                  Mật khẩu của bạn
                </label>
                <div style={{ position: 'relative' }}>
                  <div
                    style={{
                      position: 'absolute',
                      left: SPACING.md,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: COLORS.neutral.gray400,
                      pointerEvents: 'none',
                    }}
                  >
                    <LockIcon />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      paddingLeft: '40px',
                      paddingRight: '48px',
                      paddingTop: SPACING.md,
                      paddingBottom: SPACING.md,
                      border: `${BORDERS.width.thin} solid ${COLORS.neutral.gray300}`,
                      borderRadius: BORDERS.radius.lg,
                      fontSize: TYPOGRAPHY.fontSize.base,
                      transition: EFFECTS.transition.normal,
                      background: COLORS.neutral.gray50,
                    }}
                    onFocus={e => {
                      (e.target as HTMLElement).style.borderColor =
                        COLORS.primary.main;
                      (e.target as HTMLElement).style.background =
                        COLORS.neutral.white;
                      (
                        e.target as HTMLElement
                      ).style.boxShadow = `0 0 0 3px rgba(220, 38, 38, 0.1)`;
                    }}
                    onBlur={e => {
                      (e.target as HTMLElement).style.borderColor =
                        COLORS.neutral.gray300;
                      (e.target as HTMLElement).style.background =
                        COLORS.neutral.gray50;
                      (e.target as HTMLElement).style.boxShadow = 'none';
                    }}
                    placeholder="vd. ilovemangools123"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: SPACING.md,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: COLORS.neutral.gray400,
                      cursor: 'pointer',
                      transition: EFFECTS.transition.fast,
                    }}
                    onMouseEnter={e => {
                      (e.target as HTMLElement).style.color =
                        COLORS.neutral.gray600;
                    }}
                    onMouseLeave={e => {
                      (e.target as HTMLElement).style.color =
                        COLORS.neutral.gray400;
                    }}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    style={{
                      width: '16px',
                      height: '16px',
                      accentColor: COLORS.primary.main,
                    }}
                  />
                  <span
                    style={{
                      marginLeft: SPACING.sm,
                      fontSize: TYPOGRAPHY.fontSize.sm,
                      color: COLORS.neutral.gray600,
                    }}
                  >
                    Ghi nhớ đăng nhập?
                  </span>
                </label>
                <a
                  href="#"
                  style={{
                    fontSize: TYPOGRAPHY.fontSize.sm,
                    color: COLORS.primary.main,
                    fontWeight: TYPOGRAPHY.fontWeight.medium,
                    textDecoration: 'none',
                    transition: EFFECTS.transition.fast,
                  }}
                  onMouseEnter={e => {
                    (e.target as HTMLElement).style.color = COLORS.primary.dark;
                  }}
                  onMouseLeave={e => {
                    (e.target as HTMLElement).style.color = COLORS.primary.main;
                  }}
                >
                  Quên mật khẩu?
                </a>
              </div>

              {/* Sign In Button */}
              <motion.button
                type="submit"
                disabled={isLoading || success}
                whileHover={!isLoading && !success ? { scale: 1.02 } : {}}
                whileTap={!isLoading && !success ? { scale: 0.98 } : {}}
                style={{
                  width: '100%',
                  background: success ? 'linear-gradient(135deg, #10b981, #059669)' : COLORS.primary.gradient,
                  color: COLORS.neutral.white,
                  padding: `${SPACING.md} ${SPACING.lg}`,
                  borderRadius: BORDERS.radius.lg,
                  border: 'none',
                  fontSize: TYPOGRAPHY.fontSize.lg,
                  fontWeight: TYPOGRAPHY.fontWeight.semibold,
                  cursor: isLoading || success ? 'not-allowed' : 'pointer',
                  boxShadow: SHADOWS.primary,
                  transition: EFFECTS.transition.normal,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: SPACING.sm,
                  opacity: isLoading || success ? 0.7 : 1,
                }}
              >
                {isLoading ? (
                  <>
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        border: `2px solid ${COLORS.neutral.white}`,
                        borderTop: '2px solid transparent',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite',
                      }}
                    ></div>
                    Đang xác thực...
                  </>
                ) : success ? (
                  <>
                    ✓ Thành công
                  </>
                ) : (
                  'Đăng nhập'
                )}
              </motion.button>
            </form>

            {/* Demo Accounts */}
            <div
              style={{
                marginTop: SPACING['4xl'],
                paddingTop: SPACING['3xl'],
                borderTop: `1px solid ${COLORS.neutral.gray200}`,
              }}
            >
              <p
                style={{
                  textAlign: 'center',
                  fontSize: TYPOGRAPHY.fontSize.sm,
                  color: COLORS.neutral.gray600,
                  marginBottom: SPACING.md,
                }}
              >
                Tài khoản demo
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: SPACING.md,
                }}
              >
                {[
                  {
                    role: 'Admin',
                    email: 'admin@dmt.edu.vn',
                    password: 'Admin@123',
                    color: COLORS.primary.main,
                  },
                  {
                    role: 'Giáo viên',
                    email: 'teacher.math@dmt.edu.vn',
                    password: 'Teacher@123',
                    color: COLORS.secondary.blue,
                  },
                  {
                    role: 'Học viên',
                    email: 'student001@gmail.com',
                    password: 'Student@123',
                    color: COLORS.secondary.green,
                  },
                  {
                    role: 'Nhân viên',
                    email: 'staff1@dmt.edu.vn',
                    password: 'Staff@123',
                    color: COLORS.primary.main,
                  },
                ].map((demo, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDemoLogin(demo.email, demo.password)}
                    style={{
                      padding: SPACING.md,
                      textAlign: 'left',
                      border: `1px solid ${COLORS.neutral.gray200}`,
                      borderRadius: BORDERS.radius.md,
                      background: COLORS.neutral.white,
                      cursor: 'pointer',
                      transition: EFFECTS.transition.normal,
                    }}
                    onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                      (e.target as HTMLElement).style.borderColor = demo.color;
                      (
                        e.target as HTMLElement
                      ).style.background = `${demo.color}08`;
                    }}
                    onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                      (e.target as HTMLElement).style.borderColor =
                        COLORS.neutral.gray200;
                      (e.target as HTMLElement).style.background =
                        COLORS.neutral.white;
                    }}
                  >
                    <div
                      style={{
                        fontSize: TYPOGRAPHY.fontSize.xs,
                        fontWeight: TYPOGRAPHY.fontWeight.semibold,
                        color: demo.color,
                        marginBottom: '2px',
                      }}
                    >
                      {demo.role}
                    </div>
                    <div
                      style={{
                        fontSize: TYPOGRAPHY.fontSize.xs,
                        color: COLORS.neutral.gray500,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {demo.email}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                marginTop: SPACING['3xl'],
                textAlign: 'center',
              }}
            >
              <p
                style={{
                  fontSize: TYPOGRAPHY.fontSize.xs,
                  color: COLORS.neutral.gray500,
                }}
              >
                Không có tài khoản?
                <a
                  href="#"
                  style={{
                    color: COLORS.primary.main,
                    fontWeight: TYPOGRAPHY.fontWeight.medium,
                    marginLeft: '4px',
                    textDecoration: 'none',
                    transition: EFFECTS.transition.fast,
                  }}
                  onMouseEnter={e => {
                    (e.target as HTMLElement).style.color = COLORS.primary.dark;
                  }}
                  onMouseLeave={e => {
                    (e.target as HTMLElement).style.color = COLORS.primary.main;
                  }}
                >
                  Liên hệ quản trị viên
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Global Styles */}
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          
          @media (max-width: 1024px) {
            .lg\\:flex {
              display: flex !important;
            }
            .lg\\:hidden {
              display: none !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Login;
