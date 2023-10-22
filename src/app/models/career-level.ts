import { z } from 'zod';

export const CareerLevelSchema = z.object({
  careerLevelId: z.number(),
  careerLevelName: z.string(),
})

export type CareerLevel = z.infer<typeof CareerLevelSchema>;
