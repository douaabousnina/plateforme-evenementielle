import { Routes } from '@angular/router';

import { MyTicketsComponent } from './pages/my-tickets/my-tickets.page';
import { ScanHistoryComponent } from './pages/scan-history/scan-history.page';
import { QrScannerComponent } from './pages/qr-scanner/qr-scanner.page';
import { roleGuard } from '../../core/guards/role.guard';
import { Role } from '../auth-users/models/auth.model';

export const accessRoutes: Routes = [
  { 
    path: 'my-tickets', 
    component: MyTicketsComponent,
    canActivate: [roleGuard],
    data: { 
      roles: [Role.CLIENT],
      redirectIfNotAuth: '/login',
      redirectIfNoRole: '/login',
      accessDeniedMessage: 'Please log in to view your tickets'
    }
  },


  { 
    path: 'dashboard/scanner', 
    component: QrScannerComponent,
    canActivate: [roleGuard],
    data: { 
      roles: [Role.ORGANIZER, Role.ADMIN],
      redirectIfNotAuth: '/login',
      redirectIfNoRole: '/',
      accessDeniedMessage: 'Only organizers can access the scanner'
    }
  },
  { 
    path: 'dashboard/scan-history', 
    component: ScanHistoryComponent,
    canActivate: [roleGuard],
    data: { 
      roles: [Role.ORGANIZER, Role.ADMIN],
      redirectIfNotAuth: '/login',
      redirectIfNoRole: '/',
      accessDeniedMessage: 'Only organizers can access scan history'
    }
  },
];
