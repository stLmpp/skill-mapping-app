import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { Skill } from '../models/skill';

import { SkillService } from './skill.service';

export function skillResolver(): ResolveFn<Skill[]> {
  return () => inject(SkillService).get();
}
