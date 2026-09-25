import type { Fixture, FixturesResponse, FixtureEventsResponse, FixtureStatsResponse, LineupsResponse } from '@/lib/api/types';
import { laLigaLeague, clLeague, plLeague } from './leagues';
import { laLigaTeams, clTeams, plTeams } from './teams';

const v = {
  bernabeu:    { id: 1,  name: 'Estadio Santiago Bernabéu', city: 'Madrid',      capacity: 81044 },
  camp_nou:    { id: 2,  name: 'Spotify Camp Nou',          city: 'Barcelona',   capacity: 99354 },
  metro:       { id: 3,  name: 'Estadio Metropolitano',     city: 'Madrid',      capacity: 68456 },
  etihad:      { id: 5,  name: 'Etihad Stadium',            city: 'Manchester',  capacity: 55017 },
  anfield:     { id: 6,  name: 'Anfield',                   city: 'Liverpool',   capacity: 53394 },
};

function fixture(
  id: number,
  date: string,
  league: typeof laLigaLeague,
  venue: typeof v.bernabeu,
  home: { id: number; name: string; logo: string },
  away: { id: number; name: string; logo: string },
  goalsHome: number,
  goalsAway: number,
  htHome: number,
  htAway: number,
  elapsed: number,
  statusShort: 'FT' | 'AET' | 'PEN' = 'FT'
): Fixture {
  const homeWinner = goalsHome > goalsAway ? true : goalsHome < goalsAway ? false : null;
  return {
    id,
    referee: 'Carlos del Cerro Grande',
    timezone: 'Europe/Madrid',
    date,
    timestamp: new Date(date).getTime() / 1000,
    venue,
    status: { long: 'Match Finished', short: statusShort, elapsed },
    league,
    teams: {
      home: { ...home, winner: homeWinner },
      away: { ...away, winner: homeWinner === null ? null : !homeWinner },
    },
    goals: { home: goalsHome, away: goalsAway },
    score: {
      halftime:  { home: htHome,  away: htAway  },
      fulltime:  { home: goalsHome, away: goalsAway },
      extratime: { home: null,    away: null    },
      penalty:   { home: null,    away: null    },
    },
  };
}

// ─── Historical La Liga results ───────────────────────────────────────────────

export const laLigaResults: Fixture[] = [
  fixture(2001, '2024-10-26T19:00:00+02:00', laLigaLeague, v.bernabeu,  laLigaTeams.realMadrid,    laLigaTeams.barcelona,     4, 0, 2, 0, 90),
  fixture(2002, '2024-10-06T16:15:00+02:00', laLigaLeague, v.bernabeu,  laLigaTeams.realMadrid,    laLigaTeams.atleticoMadrid,1, 1, 0, 0, 90),
  fixture(2003, '2024-09-21T19:00:00+02:00', laLigaLeague, v.camp_nou,  laLigaTeams.barcelona,     laLigaTeams.realMadrid,    1, 4, 0, 2, 90),
  fixture(2004, '2024-09-15T19:00:00+02:00', laLigaLeague, v.metro,     laLigaTeams.atleticoMadrid,laLigaTeams.barcelona,     2, 1, 1, 0, 90),
  fixture(2005, '2024-09-01T19:00:00+02:00', laLigaLeague, v.bernabeu,  laLigaTeams.realMadrid,    laLigaTeams.sevilla,       3, 1, 1, 0, 90),
  fixture(2006, '2024-08-25T19:00:00+02:00', laLigaLeague, v.camp_nou,  laLigaTeams.barcelona,     laLigaTeams.villarreal,    2, 0, 1, 0, 90),
  fixture(2007, '2023-10-28T19:00:00+02:00', { ...laLigaLeague, season: 2023 }, v.bernabeu, laLigaTeams.realMadrid, laLigaTeams.barcelona, 2, 1, 1, 0, 90),
  fixture(2008, '2023-09-17T19:00:00+02:00', { ...laLigaLeague, season: 2023 }, v.camp_nou, laLigaTeams.barcelona, laLigaTeams.atleticoMadrid, 1, 0, 0, 0, 90),
];

// ─── Historical CL results ────────────────────────────────────────────────────

export const clResults: Fixture[] = [
  fixture(3001, '2024-11-05T21:00:00+01:00', clLeague, v.bernabeu,  clTeams.realMadrid,   clTeams.acMilan,   3, 1, 1, 0, 90),
  fixture(3002, '2024-11-05T21:00:00+00:00', clLeague, v.etihad,    clTeams.manCity,      clTeams.psg,       4, 0, 2, 0, 90),
  fixture(3003, '2024-10-22T21:00:00+01:00', clLeague, v.camp_nou,  clTeams.barcelona,    clTeams.bayernMunich, 0, 4, 0, 2, 90),
  fixture(3004, '2023-06-10T21:00:00+01:00', { ...clLeague, season: 2023 }, v.etihad, clTeams.manCity, clTeams.interMilan, 1, 0, 0, 0, 90),
  fixture(3005, '2022-05-28T21:00:00+01:00', { ...clLeague, season: 2022 }, v.bernabeu, clTeams.realMadrid, clTeams.liverpool, 1, 0, 0, 0, 90),
];

// ─── PL results ───────────────────────────────────────────────────────────────

export const plResults: Fixture[] = [
  fixture(4001, '2024-10-20T16:30:00+01:00', plLeague, v.anfield, plTeams.liverpool,  plTeams.chelsea,       2, 1, 1, 0, 90),
  fixture(4002, '2024-09-22T16:30:00+01:00', plLeague, v.etihad,  plTeams.manCity,    plTeams.arsenal,       2, 2, 0, 1, 90),
  fixture(4003, '2024-09-01T14:00:00+01:00', plLeague, v.anfield, plTeams.liverpool,  plTeams.manCity,       1, 0, 1, 0, 90),
];

export const allResults: Fixture[] = [...laLigaResults, ...clResults, ...plResults];

export const mockResultsByLeague: Record<number, FixturesResponse> = {
  140: { fixtures: laLigaResults },
  2:   { fixtures: clResults },
  39:  { fixtures: plResults },
};

// ─── Fixture events (for fixture 2001 — Real Madrid 4-0 Barca) ───────────────

export const mockEvents2001: FixtureEventsResponse = {
  fixtureId: 2001,
  events: [
    { time: { elapsed: 14, extra: null }, team: { id: 541, name: 'Real Madrid', logo: laLigaTeams.realMadrid.logo }, player: { id: 874, name: 'Vinícius Júnior' }, assist: { id: 154, name: 'Kylian Mbappé' },   type: 'Goal', detail: 'Normal Goal', comments: null },
    { time: { elapsed: 36, extra: null }, team: { id: 541, name: 'Real Madrid', logo: laLigaTeams.realMadrid.logo }, player: { id: 154, name: 'Kylian Mbappé' },   assist: { id: null, name: null },             type: 'Goal', detail: 'Penalty',     comments: null },
    { time: { elapsed: 44, extra: null }, team: { id: 529, name: 'Barcelona',   logo: laLigaTeams.barcelona.logo   }, player: { id: 389, name: 'Pedri' },           assist: { id: null, name: null },             type: 'Card', detail: 'Yellow Card', comments: null },
    { time: { elapsed: 58, extra: null }, team: { id: 541, name: 'Real Madrid', logo: laLigaTeams.realMadrid.logo }, player: { id: 874, name: 'Vinícius Júnior' }, assist: { id: 200, name: 'Bellingham' },      type: 'Goal', detail: 'Normal Goal', comments: null },
    { time: { elapsed: 73, extra: null }, team: { id: 529, name: 'Barcelona',   logo: laLigaTeams.barcelona.logo   }, player: { id: 429, name: 'Lamine Yamal' },   assist: { id: null, name: null },             type: 'subst', detail: 'Substitution 1', comments: null },
    { time: { elapsed: 89, extra: null }, team: { id: 541, name: 'Real Madrid', logo: laLigaTeams.realMadrid.logo }, player: { id: 200, name: 'Bellingham' },      assist: { id: 874, name: 'Vinícius Júnior' }, type: 'Goal', detail: 'Normal Goal', comments: null },
  ],
};

// ─── Fixture stats (for fixture 2001) ────────────────────────────────────────

export const mockStats2001: FixtureStatsResponse = {
  fixtureId: 2001,
  teams: [
    {
      team: { id: 541, name: 'Real Madrid', logo: laLigaTeams.realMadrid.logo },
      statistics: [
        { type: 'Ball Possession',   value: '58%' },
        { type: 'Total Shots',       value: 16    },
        { type: 'Shots on Goal',     value: 8     },
        { type: 'Shots off Goal',    value: 5     },
        { type: 'Blocked Shots',     value: 3     },
        { type: 'Corner Kicks',      value: 7     },
        { type: 'Fouls',             value: 12    },
        { type: 'Yellow Cards',      value: 1     },
        { type: 'Red Cards',         value: 0     },
        { type: 'Offsides',          value: 2     },
        { type: 'Passes accurate',   value: 387   },
        { type: 'Passes %',          value: '88%' },
        { type: 'Goalkeeper Saves',  value: 3     },
        { type: 'expected_goals',    value: 3.21  },
      ],
    },
    {
      team: { id: 529, name: 'Barcelona', logo: laLigaTeams.barcelona.logo },
      statistics: [
        { type: 'Ball Possession',   value: '42%' },
        { type: 'Total Shots',       value: 9     },
        { type: 'Shots on Goal',     value: 3     },
        { type: 'Shots off Goal',    value: 4     },
        { type: 'Blocked Shots',     value: 2     },
        { type: 'Corner Kicks',      value: 3     },
        { type: 'Fouls',             value: 18    },
        { type: 'Yellow Cards',      value: 2     },
        { type: 'Red Cards',         value: 0     },
        { type: 'Offsides',          value: 1     },
        { type: 'Passes accurate',   value: 274   },
        { type: 'Passes %',          value: '81%' },
        { type: 'Goalkeeper Saves',  value: 4     },
        { type: 'expected_goals',    value: 0.89  },
      ],
    },
  ],
};

// ─── Lineups (for fixture 2001) ───────────────────────────────────────────────

export const mockLineups2001: LineupsResponse = {
  fixtureId: 2001,
  lineups: [
    {
      team: { id: 541, name: 'Real Madrid', logo: laLigaTeams.realMadrid.logo },
      formation: '4-3-3',
      coach: { id: 2, name: 'Carlo Ancelotti', photo: 'https://media.api-sports.io/football/coachs/2.png' },
      startXI: [
        { player: { id: 1, name: 'Courtois',    number: 1,  pos: 'G', grid: '1:1' } },
        { player: { id: 2, name: 'Carvajal',    number: 2,  pos: 'D', grid: '2:4' } },
        { player: { id: 3, name: 'Militão',     number: 3,  pos: 'D', grid: '2:3' } },
        { player: { id: 4, name: 'Rüdiger',     number: 22, pos: 'D', grid: '2:2' } },
        { player: { id: 5, name: 'Mendy',       number: 23, pos: 'D', grid: '2:1' } },
        { player: { id: 6, name: 'Valverde',    number: 15, pos: 'M', grid: '3:3' } },
        { player: { id: 7, name: 'Tchouaméni',  number: 18, pos: 'M', grid: '3:2' } },
        { player: { id: 8, name: 'Camavinga',   number: 25, pos: 'M', grid: '3:1' } },
        { player: { id: 9, name: 'Rodrygo',     number: 11, pos: 'F', grid: '4:3' } },
        { player: { id: 10, name: 'Mbappé',     number: 9,  pos: 'F', grid: '4:2' } },
        { player: { id: 11, name: 'Vinícius',   number: 7,  pos: 'F', grid: '4:1' } },
      ],
      substitutes: [
        { player: { id: 12, name: 'Bellingham', number: 5,  pos: 'M', grid: null } },
        { player: { id: 13, name: 'Brahim',     number: 21, pos: 'F', grid: null } },
      ],
    },
    {
      team: { id: 529, name: 'Barcelona', logo: laLigaTeams.barcelona.logo },
      formation: '4-3-3',
      coach: { id: 3, name: 'Hansi Flick', photo: 'https://media.api-sports.io/football/coachs/3.png' },
      startXI: [
        { player: { id: 20, name: 'Ter Stegen',   number: 1,  pos: 'G', grid: '1:1' } },
        { player: { id: 21, name: 'Koundé',        number: 23, pos: 'D', grid: '2:4' } },
        { player: { id: 22, name: 'Araujo',        number: 4,  pos: 'D', grid: '2:3' } },
        { player: { id: 23, name: 'Christensen',   number: 15, pos: 'D', grid: '2:2' } },
        { player: { id: 24, name: 'Balde',         number: 3,  pos: 'D', grid: '2:1' } },
        { player: { id: 25, name: 'Pedri',         number: 8,  pos: 'M', grid: '3:3' } },
        { player: { id: 26, name: 'de Jong',       number: 21, pos: 'M', grid: '3:2' } },
        { player: { id: 27, name: 'Gavi',          number: 6,  pos: 'M', grid: '3:1' } },
        { player: { id: 28, name: 'Lamine Yamal',  number: 19, pos: 'F', grid: '4:3' } },
        { player: { id: 29, name: 'Lewandowski',   number: 9,  pos: 'F', grid: '4:2' } },
        { player: { id: 30, name: 'Raphinha',      number: 11, pos: 'F', grid: '4:1' } },
      ],
      substitutes: [
        { player: { id: 31, name: 'Ferran Torres', number: 7,  pos: 'F', grid: null } },
        { player: { id: 32, name: 'Olmo',          number: 20, pos: 'M', grid: null } },
      ],
    },
  ],
};

// ─── H2H (fixture 2001: Real Madrid vs Barcelona) ────────────────────────────

export const mockH2H2001 = {
  fixtureId: 2001,
  h2h: {
    teamA: { team: laLigaTeams.realMadrid, wins: 74, draws: 36, losses: 39, goalsScored: 256, goalsConceded: 198 },
    teamB: { team: laLigaTeams.barcelona,  wins: 39, draws: 36, losses: 74, goalsScored: 198, goalsConceded: 256 },
    totalMatches: 149,
    recentFixtures: laLigaResults.slice(0, 5),
  },
};

// ─── Prediction (fixture 2001) ────────────────────────────────────────────────

export const mockPrediction2001 = {
  fixtureId: 2001,
  predictions: {
    winner: { id: 541, name: 'Real Madrid', comment: 'Real Madrid will win this match' },
    win_or_draw: false,
    under_over: '+2.5',
    goals: { home: '+1.5', away: '-1.5' },
    advice: 'Real Madrid Win or Over 2.5 Goals',
    percent: { home: '55%', draw: '20%', away: '25%' },
  },
  comparison: {
    form:                { home: '80%', away: '60%' },
    att:                 { home: '75%', away: '55%' },
    def:                 { home: '70%', away: '45%' },
    poisson_distribution:{ home: '52%', away: '28%' },
    h2h:                 { home: '60%', away: '40%' },
    goals:               { home: '65%', away: '50%' },
    total:               { home: '67%', away: '47%' },
  },
  teams: {
    home: { id: 541, name: 'Real Madrid', logo: laLigaTeams.realMadrid.logo, last_5: { form: 'WWWDW', att: '4.5', def: '1.8', goals: { for: { total: 12, average: 2.4 }, against: { total: 5, average: 1.0 } } } },
    away: { id: 529, name: 'Barcelona',   logo: laLigaTeams.barcelona.logo,  last_5: { form: 'WWDLW', att: '3.8', def: '2.4', goals: { for: { total: 10, average: 2.0 }, against: { total: 7, average: 1.4 } } } },
  },
};
