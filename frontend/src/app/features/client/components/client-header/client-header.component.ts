import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClientDashboardService } from '../../services/client-dashboard.service';

@Component({
  selector: 'app-client-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './client-header.component.html',
  styleUrls: ['./client-header.component.css'],
})
export class ClientHeaderComponent {
  private readonly dashboard = inject(ClientDashboardService);

  get appName(): string {
    return this.dashboard.getAppName();
  }

  get userDisplayName(): string {
    return this.dashboard.getUserDisplayName();
  }
}
