import { Component, input } from '@angular/core';
import { EventDetailArtist } from '../../models/event-detail.model';

@Component({
  selector: 'app-event-detail-lineup',
  standalone: true,
  templateUrl: './event-detail-lineup.component.html',
  styleUrls: ['./event-detail-lineup.component.css'],
})
export class EventDetailLineupComponent {
  artists = input.required<EventDetailArtist[]>();
  sectionTitle = input('Programmation & Artistes');
}
