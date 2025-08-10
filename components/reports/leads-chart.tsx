'use client';

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

type LeadsChartProps = {
  data: Array<{
    status: string;
    _count: {
      id: number;
    };
  }>;
};

export function LeadsChart({ data }: LeadsChartProps) {
  // Transform data for chart
  const chartData = data.map(item => ({
    status: item.status,
    leads: item._count.id
  }));

  // Color mapping for different lead statuses
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return '#3b82f6'; // Blue
      case 'CONVERTED': return '#10b981'; // Green
      case 'REJECTED': return '#ef4444'; // Red
      default: return '#6b7280'; // Gray
    }
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart 
        data={chartData}
        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="status" />
        <YAxis />
        <Tooltip 
          formatter={(value, name) => [value, 'Leads']}
          labelFormatter={(label) => `Status: ${label}`}
        />
        <Bar 
          dataKey="leads" 
          fill="#8884d8"
          barSize={60}
          radius={[10, 10, 0, 0]}
          label={{ 
            position: 'top', 
            formatter: (value) => value 
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
} 