import type { Metadata } from 'next';
import { StandingsSnapshot } from '@/components/dashboard/StandingsSnapshot';
import { TopScorersTicker } from '@/components/dashboard/TopScorersTicker';
import { RecentResultsStrip } from '@/components/dashboard/RecentResultsStrip';
import { LEAGUES } from '@/lib/constants';

export const metadata: Metadata = { title: 'Overview' };

const FEATURED_LEAGUES = [
  { id: LEAGUES.PREMIER_LEAGUE.id,   name: LEAGUES.PREMIER_LEAGUE.name,   logo: 'https://media.api-sports.io/football/leagues/39.png'  },
  { id: LEAGUES.LA_LIGA.id,          name: LEAGUES.LA_LIGA.name,          logo: 'https://media.api-sports.io/football/leagues/140.png' },
  { id: LEAGUES.BUNDESLIGA.id,       name: LEAGUES.BUNDESLIGA.name,       logo: 'https://media.api-sports.io/football/leagues/78.png'  },
  { id: LEAGUES.SERIE_A.id,          name: LEAGUES.SERIE_A.name,          logo: 'https://media.api-sports.io/football/leagues/135.png' },
  { id: LEAGUES.LIGUE_1.id,          name: LEAGUES.LIGUE_1.name,          logo: 'https://media.api-sports.io/football/leagues/61.png'  },
  { id: LEAGUES.CHAMPIONS_LEAGUE.id, name: LEAGUES.CHAMPIONS_LEAGUE.name, logo: 'https://media.api-sports.io/football/leagues/2.png'   },
  { id: LEAGUES.EUROPA_LEAGUE.id,    name: LEAGUES.EUROPA_LEAGUE.name,    logo: 'https://media.api-sports.io/football/leagues/3.png'   },
];

const SEASON = 2024;

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-[fadeIn_0.3s_ease-in-out]">

      {/* Recent results strip */}
      <section>
        <h2 className="text-[12px] font-semibold text-white/40 uppercase tracking-widest mb-4">
          Recent Results · 2024/25
        </h2>
        <RecentResultsStrip />
      </section>

      {/* Standings snapshots — 3 columns on XL */}
      <section>
        <h2 className="text-[12px] font-semibold text-white/40 uppercase tracking-widest mb-4">
          Standings Snapshots · {SEASON}/{String(SEASON + 1).slice(2)}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {FEATURED_LEAGUES.slice(0, 6).map((l) => (
            <StandingsSnapshot
              key={l.id}
              leagueId={l.id}
              season={SEASON}
              title={l.name}
              leagueLogo={l.logo}
              rows={4}
            />
          ))}
        </div>
      </section>

      {/* Top scorers — 3 leagues side by side */}
      <section>
        <h2 className="text-[12px] font-semibold text-white/40 uppercase tracking-widest mb-4">
          Top Scorers · {SEASON}/{String(SEASON + 1).slice(2)}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[LEAGUES.PREMIER_LEAGUE, LEAGUES.LA_LIGA, LEAGUES.CHAMPIONS_LEAGUE].map((l) => (
            <TopScorersTicker
              key={l.id}
              leagueId={l.id}
              season={SEASON}
              title={`${l.name} · Top Scorers`}
              limit={5}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
