import type { TeamStatsResponse } from '@/lib/api/types';
import { laLigaLeague } from './leagues';
import { laLigaTeams } from './teams';

function goalTiming(vals: number[]) {
  const slots = ['0-15', '16-30', '31-45', '46-60', '61-75', '76-90', '91-105', '106-120'] as const;
  return Object.fromEntries(
    slots.map((s, i) => [s, { home: vals[i] ?? 0, away: 0, total: vals[i] ?? 0, percentage: null }])
  ) as Record<typeof slots[number], { home: number; away: number; total: number; percentage: null }>;
}

export const mockRealMadridStats: TeamStatsResponse = {
  team: laLigaTeams.realMadrid,
  statistics: {
    league: laLigaLeague,
    team: laLigaTeams.realMadrid,
    form: 'WWWDWWWWLWWWWDWWWWWWWWWDWWWWWWWWWWWLWW',
    fixtures: {
      played: { home: 19, away: 19, total: 38 },
      wins: { home: 16, away: 13, total: 29 },
      draws: { home: 2, away: 6, total: 8 },
      loses: { home: 1, away: 0, total: 1 },
    },
    goals: {
      for: {
        total: { home: 52, away: 35, total: 87 },
        average: { home: '2.74', away: '1.84', total: '2.29' },
        minute: goalTiming([12, 15, 14, 16, 18, 10, 2, 0]),
      },
      against: {
        total: { home: 19, away: 21, total: 40 },
        average: { home: '1.00', away: '1.11', total: '1.05' },
        minute: goalTiming([4, 5, 6, 8, 9, 6, 2, 0]),
      },
    },
    biggest: {
      streak: { wins: 10, draws: 2, loses: 1 },
      wins: { home: '5-0', away: '4-0' },
      loses: { home: '1-2', away: null },
      goals: {
        for: { home: 5, away: 4 },
        against: { home: 2, away: 2 },
      },
    },
    clean_sheet: { home: 10, away: 7, total: 17 },
    failed_to_score: { home: 1, away: 2, total: 3 },
    penalty: {
      scored: { home: '100%', away: '83%', percentage: '91%', total: 10 },
      missed: { home: '0%', away: '17%', percentage: '9%', total: 1 },
      total: 11,
    },
    lineups: [
      { formation: '4-3-3', played: 22 },
      { formation: '4-4-2', played: 10 },
      { formation: '4-2-3-1', played: 6 },
    ],
    cards: {
      yellow: goalTiming([2, 4, 5, 6, 8, 9, 1, 0]),
      red: goalTiming([0, 0, 0, 1, 0, 1, 0, 0]),
    },
  },
};

export const mockBarcelonaStats: TeamStatsResponse = {
  team: laLigaTeams.barcelona,
  statistics: {
    league: laLigaLeague,
    team: laLigaTeams.barcelona,
    form: 'WWDWWWWWLWWWWWWWWWWDWWWLWWWDWWWWWWWWWLW',
    fixtures: {
      played: { home: 19, away: 19, total: 38 },
      wins: { home: 14, away: 12, total: 26 },
      draws: { home: 4, away: 3, total: 7 },
      loses: { home: 1, away: 4, total: 5 },
    },
    goals: {
      for: {
        total: { home: 44, away: 35, total: 79 },
        average: { home: '2.32', away: '1.84', total: '2.08' },
        minute: goalTiming([10, 13, 12, 14, 16, 12, 2, 0]),
      },
      against: {
        total: { home: 19, away: 22, total: 41 },
        average: { home: '1.00', away: '1.16', total: '1.08' },
        minute: goalTiming([5, 6, 7, 8, 7, 6, 2, 0]),
      },
    },
    biggest: {
      streak: { wins: 8, draws: 3, loses: 2 },
      wins: { home: '4-0', away: '4-1' },
      loses: { home: '1-2', away: '0-3' },
      goals: {
        for: { home: 4, away: 4 },
        against: { home: 2, away: 3 },
      },
    },
    clean_sheet: { home: 9, away: 6, total: 15 },
    failed_to_score: { home: 2, away: 3, total: 5 },
    penalty: {
      scored: { home: '86%', away: '80%', percentage: '83%', total: 10 },
      missed: { home: '14%', away: '20%', percentage: '17%', total: 2 },
      total: 12,
    },
    lineups: [
      { formation: '4-3-3', played: 18 },
      { formation: '4-2-3-1', played: 14 },
      { formation: '3-4-3', played: 6 },
    ],
    cards: {
      yellow: goalTiming([3, 5, 6, 7, 9, 8, 1, 0]),
      red: goalTiming([0, 0, 1, 0, 1, 0, 0, 0]),
    },
  },
};
