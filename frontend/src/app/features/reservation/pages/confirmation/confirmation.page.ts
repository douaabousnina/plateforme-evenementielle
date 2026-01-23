import { Component, inject, signal, computed, effect } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { QRCodeComponent } from '../../components/qr-code/qr-code.component';
import { ReservationService } from '../../services/reservation.service';
import { PaymentService } from '../../services/payment.service';
import { OrderDetailsComponent } from '../../components/order-details/order-details.component';
import { BreadcrumbComponent } from '../../../../shared/components/breadcrumb/breadcrumb.component';
import { BreadcrumbStep } from '../../../../core/models/breadcrumb.model';

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

  breadcrumbSteps = signal<BreadcrumbStep[]>([
    { label: 'Sélection', route: '/seat-selection', completed: true, active: false, stepNumber: 1 },
    { label: 'Paiement', route: '/payment', completed: true, active: false, stepNumber: 2 },
    { label: 'Confirmation', route: '/confirmation', completed: false, active: true, stepNumber: 3 }
  ]);

  confirmationCode = signal<string>('');
  transactionId = signal<string>('');
  qrCode = signal<string>('');
  reservation = signal<any>(null);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  order = computed(() => {
    const res = this.reservation();
    if (!res) return null;

    return {
      id: res.id,
      items: res.seats || [],
      totalPrice: res.totalPrice,
      status: res.status,
      confirmationCode: this.confirmationCode(),
      transactionId: this.transactionId(),
      qrCode: this.qrCode(),
      contactInfo: this.paymentService.contact(),
      createdAt: res.createdAt || new Date()
    };
  });

  constructor() {
    effect(() => {
      const navigation = this.router.currentNavigation();
      const state = navigation?.extras?.state;

      if (state?.['confirmationCode']) {
        this.confirmationCode.set(state['confirmationCode']);
        this.transactionId.set(state['transactionId'] || '');
        this.qrCode.set(state['qrCode'] || '');

        if (state?.['reservation']) {
          this.reservation.set(state['reservation']);
          this.isLoading.set(false);
          this.errorMessage.set(null);
        }
      } else {
        // Fallback
        const currentReservation = this.reservationService.getCurrentReservation();
        if (currentReservation) {
          this.reservation.set(currentReservation);
        } else {
          this.errorMessage.set('No confirmation data found. Please complete the payment process.');
        }
        this.isLoading.set(false);
      }
    });
  }

  downloadTickets(): void {
    // TODO ...
    console.log('download tickets for:', this.confirmationCode());
  }

  printConfirmation(): void {
    window.print();
  }

  goToMyTickets(): void {
    this.router.navigate(['/my-tickets']);
  }
}

