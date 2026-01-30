import { Component, inject, OnInit } from '@angular/core';
import { ClientHeaderComponent } from '../../components/client-header/client-header.component';
import { WelcomeSectionComponent } from '../../components/welcome-section/welcome-section.component';
import { UpcomingEventsCarouselComponent } from '../../components/upcoming-events-carousel/upcoming-events-carousel.component';
import { RecommendationsSectionComponent } from '../../components/recommendations-section/recommendations-section.component';
import { ClientSidebarComponent } from '../../components/client-sidebar/client-sidebar.component';
import { ClientDashboardService } from '../../services/client-dashboard.service';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [
    ClientHeaderComponent,
    WelcomeSectionComponent,
    UpcomingEventsCarouselComponent,
    RecommendationsSectionComponent,
    ClientSidebarComponent,
  ],
  templateUrl: './client-dashboard.page.html',
  styleUrls: ['./client-dashboard.page.css'],
})
export class ClientDashboardPage implements OnInit {
  private readonly dashboard = inject(ClientDashboardService);

  readonly welcomeData = this.dashboard.welcomeData;
  readonly loading = this.dashboard.isLoading;
  readonly error = this.dashboard.hasError;

  ngOnInit(): void {
    this.dashboard.loadDashboard().subscribe();
  }
}
