import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as any;

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
        padding: '1rem',
      }}
    >
      <div
        style={{
          maxWidth: '500px',
          width: '100%',
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '3rem 2rem',
          textAlign: 'center',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '1.5rem',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#fee2e2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShieldAlert size={40} color="#dc2626" />
          </div>
        </div>

        <h1
          style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '1rem',
          }}
        >
          Không có quyền truy cập
        </h1>

        <p
          style={{
            fontSize: '1rem',
            color: '#6b7280',
            marginBottom: '0.5rem',
            lineHeight: '1.5',
          }}
        >
          Bạn không có quyền truy cập vào trang này.
        </p>

        {state?.from && (
          <p
            style={{
              fontSize: '0.875rem',
              color: '#9ca3af',
              marginBottom: '1.5rem',
            }}
          >
            Đường dẫn: <code style={{ backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px' }}>{state.from}</code>
          </p>
        )}

        {state?.requiredRoles && state?.userRole && (
          <div
            style={{
              backgroundColor: '#fef3c7',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              fontSize: '0.875rem',
            }}
          >
            <p style={{ marginBottom: '0.5rem', fontWeight: '500', color: '#92400e' }}>
              Thông tin phân quyền:
            </p>
            <p style={{ color: '#78350f', marginBottom: '0.25rem' }}>
              <strong>Vai trò của bạn:</strong> {state.userRole}
            </p>
            <p style={{ color: '#78350f' }}>
              <strong>Vai trò yêu cầu:</strong> {state.requiredRoles.join(', ')}
            </p>
          </div>
        )}

        <p
          style={{
            fontSize: '0.95rem',
            color: '#4b5563',
            marginBottom: '2rem',
          }}
        >
          Vui lòng đăng nhập với tài khoản có quyền truy cập hoặc liên hệ quản trị viên để được hỗ trợ.
        </p>

        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={handleGoBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e5e7eb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
          >
            <ArrowLeft size={18} />
            Quay lại
          </button>

          <button
            onClick={handleGoHome}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#4f46e5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#6366f1';
            }}
          >
            <Home size={18} />
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
