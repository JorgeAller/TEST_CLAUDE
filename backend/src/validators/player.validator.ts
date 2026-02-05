import { z } from 'zod';
import { Position } from '@prisma/client';

export const createPlayerSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  position: z.nativeEnum(Position, {
    errorMap: () => ({ message: 'Invalid position. Must be PG, SG, SF, PF, or C' }),
  }),
  jerseyNumber: z.number().int().min(0).max(99).optional(),
  height: z.number().int().min(150).max(250).optional(), // cm
  weight: z.number().int().min(50).max(200).optional(), // kg
  birthDate: z.coerce.date().optional(),
  teamId: z.string().uuid().optional(),
});

export const updatePlayerSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  position: z.nativeEnum(Position).optional(),
  jerseyNumber: z.number().int().min(0).max(99).optional(),
  height: z.number().int().min(150).max(250).optional(),
  weight: z.number().int().min(50).max(200).optional(),
  birthDate: z.coerce.date().optional(),
  teamId: z.string().uuid().optional().nullable(),
});

export const playerIdSchema = z.object({
  id: z.string().uuid('Invalid player ID'),
});

export type CreatePlayerInput = z.infer<typeof createPlayerSchema>;
export type UpdatePlayerInput = z.infer<typeof updatePlayerSchema>;
