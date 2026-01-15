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