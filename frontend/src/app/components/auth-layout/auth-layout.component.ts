import { Component } from '@angular/core';
import { AuthFormComponent } from '../auth-form/auth-form.component';

@Component({
  selector: 'app-auth-layout',
  imports: [AuthFormComponent],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css'
})
export class AuthLayoutComponent {

}
