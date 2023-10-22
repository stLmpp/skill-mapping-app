import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { z } from 'zod';

import { environment } from '../../environments/environment';
import { Customer, CustomerSchema } from '../models/customer';
import { withZodSchema } from '../zod/zod-http-context-token';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly httpClient = inject(HttpClient);

  readonly #customers = signal<Customer[]>([]);
  readonly customers = this.#customers.asReadonly();

  get(): Observable<Customer[]> {
    return this.httpClient
      .get<Customer[]>(`${environment.apiUrl}/v1/customer`, {
        context: withZodSchema(z.array(CustomerSchema)),
      })
      .pipe(
        tap((customers) => {
          this.#customers.set(customers);
        }),
      );
  }
}
