import { Component, input } from '@angular/core';

@Component({
  selector: 'app-qr-code',
  
  templateUrl: './qr-code.component.html'
})
export class QRCodeComponent {
  confirmationCode = input.required<string>();
  orderId = input<string>('');
  qrCode = input<string>('');
}