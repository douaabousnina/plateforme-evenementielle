// features/seat-selection/components/seat-cart-summary/seat-cart-summary.component.ts
import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-seat-cart-summary',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './seat-cart-summary.component.html'
})
export class SeatCartSummaryComponent {
  selectedSeats = input.required<any[]>();
  subtotal = input.required<number>();
  serviceFee = input.required<number>();
  total = input.required<number>();
  isLoading = input<boolean>(false);
  readonly = input<boolean>(false); // Controls if component is in read-only mode

  removeSeat = output<string>();
  clearCart = output<void>();
  proceedToPayment = output<void>();
}