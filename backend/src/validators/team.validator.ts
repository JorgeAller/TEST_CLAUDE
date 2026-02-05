import { z } from 'zod';

export const createTeamSchema = z.object({
  name: z.string().min(1, 'Team name is required').max(100),
  city: z.string().min(1, 'City is required').max(100),
  abbreviation: z.string().min(2).max(3).toUpperCase(),
  conference: z.enum(['Eastern', 'Western'], {
    errorMap: () => ({ message: 'Conference must be Eastern or Western' }),
  }),
  division: z.string().min(1, 'Division is required'),
});

export const updateTeamSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  city: z.string().min(1).max(100).optional(),
  abbreviation: z.string().min(2).max(3).toUpperCase().optional(),
  conference: z.enum(['Eastern', 'Western']).optional(),
  division: z.string().min(1).optional(),
});

export const teamIdSchema = z.object({
  id: z.string().uuid('Invalid team ID'),
});

export type CreateTeamInput = z.infer<typeof createTeamSchema>;
export type UpdateTeamInput = z.infer<typeof updateTeamSchema>;
