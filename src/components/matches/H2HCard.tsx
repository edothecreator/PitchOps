'use client';

import { useH2H } from '@/hooks';
import { cn } from '@/lib/utils';
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  TeamLogo,
  Skeleton,
  ErrorState,
  ProgressBar,
} from '@/components/ui';
import { FixtureCard } from './FixtureCard';

interface H2HCardProps {
  fixtureId: number;
  className?: string;
}

export function H2HCard({ fixtureId, className }: H2HCardProps) {
  const { data, isLoading, isError, refetch } = useH2H(fixtureId);

  if (isLoading) {
    return (
      <Card className={cn('animate-pulse', className)}>
        <CardHeader>
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <Skeleton className="h-3 w-full" />
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
          message="Could not load head-to-head data."
          onRetry={() => void refetch()}
          className="py-8"
        />
      </Card>
    );
  }

  const { h2h } = data;
  const { teamA, teamB, totalMatches, recentFixtures } = h2h;
  const totalResults = teamA.wins + teamB.wins + teamA.draws;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Head-to-Head</CardTitle>
        <span className="text-[11px] text-white/30 ml-auto">
          {totalMatches} meetings
        </span>
      </CardHeader>

      <CardBody className="space-y-5">
        {/* Team logos + win counts */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col items-center gap-2 flex-1">
            <TeamLogo src={teamA.team.logo} alt={teamA.team.name} size={36} />
            <p className="text-[12px] text-white/50 truncate max-w-[80px] text-center">
              {teamA.team.name}
            </p>
            <p className="text-[22px] font-bold tabular-nums text-white">
              {teamA.wins}
            </p>
            <p className="text-[10px] text-white/25 uppercase tracking-wider">
              wins
            </p>
          </div>

          <div className="flex flex-col items-center gap-1">
            <p className="text-[14px] font-semibold text-white/50">{teamA.draws}</p>
            <p className="text-[10px] text-white/25 uppercase tracking-wider">
              draws
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 flex-1">
            <TeamLogo src={teamB.team.logo} alt={teamB.team.name} size={36} />
            <p className="text-[12px] text-white/50 truncate max-w-[80px] text-center">
              {teamB.team.name}
            </p>
            <p className="text-[22px] font-bold tabular-nums text-white">
              {teamB.wins}
            </p>
            <p className="text-[10px] text-white/25 uppercase tracking-wider">
              wins
            </p>
          </div>
        </div>

        {/* Win percentage bar */}
        {totalResults > 0 && (
          <ProgressBar
            value={teamA.wins}
            valueB={teamB.wins}
            colorA="bg-accent"
            colorB="bg-accent-blue"
            label={teamA.team.shortName ?? teamA.team.name}
            labelB={teamB.team.shortName ?? teamB.team.name}
          />
        )}

        {/* Goals comparison */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-white/[0.03] border border-white/5 p-3">
            <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">
              Goals scored
            </p>
            <div className="flex items-baseline justify-between">
              <span className="text-[18px] font-bold tabular-nums text-white">
                {teamA.goalsScored}
              </span>
              <span className="text-[14px] font-bold tabular-nums text-white/50">
                {teamB.goalsScored}
              </span>
            </div>
          </div>
          <div className="rounded-lg bg-white/[0.03] border border-white/5 p-3">
            <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">
              Avg per game
            </p>
            <div className="flex items-baseline justify-between">
              <span className="text-[18px] font-bold tabular-nums text-accent">
                {totalMatches > 0
                  ? ((teamA.goalsScored + teamB.goalsScored) / totalMatches).toFixed(1)
                  : '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Recent meetings */}
        {recentFixtures.length > 0 && (
          <div>
            <p className="text-[11px] font-semibold text-white/25 uppercase tracking-wider mb-3">
              Recent Meetings
            </p>
            <div className="space-y-2">
              {recentFixtures.slice(0, 3).map((f) => (
                <FixtureCard key={f.id} fixture={f} className="text-sm" />
              ))}
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
