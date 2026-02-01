import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../../features/auth-users/services/auth.service';
import { Role } from '../../features/auth-users/models/auth.model';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const requiredRoles = route.data['roles'] as Role[];
  const redirectIfNotAuth = route.data['redirectIfNotAuth'] as string || '/';
  const redirectIfNoRole = route.data['redirectIfNoRole'] as string || '/';
  const accessDeniedMessage = route.data['accessDeniedMessage'] as string;
  
  const currentUser = authService.getCurrentUser();

  if (!currentUser) {
    // No user logged in
    router.navigate([redirectIfNotAuth]);
    return false;
  }

  if (requiredRoles && requiredRoles.length > 0) {
    const hasRole = requiredRoles.includes(currentUser.role);
    
    if (!hasRole) {
      // User doesn't have required role
      if (accessDeniedMessage) {
        alert(accessDeniedMessage);
      }
      router.navigate([redirectIfNoRole]);
      return false;
    }
  }

  return true;
};
