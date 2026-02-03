import { Component, input } from '@angular/core';
import { LoyaltyInfo } from '../../models/client-dashboard.model';

@Component({
  selector: 'app-loyalty-card',
  
  imports: [],
  templateUrl: './loyalty-card.component.html',
  styleUrls: ['./loyalty-card.component.css'],
})
export class LoyaltyCardComponent {
  /** Data from ClientDashboardService.loyaltyData – no hardcoding. */
  data = input.required<LoyaltyInfo | null>();
}
