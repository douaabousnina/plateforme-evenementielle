import { Component, input } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Ticket } from '../../../access/models/access.model';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [DatePipe, DecimalPipe],
  templateUrl: './order-details.component.html',
})
export class OrderDetailsComponent {
  order = input<any>();
  tickets = input<Ticket[]>([]);
}
