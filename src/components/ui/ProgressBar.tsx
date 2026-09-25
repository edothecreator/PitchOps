import { cn } from '@/lib/utils';
import { clamp } from '@/lib/utils';

interface ProgressBarProps {
  /** Value 0–100 */
  value: number;
  /** Optional second value for split/comparison bars */
  valueB?: number;
  colorA?: string;
  colorB?: string;
  label?: string;
  labelB?: string;
  showValues?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  valueB,
  colorA = 'bg-accent',
  colorB = 'bg-accent-blue',
  label,
  labelB,
  showValues = true,
  className,
}: ProgressBarProps) {
  const pct = clamp(value, 0, 100);

  if (valueB !== undefined) {
    // Split comparison bar
    const total = value + valueB;
    const pctA = total > 0 ? (value / total) * 100 : 50;
    const pctB = 100 - pctA;

    return (
      <div className={cn('space-y-1.5', className)}>
        {(label || labelB) && (
          <div className="flex items-center justify-between text-[11px] text-white/40">
            <span>{label}</span>
            <span>{labelB}</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          {showValues && (
            <span className="w-8 text-right text-[11px] font-medium tabular-nums text-white/60">
              {value}
            </span>
          )}
          <div className="flex-1 flex h-1.5 rounded-full overflow-hidden bg-white/5">
            <div
              className={cn('h-full rounded-l-full transition-all duration-500', colorA)}
              style={{ width: `${pctA}%` }}
            />
            <div
              className={cn('h-full rounded-r-full transition-all duration-500', colorB)}
              style={{ width: `${pctB}%` }}
            />
          </div>
          {showValues && (
            <span className="w-8 text-left text-[11px] font-medium tabular-nums text-white/60">
              {valueB}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-1', className)}>
      {label && (
        <div className="flex items-center justify-between text-[11px] text-white/40">
          <span>{label}</span>
          {showValues && (
            <span className="tabular-nums text-white/60 font-medium">{pct}%</span>
          )}
        </div>
      )}
      <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500', colorA)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
