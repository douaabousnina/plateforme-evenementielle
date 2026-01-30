import { Component, inject, signal, computed } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-password-change-card',
  imports: [FormsModule, CommonModule],
  templateUrl: './password-change-card.html',
  styleUrl: './password-change-card.css',
})
export class PasswordChangeCard {
  private userService = inject(UserService);

  // Form signals
  currentPassword = signal('');
  newPassword = signal('');
  confirmPassword = signal('');
  showPasswords = signal(false);

  // Expose service signals
  isLoading = this.userService.isLoading;
  error = this.userService.error;
  successMessage = signal<string | null>(null);

  // Computed validations
  passwordsMatch = computed(() => this.newPassword() === this.confirmPassword());
  passwordValid = computed(() => this.newPassword().length >= 8);
  formValid = computed(() => {
    return this.currentPassword().length > 0 &&
           this.newPassword().length >= 8 &&
           this.passwordsMatch();
  });

  onSubmit() {
    if (!this.formValid()) {
      return;
    }

    this.successMessage.set(null);
    this.userService.changePassword(this.currentPassword(), this.newPassword());

    // Clear form on success
    setTimeout(() => {
      if (!this.error()) {
        this.currentPassword.set('');
        this.newPassword.set('');
        this.confirmPassword.set('');
        this.successMessage.set('Mot de passe changé avec succès!');
        
        // Clear success message after 3s
        setTimeout(() => {
          this.successMessage.set(null);
        }, 3000);
      }
    }, 300);
  }

  togglePasswordVisibility() {
    this.showPasswords.set(!this.showPasswords());
  }
}
