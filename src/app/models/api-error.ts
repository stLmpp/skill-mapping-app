import { z } from 'zod';

export const AppErrorSchema = z.object({
  correlationId: z.string().optional(),
  error: z.string(),
  errorCode: z.string(),
  message: z.string(),
  status: z.number(),
});

export type AppError = z.infer<typeof AppErrorSchema>;
