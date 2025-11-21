// This file defines TypeScript types and interfaces used throughout the application.

export type PaymentStatus = 'completed' | 'pending' | 'failed' | 'refunded';
export type PaymentMethod = 'cash' | 'bank_transfer' | 'credit_card' | 'e_wallet';

export interface PaymentTransaction {
    id: string;
    date: string;
    studentId: string;
    studentName: string;
    courseId: string;
    courseName: string;
    amount: number;
    status: PaymentStatus;
    paymentMethod: PaymentMethod;
    description: string;
    paymentDetails?: string;
    receiptNumber?: string;
    createdBy: string;
    createdAt: Date;
    updatedAt?: Date;
}

export interface User {
    id: string;
    username: string;
    email: string;
    role: 'admin' | 'teacher' | 'student' | 'staff';
    createdAt: Date;
    updatedAt: Date;
}

export interface Course {
    id: string;
    title: string;
    description: string;
    duration: number; // in hours
    fee: number; // in currency
    createdAt: Date;
    updatedAt: Date;
}

export interface Assignment {
    id: string;
    title: string;
    description: string;
    dueDate: Date;
    courseId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Grading {
    id: string;
    assignmentId: string;
    studentId: string;
    score: number;
    feedback: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Survey {
    id: string;
    title: string;
    questions: SurveyQuestion[];
    createdAt: Date;
    updatedAt: Date;
}

export interface SurveyQuestion {
    id: string;
    question: string;
    options: string[];
}

export interface Notification {
    id: string;
    message: string;
    type: 'info' | 'warning' | 'error';
    createdAt: Date;
}

export interface Payment {
    id: string;
    userId: string;
    amount: number;
    status: 'pending' | 'completed' | 'failed';
    createdAt: Date;
    updatedAt: Date;
}

export interface Theme {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
}

export enum Role {
    ADMIN = 'admin',
    TEACHER = 'teacher',
    STUDENT = 'student',
    STAFF = 'staff'
}

export interface PermissionGroup {
    key: string;
    label: string;
    permissions: { key: string; label: string; description?: string }[];
}