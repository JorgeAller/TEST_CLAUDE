import { Router } from 'express';
import { StatsController } from '../controllers/stats.controller';
import { validateBody } from '../middleware/validation';
import { createGameStatsSchema } from '../validators/stats.validator';

const router = Router();

// POST /api/stats/game - Record game statistics
router.post('/game', validateBody(createGameStatsSchema), StatsController.recordGameStats);

// GET /api/stats/player/:playerId/game/:gameId - Get player game stats
router.get('/player/:playerId/game/:gameId', StatsController.getPlayerGameStats);

// GET /api/stats/player/:playerId/season/:season - Get player season stats
router.get('/player/:playerId/season/:season', StatsController.getPlayerSeasonStats);

// GET /api/stats/advanced/:playerId/:season - Get advanced metrics
router.get('/advanced/:playerId/:season', StatsController.getAdvancedMetrics);

// GET /api/stats/leaders/:season - Get league leaders
router.get('/leaders/:season', StatsController.getLeagueLeaders);

// DELETE /api/stats/player/:playerId/game/:gameId - Delete game stats
router.delete('/player/:playerId/game/:gameId', StatsController.deleteGameStats);

export default router;
