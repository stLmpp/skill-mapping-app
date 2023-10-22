import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { z } from 'zod';

import { environment } from '../../environments/environment';
import { Skill, SkillSchema } from '../models/skill';
import { withZodSchema } from '../zod/zod-http-context-token';

@Injectable({ providedIn: 'root' })
export class SkillService {
  private readonly httpClient = inject(HttpClient);

  readonly #skills = signal<Skill[]>([]);
  readonly skills = this.#skills.asReadonly();

  get(): Observable<Skill[]> {
    return this.httpClient
      .get<Skill[]>(`${environment.apiUrl}/v1/skill`, {
        context: withZodSchema(z.array(SkillSchema)),
      })
      .pipe(
        tap((skills) => {
          this.#skills.set(skills);
        }),
      );
  }
}
