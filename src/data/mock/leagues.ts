import type { League } from '@/lib/api/types';

export const mockLeagues: Record<number, League> = {
  39:  { id: 39,  name: 'Premier League',  country: 'England', logo: 'https://media.api-sports.io/football/leagues/39.png',  flag: 'https://media.api-sports.io/flags/gb.svg',  season: 2024 },
  140: { id: 140, name: 'La Liga',         country: 'Spain',   logo: 'https://media.api-sports.io/football/leagues/140.png', flag: 'https://media.api-sports.io/flags/es.svg',  season: 2024 },
  78:  { id: 78,  name: 'Bundesliga',      country: 'Germany', logo: 'https://media.api-sports.io/football/leagues/78.png',  flag: 'https://media.api-sports.io/flags/de.svg',  season: 2024 },
  135: { id: 135, name: 'Serie A',         country: 'Italy',   logo: 'https://media.api-sports.io/football/leagues/135.png', flag: 'https://media.api-sports.io/flags/it.svg',  season: 2024 },
  61:  { id: 61,  name: 'Ligue 1',         country: 'France',  logo: 'https://media.api-sports.io/football/leagues/61.png',  flag: 'https://media.api-sports.io/flags/fr.svg',  season: 2024 },
  2:   { id: 2,   name: 'Champions League',country: 'Europe',  logo: 'https://media.api-sports.io/football/leagues/2.png',   flag: '',                                            season: 2024 },
  3:   { id: 3,   name: 'Europa League',   country: 'Europe',  logo: 'https://media.api-sports.io/football/leagues/3.png',   flag: '',                                            season: 2024 },
};

export const laLigaLeague   = mockLeagues[140];
export const clLeague        = mockLeagues[2];
export const plLeague        = mockLeagues[39];
export const bundesligaLeague= mockLeagues[78];
export const serieALeague    = mockLeagues[135];
export const ligue1League    = mockLeagues[61];
export const elLeague        = mockLeagues[3];
