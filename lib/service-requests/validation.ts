import { z } from 'zod';

export const CreateRequestSchema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(255),
  description: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  location: z.string().optional(),
  budgetMin: z.coerce.number().positive().optional(),
  budgetMax: z.coerce.number().positive().optional(),
  desiredDate: z.string().optional()
});

export const UpdateRequestSchema = CreateRequestSchema.partial().extend({
  status: z
    .enum(['open', 'in_progress', 'completed', 'cancelled'])
    .optional()
});

export type CreateRequestInput = z.infer<typeof CreateRequestSchema>;
export type UpdateRequestInput = z.infer<typeof UpdateRequestSchema>;
