import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService, UserRole } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const requiredRoles = route.data['roles'] as UserRole[];
  const currentUser = authService.getCurrentUser();

  if (!currentUser) {
    // No user logged in
    router.navigate(['/']);
    return false;
  }

  if (requiredRoles && requiredRoles.length > 0) {
    const hasRole = requiredRoles.includes(currentUser.role);
    
    if (!hasRole) {
      // User doesn't have required role
      alert('Access denied. This page is only accessible to organizers.');
      router.navigate(['/']);
      return false;
    }
  }

  return true;
};
