import { z } from 'zod';

export const LanguageSchema = z.object({
  languageId: z.number(),
  languageName: z.string(),
});

export type Language = z.infer<typeof LanguageSchema>;
