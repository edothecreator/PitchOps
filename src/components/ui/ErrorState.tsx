import { AlertTriangle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  message = 'Failed to load data. Please try again.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 py-12 px-6 text-center',
        className
      )}
      role="alert"
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500/10">
        <AlertTriangle className="w-5 h-5 text-red-400" />
      </div>
      <p className="text-[13px] text-white/40 max-w-xs">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium',
            'text-white/50 hover:text-white/80 hover:bg-white/5',
            'border border-white/8 hover:border-white/15',
            'transition-colors duration-150'
          )}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Try again
        </button>
      )}
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

interface EmptyStateProps {
  message?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  message = 'No data available.',
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 py-12 px-6 text-center',
        className
      )}
    >
      {icon && (
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 mb-1">
          {icon}
        </div>
      )}
      <p className="text-[13px] text-white/30">{message}</p>
    </div>
  );
}
