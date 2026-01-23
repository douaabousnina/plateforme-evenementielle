import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MyTicketCardComponent } from '../components/my-ticket-card/my-ticket-card.component';
import { ClientHeaderComponent } from '../components/client-header/client-header.component';

export interface Ticket {
  id: string;
  orderId: string;
  eventName: string;
  eventType: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  imageUrl: string;
  seatInfo: {
    section?: string;
    row?: string;
    seat?: string;
    gate?: string;
    zone?: string;
    access?: string;
  };
  status: 'upcoming' | 'past' | 'cancelled';
}

@Component({
  selector: 'app-my-tickets-page',
  standalone: true,
  imports: [CommonModule, RouterLink, MyTicketCardComponent, ClientHeaderComponent],
  template: `
    <div class="bg-background-light dark:bg-background-dark font-display min-h-screen flex flex-col text-[#0d101c] dark:text-white transition-colors duration-200">
      
      <app-client-header />
      
      <main class="flex-grow w-full max-w-[1024px] mx-auto px-4 sm:px-6 py-8">
        
        <!-- Breadcrumbs -->
        <nav aria-label="Breadcrumb" class="flex mb-6">
          <ol class="inline-flex items-center space-x-1 md:space-x-3">
            <li class="inline-flex items-center">
              <a routerLink="/" class="inline-flex items-center text-sm font-medium text-[#4b589b] dark:text-gray-400 hover:text-primary dark:hover:text-white">
                <span class="material-symbols-outlined text-lg mr-2">home</span>
                Accueil
              </a>
            </li>
            <li>
              <div class="flex items-center">
                <span class="material-symbols-outlined text-gray-400 text-sm mx-1">chevron_right</span>
                <span class="ml-1 text-sm font-medium text-[#0d101c] dark:text-white md:ml-2">Mes Billets</span>
              </div>
            </li>
          </ol>
        </nav>
        
        <!-- Page Heading -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 class="text-3xl md:text-4xl font-black text-[#0d101c] dark:text-white tracking-tight mb-2">
              Mes Billets
            </h1>
            <p class="text-[#4b589b] dark:text-gray-400 text-base">
              Gérez vos commandes, accédez à vos billets et téléchargez vos factures.
            </p>
          </div>
          <button class="hidden md:flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1e2130] border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
            <span class="material-symbols-outlined text-lg">history</span>
            Historique des commandes
          </button>
        </div>
        
        <!-- Tabs -->
        <div class="mb-8 border-b border-[#cfd3e8] dark:border-gray-700">
          <ul class="flex flex-wrap -mb-px text-sm font-medium text-center" role="tablist">
            <li class="mr-2" role="presentation">
              <button 
                (click)="activeTab.set('upcoming')"
                [class.border-primary]="activeTab() === 'upcoming'"
                [class.text-primary]="activeTab() === 'upcoming'"
                [class.dark:text-blue-400]="activeTab() === 'upcoming'"
                [class.border-transparent]="activeTab() !== 'upcoming'"
                [class.text-[#4b589b]]="activeTab() !== 'upcoming'"
                [class.dark:text-gray-400]="activeTab() !== 'upcoming'"
                class="inline-flex items-center gap-2 p-4 border-b-[3px] rounded-t-lg group transition-all hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                type="button"
              >
                <span class="material-symbols-outlined text-lg">event_available</span>
                À venir
                <span class="bg-primary/10 text-primary dark:text-blue-400 dark:bg-blue-900/30 py-0.5 px-2 rounded-full text-xs ml-1">
                  {{ upcomingTickets().length }}
                </span>
              </button>
            </li>
            <li class="mr-2" role="presentation">
              <button 
                (click)="activeTab.set('past')"
                [class.border-primary]="activeTab() === 'past'"
                [class.text-primary]="activeTab() === 'past'"
                [class.dark:text-blue-400]="activeTab() === 'past'"
                [class.border-transparent]="activeTab() !== 'past'"
                [class.text-[#4b589b]]="activeTab() !== 'past'"
                [class.dark:text-gray-400]="activeTab() !== 'past'"
                class="inline-flex items-center gap-2 p-4 border-b-[3px] rounded-t-lg group transition-all hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                type="button"
              >
                <span class="material-symbols-outlined text-lg">history_toggle_off</span>
                Passés
              </button>
            </li>
            <li class="mr-2" role="presentation">
              <button 
                (click)="activeTab.set('cancelled')"
                [class.border-primary]="activeTab() === 'cancelled'"
                [class.text-primary]="activeTab() === 'cancelled'"
                [class.dark:text-blue-400]="activeTab() === 'cancelled'"
                [class.border-transparent]="activeTab() !== 'cancelled'"
                [class.text-[#4b589b]]="activeTab() !== 'cancelled'"
                [class.dark:text-gray-400]="activeTab() !== 'cancelled'"
                class="inline-flex items-center gap-2 p-4 border-b-[3px] rounded-t-lg group transition-all hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                type="button"
              >
                <span class="material-symbols-outlined text-lg">cancel_presentation</span>
                Annulés
              </button>
            </li>
          </ul>
        </div>
        
        <!-- Ticket Cards Container -->
        <div class="space-y-6">
          @if (filteredTickets().length > 0) {
            @for (ticket of filteredTickets(); track ticket.id) {
              <app-my-ticket-card 
                [ticket]="ticket"
                (viewTicket)="handleViewTicket($event)"
                (downloadTicket)="handleDownloadTicket($event)"
                (contactOrganizer)="handleContactOrganizer($event)"
                (cancelTicket)="handleCancelTicket($event)"
              />
            }
          } @else {
            <!-- Empty State -->
            <div class="flex flex-col items-center justify-center py-20 text-center">
              <div class="bg-gray-100 dark:bg-gray-800 rounded-full p-6 mb-4">
                <span class="material-symbols-outlined text-4xl text-gray-400">confirmation_number</span>
              </div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Aucun billet trouvé
              </h3>
              <p class="text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
                Vous n'avez pas encore de billets pour cette catégorie. Découvrez les événements à venir !
              </p>
              <button routerLink="/reservation" class="text-primary font-bold hover:underline">
                Parcourir les événements
              </button>
            </div>
          }
        </div>
      </main>
      
      <!-- Simple Footer -->
      <footer class="border-t border-[#e7e9f3] dark:border-gray-800 bg-white dark:bg-[#1a1d2d] py-8 mt-12">
        <div class="max-w-[1024px] mx-auto px-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© 2024 EventTicket. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  `
})
export class MyTicketsPage {
  activeTab = signal<'upcoming' | 'past' | 'cancelled'>('upcoming');

  // Mock tickets data
  tickets = signal<Ticket[]>([
    {
      id: '1',
      orderId: '8X290L',
      eventName: 'Coldplay - Music of the Spheres',
      eventType: 'Concert',
      eventDate: '2024-10-12',
      eventTime: '20:00',
      venue: 'Stade de France, Paris',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAU_yGHjxmnjQF7TFeGWsMC-FJJGUpe-nBy1L7X_cMzZKlyq4mGLP8e92CF62YxBTcRogElA1_I4wUvcWGJSm_ooOoLKv6qKZq4gaUabhEN0bxT40wyt-xK3YIXDiwYkFOfwI-EYNXawONbHOSjmNkVDiXYrJj4gD288g54jDxBWdpWpOSYv748Puz3BHXMiA9JqS9lVNGdH9xMXncHkP0bm3QVto-c-e32TURmVCgs62fVdqk8IQs5gnMkSnJnEsseOuX1aqZDlnM',
      seatInfo: { gate: 'G', row: '12', seat: '45' },
      status: 'upcoming'
    },
    {
      id: '2',
      orderId: 'DEV2024',
      eventName: 'Web Summit Paris 2024',
      eventType: 'Conférence',
      eventDate: '2024-10-15',
      eventTime: '09:00',
      venue: 'Paris Expo Porte de Versailles',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVklkMlEDcpMSmgQ6TT8Qp7ewYCuo-93saF97OFyaZkpUOShnuMU5CMPXFXsUaRpcoA1kqohOZKKIkqR9KnRO3wdIK96zqNEGE2fmLXj0YY5aSvXsHd9wNxtGrnuxULqvu9cdn99isYgapD4Wz6sL0-jc4GfCiouG90FvxUaMVR_1NTX7kRhZ0bmD_RiKlZ0nIx-SriWWdHsZlvcxN56HxBhp2by8bUIi-DNGOyCn0bUk08BE-e7SKAMwKY0O3OBvIaZDgP_6oTGA',
      seatInfo: { access: 'VIP', zone: 'A', seat: 'Libre' },
      status: 'upcoming'
    },
    {
      id: '3',
      orderId: 'LION99',
      eventName: 'Le Roi Lion - Mogador',
      eventType: 'Théâtre',
      eventDate: '2024-10-20',
      eventTime: '15:30',
      venue: 'Théâtre Mogador, Paris',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTigT4D15fDsJBmQqSbpxj6VK5slfMlf_ZHQKLuQBUM3Uq9_1peedbcRlmrAXWBkB9C3kj_UkJE0bfOUFIKOuC6BmdE1w_l3GGiwdOS1qWN0neq1Hi-vWT69jbSCCLShHB0byqVuhnD3UpZ4UxADmziv7Ov__UCwFDsPlB-nISLrNrU9Kcq4qFiswBzMNVP5IsF77zvYKiTiJtjowLQTJ_kLmTvufdIoBgXYqbB0G83Rr1swHDbBvDtPFdQ6y3ccApj_wy23v7NLc',
      seatInfo: { section: 'Balcon 2', row: 'C', seat: '14' },
      status: 'upcoming'
    }
  ]);

  upcomingTickets = computed(() =>
    this.tickets().filter(t => t.status === 'upcoming')
  );

  pastTickets = computed(() =>
    this.tickets().filter(t => t.status === 'past')
  );

  cancelledTickets = computed(() =>
    this.tickets().filter(t => t.status === 'cancelled')
  );

  filteredTickets = computed(() => {
    const tab = this.activeTab();
    if (tab === 'upcoming') return this.upcomingTickets();
    if (tab === 'past') return this.pastTickets();
    return this.cancelledTickets();
  });

  handleViewTicket(ticketId: string): void {
    console.log('View ticket:', ticketId);
    // Navigate to ticket detail or show modal
  }

  handleDownloadTicket(ticketId: string): void {
    console.log('Download ticket:', ticketId);
    // Generate PDF download
  }

  handleContactOrganizer(ticketId: string): void {
    console.log('Contact organizer:', ticketId);
    // Open contact modal or email
  }

  handleCancelTicket(ticketId: string): void {
    console.log('Cancel ticket:', ticketId);
    // Show confirmation modal
    if (confirm('Êtes-vous sûr de vouloir annuler ce billet ?')) {
      this.tickets.update(tickets =>
        tickets.map(t => t.id === ticketId ? { ...t, status: 'cancelled' as const } : t)
      );
    }
  }
}