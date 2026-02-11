

// src/admin/components/analytics/MonthlyTrendsChart.tsx
"use client";
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
} from 'recharts';

interface MonthlyFormTrend {
  month: string;
  count: number;
}

interface MonthlyTrendsChartProps {
  data: MonthlyFormTrend[];
  loading?: boolean;
  chartType?: 'bar' | 'line' | 'area';
  height?: number;
}

const MonthlyTrendsChart: React.FC<MonthlyTrendsChartProps> = ({
  data,
  loading = false,
  chartType = 'bar',
  height = 350,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg animate-pulse">
        <div className="text-gray-400">Loading chart...</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
        <span className="text-6xl mb-4">📊</span>
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  // Format month labels for better display (e.g., "2025-01" → "Jan 2025")
  const formatMonth = (monthStr: string) => {
    try {
      const [year, month] = monthStr.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
      return monthStr;
    }
  };

  const formattedData = data.map((item) => ({
    ...item,
    displayMonth: formatMonth(item.month),
    originalMonth: item.month,
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-900 mb-1">
            {payload[0].payload.displayMonth}
          </p>
          <p className="text-sm text-gray-600">
            Forms Generated:{' '}
            <span className="font-bold text-blue-600">
              {payload[0].value.toLocaleString()}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Render different chart types
  const renderChart = () => {
    const commonProps = {
      data: formattedData,
      margin: { top: 10, right: 30, left: 0, bottom: 0 },
    };

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="displayMonth"
              tick={{ fontSize: 12, fill: '#6B7280' }}
              stroke="#9CA3AF"
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#6B7280' }}
              stroke="#9CA3AF"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }}
            />
            <Line
              type="monotone"
              dataKey="count"
              name="Forms Generated"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ fill: '#3B82F6', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="displayMonth"
              tick={{ fontSize: 12, fill: '#6B7280' }}
              stroke="#9CA3AF"
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#6B7280' }}
              stroke="#9CA3AF"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }}
            />
            <Area
              type="monotone"
              dataKey="count"
              name="Forms Generated"
              stroke="#3B82F6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCount)"
            />
          </AreaChart>
        );

      case 'bar':
      default:
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="displayMonth"
              tick={{ fontSize: 12, fill: '#6B7280' }}
              stroke="#9CA3AF"
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#6B7280' }}
              stroke="#9CA3AF"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }}
            />
            <Bar
              dataKey="count"
              name="Forms Generated"
              fill="#3B82F6"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        );
    }
  };

  // Calculate statistics
  const totalForms = formattedData.reduce((sum, item) => sum + item.count, 0);
  const avgForms = Math.round(totalForms / formattedData.length);
  const maxForms = Math.max(...formattedData.map((item) => item.count));
  const minForms = Math.min(...formattedData.map((item) => item.count));
  const maxMonth = formattedData.find((item) => item.count === maxForms);

  return (
    <div className="space-y-4">
      {/* Chart */}
      <div className="bg-white rounded-lg p-4">
        <ResponsiveContainer width="100%" height={height}>
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <p className="text-xs text-gray-600 mb-1">Total Forms</p>
          <p className="text-2xl font-bold text-blue-600">
            {totalForms.toLocaleString()}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <p className="text-xs text-gray-600 mb-1">Average/Month</p>
          <p className="text-2xl font-bold text-green-600">
            {avgForms.toLocaleString()}
          </p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <p className="text-xs text-gray-600 mb-1">Peak Month</p>
          <p className="text-2xl font-bold text-purple-600">
            {maxForms.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {maxMonth?.displayMonth}
          </p>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 text-center">
          <p className="text-xs text-gray-600 mb-1">Lowest Month</p>
          <p className="text-2xl font-bold text-orange-600">
            {minForms.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Data Table (Collapsible) */}
      <details className="bg-white rounded-lg border border-gray-200">
        <summary className="px-4 py-3 cursor-pointer hover:bg-gray-50 font-medium text-gray-700">
          View Data Table
        </summary>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Month
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Forms Generated
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  % of Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {formattedData.map((trend, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {trend.displayMonth}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {trend.count.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {((trend.count / totalForms) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 border-t">
              <tr>
                <td className="px-4 py-3 text-sm font-bold text-gray-900">
                  Total
                </td>
                <td className="px-4 py-3 text-sm font-bold text-gray-900">
                  {totalForms.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm font-bold text-gray-900">
                  100%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </details>
    </div>
  );
};

export default MonthlyTrendsChart;
