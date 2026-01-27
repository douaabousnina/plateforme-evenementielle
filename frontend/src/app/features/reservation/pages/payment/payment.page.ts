import { Component, signal, inject, effect } from '@angular/core';
import { Router } from '@angular/router';
import { TimerService } from '../../../../core/services/timer.service';
import { ValidationSectionComponent } from '../../components/validation-section/validation-section.component';
import { PaymentFormComponent } from '../../components/payment-form/payment-form.component';
import { ContactFormComponent } from '../../components/contact-form/contact-form.component';
import { BreadcrumbComponent } from '../../../../shared/components/breadcrumb/breadcrumb.component';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { SeatCartSummaryComponent } from '../../components/seat-cart-summary/seat-cart-summary.component';
import { CartService } from '../../services/cart.service';
import { ReservationService } from '../../services/reservation.service';
import { PaymentService } from '../../services/payment.service';
import { createBreadcrumbSteps } from '../../../../core/config/breadcrumb.config';
import { ContactInfo, PaymentInfo } from '../../models/payment.model';
import { TimerComponent } from '../../components/timer/timer.component';

@Component({
  selector: 'app-payment-page',
  standalone: true,
  imports: [
    HeaderComponent,
    BreadcrumbComponent,
    ContactFormComponent,
    PaymentFormComponent,
    SeatCartSummaryComponent,
    ValidationSectionComponent,
    TimerComponent
  ],
  templateUrl: './payment.page.html',
})
export class PaymentPage {
  private router = inject(Router);
  private cartService = inject(CartService);
  private reservationService = inject(ReservationService);
  private paymentService = inject(PaymentService);
  private timerService = inject(TimerService);

  breadcrumbSteps = signal(createBreadcrumbSteps('payment'));

  reservationId = signal<string | null>(history.state?.reservationId || null);

  contactInfo = signal<ContactInfo | null>(null);
  paymentInfo = signal<PaymentInfo | null>(null);

  contactValid = signal<boolean>(false);
  paymentValid = signal<boolean>(false);
  isProcessing = signal<boolean>(false);
  triggerValidation = signal<boolean>(false);

  cartSubtotal = this.cartService.subtotal;
  cartServiceFee = this.cartService.serviceFee;
  cartTotal = this.cartService.total;
  selectedSeats = this.cartService.reservedSeats;

  totalAmount = this.cartService.total;

  isLoading = this.reservationService.loading;

  constructor() {
    effect(() => {
      if (!this.reservationId()) {
        this.router.navigate(['/reservation']);
        return;
      }
      this.timerService.start();
    });
  }

  onContactValidation(isValid: boolean): void {
    this.contactValid.set(isValid);
  }

  onContactData(data: ContactInfo): void {
    this.contactInfo.set(data);
  }

  onPaymentValidation(isValid: boolean): void {
    this.paymentValid.set(isValid);
  }

  onPaymentData(data: PaymentInfo): void {
    this.paymentInfo.set(data);
  }

  handlePayment(): void {
    // Trigger validation on all forms
    this.triggerValidation.set(true);

    if (!this.contactValid() || !this.paymentValid()) {
      return;
    }

    if (this.isProcessing()) {
      return;
    }

    const contact = this.contactInfo();
    const payment = this.paymentInfo();
    const resId = this.reservationId();

    if (!contact || !payment || !resId) {
      return;
    }

    this.isProcessing.set(true);
    this.paymentService.processPayment(resId, contact, payment).subscribe({
      next: (response) => {
        this.isProcessing.set(false);
        this.timerService.stop();
        this.router.navigate(['/confirmation'], {
          state: {
            confirmationCode: response.id,
            transactionId: response.id,
            qrCode: response.id,
            reservation: {
              id: response.reservationId,
              totalPrice: response.amount,
              status: 'CONFIRMED'
            }
          }
        });
      },
      error: (error) => {
        this.isProcessing.set(false);
        console.error('Error confirming payment:', error);
      }
    });
  }
}