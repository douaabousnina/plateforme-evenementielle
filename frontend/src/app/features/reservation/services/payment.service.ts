import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { PaymentRequest, Payment, ContactInfo, PaymentInfo, PaymentRefundRequest } from '../models/payment.model';
import { ApiService } from '../../../core/services/api.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class PaymentService {
    private apiService = inject(ApiService);
    private route = inject(Router);

    // TODO: contact info normalement auth service
    contactInfo = signal<ContactInfo | null>(null);
    paymentInfo = signal<PaymentInfo | null>(null);

    loading = this.apiService.loading;
    error = this.apiService.error;

    setContactInfo(info: ContactInfo): void {
        this.contactInfo.set(info);
    }

    setPaymentInfo(info: PaymentInfo): void {
        this.paymentInfo.set(info);
    }

    processPayment(reservationId: string, contactInfo: ContactInfo, paymentInfo: PaymentInfo): Observable<Payment> {
        this.loading.set(true);

        this.setContactInfo(contactInfo);
        this.setPaymentInfo(paymentInfo);

        const request: PaymentRequest = {
            reservationId: reservationId,
            cardNumber: paymentInfo.cardNumber,
            cardHolder: paymentInfo.cardholderName,
            cvc: paymentInfo.cvc,
            expiryDate: paymentInfo.expiryDate
        };

        return this.apiService.post<Payment>('payments', request).pipe(
            tap(response => {
                if (response.status === 'success') {
                    // TODO: toast
                    this.route.navigate(['/reservation/confirmation'], {
                        state: { reservationId }
                    });
                }
            })
        );
    }

    refundPayment(paymentRefundRequest: PaymentRefundRequest): Observable<Payment> {
        return this.apiService.post<Payment>('payments/refund', {
            paymentId: paymentRefundRequest.paymentId,
            reason: paymentRefundRequest.reason
        });
    }

    getPaymentById(paymentId: string): Observable<Payment> {
        return this.apiService.get<Payment>(`payments/${paymentId}`);
    }

    getPaymentsOfUser(): Observable<Payment[]> {
        return this.apiService.get<Payment[]>('payments/user');
    }

    clearPaymentForm(): void {
        this.contactInfo.set(null);
        this.paymentInfo.set(null);
    }
}
