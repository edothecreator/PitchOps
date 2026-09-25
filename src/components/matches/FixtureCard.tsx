'use client';

import { cn } from '@/lib/utils';
import { formatKickoffTime, formatShortDate, isLiveStatus, isFinishedStatus } from '@/lib/utils';
import { StatusBadge, TeamLogo, Badge } from '@/components/ui';
import type { Fixture } from '@/lib/api/types';

interface FixtureCardProps {
  fixture: Fixture;
  onSelect?: (fixture: Fixture) => void;
  selected?: boolean;
  className?: string;
}

export function FixtureCard({
  fixture,
  onSelect,
  selected,
  className,
}: FixtureCardProps) {
  const { teams, goals, status, league, date } = fixture;
  const live = isLiveStatus(status.short);
  const finished = isFinishedStatus(status.short);
  const scoreAvailable = goals.home !== null && goals.away !== null;

  return (
    <article
      role={onSelect ? 'button' : 'article'}
      tabIndex={onSelect ? 0 : undefined}
      onClick={() => onSelect?.(fixture)}
      onKeyDown={(e) => {
        if (onSelect && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onSelect(fixture);
        }
      }}
      className={cn(
        'rounded-xl border bg-surface transition-colors duration-150',
        onSelect && 'cursor-pointer',
        selected
          ? 'border-accent/30 bg-accent/[0.04]'
          : live
          ? 'border-red-500/20 hover:border-red-500/30'
          : 'border-white/5 hover:border-white/10',
        className
      )}
    >
      {/* League + date row */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.04]">
        <div className="flex items-center gap-1.5 min-w-0">
          <TeamLogo src={league.logo} alt={league.name} size={14} />
          <span className="text-[11px] text-white/30 truncate">{league.name}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] tabular-nums text-white/25">
            {formatShortDate(date)}
          </span>
          <StatusBadge short={status.short} elapsed={status.elapsed} />
        </div>
      </div>

      {/* Teams + score */}
      <div className="px-4 py-4 flex items-center gap-4">
        {/* Home team */}
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <TeamLogo src={teams.home.logo} alt={teams.home.name} size={28} />
          <div className="min-w-0">
            <p
              className={cn(
                'text-[14px] font-semibold truncate leading-tight',
                finished && teams.home.winner === true
                  ? 'text-white'
                  : finished && teams.home.winner === false
                  ? 'text-white/45'
                  : 'text-white/80'
              )}
            >
              {teams.home.name}
            </p>
            <p className="text-[11px] text-white/25">Home</p>
          </div>
        </div>

        {/* Score / time */}
        <div className="flex flex-col items-center shrink-0 min-w-[72px]">
          {scoreAvailable ? (
            <div className="flex items-center gap-2.5">
              <span
                className={cn(
                  'text-[22px] font-bold tabular-nums leading-none',
                  finished && teams.home.winner === true ? 'text-white' : 'text-white/55'
                )}
              >
                {goals.home}
              </span>
              <span className="text-[14px] text-white/20 font-light">–</span>
              <span
                className={cn(
                  'text-[22px] font-bold tabular-nums leading-none',
                  finished && teams.away.winner === true ? 'text-white' : 'text-white/55'
                )}
              >
                {goals.away}
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[16px] font-semibold tabular-nums text-white/50">
                {formatKickoffTime(date)}
              </span>
              <span className="text-[10px] text-white/25 uppercase tracking-wider">
                KO
              </span>
            </div>
          )}

          {/* Halftime score for finished */}
          {finished && fixture.score.halftime.home !== null && (
            <span className="mt-1 text-[10px] tabular-nums text-white/20">
              HT {fixture.score.halftime.home}–{fixture.score.halftime.away}
            </span>
          )}
        </div>

        {/* Away team */}
        <div className="flex items-center gap-2.5 flex-1 min-w-0 flex-row-reverse">
          <TeamLogo src={teams.away.logo} alt={teams.away.name} size={28} />
          <div className="min-w-0 text-right">
            <p
              className={cn(
                'text-[14px] font-semibold truncate leading-tight',
                finished && teams.away.winner === true
                  ? 'text-white'
                  : finished && teams.away.winner === false
                  ? 'text-white/45'
                  : 'text-white/80'
              )}
            >
              {teams.away.name}
            </p>
            <p className="text-[11px] text-white/25">Away</p>
          </div>
        </div>
      </div>

      {/* Venue */}
      {fixture.venue.name && (
        <div className="px-4 pb-3">
          <p className="text-[11px] text-white/20 truncate">
            {fixture.venue.name}, {fixture.venue.city}
          </p>
        </div>
      )}
    </article>
  );
}
