import { Routes } from '@angular/router';
import { ClientDashboardPage } from './pages/client-dashboard/client-dashboard.page';
import { MarketplacePage } from './pages/marketplace/marketplace.page';
import { EventDetailPage } from './pages/event-detail/event-detail.page';

export const clientRoutes: Routes = [
  {
    path: 'home',
    component: ClientDashboardPage,
  },
  {
    path: 'marketplace',
    component: MarketplacePage,
  },
  {
    path: 'events/:id',
    component: EventDetailPage,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
];
