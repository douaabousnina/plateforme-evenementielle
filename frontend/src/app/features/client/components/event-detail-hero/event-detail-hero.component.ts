import { Component, input } from '@angular/core';
import { EventDetail } from '../../models/event-detail.model';

@Component({
  selector: 'app-event-detail-hero',
  
  templateUrl: './event-detail-hero.component.html',
  styleUrls: ['./event-detail-hero.component.css'],
})
export class EventDetailHeroComponent {
  event = input.required<EventDetail>();
}
