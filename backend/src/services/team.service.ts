import prisma from '../config/database';
import { Team } from '@prisma/client';
import { CreateTeamInput, UpdateTeamInput } from '../types';

export class TeamService {
  /**
   * Get all teams
   */
  static async getAllTeams(filters?: {
    conference?: string;
    division?: string;
  }): Promise<Team[]> {
    const where: any = {};

    if (filters?.conference) {
      where.conference = filters.conference;
    }

    if (filters?.division) {
      where.division = filters.division;
    }

    return prisma.team.findMany({
      where,
      orderBy: [{ conference: 'asc' }, { division: 'asc' }, { name: 'asc' }],
    });
  }

  /**
   * Get team by ID
   */
  static async getTeamById(id: string): Promise<Team | null> {
    return prisma.team.findUnique({
      where: { id },
    });
  }

  /**
   * Create a new team
   */
  static async createTeam(data: CreateTeamInput): Promise<Team> {
    return prisma.team.create({
      data,
    });
  }

  /**
   * Update a team
   */
  static async updateTeam(id: string, data: UpdateTeamInput): Promise<Team> {
    return prisma.team.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete a team
   */
  static async deleteTeam(id: string): Promise<void> {
    await prisma.team.delete({
      where: { id },
    });
  }

  /**
   * Get team roster
   */
  static async getTeamRoster(teamId: string) {
    return prisma.player.findMany({
      where: { teamId },
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
    });
  }

  /**
   * Get team's games
   */
  static async getTeamGames(
    teamId: string,
    options?: {
      season?: string;
      limit?: number;
    }
  ) {
    const where: any = {
      OR: [{ homeTeamId: teamId }, { awayTeamId: teamId }],
    };

    if (options?.season) {
      where.season = options.season;
    }

    return prisma.game.findMany({
      where,
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
      orderBy: {
        gameDate: 'desc',
      },
      take: options?.limit,
    });
  }

  /**
   * Get team statistics for a season
   */
  static async getTeamSeasonStats(teamId: string, season: string) {
    // Get all players on the team
    const players = await prisma.player.findMany({
      where: { teamId },
      include: {
        seasonStats: {
          where: { season },
        },
      },
    });

    // Aggregate team totals
    const teamTotals = players.reduce(
      (acc, player) => {
        const stats = player.seasonStats[0];
        if (stats) {
          acc.totalPoints += stats.totalPoints;
          acc.totalRebounds += stats.totalRebounds;
          acc.totalAssists += stats.totalAssists;
          acc.gamesPlayed = Math.max(acc.gamesPlayed, stats.gamesPlayed);
        }
        return acc;
      },
      {
        totalPoints: 0,
        totalRebounds: 0,
        totalAssists: 0,
        gamesPlayed: 0,
      }
    );

    return {
      players: players.map((p) => ({
        player: {
          id: p.id,
          firstName: p.firstName,
          lastName: p.lastName,
          position: p.position,
        },
        stats: p.seasonStats[0] || null,
      })),
      teamTotals,
    };
  }
}
