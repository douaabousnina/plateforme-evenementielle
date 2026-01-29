import { Component, inject, signal, computed, effect } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { QRCodeComponent } from '../../components/qr-code/qr-code.component';
import { ReservationService } from '../../services/reservation.service';
import { PaymentService } from '../../services/payment.service';
import { OrderDetailsComponent } from '../../components/order-details/order-details.component';
import { BreadcrumbComponent } from '../../../../shared/components/breadcrumb/breadcrumb.component';
import { createBreadcrumbSteps } from '../../../../core/config/breadcrumb.config';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-confirmation-page',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    QRCodeComponent,
    OrderDetailsComponent,
    BreadcrumbComponent
  ],
  templateUrl: './confirmation.page.html',
})
export class ConfirmationPage {
  private router = inject(Router);
  private reservationService = inject(ReservationService);
  private paymentService = inject(PaymentService);
  private eventService = inject(EventService);

  breadcrumbSteps = signal(createBreadcrumbSteps('confirmation'));

  reservation = signal<any>(null);
  payment = signal<any>(null);
  event = signal<any>(null);

  confirmationCode = signal<string>('');
  qrCode = signal<string>('');

  loading = computed(() =>
    this.reservationService.loading() ||
    this.paymentService.loading() ||
    this.eventService.loading()
  );

  errorMessage = computed(() =>
    this.reservationService.error() ||
    this.paymentService.error() ||
    this.eventService.error()
  );

  order = computed(() => {
    const res = this.reservation();
    const pay = this.payment();
    const evt = this.event();

    if (!res || !pay || !evt) {
      return null;
    }

    // Transform seats to items
    const items = (res.seats || []).map((seat: any) => ({
      ticketType: seat.category,
      quantity: 1,
      description: `Section ${seat.section} - Rangée ${seat.row}, Place ${seat.number}`,
      totalPrice: parseFloat(seat.price)
    }));

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => sum + item.totalPrice, 0);
    const serviceFee = subtotal * 0.1;
    const total = subtotal + serviceFee;

    return {
      id: res.id,
      items: items,
      subtotal: subtotal,
      serviceFee: serviceFee,
      total: total,
      status: pay.status,
      paymentId: pay.id,
      createdAt: pay.createdAt,
      cardLast4: pay.cardLast4,
      paymentMethod: pay.method,
      confirmationCode: '',
      qrCode: '',
      event: {
        imageUrl: evt.imageUrl || evt.image || '/assets/default-event.jpg',
        title: evt.name || evt.title,
        type: evt.type || evt.category,
        date: evt.date,
        time: evt.time || evt.startTime,
        venue: evt.location || evt.venue
      }
    };
  });

  constructor() {
    effect(() => {
      const state = history.state;
      const reservationId = state?.reservationId;

      if (!reservationId) {
        this.router.navigate(['/']);
        return;
      }

      this.loadConfirmationData(reservationId);
    });
  }

  private loadConfirmationData(reservationId: string): void {
    // 1. Fetch reservation (contains paymentId & eventId)
    this.reservationService.getReservation(reservationId).subscribe({
      next: (reservation) => {
        this.reservation.set(reservation);

        // 2. Fetch payment using paymentId from reservation
        this.paymentService.getSuccessfulPaymentByReservationId(reservationId).subscribe({
          next: (payment) => this.payment.set(payment),
          error: (error) => console.error('Error loading payment:', error)
        });


        // 3. Fetch event using eventId from reservation
        if (reservation.eventId) {
          this.eventService.loadEventById(reservation.eventId).subscribe({
            next: (event) => this.event.set(event),
            error: (error) => console.error('Error loading event:', error)
          });
        }
      },
      error: (error) => {
        console.error('Error loading reservation:', error);
        this.router.navigate(['/']);
      }
    });
  }

  downloadTickets(): void {
    const order = this.order();
    if (!order) return;
    console.log('Download tickets for:', order.id);
  }

  printConfirmation(): void {
    window.print();
  }

  goToMyTickets(): void {
    this.router.navigate(['/my-tickets']);
  }
}