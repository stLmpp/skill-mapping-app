import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { z } from 'zod';

import { environment } from '../../environments/environment';
import { Language, LanguageSchema } from '../models/language';
import { withZodSchema } from '../zod/zod-http-context-token';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly httpClient = inject(HttpClient);

  readonly #languages = signal<Language[]>([]);
  readonly languages = this.#languages.asReadonly();

  get(): Observable<Language[]> {
    return this.httpClient
      .get<Language[]>(`${environment.apiUrl}/v1/language`, {
        context: withZodSchema(z.array(LanguageSchema)),
      })
      .pipe(
        tap((languages) => {
          this.#languages.set(languages);
        }),
      );
  }
}
