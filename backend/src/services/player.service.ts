import prisma from '../config/database';
import { Player, Prisma } from '@prisma/client';
import { CreatePlayerInput, UpdatePlayerInput } from '../types';

export class PlayerService {
  /**
   * Get all players with optional filters
   */
  static async getAllPlayers(filters?: {
    teamId?: string;
    position?: string;
  }): Promise<Player[]> {
    const where: Prisma.PlayerWhereInput = {};

    if (filters?.teamId) {
      where.teamId = filters.teamId;
    }

    if (filters?.position) {
      where.position = filters.position as any;
    }

    return prisma.player.findMany({
      where,
      include: {
        team: {
          select: {
            id: true,
            name: true,
            city: true,
            abbreviation: true,
          },
        },
      },
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
    });
  }

  /**
   * Get player by ID
   */
  static async getPlayerById(id: string): Promise<Player | null> {
    return prisma.player.findUnique({
      where: { id },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            city: true,
            abbreviation: true,
          },
        },
      },
    });
  }

  /**
   * Create a new player
   */
  static async createPlayer(data: CreatePlayerInput): Promise<Player> {
    return prisma.player.create({
      data,
      include: {
        team: {
          select: {
            id: true,
            name: true,
            city: true,
            abbreviation: true,
          },
        },
      },
    });
  }

  /**
   * Update a player
   */
  static async updatePlayer(
    id: string,
    data: UpdatePlayerInput
  ): Promise<Player> {
    return prisma.player.update({
      where: { id },
      data,
      include: {
        team: {
          select: {
            id: true,
            name: true,
            city: true,
            abbreviation: true,
          },
        },
      },
    });
  }

  /**
   * Delete a player
   */
  static async deletePlayer(id: string): Promise<void> {
    await prisma.player.delete({
      where: { id },
    });
  }

  /**
   * Get player's season statistics
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
   * Get player's game logs
   */
  static async getPlayerGameLogs(
    playerId: string,
    options?: {
      season?: string;
      limit?: number;
    }
  ) {
    const where: Prisma.PlayerGameStatsWhereInput = {
      playerId,
    };

    if (options?.season) {
      where.game = {
        season: options.season,
      };
    }

    return prisma.playerGameStats.findMany({
      where,
      include: {
        game: {
          include: {
            homeTeam: {
              select: {
                id: true,
                name: true,
                abbreviation: true,
              },
            },
            awayTeam: {
              select: {
                id: true,
                name: true,
                abbreviation: true,
              },
            },
          },
        },
      },
      orderBy: {
        game: {
          gameDate: 'desc',
        },
      },
      take: options?.limit,
    });
  }

  /**
   * Get all seasons a player has played
   */
  static async getPlayerSeasons(playerId: string): Promise<string[]> {
    const seasons = await prisma.playerSeasonStats.findMany({
      where: { playerId },
      select: { season: true },
      orderBy: { season: 'desc' },
    });

    return seasons.map((s) => s.season);
  }
}
