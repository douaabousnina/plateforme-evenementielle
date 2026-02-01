import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../components/page-header.component';
import { SearchBarComponent } from '../components/search-bar.component';
import { EventsTableComponent } from '../components/events-table.component';
import type { Event } from '../../organizer/models/event.models';
import { AdminEventsService } from '../services/admin-events.service';

@Component({
  selector: 'app-events-list',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    SearchBarComponent,
    EventsTableComponent
  ],
  template: `
    <div class="flex flex-col flex-1">
      <app-page-header
        breadcrumb="Admin"
        subBreadcrumb="Gestion Événements"
        title="Gestion des Événements"
        [showAction]="false">
      </app-page-header>

      <app-search-bar
        placeholder="Rechercher par titre..."
        (search)="onSearch($event)">
      </app-search-bar>

      <app-events-table
        [events]="filteredEvents()"
        (delete)="onDeleteEvent($event)">
      </app-events-table>
    </div>
  `
})
export class EventsListComponent {
  private adminEventsService = inject(AdminEventsService);

  events = signal<Event[]>([]);
  searchQuery = signal('');
  isLoading = signal(false);
  errorMessage = signal('');

  totalEvents = computed(() => this.events().length);

  filteredEvents = computed(() => {
    let filtered = [...this.events()];

    if (this.searchQuery()) {
      const query = this.searchQuery().toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(query) ||
        event.location?.toLowerCase().includes(query) ||
        event.description?.toLowerCase().includes(query)
      );
    }

    return filtered;
  });

  constructor() {
    this.loadEvents();
  }

  loadEvents(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    
    this.adminEventsService.getAllEvents().subscribe({
      next: (events: Event[]) => {
        this.events.set(events);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.errorMessage.set('Erreur lors du chargement des événements');
        this.isLoading.set(false);
      }
    });
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
  }

  onDeleteEvent(event: Event): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'événement "${event.title}" ?`)) {
      this.adminEventsService.deleteEvent(event.id).subscribe({
        next: () => {
          console.log('Event deleted successfully');
          // Reload events after deletion
          this.loadEvents();
        },
        error: (error) => {
          console.error('Error deleting event:', error);
          alert('Erreur lors de la suppression de l\'événement');
        }
      });
    }
  }
}
