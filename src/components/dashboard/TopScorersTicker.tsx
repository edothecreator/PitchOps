'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useTopScorers } from '@/hooks';
import { cn } from '@/lib/utils';
import {
  Card,
  CardHeader,
  CardTitle,
  TeamLogo,
  Skeleton,
  ErrorState,
} from '@/components/ui';
import { DEFAULT_SEASON } from '@/lib/constants';

interface TopScorersTickerProps {
  leagueId: number;
  season?: number;
  limit?: number;
  title?: string;
}

export function TopScorersTicker({
  leagueId,
  season = DEFAULT_SEASON,
  limit = 5,
  title = 'Top Scorers',
}: TopScorersTickerProps) {
  const { data, isLoading, isError, refetch } = useTopScorers(leagueId, season, { limit });
  const scorers = data?.scorers ?? [];

  return (
    <Card>
      <CardHeader
        action={
          <Link
            href="/statistics"
            className="flex items-center gap-1 text-[11px] text-white/35 hover:text-accent transition-colors duration-150"
          >
            Full list
            <ArrowRight className="w-3 h-3" />
          </Link>
        }
      >
        {data?.league.logo && (
          <TeamLogo src={data.league.logo} alt={data.league.name} size={16} />
        )}
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      {/* Column headers */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-white/[0.04]">
        <span className="w-5 shrink-0" />
        <span className="flex-1 text-[10px] font-semibold text-white/20 uppercase tracking-wider">
          Player
        </span>
        <span className="w-10 text-center text-[10px] font-semibold text-white/20 uppercase tracking-wider shrink-0">
          Apps
        </span>
        <span className="w-10 text-center text-[10px] font-semibold text-white/20 uppercase tracking-wider shrink-0">
          Ast
        </span>
        <span className="w-8 text-right text-[10px] font-semibold text-white/20 uppercase tracking-wider shrink-0">
          Gls
        </span>
      </div>

      {isLoading ? (
        <div className="divide-y divide-white/[0.04]">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <Skeleton className="w-5 h-3 shrink-0" />
              <Skeleton className="w-7 h-7 rounded-full shrink-0" />
              <Skeleton className="flex-1 h-3" />
              <Skeleton className="w-8 h-3 shrink-0" />
              <Skeleton className="w-8 h-3 shrink-0" />
              <Skeleton className="w-6 h-4 shrink-0" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <ErrorState
          message="Could not load top scorers."
          onRetry={() => void refetch()}
          className="py-6"
        />
      ) : (
        <div className="divide-y divide-white/[0.04]">
          {scorers.map((entry, idx) => {
            const stats = entry.statistics[0];
            const goals = stats?.goals.total ?? 0;
            const assists = stats?.goals.assists ?? 0;
            const apps = stats?.games.appearences ?? 0;

            return (
              <div
                key={entry.player.id}
                className="flex items-center gap-3 px-4 py-2.5"
              >
                {/* Rank */}
                <span className="w-5 text-right text-[12px] tabular-nums text-white/25 shrink-0">
                  {idx + 1}
                </span>

                {/* Player photo */}
                <div className="w-7 h-7 rounded-full bg-white/5 overflow-hidden shrink-0 border border-white/8">
                  <img
                    src={entry.player.photo}
                    alt={entry.player.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.player.name)}&background=1f2937&color=ffffff&size=28`;
                    }}
                  />
                </div>

                {/* Name + team */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-white/80 truncate leading-none">
                    {entry.player.name}
                  </p>
                  {stats?.team && (
                    <p className="text-[11px] text-white/30 truncate leading-none mt-0.5">
                      {stats.team.name}
                    </p>
                  )}
                </div>

                {/* Apps */}
                <span className="w-10 text-center text-[12px] tabular-nums text-white/35 shrink-0">
                  {apps}
                </span>

                {/* Assists */}
                <span className="w-10 text-center text-[12px] tabular-nums text-white/50 shrink-0">
                  {assists}
                </span>

                {/* Goals */}
                <span
                  className={cn(
                    'w-8 text-right text-[14px] font-bold tabular-nums shrink-0',
                    idx === 0 ? 'text-accent' : 'text-white'
                  )}
                >
                  {goals}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
