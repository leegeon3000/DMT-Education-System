import React from 'react';
import { Lightbulb, ShieldAlert, Home, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../../store/slices/userSlice';

const Unauthorized: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    
    const state = location.state as any;
    const fromPath = state?.from || '/';
    const requiredRoles = state?.requiredRoles || [];
    const userRole = state?.userRole || '';

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleGoHome = () => {
        navigate('/');
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login', { replace: true });
    };    const getRoleDisplayName = (role: string) => {
        switch (role) {
            case 'admin': return 'Quản trị viên';
            case 'teacher': return 'Giáo viên';
            case 'student': return 'Học sinh';
            case 'staff': return 'Nhân viên';
            default: return role;
        }
    };

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: '100vh',
            textAlign: 'center',
            padding: '2rem',
            background: 'linear-gradient(135deg, #fee 0%, #fdd 50%, #fcc 100%)',
            fontFamily: 'Inter, sans-serif'
        }}>
            <div style={{
                background: 'white',
                padding: '3rem',
                borderRadius: '20px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                maxWidth: '500px',
                width: '100%'
            }}>
                <div style={{
                    marginBottom: '1rem',
                    display: 'flex',
                    justifyContent: 'center',
                    color: '#dc3545'
                }}>
                    <ShieldAlert size={64} strokeWidth={1.5} />
                </div>
                
                <h1 style={{ 
                    color: '#dc3545', 
                    marginBottom: '1rem',
                    fontSize: '2rem',
                    fontWeight: '700'
                }}>
                    Truy cập bị từ chối
                </h1>
                
                <p style={{ 
                    color: '#666', 
                    marginBottom: '1.5rem',
                    fontSize: '1.1rem',
                    lineHeight: '1.6'
                }}>
                    Bạn không có quyền truy cập vào trang này.
                </p>

                {userRole && (
                    <div style={{
                        background: '#f8f9fa',
                        padding: '1rem',
                        borderRadius: '8px',
                        marginBottom: '1.5rem',
                        fontSize: '0.9rem'
                    }}>
                        <p style={{ margin: '0 0 0.5rem 0', color: '#666' }}>
                            <strong>Vai trò hiện tại:</strong> {getRoleDisplayName(userRole)}
                        </p>
                        {requiredRoles.length > 0 && (
                            <p style={{ margin: 0, color: '#666' }}>
                                <strong>Yêu cầu:</strong> {requiredRoles.map((role: string) => getRoleDisplayName(role)).join(', ')}
                            </p>
                        )}
                    </div>
                )}

                <div style={{ 
                    display: 'flex', 
                    gap: '1rem', 
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                }}>
                    <button 
                        onClick={handleGoBack}
                        style={{
                            padding: '0.75rem 1.5rem',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: '500',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#5a6268';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = '#6c757d';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        ← Quay lại
                    </button>
                    
                    <button 
                        onClick={handleGoHome}
                        style={{
                            padding: '0.75rem 1.5rem',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: '500',
                            transition: 'all 0.2s ease',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#0056b3';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = '#007bff';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <Home size={18} /> Trang chủ
                    </button>
                    
                    <button 
                        onClick={handleLogout}
                        style={{
                            padding: '0.75rem 1.5rem',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: '500',
                            transition: 'all 0.2s ease',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#c82333';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = '#dc3545';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <LogOut size={18} /> Đăng xuất
                    </button>
                </div>

                <div style={{
                    marginTop: '2rem',
                    padding: '1rem',
                    background: '#e9ecef',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    color: '#666'
                }}>
                    <p style={{ margin: 0 }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <Lightbulb size={16} /> <strong>Gợi ý:</strong>
                        </span> Liên hệ với quản trị viên để được cấp quyền truy cập hoặc đăng nhập bằng tài khoản có quyền phù hợp.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;
