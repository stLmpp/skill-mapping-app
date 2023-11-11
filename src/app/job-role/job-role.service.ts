import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { z } from 'zod';

import { environment } from '../../environments/environment';
import { JobRole, JobRoleSchema } from '../models/job-role';
import { withZodSchema } from '../zod/zod-http-context-token';


@Injectable({
  providedIn: 'root',
})
export class JobRoleService {
  private readonly httpClient = inject(HttpClient)

  readonly #jobRoles = signal<JobRole[]>([]);
  readonly jobRoles = this.#jobRoles.asReadonly();

  get(): Observable<JobRole[]> {
    return this.httpClient.get<JobRole[]>(`${environment.apiUrl}/v1/job-role`, {
      context: withZodSchema(z.array(JobRoleSchema)),
    })
      .pipe(
        tap((jobRoles) => {
          this.#jobRoles.set(jobRoles)
        }),
      )
  }
}

