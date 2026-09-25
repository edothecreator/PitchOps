import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  as?: 'div' | 'article' | 'section';
}

export function Card({
  children,
  className,
  hover = false,
  as: Tag = 'div',
}: CardProps) {
  return (
    <Tag
      className={cn(
        'rounded-xl border border-white/5 bg-surface',
        hover &&
          'transition-colors duration-150 hover:border-white/10 cursor-pointer',
        className
      )}
    >
      {children}
    </Tag>
  );
}

// ─── Card sub-components ──────────────────────────────────────────────────────

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export function CardHeader({ children, className, action }: CardHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between px-4 py-3 border-b border-white/5',
        className
      )}
    >
      <div className="flex items-center gap-2 min-w-0">{children}</div>
      {action && <div className="shrink-0 ml-3">{action}</div>}
    </div>
  );
}

export function CardTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        'text-[13px] font-semibold text-white/80 leading-none truncate',
        className
      )}
    >
      {children}
    </h2>
  );
}

export function CardBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn('p-4', className)}>{children}</div>;
}

// ─── Stat tile ────────────────────────────────────────────────────────────────

interface StatTileProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
  className?: string;
}

export function StatTile({ label, value, sub, accent, className }: StatTileProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-1 p-4 rounded-xl border border-white/5 bg-surface',
        className
      )}
    >
      <span className="text-[11px] font-medium text-white/35 uppercase tracking-wider">
        {label}
      </span>
      <span
        className={cn(
          'text-2xl font-bold tabular-nums leading-none',
          accent ? 'text-accent' : 'text-white'
        )}
      >
        {value}
      </span>
      {sub && (
        <span className="text-[11px] text-white/30 leading-none">{sub}</span>
      )}
    </div>
  );
}
