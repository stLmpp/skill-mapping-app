import { z } from 'zod';

export const JobRoleSchema = z.object({
  jobRoleId: z.number(),
  jobRoleName: z.string(),
})

export type JobRole = z.infer<typeof JobRoleSchema>
