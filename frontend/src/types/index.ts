// Type definitions matching Prisma schema

export enum Position {
  PG = 'PG',  // Point Guard
  SG = 'SG',  // Shooting Guard
  SF = 'SF',  // Small Forward
  PF = 'PF',  // Power Forward
  C = 'C',    // Center
}

export enum GameStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  POSTPONED = 'POSTPONED',
  CANCELLED = 'CANCELLED',
}

export interface Team {
  id: string;
  name: string;
  city: string;
  abbreviation: string;
  conference: string;
  division: string;
  createdAt: string;
  updatedAt: string;
}

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  position: Position;
  jerseyNumber?: number;
  height?: number; // in centimeters
  weight?: number; // in kilograms
  birthDate?: string;
  teamId?: string;
  team?: Team;
  createdAt: string;
  updatedAt: string;
}

export interface Game {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  gameDate: string;
  season: string;
  homeScore?: number;
  awayScore?: number;
  status: GameStatus;
  homeTeam?: Team;
  awayTeam?: Team;
  createdAt: string;
  updatedAt: string;
}

export interface PlayerGameStats {
  id: string;
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
  player?: Player;
  game?: Game;
  createdAt: string;
  updatedAt: string;
}

export interface PlayerSeasonStats {
  id: string;
  playerId: string;
  season: string;
  gamesPlayed: number;
  gamesStarted?: number;
  totalMinutes: number;
  totalPoints: number;
  totalFieldGoalsMade: number;
  totalFieldGoalsAttempted: number;
  totalThreePointersMade: number;
  totalThreePointersAttempted: number;
  totalFreeThrowsMade: number;
  totalFreeThrowsAttempted: number;
  totalOffensiveRebounds: number;
  totalDefensiveRebounds: number;
  totalRebounds: number;
  totalAssists: number;
  totalSteals: number;
  totalBlocks: number;
  totalTurnovers: number;
  totalPersonalFouls: number;
  avgPoints: number;
  avgRebounds: number;
  avgAssists: number;
  avgMinutes: number;
  fieldGoalPercentage?: number;
  threePointPercentage?: number;
  freeThrowPercentage?: number;
  player?: Player;
  createdAt: string;
  updatedAt: string;
}

export interface AdvancedMetrics {
  id: string;
  playerId: string;
  season: string;
  trueShootingPercentage?: number;
  effectiveFieldGoalPercentage?: number;
  playerEfficiencyRating?: number;
  offensiveRating?: number;
  defensiveRating?: number;
  netRating?: number;
  usageRate?: number;
  assistPercentage?: number;
  turnoverPercentage?: number;
  pointsPer36?: number;
  reboundsPer36?: number;
  assistsPer36?: number;
  stealsPer36?: number;
  blocksPer36?: number;
  assistToTurnoverRatio?: number;
  stealPercentage?: number;
  blockPercentage?: number;
  player?: Player;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

// Filter and Sort Types
export interface PlayerFilters {
  teamId?: string;
  position?: Position;
  season?: string;
  search?: string;
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

// Extended Player with Stats
export interface PlayerWithStats extends Player {
  seasonStats?: PlayerSeasonStats;
  advancedMetrics?: AdvancedMetrics;
}

// Shot Chart Data
export interface ShotData {
  x: number; // Court x-coordinate (0-94 feet)
  y: number; // Court y-coordinate (0-50 feet)
  made: boolean;
  distance: number; // in feet
  shotType: 'layup' | 'dunk' | 'midrange' | 'three' | 'other';
  quarter?: number;
  timeRemaining?: string;
}

export interface ShotChartData {
  playerId: string;
  gameId?: string;
  season?: string;
  shots: ShotData[];
}

// API Response wrapper
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// Player input types
export interface CreatePlayerInput {
  firstName: string;
  lastName: string;
  position: Position;
  jerseyNumber?: number;
  height?: number;
  weight?: number;
  birthDate?: string;
  teamId?: string;
}

export interface UpdatePlayerInput extends Partial<CreatePlayerInput> {}

// Combined stats type
export interface PlayerStatsWithAdvanced {
  seasonStats: PlayerSeasonStats;
  advancedMetrics: AdvancedMetrics;
}
