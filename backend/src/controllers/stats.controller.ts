import { Request, Response } from 'express';
import { StatsService } from '../services/stats.service';

export class StatsController {
  /**
   * POST /api/stats/game
   * Record game statistics for a player
   */
  static async recordGameStats(req: Request, res: Response): Promise<void> {
    try {
      const gameStats = await StatsService.recordGameStats(req.body);

      res.status(201).json({
        success: true,
        data: gameStats,
        message: 'Game statistics recorded successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to record game statistics',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * GET /api/stats/player/:playerId/game/:gameId
   * Get player game statistics
   */
  static async getPlayerGameStats(req: Request, res: Response): Promise<void> {
    try {
      const { playerId, gameId } = req.params;

      const stats = await StatsService.getPlayerGameStats(playerId, gameId);

      if (!stats) {
        res.status(404).json({
          success: false,
          error: 'Game statistics not found',
        });
        return;
      }

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch game statistics',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * GET /api/stats/player/:playerId/season/:season
   * Get player season statistics
   */
  static async getPlayerSeasonStats(req: Request, res: Response): Promise<void> {
    try {
      const { playerId, season } = req.params;

      const stats = await StatsService.getPlayerSeasonStats(playerId, season);

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch season statistics',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * GET /api/stats/advanced/:playerId/:season
   * Get advanced metrics for a player
   */
  static async getAdvancedMetrics(req: Request, res: Response): Promise<void> {
    try {
      const { playerId, season } = req.params;

      const metrics = await StatsService.getAdvancedMetrics(playerId, season);

      if (!metrics) {
        res.status(404).json({
          success: false,
          error: 'Advanced metrics not found',
        });
        return;
      }

      res.json({
        success: true,
        data: metrics,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch advanced metrics',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * GET /api/stats/leaders/:season
   * Get league leaders for a specific stat
   */
  static async getLeagueLeaders(req: Request, res: Response): Promise<void> {
    try {
      const { season } = req.params;
      const { stat = 'points', limit = '10' } = req.query;

      const validStats = ['points', 'rebounds', 'assists', 'steals', 'blocks'];
      if (!validStats.includes(stat as string)) {
        res.status(400).json({
          success: false,
          error: 'Invalid stat parameter',
          message: `Stat must be one of: ${validStats.join(', ')}`,
        });
        return;
      }

      const leaders = await StatsService.getLeagueLeaders(
        season,
        stat as 'points' | 'rebounds' | 'assists' | 'steals' | 'blocks',
        parseInt(limit as string)
      );

      res.json({
        success: true,
        data: leaders,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch league leaders',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * DELETE /api/stats/player/:playerId/game/:gameId
   * Delete game statistics
   */
  static async deleteGameStats(req: Request, res: Response): Promise<void> {
    try {
      const { playerId, gameId } = req.params;

      await StatsService.deleteGameStats(playerId, gameId);

      res.json({
        success: true,
        message: 'Game statistics deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to delete game statistics',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
