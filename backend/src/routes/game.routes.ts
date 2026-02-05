import { Router } from 'express';
import { GameController } from '../controllers/game.controller';
import { validateBody, validateParams } from '../middleware/validation';
import {
  createGameSchema,
  updateGameSchema,
  gameIdSchema,
} from '../validators/game.validator';

const router = Router();

// GET /api/games - Get all games
router.get('/', GameController.getAllGames);

// GET /api/games/:id - Get game by ID
router.get('/:id', validateParams(gameIdSchema), GameController.getGameById);

// POST /api/games - Create new game
router.post('/', validateBody(createGameSchema), GameController.createGame);

// PUT /api/games/:id - Update game
router.put(
  '/:id',
  validateParams(gameIdSchema),
  validateBody(updateGameSchema),
  GameController.updateGame
);

// DELETE /api/games/:id - Delete game
router.delete('/:id', validateParams(gameIdSchema), GameController.deleteGame);

// GET /api/games/:id/boxscore - Get game box score
router.get('/:id/boxscore', GameController.getGameBoxScore);

export default router;
