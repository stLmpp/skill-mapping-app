import { z } from 'zod';

export const CustomerSchema = z.object({
  customerId: z.number(),
  customerName: z.string(),
});

export type Customer = z.infer<typeof CustomerSchema>;
