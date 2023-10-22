import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormArray,
  FormControl,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  MatChipSelectionChange,
  MatChipsModule,
} from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, debounceTime } from 'rxjs';

import { CareerLevelService } from '../career-level/career-level.service';
import { CustomerService } from '../customer/customer.service';
import { Skill } from '../models/skill';
import { PersistentFormDirective } from '../persistent-form.directive';
import { PersonService } from '../person/person.service';
import { ArrayIncludesPipe } from '../shared/array-includes.pipe';
import { SkillService } from '../skill/skill.service';
import { SkillLevelService } from '../skill-level/skill-level.service';

@Component({
  selector: 'app-submit-person',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonModule,
    MatRadioModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    ArrayIncludesPipe,
    MatCheckboxModule,
    FormsModule,
    PersistentFormDirective,
  ],
  templateUrl: './submit-person.component.html',
  styleUrls: ['./submit-person.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubmitPersonComponent {
  readonly skillService = inject(SkillService);
  readonly skillLevelService = inject(SkillLevelService);
  readonly formBuilder = inject(NonNullableFormBuilder);
  readonly careerLevelService = inject(CareerLevelService);
  readonly customerService = inject(CustomerService);
  readonly personService = inject(PersonService);
  readonly matSnackBar = inject(MatSnackBar);

  @ViewChild('formLocalStorage') formLocalStorage!: PersistentFormDirective;

  readonly eidMaxLength = 255;
  readonly eidMinLength = 1;
  readonly eidPattern = '^[.a-z]{1,255}$';
  readonly otherInformationMaxLength = 5000;

  readonly term$ = new BehaviorSubject<string>('');
  readonly term = toSignal(this.term$.asObservable().pipe(debounceTime(200)));

  readonly skillsFiltered = computed(() => {
    const term = this.term();
    const skills = this.skillService.skills();
    if (!term) {
      return skills;
    }
    return skills.filter((skill) =>
      skill.skillName.toLowerCase().includes(term.toLowerCase()),
    );
  });

  readonly loading = signal(false);

  readonly eidControl = this.formBuilder.control('', {
    validators: [
      Validators.required,
      Validators.maxLength(this.eidMaxLength),
      Validators.minLength(this.eidMinLength),
      Validators.pattern(this.eidPattern),
    ],
  });
  readonly skillsArrayControl = this.formBuilder.array(
    this.skillService.skills().map((skill) => this.createNewSkillGroup(skill)),
    {
      validators: [
        (control) => {
          if (!control.touched) {
            return null;
          }
          if (control instanceof FormArray) {
            const controlTyped: typeof this.skillsArrayControl = control;
            if (controlTyped.value.filter((item) => item.checked).length < 1) {
              return { requiredLength: 1 };
            }
          }
          return null;
        },
      ],
    },
  );
  readonly otherInformationControl = this.formBuilder.control<
    string | undefined
  >({ value: undefined, disabled: false }, [
    Validators.maxLength(this.otherInformationMaxLength),
  ]);
  readonly formGroup = this.formBuilder.group({
    eid: this.eidControl,
    skills: this.skillsArrayControl,
    interests: this.formBuilder.array<FormControl<number>>([]),
    careerLevelId: this.formBuilder.control<number | undefined>(
      { value: undefined, disabled: false },
      [Validators.required],
    ),
    lastCustomerId: this.formBuilder.control<number | undefined>(
      { value: undefined, disabled: false },
      [Validators.required],
    ),
    otherInformation: this.otherInformationControl,
  });

  private createNewSkillGroup(skill: Skill) {
    return this.formBuilder.group({
      skillName: this.formBuilder.control(skill.skillName),
      skillId: this.formBuilder.control(skill.skillId, {
        validators: [Validators.required],
      }),
      skillLevelId: this.formBuilder.control<number>(
        this.skillLevelService.skillLevels().at(0)!.skillLevelId,
        {
          validators: [Validators.required],
        },
      ),
      checked: this.formBuilder.control(false),
    });
  }

  onInterestSelection($event: MatChipSelectionChange) {
    if ($event.selected) {
      this.formGroup.controls.interests.push(
        this.formBuilder.control($event.source.value),
      );
    } else {
      const index = this.formGroup.controls.interests.value.indexOf(
        $event.source.value,
      );
      if (index !== -1) {
        this.formGroup.controls.interests.removeAt(index);
      }
    }
  }

  onSubmit() {
    if (this.formGroup.invalid || this.loading()) {
      return;
    }
    this.loading.set(true);
    this.formGroup.disable({ emitEvent: false });
    const {
      eid,
      lastCustomerId,
      skills,
      careerLevelId,
      interests,
      otherInformation,
    } = this.formGroup.getRawValue();
    this.personService
      .upsert({
        eid,
        lastCustomerId: lastCustomerId!,
        careerLevelId: careerLevelId!,
        chapterId: 1, // TODO
        interests,
        skills: skills
          .filter((skill) => skill.checked)
          .map((skill) => ({
            skillId: skill.skillId,
            skillLevelId: skill.skillLevelId,
          })),
        otherInformation,
      })
      .subscribe({
        next: () => {
          this.matSnackBar.open('Enviado com sucesso!', 'Fechar');
        },
        complete: () => {
          this.loading.set(false);
          this.formGroup.enable({ emitEvent: false });
          this.formLocalStorage.clear();
        },
      });
  }

  activateValidations() {
    this.formGroup.markAllAsTouched();
    this.skillsArrayControl.updateValueAndValidity({
      emitEvent: false,
    });
  }

  onReset() {
    this.formGroup.reset(undefined, {
      emitEvent: false,
    });
    this.formLocalStorage.clear();
  }
}
