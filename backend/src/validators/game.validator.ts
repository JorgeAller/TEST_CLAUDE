import { z } from 'zod';
import { GameStatus } from '@prisma/client';

export const createGameSchema = z.object({
  homeTeamId: z.string().uuid('Invalid home team ID'),
  awayTeamId: z.string().uuid('Invalid away team ID'),
  gameDate: z.coerce.date(),
  season: z.string().regex(/^\d{4}-\d{2}$/, 'Season must be in format YYYY-YY (e.g., 2023-24)'),
  homeScore: z.number().int().min(0).optional(),
  awayScore: z.number().int().min(0).optional(),
  status: z.nativeEnum(GameStatus).optional(),
}).refine((data) => data.homeTeamId !== data.awayTeamId, {
  message: 'Home team and away team must be different',
  path: ['awayTeamId'],
});

export const updateGameSchema = z.object({
  homeScore: z.number().int().min(0).optional(),
  awayScore: z.number().int().min(0).optional(),
  status: z.nativeEnum(GameStatus).optional(),
});

export const gameIdSchema = z.object({
  id: z.string().uuid('Invalid game ID'),
});

export type CreateGameInput = z.infer<typeof createGameSchema>;
export type UpdateGameInput = z.infer<typeof updateGameSchema>;
