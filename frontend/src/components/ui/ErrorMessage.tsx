import { AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorMessage({ message, onRetry, className }: ErrorMessageProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 gap-4', className)}>
      <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
        <AlertCircle className="w-8 h-8" />
        <p className="text-lg font-semibold">Error</p>
      </div>
      <p className="text-gray-700 dark:text-gray-300 text-center max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-basketball-orange text-white rounded-lg hover:bg-opacity-90 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      )}
    </div>
  );
}
