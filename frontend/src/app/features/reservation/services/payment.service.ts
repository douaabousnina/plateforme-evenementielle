import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PaymentRequest, Payment, PaymentInfo, PaymentRefundRequest } from '../models/payment.model';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { PaymentStatus } from '../enums/payment-method.enum';

@Injectable({ providedIn: 'root' })
export class PaymentService {
    private apiService = inject(ApiService);
    private route = inject(Router);
    private authService = inject(AuthService);

    loading = this.apiService.loading;
    error = this.apiService.error;

    isAuthenticated = () => !!this.authService.getCurrentUser();
    getCurrentUserId = () => this.authService.getCurrentUser()?.id;

    // Client endpoints
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
                this.loading.set(false);
                if (response.status === PaymentStatus.SUCCESS) {
                    this.route.navigate(['/confirmation/', reservationId], {
                        state: { reservationId: reservationId, paymentId: response.id }
                    });
                }
            })
        );
    }

    getPaymentById(paymentId: string): Observable<Payment> {
        return this.apiService.get<Payment>(`payments/${paymentId}`);
    }

    getSuccessfulPaymentByReservationId(reservationId: string): Observable<Payment> {
        return this.apiService.get<Payment>(`payments/reservation/${reservationId}/successful`);
    }

    getMyPayments(): Observable<Payment[]> {
        return this.apiService.get<Payment[]>('payments');
    }

    // Organizer/Admin endpoints
    refundPayment(paymentId: string, amount: number, reason?: string): Observable<Payment> {
        const request: PaymentRefundRequest = {
            paymentId: paymentId,
            amount: amount,
            reason: reason
        };

        return this.apiService.post<Payment>('payments/refund', request);
    }
}
