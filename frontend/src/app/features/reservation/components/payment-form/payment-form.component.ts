import { Component, signal } from '@angular/core';
import { FormInputComponent } from '../../../../shared/components/form-input/form-input.component';
import { PaymentMethodComponent } from '../payment-method/payment-method.component';
import { PaymentField, PaymentInfo } from '../../models/payment.model';
import { BaseFormComponent } from '../../../../shared/components/form/base-form.component';
import { PaymentMethod } from '../../enums/payment-method.enum';

@Component({
    selector: 'app-payment-form',
    standalone: true,
    imports: [FormInputComponent, PaymentMethodComponent],
    templateUrl: './payment-form.component.html',
})
export class PaymentFormComponent extends BaseFormComponent<PaymentInfo> {
    selectedMethod = signal<PaymentMethod>(PaymentMethod.CARD);
    fieldNames: PaymentField[] = ['cardNumber', 'expiryDate', 'cvc', 'cardholderName'];

    protected readonly PaymentMethod = PaymentMethod;

    fields = {
        cardNumber: { value: signal(''), error: signal('') },
        expiryDate: { value: signal(''), error: signal('') },
        cvc: { value: signal(''), error: signal('') },
        cardholderName: { value: signal(''), error: signal('') },
    };

    onMethodChange(method: PaymentMethod): void {
        this.selectedMethod.set(method);
    }

    buildFormData(): PaymentInfo {
        return {
            cardNumber: this.fields.cardNumber.value(),
            expiryDate: this.fields.expiryDate.value(),
            cvc: this.fields.cvc.value(),
            cardholderName: this.fields.cardholderName.value()
        };
    }
}