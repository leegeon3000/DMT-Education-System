import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/slices/userSlice';
import { User, GraduationCap, Users as UsersIcon, UserCog, CheckCircle } from 'lucide-react';

const LoginSuccessNotification: React.FC = () => {
    const [show, setShow] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const user = useSelector(selectCurrentUser);

    useEffect(() => {
        if (user.isAuthenticated && user.name && !show) {
            setShow(true);
            setIsVisible(true);
            
            // Auto hide after 4 seconds
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(() => setShow(false), 300); // Wait for animation
            }, 4000);
            
            return () => clearTimeout(timer);
        }
    }, [user.isAuthenticated, user.name]);

    const getRoleDisplay = (role: string | null) => {
        switch (role) {
            case 'admin':
                return { name: 'Quản trị viên', icon: <UserCog size={20} />, color: '#dc3545' };
            case 'teacher':
                return { name: 'Giáo viên', icon: <GraduationCap size={20} />, color: '#28a745' };
            case 'student':
                return { name: 'Học sinh', icon: <UsersIcon size={20} />, color: '#007bff' };
            case 'staff':
                return { name: 'Nhân viên', icon: <User size={20} />, color: '#6f42c1' };
            default:
                return { name: 'Người dùng', icon: <User size={20} />, color: '#6c757d' };
        }
    };

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => setShow(false), 300);
    };

    if (!show || !user.isAuthenticated) return null;

    const roleInfo = getRoleDisplay(user.role);

    return (
        <div 
            style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 1000,
                transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
                opacity: isVisible ? 1 : 0,
                transition: 'all 0.3s ease-out'
            }}
        >
            <div style={{
                background: 'linear-gradient(135deg, #28a745, #20c997)',
                color: 'white',
                padding: '1rem 1.5rem',
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(40, 167, 69, 0.3)',
                maxWidth: '350px',
                minWidth: '300px'
            }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                    }}>
                        <CheckCircle size={24} />
                    </div>
                    
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <span style={{ fontSize: '1rem', fontWeight: '600' }}>Đăng nhập thành công!</span>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <span>{roleInfo.icon}</span>
                            <span style={{ 
                                fontSize: '0.9rem', 
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}>
                                Xin chào <strong>{user.name}</strong>
                            </span>
                        </div>
                        
                        <div style={{
                            fontSize: '0.8rem',
                            opacity: 0.9,
                            padding: '0.25rem 0.5rem',
                            background: 'rgba(255, 255, 255, 0.15)',
                            borderRadius: '12px',
                            display: 'inline-block'
                        }}>
                            {roleInfo.name}
                        </div>
                    </div>
                    
                    <button
                        onClick={handleClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            padding: '0.25rem',
                            borderRadius: '4px',
                            opacity: 0.7,
                            transition: 'opacity 0.2s ease',
                            flexShrink: 0
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.opacity = '1';
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.opacity = '0.7';
                            e.currentTarget.style.background = 'none';
                        }}
                    >
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                {/* Progress bar */}
                <div style={{
                    width: '100%',
                    height: '2px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '1px',
                    marginTop: '0.75rem',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        width: '100%',
                        height: '100%',
                        background: 'rgba(255, 255, 255, 0.6)',
                        borderRadius: '1px',
                        animation: 'shrink 4s linear forwards'
                    }} />
                </div>
            </div>
            
            <style>
                {`
                    @keyframes shrink {
                        from { width: 100%; }
                        to { width: 0%; }
                    }
                `}
            </style>
        </div>
    );
};

export default LoginSuccessNotification;
