import { Routes } from '@angular/router';
import { reservationRoutes } from './features/reservation/reservation.routes';
import { organizerRoutes } from './organizer/organizer.routes';
import { accessRoutes } from './features/access/access.routes';


export const routes: Routes = [
    ...reservationRoutes, 
    ...organizerRoutes,
    ...accessRoutes
]