import { Component, signal, inject, effect, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { AuthService } from '../../../../core/services/auth.service';

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
  private route = inject(ActivatedRoute);
  private cartService = inject(CartService);
  private reservationService = inject(ReservationService);
  private paymentService = inject(PaymentService);
  private timerService = inject(TimerService);
  private authService = inject(AuthService);
  currentUser = this.authService.getCurrentUser();

  breadcrumbSteps = signal(createBreadcrumbSteps('payment'));
  reservationId = signal<string | null>(this.route.snapshot.paramMap.get('reservationId'));

  contactInfo = computed<ContactInfo>(() => {
    const user = this.currentUser;
    if (user) {
      return {
        firstName: user.name || user.firstName || 'John',
        lastName: user.lastName || 'Doe',
        email: user.email || 'john.doe@example.com'
      };
    }
    return {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com'
    };
  });

  paymentInfo = signal<PaymentInfo | null>(null);
  paymentValid = signal<boolean>(false);
  triggerValidation = signal<boolean>(false);

  cartSubtotal = this.cartService.subtotal;
  cartServiceFee = this.cartService.serviceFee;
  cartTotal = this.cartService.total;
  selectedSeats = this.cartService.reservedSeats;
  loading = computed(() => this.reservationService.loading() || this.paymentService.loading());
  errorMessage = computed(()=> this.reservationService.error() || this.paymentService.error())

  constructor() {
    effect(() => {
      if (!this.reservationId()) {
        // TODO: toast ou bien navigate to event
        // this.router.navigate(['/']);
        // return;
        alert("no res id");
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
    if (!this.paymentValid()) {
      return;
    }

    if (this.paymentService.loading()) {
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
    });
  }
}