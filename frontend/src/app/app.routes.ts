import { Routes } from '@angular/router';

export const routes: Routes = [
   {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./organizer/pages/dashboard/dashboard').then(m => m.Dashboard)
  },
 {
    path: 'events',
    loadComponent: () => import('./organizer/pages/events/events').then(m => m.Events)
  },
//   {
//     path: 'events/create',
//     loadComponent: () => import('./organizer/pages/event-create/event-create').then(m => m.EventCreate)
//   },
//   {
//     path: 'marketing',
//     loadComponent: () => import('./organizer/pages/marketing/marketing').then(m => m.Marketing)
//   },
//   {
//     path: 'reports',
//     loadComponent: () => import('./organizer/pages/reports/reports').then(m => m.Reports)
//   },
//   {
//     path: 'settings',
//     loadComponent: () => import('./organizer/pages/settings/settings').then(m => m.Settings)
//   }
];