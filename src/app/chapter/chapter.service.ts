import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { z } from 'zod';

import { environment } from '../../environments/environment';
import { Chapter, ChapterSchema } from '../models/chapter';
import { withZodSchema } from '../zod/zod-http-context-token';

@Injectable({ providedIn: 'root' })
export class ChapterService {
  private readonly httpClient = inject(HttpClient);

  readonly #chapters = signal<Chapter[]>([]);
  readonly chapters = this.#chapters.asReadonly();

  get(): Observable<Chapter[]> {
    return this.httpClient
      .get<Chapter[]>(`${environment.apiUrl}/v1/chapter`, {
        context: withZodSchema(z.array(ChapterSchema)),
      })
      .pipe(
        tap((chapters) => {
          this.#chapters.set(chapters);
        }),
      );
  }
}
