/**
 * PitchOps API Client
 *
 * Calls the EC2 backend (NEXT_PUBLIC_API_BASE_URL).
 * The backend holds the API-Football key and proxies/normalises all responses.
 * Swap backend URL in .env — no other changes needed.
 */

import type {
  StandingsResponse,
  FixturesResponse,
  FixtureEventsResponse,
  FixtureStatsResponse,
  LineupsResponse,
  H2HResponse,
  TopScorersResponse,
  TopAssistsResponse,
  TeamStatsResponse,
  PredictionResponse,
  InjuriesResponse,
  RoundsResponse,
  SquadResponse,
  PlayerEntry,
} from './types';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`API ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

function qs(params: Record<string, string | number | undefined | null>): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v != null && v !== '') q.set(k, String(v));
  }
  const s = q.toString();
  return s ? `?${s}` : '';
}

// ─── Standings ────────────────────────────────────────────────────────────────

export const fetchStandings = (leagueId: number, season: number) =>
  apiFetch<StandingsResponse>(`/standings${qs({ league: leagueId, season })}`);

// ─── Fixtures ─────────────────────────────────────────────────────────────────

export const fetchFixtures = (params: {
  league?: number;
  season?: number;
  round?: string;
  team?: number;
  from?: string;
  to?: string;
}) => apiFetch<FixturesResponse>(`/fixtures${qs(params)}`);

export const fetchFixtureById = (id: number) =>
  apiFetch<FixturesResponse>(`/fixtures${qs({ id })}`);

export const fetchRounds = (leagueId: number, season: number) =>
  apiFetch<RoundsResponse>(`/fixtures/rounds${qs({ league: leagueId, season })}`);

// ─── Fixture detail ───────────────────────────────────────────────────────────

export const fetchFixtureEvents = (fixtureId: number) =>
  apiFetch<FixtureEventsResponse>(`/fixtures/${fixtureId}/events`);

export const fetchFixtureStats = (fixtureId: number) =>
  apiFetch<FixtureStatsResponse>(`/fixtures/${fixtureId}/statistics`);

export const fetchFixtureLineups = (fixtureId: number) =>
  apiFetch<LineupsResponse>(`/fixtures/${fixtureId}/lineups`);

export const fetchH2H = (fixtureId: number) =>
  apiFetch<H2HResponse>(`/fixtures/${fixtureId}/h2h`);

export const fetchPrediction = (fixtureId: number) =>
  apiFetch<PredictionResponse>(`/fixtures/${fixtureId}/prediction`);

// ─── Players / statistics ─────────────────────────────────────────────────────

export const fetchTopScorers = (leagueId: number, season: number) =>
  apiFetch<TopScorersResponse>(`/statistics/top-scorers${qs({ league: leagueId, season })}`);

export const fetchTopAssists = (leagueId: number, season: number) =>
  apiFetch<TopAssistsResponse>(`/statistics/top-assists${qs({ league: leagueId, season })}`);

export const fetchTopYellowCards = (leagueId: number, season: number) =>
  apiFetch<TopScorersResponse>(`/statistics/top-yellowcards${qs({ league: leagueId, season })}`);

export const fetchTopRedCards = (leagueId: number, season: number) =>
  apiFetch<TopScorersResponse>(`/statistics/top-redcards${qs({ league: leagueId, season })}`);

export const fetchTeamStats = (teamId: number, leagueId: number, season: number) =>
  apiFetch<TeamStatsResponse>(`/statistics/team/${teamId}${qs({ league: leagueId, season })}`);

export const fetchPlayerStats = (playerId: number, season: number) =>
  apiFetch<{ player: PlayerEntry }>(`/players/${playerId}${qs({ season })}`);

// ─── Squad ────────────────────────────────────────────────────────────────────

export const fetchSquad = (teamId: number) =>
  apiFetch<SquadResponse>(`/teams/${teamId}/squad`);

// ─── Injuries ─────────────────────────────────────────────────────────────────

export const fetchInjuries = (leagueId: number, season: number) =>
  apiFetch<InjuriesResponse>(`/injuries${qs({ league: leagueId, season })}`);
