import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { PersonUpsert } from '../models/person-upsert';

@Injectable({ providedIn: 'root' })
export class PersonService {
  private readonly httpClient = inject(HttpClient);

  upsert(body: PersonUpsert): Observable<void> {
    return this.httpClient.post<void>(
      `${environment.apiUrl}/v1/person/upsert`,
      body,
    );
  }
}
