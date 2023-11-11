import {
  HttpEventType,
  HttpInterceptorFn,
  HttpResponse,
} from '@angular/common/http';
import { isDevMode } from '@angular/core';
import { switchMap } from 'rxjs';
import { z } from 'zod';

import { ZOD_HTTP_CONTEXT_TOKEN } from './zod-http-context-token';

export function zodInterceptor(): HttpInterceptorFn {
  return (request, next) => {
    const zodSchema = request.context.get(ZOD_HTTP_CONTEXT_TOKEN);
    if (!zodSchema) {
      if (isDevMode()) {
        console.warn(
          `Request to ${request.url} does not have a ZodSchema defined. It will be treated as ZodVoid`,
        );
      }
      return next(request);
    }
    return next(request).pipe(
      switchMap(async (response) => {
        if (response.type !== HttpEventType.Response) {
          return response;
        }
        const result = await (zodSchema ?? z.void()).safeParseAsync(
          response.body,
        );
        if (!result.success) {
          if (isDevMode()) {
            console.warn(`We failed to validate the response from ${request.url}. Error:`, result.error)
          }
          throw new HttpResponse({
            body: {},
            url: response.url ?? undefined,
            headers: response.headers,
            status: 500,
            statusText: 'Internal server error',
          });
        }
        return new HttpResponse({
          body: result.data,
          url: response.url ?? undefined,
          headers: response.headers,
          status: response.status,
          statusText: response.statusText,
        });
      }),
    );
  };
}
