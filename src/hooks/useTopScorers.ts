import { useQuery } from '@tanstack/react-query';
import { fetchTopScorers, fetchTopAssists, fetchTopYellowCards } from '@/lib/api/client';
import { mockLaLigaTopScorers, mockCLTopScorers } from '@/data/mock/scorers';
import type { TopScorersResponse } from '@/lib/api/types';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

const MOCK_MAP: Record<number, TopScorersResponse> = {
  140: mockLaLigaTopScorers,
  2:   mockCLTopScorers,
};

export function useTopScorers(leagueId: number, season: number, options: { limit?: number } = {}) {
  const { limit } = options;
  return useQuery<TopScorersResponse, Error>({
    queryKey: ['top-scorers', leagueId, season],
    queryFn: async () => {
      let data: TopScorersResponse;
      if (USE_MOCK) {
        data = MOCK_MAP[leagueId] ?? mockLaLigaTopScorers;
      } else {
        data = await fetchTopScorers(leagueId, season);
      }
      if (limit) return { ...data, scorers: data.scorers.slice(0, limit) };
      return data;
    },
    staleTime: 300_000,
  });
}

export function useTopAssists(leagueId: number, season: number) {
  return useQuery<TopScorersResponse, Error>({
    queryKey: ['top-assists', leagueId, season],
    queryFn: () => {
      if (USE_MOCK) return Promise.resolve(MOCK_MAP[leagueId] ?? mockLaLigaTopScorers);
      return fetchTopAssists(leagueId, season) as unknown as Promise<TopScorersResponse>;
    },
    staleTime: 300_000,
  });
}

export function useTopYellowCards(leagueId: number, season: number) {
  return useQuery<TopScorersResponse, Error>({
    queryKey: ['top-yellowcards', leagueId, season],
    queryFn: () => {
      if (USE_MOCK) return Promise.resolve(MOCK_MAP[leagueId] ?? mockLaLigaTopScorers);
      return fetchTopYellowCards(leagueId, season);
    },
    staleTime: 300_000,
  });
}
