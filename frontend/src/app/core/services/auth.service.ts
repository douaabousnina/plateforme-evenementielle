import { Injectable, signal } from '@angular/core';

export enum UserRole {
  CLIENT = 'client',
  ORGANIZER = 'organizer',
  CONTROLLER = 'controller'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Mock current user - in production, this would come from backend/token
  private currentUser = signal<User | null>({
    id: 'user-123',
    name: 'John Doe',
    role: UserRole.CLIENT // Change to ORGANIZER to test organizer features
  });

  getCurrentUser() {
    return this.currentUser();
  }

  isOrganizer(): boolean {
    return this.currentUser()?.role === UserRole.ORGANIZER;
  }

  isController(): boolean {
    return this.currentUser()?.role === UserRole.CONTROLLER;
  }

  hasRole(role: UserRole): boolean {
    return this.currentUser()?.role === role;
  }

  // Mock login - in production, this would authenticate with backend
  setUserRole(role: UserRole) {
    const user = this.currentUser();
    if (user) {
      this.currentUser.set({ ...user, role });
    }
  }
}
