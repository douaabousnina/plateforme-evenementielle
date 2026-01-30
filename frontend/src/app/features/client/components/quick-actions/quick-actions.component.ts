import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClientDashboardService } from '../../services/client-dashboard.service';

@Component({
  selector: 'app-quick-actions',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './quick-actions.component.html',
  styleUrls: ['./quick-actions.component.css'],
})
export class QuickActionsComponent {
  private readonly dashboard = inject(ClientDashboardService);
  readonly actions = this.dashboard.quickActionsList;
}
