import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, switchMap, throwError } from 'rxjs';

import { AppError, AppErrorSchema } from '../models/api-error';

export function handleErrorInterceptor(): HttpInterceptorFn {
  return (request, next) => {
    const matSnackBar = inject(MatSnackBar);
    const matDialog = inject(MatDialog);
    return next(request).pipe(
      catchError((unknownError: HttpErrorResponse) => {
        const result = AppErrorSchema.safeParse(unknownError.error);
        let error: AppError;
        if (result.success) {
          error = result.data;
        } else {
          console.error(
            `Unknown error from ${request.url}}`,
            unknownError.error,
          );
          error = {
            error: 'Unknown error, please check the console for more info',
            errorCode: 'FRONT-0001',
            message: 'Unknown error',
            status: 500,
          };
        }
        const snackbar = matSnackBar.open(error.message, 'Details', {
          duration: 2500,
        });
        snackbar
          .onAction()
          .pipe(
            switchMap(async () => {
              const { ErrorDialogComponent } = await import(
                './error-dialog.component'
              );
              matDialog.open(ErrorDialogComponent, {
                data: error,
              });
            }),
          )
          .subscribe();
        return throwError(() => unknownError);
      }),
    );
  };
}
