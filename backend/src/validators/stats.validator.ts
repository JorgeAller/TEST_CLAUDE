import { z } from 'zod';

export const createGameStatsSchema = z.object({
  playerId: z.string().uuid('Invalid player ID'),
  gameId: z.string().uuid('Invalid game ID'),
  minutesPlayed: z.number().min(0).max(48, 'Minutes played cannot exceed 48'),
  points: z.number().int().min(0),
  
  // Shooting stats with validation
  fieldGoalsMade: z.number().int().min(0),
  fieldGoalsAttempted: z.number().int().min(0),
  threePointersMade: z.number().int().min(0),
  threePointersAttempted: z.number().int().min(0),
  freeThrowsMade: z.number().int().min(0),
  freeThrowsAttempted: z.number().int().min(0),
  
  // Rebounds
  offensiveRebounds: z.number().int().min(0),
  defensiveRebounds: z.number().int().min(0),
  totalRebounds: z.number().int().min(0),
  
  // Other stats
  assists: z.number().int().min(0),
  steals: z.number().int().min(0),
  blocks: z.number().int().min(0),
  turnovers: z.number().int().min(0),
  personalFouls: z.number().int().min(0).max(6),
  plusMinus: z.number().int().optional(),
})
  .refine((data) => data.fieldGoalsMade <= data.fieldGoalsAttempted, {
    message: 'Field goals made cannot exceed field goals attempted',
    path: ['fieldGoalsMade'],
  })
  .refine((data) => data.threePointersMade <= data.threePointersAttempted, {
    message: 'Three pointers made cannot exceed three pointers attempted',
    path: ['threePointersMade'],
  })
  .refine((data) => data.threePointersMade <= data.fieldGoalsMade, {
    message: 'Three pointers made cannot exceed total field goals made',
    path: ['threePointersMade'],
  })
  .refine((data) => data.freeThrowsMade <= data.freeThrowsAttempted, {
    message: 'Free throws made cannot exceed free throws attempted',
    path: ['freeThrowsMade'],
  })
  .refine((data) => data.offensiveRebounds + data.defensiveRebounds === data.totalRebounds, {
    message: 'Total rebounds must equal offensive rebounds plus defensive rebounds',
    path: ['totalRebounds'],
  });

export const statsQuerySchema = z.object({
  playerId: z.string().uuid().optional(),
  gameId: z.string().uuid().optional(),
  season: z.string().regex(/^\d{4}-\d{2}$/).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export type CreateGameStatsInput = z.infer<typeof createGameStatsSchema>;
export type StatsQuery = z.infer<typeof statsQuerySchema>;
