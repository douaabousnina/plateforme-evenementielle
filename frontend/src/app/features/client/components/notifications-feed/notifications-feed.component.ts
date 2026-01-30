import { Component, inject } from '@angular/core';
import { ClientDashboardService } from '../../services/client-dashboard.service';

@Component({
  selector: 'app-notifications-feed',
  standalone: true,
  imports: [],
  templateUrl: './notifications-feed.component.html',
  styleUrls: ['./notifications-feed.component.css'],
})
export class NotificationsFeedComponent {
  private readonly dashboard = inject(ClientDashboardService);
  readonly notifications = this.dashboard.notificationsList;

  markAllRead(): void {
    this.dashboard.markAllNotificationsRead();
  }
}
