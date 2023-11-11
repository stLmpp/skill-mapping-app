import { z } from 'zod';

export const SkillLevelSchema = z.object({
  skillLevelId: z.number(),
  skillLevelName: z.string(),
  skillLevelDescription: z.string().optional(),
});

export type SkillLevel = z.infer<typeof SkillLevelSchema>;
