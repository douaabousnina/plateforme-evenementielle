import { Component, Input, viewChild } from '@angular/core';
import { NgForm, FormsModule} from '@angular/forms';
import { AuthInputComponent } from '../auth-input/auth-input.component';
import { AuthButtonComponent } from '../auth-button/auth-button.component';
import { InterestSelectorComponent } from '../interest-selector/interest-selector.component';
@Component({
  selector: 'app-auth-form',
  imports: [FormsModule, AuthInputComponent,AuthButtonComponent,InterestSelectorComponent],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.css'
})
export class AuthFormComponent { 
  user = {  email: '', password: '',confirmPassword: '' }; 
  submitForm() { console.log('Form submitted:', this.user); 


  }


}