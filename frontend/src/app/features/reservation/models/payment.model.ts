import { Order } from "./order.model";

export type ContactField = 'firstName' | 'lastName' | 'email';
export type PaymentField = 'cardNumber' | 'expiryDate' | 'cvc' | 'cardholderName';
export type PaymentMethodType = 'card' | 'paypal';


export interface ContactInfo {
    firstName: string;
    lastName: string;
    email: string;
}

export interface PaymentInfo {
    cardNumber: string;
    expiryDate: string;
    cvc: string;
    cardholderName: string;
}

export enum PaymentMethod {
    CreditCard = 'credit_card',
    PayPal = 'paypal'
}

export interface PaymentRequest {
    reservationId: string;
    amount: number;
    orderId: string;
    contactInfo: ContactInfo;
    paymentMethod: PaymentInfo;
}

export interface PaymentResponse {
    success: boolean;
    transactionId: string;
    confirmationCode: string;
    qrCode: string;
    order?: Order;
}
