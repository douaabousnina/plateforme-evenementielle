import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ticket } from '../../models/access.model';
import { AccessService } from '../../services/access.service';

@Component({
  selector: 'app-qr-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './qr-modal.component.html',
  styleUrls: ['./qr-modal.component.css']
})
export class QrModalComponent {
  @Input() ticket!: Ticket;
  @Input() show = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<Ticket>();

  refreshing = false;

  constructor(private readonly accessService: AccessService) {}

  onClose(): void {
    this.closeModal.emit();
  }

  onRefreshQR(): void {
    this.refreshing = true;
    this.accessService.refreshQRCode(this.ticket.id).subscribe({
      next: (response) => {
        this.ticket.qrCode = response.qrCode;
        this.ticket.qrToken = response.qrToken;
        this.refreshing = false;
        this.refresh.emit(this.ticket);
      },
      error: (error) => {
        console.error('Error refreshing QR code:', error);
        this.refreshing = false;
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
