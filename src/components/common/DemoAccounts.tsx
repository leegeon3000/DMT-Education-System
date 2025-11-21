import React, { useState } from 'react';
import { UserCog, GraduationCap, Users, User, Rocket, Target, CheckCircle } from 'lucide-react';

interface DemoAccount {
    role: string;
    email: string;
    password: string;
    description: string;
    color: string;
    icon: string;
    roleKey: string;
}

interface DemoAccountsProps {
    onAccountSelect: (email: string, password: string) => void;
}

const DemoAccounts: React.FC<DemoAccountsProps> = ({ onAccountSelect }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'UserCog': return <UserCog size={20} />;
            case 'GraduationCap': return <GraduationCap size={20} />;
            case 'Users': return <Users size={20} />;
            case 'User': return <User size={20} />;
            default: return <User size={20} />;
        }
    };

    const demoAccounts: DemoAccount[] = [
        {
            role: 'Quản trị viên',
            email: 'admin@dmt.edu.vn',
            password: 'admin123',
            description: 'Quản lý toàn bộ hệ thống',
            color: 'from-red-500 to-red-600',
            icon: 'UserCog',
            roleKey: 'admin'
        },
        {
            role: 'Giáo viên',
            email: 'teacher@dmt.edu.vn',
            password: 'teacher123',
            description: 'Quản lý lớp học và bài giảng',
            color: 'from-green-500 to-green-600',
            icon: 'GraduationCap',
            roleKey: 'teacher'
        },
        {
            role: 'Học sinh',
            email: 'student@dmt.edu.vn',
            password: 'student123',
            description: 'Tham gia khóa học và làm bài tập',
            color: 'from-blue-500 to-blue-600',
            icon: 'Users',
            roleKey: 'student'
        },
        {
            role: 'Nhân viên',
            email: 'staff@dmt.edu.vn',
            password: 'staff123',
            description: 'Hỗ trợ và quản lý công việc',
            color: 'from-purple-500 to-purple-600',
            icon: 'User',
            roleKey: 'staff'
        }
    ];

    const handleAccountClick = (account: DemoAccount) => {
        setSelectedAccount(account.roleKey);
        onAccountSelect(account.email, account.password);
        
        // Animation effect
        setTimeout(() => {
            setSelectedAccount(null);
            setIsExpanded(false);
        }, 1000);
    };

    return (
        <div className="demo-accounts-container" style={{ marginTop: '1.5rem' }}>
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(102, 126, 234, 0.1)',
                    border: '1px solid rgba(102, 126, 234, 0.2)',
                    borderRadius: '8px',
                    color: '#667eea',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(102, 126, 234, 0.15)';
                    e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.3)';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.2)';
                }}
            >
                <Rocket size={20} />
                <span>Dùng thử tài khoản demo</span>
                <svg 
                    style={{
                        width: '16px',
                        height: '16px',
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease'
                    }}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isExpanded && (
                <div 
                    style={{
                        marginTop: '1rem',
                        padding: '1rem',
                        background: 'rgba(248, 249, 250, 0.8)',
                        borderRadius: '12px',
                        border: '1px solid rgba(225, 229, 233, 0.5)',
                        animation: 'fadeInScale 0.2s ease-out'
                    }}
                >
                    <p style={{
                        textAlign: 'center',
                        color: '#666',
                        fontSize: '0.85rem',
                        marginBottom: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                    }}>
                        <Target size={16} />
                        Chọn một tài khoản để trải nghiệm hệ thống
                    </p>
                    
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '0.75rem'
                    }}>
                        {demoAccounts.map((account, index) => (
                            <button
                                key={index}
                                onClick={() => handleAccountClick(account)}
                                disabled={selectedAccount === account.roleKey}
                                style={{
                                    padding: '1rem',
                                    background: selectedAccount === account.roleKey 
                                        ? 'rgba(102, 126, 234, 0.1)' 
                                        : 'white',
                                    border: selectedAccount === account.roleKey 
                                        ? '2px solid rgba(102, 126, 234, 0.3)' 
                                        : '1px solid rgba(225, 229, 233, 0.5)',
                                    borderRadius: '8px',
                                    cursor: selectedAccount === account.roleKey ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s ease',
                                    textAlign: 'left',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                                onMouseOver={(e) => {
                                    if (selectedAccount !== account.roleKey) {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                                        e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.3)';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (selectedAccount !== account.roleKey) {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                        e.currentTarget.style.borderColor = 'rgba(225, 229, 233, 0.5)';
                                    }
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '8px',
                                        background: `linear-gradient(135deg, ${account.color.split(' ')[1]}, ${account.color.split(' ')[3]})`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.2rem',
                                        flexShrink: 0
                                    }}>
                                        {getIcon(account.icon)}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{
                                            fontSize: '0.9rem',
                                            fontWeight: '600',
                                            color: '#333',
                                            marginBottom: '0.25rem'
                                        }}>
                                            {account.role}
                                        </div>
                                        <div style={{
                                            fontSize: '0.75rem',
                                            color: '#666',
                                            marginBottom: '0.25rem',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {account.email}
                                        </div>
                                        <div style={{
                                            fontSize: '0.7rem',
                                            color: '#999'
                                        }}>
                                            {account.description}
                                        </div>
                                    </div>
                                </div>
                                
                                {selectedAccount === account.roleKey && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '8px',
                                        right: '8px',
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '50%',
                                        background: '#22c55e',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '0.7rem'
                                    }}>
                                        <CheckCircle size={14} />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                    
                    <div style={{
                        marginTop: '1rem',
                        padding: '0.75rem',
                        background: 'rgba(102, 126, 234, 0.05)',
                        borderRadius: '8px',
                        textAlign: 'center'
                    }}>
                        <p style={{
                            fontSize: '0.75rem',
                            color: '#667eea',
                            margin: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}>
                            <Target size={12} />
                            Mỗi role sẽ được điều hướng đến dashboard phù hợp
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DemoAccounts;
