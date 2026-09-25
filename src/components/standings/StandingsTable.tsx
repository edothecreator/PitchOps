'use client';

import { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { useStandings } from '@/hooks';
import { cn } from '@/lib/utils';
import {
  TeamLogo,
  FormGuide,
  TableSkeleton,
  ErrorState,
} from '@/components/ui';
import type { StandingRow, QualificationZone } from '@/lib/api/types';
import { DEFAULT_SEASON } from '@/lib/constants';

// ─── Zone marker ──────────────────────────────────────────────────────────────

const ZONE_BORDER: Record<NonNullable<QualificationZone>, string> = {
  ucl: 'border-l-[3px] border-l-zone-ucl',
  'ucl-qualifier': 'border-l-[3px] border-l-blue-400',
  uel: 'border-l-[3px] border-l-zone-uel',
  uecl: 'border-l-[3px] border-l-zone-uecl',
  'relegation-playoff': 'border-l-[3px] border-l-zone-relegation/40',
  relegation: 'border-l-[3px] border-l-zone-relegation',
};

const ZONE_LABELS: Record<NonNullable<QualificationZone>, string> = {
  ucl: 'UEFA Champions League',
  'ucl-qualifier': 'UCL Qualifier',
  uel: 'UEFA Europa League',
  uecl: 'UEFA Conference League',
  'relegation-playoff': 'Relegation Play-off',
  relegation: 'Relegation',
};

// ─── Sort config ──────────────────────────────────────────────────────────────

type SortKey = 'rank' | 'played' | 'won' | 'drawn' | 'lost' | 'gf' | 'ga' | 'gd' | 'pts';
type SortDir = 'asc' | 'desc';

function sortRows(rows: StandingRow[], key: SortKey, dir: SortDir): StandingRow[] {
  return [...rows].sort((a, b) => {
    let diff = 0;
    switch (key) {
      case 'rank':    diff = a.rank - b.rank; break;
      case 'played':  diff = a.all.played - b.all.played; break;
      case 'won':     diff = a.all.win - b.all.win; break;
      case 'drawn':   diff = a.all.draw - b.all.draw; break;
      case 'lost':    diff = a.all.lose - b.all.lose; break;
      case 'gf':      diff = a.all.goals.for - b.all.goals.for; break;
      case 'ga':      diff = a.all.goals.against - b.all.goals.against; break;
      case 'gd':      diff = a.goalsDiff - b.goalsDiff; break;
      case 'pts':     diff = a.points - b.points; break;
    }
    return dir === 'asc' ? diff : -diff;
  });
}

// ─── Column header ────────────────────────────────────────────────────────────

interface ColHeaderProps {
  label: string;
  sortKey: SortKey;
  currentKey: SortKey;
  currentDir: SortDir;
  onSort: (key: SortKey) => void;
  className?: string;
  title?: string;
}

function ColHeader({
  label,
  sortKey,
  currentKey,
  currentDir,
  onSort,
  className,
  title,
}: ColHeaderProps) {
  const active = currentKey === sortKey;
  return (
    <th
      className={cn('px-2 py-2.5 text-center select-none', className)}
      title={title}
    >
      <button
        onClick={() => onSort(sortKey)}
        className={cn(
          'inline-flex items-center justify-center gap-0.5 text-[10px] font-semibold uppercase tracking-wider transition-colors duration-150',
          active ? 'text-accent' : 'text-white/25 hover:text-white/50'
        )}
      >
        {label}
        {active ? (
          currentDir === 'asc' ? (
            <ChevronUp className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )
        ) : (
          <ChevronsUpDown className="w-3 h-3 opacity-40" />
        )}
      </button>
    </th>
  );
}

// ─── Zone legend ──────────────────────────────────────────────────────────────

function ZoneLegend({ zones }: { zones: Set<QualificationZone> }) {
  const entries = Array.from(zones).filter(Boolean) as NonNullable<QualificationZone>[];
  if (entries.length === 0) return null;

  const dotColors: Record<NonNullable<QualificationZone>, string> = {
    ucl: 'bg-zone-ucl',
    'ucl-qualifier': 'bg-blue-400',
    uel: 'bg-zone-uel',
    uecl: 'bg-zone-uecl',
    'relegation-playoff': 'bg-zone-relegation/50',
    relegation: 'bg-zone-relegation',
  };

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 px-4 py-3 border-t border-white/[0.04]">
      {entries.map((zone) => (
        <div key={zone} className="flex items-center gap-1.5">
          <span className={cn('w-2.5 h-2.5 rounded-sm shrink-0', dotColors[zone])} />
          <span className="text-[11px] text-white/30">{ZONE_LABELS[zone]}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Main table ───────────────────────────────────────────────────────────────

interface StandingsTableProps {
  leagueId: number;
  season?: number;
}

export function StandingsTable({
  leagueId,
  season = DEFAULT_SEASON,
}: StandingsTableProps) {
  const { data, isLoading, isError, refetch } = useStandings(leagueId, season);
  const [sortKey, setSortKey] = useState<SortKey>('rank');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir(key === 'rank' ? 'asc' : 'desc');
    }
  }

  const rawRows = data?.standings?.[0] ?? [];
  const rows = sortRows(rawRows, sortKey, sortDir);
  const zones = new Set(rows.map((r) => r.zone));

  if (isLoading) {
    return <TableSkeleton rows={20} cols={9} />;
  }

  if (isError) {
    return (
      <ErrorState
        message="Could not load standings. Please try again."
        onRetry={() => void refetch()}
        className="py-16"
      />
    );
  }

  const sortProps = { currentKey: sortKey, currentDir: sortDir, onSort: handleSort };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse">
        <thead>
          <tr className="border-b border-white/8">
            <th className="px-4 py-2.5 text-left w-8">
              <span className="text-[10px] font-semibold text-white/20 uppercase tracking-wider">
                #
              </span>
            </th>
            <th className="px-2 py-2.5 text-left">
              <span className="text-[10px] font-semibold text-white/20 uppercase tracking-wider">
                Club
              </span>
            </th>
            <ColHeader label="P" sortKey="played" title="Played" {...sortProps} />
            <ColHeader label="W" sortKey="won" title="Won" {...sortProps} />
            <ColHeader label="D" sortKey="drawn" title="Drawn" {...sortProps} />
            <ColHeader label="L" sortKey="lost" title="Lost" {...sortProps} />
            <ColHeader label="GF" sortKey="gf" title="Goals For" {...sortProps} className="hidden sm:table-cell" />
            <ColHeader label="GA" sortKey="ga" title="Goals Against" {...sortProps} className="hidden sm:table-cell" />
            <ColHeader label="GD" sortKey="gd" title="Goal Difference" {...sortProps} />
            <ColHeader label="Pts" sortKey="pts" title="Points" {...sortProps} />
            <th className="px-4 py-2.5 text-center hidden lg:table-cell">
              <span className="text-[10px] font-semibold text-white/20 uppercase tracking-wider">
                Form
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => {
            const borderClass = row.zone
              ? ZONE_BORDER[row.zone]
              : 'border-l-[3px] border-l-transparent';

            return (
              <tr
                key={row.team.id}
                className={cn(
                  'border-t border-white/[0.04] transition-colors duration-100 hover:bg-white/[0.02]',
                  borderClass
                )}
              >
                {/* Rank */}
                <td className="px-4 py-3 text-right w-8">
                  <span className="text-[12px] tabular-nums text-white/30">
                    {row.rank}
                  </span>
                </td>

                {/* Team */}
                <td className="px-2 py-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <TeamLogo src={row.team.logo} alt={row.team.name} size={22} />
                    <span className="text-[13px] font-medium text-white/85 truncate">
                      {row.team.name}
                    </span>
                  </div>
                </td>

                {/* Stats */}
                {(
                  [
                    { val: row.all.played, key: 'played' },
                    { val: row.all.win, key: 'won' },
                    { val: row.all.draw, key: 'drawn' },
                    { val: row.all.lose, key: 'lost' },
                  ] as const
                ).map(({ val, key }) => (
                  <td key={key} className="px-2 py-3 text-center">
                    <span
                      className={cn(
                        'text-[12px] tabular-nums',
                        sortKey === key ? 'text-white/70' : 'text-white/40'
                      )}
                    >
                      {val}
                    </span>
                  </td>
                ))}

                {/* GF */}
                <td className="px-2 py-3 text-center hidden sm:table-cell">
                  <span
                    className={cn(
                      'text-[12px] tabular-nums',
                      sortKey === 'gf' ? 'text-white/70' : 'text-white/40'
                    )}
                  >
                    {row.all.goals.for}
                  </span>
                </td>

                {/* GA */}
                <td className="px-2 py-3 text-center hidden sm:table-cell">
                  <span
                    className={cn(
                      'text-[12px] tabular-nums',
                      sortKey === 'ga' ? 'text-white/70' : 'text-white/40'
                    )}
                  >
                    {row.all.goals.against}
                  </span>
                </td>

                {/* GD */}
                <td className="px-2 py-3 text-center">
                  <span
                    className={cn(
                      'text-[12px] tabular-nums font-medium',
                      row.goalsDiff > 0
                        ? 'text-accent'
                        : row.goalsDiff < 0
                        ? 'text-red-400'
                        : 'text-white/35'
                    )}
                  >
                    {row.goalsDiff > 0 ? `+${row.goalsDiff}` : row.goalsDiff}
                  </span>
                </td>

                {/* Points */}
                <td className="px-2 py-3 text-center">
                  <span
                    className={cn(
                      'text-[14px] font-bold tabular-nums',
                      sortKey === 'pts' ? 'text-white' : 'text-white/80'
                    )}
                  >
                    {row.points}
                  </span>
                </td>

                {/* Form */}
                <td className="px-4 py-3 hidden lg:table-cell">
                  {row.form && <FormGuide form={row.form} limit={5} />}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Zone legend */}
      <ZoneLegend zones={zones} />
    </div>
  );
}
