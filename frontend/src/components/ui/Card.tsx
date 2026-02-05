import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'bordered' | 'elevated';
  onClick?: () => void;
}

export function Card({ children, className, variant = 'default', onClick }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg bg-white dark:bg-gray-800',
        {
          'border border-gray-200 dark:border-gray-700': variant === 'bordered',
          'shadow-lg': variant === 'elevated',
          'shadow-sm border border-gray-100 dark:border-gray-800': variant === 'default',
        },
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}

export function CardHeader({ children, className, action }: CardHeaderProps) {
  return (
    <div className={cn('px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between', className)}>
      <div className="font-semibold text-lg text-gray-900 dark:text-white">{children}</div>
      {action && <div>{action}</div>}
    </div>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={cn('px-6 py-4', className)}>{children}</div>;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn('px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900', className)}>
      {children}
    </div>
  );
}
