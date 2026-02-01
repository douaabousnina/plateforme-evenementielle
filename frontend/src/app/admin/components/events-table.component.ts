import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Event, EventStatus } from '../../organizer/models/event.models';

@Component({
  selector: 'app-events-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="px-8 py-4 flex-1">
      <div class="bg-white dark:bg-surface-dark rounded-2xl shadow-xl shadow-black/5 border border-slate-200 dark:border-white/5 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full border-collapse text-left">
            <thead>
              <tr class="bg-slate-50/50 dark:bg-white/5 border-b border-slate-200 dark:border-white/5">
                <th class="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Affiche</th>
                <th class="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Titre & Organisateur</th>
                <th class="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Date de l'événement</th>
                <th class="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">Ventes</th>
                <th class="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Statut</th>
                <th class="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-white/5">
              @for (event of events; track event.id) {
              <tr 
                class="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group"
                [class.opacity-60]="event.status === 'CANCELLED'">
                <!-- Cover Image -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div 
                    class="w-16 h-10 rounded-lg border border-slate-100 dark:border-white/10 bg-cover bg-center shadow-sm bg-slate-200 dark:bg-slate-700"
                    [class.opacity-50]="event.status === 'CANCELLED'"
                    [class.grayscale]="event.status === 'CANCELLED'"
                    [style.background-image]="event.image ? 'url(' + event.image + ')' : 'none'">
                    @if (!event.image) {
                    <div class="flex items-center justify-center h-full">
                      <span class="material-symbols-outlined text-slate-400 text-sm">image</span>
                    </div>
                    }
                  </div>
                </td>

                <!-- Title & Organizer -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex flex-col">
                    <span 
                      class="text-sm font-bold text-slate-900 dark:text-white"
                      [class.line-through]="event.status === 'CANCELLED'"
                      [class.text-slate-400]="event.status === 'CANCELLED'">
                      {{ event.title }}
                    </span>
                    <span class="text-xs font-medium text-slate-400">
                      {{ event.location || 'N/A' }}
                    </span>
                  </div>
                </td>

                <!-- Event Date -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <span 
                      class="material-symbols-outlined text-sm"
                      [class.text-accent-violet]="event.status !== 'CANCELLED'"
                      [class.text-slate-500]="event.status === 'CANCELLED'">
                      calendar_today
                    </span>
                    <span 
                      class="text-sm font-medium"
                      [class.text-slate-500]="event.status === 'CANCELLED'"
                      [class.dark:text-slate-400]="event.status !== 'CANCELLED'">
                      {{ event.status === 'CANCELLED' ? 'Annulé le ' : '' }}{{ event.startDate | date: 'dd MMM yyyy' }}
                    </span>
                  </div>
                </td>

                <!-- Sales Stats -->
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <div class="flex flex-col">
                    <span 
                      class="text-sm font-bold"
                      [class.text-slate-900]="event.status !== 'CANCELLED'"
                      [class.dark:text-white]="event.status !== 'CANCELLED'"
                      [class.text-slate-500]="event.status === 'CANCELLED'">
                      {{ (event.totalSeats || 0) - (event.availableSeats || 0) }}
                    </span>
                    <span 
                      class="text-[10px] font-bold uppercase"
                      [class.text-slate-400]="event.status !== 'CANCELLED'"
                      [class.text-slate-500]="event.status === 'CANCELLED'">
                      {{ event.status === 'CANCELLED' ? 'Remboursés' : 'Billets vendus' }}
                    </span>
                  </div>
                </td>

                <!-- Status Badge -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <span 
                      class="size-2 rounded-full shadow-sm"
                      [ngClass]="getStatusDotClass(event.status)"></span>
                    <span 
                      class="text-sm font-bold"
                      [ngClass]="getStatusTextClass(event.status)">
                      {{ getStatusLabel(event.status) }}
                    </span>
                  </div>
                </td>

                <!-- Actions -->
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <div class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      (click)="onDelete(event)"
                      class="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 transition-all border border-red-500/20 hover:text-white" 
                      title="Supprimer">
                      <span class="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
              }

              <!-- Empty State -->
              @if (events.length === 0) {
              <tr>
                <td colspan="6" class="px-6 py-12 text-center">
                  <div class="flex flex-col items-center gap-4">
                    <span class="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700">event_busy</span>
                    <div class="flex flex-col gap-1">
                      <p class="text-slate-900 dark:text-white font-bold text-lg">Aucun événement trouvé</p>
                      <p class="text-slate-500 dark:text-slate-400 text-sm">Essayez d'ajuster vos filtres de recherche</p>
                    </div>
                  </div>
                </td>
              </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: contents;
    }
  `]
})
export class EventsTableComponent {
  @Input() events: Event[] = [];
  @Output() delete = new EventEmitter<Event>();

  getStatusDotClass(status: string): string {
    const classes: Record<string, string> = {
      'PUBLISHED': 'bg-emerald-500 shadow-emerald-500/50',
      'DRAFT': 'bg-amber-500 shadow-amber-500/50',
      'CANCELLED': 'bg-red-500 shadow-red-500/50',
      'SOLD_OUT': 'bg-blue-500 shadow-blue-500/50'
    };
    return classes[status] || 'bg-slate-400';
  }

  getStatusTextClass(status: string): string {
    const classes: Record<string, string> = {
      'PUBLISHED': 'text-emerald-500',
      'DRAFT': 'text-amber-500',
      'CANCELLED': 'text-red-500',
      'SOLD_OUT': 'text-blue-500'
    };
    return classes[status] || 'text-slate-400';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'PUBLISHED': 'Publié',
      'DRAFT': 'Brouillon',
      'CANCELLED': 'Annulé',
      'SOLD_OUT': 'Complet'
    };
    return labels[status] || status;
  }

  onDelete(event: Event): void {
    this.delete.emit(event);
  }
}
