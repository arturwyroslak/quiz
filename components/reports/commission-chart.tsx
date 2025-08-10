'use client';

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

type CommissionChartProps = {
  data: Array<{
    month: string;
    _count: {
      id: number;
    };
  }>;
};

export function CommissionChart({ data }: CommissionChartProps) {
  // Transform data for chart
  const chartData = data.map(item => ({
    month: item.month,
    leads: item._count.id
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart 
        data={chartData}
        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip 
          formatter={(value: number) => [value, 'Leads']}
          labelFormatter={(label) => `Month: ${label}`}
        />
        <Line 
          type="monotone" 
          dataKey="leads" 
          stroke="#8884d8"
          strokeWidth={3}
          dot={{ r: 6 }}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
} 