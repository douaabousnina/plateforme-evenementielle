import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UpcomingEventCard } from '../../models/client-dashboard.model';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css'],
})
export class EventCardComponent {
  event = input.required<UpcomingEventCard>();
}
