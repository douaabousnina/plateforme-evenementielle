import { Component,computed,signal } from '@angular/core';
import { AuthFormComponent } from '../auth-form/auth-form.component';
import { Roles } from '../roles/roles';
import { Router , RouterLink} from '@angular/router';
import { Role } from '../../models/auth.model';

@Component({
  selector: 'app-auth-layout',
  imports: [AuthFormComponent,Roles,RouterLink],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css'
})
export class AuthLayoutComponent {
  role = signal<Role>(Role.CLIENT); 
  constructor(private router: Router) {}
  
  isLoginRoute = computed(() => this.router.url === '/login');
  updateRole(newRole: Role) {
    this.role.set(newRole);
  }
}
