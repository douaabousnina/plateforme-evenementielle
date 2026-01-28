import { Routes } from '@angular/router';

import { accessRoutes } from './feature/access/access.routes';

export const routes: Routes = [
  { path: '', redirectTo: '/access', pathMatch: 'full' },
  { path: 'access', children: accessRoutes },
];
