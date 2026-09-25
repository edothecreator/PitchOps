'use client';

import { useFixtureLineups } from '@/hooks/useFixtureDetail';
import { cn } from '@/lib/utils';
import { Skeleton, ErrorState, EmptyState, TeamLogo } from '@/components/ui';
import type { FixtureLineup } from '@/lib/api/types';

const POS_COLORS: Record<string, string> = {
  G: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  D: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  M: 'bg-green-500/20 text-green-400 border-green-500/30',
  F: 'bg-red-500/20 text-red-400 border-red-500/30',
};

function TeamLineup({ lineup, side }: { lineup: FixtureLineup; side: 'home' | 'away' }) {
  const isAway = side === 'away';

  return (
    <div className={cn('flex-1 min-w-0', isAway && 'text-right')}>
      {/* Team header */}
      <div className={cn('flex items-center gap-2 mb-3', isAway && 'flex-row-reverse')}>
        <TeamLogo src={lineup.team.logo} alt={lineup.team.name} size={24} />
        <div className={isAway ? 'text-right' : ''}>
          <p className="text-[13px] font-semibold text-white/85">{lineup.team.name}</p>
          <p className="text-[11px] text-white/35">{lineup.formation} · {lineup.coach.name}</p>
        </div>
      </div>

      {/* Starting XI */}
      <p className="text-[10px] font-semibold text-white/25 uppercase tracking-wider mb-1.5">Starting XI</p>
      <div className="space-y-1">
        {lineup.startXI.map(({ player }) => (
          <div key={player.id} className={cn('flex items-center gap-2', isAway && 'flex-row-reverse')}>
            <span className={cn(
              'inline-flex items-center justify-center w-5 h-5 rounded text-[9px] font-bold border',
              POS_COLORS[player.pos] ?? 'bg-white/10 text-white/50 border-white/10'
            )}>
              {player.pos}
            </span>
            <span className="text-[11px] text-white/25 tabular-nums w-4 shrink-0">{player.number}</span>
            <span className="text-[12px] text-white/70 truncate">{player.name}</span>
          </div>
        ))}
      </div>

      {/* Substitutes */}
      {lineup.substitutes.length > 0 && (
        <>
          <p className="text-[10px] font-semibold text-white/25 uppercase tracking-wider mt-3 mb-1.5">Substitutes</p>
          <div className="space-y-1">
            {lineup.substitutes.map(({ player }) => (
              <div key={player.id} className={cn('flex items-center gap-2', isAway && 'flex-row-reverse')}>
                <span className={cn(
                  'inline-flex items-center justify-center w-5 h-5 rounded text-[9px] font-bold border opacity-50',
                  POS_COLORS[player.pos] ?? 'bg-white/10 text-white/50 border-white/10'
                )}>
                  {player.pos}
                </span>
                <span className="text-[11px] text-white/20 tabular-nums w-4 shrink-0">{player.number}</span>
                <span className="text-[12px] text-white/40 truncate">{player.name}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

interface MatchLineupsProps { fixtureId: number }

export function MatchLineups({ fixtureId }: MatchLineupsProps) {
  const { data, isLoading, isError, refetch } = useFixtureLineups(fixtureId);

  if (isLoading) return (
    <div className="p-4 grid grid-cols-2 gap-6">
      {[0, 1].map((i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-6 w-24" />
          {Array.from({ length: 11 }).map((_, j) => <Skeleton key={j} className="h-5 w-full" />)}
        </div>
      ))}
    </div>
  );
  if (isError) return <ErrorState message="Could not load lineups." onRetry={() => void refetch()} />;
  if (!data?.lineups.length) return <EmptyState message="Lineups not available for this match." />;

  const [home, away] = data.lineups;

  return (
    <div className="p-4 grid grid-cols-2 gap-6 divide-x divide-white/[0.04]">
      {home && <TeamLineup lineup={home} side="home" />}
      {away && <TeamLineup lineup={away} side="away" />}
    </div>
  );
}
