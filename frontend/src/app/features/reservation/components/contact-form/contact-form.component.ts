import { Component, Input } from '@angular/core';
import { FormInputComponent } from '../../../../shared/components/form-input/form-input.component';
import { ContactInfo } from '../../models/payment.model';

@Component({
  selector: 'app-contact-form',
  
  imports: [FormInputComponent],
  templateUrl: './contact-form.component.html',
})
export class ContactFormComponent {
  @Input({ required: true }) contactInfo!: ContactInfo;
}