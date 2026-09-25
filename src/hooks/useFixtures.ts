import { useQuery } from '@tanstack/react-query';
import { fetchFixtures, fetchRounds } from '@/lib/api/client';
import { mockResultsByLeague, laLigaResults } from '@/data/mock/fixtures';
import type { FixturesResponse } from '@/lib/api/types';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export interface UseFixturesParams {
  league?: number;
  season?: number;
  round?: string;
  team?: number;
  from?: string;
  to?: string;
}

export function useFixtures(params: UseFixturesParams = {}, enabled = true) {
  return useQuery<FixturesResponse, Error>({
    queryKey: ['fixtures', params],
    queryFn: () => {
      if (USE_MOCK) {
        const all = params.league
          ? (mockResultsByLeague[params.league]?.fixtures ?? laLigaResults)
          : laLigaResults;
        return Promise.resolve({ fixtures: all });
      }
      return fetchFixtures(params);
    },
    enabled,
    staleTime: 300_000,
  });
}

export function useRounds(leagueId: number, season: number) {
  return useQuery<{ rounds: string[] }, Error>({
    queryKey: ['rounds', leagueId, season],
    queryFn: () => {
      if (USE_MOCK) return Promise.resolve({ rounds: Array.from({ length: 38 }, (_, i) => `Regular Season - ${i + 1}`) });
      return fetchRounds(leagueId, season);
    },
    staleTime: 3_600_000, // rounds don't change
  });
}
