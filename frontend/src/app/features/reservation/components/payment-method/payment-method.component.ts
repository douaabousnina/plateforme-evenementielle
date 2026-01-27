import { Component, signal, output } from '@angular/core';
import { PaymentMethod } from '../../enums/payment-method.enum';

@Component({
  selector: 'app-payment-method',
  standalone: true,
  templateUrl: './payment-method.component.html',
})
export class PaymentMethodComponent {
  methodChange = output<PaymentMethod>();

  selectedMethod = signal<PaymentMethod>(PaymentMethod.CARD);

  selectMethod(method: PaymentMethod): void {
    this.selectedMethod.set(method);
    this.methodChange.emit(method);
  }

  // Expose enum to template
  protected readonly PaymentMethod = PaymentMethod;
}