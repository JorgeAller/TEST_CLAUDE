import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';

interface DataPoint {
  date: string;
  [key: string]: number | string;
}

interface PerformanceTrendChartProps {
  data: DataPoint[];
  metrics: { key: string; label: string; color: string }[];
  title?: string;
  type?: 'line' | 'area';
}

export function PerformanceTrendChart({
  data,
  metrics,
  title = 'Performance Trends',
  type = 'line',
}: PerformanceTrendChartProps) {
  const ChartComponent = type === 'area' ? AreaChart : LineChart;

  return (
    <Card>
      <CardHeader>{title}</CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ChartComponent data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-700" />
            <XAxis
              dataKey="date"
              className="text-xs"
              tick={{ fill: 'currentColor' }}
            />
            <YAxis className="text-xs" tick={{ fill: 'currentColor' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
              }}
            />
            <Legend />
            {type === 'area' ? (
              metrics.map((metric) => (
                <Area
                  key={metric.key}
                  type="monotone"
                  dataKey={metric.key}
                  stroke={metric.color}
                  fill={metric.color}
                  fillOpacity={0.3}
                  name={metric.label}
                  strokeWidth={2}
                />
              ))
            ) : (
              metrics.map((metric) => (
                <Line
                  key={metric.key}
                  type="monotone"
                  dataKey={metric.key}
                  stroke={metric.color}
                  name={metric.label}
                  strokeWidth={2}
                />
              ))
            )}
          </ChartComponent>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
