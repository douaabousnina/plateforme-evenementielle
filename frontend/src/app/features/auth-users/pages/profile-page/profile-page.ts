import { Component, inject, computed } from '@angular/core';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { ProfileSidebar } from '../../components/profile-sidebar/profile-sidebar';
import { PersonalInfoCard } from '../../components/personal-info-card/personal-info-card';
import { PreferencesCard } from '../../components/preferences-card/preferences-card';
import { PasswordChangeCard } from '../../components/password-change-card/password-change-card';
import { UserService } from '../../services/user.service';
import { Role } from '../../models/auth.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-page',
  imports: [
    CommonModule,
    HeaderComponent,
    ProfileSidebar,
    PersonalInfoCard,
    PreferencesCard,
    PasswordChangeCard
  ],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css',
})
export class ProfilePage {
  private userService = inject(UserService);
  
  userProfile = this.userService.userProfile;
  Role = Role;
  
  isClient = computed(() => this.userProfile()?.role === Role.CLIENT);
}
