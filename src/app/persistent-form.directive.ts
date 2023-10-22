import { isPlatformBrowser } from '@angular/common';
import {
  DestroyRef,
  Directive,
  inject,
  Input,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlContainer, NgControl } from '@angular/forms';
import { del, get, set } from 'idb-keyval';
import { auditTime } from 'rxjs';

@Directive({
  selector: `[formControl][appPersistentForm],
             [formGroup][appPersistentForm],
             [formControlName][appPersistentForm],
             [formGroupName][appPersistentForm],
             [formArrayName][appPersistentForm]`,
  standalone: true,
  exportAs: 'appFormLocalStorage',
})
export class PersistentFormDirective implements OnInit {
  private readonly control =
    inject(NgControl, { optional: true }) ??
    inject(ControlContainer, { optional: true });
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly destroyRef = inject(DestroyRef);

  @Input({ required: true })
  appPersistentForm!: string;

  private getKey(): string {
    return `FORM_${this.appPersistentForm}`;
  }

  async ngOnInit() {
    if (!this.control?.valueChanges || !this.isBrowser) {
      return;
    }
    const key = this.getKey();
    const cachedValue = await get(key);
    if (cachedValue) {
      this.control.control?.patchValue(cachedValue);
    }
    this.control.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef), auditTime(200))
      .subscribe((value) => {
        set(key, value);
      });
  }

  clear(): void {
    if (!this.isBrowser) {
      return;
    }
    del(this.getKey());
  }
}
