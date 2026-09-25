'use client';

import { useFixtureStats } from '@/hooks/useFixtureDetail';
import { Skeleton, ErrorState, EmptyState, ProgressBar } from '@/components/ui';

const DISPLAY_STATS = [
  'Ball Possession',
  'Total Shots',
  'Shots on Goal',
  'Corner Kicks',
  'Passes %',
  'Fouls',
  'Yellow Cards',
  'Red Cards',
  'Offsides',
  'Goalkeeper Saves',
  'expected_goals',
];

const STAT_LABELS: Record<string, string> = {
  'Ball Possession':  'Possession',
  'Total Shots':      'Total Shots',
  'Shots on Goal':    'Shots on Target',
  'Corner Kicks':     'Corners',
  'Passes %':         'Pass Accuracy',
  'Fouls':            'Fouls',
  'Yellow Cards':     'Yellow Cards',
  'Red Cards':        'Red Cards',
  'Offsides':         'Offsides',
  'Goalkeeper Saves': 'GK Saves',
  'expected_goals':   'xG',
};

interface MatchStatsProps { fixtureId: number }

export function MatchStats({ fixtureId }: MatchStatsProps) {
  const { data, isLoading, isError, refetch } = useFixtureStats(fixtureId);

  if (isLoading) return (
    <div className="p-4 space-y-3">
      {Array.from({ length: 7 }).map((_, i) => <Skeleton key={i} className="h-8 w-full rounded" />)}
    </div>
  );
  if (isError) return <ErrorState message="Could not load match statistics." onRetry={() => void refetch()} />;
  if (!data?.teams.length) return <EmptyState message="No statistics available." />;

  const [home, away] = data.teams;

  function getStat(team: typeof home, type: string) {
    const entry = team.statistics.find((s) => s.type === type);
    if (!entry || entry.value === null) return 0;
    const raw = String(entry.value).replace('%', '');
    return Number(raw) || 0;
  }

  return (
    <div className="p-4 space-y-3">
      {DISPLAY_STATS.map((type) => {
        const hVal = getStat(home, type);
        const aVal = getStat(away, type);
        const label = STAT_LABELS[type] ?? type;
        return (
          <div key={type}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[13px] tabular-nums font-medium text-white/70">{hVal}{type.includes('%') || type === 'Ball Possession' ? '%' : ''}</span>
              <span className="text-[11px] text-white/35 uppercase tracking-wider">{label}</span>
              <span className="text-[13px] tabular-nums font-medium text-white/70">{aVal}{type.includes('%') || type === 'Ball Possession' ? '%' : ''}</span>
            </div>
            <ProgressBar value={hVal} valueB={aVal} colorA="bg-accent" colorB="bg-accent-blue" showValues={false} />
          </div>
        );
      })}
    </div>
  );
}
