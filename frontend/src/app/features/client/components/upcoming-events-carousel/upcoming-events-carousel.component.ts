import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EventCardComponent } from '../event-card/event-card.component';
import { ClientDashboardService } from '../../services/client-dashboard.service';

@Component({
  selector: 'app-upcoming-events-carousel',
  standalone: true,
  imports: [RouterLink, EventCardComponent],
  templateUrl: './upcoming-events-carousel.component.html',
  styleUrls: ['./upcoming-events-carousel.component.css'],
})
export class UpcomingEventsCarouselComponent {
  private readonly dashboard = inject(ClientDashboardService);
  readonly upcomingEvents = this.dashboard.upcomingEventsList;
}
