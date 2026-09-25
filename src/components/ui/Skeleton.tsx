import { cn } from '@/lib/utils';

// ─── Base shimmer block ───────────────────────────────────────────────────────

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-md bg-white/5 overflow-hidden relative',
        'before:absolute before:inset-0',
        'before:bg-gradient-to-r before:from-transparent before:via-white/[0.04] before:to-transparent',
        'before:translate-x-[-100%] before:animate-[shimmer_1.5s_infinite]',
        className
      )}
      aria-hidden="true"
    />
  );
}

// ─── Table row skeleton ───────────────────────────────────────────────────────

interface TableSkeletonProps {
  rows?: number;
  cols?: number;
  className?: string;
}

export function TableSkeleton({ rows = 5, cols = 8, className }: TableSkeletonProps) {
  return (
    <div className={cn('space-y-px', className)} aria-busy="true" aria-label="Loading data">
      {/* Header */}
      <div className="flex gap-3 px-4 py-2.5">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn(
              'h-3 rounded',
              i === 0 ? 'w-6' : i === 1 ? 'flex-1' : 'w-10'
            )}
          />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="flex items-center gap-3 px-4 py-3 border-t border-white/[0.04]"
        >
          <Skeleton className="w-5 h-3 rounded" />
          <Skeleton className="w-6 h-6 rounded-full shrink-0" />
          <Skeleton className="flex-1 h-3 rounded max-w-[160px]" />
          {Array.from({ length: cols - 3 }).map((_, colIdx) => (
            <Skeleton key={colIdx} className="w-8 h-3 rounded" />
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Card skeleton ────────────────────────────────────────────────────────────

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-xl border border-white/5 bg-surface p-4 space-y-3',
        className
      )}
      aria-busy="true"
    >
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-3 w-1/2" />
      <div className="pt-2 space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  );
}

// ─── Fixture card skeleton ────────────────────────────────────────────────────

export function FixtureCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-xl border border-white/5 bg-surface p-4',
        className
      )}
      aria-busy="true"
    >
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <Skeleton className="w-8 h-8 rounded-full shrink-0" />
          <Skeleton className="h-4 flex-1 max-w-[100px]" />
        </div>
        <Skeleton className="h-7 w-16 rounded-lg" />
        <div className="flex items-center gap-2 flex-1 justify-end">
          <Skeleton className="h-4 flex-1 max-w-[100px]" />
          <Skeleton className="w-8 h-8 rounded-full shrink-0" />
        </div>
      </div>
    </div>
  );
}

// ─── Stat card skeleton ───────────────────────────────────────────────────────

export function StatCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-xl border border-white/5 bg-surface p-4 space-y-3',
        className
      )}
      aria-busy="true"
    >
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-2 w-full rounded-full" />
    </div>
  );
}
