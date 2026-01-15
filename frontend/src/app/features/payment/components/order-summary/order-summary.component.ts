import { Component, inject, computed } from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { CartService } from '../../../../core/services/cart.service';
import { TimerComponent } from '../../../../shared/components/timer/timer.component';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [DecimalPipe, DatePipe, TimerComponent, TimerComponent],
  templateUrl: './order-summary.component.html',
})
export class OrderSummaryComponent {
  private cartService = inject(CartService);

  order = this.cartService.order;
}