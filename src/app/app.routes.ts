import { Routes } from '@angular/router';

import { careerLevelResolver } from './career-level/career-level.resolver';
import { chapterResolver } from './chapter/chapter.resolver';
import { customerResolver } from './customer/customer.resolver';
import { jobRoleResolver } from './job-role/job-role.resolver';
import { languageResolver } from './language/language.resolver';
import { skillResolver } from './skill/skill.resolver';
import { skillLevelResolver } from './skill-level/skill-level.resolver';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./landing/landing.component').then((m) => m.LandingComponent),
  },
  {
    path: 'registrar',
    loadComponent: () =>
      import('./submit-person/submit-person.component').then(
        (m) => m.SubmitPersonComponent,
      ),
    resolve: [
      skillResolver(),
      skillLevelResolver(),
      careerLevelResolver(),
      customerResolver(),
      chapterResolver(),
      jobRoleResolver(),
      languageResolver(),
    ],
    title: 'Registrar',
  },
  {
    path: '**',
    pathMatch: 'full',
    loadComponent: () =>
      import('./not-found/not-found.component').then(
        (m) => m.NotFoundComponent,
      ),
    title: 'Not found',
  },
];
