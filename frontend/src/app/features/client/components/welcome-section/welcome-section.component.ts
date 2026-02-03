import { Component, inject, input } from '@angular/core';
import { WelcomeSectionData } from '../../models/client-dashboard.model';

@Component({
  selector: 'app-welcome-section',
  
  imports: [],
  templateUrl: './welcome-section.component.html',
  styleUrls: ['./welcome-section.component.css'],
})
export class WelcomeSectionComponent {
  /** Data from parent (ClientDashboardService.welcomeData). No hardcoding. */
  data = input.required<WelcomeSectionData | null>();
}
