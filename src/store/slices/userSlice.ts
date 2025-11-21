import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Role } from '../../types';

interface UserState {
    id: string | null;
    name: string | null;
    email: string | null;
    role: Role | null;
    status?: 'active' | 'locked';
    lastLogin?: string;
    isAuthenticated: boolean;
    // Additional role-specific IDs
    student_id?: number | null;
    student_code?: string | null;
    teacher_id?: number | null;
    teacher_code?: string | null;
}

// Initialize state from localStorage if available
const getInitialState = (): UserState => {
    try {
        const token = localStorage.getItem('authToken') || localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        
        if (token && userStr) {
            const user = JSON.parse(userStr);
            return {
                id: user.id?.toString() || null,
                name: user.full_name || null,
                email: user.email || null,
                role: user.role_id ? mapRoleIdToRole(user.role_id) : null,
                status: 'active',
                lastLogin: user.lastLogin || new Date().toISOString(),
                isAuthenticated: true,
                student_id: user.student_id || null,
                student_code: user.student_code || null,
                teacher_id: user.teacher_id || null,
                teacher_code: user.teacher_code || null,
            };
        }
    } catch (error) {
        console.error('Error loading user from localStorage:', error);
    }
    
    return {
        id: null,
        name: null,
        email: null,
        role: null,
        status: 'active',
        lastLogin: undefined,
        isAuthenticated: false,
        student_id: null,
        student_code: null,
        teacher_id: null,
        teacher_code: null,
    };
};

// Helper to map role_id to Role enum
const mapRoleIdToRole = (roleId: number): Role | null => {
    switch (roleId) {
        case 1:
            return Role.ADMIN;
        case 2:
            return Role.STAFF;
        case 3:
            return Role.TEACHER;
        case 4:
            return Role.STUDENT;
        default:
            return null;
    }
};

const initialState: UserState = getInitialState();

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login(state, action: PayloadAction<{ 
            id: string; 
            name: string; 
            email: string; 
            role: Role; 
            status?: 'active' | 'locked'; 
            lastLogin?: string;
            student_id?: number;
            student_code?: string;
            teacher_id?: number;
            teacher_code?: string;
        }>) {
            const { id, name, email, role, status, lastLogin, student_id, student_code, teacher_id, teacher_code } = action.payload;
            state.id = id;
            state.name = name;
            state.email = email;
            state.role = role;
            state.status = status || 'active';
            state.lastLogin = lastLogin;
            state.isAuthenticated = true;
            state.student_id = student_id || null;
            state.student_code = student_code || null;
            state.teacher_id = teacher_id || null;
            state.teacher_code = teacher_code || null;
        },
        logout(state) {
            state.id = null;
            state.name = null;
            state.email = null;
            state.role = null;
            state.status = 'active';
            state.lastLogin = undefined;
            state.isAuthenticated = false;
            state.student_id = null;
            state.student_code = null;
            state.teacher_id = null;
            state.teacher_code = null;
            
            // Clear localStorage
            localStorage.removeItem('authToken');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
        updateUser(state, action: PayloadAction<{ name?: string; email?: string; role?: Role; status?: 'active' | 'locked'; lastLogin?: string }>) {
            const { name, email, role, status, lastLogin } = action.payload;
            if (name) state.name = name;
            if (email) state.email = email;
            if (role) state.role = role;
            if (status) state.status = status;
            if (lastLogin) state.lastLogin = lastLogin;
        },
    },
});

export const { login, logout, updateUser } = userSlice.actions;

export const selectCurrentUser = (state: any) => state.user;
export const selectUserRole = (state: any) => state.user.role;

export default userSlice.reducer;