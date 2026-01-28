import { Component } from '@angular/core';
import { AuthFormComponent } from '../auth-form/auth-form.component';
import { Roles } from '../roles/roles';
@Component({
  selector: 'app-auth-layout',
  imports: [AuthFormComponent,Roles],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css'
})
export class AuthLayoutComponent {
  role: 'CLIENT' | 'ORGANIZER' = 'CLIENT';
}
