import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { JobRole } from '../models/job-role';

import { JobRoleService } from './job-role.service';

export function jobRoleResolver(): ResolveFn<JobRole[]> {
  return () => inject(JobRoleService).get()
}
