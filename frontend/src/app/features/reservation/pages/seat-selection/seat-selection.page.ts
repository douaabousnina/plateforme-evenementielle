import { Component, signal, computed, inject, effect } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs/operators';
import { InteractiveSeatMapComponent } from '../../components/interactive-seat-map/interactive-seat-map.component';
import { SeatCartSummaryComponent } from '../../components/seat-cart-summary/seat-cart-summary.component';
import { SeatService } from '../../services/seat.service';
import { ReservationService } from '../../services/reservation.service';
import { EventService } from '../../services/event.service';
import { Seat } from '../../models/reservation.model';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { BreadcrumbComponent } from '../../../../shared/components/breadcrumb/breadcrumb.component';
import { CartService } from '../../services/cart.service';
import { createBreadcrumbSteps } from '../../../../core/config/breadcrumb.config';

@Component({
  selector: 'app-seat-selection-page',
  standalone: true,
  imports: [
    CommonModule,
    InteractiveSeatMapComponent,
    SeatCartSummaryComponent,
    HeaderComponent,
    BreadcrumbComponent,
  ],
  templateUrl: './seat-selection.page.html'
})
export class SeatSelectionPage {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  private eventService = inject(EventService);
  private seatService = inject(SeatService);
  private reservationService = inject(ReservationService);
  private cartService = inject(CartService);

  breadcrumbSteps = signal(createBreadcrumbSteps('seatSelection'));

  eventId = toSignal(
    this.activatedRoute.paramMap.pipe(
      map(params => params.get('eventId'))
    )
  );

  seats = this.seatService.seats;
  selectedSeats = this.cartService.reservedSeats;
  subtotal = this.cartService.subtotal;
  serviceFee = this.cartService.serviceFee;
  total = this.cartService.total;

  currentEvent = this.eventService.currentEvent;

  loadingSeats = this.seatService.loading;
  loadingReservation = this.reservationService.loading;

  errorMessage = computed(() => {
    // Check cart errors
    const cartError = this.cartService.errorMessage();
    if (cartError) return cartError;

    // check API errors
    if (this.eventService.error()) return this.eventService.error();
    if (this.seatService.error()) return this.seatService.error();
    if (this.reservationService.error()) return this.reservationService.error();

    return null;
  });

  constructor() {
    effect(() => {
      const id = this.eventId();

      if (id) {
        this.loadData(id);
      }
    });
  }

  private loadData(eventId: string): void {
    // Load event first, then seats from the event data
    this.eventService.loadEventById(eventId).pipe(
      switchMap(() => this.seatService.loadSeatsByEventId(eventId))
    ).subscribe();
  }

  getLocationString(location: any): string {
    if (!location) return 'Lieu à déterminer';
    if (typeof location === 'string') return location;
    return location.city || location.venue || location.address || 'Lieu à déterminer';
  }

  handleSeatSelection(seat: Seat): void { this.cartService.toggleSeat(seat); }

  handleRemoveSeat(seatId: string): void { this.cartService.removeSeat(seatId); }

  handleClearCart(): void { this.cartService.clearCart(); }

  handleProceedToPayment(): void {
    const eventId = this.eventId();
    if (!eventId) {
      this.cartService.errorMessage.set('Event ID is required');
      return;
    }

    // Validate cart
    const validation = this.cartService.validateCart();
    if (!validation.isValid) {
      this.cartService.errorMessage.set(validation.error || 'Cart is not valid');
      return;
    }

    const seatIds = this.selectedSeats().map(s => s.id);

    this.reservationService.lockSeats({
      eventId: eventId,
      seatIds: seatIds
    }).subscribe({
      next: (reservation) => {
        this.router.navigate(['/payment/', reservation.id], {
          state: { reservationId: reservation.id }
        });
      }
    });
  }
}