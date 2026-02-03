import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormInputComponent } from '../../../shared/components/form-input/form-input.component';
import { EventType, EventCategory } from '../../models/create-event.model';

@Component({
  selector: 'app-event-basic-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormInputComponent],
  templateUrl: './event-basic-info.component.html',
  styleUrls: ['./event-basic-info.css']
})
export class EventBasicInfoComponent {
  @Input() form!: FormGroup;

  eventTypes = Object.values(EventType);
  categories = Object.values(EventCategory);

  onFieldBlur(controlName: string, value: string): void {
    const control = this.form.get(controlName);
    if (control) {
      control.setValue(value);
      control.markAsTouched();
      control.updateValueAndValidity();
    }
  }

  formatEnum(value: string): string {
    return value
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}

