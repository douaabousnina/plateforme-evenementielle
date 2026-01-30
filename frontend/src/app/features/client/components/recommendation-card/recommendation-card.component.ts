import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RecommendationCard } from '../../models/client-dashboard.model';

@Component({
  selector: 'app-recommendation-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './recommendation-card.component.html',
  styleUrls: ['./recommendation-card.component.css'],
})
export class RecommendationCardComponent {
  /** Single recommendation – no hardcoding. */
  recommendation = input.required<RecommendationCard>();
}
