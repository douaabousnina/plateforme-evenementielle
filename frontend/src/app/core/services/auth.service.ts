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
  private currentUser = signal<User | null>(null);

  getCurrentUser() {
    return this.currentUser();
  }

  setCurrentUser(user: User | null) {
    this.currentUser.set(user);
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

  logout() {
    this.currentUser.set(null);
  }
}
