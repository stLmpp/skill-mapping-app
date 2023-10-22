import { isPlatformServer } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';

import { environment } from '../environments/environment';

export function apiInterceptor(): HttpInterceptorFn {
  return (request, next) => {
    const isServer = isPlatformServer(inject(PLATFORM_ID));
    if (isServer) {
      request = request.clone({
        url: `${request.url.replace(/^\/api/, environment.apiUrlSSR)}`,
      });
    }
    return next(request);
  };
}
