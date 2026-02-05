import { Router } from 'express';
import { PlayerController } from '../controllers/player.controller';
import { validateBody, validateParams } from '../middleware/validation';
import {
  createPlayerSchema,
  updatePlayerSchema,
  playerIdSchema,
} from '../validators/player.validator';

const router = Router();

// GET /api/players - Get all players
router.get('/', PlayerController.getAllPlayers);

// GET /api/players/:id - Get player by ID
router.get('/:id', validateParams(playerIdSchema), PlayerController.getPlayerById);

// POST /api/players - Create new player
router.post('/', validateBody(createPlayerSchema), PlayerController.createPlayer);

// PUT /api/players/:id - Update player
router.put(
  '/:id',
  validateParams(playerIdSchema),
  validateBody(updatePlayerSchema),
  PlayerController.updatePlayer
);

// DELETE /api/players/:id - Delete player
router.delete('/:id', validateParams(playerIdSchema), PlayerController.deletePlayer);

// GET /api/players/:id/stats/:season - Get player season stats
router.get('/:id/stats/:season', PlayerController.getPlayerSeasonStats);

// GET /api/players/:id/games - Get player game logs
router.get('/:id/games', PlayerController.getPlayerGameLogs);

// GET /api/players/:id/seasons - Get player seasons
router.get('/:id/seasons', PlayerController.getPlayerSeasons);

export default router;
