import { Routes } from '@angular/router';
import { authRoutes } from './features/auth-users/auth.routes';
import { reservationRoutes } from './features/reservation/reservation.routes';
import { organizerRoutes } from './organizer/organizer.routes';
import { accessRoutes } from './features/access/access.routes';
import { clientRoutes } from './features/client/client.routes';

export const routes: Routes = [
  ...authRoutes,
  ...clientRoutes,
  ...reservationRoutes,
  ...accessRoutes,
  {
    path: "dashboard", children: [
      ...organizerRoutes,
    ]
  },
  {
    path: "", redirectTo: "login", pathMatch: "full"
  }
];