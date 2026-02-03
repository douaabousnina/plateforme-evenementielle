import { Component, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventDetail, EventDetailTicketOption } from '../../models/event-detail.model';

@Component({
  selector: 'app-event-detail-ticket-card',
  
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './event-detail-ticket-card.component.html',
  styleUrls: ['./event-detail-ticket-card.component.css'],
})
export class EventDetailTicketCardComponent {
  event = input.required<EventDetail>();
  ticketOptions = input.required<EventDetailTicketOption[]>();

  selectedTicketId = signal<string | null>(null);
  quantity = signal(1);

  reserveClick = output<{ ticketId: string; quantity: number }>();

  /** Expose for template (selected option id). */
  get selectedId(): string | null {
    const id = this.selectedTicketId();
    if (id) return id;
    const opts = this.ticketOptions();
    return opts.find((o) => o.isDefault)?.id ?? opts[0]?.id ?? null;
  }
  fromLabel = input('À partir de');
  availableLabel = input('Dispo');
  quantityLabel = input('Quantité');
  reserveLabel = input('Réserver maintenant');
  secureLabel = input('Paiement 100% sécurisé');

  selectTicket(id: string): void {
    this.selectedTicketId.set(id);
  }

  increment(): void {
    this.quantity.update((q) => Math.min(q + 1, 10));
  }

  decrement(): void {
    this.quantity.update((q) => Math.max(1, q - 1));
  }

  onReserve(): void {
    const id = this.selectedId;
    if (id) this.reserveClick.emit({ ticketId: id, quantity: this.quantity() });
  }

  getOption(id: string): EventDetailTicketOption | undefined {
    return this.ticketOptions().find((o) => o.id === id);
  }
}
