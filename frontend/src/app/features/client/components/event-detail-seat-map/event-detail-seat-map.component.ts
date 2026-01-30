import { Component, input, output } from '@angular/core';
import { SeatMapSection } from '../../models/event-detail.model';

@Component({
  selector: 'app-event-detail-seat-map',
  standalone: true,
  templateUrl: './event-detail-seat-map.component.html',
  styleUrls: ['./event-detail-seat-map.component.css'],
})
export class EventDetailSeatMapComponent {
  sections = input.required<SeatMapSection[]>();
  sectionTitle = input('Plan de la salle');
  expandLabel = input('Agrandir');
  chooseOnMapLabel = input('Choisir sur le plan');
  availableLabel = input('Disponible');
  selectedLabel = input('Sélectionné');
  occupiedLabel = input('Occupé');

  expandClick = output<void>();
  chooseOnMapClick = output<void>();
}
