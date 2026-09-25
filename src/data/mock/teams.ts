import type { Team } from '@/lib/api/types';

export const laLigaTeams: Record<string, Team> = {
  realMadrid:    { id: 541, name: 'Real Madrid',    shortName: 'RMA', logo: 'https://media.api-sports.io/football/teams/541.png',  country: 'Spain' },
  barcelona:     { id: 529, name: 'Barcelona',      shortName: 'BAR', logo: 'https://media.api-sports.io/football/teams/529.png',  country: 'Spain' },
  atleticoMadrid:{ id: 530, name: 'Atletico Madrid',shortName: 'ATM', logo: 'https://media.api-sports.io/football/teams/530.png',  country: 'Spain' },
  athleticBilbao:{ id: 531, name: 'Athletic Club',  shortName: 'ATH', logo: 'https://media.api-sports.io/football/teams/531.png',  country: 'Spain' },
  villarreal:    { id: 533, name: 'Villarreal',     shortName: 'VIL', logo: 'https://media.api-sports.io/football/teams/533.png',  country: 'Spain' },
  realSociedad:  { id: 548, name: 'Real Sociedad',  shortName: 'RSO', logo: 'https://media.api-sports.io/football/teams/548.png',  country: 'Spain' },
  betis:         { id: 543, name: 'Real Betis',     shortName: 'BET', logo: 'https://media.api-sports.io/football/teams/543.png',  country: 'Spain' },
  sevilla:       { id: 536, name: 'Sevilla',        shortName: 'SEV', logo: 'https://media.api-sports.io/football/teams/536.png',  country: 'Spain' },
  girona:        { id: 547, name: 'Girona',         shortName: 'GIR', logo: 'https://media.api-sports.io/football/teams/547.png',  country: 'Spain' },
  osasuna:       { id: 727, name: 'Osasuna',        shortName: 'OSA', logo: 'https://media.api-sports.io/football/teams/727.png',  country: 'Spain' },
  getafe:        { id: 546, name: 'Getafe',         shortName: 'GET', logo: 'https://media.api-sports.io/football/teams/546.png',  country: 'Spain' },
  valencia:      { id: 532, name: 'Valencia',       shortName: 'VAL', logo: 'https://media.api-sports.io/football/teams/532.png',  country: 'Spain' },
  rayo:          { id: 728, name: 'Rayo Vallecano', shortName: 'RAY', logo: 'https://media.api-sports.io/football/teams/728.png',  country: 'Spain' },
  mallorca:      { id: 798, name: 'Mallorca',       shortName: 'MAL', logo: 'https://media.api-sports.io/football/teams/798.png',  country: 'Spain' },
  celtaVigo:     { id: 538, name: 'Celta Vigo',     shortName: 'CEL', logo: 'https://media.api-sports.io/football/teams/538.png',  country: 'Spain' },
  laspalmas:     { id: 534, name: 'Las Palmas',     shortName: 'LPA', logo: 'https://media.api-sports.io/football/teams/534.png',  country: 'Spain' },
  espanyol:      { id: 540, name: 'Espanyol',       shortName: 'ESP', logo: 'https://media.api-sports.io/football/teams/540.png',  country: 'Spain' },
  valladolid:    { id: 720, name: 'Valladolid',     shortName: 'VLL', logo: 'https://media.api-sports.io/football/teams/720.png',  country: 'Spain' },
  leganes:       { id: 723, name: 'Leganés',        shortName: 'LEG', logo: 'https://media.api-sports.io/football/teams/723.png',  country: 'Spain' },
  alaves:        { id: 542, name: 'Alavés',         shortName: 'ALA', logo: 'https://media.api-sports.io/football/teams/542.png',  country: 'Spain' },
};

export const clTeams: Record<string, Team> = {
  realMadrid:  laLigaTeams.realMadrid,
  barcelona:   laLigaTeams.barcelona,
  manCity:     { id: 50,  name: 'Manchester City',  shortName: 'MCI', logo: 'https://media.api-sports.io/football/teams/50.png',  country: 'England' },
  liverpool:   { id: 40,  name: 'Liverpool',        shortName: 'LIV', logo: 'https://media.api-sports.io/football/teams/40.png',  country: 'England' },
  psg:         { id: 85,  name: 'Paris SG',         shortName: 'PSG', logo: 'https://media.api-sports.io/football/teams/85.png',  country: 'France'  },
  bayernMunich:{ id: 157, name: 'Bayern München',   shortName: 'BAY', logo: 'https://media.api-sports.io/football/teams/157.png', country: 'Germany' },
  dortmund:    { id: 165, name: 'Borussia Dortmund',shortName: 'BVB', logo: 'https://media.api-sports.io/football/teams/165.png', country: 'Germany' },
  interMilan:  { id: 505, name: 'Inter Milan',      shortName: 'INT', logo: 'https://media.api-sports.io/football/teams/505.png', country: 'Italy'   },
  acMilan:     { id: 489, name: 'AC Milan',         shortName: 'MIL', logo: 'https://media.api-sports.io/football/teams/489.png', country: 'Italy'   },
  juventus:    { id: 496, name: 'Juventus',         shortName: 'JUV', logo: 'https://media.api-sports.io/football/teams/496.png', country: 'Italy'   },
  arsenal:     { id: 42,  name: 'Arsenal',          shortName: 'ARS', logo: 'https://media.api-sports.io/football/teams/42.png',  country: 'England' },
  chelsea:     { id: 49,  name: 'Chelsea',          shortName: 'CHE', logo: 'https://media.api-sports.io/football/teams/49.png',  country: 'England' },
};

export const plTeams: Record<string, Team> = {
  manCity:   clTeams.manCity,
  liverpool: clTeams.liverpool,
  arsenal:   clTeams.arsenal,
  chelsea:   clTeams.chelsea,
  manUnited: { id: 33,  name: 'Manchester Utd',  shortName: 'MUN', logo: 'https://media.api-sports.io/football/teams/33.png',  country: 'England' },
  tottenham: { id: 47,  name: 'Tottenham',        shortName: 'TOT', logo: 'https://media.api-sports.io/football/teams/47.png',  country: 'England' },
  newcastle: { id: 34,  name: 'Newcastle',        shortName: 'NEW', logo: 'https://media.api-sports.io/football/teams/34.png',  country: 'England' },
  astonVilla:{ id: 66,  name: 'Aston Villa',      shortName: 'AVL', logo: 'https://media.api-sports.io/football/teams/66.png',  country: 'England' },
};
