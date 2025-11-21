import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/slices/userSlice';
import { Role } from '../../types';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: Role[];
    requireAuth?: boolean;
    fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
    children, 
    allowedRoles = [], 
    requireAuth = true,
    fallbackPath = '/auth/login' 
}) => {
    const location = useLocation();
    const user = useSelector(selectCurrentUser);

    // Show loading if user state is being determined
    if (requireAuth && user.isAuthenticated === undefined) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '100vh',
                backgroundColor: '#f9fafb'
            }}>
                <LoadingSpinner size="large" />
            </div>
        );
    }

    // Check if user is authenticated when required
    if (requireAuth && !user.isAuthenticated) {
        return <Navigate 
            to={fallbackPath} 
            state={{ from: location.pathname }} 
            replace 
        />;
    }

    // Check role permissions if specified
    if (allowedRoles.length > 0 && user.role) {
        if (!allowedRoles.includes(user.role)) {
            return <Navigate 
                to="/unauthorized" 
                state={{ 
                    from: location.pathname,
                    requiredRoles: allowedRoles.map(role => role.toString()),
                    userRole: user.role.toString()
                }} 
                replace 
            />;
        }
    }

    // If user is authenticated but trying to access login page, redirect to dashboard
    if (!requireAuth && user.isAuthenticated && location.pathname === '/auth/login') {
        const dashboardPath = getDashboardPath(user.role);
        return <Navigate to={dashboardPath} replace />;
    }

    return <>{children}</>;
};

// Helper function to get dashboard path based on role
const getDashboardPath = (role: Role | null): string => {
    switch (role) {
        case Role.ADMIN:
            return '/admin/dashboard';
        case Role.TEACHER:
            return '/teacher/dashboard';
        case Role.STUDENT:
            return '/students/dashboard';
        case Role.STAFF:
            return '/staff/dashboard';
        default:
            return '/';
    }
};

export default ProtectedRoute;
