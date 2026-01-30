import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventDetail, EventDetailTicketOption } from '../../models/event-detail.model';

@Component({
  selector: 'app-event-detail-ticket-card',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './event-detail-ticket-card.component.html',
  styleUrls: ['./event-detail-ticket-card.component.css'],
})
export class EventDetailTicketCardComponent {
  event = input.required<EventDetail>();
  ticketOptions = input.required<EventDetailTicketOption[]>();

  selectedTicketId = signal<string | null>(null);
  quantity = signal(1);

  reserveClick = output<{ ticketId: string; quantity: number }>();
  fromLabel = input('À partir de');
  availableLabel = input('Dispo');
  quantityLabel = input('Quantité');
  reserveLabel = input('Réserver maintenant');
  secureLabel = input('Paiement 100% sécurisé');

  get selectedId(): string | null {
    const id = this.selectedTicketId();
    if (id) return id;
    const opts = this.ticketOptions();
    const defaultOpt = opts.find((o) => o.isDefault) ?? opts[0];
    return defaultOpt?.id ?? null;
  }

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
