import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ standalone: true, name: 'arrayIncludes', pure: true })
export class ArrayIncludesPipe implements PipeTransform {
  transform<T>(array: readonly T[], value: T): boolean {
    return array.includes(value);
  }
}
