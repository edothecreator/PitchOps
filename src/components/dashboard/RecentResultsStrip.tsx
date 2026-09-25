'use client';

import Link from 'next/link';
import { useFixtures } from '@/hooks/useFixtures';
import { cn } from '@/lib/utils';
import { formatShortDate } from '@/lib/utils';
import { TeamLogo, FixtureCardSkeleton, ErrorState } from '@/components/ui';
import { LEAGUES } from '@/lib/constants';

export function RecentResultsStrip() {
  // Free plan doesn't support ?last= — use a date range for the current season instead
  const to = new Date().toISOString().split('T')[0];
  const from = '2024-08-01'; // La Liga 2024/25 season start

  const { data, isLoading, isError, refetch } = useFixtures({
    league: LEAGUES.LA_LIGA.id,
    season: 2024,
    from,
    to,
  });

  const fixtures = (data?.fixtures ?? [])
    .filter((f) => f.date)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8);

  if (isError) return <ErrorState message="Could not load recent results." onRetry={() => void refetch()} className="py-6" />;

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
      {isLoading
        ? Array.from({ length: 5 }).map((_, i) => <FixtureCardSkeleton key={i} className="min-w-[200px]" />)
        : fixtures.map((f) => {
            const { teams, goals } = f;
            const homeWon = teams.home.winner === true;
            const awayWon = teams.away.winner === true;

            return (
              <Link
                key={f.id}
                href="/matches"
                className="flex flex-col gap-2.5 p-3.5 rounded-xl border border-white/5 bg-surface min-w-[180px] max-w-[200px] hover:border-white/10 transition-colors duration-150 shrink-0"
              >
                {/* League + date */}
                <div className="flex items-center justify-between">
                  <TeamLogo src={f.league.logo} alt={f.league.name} size={12} />
                  <span className="text-[10px] tabular-nums text-white/25">{formatShortDate(f.date)}</span>
                </div>

                {/* Home */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0 flex-1">
                    <TeamLogo src={teams.home.logo} alt={teams.home.name} size={16} />
                    <span className={cn('text-[12px] truncate', homeWon ? 'text-white font-semibold' : 'text-white/50')}>
                      {teams.home.shortName ?? teams.home.name}
                    </span>
                  </div>
                  <span className={cn('text-[14px] font-bold tabular-nums shrink-0', homeWon ? 'text-white' : 'text-white/40')}>
                    {goals.home ?? '–'}
                  </span>
                </div>

                {/* Away */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0 flex-1">
                    <TeamLogo src={teams.away.logo} alt={teams.away.name} size={16} />
                    <span className={cn('text-[12px] truncate', awayWon ? 'text-white font-semibold' : 'text-white/50')}>
                      {teams.away.shortName ?? teams.away.name}
                    </span>
                  </div>
                  <span className={cn('text-[14px] font-bold tabular-nums shrink-0', awayWon ? 'text-white' : 'text-white/40')}>
                    {goals.away ?? '–'}
                  </span>
                </div>
              </Link>
            );
          })}
    </div>
  );
}
