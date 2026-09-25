import { useQuery } from '@tanstack/react-query';
import { fetchStandings } from '@/lib/api/client';
import { mockLaLigaStandings, mockCLStandings } from '@/data/mock';
import { REFETCH_INTERVALS } from '@/lib/constants';
import type { StandingsResponse } from '@/lib/api/types';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

const MOCK_MAP: Record<number, StandingsResponse> = {
  140: mockLaLigaStandings,
  2: mockCLStandings,
};

export interface UseStandingsOptions {
  /** Polling interval in ms. 0 = no polling. Default: STANDINGS (2 min). */
  refetchInterval?: number;
  /** Keep previous data while fetching (smooth UX on league switch). */
  keepPreviousData?: boolean;
}

export function useStandings(
  leagueId: number,
  season: number,
  options: UseStandingsOptions = {}
) {
  const {
    refetchInterval = 0,
    keepPreviousData = true,
  } = options;

  return useQuery<StandingsResponse, Error>({
    queryKey: ['standings', leagueId, season],
    queryFn: () => {
      if (USE_MOCK) {
        const mock = MOCK_MAP[leagueId] ?? mockLaLigaStandings;
        return Promise.resolve(mock);
      }
      return fetchStandings(leagueId, season);
    },
    refetchInterval: refetchInterval > 0 ? refetchInterval : false,
    placeholderData: keepPreviousData ? (prev) => prev : undefined,
    staleTime: 60_000,
  });
}
