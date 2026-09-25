'use client';

import { useTopScorers, useTopAssists, useTopYellowCards } from '@/hooks';
import { cn } from '@/lib/utils';
import {
  TeamLogo,
  Skeleton,
  ErrorState,
  EmptyState,
} from '@/components/ui';
import { DEFAULT_SEASON } from '@/lib/constants';
import { Medal } from 'lucide-react';

interface TopScorersTableProps {
  leagueId: number;
  season?: number;
  limit?: number;
  mode?: 'goals' | 'assists' | 'cards';
}

export function TopScorersTable({
  leagueId,
  season = DEFAULT_SEASON,
  limit = 20,
  mode = 'goals',
}: TopScorersTableProps) {
  const scorersQ    = useTopScorers(leagueId, season, { limit });
  const assistsQ    = useTopAssists(leagueId, season);
  const yellowCardsQ = useTopYellowCards(leagueId, season);

  const activeQ = mode === 'assists' ? assistsQ : mode === 'cards' ? yellowCardsQ : scorersQ;
  const { data, isLoading, isError, refetch } = activeQ;
  const scorers = data?.scorers ?? [];

  const MEDAL_COLORS = ['text-yellow-400', 'text-slate-400', 'text-amber-600'];

  if (isLoading) {
    return (
      <div className="space-y-px">
        {/* Header */}
        <div className="grid grid-cols-[2rem_1fr_6rem_5rem_5rem_5rem_5rem] gap-2 px-4 py-2.5">
          {['#', 'Player', 'Club', 'Apps', 'Ast', 'Shots', 'Goals'].map((h) => (
            <Skeleton key={h} className="h-3 rounded" />
          ))}
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3 border-t border-white/[0.04]">
            <Skeleton className="w-6 h-3 shrink-0" />
            <Skeleton className="w-8 h-8 rounded-full shrink-0" />
            <Skeleton className="flex-1 h-3 max-w-[140px]" />
            <Skeleton className="w-20 h-3 shrink-0" />
            <Skeleton className="w-12 h-3 shrink-0" />
            <Skeleton className="w-12 h-3 shrink-0" />
            <Skeleton className="w-12 h-3 shrink-0" />
            <Skeleton className="w-10 h-5 shrink-0" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        message="Could not load top scorers."
        onRetry={() => void refetch()}
        className="py-16"
      />
    );
  }

  if (scorers.length === 0) {
    return <EmptyState message="No scorer data available." />;
  }

  const maxGoals = scorers[0]?.statistics[0]?.goals.total ?? 1;

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse">
        <thead>
          <tr className="border-b border-white/8">
            <th className="px-4 py-2.5 w-10 text-left">
              <span className="text-[10px] font-semibold text-white/20 uppercase tracking-wider">#</span>
            </th>
            <th className="px-2 py-2.5 text-left">
              <span className="text-[10px] font-semibold text-white/20 uppercase tracking-wider">Player</span>
            </th>
            <th className="px-2 py-2.5 text-left hidden md:table-cell">
              <span className="text-[10px] font-semibold text-white/20 uppercase tracking-wider">Club</span>
            </th>
            <th className="px-2 py-2.5 text-center">
              <span className="text-[10px] font-semibold text-white/20 uppercase tracking-wider">Apps</span>
            </th>
            <th className="px-2 py-2.5 text-center hidden sm:table-cell">
              <span className="text-[10px] font-semibold text-white/20 uppercase tracking-wider">Ast</span>
            </th>
            <th className="px-2 py-2.5 text-center hidden sm:table-cell">
              <span className="text-[10px] font-semibold text-white/20 uppercase tracking-wider">Shots</span>
            </th>
            <th className="px-4 py-2.5 text-right">
              <span className="text-[10px] font-semibold text-white/20 uppercase tracking-wider">Goals</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {scorers.map((entry, idx) => {
            const stats = entry.statistics[0];
            const goals = stats?.goals.total ?? 0;
            const assists = stats?.goals.assists ?? 0;
            const apps = stats?.games.appearences ?? 0;
            const shots = stats?.shots.total ?? 0;
            const barWidth = maxGoals > 0 ? (goals / maxGoals) * 100 : 0;

            return (
              <tr
                key={entry.player.id}
                className="border-t border-white/[0.04] hover:bg-white/[0.02] transition-colors duration-100"
              >
                {/* Rank */}
                <td className="px-4 py-3 w-10">
                  {idx < 3 ? (
                    <Medal
                      className={cn('w-4 h-4', MEDAL_COLORS[idx] ?? 'text-white/20')}
                      strokeWidth={2}
                    />
                  ) : (
                    <span className="text-[12px] tabular-nums text-white/25">
                      {idx + 1}
                    </span>
                  )}
                </td>

                {/* Player */}
                <td className="px-2 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-white/5 overflow-hidden shrink-0 border border-white/8">
                      <img
                        src={entry.player.photo}
                        alt={entry.player.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.player.name)}&background=1f2937&color=ffffff&size=32`;
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-white/85 truncate leading-none">
                        {entry.player.name}
                      </p>
                      <p className="text-[11px] text-white/30 truncate mt-0.5 md:hidden">
                        {stats?.team.name}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Club */}
                <td className="px-2 py-3 hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    {stats?.team.logo && (
                      <TeamLogo src={stats.team.logo} alt={stats.team.name} size={18} />
                    )}
                    <span className="text-[12px] text-white/50 truncate max-w-[120px]">
                      {stats?.team.name}
                    </span>
                  </div>
                </td>

                {/* Apps */}
                <td className="px-2 py-3 text-center">
                  <span className="text-[12px] tabular-nums text-white/40">{apps}</span>
                </td>

                {/* Assists */}
                <td className="px-2 py-3 text-center hidden sm:table-cell">
                  <span className="text-[12px] tabular-nums text-white/50">{assists}</span>
                </td>

                {/* Shots */}
                <td className="px-2 py-3 text-center hidden sm:table-cell">
                  <span className="text-[12px] tabular-nums text-white/35">{shots}</span>
                </td>

                {/* Goals + bar */}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    {/* Mini bar */}
                    <div className="hidden sm:flex flex-1 max-w-[80px] h-1 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-500',
                          idx === 0 ? 'bg-accent' : 'bg-accent/50'
                        )}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                    <span
                      className={cn(
                        'text-[16px] font-bold tabular-nums shrink-0',
                        idx === 0
                          ? 'text-accent'
                          : idx < 3
                          ? 'text-white'
                          : 'text-white/70'
                      )}
                    >
                      {goals}
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
