import { Injectable, inject, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../../core/services/api.service';
import { Role } from '../models/auth.model';

export interface UserProfile {
  id: number;
  email: string;
  name?: string;
  lastName?: string;
  phoneNumber?: string;
  role: Role;
  preferences?: string[];
  loyaltyPoints?: number;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiService = inject(ApiService);

  // Signals
  userProfile = signal<UserProfile | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);

  // Load profile
  loadProfile(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.apiService.get<UserProfile>('users/me').subscribe({
      next: (user) => {
        this.userProfile.set(user);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Erreur lors du chargement du profil');
        this.isLoading.set(false);
      }
    });
  }

  // Update profile
  updateProfile(data: Partial<UserProfile>): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.apiService.patch<UserProfile>('users/me', data).subscribe({
      next: (user) => {
        this.userProfile.set(user);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Erreur lors de la mise à jour');
        this.isLoading.set(false);
      }
    });
  }

  // Delete account
  deleteAccount(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.apiService.delete('users/me').subscribe({
      next: () => {
        this.userProfile.set(null);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Erreur lors de la suppression');
        this.isLoading.set(false);
      }
    });
  }

  // Change password
  changePassword(currentPassword: string, newPassword: string): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.apiService.post<{ message: string }>('users/change-password', {
      currentPassword,
      newPassword
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Erreur lors du changement de mot de passe');
        this.isLoading.set(false);
      }
    });
  }

  clearError(): void {
    this.error.set(null);
  }
}
