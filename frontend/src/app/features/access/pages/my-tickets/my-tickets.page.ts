import { Component, signal, computed, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessService } from '../../services/access.service';
import { Ticket, TicketStatus } from '../../models/access.model';
import { TicketCardComponent } from '../../components/ticket-card/ticket-card.component';
import { TicketFiltersComponent, FilterTab } from '../../components/ticket-filters/ticket-filters.component';
import { QrModalComponent } from '../../components/qr-modal/qr-modal.component';
import { HeaderComponent } from '../../../../shared/components/header/header.component';

@Component({
  selector: 'app-my-tickets',
  standalone: true,
  imports: [CommonModule, TicketCardComponent, TicketFiltersComponent, QrModalComponent, HeaderComponent],
  templateUrl: './my-tickets.page.html',
  styleUrls: ['./my-tickets.page.css']
})
export class MyTicketsComponent {
  private readonly accessService = inject(AccessService);

  tickets = signal<Ticket[]>([]);
  activeTab = signal<FilterTab>('upcoming');
  loading = signal(true);
  selectedTicket = signal<Ticket | null>(null);
  showQRModal = signal(false);

  // Mock user ID - in real app, get from auth service
  readonly userId = 'user-123';

  // Computed values based on current state
  filteredTickets = computed(() => {
    const now = new Date();
    const tab = this.activeTab();
    const allTickets = this.tickets();

    switch (tab) {
      case 'upcoming':
        return allTickets.filter(
          ticket => ticket.eventDate >= now && ticket.status !== TicketStatus.CANCELLED
        );
      case 'past':
        return allTickets.filter(
          ticket => ticket.eventDate < now && ticket.status !== TicketStatus.CANCELLED
        );
      case 'cancelled':
        return allTickets.filter(
          ticket => ticket.status === TicketStatus.CANCELLED
        );
      default:
        return allTickets;
    }
  });

  ticketCounts = computed(() => {
    const now = new Date();
    const allTickets = this.tickets();

    return {
      upcoming: allTickets.filter(
        ticket => ticket.eventDate >= now && ticket.status !== TicketStatus.CANCELLED
      ).length,
      past: allTickets.filter(
        ticket => ticket.eventDate < now && ticket.status !== TicketStatus.CANCELLED
      ).length,
      cancelled: allTickets.filter(
        ticket => ticket.status === TicketStatus.CANCELLED
      ).length
    };
  });

  constructor() {
    effect(() => {
      this.loadTickets();
    }, { allowSignalWrites: true });
  }

  loadTickets(): void {
    this.loading.set(true);
    this.accessService.getUserTickets(this.userId).subscribe({
      next: (tickets) => {
        const mappedTickets = tickets.map(ticket => ({
          ...ticket,
          eventDate: new Date(ticket.eventDate),
          createdAt: new Date(ticket.createdAt),
          expiresAt: new Date(ticket.expiresAt),
          scannedAt: ticket.scannedAt ? new Date(ticket.scannedAt) : undefined
        }));
        this.tickets.set(mappedTickets);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading tickets:', error);
        this.loading.set(false);
      }
    });
  }

  onTabChange(tab: FilterTab): void {
    this.activeTab.set(tab);
  }

  openQRModal(ticket: Ticket): void {
    this.selectedTicket.set(ticket);
    this.showQRModal.set(true);
  }

  closeQRModal(): void {
    this.showQRModal.set(false);
    this.selectedTicket.set(null);
  }

  onQrRefresh(updatedTicket: Ticket): void {
    const allTickets = this.tickets();
    const index = allTickets.findIndex(t => t.id === updatedTicket.id);
    if (index !== -1) {
      const updated = [...allTickets];
      updated[index] = updatedTicket;
      this.tickets.set(updated);
      this.selectedTicket.set(updatedTicket);
    }
  }
}
