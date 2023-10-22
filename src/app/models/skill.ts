import { z } from 'zod';

export const SkillSchema = z.object({
  skillId: z.number(),
  skillName: z.string(),
});

export type Skill = z.infer<typeof SkillSchema>;
