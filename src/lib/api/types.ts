// ─── Shared primitives ────────────────────────────────────────────────────────

export interface Team {
  id: number;
  name: string;
  shortName?: string;
  logo: string;
  country?: string;
  winner?: boolean | null;
}

export interface League {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag?: string;
  season: number;
  round?: string;
}

export interface Venue {
  id: number | null;
  name: string | null;
  city: string | null;
  capacity?: number | null;
}

export interface Country {
  name: string;
  code: string | null;
  flag: string | null;
}

// ─── Standings ────────────────────────────────────────────────────────────────

export interface StandingRecord {
  played: number;
  win: number;
  draw: number;
  lose: number;
  goals: { for: number; against: number };
}

export type QualificationZone =
  | 'ucl'
  | 'ucl-qualifier'
  | 'uel'
  | 'uecl'
  | 'relegation-playoff'
  | 'relegation'
  | null;

export interface StandingRow {
  rank: number;
  team: Team;
  points: number;
  goalsDiff: number;
  group?: string;
  form?: string;
  status?: string;
  description?: string;
  all: StandingRecord;
  home: StandingRecord;
  away: StandingRecord;
  update: string;
  zone: QualificationZone;
}

export interface StandingsResponse {
  league: League;
  standings: StandingRow[][];
}

// ─── Fixtures ─────────────────────────────────────────────────────────────────

export type FixtureStatusShort =
  | 'TBD' | 'NS' | '1H' | 'HT' | '2H' | 'ET' | 'BT' | 'P'
  | 'SUSP' | 'INT' | 'FT' | 'AET' | 'PEN' | 'PST' | 'CANC'
  | 'ABD' | 'AWD' | 'WO' | 'LIVE';

export interface FixtureStatus {
  long: string;
  short: FixtureStatusShort;
  elapsed: number | null;
}

export interface FixtureScore {
  home: number | null;
  away: number | null;
}

export interface FixtureScores {
  halftime: FixtureScore;
  fulltime: FixtureScore;
  extratime: FixtureScore;
  penalty: FixtureScore;
}

export interface Fixture {
  id: number;
  referee: string | null;
  timezone: string;
  date: string;
  timestamp: number;
  venue: Venue;
  status: FixtureStatus;
  league: League;
  teams: {
    home: Team & { winner: boolean | null };
    away: Team & { winner: boolean | null };
  };
  goals: FixtureScore;
  score: FixtureScores;
}

export interface FixturesResponse {
  fixtures: Fixture[];
}

// ─── Fixture events ───────────────────────────────────────────────────────────

export interface FixtureEvent {
  time: { elapsed: number; extra: number | null };
  team: { id: number; name: string; logo: string };
  player: { id: number; name: string };
  assist: { id: number | null; name: string | null };
  type: 'Goal' | 'Card' | 'subst' | 'Var';
  detail: string;
  comments: string | null;
}

export interface FixtureEventsResponse {
  fixtureId: number;
  events: FixtureEvent[];
}

// ─── Fixture statistics ───────────────────────────────────────────────────────

export interface FixtureStatEntry {
  type: string;
  value: number | string | null;
}

export interface FixtureTeamStats {
  team: { id: number; name: string; logo: string };
  statistics: FixtureStatEntry[];
}

export interface FixtureStatsResponse {
  fixtureId: number;
  teams: FixtureTeamStats[];
}

// ─── Lineups ──────────────────────────────────────────────────────────────────

export interface LineupPlayer {
  id: number;
  name: string;
  number: number;
  pos: 'G' | 'D' | 'M' | 'F';
  grid: string | null;
}

export interface FixtureLineup {
  team: { id: number; name: string; logo: string; colors?: unknown };
  formation: string;
  startXI: Array<{ player: LineupPlayer }>;
  substitutes: Array<{ player: LineupPlayer }>;
  coach: { id: number; name: string; photo: string };
}

export interface LineupsResponse {
  fixtureId: number;
  lineups: FixtureLineup[];
}

// ─── H2H ─────────────────────────────────────────────────────────────────────

export interface H2HStats {
  teamA: { team: Team; wins: number; draws: number; losses: number; goalsScored: number; goalsConceded: number };
  teamB: { team: Team; wins: number; draws: number; losses: number; goalsScored: number; goalsConceded: number };
  totalMatches: number;
  recentFixtures: Fixture[];
}

export interface H2HResponse {
  fixtureId: number;
  h2h: H2HStats;
}

// ─── Players ──────────────────────────────────────────────────────────────────

export interface Player {
  id: number;
  name: string;
  firstname: string;
  lastname: string;
  age: number;
  nationality: string;
  photo: string;
  height?: string | null;
  weight?: string | null;
  injured?: boolean;
  birth?: { date: string | null; place: string | null; country: string | null };
}

export interface PlayerSeasonStats {
  team: { id: number; name: string; logo: string };
  league: League;
  games: {
    appearences: number | null;
    lineups: number | null;
    minutes: number | null;
    number: number | null;
    position: string;
    rating: string | null;
    captain: boolean;
  };
  goals: { total: number | null; conceded: number | null; assists: number | null; saves: number | null };
  shots: { total: number | null; on: number | null };
  passes: { total: number | null; key: number | null; accuracy: number | null };
  tackles: { total: number | null; blocks: number | null; interceptions: number | null };
  duels: { total: number | null; won: number | null };
  dribbles: { attempts: number | null; success: number | null; past: number | null };
  fouls: { drawn: number | null; committed: number | null };
  cards: { yellow: number; yellowred: number; red: number };
  penalty: { won: number | null; committed: number | null; scored: number | null; missed: number | null; saved: number | null };
}

export interface PlayerEntry {
  player: Player;
  statistics: PlayerSeasonStats[];
}

export interface TopScorersResponse {
  league: League;
  scorers: PlayerEntry[];
}

export interface TopAssistsResponse {
  league: League;
  players: PlayerEntry[];
}

// ─── Transfers ────────────────────────────────────────────────────────────────

export interface TransferRecord {
  date: string;
  type: string;
  teams: {
    in: { id: number; name: string; logo: string };
    out: { id: number; name: string; logo: string };
  };
}

export interface PlayerTransfers {
  player: { id: number; name: string };
  transfers: TransferRecord[];
}

// ─── Injuries ─────────────────────────────────────────────────────────────────

export interface InjuryEntry {
  player: { id: number; name: string; photo: string; type: string; reason: string };
  team: { id: number; name: string; logo: string };
  fixture: { id: number; timezone: string; date: string; timestamp: number };
  league: League;
}

export interface InjuriesResponse {
  injuries: InjuryEntry[];
}

// ─── Predictions ─────────────────────────────────────────────────────────────

export interface PredictionComparison {
  form: { home: string; away: string };
  att: { home: string; away: string };
  def: { home: string; away: string };
  poisson_distribution: { home: string; away: string };
  h2h: { home: string; away: string };
  goals: { home: string; away: string };
  total: { home: string; away: string };
}

export interface Prediction {
  winner: { id: number | null; name: string | null; comment: string | null };
  win_or_draw: boolean | null;
  under_over: string | null;
  goals: { home: string | null; away: string | null };
  advice: string;
  percent: { home: string; draw: string; away: string };
}

export interface PredictionResponse {
  fixtureId: number;
  predictions: Prediction;
  comparison: PredictionComparison;
  teams: {
    home: { id: number; name: string; logo: string; last_5: { form: string; att: string; def: string; goals: { for: { total: number; average: number }; against: { total: number; average: number } } } };
    away: { id: number; name: string; logo: string; last_5: { form: string; att: string; def: string; goals: { for: { total: number; average: number }; against: { total: number; average: number } } } };
  };
}

// ─── Team Statistics ──────────────────────────────────────────────────────────

export interface TeamStatValue {
  home: number | string | null;
  away: number | string | null;
  total: number | string | null;
}

export interface TeamGoalTiming {
  '0-15': { total: number | null; percentage: string | null };
  '16-30': { total: number | null; percentage: string | null };
  '31-45': { total: number | null; percentage: string | null };
  '46-60': { total: number | null; percentage: string | null };
  '61-75': { total: number | null; percentage: string | null };
  '76-90': { total: number | null; percentage: string | null };
  '91-105': { total: number | null; percentage: string | null };
  '106-120': { total: number | null; percentage: string | null };
}

export interface TeamStatistics {
  league: League;
  team: Team;
  form: string;
  fixtures: {
    played: TeamStatValue;
    wins: TeamStatValue;
    draws: TeamStatValue;
    loses: TeamStatValue;
  };
  goals: {
    for: { total: TeamStatValue; average: { home: string | null; away: string | null; total: string | null }; minute: TeamGoalTiming };
    against: { total: TeamStatValue; average: { home: string | null; away: string | null; total: string | null }; minute: TeamGoalTiming };
  };
  biggest: {
    streak: { wins: number; draws: number; loses: number };
    wins: { home: string | null; away: string | null };
    loses: { home: string | null; away: string | null };
    goals: { for: { home: number; away: number }; against: { home: number; away: number } };
  };
  clean_sheet: TeamStatValue;
  failed_to_score: TeamStatValue;
  penalty: {
    scored: { home: string | null; away: string | null; percentage: string | null; total: number };
    missed: { home: string | null; away: string | null; percentage: string | null; total: number };
    total: number;
  };
  lineups: Array<{ formation: string; played: number }>;
  cards: { yellow: TeamGoalTiming; red: TeamGoalTiming };
}

export interface TeamStatsResponse {
  team: Team;
  statistics: TeamStatistics;
}

// ─── Rounds ───────────────────────────────────────────────────────────────────

export interface RoundsResponse {
  rounds: string[];
}

// ─── Squad ────────────────────────────────────────────────────────────────────

export interface SquadPlayer {
  id: number;
  name: string;
  age: number;
  number: number | null;
  position: string;
  photo: string;
}

export interface SquadResponse {
  team: Team;
  players: SquadPlayer[];
}

// ─── Trophies ─────────────────────────────────────────────────────────────────

export interface Trophy {
  league: string;
  country: string;
  season: string;
  place: string;
}

// ─── API Error ────────────────────────────────────────────────────────────────

export interface ApiError {
  message: string;
  status: number;
}
