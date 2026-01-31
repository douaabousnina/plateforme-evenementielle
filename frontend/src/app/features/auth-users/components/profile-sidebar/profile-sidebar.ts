import { Component, inject, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Role } from '../../models/auth.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-sidebar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './profile-sidebar.html',
  styleUrl: './profile-sidebar.css',
})
export class ProfileSidebar {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  
  userAvatar = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuCv93B_pRPe1ngmWnOBLCusFfcxx7YOA6Wznv9HiUN0dfUE93isEnmDKnnjsuszw7pMbacuXXZUd35eavO_eUI-0ooIuBsh6tsLGcDI2kIqGJcJ8aOay4FEMaLEgUcx8Y7znGE0sSU4r932MhhB5QF7eFINjUdxBenzPU1HMlN_6OdOIk8BDnbI8oZnOvgsDvNhdFH0lADlm0yJu7Lk1QmZ2POGP6-e2Fxngy1eg3i8BCRNGivUJxz5OKm5ayYAyzfr3i1P27QCc';
  Role = Role;

  // Computed user info from UserService signals
  userInfo = computed(() => {
    const user = this.userService.userProfile();
    return {
      name: user?.name || 'Thomas',
      role: user?.role as Role | null
    };
  });

  userRole = computed(() => {
    const role = this.userInfo().role;
    return role === Role.ORGANIZER ? 'Organisateur' : 'Client';
  });

  userRoleEnum = computed(() => this.userInfo().role);

  logout() {
    this.authService.logout();
  }
}
