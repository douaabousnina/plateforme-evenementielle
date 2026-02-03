import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormInputComponent } from '../../../shared/components/form-input/form-input.component';
import { LocationType } from '../../models/create-event.model';

type LocationTypeValue = LocationType | string;

@Component({
  selector: 'app-event-location',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormInputComponent],
  templateUrl: './event-location.component.html',
  styleUrls: ['./event-location.css']
})
export class EventLocationComponent {
  @Input() form!: FormGroup;
  locationType = signal<LocationTypeValue>('physical');
  LocationType = LocationType;

  selectLocationType(type: LocationTypeValue) {
    // Ensure lowercase for backend compatibility
    const lowercaseType = (type as string).toLowerCase();
    this.locationType.set(lowercaseType as LocationTypeValue);
    this.form.patchValue({ locationType: lowercaseType });
  }

  onFieldBlur(controlName: string, value: string): void {
    const control = this.form.get(controlName);
    if (control) {
      control.setValue(value);
      control.markAsTouched();
      control.updateValueAndValidity();
    }
  }
}
