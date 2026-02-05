import { Router } from 'express';
import playerRoutes from './player.routes';
import teamRoutes from './team.routes';
import gameRoutes from './game.routes';
import statsRoutes from './stats.routes';

const router = Router();

// API Routes
router.use('/players', playerRoutes);
router.use('/teams', teamRoutes);
router.use('/games', gameRoutes);
router.use('/stats', statsRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Basketball Stats API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
