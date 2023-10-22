import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { z } from 'zod';

import { environment } from '../../environments/environment';
import { CareerLevel, CareerLevelSchema } from '../models/career-level';
import { withZodSchema } from '../zod/zod-http-context-token';

@Injectable({ providedIn: 'root' })
export class CareerLevelService {
  private readonly httpClient = inject(HttpClient);

  readonly #careerLevels = signal<CareerLevel[]>([]);
  readonly careerLevels = this.#careerLevels.asReadonly();

  get(): Observable<CareerLevel[]> {
    return this.httpClient
      .get<CareerLevel[]>(`${environment.apiUrl}/v1/career-level`, {
        context: withZodSchema(z.array(CareerLevelSchema)),
      })
      .pipe(
        tap((careerLevels) => {
          this.#careerLevels.set(careerLevels);
        }),
      );
  }
}
