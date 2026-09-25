'use client';

import { useFixtureEvents } from '@/hooks/useFixtureDetail';
import { cn } from '@/lib/utils';
import { Skeleton, ErrorState, EmptyState } from '@/components/ui';
import type { FixtureEvent } from '@/lib/api/types';

const EVENT_ICONS: Record<string, string> = {
  'Normal Goal': '⚽',
  'Own Goal':    '⚽',
  'Penalty':     '⚽',
  'Yellow Card': '🟨',
  'Red Card':    '🟥',
  'Second Yellow card': '🟨',
  'Substitution 1': '🔄',
  'Substitution 2': '🔄',
  'Substitution 3': '🔄',
  'Substitution 4': '🔄',
  'Substitution 5': '🔄',
};

function EventRow({ event, homeTeamId }: { event: FixtureEvent; homeTeamId: number }) {
  const isHome = event.team.id === homeTeamId;
  const icon = EVENT_ICONS[event.detail] ?? '•';
  const isCard = event.type === 'Card';
  const isGoal = event.type === 'Goal';
  const isSub  = event.type === 'subst';

  return (
    <div className={cn('flex items-center gap-3 py-2 px-4 border-t border-white/[0.04]', isHome ? 'flex-row' : 'flex-row-reverse')}>
      {/* Time */}
      <span className="w-8 text-center text-[11px] tabular-nums text-white/30 shrink-0">
        {event.time.elapsed}{event.time.extra ? `+${event.time.extra}` : ''}'
      </span>

      {/* Icon */}
      <span className="text-base shrink-0">{icon}</span>

      {/* Description */}
      <div className={cn('flex-1 min-w-0', !isHome && 'text-right')}>
        <p className={cn(
          'text-[13px] font-medium leading-none truncate',
          isGoal ? 'text-white' : isCard ? 'text-amber-400' : 'text-white/55'
        )}>
          {event.player.name}
        </p>
        {event.assist.name && isGoal && (
          <p className="text-[11px] text-white/30 mt-0.5">
            Assist: {event.assist.name}
          </p>
        )}
        {isSub && (
          <p className="text-[11px] text-white/30 mt-0.5">
            {isHome ? `↑ ${event.assist.name ?? ''}` : `↑ ${event.assist.name ?? ''}`}
          </p>
        )}
        <p className="text-[10px] text-white/20 mt-0.5">{event.team.name}</p>
      </div>
    </div>
  );
}

interface MatchEventsProps {
  fixtureId: number;
  homeTeamId: number;
}

export function MatchEvents({ fixtureId, homeTeamId }: MatchEventsProps) {
  const { data, isLoading, isError, refetch } = useFixtureEvents(fixtureId);
  const events = data?.events ?? [];

  if (isLoading) return (
    <div className="space-y-2 p-4">
      {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-10 w-full rounded-lg" />)}
    </div>
  );
  if (isError) return <ErrorState message="Could not load match events." onRetry={() => void refetch()} />;
  if (!events.length) return <EmptyState message="No events recorded for this match." />;

  return (
    <div>
      {events.map((e, i) => (
        <EventRow key={i} event={e} homeTeamId={homeTeamId} />
      ))}
    </div>
  );
}
