import { Component } from '@angular/core';
import { FormInputComponent } from '../../../shared/components/form-input/form-input.component';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [FormInputComponent],
  templateUrl: './event-form.html',
  styleUrl: './event-form.css',
})
export class EventForm {

}
