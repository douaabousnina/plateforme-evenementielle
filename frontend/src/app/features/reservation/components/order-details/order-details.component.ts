import { Component, input } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [DatePipe, DecimalPipe],
  templateUrl: './order-details.component.html',
})
export class OrderDetailsComponent {
  order = input<any>();
}
