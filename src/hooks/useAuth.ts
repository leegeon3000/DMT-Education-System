import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { login, logout } from '../store/slices/userSlice';
import { authService } from '../services/auth';

const useAuth = () => {
    const dispatch = useDispatch();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                // Only check auth if token exists
                const token = authService.getToken();
                if (!token) {
                    setIsAuthenticated(false);
                    setLoading(false);
                    return;
                }
                
                const user = await authService.getCurrentUser();
                if (user) {
                    dispatch(login(user));
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Error checking authentication status:', error);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuthStatus();
    }, [dispatch]);

    const handleLogin = async (credentials) => {
        try {
            const user = await authService.login(credentials);
            dispatch(login(user));
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const handleLogout = async () => {
        try {
            await authService.logout();
            dispatch(logout());
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return {
        isAuthenticated,
        loading,
        handleLogin,
        handleLogout,
    };
};

export default useAuth;