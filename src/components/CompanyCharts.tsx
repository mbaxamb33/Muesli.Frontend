import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Company } from '../pages/Clients';
import { useTheme } from '../context/ThemeContext';

interface CompanyChartsProps {
  companies: Company[];
}

// Custom colors for charts
const COLORS = {
  industry: [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', 
    '#8884D8', '#82CA9D', '#A4DE6C', '#D0ED57'
  ],
  status: [
    '#14ea29', // Active (Green)
    '#FF6384', // Inactive (Pink)
    '#36A2EB', // Potential (Blue)
    '#FFCE56', // Onboarding (Yellow)
    '#9966FF'  // Suspended (Purple)
  ]
};

export const CompanyCharts: React.FC<CompanyChartsProps> = ({ companies }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Process data for industry distribution
  const industryDistribution = React.useMemo(() => {
    const distribution = companies.reduce((acc, company) => {
      acc[company.industry] = (acc[company.industry] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(distribution)
      .map(([industry, count]) => ({ industry, count }))
      .sort((a, b) => b.count - a.count);
  }, [companies]);

  // Process data for status distribution
  const statusDistribution = React.useMemo(() => {
    const distribution = companies.reduce((acc, company) => {
      acc[company.status] = (acc[company.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(distribution)
      .map(([status, count]) => ({ status, count }))
      .sort((a, b) => b.count - a.count);
  }, [companies]);

  // Chart text color based on theme
  const textColor = isDark ? '#f3f4f6' : '#374151';
  const gridColor = isDark ? '#2e2c50' : '#e5e7eb';

  return (
    <div className={`grid md:grid-cols-2 gap-6 mt-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>
      {/* Industry Distribution Bar Chart */}
      <div 
        className={`rounded-lg p-4 ${
          isDark ? 'bg-[#17162e]' : 'bg-white'
        } shadow-md border ${isDark ? 'border-[#2e2c50]' : 'border-gray-200'}`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Companies by Industry</h3>
          <span className="text-sm text-gray-500">{companies.length} Total</span>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart 
            data={industryDistribution}
            margin={{ top: 5, right: 0, left: -20, bottom: 5 }}
          >
            <CartesianGrid 
              vertical={false}
              strokeDasharray="3 3" 
              stroke={gridColor}
            />
            <XAxis 
              dataKey="industry" 
              axisLine={false}
              tickLine={false}
              stroke={textColor}
              tick={{ fill: textColor, fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              stroke={textColor}
              tick={{ fill: textColor, fontSize: 12 }}
            />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ 
                backgroundColor: isDark ? '#201e3d' : 'white',
                color: textColor,
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                border: 'none'
              }}
              labelStyle={{ fontWeight: 'bold' }}
            />
            <Bar 
              dataKey="count" 
              radius={[4, 4, 0, 0]}
              barSize={40}
            >
              {industryDistribution.map((entry, index) => (
                <Cell 
                  key={`cell-${entry.industry}`} 
                  fill={COLORS.industry[index % COLORS.industry.length]} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Status Distribution Pie Chart */}
      <div 
        className={`rounded-lg p-4 ${
          isDark ? 'bg-[#17162e]' : 'bg-white'
        } shadow-md border ${isDark ? 'border-[#2e2c50]' : 'border-gray-200'}`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Companies by Status</h3>
          <span className="text-sm text-gray-500">{companies.length} Total</span>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusDistribution}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
              startAngle={90}
              endAngle={-270}
              paddingAngle={5}
              label={({ name, percent }) => 
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              labelStyle={{ 
                fill: textColor,
                fontSize: 12,
                fontWeight: 'bold'
              }}
            >
              {statusDistribution.map((entry, index) => (
                <Cell 
                  key={`cell-${entry.status}`} 
                  fill={COLORS.status[index % COLORS.status.length]} 
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: isDark ? '#201e3d' : 'white',
                color: textColor,
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                border: 'none'
              }}
              labelStyle={{ fontWeight: 'bold' }}
            />
            <Legend 
              iconType="circle"
              align="right"
              layout="vertical"
              verticalAlign="middle"
              wrapperStyle={{ 
                color: textColor,
                fontSize: 12
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};