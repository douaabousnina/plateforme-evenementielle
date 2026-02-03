import { Component, input } from '@angular/core';
import { EventDetail } from '../../models/event-detail.model';

@Component({
  selector: 'app-event-detail-description',
  
  templateUrl: './event-detail-description.component.html',
  styleUrls: ['./event-detail-description.component.css'],
})
export class EventDetailDescriptionComponent {
  event = input.required<EventDetail>();
  /** Optional bullet points (e.g. from API). */
  highlights = input<string[]>([]);
}
