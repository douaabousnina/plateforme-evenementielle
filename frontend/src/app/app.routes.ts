import { Routes } from '@angular/router';
import { authRoutes } from './features/auth-users/auth.routes';
import { reservationRoutes } from './features/reservation/reservation.routes';
import { organizerRoutes } from './organizer/organizer.routes';
import { accessRoutes } from './features/access/access.routes';
import { ADMIN_ROUTES } from './admin/admin.routes';


export const routes: Routes = [
    {
        path: 'admin',
        children: ADMIN_ROUTES
    },
    ...reservationRoutes, 
    ...organizerRoutes,
    ...accessRoutes,
    ...authRoutes
]