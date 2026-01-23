import { Component, signal } from '@angular/core';
import { FormInputComponent } from '../../../../shared/components/form-input/form-input.component';
import { BaseFormComponent } from '../../../../shared/components/form/base-form.component';
import { ContactField, ContactInfo } from '../../models/payment.model';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [FormInputComponent],
  templateUrl: './contact-form.component.html',
})
export class ContactFormComponent extends BaseFormComponent<ContactInfo> {
  fieldNames: ContactField[] = ['firstName', 'lastName', 'email'];

  fields = {
    firstName: { value: signal(''), error: signal('') },
    lastName: { value: signal(''), error: signal('') },
    email: { value: signal(''), error: signal('') },
  };

  // public getters for template
  firstNameValue() { return this.fields.firstName.value(); }
  firstNameError() { return this.fields.firstName.error(); }
  lastNameValue() { return this.fields.lastName.value(); }
  lastNameError() { return this.fields.lastName.error(); }
  emailValue() { return this.fields.email.value(); }
  emailError() { return this.fields.email.error(); }

  buildFormData(): ContactInfo {
    return {
      firstName: this.fields.firstName.value(),
      lastName: this.fields.lastName.value(),
      email: this.fields.email.value(),
    };
  }
}
