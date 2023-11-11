import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { Language } from '../models/language';

import { LanguageService } from './language.service';

export function languageResolver(): ResolveFn<Language[]> {
  return () => inject(LanguageService).get();
}
