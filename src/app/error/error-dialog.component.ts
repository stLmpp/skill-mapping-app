import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { getReasonPhrase } from 'http-status-codes';

import { AppError } from '../models/api-error';

@Component({
  selector: 'app-error-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, A11yModule],
  template: `
    <h1 mat-dialog-title>{{ error.message }}</h1>
    <div mat-dialog-content>
      <p>{{ error.error }}</p>
      <p>Code: {{ error.errorCode }}</p>
      <p>Status: {{ error.status }} - {{ statusText }}</p>
      <p>CID: {{ error.correlationId }}</p>
    </div>
    <div mat-dialog-actions>
      <button type="button" mat-button mat-dialog-close cdkFocusInitial>
        Fechar
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorDialogComponent {
  readonly error = inject<AppError>(MAT_DIALOG_DATA);
  readonly statusText = getReasonPhrase(this.error.status);
}
