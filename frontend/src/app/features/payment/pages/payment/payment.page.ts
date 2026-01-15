import { Component, signal, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BreadcrumbStep } from '../../../../core/models/breadcrumb.model';
import { CartService } from '../../../../core/services/cart.service';
import { TimerService } from '../../../../core/services/timer.service';
import { ValidationSectionComponent } from '../../components/validation-section/validation-section.component';
import { OrderSummaryComponent } from '../../components/order-summary/order-summary.component';
import { PaymentFormComponent } from '../../components/payment-form/payment-form.component';
import { ContactFormComponent } from '../../components/contact-form/contact-form.component';
import { BreadcrumbComponent } from '../../../../shared/components/breadcrumb/breadcrumb.component';
import { HeaderComponent } from '../../../../shared/components/header/header.component';

@Component({
  selector: 'app-payment-page',
  standalone: true,
  imports: [
    HeaderComponent,
    BreadcrumbComponent,
    ContactFormComponent,
    PaymentFormComponent,
    OrderSummaryComponent,
    ValidationSectionComponent,
  ],
  templateUrl: './payment.page.html',
})
export class PaymentPage {
  breadcrumbSteps = signal<BreadcrumbStep[]>([
    { label: 'Sélection', route: '/reservation', completed: true, active: false, stepNumber: 1 },
    { label: 'Paiement', route: '/payment', completed: false, active: true, stepNumber: 2 },
    { label: 'Confirmation', route: '/confirmation', completed: false, active: false, stepNumber: 3 }
  ]);

  totalAmount = signal<number>(0);
  isProcessing = signal<boolean>(false);

  contactInfo = signal<any>(null);
  paymentInfo = signal<any>(null);

  triggerValidation = signal<boolean>(false);
  contactValid = signal<boolean>(false);
  paymentValid = signal<boolean>(false);

  private cartService = inject(CartService);
  private timerService = inject(TimerService);
  private router = inject(Router);

  constructor() {
    this.timerService.start();

    const order = this.cartService.order();
    if (order) {
      this.totalAmount.set(order.total);
    }

    effect(() => {
      const contactIsValid = this.contactValid();
      const paymentIsValid = this.paymentValid();
      const processing = this.isProcessing();

      if (contactIsValid && paymentIsValid && !processing) {
        this.isProcessing.set(true);

        // TODO: ...
        setTimeout(() => {
          this.timerService.stop();
          this.router.navigate(['/confirmation']);
        }, 2000);
      }
    });
  }

  onContactValidation(isValid: boolean): void {
    this.contactValid.set(isValid);
  }

  onPaymentValidation(isValid: boolean): void {
    this.paymentValid.set(isValid);
  }

  async handlePayment() {
    // Trigger validation in both forms
    this.triggerValidation.set(!this.triggerValidation());
  }
}