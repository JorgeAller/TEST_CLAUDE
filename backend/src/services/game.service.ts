import prisma from '../config/database';
import { Game } from '@prisma/client';
import { CreateGameInput, UpdateGameInput } from '../types';

export class GameService {
  /**
   * Get all games with optional filters
   */
  static async getAllGames(filters?: {
    season?: string;
    teamId?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const where: any = {};

    if (filters?.season) {
      where.season = filters.season;
    }

    if (filters?.teamId) {
      where.OR = [
        { homeTeamId: filters.teamId },
        { awayTeamId: filters.teamId },
      ];
    }

    if (filters?.startDate || filters?.endDate) {
      where.gameDate = {};
      if (filters.startDate) {
        where.gameDate.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.gameDate.lte = filters.endDate;
      }
    }

    return prisma.game.findMany({
      where,
      include: {
        homeTeam: {
          select: {
            id: true,
            name: true,
            city: true,
            abbreviation: true,
          },
        },
        awayTeam: {
          select: {
            id: true,
            name: true,
            city: true,
            abbreviation: true,
          },
        },
      },
      orderBy: {
        gameDate: 'desc',
      },
    });
  }

  /**
   * Get game by ID
   */
  static async getGameById(id: string) {
    return prisma.game.findUnique({
      where: { id },
      include: {
        homeTeam: true,
        awayTeam: true,
        playerStats: {
          include: {
            player: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                position: true,
                jerseyNumber: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Create a new game
   */
  static async createGame(data: CreateGameInput): Promise<Game> {
    return prisma.game.create({
      data,
      include: {
        homeTeam: true,
        awayTeam: true,
      },
    });
  }

  /**
   * Update a game
   */
  static async updateGame(id: string, data: UpdateGameInput): Promise<Game> {
    return prisma.game.update({
      where: { id },
      data,
      include: {
        homeTeam: true,
        awayTeam: true,
      },
    });
  }

  /**
   * Delete a game
   */
  static async deleteGame(id: string): Promise<void> {
    await prisma.game.delete({
      where: { id },
    });
  }

  /**
   * Get game box score (all player stats for a game)
   */
  static async getGameBoxScore(gameId: string) {
    const game = await this.getGameById(gameId);

    if (!game) {
      throw new Error('Game not found');
    }

    // Separate stats by team
    const homeTeamStats = game.playerStats.filter(
      (stat) => stat.player && game.homeTeam.id === game.homeTeamId
    );

    const awayTeamStats = game.playerStats.filter(
      (stat) => stat.player && game.awayTeam.id === game.awayTeamId
    );

    return {
      game: {
        id: game.id,
        gameDate: game.gameDate,
        season: game.season,
        status: game.status,
        homeScore: game.homeScore,
        awayScore: game.awayScore,
      },
      homeTeam: {
        team: game.homeTeam,
        playerStats: homeTeamStats,
      },
      awayTeam: {
        team: game.awayTeam,
        playerStats: awayTeamStats,
      },
    };
  }
}
