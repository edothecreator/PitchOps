/** Known league IDs (API-Football convention). */
export const LEAGUES = {
  PREMIER_LEAGUE:   { id: 39,  name: 'Premier League',        country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  LA_LIGA:          { id: 140, name: 'La Liga',                country: 'Spain',   flag: '🇪🇸' },
  BUNDESLIGA:       { id: 78,  name: 'Bundesliga',             country: 'Germany', flag: '🇩🇪' },
  SERIE_A:          { id: 135, name: 'Serie A',                country: 'Italy',   flag: '🇮🇹' },
  LIGUE_1:          { id: 61,  name: 'Ligue 1',                country: 'France',  flag: '🇫🇷' },
  CHAMPIONS_LEAGUE: { id: 2,   name: 'Champions League',       country: 'Europe',  flag: '🇪🇺' },
  EUROPA_LEAGUE:    { id: 3,   name: 'Europa League',          country: 'Europe',  flag: '🇪🇺' },
} as const;

export type LeagueKey = keyof typeof LEAGUES;

export const LEAGUE_LIST = Object.entries(LEAGUES).map(([key, val]) => ({
  key: key as LeagueKey,
  ...val,
}));

/** Seasons available — free tier covers 2024, historical back to 2010. */
export const SEASONS = Array.from({ length: 15 }, (_, i) => 2024 - i); // [2024, 2023, ..., 2010]

export const DEFAULT_SEASON = 2024;

/** Refetch intervals (ms) — historical data never refetches */
export const REFETCH_INTERVALS = {
  STATIC: 0,
} as const;
