import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { Chapter } from '../models/chapter';

import { ChapterService } from './chapter.service';

export function chapterResolver(): ResolveFn<Chapter[]> {
  return () => inject(ChapterService).get();
}
