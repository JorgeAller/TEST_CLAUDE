import prisma from '../config/database';
import { Decimal } from '@prisma/client/runtime/library';

interface GameStatsData {
  minutesPlayed: Decimal;
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
}

interface TeamTotals {
  totalFieldGoalsAttempted: number;
  totalFreeThrowsAttempted: number;
  totalTurnovers: number;
  totalOffensiveRebounds: number;
  totalMinutes: number;
}

/**
 * Advanced Metrics Service
 * Implements NBA-standard advanced statistical calculations
 */
export class AdvancedMetricsService {
  /**
   * Calculate True Shooting Percentage
   * TS% = PTS / (2 * (FGA + 0.44 * FTA))
   * Measures shooting efficiency accounting for 2PT, 3PT, and FT
   */
  static calculateTrueShootingPercentage(
    points: number,
    fga: number,
    fta: number
  ): number {
    const denominator = 2 * (fga + 0.44 * fta);
    if (denominator === 0) return 0;
    return points / denominator;
  }

  /**
   * Calculate Effective Field Goal Percentage
   * eFG% = (FGM + 0.5 * 3PM) / FGA
   * Adjusts FG% to account for 3-pointers being worth more
   */
  static calculateEffectiveFieldGoalPercentage(
    fgm: number,
    threePM: number,
    fga: number
  ): number {
    if (fga === 0) return 0;
    return (fgm + 0.5 * threePM) / fga;
  }

  /**
   * Calculate Usage Rate
   * USG% = 100 * ((FGA + 0.44 * FTA + TOV) * (Tm MP / 5)) / (MP * (Tm FGA + 0.44 * Tm FTA + Tm TOV))
   * Estimates percentage of team plays used by a player while on court
   */
  static calculateUsageRate(
    playerStats: GameStatsData,
    teamTotals: TeamTotals
  ): number {
    const playerMinutes = Number(playerStats.minutesPlayed);
    if (playerMinutes === 0 || teamTotals.totalMinutes === 0) return 0;

    const playerPlays =
      playerStats.fieldGoalsAttempted +
      0.44 * playerStats.freeThrowsAttempted +
      playerStats.turnovers;

    const teamPlays =
      teamTotals.totalFieldGoalsAttempted +
      0.44 * teamTotals.totalFreeThrowsAttempted +
      teamTotals.totalTurnovers;

    const teamMinutesPerPlayer = teamTotals.totalMinutes / 5;

    if (teamPlays === 0) return 0;

    return (
      (100 * playerPlays * teamMinutesPerPlayer) /
      (playerMinutes * teamPlays)
    );
  }

  /**
   * Calculate Assist Percentage
   * AST% = 100 * AST / (((MP / (Tm MP / 5)) * Tm FG) - FG)
   * Estimates percentage of teammate field goals a player assisted while on court
   */
  static calculateAssistPercentage(
    assists: number,
    minutesPlayed: number,
    teamMinutes: number,
    teamFieldGoalsMade: number,
    playerFieldGoalsMade: number
  ): number {
    if (minutesPlayed === 0 || teamMinutes === 0) return 0;

    const teamMinutesPerPlayer = teamMinutes / 5;
    const possibleAssists =
      (minutesPlayed / teamMinutesPerPlayer) * teamFieldGoalsMade -
      playerFieldGoalsMade;

    if (possibleAssists === 0) return 0;

    return (100 * assists) / possibleAssists;
  }

  /**
   * Calculate Turnover Percentage
   * TOV% = 100 * TOV / (FGA + 0.44 * FTA + TOV)
   * Estimates turnovers per 100 plays
   */
  static calculateTurnoverPercentage(
    turnovers: number,
    fga: number,
    fta: number
  ): number {
    const plays = fga + 0.44 * fta + turnovers;
    if (plays === 0) return 0;
    return (100 * turnovers) / plays;
  }

  /**
   * Calculate Per-36-Minutes statistics
   * Normalizes stats to a 36-minute game for comparison
   */
  static calculatePer36Stats(
    stat: number,
    minutesPlayed: number
  ): number {
    if (minutesPlayed === 0) return 0;
    return (stat * 36) / minutesPlayed;
  }

  /**
   * Calculate Player Efficiency Rating (PER)
   * Simplified PER calculation based on box score stats
   * Full PER requires league averages and pace factors
   */
  static calculateSimplifiedPER(stats: GameStatsData): number {
    const minutes = Number(stats.minutesPlayed);
    if (minutes === 0) return 0;

    // Positive contributions
    const positiveActions =
      stats.points +
      stats.totalRebounds +
      stats.assists +
      stats.steals +
      stats.blocks;

    // Negative contributions
    const negativeActions =
      stats.fieldGoalsAttempted -
      stats.fieldGoalsMade +
      stats.freeThrowsAttempted -
      stats.freeThrowsMade +
      stats.turnovers;

    // Simplified PER formula (scaled to per-minute basis)
    const per = ((positiveActions - negativeActions) / minutes) * 15;

    return Math.max(0, per); // PER cannot be negative
  }

  /**
   * Calculate Offensive Rating (simplified)
   * ORtg = (Points Produced / Possessions Used) * 100
   * Estimates points produced per 100 possessions
   */
  static calculateOffensiveRating(stats: GameStatsData): number {
    // Possessions used approximation
    const possessions =
      stats.fieldGoalsAttempted +
      0.44 * stats.freeThrowsAttempted +
      stats.turnovers;

    if (possessions === 0) return 0;

    // Points produced (including assists contribution)
    const pointsProduced = stats.points + 2 * stats.assists;

    return (pointsProduced / possessions) * 100;
  }

  /**
   * Calculate Defensive Rating (simplified)
   * DRtg estimates points allowed per 100 possessions
   * This is a simplified version; full calculation requires opponent data
   */
  static calculateDefensiveRating(stats: GameStatsData): number {
    const minutes = Number(stats.minutesPlayed);
    if (minutes === 0) return 110; // League average default

    // Defensive contributions
    const defensiveStops =
      stats.defensiveRebounds + stats.steals + stats.blocks;

    // Simplified defensive rating (lower is better)
    // Scale based on defensive contributions per minute
    const stopsPerMinute = defensiveStops / minutes;
    const baseRating = 110; // League average
    const adjustment = stopsPerMinute * 20; // Each stop per minute reduces rating

    return Math.max(85, baseRating - adjustment); // Floor at 85 (elite defense)
  }

  /**
   * Calculate all advanced metrics for a player's season
   */
  static async calculateSeasonAdvancedMetrics(
    playerId: string,
    season: string
  ): Promise<{
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
  }> {
    // Get season stats
    const seasonStats = await prisma.playerSeasonStats.findUnique({
      where: {
        playerId_season: {
          playerId,
          season,
        },
      },
    });

    if (!seasonStats) {
      throw new Error('Season stats not found');
    }

    const totalMinutes = Number(seasonStats.totalMinutes);

    // Calculate shooting percentages
    const tsPercent = this.calculateTrueShootingPercentage(
      seasonStats.totalPoints,
      seasonStats.totalFieldGoalsAttempted,
      seasonStats.totalFreeThrowsAttempted
    );

    const efgPercent = this.calculateEffectiveFieldGoalPercentage(
      seasonStats.totalFieldGoalsMade,
      seasonStats.totalThreePointersMade,
      seasonStats.totalFieldGoalsAttempted
    );

    // Calculate per-36 stats
    const pointsPer36 = this.calculatePer36Stats(
      seasonStats.totalPoints,
      totalMinutes
    );
    const reboundsPer36 = this.calculatePer36Stats(
      seasonStats.totalRebounds,
      totalMinutes
    );
    const assistsPer36 = this.calculatePer36Stats(
      seasonStats.totalAssists,
      totalMinutes
    );
    const stealsPer36 = this.calculatePer36Stats(
      seasonStats.totalSteals,
      totalMinutes
    );
    const blocksPer36 = this.calculatePer36Stats(
      seasonStats.totalBlocks,
      totalMinutes
    );

    // Calculate assist to turnover ratio
    const assistToTurnoverRatio =
      seasonStats.totalTurnovers > 0
        ? seasonStats.totalAssists / seasonStats.totalTurnovers
        : seasonStats.totalAssists;

    // Simplified PER, ORtg, DRtg (would need game-by-game data for accuracy)
    const avgStats: GameStatsData = {
      minutesPlayed: new Decimal(Number(seasonStats.avgMinutes)),
      points: Number(seasonStats.avgPoints),
      fieldGoalsMade: Math.round(
        seasonStats.totalFieldGoalsMade / seasonStats.gamesPlayed
      ),
      fieldGoalsAttempted: Math.round(
        seasonStats.totalFieldGoalsAttempted / seasonStats.gamesPlayed
      ),
      threePointersMade: Math.round(
        seasonStats.totalThreePointersMade / seasonStats.gamesPlayed
      ),
      threePointersAttempted: Math.round(
        seasonStats.totalThreePointersAttempted / seasonStats.gamesPlayed
      ),
      freeThrowsMade: Math.round(
        seasonStats.totalFreeThrowsMade / seasonStats.gamesPlayed
      ),
      freeThrowsAttempted: Math.round(
        seasonStats.totalFreeThrowsAttempted / seasonStats.gamesPlayed
      ),
      offensiveRebounds: Math.round(
        seasonStats.totalOffensiveRebounds / seasonStats.gamesPlayed
      ),
      defensiveRebounds: Math.round(
        seasonStats.totalDefensiveRebounds / seasonStats.gamesPlayed
      ),
      totalRebounds: Math.round(
        seasonStats.totalRebounds / seasonStats.gamesPlayed
      ),
      assists: Math.round(seasonStats.totalAssists / seasonStats.gamesPlayed),
      steals: Math.round(seasonStats.totalSteals / seasonStats.gamesPlayed),
      blocks: Math.round(seasonStats.totalBlocks / seasonStats.gamesPlayed),
      turnovers: Math.round(
        seasonStats.totalTurnovers / seasonStats.gamesPlayed
      ),
      personalFouls: Math.round(
        seasonStats.totalPersonalFouls / seasonStats.gamesPlayed
      ),
    };

    const per = this.calculateSimplifiedPER(avgStats);
    const oRtg = this.calculateOffensiveRating(avgStats);
    const dRtg = this.calculateDefensiveRating(avgStats);

    const tovPercent = this.calculateTurnoverPercentage(
      seasonStats.totalTurnovers,
      seasonStats.totalFieldGoalsAttempted,
      seasonStats.totalFreeThrowsAttempted
    );

    return {
      trueShootingPercentage: tsPercent,
      effectiveFieldGoalPercentage: efgPercent,
      playerEfficiencyRating: per,
      offensiveRating: oRtg,
      defensiveRating: dRtg,
      netRating: oRtg - dRtg,
      usageRate: 20, // Would need team data for accurate calculation
      assistPercentage: 15, // Would need team data for accurate calculation
      turnoverPercentage: tovPercent,
      pointsPer36,
      reboundsPer36,
      assistsPer36,
      stealsPer36,
      blocksPer36,
      assistToTurnoverRatio,
    };
  }

  /**
   * Save or update advanced metrics for a player's season
   */
  static async saveAdvancedMetrics(
    playerId: string,
    season: string
  ): Promise<void> {
    const metrics = await this.calculateSeasonAdvancedMetrics(playerId, season);

    await prisma.advancedMetrics.upsert({
      where: {
        playerId_season: {
          playerId,
          season,
        },
      },
      create: {
        playerId,
        season,
        ...metrics,
      },
      update: metrics,
    });
  }
}
