import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PaymentRequest, PaymentResponse, ContactInfo, PaymentInfo } from '../models/payment.model';
import { ApiService } from '../../../core/services/api.service';

@Injectable({ providedIn: 'root' })
export class PaymentService {
    private contactInfo = signal<ContactInfo | null>(null);
    private paymentInfo = signal<PaymentInfo | null>(null);

    contact = this.contactInfo.asReadonly();
    payment = this.paymentInfo.asReadonly();

    constructor(private apiService: ApiService) { }

    setContactInfo(info: ContactInfo): void {
        this.contactInfo.set(info);
    }

    setPaymentInfo(info: PaymentInfo): void {
        this.paymentInfo.set(info);
    }

    /**
     * Process payment through backend API
     */
    processPayment(request: PaymentRequest): Observable<PaymentResponse> {
        return this.apiService.post<PaymentResponse>('payments/process', {
            reservationId: request.reservationId,
            amount: request.amount,
            orderId: request.orderId,
            contactInfo: request.contactInfo,
            paymentMethod: request.paymentMethod
        }).pipe(
            tap(response => {
                if (response.success) {
                    // Clear payment data after successful payment
                    this.contactInfo.set(null);
                    this.paymentInfo.set(null);
                }
            })
        );
    }

    /**
     * Refund a payment
     */
    refundPayment(transactionId: string, reason?: string): Observable<any> {
        return this.apiService.post<any>('payments/refund', {
            transactionId,
            reason
        });
    }

    /**
     * Get payment status
     */
    getPaymentStatus(transactionId: string): Observable<any> {
        return this.apiService.get<any>(`payments/${transactionId}`);
    }

    clearPaymentData(): void {
        this.contactInfo.set(null);
        this.paymentInfo.set(null);
    }
}
