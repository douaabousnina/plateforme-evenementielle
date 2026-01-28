import { Component, signal, output, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-validation-section',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './validation-section.component.html',
})
export class ValidationSectionComponent {
  amount = input.required<number>();
  loading = input<boolean>(false);

  submitPayment = output<void>();

  acceptTerms = signal<boolean>(false);
  sendReminder = signal<boolean>(true);

  onSubmit(): void {
    if (this.acceptTerms() && !this.loading()) {
      this.submitPayment.emit();
    }
  }
}