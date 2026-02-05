import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface StatBadgeProps {
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
}

export function StatBadge({
  label,
  value,
  trend,
  trendValue,
  size = 'md',
  variant = 'default',
  className,
}: StatBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const variantClasses = {
    default: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100',
    primary: 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100',
    success: 'bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100',
    warning: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100',
    danger: 'bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100',
  };

  const TrendIcon = trend === 'up' ? ArrowUp : trend === 'down' ? ArrowDown : Minus;
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500';

  return (
    <div className={cn('inline-flex flex-col gap-1 px-3 py-2 rounded-lg', variantClasses[variant], sizeClasses[size], className)}>
      <div className="text-xs font-medium opacity-70 uppercase tracking-wide">{label}</div>
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold">{value}</span>
        {trend && (
          <div className={cn('flex items-center gap-0.5', trendColor)}>
            <TrendIcon className="w-4 h-4" />
            {trendValue && <span className="text-xs font-medium">{trendValue}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

interface StatGridProps {
  children: ReactNode;
  columns?: 2 | 3 | 4 | 5;
  className?: string;
}

export function StatGrid({ children, columns = 4, className }: StatGridProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-5',
  };

  return <div className={cn('grid gap-4', gridCols[columns], className)}>{children}</div>;
}
