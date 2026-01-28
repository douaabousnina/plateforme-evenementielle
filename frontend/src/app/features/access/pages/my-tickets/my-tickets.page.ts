import { Component, OnInit } from '@angular/core';
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
export class MyTicketsComponent implements OnInit {
  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  activeTab: FilterTab = 'upcoming';
  loading = true;
  selectedTicket: Ticket | null = null;
  showQRModal = false;

  ticketCounts = {
    upcoming: 0,
    past: 0,
    cancelled: 0
  };

  // Mock user ID - in real app, get from auth service
  userId = 'user-123';

  constructor(private readonly accessService: AccessService) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.loading = true;
    this.accessService.getUserTickets(this.userId).subscribe({
      next: (tickets) => {
        this.tickets = tickets.map(ticket => ({
          ...ticket,
          eventDate: new Date(ticket.eventDate),
          createdAt: new Date(ticket.createdAt),
          expiresAt: new Date(ticket.expiresAt),
          scannedAt: ticket.scannedAt ? new Date(ticket.scannedAt) : undefined
        }));
        this.filterTickets();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading tickets:', error);
        this.loading = false;
      }
    });
  }

  filterTickets(): void {
    const now = new Date();
    
    const upcoming = this.tickets.filter(
      ticket => ticket.eventDate >= now && ticket.status !== TicketStatus.CANCELLED
    );
    const past = this.tickets.filter(
      ticket => ticket.eventDate < now && ticket.status !== TicketStatus.CANCELLED
    );
    const cancelled = this.tickets.filter(
      ticket => ticket.status === TicketStatus.CANCELLED
    );

    this.ticketCounts = {
      upcoming: upcoming.length,
      past: past.length,
      cancelled: cancelled.length
    };

    switch (this.activeTab) {
      case 'upcoming':
        this.filteredTickets = upcoming;
        break;
      case 'past':
        this.filteredTickets = past;
        break;
      case 'cancelled':
        this.filteredTickets = cancelled;
        break;
    }
  }

  onTabChange(tab: FilterTab): void {
    this.activeTab = tab;
    this.filterTickets();
  }

  openQRModal(ticket: Ticket): void {
    this.selectedTicket = ticket;
    this.showQRModal = true;
  }

  closeQRModal(): void {
    this.showQRModal = false;
    this.selectedTicket = null;
  }

  onQrRefresh(updatedTicket: Ticket): void {
    const index = this.tickets.findIndex(t => t.id === updatedTicket.id);
    if (index !== -1) {
      this.tickets[index] = updatedTicket;
      this.selectedTicket = updatedTicket;
    }
  }
}
