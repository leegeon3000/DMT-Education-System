import React from 'react';
import { BarChart3, PieChart, TrendingUp, Users } from 'lucide-react';

interface DashboardChartsProps {
  studentTrends: Array<{ month: string; students: number }>;
  revenueTrends: Array<{ month: string; revenue: number }>;
  coursesDistribution: Array<{ name: string; value: number; color: string }>;
  formatCurrency: (amount: number) => string;
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({
  studentTrends,
  revenueTrends,
  coursesDistribution,
  formatCurrency
}) => {
  // Simple bar chart component
  const BarChart = ({ data, title, icon: Icon, type = 'students' }: any) => {
    const maxValue = Math.max(...data.map((item: any) => type === 'students' ? item.students : item.revenue));
    
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Icon className="w-5 h-5 mr-2 text-blue-500" />
            {title}
          </h3>
        </div>
        <div className="space-y-3">
          {data.map((item: any, index: number) => {
            const value = type === 'students' ? item.students : item.revenue;
            const percentage = (value / maxValue) * 100;
            
            return (
              <div key={index} className="flex items-center">
                <div className="w-8 text-sm text-gray-600">{item.month}</div>
                <div className="flex-1 mx-3">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-20 text-sm text-right font-medium">
                  {type === 'students' ? value : formatCurrency(value).slice(0, -2) + 'tr'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Simple pie chart component
  const PieChartComponent = () => {
    const total = coursesDistribution.reduce((sum, item) => sum + item.value, 0);
    
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-green-500" />
            Phân bổ khóa học
          </h3>
        </div>
        
        {/* Simple visual representation */}
        <div className="space-y-3">
          {coursesDistribution.map((course, index) => {
            const percentage = ((course.value / total) * 100).toFixed(1);
            
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="w-4 h-4 rounded mr-3"
                    style={{ backgroundColor: course.color }}
                  ></div>
                  <span className="text-sm text-gray-700">{course.name}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900 mr-2">
                    {course.value}
                  </span>
                  <span className="text-xs text-gray-500">({percentage}%)</span>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Visual pie representation */}
        <div className="mt-4">
          <div className="flex h-2 rounded-full overflow-hidden">
            {coursesDistribution.map((course, index) => {
              const percentage = (course.value / total) * 100;
              return (
                <div
                  key={index}
                  className="transition-all duration-300"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: course.color
                  }}
                ></div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <BarChart
        data={studentTrends}
        title="Xu hướng học viên"
        icon={Users}
        type="students"
      />
      <BarChart
        data={revenueTrends}
        title="Xu hướng doanh thu"
        icon={TrendingUp}
        type="revenue"
      />
      <PieChartComponent />
    </div>
  );
};

export default DashboardCharts;
