import prisma from '../config/database';
import { Prisma, Decimal } from '@prisma/client';
import { CreateGameStatsInput } from '../types';
import { AdvancedMetricsService } from './advanced-metrics.service';

export class StatsService {
  /**
   * Record game statistics for a player
   */
  static async recordGameStats(data: CreateGameStatsInput) {
    // Create the game stats
    const gameStats = await prisma.playerGameStats.create({
      data: {
        ...data,
        minutesPlayed: new Decimal(data.minutesPlayed),
      },
      include: {
        player: true,
        game: true,
      },
    });

    // Update season stats asynchronously
    const season = gameStats.game.season;
    await this.updateSeasonStats(data.playerId, season);

    return gameStats;
  }

  /**
   * Update or create season statistics for a player
   */
  static async updateSeasonStats(
    playerId: string,
    season: string
  ): Promise<void> {
    // Get all game stats for this player in this season
    const gameStats = await prisma.playerGameStats.findMany({
      where: {
        playerId,
        game: {
          season,
        },
      },
    });

    if (gameStats.length === 0) {
      return;
    }

    // Calculate totals
    const totals = gameStats.reduce(
      (acc, game) => {
        acc.gamesPlayed += 1;
        acc.totalMinutes = acc.totalMinutes.plus(game.minutesPlayed);
        acc.totalPoints += game.points;
        acc.totalFieldGoalsMade += game.fieldGoalsMade;
        acc.totalFieldGoalsAttempted += game.fieldGoalsAttempted;
        acc.totalThreePointersMade += game.threePointersMade;
        acc.totalThreePointersAttempted += game.threePointersAttempted;
        acc.totalFreeThrowsMade += game.freeThrowsMade;
        acc.totalFreeThrowsAttempted += game.freeThrowsAttempted;
        acc.totalOffensiveRebounds += game.offensiveRebounds;
        acc.totalDefensiveRebounds += game.defensiveRebounds;
        acc.totalRebounds += game.totalRebounds;
        acc.totalAssists += game.assists;
        acc.totalSteals += game.steals;
        acc.totalBlocks += game.blocks;
        acc.totalTurnovers += game.turnovers;
        acc.totalPersonalFouls += game.personalFouls;
        return acc;
      },
      {
        gamesPlayed: 0,
        totalMinutes: new Decimal(0),
        totalPoints: 0,
        totalFieldGoalsMade: 0,
        totalFieldGoalsAttempted: 0,
        totalThreePointersMade: 0,
        totalThreePointersAttempted: 0,
        totalFreeThrowsMade: 0,
        totalFreeThrowsAttempted: 0,
        totalOffensiveRebounds: 0,
        totalDefensiveRebounds: 0,
        totalRebounds: 0,
        totalAssists: 0,
        totalSteals: 0,
        totalBlocks: 0,
        totalTurnovers: 0,
        totalPersonalFouls: 0,
      }
    );

    // Calculate averages
    const avgPoints = new Decimal(totals.totalPoints).dividedBy(
      totals.gamesPlayed
    );
    const avgRebounds = new Decimal(totals.totalRebounds).dividedBy(
      totals.gamesPlayed
    );
    const avgAssists = new Decimal(totals.totalAssists).dividedBy(
      totals.gamesPlayed
    );
    const avgMinutes = totals.totalMinutes.dividedBy(totals.gamesPlayed);

    // Calculate percentages
    const fgPercentage =
      totals.totalFieldGoalsAttempted > 0
        ? new Decimal(totals.totalFieldGoalsMade).dividedBy(
            totals.totalFieldGoalsAttempted
          )
        : null;

    const threePtPercentage =
      totals.totalThreePointersAttempted > 0
        ? new Decimal(totals.totalThreePointersMade).dividedBy(
            totals.totalThreePointersAttempted
          )
        : null;

    const ftPercentage =
      totals.totalFreeThrowsAttempted > 0
        ? new Decimal(totals.totalFreeThrowsMade).dividedBy(
            totals.totalFreeThrowsAttempted
          )
        : null;

    // Upsert season stats
    await prisma.playerSeasonStats.upsert({
      where: {
        playerId_season: {
          playerId,
          season,
        },
      },
      create: {
        playerId,
        season,
        ...totals,
        avgPoints,
        avgRebounds,
        avgAssists,
        avgMinutes,
        fieldGoalPercentage: fgPercentage,
        threePointPercentage: threePtPercentage,
        freeThrowPercentage: ftPercentage,
        gamesStarted: 0, // Would need additional data
      },
      update: {
        ...totals,
        avgPoints,
        avgRebounds,
        avgAssists,
        avgMinutes,
        fieldGoalPercentage: fgPercentage,
        threePointPercentage: threePtPercentage,
        freeThrowPercentage: ftPercentage,
      },
    });

    // Calculate and save advanced metrics
    await AdvancedMetricsService.saveAdvancedMetrics(playerId, season);
  }

  /**
   * Get player game statistics
   */
  static async getPlayerGameStats(playerId: string, gameId: string) {
    return prisma.playerGameStats.findUnique({
      where: {
        playerId_gameId: {
          playerId,
          gameId,
        },
      },
      include: {
        player: true,
        game: {
          include: {
            homeTeam: true,
            awayTeam: true,
          },
        },
      },
    });
  }

  /**
   * Get player season statistics
   */
  static async getPlayerSeasonStats(playerId: string, season: string) {
    const seasonStats = await prisma.playerSeasonStats.findUnique({
      where: {
        playerId_season: {
          playerId,
          season,
        },
      },
    });

    const advancedMetrics = await prisma.advancedMetrics.findUnique({
      where: {
        playerId_season: {
          playerId,
          season,
        },
      },
    });

    return {
      seasonStats,
      advancedMetrics,
    };
  }

  /**
   * Get advanced metrics for a player
   */
  static async getAdvancedMetrics(playerId: string, season: string) {
    return prisma.advancedMetrics.findUnique({
      where: {
        playerId_season: {
          playerId,
          season,
        },
      },
    });
  }

  /**
   * Get league leaders for a specific stat
   */
  static async getLeagueLeaders(
    season: string,
    stat: 'points' | 'rebounds' | 'assists' | 'steals' | 'blocks',
    limit: number = 10
  ) {
    const orderByField: Record<typeof stat, Prisma.PlayerSeasonStatsOrderByWithRelationInput> = {
      points: { avgPoints: 'desc' },
      rebounds: { avgRebounds: 'desc' },
      assists: { avgAssists: 'desc' },
      steals: { totalSteals: 'desc' },
      blocks: { totalBlocks: 'desc' },
    };

    return prisma.playerSeasonStats.findMany({
      where: {
        season,
        gamesPlayed: {
          gte: 10, // Minimum games played
        },
      },
      include: {
        player: {
          include: {
            team: {
              select: {
                id: true,
                name: true,
                abbreviation: true,
              },
            },
          },
        },
      },
      orderBy: orderByField[stat],
      take: limit,
    });
  }

  /**
   * Delete game statistics
   */
  static async deleteGameStats(playerId: string, gameId: string) {
    const gameStats = await prisma.playerGameStats.findUnique({
      where: {
        playerId_gameId: {
          playerId,
          gameId,
        },
      },
      include: {
        game: true,
      },
    });

    if (!gameStats) {
      throw new Error('Game stats not found');
    }

    await prisma.playerGameStats.delete({
      where: {
        playerId_gameId: {
          playerId,
          gameId,
        },
      },
    });

    // Recalculate season stats
    await this.updateSeasonStats(playerId, gameStats.game.season);
  }
}
