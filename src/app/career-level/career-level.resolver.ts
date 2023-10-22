import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { CareerLevel } from '../models/career-level';

import { CareerLevelService } from './career-level.service';

export function careerLevelResolver(): ResolveFn<CareerLevel[]> {
  return () => inject(CareerLevelService).get();
}
