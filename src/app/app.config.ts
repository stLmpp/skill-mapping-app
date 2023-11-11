import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBarConfig,
} from '@angular/material/snack-bar';
import {
  provideClientHydration,
  withHttpTransferCacheOptions,
} from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideRouter,
  TitleStrategy,
  withComponentInputBinding,
  withRouterConfig,
} from '@angular/router';

import { apiInterceptor } from './api.interceptor';
import { routes } from './app.routes';
import { handleErrorInterceptor } from './error/handle-error.interceptor';
import { TitleResolver } from './title.resolver';
import { zodInterceptor } from './zod/zod.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withRouterConfig({}), withComponentInputBinding()),
    provideClientHydration(
      withHttpTransferCacheOptions({
        includePostRequests: false,
      }),
    ),
    provideAnimations(),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        apiInterceptor(),
        zodInterceptor(),
        handleErrorInterceptor(),
      ]),
    ),
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { duration: 2500 } satisfies MatSnackBarConfig,
    },
    {
      provide: TitleStrategy,
      useExisting: TitleResolver,
    },
  ],
};
