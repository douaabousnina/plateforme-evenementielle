import { Routes } from '@angular/router';

import { MyTicketsComponent } from './pages/my-tickets/my-tickets.page';
import { ScanHistoryComponent } from './pages/scan-history/scan-history.page';
import { QrScannerComponent } from './pages/qr-scanner/qr-scanner.page';
import { roleGuard } from '../../core/guards/role.guard';
import { UserRole } from '../../core/services/auth.service';

export const accessRoutes: Routes = [
  { path: 'my-tickets', component: MyTicketsComponent },
  { path: 'scanner', component: QrScannerComponent },
  { 
    path: 'scan-history', 
    component: ScanHistoryComponent,
    // canActivate: [roleGuard],
    // data: { roles: [UserRole.ORGANIZER] }
  },
];
