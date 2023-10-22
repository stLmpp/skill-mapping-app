import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { Customer } from '../models/customer';

import { CustomerService } from './customer.service';

export function customerResolver(): ResolveFn<Customer[]> {
  return () => inject(CustomerService).get();
}
