import { Component, inject } from '@angular/core';
import { LoyaltyCardComponent } from '../loyalty-card/loyalty-card.component';
import { QuickActionsComponent } from '../quick-actions/quick-actions.component';
import { NotificationsFeedComponent } from '../notifications-feed/notifications-feed.component';
import { ClientDashboardService } from '../../services/client-dashboard.service';

@Component({
  selector: 'app-client-sidebar',
  
  imports: [LoyaltyCardComponent, QuickActionsComponent, NotificationsFeedComponent],
  templateUrl: './client-sidebar.component.html',
  styleUrls: ['./client-sidebar.component.css'],
})
export class ClientSidebarComponent {
  private readonly dashboard = inject(ClientDashboardService);
  readonly loyaltyData = this.dashboard.loyaltyData;
}
