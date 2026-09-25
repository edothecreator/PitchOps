'use client';

import { useTeamStats } from '@/hooks';
import { cn } from '@/lib/utils';
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  StatTile,
  TeamLogo,
  FormGuide,
  ProgressBar,
  Skeleton,
  ErrorState,
} from '@/components/ui';
import { DEFAULT_SEASON } from '@/lib/constants';

interface TeamStatsCardProps {
  teamId: number;
  leagueId: number;
  season?: number;
  className?: string;
}

export function TeamStatsCard({
  teamId,
  leagueId,
  season = DEFAULT_SEASON,
  className,
}: TeamStatsCardProps) {
  const { data, isLoading, isError, refetch } = useTeamStats(teamId, leagueId, season);

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="w-6 h-6 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
        </CardBody>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Card className={className}>
        <ErrorState
          message="Could not load team statistics."
          onRetry={() => void refetch()}
          className="py-8"
        />
      </Card>
    );
  }

  const { team, statistics: s } = data;
  const played = Number(s.fixtures.played.total) || 0;
  const wins = Number(s.fixtures.wins.total) || 0;
  const draws = Number(s.fixtures.draws.total) || 0;
  const losses = Number(s.fixtures.loses.total) || 0;
  const goalsFor = Number(s.goals.for.total.total) || 0;
  const goalsAgainst = Number(s.goals.against.total.total) || 0;
  const cleanSheets = Number(s.clean_sheet.total) || 0;
  const winPct = played > 0 ? Math.round((wins / played) * 100) : 0;

  const topFormation = s.lineups[0]?.formation ?? '—';

  // Goal timing chart data (0-90 buckets)
  const timingSlots = [
    '0-15', '16-30', '31-45', '46-60', '61-75', '76-90',
  ] as const;

  type TimingKey = typeof timingSlots[number];

  const forTiming = s.goals.for.minute as unknown as Record<string, { total: number | null }>;
  const maxTiming = Math.max(
    ...timingSlots.map((slot) => Number(forTiming[slot]?.total ?? 0))
  );

  return (
    <Card className={className}>
      <CardHeader>
        <TeamLogo src={team.logo} alt={team.name} size={24} />
        <CardTitle>{team.name}</CardTitle>
        <span className="ml-auto text-[11px] text-white/25">{s.league.name} · {s.league.season}</span>
      </CardHeader>

      <CardBody className="space-y-6">
        {/* Key stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatTile label="Played" value={played} />
          <StatTile label="Won" value={wins} accent />
          <StatTile label="Drawn" value={draws} />
          <StatTile label="Lost" value={losses} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatTile label="Goals For" value={goalsFor} accent />
          <StatTile label="Goals Agst" value={goalsAgainst} />
          <StatTile label="Clean Sheets" value={cleanSheets} />
          <StatTile
            label="Win Rate"
            value={`${winPct}%`}
            sub={`${wins}W ${draws}D ${losses}L`}
            accent
          />
        </div>

        {/* Win % bar */}
        <ProgressBar
          value={winPct}
          label="Win rate"
          showValues
          colorA="bg-accent"
        />

        {/* Form guide */}
        {s.form && (
          <div>
            <p className="text-[11px] font-semibold text-white/25 uppercase tracking-wider mb-2">
              Recent Form
            </p>
            <FormGuide form={s.form} limit={10} />
          </div>
        )}

        {/* Goal timing chart */}
        <div>
          <p className="text-[11px] font-semibold text-white/25 uppercase tracking-wider mb-3">
            Goals by Interval
          </p>
          <div className="flex items-end gap-2 h-16">
            {timingSlots.map((slot) => {
              const val = Number(forTiming[slot]?.total ?? 0);
              const height = maxTiming > 0 ? (val / maxTiming) * 100 : 0;
              return (
                <div key={slot} className="flex flex-col items-center gap-1 flex-1">
                  <span className="text-[10px] tabular-nums text-white/40">{val}</span>
                  <div
                    className="w-full rounded-t bg-accent/40 transition-all duration-500 min-h-[2px]"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-[9px] text-white/20 leading-none text-center">
                    {slot.split('-')[0]}'
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Preferred formations */}
        <div>
          <p className="text-[11px] font-semibold text-white/25 uppercase tracking-wider mb-2">
            Preferred Formation
          </p>
          <div className="flex flex-wrap gap-2">
            {s.lineups.slice(0, 3).map((l) => (
              <div
                key={l.formation}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[12px] font-medium',
                  l.formation === topFormation
                    ? 'border-accent/30 bg-accent/8 text-accent'
                    : 'border-white/8 bg-white/[0.03] text-white/45'
                )}
              >
                <span>{l.formation}</span>
                <span className="text-[11px] opacity-60 tabular-nums">
                  ×{l.played}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
