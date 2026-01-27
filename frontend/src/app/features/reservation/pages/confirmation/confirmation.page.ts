import { Component, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { QRCodeComponent } from '../../components/qr-code/qr-code.component';
import { ReservationService } from '../../services/reservation.service';
import { PaymentService } from '../../services/payment.service';
import { OrderDetailsComponent } from '../../components/order-details/order-details.component';
import { BreadcrumbComponent } from '../../../../shared/components/breadcrumb/breadcrumb.component';
import { createBreadcrumbSteps } from '../../../../core/config/breadcrumb.config';

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

  breadcrumbSteps = signal(createBreadcrumbSteps('confirmation'));

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
      createdAt: res.createdAt || new Date()
    };
  });

  constructor() {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state || history.state;

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
      const currentReservation = this.reservationService.currentReservation();
      if (currentReservation) {
        this.reservation.set(currentReservation);
      } else {
        this.errorMessage.set('No confirmation data found. Please complete the payment process.');
      }
      this.isLoading.set(false);
    }
  }

  downloadTickets(): void {
    console.log('download tickets for:', this.confirmationCode());
  }

  printConfirmation(): void {
    window.print();
  }

  goToMyTickets(): void {
    this.router.navigate(['/my-tickets']);
  }
}
