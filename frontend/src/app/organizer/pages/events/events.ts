import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SideBar } from '../../components/side-bar/side-bar';
import { EventsTable } from '../../components/events-table/events-table';
import { Event } from '../../models/event.models';
import { EventService } from '../../../features/reservation/services/event.service';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, SideBar,EventsTable, RouterLink],
  templateUrl: './events.html',
  styleUrls: ['./events.css']
})
export class Events implements OnInit {
  eventService = inject(EventService);

  ngOnInit() {
    this.eventService.loadMyEvents().subscribe();
  }

  getTotalTicketsSold(events: Event[]): number {
    return events.reduce((total, event) => {
      return total + (event.totalSeats - event.availableSeats);
    }, 0);
  }

  getTotalRevenue(events: Event[]): string {
    // Exemple avec prix moyen de 30€ par billet
    const ticketsSold = this.getTotalTicketsSold(events);
    const revenue = ticketsSold * 30;
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(revenue);
  }
}