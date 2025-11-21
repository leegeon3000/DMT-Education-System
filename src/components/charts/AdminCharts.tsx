import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

interface ChartWrapperProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export const ChartWrapper: React.FC<ChartWrapperProps> = ({ 
  title, 
  children, 
  className = '',
  action 
}) => (
  <div className={`bg-white rounded-xl border border-gray-200 p-6 shadow-sm ${className}`}>
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {action}
    </div>
    {children}
  </div>
);

// Revenue Chart - Area Chart
interface RevenueData {
  month: string;
  revenue: number;
  expenses: number;
}

export const RevenueChart: React.FC<{ data: RevenueData[] }> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <AreaChart data={data}>
      <defs>
        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
        </linearGradient>
        <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
          <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
      <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
      <YAxis stroke="#6b7280" fontSize={12} />
      <Tooltip 
        contentStyle={{ 
          backgroundColor: '#fff', 
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          fontSize: '12px'
        }}
      />
      <Legend />
      <Area 
        type="monotone" 
        dataKey="revenue" 
        stroke="#10b981" 
        fillOpacity={1} 
        fill="url(#colorRevenue)"
        name="Doanh thu"
      />
      <Area 
        type="monotone" 
        dataKey="expenses" 
        stroke="#ef4444" 
        fillOpacity={1} 
        fill="url(#colorExpenses)"
        name="Chi phí"
      />
    </AreaChart>
  </ResponsiveContainer>
);

// Student Distribution by Region - Pie Chart
interface RegionData {
  name: string;
  value: number;
  percentage: number;
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

export const StudentRegionChart: React.FC<{ data: RegionData[] }> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={({ name, percentage }) => `${name}: ${percentage}%`}
        outerRadius={100}
        fill="#8884d8"
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
);

// Teacher Performance - Bar Chart
interface TeacherPerformance {
  name: string;
  avgScore: number;
  studentsCount: number;
  satisfaction: number;
}

export const TeacherPerformanceChart: React.FC<{ data: TeacherPerformance[] }> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
      <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
      <YAxis stroke="#6b7280" fontSize={12} />
      <Tooltip 
        contentStyle={{ 
          backgroundColor: '#fff', 
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          fontSize: '12px'
        }}
      />
      <Legend />
      <Bar dataKey="avgScore" fill="#6366f1" name="Điểm TB" />
      <Bar dataKey="satisfaction" fill="#10b981" name="Hài lòng (%)" />
    </BarChart>
  </ResponsiveContainer>
);

// Course Completion Rate - Line Chart
interface CourseCompletion {
  course: string;
  completionRate: number;
  enrollments: number;
}

export const CourseCompletionChart: React.FC<{ data: CourseCompletion[] }> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
      <XAxis dataKey="course" stroke="#6b7280" fontSize={12} />
      <YAxis stroke="#6b7280" fontSize={12} />
      <Tooltip 
        contentStyle={{ 
          backgroundColor: '#fff', 
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          fontSize: '12px'
        }}
      />
      <Legend />
      <Line 
        type="monotone" 
        dataKey="completionRate" 
        stroke="#8b5cf6" 
        strokeWidth={2}
        name="Tỷ lệ hoàn thành (%)"
      />
      <Line 
        type="monotone" 
        dataKey="enrollments" 
        stroke="#f59e0b" 
        strokeWidth={2}
        name="Số đăng ký"
      />
    </LineChart>
  </ResponsiveContainer>
);

// Attendance Trend - Area Chart
interface AttendanceData {
  week: string;
  present: number;
  absent: number;
  late: number;
}

export const AttendanceTrendChart: React.FC<{ data: AttendanceData[] }> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <AreaChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
      <XAxis dataKey="week" stroke="#6b7280" fontSize={12} />
      <YAxis stroke="#6b7280" fontSize={12} />
      <Tooltip 
        contentStyle={{ 
          backgroundColor: '#fff', 
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          fontSize: '12px'
        }}
      />
      <Legend />
      <Area 
        type="monotone" 
        dataKey="present" 
        stackId="1"
        stroke="#10b981" 
        fill="#10b981"
        name="Có mặt"
      />
      <Area 
        type="monotone" 
        dataKey="late" 
        stackId="1"
        stroke="#f59e0b" 
        fill="#f59e0b"
        name="Đi muộn"
      />
      <Area 
        type="monotone" 
        dataKey="absent" 
        stackId="1"
        stroke="#ef4444" 
        fill="#ef4444"
        name="Vắng mặt"
      />
    </AreaChart>
  </ResponsiveContainer>
);

// Monthly Enrollment Trend
interface EnrollmentTrend {
  month: string;
  newStudents: number;
  totalStudents: number;
}

export const EnrollmentTrendChart: React.FC<{ data: EnrollmentTrend[] }> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
      <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
      <YAxis stroke="#6b7280" fontSize={12} />
      <Tooltip 
        contentStyle={{ 
          backgroundColor: '#fff', 
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          fontSize: '12px'
        }}
      />
      <Legend />
      <Bar dataKey="newStudents" fill="#6366f1" name="Học sinh mới" />
      <Bar dataKey="totalStudents" fill="#8b5cf6" name="Tổng học sinh" />
    </BarChart>
  </ResponsiveContainer>
);

export default {
  ChartWrapper,
  RevenueChart,
  StudentRegionChart,
  TeacherPerformanceChart,
  CourseCompletionChart,
  AttendanceTrendChart,
  EnrollmentTrendChart,
};
