import { cn } from '@/lib/utils';
import { isLiveStatus, isFinishedStatus, isUpcomingStatus } from '@/lib/utils';

// ─── Generic Badge ────────────────────────────────────────────────────────────

export type BadgeVariant =
  | 'default'
  | 'live'
  | 'upcoming'
  | 'finished'
  | 'success'
  | 'warning'
  | 'danger'
  | 'muted'
  | 'outline';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  default: 'bg-white/10 text-white/70',
  live: 'bg-red-500/15 text-red-400 border border-red-500/25',
  upcoming: 'bg-white/8 text-white/50 border border-white/10',
  finished: 'bg-white/5 text-white/35 border border-white/8',
  success: 'bg-accent/10 text-accent border border-accent/20',
  warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  danger: 'bg-red-500/10 text-red-400 border border-red-500/20',
  muted: 'bg-white/5 text-white/30',
  outline: 'border border-white/15 text-white/50',
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium leading-none',
        VARIANT_STYLES[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

// ─── Live Pulse Dot ───────────────────────────────────────────────────────────

export function LiveDot({ className }: { className?: string }) {
  return (
    <span className={cn('relative inline-flex w-2 h-2', className)}>
      <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" />
      <span className="relative rounded-full w-2 h-2 bg-red-500" />
    </span>
  );
}

// ─── Fixture Status Badge ─────────────────────────────────────────────────────

interface StatusBadgeProps {
  short: string;
  elapsed?: number | null;
  className?: string;
}

export function StatusBadge({ short, elapsed, className }: StatusBadgeProps) {
  if (isLiveStatus(short)) {
    return (
      <Badge variant="live" className={cn('gap-1.5', className)}>
        <LiveDot />
        {short === 'HT' ? 'HT' : elapsed != null ? `${elapsed}'` : 'LIVE'}
      </Badge>
    );
  }

  if (isFinishedStatus(short)) {
    return (
      <Badge variant="finished" className={className}>
        {short}
      </Badge>
    );
  }

  if (isUpcomingStatus(short)) {
    return (
      <Badge variant="upcoming" className={className}>
        {short === 'PST' ? 'PPD' : 'NS'}
      </Badge>
    );
  }

  return (
    <Badge variant="muted" className={className}>
      {short}
    </Badge>
  );
}
