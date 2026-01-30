import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout.component';
import { UsersListComponent } from './pages/users-list.component';
import { roleGuard } from '../core/guards/role.guard';
import { Role } from '../features/auth-users/models/auth.model';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [roleGuard],
    data: { 
      roles: [Role.ADMIN],
      redirectIfNotAuth: '/login',
      redirectIfNoRole: '/',
      accessDeniedMessage: 'Accès refusé. Cette page est réservée aux administrateurs.'
    },
    children: [
      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full'
      },
      {
        path: 'users',
        component: UsersListComponent
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'events',
        loadComponent: () => import('./pages/events-list.component').then(m => m.EventsListComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('./pages/reports.component').then(m => m.ReportsComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/settings.component').then(m => m.SettingsComponent)
      }
    ]
  }
];
