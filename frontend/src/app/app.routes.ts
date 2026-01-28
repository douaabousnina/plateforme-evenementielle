import { Routes } from '@angular/router';
import { reservationRoutes } from './features/reservation/reservation.routes';
import { accessRoutes } from './feature/access/access.routes';

export const routes: Routes = [
    ...reservationRoutes,...accessRoutes

];
