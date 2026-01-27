import { Component, signal, inject, effect, computed } from '@angular/core';
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
import { ReservationStatus } from '../../enums/reservation.enum';

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

  // TODO: mock data => auth service
  contactInfo = signal<ContactInfo>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com'
  });

  paymentInfo = signal<PaymentInfo | null>(null);

  paymentValid = signal<boolean>(false);
  triggerValidation = signal<boolean>(false);

  cartSubtotal = this.cartService.subtotal;
  cartServiceFee = this.cartService.serviceFee;
  cartTotal = this.cartService.total;
  selectedSeats = this.cartService.reservedSeats;

  totalAmount = this.cartService.total;

  isProcessing = computed(
    () => this.paymentService.loading() || this.reservationService.loading()
  );

  constructor() {
    effect(() => {
      if (!this.reservationId()) {
        // TODO: toast ou bien navigate to event
        this.router.navigate(['/']);
        return;
      }
      this.timerService.start();
    });
  }

  onPaymentValidation(isValid: boolean): void {
    this.paymentValid.set(isValid);
  }

  onPaymentData(data: PaymentInfo): void {
    this.paymentInfo.set(data);
  }

  handlePayment(): void {
    this.triggerValidation.set(true);

    if (!this.paymentValid()) {
      return;
    }

    if (this.isProcessing()) {
      return;
    }

    const payment = this.paymentInfo();
    const resId = this.reservationId();

    if (!payment || !resId) {
      return;
    }

    this.paymentService.processPayment(resId, payment).subscribe({
      next: (response) => {
        this.timerService.stop();
      },
      error: (error) => {
        alert('fail');
        console.error('Error confirming payment:', error);
      }
    });
  }
}