import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';

interface ComparisonData {
  category: string;
  [key: string]: number | string;
}

interface StatComparisonChartProps {
  data: ComparisonData[];
  players: { key: string; name: string; color: string }[];
  title?: string;
  type?: 'radar' | 'bar';
}

export function StatComparisonChart({
  data,
  players,
  title = 'Player Comparison',
  type = 'radar',
}: StatComparisonChartProps) {
  if (type === 'radar') {
    return (
      <Card>
        <CardHeader>{title}</CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={data}>
              <PolarGrid className="stroke-gray-300 dark:stroke-gray-700" />
              <PolarAngleAxis
                dataKey="category"
                className="text-xs"
                tick={{ fill: 'currentColor' }}
              />
              <PolarRadiusAxis className="text-xs" />
              {players.map((player) => (
                <Radar
                  key={player.key}
                  name={player.name}
                  dataKey={player.key}
                  stroke={player.color}
                  fill={player.color}
                  fillOpacity={0.3}
                />
              ))}
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>{title}</CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-700" />
            <XAxis dataKey="category" className="text-xs" tick={{ fill: 'currentColor' }} />
            <YAxis className="text-xs" tick={{ fill: 'currentColor' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
              }}
            />
            <Legend />
            {players.map((player) => (
              <Bar
                key={player.key}
                dataKey={player.key}
                fill={player.color}
                name={player.name}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
