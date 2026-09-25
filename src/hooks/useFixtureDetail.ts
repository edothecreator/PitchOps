import { useQuery } from '@tanstack/react-query';
import {
  fetchFixtureEvents,
  fetchFixtureStats,
  fetchFixtureLineups,
  fetchH2H,
  fetchPrediction,
} from '@/lib/api/client';
import {
  mockEvents2001,
  mockStats2001,
  mockLineups2001,
  mockH2H2001,
  mockPrediction2001,
} from '@/data/mock/fixtures';
import type {
  FixtureEventsResponse,
  FixtureStatsResponse,
  LineupsResponse,
  H2HResponse,
  PredictionResponse,
} from '@/lib/api/types';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

function fallback<T>(mock: T): T { return mock; }

export function useFixtureEvents(fixtureId: number | null | undefined) {
  return useQuery<FixtureEventsResponse, Error>({
    queryKey: ['fixture-events', fixtureId],
    queryFn: () => {
      if (!fixtureId) throw new Error('No fixture');
      if (USE_MOCK) return Promise.resolve(fallback(mockEvents2001));
      return fetchFixtureEvents(fixtureId);
    },
    enabled: !!fixtureId,
    staleTime: 300_000,
  });
}

export function useFixtureStats(fixtureId: number | null | undefined) {
  return useQuery<FixtureStatsResponse, Error>({
    queryKey: ['fixture-stats', fixtureId],
    queryFn: () => {
      if (!fixtureId) throw new Error('No fixture');
      if (USE_MOCK) return Promise.resolve(fallback(mockStats2001));
      return fetchFixtureStats(fixtureId);
    },
    enabled: !!fixtureId,
    staleTime: 300_000,
  });
}

export function useFixtureLineups(fixtureId: number | null | undefined) {
  return useQuery<LineupsResponse, Error>({
    queryKey: ['fixture-lineups', fixtureId],
    queryFn: () => {
      if (!fixtureId) throw new Error('No fixture');
      if (USE_MOCK) return Promise.resolve(fallback(mockLineups2001));
      return fetchFixtureLineups(fixtureId);
    },
    enabled: !!fixtureId,
    staleTime: 300_000,
  });
}

export function useH2H(fixtureId: number | null | undefined) {
  return useQuery<H2HResponse, Error>({
    queryKey: ['h2h', fixtureId],
    queryFn: () => {
      if (!fixtureId) throw new Error('No fixture');
      if (USE_MOCK) return Promise.resolve(fallback(mockH2H2001));
      return fetchH2H(fixtureId);
    },
    enabled: !!fixtureId,
    staleTime: 300_000,
  });
}

export function usePrediction(fixtureId: number | null | undefined) {
  return useQuery<PredictionResponse, Error>({
    queryKey: ['prediction', fixtureId],
    queryFn: () => {
      if (!fixtureId) throw new Error('No fixture');
      if (USE_MOCK) return Promise.resolve(fallback(mockPrediction2001));
      return fetchPrediction(fixtureId);
    },
    enabled: !!fixtureId,
    staleTime: 300_000,
  });
}
