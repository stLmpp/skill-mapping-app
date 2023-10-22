import { z } from 'zod';

export const ChapterSchema = z.object({
  chapterId: z.number(),
  chapterName: z.string(),
});

export type Chapter = z.infer<typeof ChapterSchema>;
