import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormValidationService {
  private rules: Record<string, { pattern?: RegExp }> = {
    email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    cardNumber: { pattern: /^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/ },
    expiryDate: { pattern: /^\d{2}\s?\/\s?\d{2}$/ },
    cvc: { pattern: /^\d{3}$/ }
  };

  private messages: Record<string, { required: string; pattern: string }> = {
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
    const msgs = this.messages[fieldType as keyof typeof this.messages];

    if (!msgs) return { isValid: true, error: '' };

    if (!val) {
      return { isValid: false, error: msgs.required };
    }

    const rule = this.rules[fieldType as keyof typeof this.rules];
    if (rule?.pattern && !rule.pattern.test(val)) {
      return { isValid: false, error: msgs.pattern };
    }

    return { isValid: true, error: '' };
  }
}
