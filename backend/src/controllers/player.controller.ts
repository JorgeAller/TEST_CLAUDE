import { Request, Response } from 'express';
import { PlayerService } from '../services/player.service';

export class PlayerController {
  /**
   * GET /api/players
   * Get all players with optional filters
   */
  static async getAllPlayers(req: Request, res: Response): Promise<void> {
    try {
      const { teamId, position } = req.query;

      const players = await PlayerService.getAllPlayers({
        teamId: teamId as string,
        position: position as string,
      });

      res.json({
        success: true,
        data: players,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch players',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * GET /api/players/:id
   * Get player by ID
   */
  static async getPlayerById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const player = await PlayerService.getPlayerById(id);

      if (!player) {
        res.status(404).json({
          success: false,
          error: 'Player not found',
        });
        return;
      }

      res.json({
        success: true,
        data: player,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch player',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * POST /api/players
   * Create a new player
   */
  static async createPlayer(req: Request, res: Response): Promise<void> {
    try {
      const player = await PlayerService.createPlayer(req.body);

      res.status(201).json({
        success: true,
        data: player,
        message: 'Player created successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to create player',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * PUT /api/players/:id
   * Update a player
   */
  static async updatePlayer(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const player = await PlayerService.updatePlayer(id, req.body);

      res.json({
        success: true,
        data: player,
        message: 'Player updated successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to update player',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * DELETE /api/players/:id
   * Delete a player
   */
  static async deletePlayer(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      await PlayerService.deletePlayer(id);

      res.json({
        success: true,
        message: 'Player deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to delete player',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * GET /api/players/:id/stats/:season
   * Get player season statistics
   */
  static async getPlayerSeasonStats(req: Request, res: Response): Promise<void> {
    try {
      const { id, season } = req.params;

      const stats = await PlayerService.getPlayerSeasonStats(id, season);

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch player stats',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * GET /api/players/:id/games
   * Get player game logs
   */
  static async getPlayerGameLogs(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { season, limit } = req.query;

      const gameLogs = await PlayerService.getPlayerGameLogs(id, {
        season: season as string,
        limit: limit ? parseInt(limit as string) : undefined,
      });

      res.json({
        success: true,
        data: gameLogs,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch game logs',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * GET /api/players/:id/seasons
   * Get all seasons a player has played
   */
  static async getPlayerSeasons(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const seasons = await PlayerService.getPlayerSeasons(id);

      res.json({
        success: true,
        data: seasons,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch player seasons',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
