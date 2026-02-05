import { Request, Response } from 'express';
import { TeamService } from '../services/team.service';

export class TeamController {
  /**
   * GET /api/teams
   * Get all teams
   */
  static async getAllTeams(req: Request, res: Response): Promise<void> {
    try {
      const { conference, division } = req.query;

      const teams = await TeamService.getAllTeams({
        conference: conference as string,
        division: division as string,
      });

      res.json({
        success: true,
        data: teams,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch teams',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * GET /api/teams/:id
   * Get team by ID
   */
  static async getTeamById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const team = await TeamService.getTeamById(id);

      if (!team) {
        res.status(404).json({
          success: false,
          error: 'Team not found',
        });
        return;
      }

      res.json({
        success: true,
        data: team,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch team',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * POST /api/teams
   * Create a new team
   */
  static async createTeam(req: Request, res: Response): Promise<void> {
    try {
      const team = await TeamService.createTeam(req.body);

      res.status(201).json({
        success: true,
        data: team,
        message: 'Team created successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to create team',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * PUT /api/teams/:id
   * Update a team
   */
  static async updateTeam(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const team = await TeamService.updateTeam(id, req.body);

      res.json({
        success: true,
        data: team,
        message: 'Team updated successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to update team',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * DELETE /api/teams/:id
   * Delete a team
   */
  static async deleteTeam(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      await TeamService.deleteTeam(id);

      res.json({
        success: true,
        message: 'Team deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to delete team',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * GET /api/teams/:id/roster
   * Get team roster
   */
  static async getTeamRoster(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const roster = await TeamService.getTeamRoster(id);

      res.json({
        success: true,
        data: roster,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch team roster',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * GET /api/teams/:id/games
   * Get team games
   */
  static async getTeamGames(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { season, limit } = req.query;

      const games = await TeamService.getTeamGames(id, {
        season: season as string,
        limit: limit ? parseInt(limit as string) : undefined,
      });

      res.json({
        success: true,
        data: games,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch team games',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * GET /api/teams/:id/stats/:season
   * Get team season statistics
   */
  static async getTeamSeasonStats(req: Request, res: Response): Promise<void> {
    try {
      const { id, season } = req.params;

      const stats = await TeamService.getTeamSeasonStats(id, season);

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch team statistics',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
