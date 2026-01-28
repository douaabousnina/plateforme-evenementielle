import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PaymentRequest, Payment, PaymentInfo, PaymentRefundRequest } from '../models/payment.model';
import { ApiService } from '../../../core/services/api.service';
import { Router } from '@angular/router';
import { PaymentStatus } from '../enums/payment-method.enum';

@Injectable({ providedIn: 'root' })
export class PaymentService {
    private apiService = inject(ApiService);
    private route = inject(Router);

    loading = this.apiService.loading;
    error = this.apiService.error;

    processPayment(reservationId: string, paymentInfo: PaymentInfo): Observable<Payment> {
        this.loading.set(true);

        const request: PaymentRequest = {
            reservationId: reservationId,
            cardNumber: paymentInfo.cardNumber,
            cardHolder: paymentInfo.cardholderName,
            cvc: paymentInfo.cvc,
            expiryDate: paymentInfo.expiryDate
        };

        return this.apiService.post<Payment>('payments', request).pipe(
            tap(response => {
                if (response.status === PaymentStatus.SUCCESS) {
                    // TODO: toast
                    this.route.navigate(['/confirmation/', reservationId], {
                        state: { reservationId: reservationId, paymentId: response.id }
                    });
                }
            })
        );
    }

    refundPayment(paymentId: string, amount: number, reason: string): Observable<Payment> {
        const request: PaymentRefundRequest = {
            paymentId: paymentId,
            amount: amount,
            reason: reason ? reason : undefined
        };

        return this.apiService.post<Payment>('payments/refund', request);
    }

    getPaymentById(paymentId: string): Observable<Payment> {
        return this.apiService.get<Payment>(`payments/${paymentId}`);
    }

    getSuccessfulPaymentByReservationId(reservationId: string): Observable<Payment> {
        return this.apiService.get<Payment>(`payments/reservation/${reservationId}/successful`);
    }

    getPaymentsOfUser(): Observable<Payment[]> {
        return this.apiService.get<Payment[]>('payments/user');
    }
}
