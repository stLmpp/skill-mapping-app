import { HttpContext, HttpContextToken } from '@angular/common/http';
import { ZodType } from 'zod';

export const ZOD_HTTP_CONTEXT_TOKEN = new HttpContextToken<ZodType | undefined>(
  () => undefined,
);

export function withZodSchema(schema: ZodType): HttpContext {
  return new HttpContext().set(ZOD_HTTP_CONTEXT_TOKEN, schema);
}
