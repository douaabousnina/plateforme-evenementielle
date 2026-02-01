import { Routes } from '@angular/router';
import { ClientDashboardPage } from './pages/client-dashboard/client-dashboard.page';
import { MarketplacePage } from './pages/marketplace/marketplace.page';
import { EventDetailPage } from './pages/event-detail/event-detail.page';
import { roleGuard } from '../../core/guards/role.guard';
import { Role } from '../auth-users/models/auth.model';

export const clientRoutes: Routes = [
  {
    path: 'home',
    component: ClientDashboardPage,
    canActivate: [roleGuard],
    data: { roles: [Role.CLIENT], redirectIfNotAuth: '/login', redirectIfNoRole: '/' },
  },
  {
    path: 'events',
    component: MarketplacePage,
    canActivate: [roleGuard],
    data: { roles: [Role.CLIENT], redirectIfNotAuth: '/login', redirectIfNoRole: '/' },
  },
  {
    path: 'events/:id',
    component: EventDetailPage,
    canActivate: [roleGuard],
    data: { roles: [Role.CLIENT], redirectIfNotAuth: '/login', redirectIfNoRole: '/' },
  }
];
