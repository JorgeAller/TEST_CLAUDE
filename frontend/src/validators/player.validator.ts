import { z } from 'zod';

export const createPlayerSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must be 50 characters or less'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be 50 characters or less'),
  position: z.enum(['PG', 'SG', 'SF', 'PF', 'C'], {
    errorMap: () => ({ message: 'Please select a valid position' }),
  }),
  jerseyNumber: z
    .number()
    .int('Jersey number must be a whole number')
    .min(0, 'Jersey number must be 0 or greater')
    .max(99, 'Jersey number must be 99 or less')
    .optional()
    .or(z.literal('')),
  height: z
    .number()
    .min(150, 'Height must be at least 150 cm')
    .max(250, 'Height must be 250 cm or less')
    .optional()
    .or(z.literal('')),
  weight: z
    .number()
    .min(50, 'Weight must be at least 50 kg')
    .max(200, 'Weight must be 200 kg or less')
    .optional()
    .or(z.literal('')),
  birthDate: z.string().optional().or(z.literal('')),
  teamId: z.string().optional().or(z.literal('')),
});

export type CreatePlayerFormData = z.infer<typeof createPlayerSchema>;
