import { Injectable } from '@angular/core';

export type fieldRule = Record<string, { pattern?: RegExp }>;
export type fieldErrorMessage = Record<string, { required: string; pattern: string }>;

@Injectable({ providedIn: 'root' })
export class FormValidationService {
  private rules: fieldRule = {
    email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    cardNumber: { pattern: /^\d{16}$/ },
    expiryDate: { pattern: /^\d{2}\s?\/\s?\d{2}$/ },
    cvc: { pattern: /^\d{3}$/ }
  };

  private errorMessages: fieldErrorMessage = {
    firstName: { required: 'Le prénom est requis', pattern: '' },
    lastName: { required: 'Le nom est requis', pattern: '' },
    email: { required: 'L\'email est requis', pattern: 'Email invalide' },
    
    cardNumber: { required: 'Le numéro de carte est requis', pattern: 'Numéro de carte invalide (16 chiffres)' },
    expiryDate: { required: 'La date est requise', pattern: 'Format invalide (MM / AA)' },
    cvc: { required: 'Le CVC est requis', pattern: 'CVC invalide (3 chiffres)' },
    cardholderName: { required: 'Le nom est requis', pattern: '' }
  };

  validate(value: string, fieldType: string, trim: boolean = false): { isValid: boolean; error: string } {
    const val = trim ? value.trim() : value;
    const msgs = this.errorMessages[fieldType as keyof fieldErrorMessage];

    if (!msgs) return { isValid: true, error: '' };

    if (!val) {
      return { isValid: false, error: msgs.required };
    }

    const rule = this.rules[fieldType as keyof fieldRule];
    if (rule?.pattern && !rule.pattern.test(val)) {
      return { isValid: false, error: msgs.pattern };
    }

    return { isValid: true, error: '' };
  }
}
