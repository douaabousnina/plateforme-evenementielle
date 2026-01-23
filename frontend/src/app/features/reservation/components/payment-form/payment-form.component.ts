import { Component, signal } from '@angular/core';
import { FormInputComponent } from '../../../../shared/components/form-input/form-input.component';
import { PaymentMethodComponent } from '../payment-method/payment-method.component';
import { PaymentField, PaymentInfo, PaymentMethodType } from '../../models/payment.model';
import { BaseFormComponent } from '../../../../shared/components/form/base-form.component';

@Component({
    selector: 'app-payment-form',
    standalone: true,
    imports: [FormInputComponent, PaymentMethodComponent],
    templateUrl: './payment-form.component.html',
})
export class PaymentFormComponent extends BaseFormComponent<PaymentInfo> {
    selectedMethod = signal<PaymentMethodType>('card');
    fieldNames: PaymentField[] = ['cardNumber', 'expiryDate', 'cvc', 'cardholderName'];

    fields = {
        cardNumber: { value: signal(''), error: signal('') },
        expiryDate: { value: signal(''), error: signal('') },
        cvc: { value: signal(''), error: signal('') },
        cardholderName: { value: signal(''), error: signal('') },
    };

    // public getters for template
    cardNumberValue() { return this.fields.cardNumber.value(); }
    cardNumberError() { return this.fields.cardNumber.error(); }
    expiryDateValue() { return this.fields.expiryDate.value(); }
    expiryDateError() { return this.fields.expiryDate.error(); }
    cvcValue() { return this.fields.cvc.value(); }
    cvcError() { return this.fields.cvc.error(); }
    cardholderNameValue() { return this.fields.cardholderName.value(); }
    cardholderNameError() { return this.fields.cardholderName.error(); }

    onMethodChange(method: PaymentMethodType): void {
        this.selectedMethod.set(method);
        console.log('Payment method changed:', method);
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