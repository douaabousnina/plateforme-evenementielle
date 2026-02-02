import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormInputComponent } from '../../../shared/components/form-input/form-input.component';

@Component({
  selector: 'app-event-date-time',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormInputComponent],
  template: `
    <div class="flex flex-col gap-6" [formGroup]="form">
      <h2 class="text-lg font-bold border-b border-border-light dark:border-border-dark pb-2 flex items-center gap-2">
        <span class="material-symbols-outlined text-primary">schedule</span>
        Date et Heure
      </h2>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <app-form-input
            [label]="'Date de début'"
            [type]="'date'"
            [value]="form.get('startDate')?.value ?? ''"
            [name]="'startDate'"
            (blurred)="onFieldBlur('startDate', $event)"
          />
        </div>
        
        <div>
          <app-form-input
            [label]="'Heure de début'"
            [type]="'time'"
            [value]="form.get('startTime')?.value ?? ''"
            [name]="'startTime'"
            (blurred)="onFieldBlur('startTime', $event)"
          />
        </div>
        
        <div>
          <app-form-input
            [label]="'Date de fin'"
            [type]="'date'"
            [value]="form.get('endDate')?.value ?? ''"
            [name]="'endDate'"
            (blurred)="onFieldBlur('endDate', $event)"
          />
        </div>
        
        <div>
          <app-form-input
            [label]="'Heure de fin'"
            [type]="'time'"
            [value]="form.get('endTime')?.value ?? ''"
            [name]="'endTime'"
            (blurred)="onFieldBlur('endTime', $event)"
          />
        </div>
      </div>
      
      <label class="flex items-center gap-2 cursor-pointer w-fit">
        <input 
          type="checkbox"
          formControlName="isRecurring"
          class="form-checkbox rounded text-primary border-border-light focus:ring-primary"
        />
        <span class="text-sm text-text-secondary dark:text-gray-300">
          Ceci est un événement récurrent
        </span>
      </label>
    </div>
  `,
  styleUrls: ['./event-date-time.css']
})
export class EventDateTimeComponent {
  @Input() form!: FormGroup;

  onFieldBlur(controlName: string, value: string): void {
    const control = this.form.get(controlName);
    if (control) {
      control.setValue(value);
      control.markAsTouched();
      control.updateValueAndValidity();
    }
  }
}
