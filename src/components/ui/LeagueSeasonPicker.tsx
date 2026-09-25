'use client';

import { LEAGUES, LEAGUE_LIST, SEASONS } from '@/lib/constants';
import { TeamLogo } from './TeamLogo';
import { cn } from '@/lib/utils';

const LEAGUE_LOGOS: Record<number, string> = {
  39:  'https://media.api-sports.io/football/leagues/39.png',
  140: 'https://media.api-sports.io/football/leagues/140.png',
  78:  'https://media.api-sports.io/football/leagues/78.png',
  135: 'https://media.api-sports.io/football/leagues/135.png',
  61:  'https://media.api-sports.io/football/leagues/61.png',
  2:   'https://media.api-sports.io/football/leagues/2.png',
  3:   'https://media.api-sports.io/football/leagues/3.png',
};

interface LeagueSeasonPickerProps {
  leagueId: number;
  season: number;
  onLeagueChange: (id: number) => void;
  onSeasonChange: (year: number) => void;
  className?: string;
}

export function LeagueSeasonPicker({
  leagueId,
  season,
  onLeagueChange,
  onSeasonChange,
  className,
}: LeagueSeasonPickerProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      {/* League pills */}
      <div className="flex flex-wrap gap-1.5">
        {LEAGUE_LIST.map((l) => {
          const active = leagueId === l.id;
          return (
            <button
              key={l.id}
              onClick={() => onLeagueChange(l.id)}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium transition-colors duration-150 border',
                active
                  ? 'bg-accent/10 border-accent/25 text-accent'
                  : 'border-white/8 text-white/40 hover:text-white/70 hover:border-white/15 bg-white/[0.02]'
              )}
            >
              <TeamLogo src={LEAGUE_LOGOS[l.id]} alt={l.name} size={14} />
              {l.name}
            </button>
          );
        })}
      </div>

      {/* Season dropdown */}
      <div className="relative">
        <select
          value={season}
          onChange={(e) => onSeasonChange(Number(e.target.value))}
          className={cn(
            'appearance-none pl-3 pr-7 py-1.5 rounded-lg text-[12px] font-medium tabular-nums',
            'bg-white/[0.03] border border-white/8 text-white/60',
            'hover:border-white/15 focus:outline-none focus:border-accent/30',
            'cursor-pointer transition-colors duration-150'
          )}
        >
          {SEASONS.map((y) => (
            <option key={y} value={y} className="bg-surface text-white">
              {y}/{String(y + 1).slice(2)}
            </option>
          ))}
        </select>
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none text-[10px]">▾</span>
      </div>
    </div>
  );
}
