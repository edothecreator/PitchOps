import { useQuery } from '@tanstack/react-query';
import { fetchTeamStats } from '@/lib/api/client';
import { mockRealMadridStats, mockBarcelonaStats } from '@/data/mock';
import type { TeamStatsResponse } from '@/lib/api/types';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

const MOCK_MAP: Record<number, TeamStatsResponse> = {
  541: mockRealMadridStats,
  529: mockBarcelonaStats,
};

export interface UseTeamStatsOptions {
  enabled?: boolean;
}

export function useTeamStats(
  teamId: number | null | undefined,
  leagueId: number,
  season: number,
  options: UseTeamStatsOptions = {}
) {
  const { enabled = true } = options;

  return useQuery<TeamStatsResponse, Error>({
    queryKey: ['team-stats', teamId, leagueId, season],
    queryFn: () => {
      if (!teamId) throw new Error('No team ID provided');
      if (USE_MOCK) {
        // Return available mock, fallback to Real Madrid data
        const mock = MOCK_MAP[teamId] ?? mockRealMadridStats;
        return Promise.resolve(mock);
      }
      return fetchTeamStats(teamId, leagueId, season);
    },
    enabled: enabled && !!teamId,
    staleTime: 300_000,
  });
}
