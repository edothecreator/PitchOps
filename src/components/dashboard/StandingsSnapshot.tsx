'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useStandings } from '@/hooks';
import { cn } from '@/lib/utils';
import {
  Card,
  CardHeader,
  CardTitle,
  TeamLogo,
  TableSkeleton,
  ErrorState,
} from '@/components/ui';
import type { StandingRow, QualificationZone } from '@/lib/api/types';
import { DEFAULT_SEASON } from '@/lib/constants';

// Zone color mapping — left-border accent
const ZONE_BORDER: Record<NonNullable<QualificationZone>, string> = {
  ucl: 'border-l-2 border-l-zone-ucl',
  'ucl-qualifier': 'border-l-2 border-l-blue-400',
  uel: 'border-l-2 border-l-zone-uel',
  uecl: 'border-l-2 border-l-zone-uecl',
  'relegation-playoff': 'border-l-2 border-l-zone-relegation/50',
  relegation: 'border-l-2 border-l-zone-relegation',
};

function SnapshotRow({ row }: { row: StandingRow }) {
  const borderClass = row.zone ? ZONE_BORDER[row.zone] : 'border-l-2 border-l-transparent';

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-2.5 border-t border-white/[0.04]',
        'first:border-t-0',
        borderClass
      )}
    >
      {/* Rank */}
      <span className="w-5 text-right text-[12px] tabular-nums text-white/30 shrink-0">
        {row.rank}
      </span>

      {/* Team */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <TeamLogo src={row.team.logo} alt={row.team.name} size={18} />
        <span className="text-[13px] text-white/80 truncate font-medium">
          {row.team.name}
        </span>
      </div>

      {/* P / GD / Pts */}
      <div className="flex items-center gap-4 shrink-0">
        <span className="w-6 text-center text-[12px] tabular-nums text-white/35">
          {row.all.played}
        </span>
        <span
          className={cn(
            'w-6 text-center text-[12px] tabular-nums',
            row.goalsDiff > 0
              ? 'text-accent'
              : row.goalsDiff < 0
              ? 'text-red-400'
              : 'text-white/35'
          )}
        >
          {row.goalsDiff > 0 ? `+${row.goalsDiff}` : row.goalsDiff}
        </span>
        <span className="w-7 text-right text-[13px] font-bold tabular-nums text-white">
          {row.points}
        </span>
      </div>
    </div>
  );
}

interface StandingsSnapshotProps {
  leagueId: number;
  season?: number;
  rows?: number;
  title: string;
  leagueLogo?: string;
}

export function StandingsSnapshot({
  leagueId,
  season = DEFAULT_SEASON,
  rows = 4,
  title,
  leagueLogo,
}: StandingsSnapshotProps) {
  const { data, isLoading, isError, refetch } = useStandings(leagueId, season);
  const table = data?.standings?.[0]?.slice(0, rows) ?? [];

  return (
    <Card className="flex flex-col">
      <CardHeader
        action={
          <Link
            href="/standings"
            className="flex items-center gap-1 text-[11px] text-white/35 hover:text-accent transition-colors duration-150"
          >
            Full table
            <ArrowRight className="w-3 h-3" />
          </Link>
        }
      >
        {leagueLogo && (
          <TeamLogo src={leagueLogo} alt={title} size={16} />
        )}
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      {/* Column headers */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-white/[0.04]">
        <span className="w-5 text-right text-[10px] font-semibold text-white/20 uppercase tracking-wider shrink-0">
          #
        </span>
        <span className="flex-1 text-[10px] font-semibold text-white/20 uppercase tracking-wider">
          Club
        </span>
        <div className="flex items-center gap-4 shrink-0">
          <span className="w-6 text-center text-[10px] font-semibold text-white/20 uppercase tracking-wider">
            P
          </span>
          <span className="w-6 text-center text-[10px] font-semibold text-white/20 uppercase tracking-wider">
            GD
          </span>
          <span className="w-7 text-right text-[10px] font-semibold text-white/20 uppercase tracking-wider">
            Pts
          </span>
        </div>
      </div>

      {/* Rows */}
      {isLoading ? (
        <TableSkeleton rows={rows} cols={5} />
      ) : isError ? (
        <ErrorState
          message="Could not load standings."
          onRetry={() => void refetch()}
          className="py-6"
        />
      ) : (
        <div>
          {table.map((row) => (
            <SnapshotRow key={row.team.id} row={row} />
          ))}
        </div>
      )}
    </Card>
  );
}
