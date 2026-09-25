'use client';

import { useState } from 'react';
import { ResultsList } from '@/components/matches/ResultsList';
import { H2HCard } from '@/components/matches/H2HCard';
import { MatchEvents } from '@/components/matches/MatchEvents';
import { MatchStats } from '@/components/matches/MatchStats';
import { MatchLineups } from '@/components/matches/MatchLineups';
import { PredictionCard } from '@/components/matches/PredictionCard';
import { FixtureCard } from '@/components/matches/FixtureCard';
import { UnderlineTabs } from '@/components/ui/Tabs';
import { LeagueSeasonPicker } from '@/components/ui/LeagueSeasonPicker';
import { LEAGUES, DEFAULT_SEASON } from '@/lib/constants';
import type { Fixture } from '@/lib/api/types';

type DetailTab = 'events' | 'stats' | 'lineups' | 'h2h' | 'prediction';

const DETAIL_TABS = [
  { value: 'events'     as DetailTab, label: 'Events'     },
  { value: 'stats'      as DetailTab, label: 'Stats'       },
  { value: 'lineups'    as DetailTab, label: 'Lineups'     },
  { value: 'h2h'        as DetailTab, label: 'H2H'         },
  { value: 'prediction' as DetailTab, label: 'Prediction'  },
];

export default function MatchesPage() {
  const [leagueId, setLeagueId] = useState<number>(LEAGUES.LA_LIGA.id);
  const [season, setSeason]     = useState<number>(DEFAULT_SEASON);
  const [selected, setSelected] = useState<Fixture | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>('events');

  return (
    <div className="space-y-5 animate-[fadeIn_0.3s_ease-in-out]">
      {/* Controls */}
      <LeagueSeasonPicker
        leagueId={leagueId}
        season={season}
        onLeagueChange={(id) => { setLeagueId(id); setSelected(null); }}
        onSeasonChange={(y) => { setSeason(y); setSelected(null); }}
      />

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Results list */}
        <div className="flex-1 min-w-0">
          <ResultsList
            leagueId={leagueId}
            season={season}
            onSelectFixture={(f) => { setSelected(f); setDetailTab('events'); }}
            selectedFixtureId={selected?.id}
          />
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="w-full lg:w-[420px] xl:w-[480px] shrink-0 space-y-3">
            {/* Fixture header */}
            <FixtureCard fixture={selected} />

            {/* Tab switcher */}
            <div className="rounded-xl border border-white/5 bg-surface overflow-hidden">
              <UnderlineTabs
                items={DETAIL_TABS}
                value={detailTab}
                onChange={setDetailTab}
                className="px-2"
              />
              <div className="max-h-[520px] overflow-y-auto scrollbar-thin">
                {detailTab === 'events'     && <MatchEvents   fixtureId={selected.id} homeTeamId={selected.teams.home.id} />}
                {detailTab === 'stats'      && <MatchStats    fixtureId={selected.id} />}
                {detailTab === 'lineups'    && <MatchLineups  fixtureId={selected.id} />}
                {detailTab === 'h2h'        && (
                  <div className="p-4">
                    <H2HCard fixtureId={selected.id} />
                  </div>
                )}
                {detailTab === 'prediction' && (
                  <div className="p-4">
                    <PredictionCard
                      fixtureId={selected.id}
                      homeTeam={selected.teams.home}
                      awayTeam={selected.teams.away}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
