import { Position, GameStatus } from '@prisma/client';

// Re-export Prisma enums
export { Position, GameStatus };

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// Player Types
export interface PlayerWithTeam {
  id: string;
  firstName: string;
  lastName: string;
  position: Position;
  jerseyNumber: number | null;
  height: number | null;
  weight: number | null;
  birthDate: Date | null;
  team: {
    id: string;
    name: string;
    city: string;
    abbreviation: string;
  } | null;
}

export interface CreatePlayerInput {
  firstName: string;
  lastName: string;
  position: Position;
  jerseyNumber?: number;
  height?: number;
  weight?: number;
  birthDate?: Date;
  teamId?: string;
}

export interface UpdatePlayerInput {
  firstName?: string;
  lastName?: string;
  position?: Position;
  jerseyNumber?: number;
  height?: number;
  weight?: number;
  birthDate?: Date;
  teamId?: string;
}

// Team Types
export interface CreateTeamInput {
  name: string;
  city: string;
  abbreviation: string;
  conference: string;
  division: string;
}

export interface UpdateTeamInput {
  name?: string;
  city?: string;
  abbreviation?: string;
  conference?: string;
  division?: string;
}

// Game Types
export interface CreateGameInput {
  homeTeamId: string;
  awayTeamId: string;
  gameDate: Date;
  season: string;
  homeScore?: number;
  awayScore?: number;
  status?: GameStatus;
}

export interface UpdateGameInput {
  homeScore?: number;
  awayScore?: number;
  status?: GameStatus;
}

// Statistics Types
export interface CreateGameStatsInput {
  playerId: string;
  gameId: string;
  minutesPlayed: number;
  points: number;
  fieldGoalsMade: number;
  fieldGoalsAttempted: number;
  threePointersMade: number;
  threePointersAttempted: number;
  freeThrowsMade: number;
  freeThrowsAttempted: number;
  offensiveRebounds: number;
  defensiveRebounds: number;
  totalRebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  personalFouls: number;
  plusMinus?: number;
}

export interface PlayerStatsQuery {
  playerId?: string;
  gameId?: string;
  season?: string;
  startDate?: Date;
  endDate?: Date;
}

// Advanced Metrics Types
export interface AdvancedMetricsData {
  trueShootingPercentage: number;
  effectiveFieldGoalPercentage: number;
  playerEfficiencyRating: number;
  offensiveRating: number;
  defensiveRating: number;
  netRating: number;
  usageRate: number;
  assistPercentage: number;
  turnoverPercentage: number;
  pointsPer36: number;
  reboundsPer36: number;
  assistsPer36: number;
  stealsPer36: number;
  blocksPer36: number;
  assistToTurnoverRatio: number;
  stealPercentage: number;
  blockPercentage: number;
}

export interface SeasonStatsWithAdvanced {
  seasonStats: {
    gamesPlayed: number;
    avgPoints: number;
    avgRebounds: number;
    avgAssists: number;
    fieldGoalPercentage: number;
    threePointPercentage: number;
    freeThrowPercentage: number;
  };
  advancedMetrics: AdvancedMetricsData;
}
