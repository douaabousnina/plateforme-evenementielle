import { PaymentMethod } from "../enums/payment-method.enum";

export type ContactField = 'firstName' | 'lastName' | 'email';
export type PaymentField = 'cardNumber' | 'expiryDate' | 'cvc' | 'cardholderName';

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

export interface Payment {
    id: string;
    userId: string;
    reservationId: string;
    amount: number;
    method: PaymentMethod;
    cardLast4: string;
    status: string;

    createdAt?: Date;
    updatedAt?: Date;
}


export interface PaymentRequest {
    reservationId: string;
    cardNumber: string;
    cardHolder: string;
    cvc: string;
    expiryDate: string;
}

export interface PaymentRefundRequest {
    paymentId: string;
    amount: number;
    reason?:string;
}

