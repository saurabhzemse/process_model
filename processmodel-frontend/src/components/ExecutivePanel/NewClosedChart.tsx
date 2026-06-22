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
} from 'recharts';
import { BpBreakdown } from '../../types';

interface Props { data: BpBreakdown[] }

const truncate = (str: string, max: number) =>
  str.length > max ? str.slice(0, max) + '…' : str;

export const NewClosedChart: React.FC<Props> = ({ data }) => {
  const chartData = data.map(bp => ({
    name: truncate(bp.name, 16),
    New: bp.newCount,
    Closed: bp.closedCount,
    'In Progress': bp.inProgressCount,
  }));

  return (
    <div>
      <h3 className="text-sm font-bold text-gray-800 mb-3">New vs Closed by Business Process</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={chartData}
          margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
          barCategoryGap="30%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10, fill: '#6B7280' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#6B7280' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              fontSize: 12,
            }}
            cursor={{ fill: '#F9FAFB' }}
          />
          <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
          <Bar dataKey="New" fill="#2563EB" radius={[3, 3, 0, 0]} />
          <Bar dataKey="Closed" fill="#059669" radius={[3, 3, 0, 0]} />
          <Bar dataKey="In Progress" fill="#D97706" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
