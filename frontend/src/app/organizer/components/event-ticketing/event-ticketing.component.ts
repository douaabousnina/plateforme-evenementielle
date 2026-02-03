import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormInputComponent } from '../../../shared/components/form-input/form-input.component';

@Component({
  selector: 'app-event-ticketing',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormInputComponent],
  templateUrl: './event-ticketing.component.html',
  styleUrls: ['./event-ticketing.css']
})
export class EventTicketingComponent {
  @Input() form!: FormGroup;

  onCapacityChange(controlName: string, value: string): void {
    const control = this.form.get(controlName);
    if (control) {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue) && numValue > 0) {
        control.setValue(numValue);
      }
      control.markAsTouched();
    }
  }
}

