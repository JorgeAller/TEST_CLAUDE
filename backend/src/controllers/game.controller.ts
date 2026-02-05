import { Request, Response } from 'express';
import { GameService } from '../services/game.service';

export class GameController {
  /**
   * GET /api/games
   * Get all games with optional filters
   */
  static async getAllGames(req: Request, res: Response): Promise<void> {
    try {
      const { season, teamId, startDate, endDate } = req.query;

      const games = await GameService.getAllGames({
        season: season as string,
        teamId: teamId as string,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
      });

      res.json({
        success: true,
        data: games,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch games',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * GET /api/games/:id
   * Get game by ID
   */
  static async getGameById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const game = await GameService.getGameById(id);

      if (!game) {
        res.status(404).json({
          success: false,
          error: 'Game not found',
        });
        return;
      }

      res.json({
        success: true,
        data: game,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch game',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * POST /api/games
   * Create a new game
   */
  static async createGame(req: Request, res: Response): Promise<void> {
    try {
      const game = await GameService.createGame(req.body);

      res.status(201).json({
        success: true,
        data: game,
        message: 'Game created successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to create game',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * PUT /api/games/:id
   * Update a game
   */
  static async updateGame(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const game = await GameService.updateGame(id, req.body);

      res.json({
        success: true,
        data: game,
        message: 'Game updated successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to update game',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * DELETE /api/games/:id
   * Delete a game
   */
  static async deleteGame(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      await GameService.deleteGame(id);

      res.json({
        success: true,
        message: 'Game deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to delete game',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * GET /api/games/:id/boxscore
   * Get game box score
   */
  static async getGameBoxScore(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const boxScore = await GameService.getGameBoxScore(id);

      res.json({
        success: true,
        data: boxScore,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch box score',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
