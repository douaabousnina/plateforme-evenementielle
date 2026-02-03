import { Component, input, output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ticket } from '../../models/access.model';
import { AccessService } from '../../services/access.service';

@Component({
  selector: 'app-qr-modal',
  
  imports: [CommonModule],
  templateUrl: './qr-modal.component.html',
  styleUrls: ['./qr-modal.component.css']
})
export class QrModalComponent {
  private readonly accessService = inject(AccessService);

  ticket = input.required<Ticket>();
  show = input<boolean>(false);
  closeModal = output<void>();
  refresh = output<Ticket>();

  refreshing = signal(false);

  onClose(): void {
    this.closeModal.emit();
  }

  onRefreshQR(): void {
    this.refreshing.set(true);
    const currentTicket = this.ticket();
    this.accessService.refreshQRCode(currentTicket.id).subscribe({
      next: (response) => {
        const updatedTicket = {
          ...currentTicket,
          qrCode: response.qrCode,
          qrToken: response.qrToken
        };
        this.refreshing.set(false);
        this.refresh.emit(updatedTicket);
      },
      error: (error) => {
        console.error('Error refreshing QR code:', error);
        this.refreshing.set(false);
      }
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
