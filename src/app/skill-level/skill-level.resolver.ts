import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { SkillLevel } from '../models/skill-level';

import { SkillLevelService } from './skill-level.service';

export function skillLevelResolver(): ResolveFn<SkillLevel[]> {
  return () => inject(SkillLevelService).get();
}
