import { Routes } from '@angular/router';
import { reservationRoutes } from './features/reservation/reservation.routes';
import { accessRoutes } from './features/access/access.routes';

export const routes: Routes = [
    ...reservationRoutes,...accessRoutes

];
