import { Component, signal, computed, inject, effect } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InteractiveSeatMapComponent } from '../../components/interactive-seat-map/interactive-seat-map.component';
import { SeatCartSummaryComponent } from '../../components/seat-cart-summary/seat-cart-summary.component';
import { TimerService } from '../../../../core/services/timer.service';
import { SeatService } from '../../services/seat.service';
import { ReservationService } from '../../services/reservation.service';
import { EventService } from '../../services/event.service';
import { Seat } from '../../models/reservation.model';
import { Event } from '../../models/event.model';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { BreadcrumbComponent } from '../../../../shared/components/breadcrumb/breadcrumb.component';
import { BreadcrumbStep } from '../../../../core/models/breadcrumb.model';
import { CartService } from '../../services/cart.service';

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
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  timerService = inject(TimerService);
  eventService = inject(EventService);
  seatService = inject(SeatService);
  reservationService = inject(ReservationService);
  cartService = inject(CartService);

  loadingSeats = signal<boolean>(false);
  loadingReservation = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  eventId = signal<string>('');

  currentEvent = signal<Event | null>(null);
  seats = this.seatService.seats;
  selectedSeats = signal<Seat[]>([]);

  breadcrumbSteps = signal<BreadcrumbStep[]>([
    { label: 'Sélection', route: '/seat-selection', completed: false, active: true, stepNumber: 1 },
    { label: 'Paiement', route: '/payment', completed: false, active: false, stepNumber: 2 },
    { label: 'Confirmation', route: '/confirmation', completed: false, active: false, stepNumber: 3 }
  ]);

  subtotal = computed(() =>
    this.selectedSeats().reduce((sum, seat) => sum + seat.price, 0)
  );

  serviceFee = computed(() =>
    Math.round(this.subtotal() * 0.035 * 100) / 100
  );

  total = computed(() =>
    this.subtotal() + this.serviceFee()
  );

  constructor() {
    this.timerService.start();

    effect(() => {
      this.activatedRoute.paramMap.subscribe(params => {
        const id = params.get('eventId') || '';
        this.eventId.set(id);
      });
    });

    effect(() => {
      const id = this.eventId();
      if (!id) {
        this.errorMessage.set('Event ID is required');
        return;
      }
      this.loadEventAndSeats(id);
    });
  }

  private loadEventAndSeats(eventId: string): void {
    // Load event
    this.eventService.getEventById(eventId).subscribe({
      next: (event: any) => {
        this.currentEvent.set(event);
      },
      error: (error: any) => {
        this.errorMessage.set('Failed to load event details');
        console.error('Error loading event:', error);
      }
    });

    // Load seats
    this.loadingSeats.set(true);
    this.seatService.getSeatsByEventId(eventId).subscribe({
      next: (seats: any) => {
        // this.seats.set(seats); // Removed: handled by service signal
        this.loadingSeats.set(false);
        console.log(seats);
      },
      error: () => {
        this.errorMessage.set('Failed to load seats');
        this.loadingSeats.set(false);
      }
    });

  }

  handleSeatSelection(seat: Seat): void {
    const isSelected = this.selectedSeats().some(s => s.id === seat.id);

    if (isSelected) {
      // Deselect
      this.handleRemoveSeat(seat.id);
    } else {
      // Select
      if (this.selectedSeats().length >= 10) {
        this.errorMessage.set('Maximum 10 billets par commande');
        return;
      }
      this.selectedSeats.update(seats => [...seats, seat]);
      this.seatService.updateSeatStatus(seat.id, 'selected');
    }
  }

  handleRemoveSeat(seatId: string): void {
    this.selectedSeats.update(seats => seats.filter(s => s.id !== seatId));
    this.seatService.updateSeatStatus(seatId, 'available');
  }

  handleClearCart(): void {
    const selectedIds = this.selectedSeats().map(s => s.id);
    this.selectedSeats.set([]);
    selectedIds.forEach(id => {
      this.seatService.updateSeatStatus(id, 'available');
    });
  }

  handleProceedToPayment(): void {
    if (this.selectedSeats().length === 0) {
      this.errorMessage.set('Veuillez sélectionner au moins une place');
      return;
    }

    this.loadingReservation.set(true);
    this.errorMessage.set(null);

    // Lock seats on backend
    const seatIds = this.selectedSeats().map(s => s.id);
    this.reservationService.lockSeats({
      eventId: this.eventId(),
      seatIds: seatIds
    }).subscribe({
      next: (reservation: any) => {
        this.loadingReservation.set(false);

        // Populate cart service before navigation
        if (this.currentEvent()) {
          this.cartService.setEvent(this.currentEvent()!);
          this.cartService.setSeats(this.selectedSeats());
        }

        // Navigate to payment with reservation ID
        this.router.navigate(['/payment'], {
          state: { reservationId: reservation.id }
        });
      },
      error: (error: any) => {
        this.loadingReservation.set(false);
        this.errorMessage.set(error?.error?.message || 'Failed to lock seats. Please try again.');
        console.error('Error locking seats:', error);
      }
    });
  }
}
