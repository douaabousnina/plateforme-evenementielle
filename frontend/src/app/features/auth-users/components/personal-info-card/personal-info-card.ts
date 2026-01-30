import { Component, inject, computed, signal, effect } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-personal-info-card',
  imports: [CommonModule, FormsModule],
  templateUrl: './personal-info-card.html',
  styleUrl: './personal-info-card.css',
})
export class PersonalInfoCard {
  private userService = inject(UserService);

  // State signals
  isEditing = signal(false);
  isSaving = signal(false);
  editFormData = signal({
    firstName: '',
    lastName: '',
    phone: ''
  });

  // Expose service signals
  userProfile = this.userService.userProfile;
  isLoading = this.userService.isLoading;
  error = this.userService.error;

  // Computed values
  userInfo = computed(() => {
    const user = this.userProfile();
    return {
      firstName: user?.name || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phoneNumber || ''
    };
  });

  constructor() {
    // Load profile on first access
    if (!this.userProfile()) {
      this.userService.loadProfile();
    }

    // Auto-close edit mode when save completes successfully
    effect(() => {
      if (!this.isSaving()) {
        return;
      }

      if (!this.isLoading()) {
        if (!this.error()) {
          this.isEditing.set(false);
        }
        this.isSaving.set(false);
      }
    });
  }

  onEdit() {
    const info = this.userInfo();
    this.editFormData.set({
      firstName: info.firstName,
      lastName: info.lastName,
      phone: info.phone
    });
    this.userService.clearError();
    this.isEditing.set(true);
  }

  cancelEdit() {
    this.isEditing.set(false);
    this.userService.clearError();
  }

  saveChanges() {
    const data = this.editFormData();
    this.isSaving.set(true);
    this.userService.updateProfile({
      name: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phone
    });
  }
}
