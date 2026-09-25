'use client';

import { useState } from 'react';
import { TopScorersTable } from '@/components/statistics/TopScorersTable';
import { TeamStatsCard } from '@/components/statistics/TeamStatsCard';
import { UnderlineTabs } from '@/components/ui/Tabs';
import { LeagueSeasonPicker } from '@/components/ui/LeagueSeasonPicker';
import { TeamLogo } from '@/components/ui/TeamLogo';
import { LEAGUES, DEFAULT_SEASON } from '@/lib/constants';

type SectionTab = 'scorers' | 'assists' | 'cards' | 'teams';

const SECTION_TABS = [
  { value: 'scorers' as SectionTab, label: 'Top Scorers' },
  { value: 'assists' as SectionTab, label: 'Top Assists'  },
  { value: 'cards'   as SectionTab, label: 'Discipline'   },
  { value: 'teams'   as SectionTab, label: 'Team Stats'   },
];

// Representative teams per league for team stats view
const FEATURED_TEAMS: Record<number, Array<{ id: number; name: string; logo: string }>> = {
  39:  [{ id: 50,  name: 'Manchester City', logo: 'https://media.api-sports.io/football/teams/50.png'  }, { id: 40,  name: 'Liverpool',       logo: 'https://media.api-sports.io/football/teams/40.png'  }],
  140: [{ id: 541, name: 'Real Madrid',     logo: 'https://media.api-sports.io/football/teams/541.png' }, { id: 529, name: 'Barcelona',       logo: 'https://media.api-sports.io/football/teams/529.png' }],
  78:  [{ id: 157, name: 'Bayern München',  logo: 'https://media.api-sports.io/football/teams/157.png' }, { id: 165, name: 'B. Dortmund',     logo: 'https://media.api-sports.io/football/teams/165.png' }],
  135: [{ id: 505, name: 'Inter Milan',     logo: 'https://media.api-sports.io/football/teams/505.png' }, { id: 489, name: 'AC Milan',        logo: 'https://media.api-sports.io/football/teams/489.png' }],
  61:  [{ id: 85,  name: 'Paris SG',        logo: 'https://media.api-sports.io/football/teams/85.png'  }, { id: 80,  name: 'Lyon',            logo: 'https://media.api-sports.io/football/teams/80.png'  }],
  2:   [{ id: 541, name: 'Real Madrid',     logo: 'https://media.api-sports.io/football/teams/541.png' }, { id: 50,  name: 'Manchester City', logo: 'https://media.api-sports.io/football/teams/50.png'  }],
  3:   [{ id: 530, name: 'Atletico Madrid', logo: 'https://media.api-sports.io/football/teams/530.png' }, { id: 42,  name: 'Arsenal',         logo: 'https://media.api-sports.io/football/teams/42.png'  }],
};

const LEAGUE_LOGOS: Record<number, string> = {
  39: 'https://media.api-sports.io/football/leagues/39.png', 140: 'https://media.api-sports.io/football/leagues/140.png',
  78: 'https://media.api-sports.io/football/leagues/78.png', 135: 'https://media.api-sports.io/football/leagues/135.png',
  61: 'https://media.api-sports.io/football/leagues/61.png', 2:   'https://media.api-sports.io/football/leagues/2.png',
  3:  'https://media.api-sports.io/football/leagues/3.png',
};

const LEAGUE_NAMES: Record<number, string> = {
  39: 'Premier League', 140: 'La Liga', 78: 'Bundesliga',
  135: 'Serie A', 61: 'Ligue 1', 2: 'Champions League', 3: 'Europa League',
};

export default function StatisticsPage() {
  const [section,  setSection]  = useState<SectionTab>('scorers');
  const [leagueId, setLeagueId] = useState<number>(LEAGUES.LA_LIGA.id);
  const [season,   setSeason]   = useState<number>(DEFAULT_SEASON);

  const featuredTeams = FEATURED_TEAMS[leagueId] ?? FEATURED_TEAMS[140];

  return (
    <div className="space-y-5 animate-[fadeIn_0.3s_ease-in-out]">
      {/* Controls */}
      <div className="flex flex-col gap-3">
        <UnderlineTabs items={SECTION_TABS} value={section} onChange={setSection} />
        <LeagueSeasonPicker
          leagueId={leagueId}
          season={season}
          onLeagueChange={setLeagueId}
          onSeasonChange={setSeason}
        />
      </div>

      {/* Scorers */}
      {(section === 'scorers' || section === 'assists' || section === 'cards') && (
        <div className="rounded-xl border border-white/5 bg-surface overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
            <TeamLogo src={LEAGUE_LOGOS[leagueId]} alt={LEAGUE_NAMES[leagueId]} size={20} />
            <h2 className="text-[14px] font-semibold text-white/80">
              {LEAGUE_NAMES[leagueId]} ·{' '}
              {section === 'scorers' ? 'Top Scorers' : section === 'assists' ? 'Top Assists' : 'Discipline'}
            </h2>
            <span className="ml-auto text-[12px] text-white/25">
              {season}/{String(season + 1).slice(2)}
            </span>
          </div>
          <TopScorersTable
            leagueId={leagueId}
            season={season}
            mode={section === 'assists' ? 'assists' : section === 'cards' ? 'cards' : 'goals'}
            limit={20}
          />
        </div>
      )}

      {/* Team stats */}
      {section === 'teams' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TeamLogo src={LEAGUE_LOGOS[leagueId]} alt={LEAGUE_NAMES[leagueId]} size={20} />
            <h2 className="text-[14px] font-semibold text-white/80">
              {LEAGUE_NAMES[leagueId]} · Team Breakdown · {season}/{String(season + 1).slice(2)}
            </h2>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {featuredTeams.map((team) => (
              <TeamStatsCard
                key={team.id}
                teamId={team.id}
                leagueId={leagueId}
                season={season}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
