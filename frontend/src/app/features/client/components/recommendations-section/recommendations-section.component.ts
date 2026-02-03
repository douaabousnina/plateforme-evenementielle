import { Component, inject } from '@angular/core';
import { RecommendationCardComponent } from '../recommendation-card/recommendation-card.component';
import { ClientDashboardService } from '../../services/client-dashboard.service';

@Component({
  selector: 'app-recommendations-section',
  
  imports: [RecommendationCardComponent],
  templateUrl: './recommendations-section.component.html',
  styleUrls: ['./recommendations-section.component.css'],
})
export class RecommendationsSectionComponent {
  private readonly dashboard = inject(ClientDashboardService);
  readonly recommendations = this.dashboard.recommendationsList;
}
