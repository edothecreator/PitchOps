'use client';

import { useState } from 'react';
import { StandingsTable } from '@/components/standings/StandingsTable';
import { LeagueSeasonPicker } from '@/components/ui/LeagueSeasonPicker';
import { TeamLogo } from '@/components/ui/TeamLogo';
import { LEAGUES, DEFAULT_SEASON } from '@/lib/constants';

const LEAGUE_LOGOS: Record<number, string> = {
  39:  'https://media.api-sports.io/football/leagues/39.png',
  140: 'https://media.api-sports.io/football/leagues/140.png',
  78:  'https://media.api-sports.io/football/leagues/78.png',
  135: 'https://media.api-sports.io/football/leagues/135.png',
  61:  'https://media.api-sports.io/football/leagues/61.png',
  2:   'https://media.api-sports.io/football/leagues/2.png',
  3:   'https://media.api-sports.io/football/leagues/3.png',
};

const LEAGUE_NAMES: Record<number, string> = {
  39: 'Premier League', 140: 'La Liga', 78: 'Bundesliga',
  135: 'Serie A', 61: 'Ligue 1', 2: 'Champions League', 3: 'Europa League',
};

export default function StandingsPage() {
  const [leagueId, setLeagueId] = useState<number>(LEAGUES.LA_LIGA.id);
  const [season, setSeason] = useState<number>(DEFAULT_SEASON);

  return (
    <div className="space-y-5 animate-[fadeIn_0.3s_ease-in-out]">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 justify-between">
        <div className="flex items-center gap-3">
          <TeamLogo src={LEAGUE_LOGOS[leagueId]} alt={LEAGUE_NAMES[leagueId]} size={32} />
          <div>
            <h1 className="text-white font-semibold text-lg leading-none">{LEAGUE_NAMES[leagueId]}</h1>
            <p className="text-[12px] text-white/30 mt-0.5">{season}/{String(season + 1).slice(2)} Season</p>
          </div>
        </div>
        <LeagueSeasonPicker
          leagueId={leagueId}
          season={season}
          onLeagueChange={setLeagueId}
          onSeasonChange={setSeason}
        />
      </div>

      <div className="rounded-xl border border-white/5 bg-surface overflow-hidden scrollbar-thin overflow-x-auto">
        <StandingsTable leagueId={leagueId} season={season} />
      </div>
    </div>
  );
}
