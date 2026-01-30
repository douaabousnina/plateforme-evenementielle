import { Injectable, signal, inject } from '@angular/core';
import { ApiService } from './api.service';
import { tap } from 'rxjs/operators';

export enum UserRole {
  CLIENT = 'CLIENT',
  ORGANIZER = 'ORGANIZER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiService = inject(ApiService);

  private currentUser = signal<User | null>(null);

  constructor() {
    this.loadCurrentUser();
  }

  private loadCurrentUser(): void {
    this.apiService.get<User>('users/me').pipe(
      tap(user => {
        if (user) {
          this.currentUser.set({
            id: user.id?.toString() || '',
            firstName: user.name || user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            role: this.mapRole(user.role)
          });
        }
      })
    ).subscribe({
      error: () => {
        // User not authenticated, keep currentUser as null
        console.log('User not authenticated');
      }
    });
  }

  private mapRole(role: string | UserRole): UserRole {
    if (role === 'ORGANIZER') return UserRole.ORGANIZER;
    if (role === 'ADMIN') return UserRole.ADMIN;
    return UserRole.CLIENT;
  }

  getCurrentUser() {
    return this.currentUser();
  }

  setCurrentUser(user: User | null) {
    this.currentUser.set(user);
  }

  isOrganizer(): boolean {
    return this.currentUser()?.role === UserRole.ORGANIZER;
  }


  isAdmin(): boolean {
    return this.currentUser()?.role === UserRole.ADMIN;
  }

  hasRole(role: UserRole): boolean {
    return this.currentUser()?.role === role;
  }

  logout() {
    this.currentUser.set(null);
  }
}
