import { cn } from '@/lib/utils';
import { parseForm } from '@/lib/utils';

interface FormGuideProps {
  form: string;
  /** How many results to show (from most recent). Default 5. */
  limit?: number;
  className?: string;
}

const RESULT_STYLES = {
  W: 'bg-accent/15 text-accent',
  D: 'bg-white/10 text-white/50',
  L: 'bg-red-500/15 text-red-400',
} as const;

export function FormGuide({ form, limit = 5, className }: FormGuideProps) {
  const results = parseForm(form).slice(-limit);

  return (
    <div className={cn('flex items-center gap-0.5', className)} aria-label={`Form: ${form}`}>
      {results.map((result, i) => (
        <span
          key={i}
          className={cn(
            'inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold leading-none',
            RESULT_STYLES[result]
          )}
          title={result === 'W' ? 'Win' : result === 'D' ? 'Draw' : 'Loss'}
        >
          {result}
        </span>
      ))}
    </div>
  );
}
