
import { Component, signal, output } from '@angular/core';
import { PaymentMethodType } from '../../models/payment.model';

@Component({
  selector: 'app-payment-method',
  standalone: true,
  templateUrl: './payment-method.component.html',
})
export class PaymentMethodComponent {
  methodChange = output<PaymentMethodType>();

  selectedMethod = signal<PaymentMethodType>('card');

  selectMethod(method: PaymentMethodType): void {
    this.selectedMethod.set(method);
    this.methodChange.emit(method);
  }
}