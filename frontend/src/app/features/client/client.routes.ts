import { Routes } from '@angular/router';
import { ClientDashboardPage } from './pages/client-dashboard/client-dashboard.page';
import { MarketplacePage } from './pages/marketplace/marketplace.page';
import { EventDetailPage } from './pages/event-detail/event-detail.page';

export const clientRoutes: Routes = [
  {
    path: '',
    component: ClientDashboardPage,
  },
  {
    path: 'events',
    component: MarketplacePage,
  },
  {
    path: 'events/:id',
    component: EventDetailPage,
  }
];
