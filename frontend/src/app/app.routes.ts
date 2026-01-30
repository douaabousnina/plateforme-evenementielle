import { Routes } from '@angular/router';
import { authRoutes } from './features/auth-users/auth.routes';
import { reservationRoutes } from './features/reservation/reservation.routes';
import { organizerRoutes } from './organizer/organizer.routes';
import { accessRoutes } from './features/access/access.routes';
import { clientRoutes } from './features/client/client.routes';

export const routes: Routes = [
  ...reservationRoutes,
  ...organizerRoutes,
  ...accessRoutes,
  ...authRoutes,
  ...clientRoutes
];