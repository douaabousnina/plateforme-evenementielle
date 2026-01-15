import { Injectable, signal } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { PaymentRequest, PaymentResponse, ContactInfo, PaymentInfo } from '../models/payment.model';

@Injectable({ providedIn: 'root' })
export class PaymentService {
    private contactInfo = signal<ContactInfo | null>(null);
    private paymentInfo = signal<PaymentInfo | null>(null);

    contact = this.contactInfo.asReadonly();
    payment = this.paymentInfo.asReadonly();

    setContactInfo(info: ContactInfo): void {
        this.contactInfo.set(info);
    }

    setPaymentInfo(info: PaymentInfo): void {
        this.paymentInfo.set(info);
    }

    processPayment(request: PaymentRequest): Observable<PaymentResponse> {
        // Simulation d'appel API
        return of({
            success: true,
            transactionId: 'TXN-' + Date.now(),
            confirmationCode: this.generateConfirmationCode(),
            qrCode: this.generateQRCode(request.orderId),
            order: {} as any // Sera rempli avec l'order du cart
        }).pipe(delay(2000));
    }

    private generateConfirmationCode(): string {
        return 'CONF-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    }

    private generateQRCode(orderId: string): string {
        // TODO: utiliser une vraie lib de QR
        return `data:image/svg+xml;base64,${btoa('<svg>QR Code placeholder</svg>')}`;
    }

    clearPaymentData(): void {
        this.contactInfo.set(null);
        this.paymentInfo.set(null);
    }
}
