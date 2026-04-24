import { z } from 'zod';

export const CreateQuoteSchema = z.object({
  requestId: z.string().uuid(),
  amount: z.coerce.number().positive('Le montant doit être positif'),
  description: z.string().optional(),
  validUntil: z.string().optional()
});

export const UpdateQuoteStatusSchema = z.object({
  status: z.enum(['accepted', 'rejected'])
});

export type CreateQuoteInput = z.infer<typeof CreateQuoteSchema>;
export type UpdateQuoteStatusInput = z.infer<typeof UpdateQuoteStatusSchema>;
