import { Router } from 'express';
import { TeamController } from '../controllers/team.controller';
import { validateBody, validateParams } from '../middleware/validation';
import {
  createTeamSchema,
  updateTeamSchema,
  teamIdSchema,
} from '../validators/team.validator';

const router = Router();

// GET /api/teams - Get all teams
router.get('/', TeamController.getAllTeams);

// GET /api/teams/:id - Get team by ID
router.get('/:id', validateParams(teamIdSchema), TeamController.getTeamById);

// POST /api/teams - Create new team
router.post('/', validateBody(createTeamSchema), TeamController.createTeam);

// PUT /api/teams/:id - Update team
router.put(
  '/:id',
  validateParams(teamIdSchema),
  validateBody(updateTeamSchema),
  TeamController.updateTeam
);

// DELETE /api/teams/:id - Delete team
router.delete('/:id', validateParams(teamIdSchema), TeamController.deleteTeam);

// GET /api/teams/:id/roster - Get team roster
router.get('/:id/roster', TeamController.getTeamRoster);

// GET /api/teams/:id/games - Get team games
router.get('/:id/games', TeamController.getTeamGames);

// GET /api/teams/:id/stats/:season - Get team season stats
router.get('/:id/stats/:season', TeamController.getTeamSeasonStats);

export default router;
