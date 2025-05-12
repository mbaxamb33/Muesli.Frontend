import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Company } from '../pages/Clients';
import { useTheme } from '../context/ThemeContext';

interface CompanyChartsProps {
  companies: Company[];
}

// Custom colors for pie chart
const PIE_COLORS = ['#EF436B', '#52489C', '#F08605', '#BCE7FD', '#C4FFB2'];

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
      .map(([status, count]) => ({ name: status, value: count }))
      .sort((a, b) => b.value - a.value);
  }, [companies]);

  // Style configurations
  const chartBg = '#100e24';
  const barColor = '#1a91ff';
  const textColor = '#ffffff';
  const chartTextStyle = { fill: textColor, fontSize: 12 };
  
  // Custom label for pie chart
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={11}
        fontWeight={600}
      >
        {`${name}: ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="mt-8">
      <div className="grid grid-cols-2 gap-6">
        {/* Industry Distribution - Bar Chart */}
        <div className="rounded-lg overflow-hidden bg-[#100e24]">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-white text-lg font-medium">Industry Distribution</h2>
            <div className="flex justify-between">
              <p className="text-sm text-gray-400">Total companies by industry</p>
              <p className="text-sm text-gray-400">Total: {companies.length}</p>
            </div>
          </div>
          
          <div className="h-80 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={industryDistribution}
                margin={{ top: 20, right: 30, left: 0, bottom: 30 }}
                barGap={0}
                barCategoryGap={1}
              >
                <XAxis 
                  dataKey="industry" 
                  tick={chartTextStyle} 
                  axisLine={{ stroke: '#333' }}
                  tickLine={false}
                  dy={10}
                />
                <YAxis 
                  tick={chartTextStyle} 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: '#1e1b4b', 
                    border: 'none',
                    borderRadius: '4px',
                    color: textColor,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                  }}
                  cursor={{ fill: 'transparent' }}
                  labelStyle={{ color: textColor, fontWeight: 'bold', marginBottom: '5px' }}
                  itemStyle={{ color: textColor }}
                />
                <Bar 
                  dataKey="count" 
                  fill={barColor}
                  radius={[1, 1, 0, 0]}
                  barSize={3}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution - Pie Chart */}
        <div className="rounded-lg overflow-hidden bg-[#100e24]">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-white text-lg font-medium">Status Distribution</h2>
            <div className="flex justify-between">
              <p className="text-sm text-gray-400">Total companies by status</p>
              <p className="text-sm text-gray-400">Total: {companies.length}</p>
            </div>
          </div>
          
          <div className="h-80 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  animationDuration={1500}
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell 
                      key={`cell-${entry.name}`} 
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: '#1e1b4b', 
                    border: 'none',
                    borderRadius: '4px',
                    color: textColor,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                  }}
                  cursor={{ fill: 'transparent' }}
                  labelStyle={{ color: textColor, fontWeight: 'bold', marginBottom: '5px' }}
                  itemStyle={{ color: textColor }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};