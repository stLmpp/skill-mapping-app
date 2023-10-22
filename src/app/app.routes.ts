import { Routes } from '@angular/router';

import { careerLevelResolver } from './career-level/career-level.resolver';
import { customerResolver } from './customer/customer.resolver';
import { skillResolver } from './skill/skill.resolver';
import { skillLevelResolver } from './skill-level/skill-level.resolver';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./submit-person/submit-person.component').then(
        (m) => m.SubmitPersonComponent,
      ),
    resolve: [
      skillResolver(),
      skillLevelResolver(),
      careerLevelResolver(),
      customerResolver(),
    ],
  },
];
