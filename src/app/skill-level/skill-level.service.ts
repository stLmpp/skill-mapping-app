import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { z } from 'zod';

import { environment } from '../../environments/environment';
import { SkillLevel, SkillLevelSchema } from '../models/skill-level';
import { withZodSchema } from '../zod/zod-http-context-token';

@Injectable({ providedIn: 'root' })
export class SkillLevelService {
  private readonly httpClient = inject(HttpClient);

  readonly #skillLevels = signal<SkillLevel[]>([]);
  readonly skillLevels = this.#skillLevels.asReadonly();

  get(): Observable<SkillLevel[]> {
    return this.httpClient
      .get<SkillLevel[]>(`${environment.apiUrl}/v1/skill-level`, {
        context: withZodSchema(z.array(SkillLevelSchema)),
      })
      .pipe(
        tap((skillLevels) => {
          this.#skillLevels.set(skillLevels);
        }),
      );
  }
}
