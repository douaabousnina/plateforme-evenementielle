import { Routes } from '@angular/router';
import { ClientDashboardPage } from './pages/client-dashboard/client-dashboard.page';

export const clientRoutes: Routes = [
  {
    path: 'dashboard',
    component: ClientDashboardPage,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
];
