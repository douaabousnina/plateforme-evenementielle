import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../services/event.service';
import { EventStatus } from '../../models/event.models';

@Component({
  selector: 'app-events-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './events-table.html',
  styleUrls: ['./events-table.css']
})
export class EventsTable implements OnInit {
  eventService = inject(EventService);

  ngOnInit() {
    this.eventService.getEvents().subscribe();
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  getProgressWidth(available: number, total: number): string {
    const sold = total - available;
    return `${(sold / total * 100)}%`;
  }

  getStatusLabel(status: EventStatus): string {
    const labels = {
      'PUBLISHED': 'Disponible',
      'DRAFT': 'Brouillon',
      'SOLD_OUT': 'Complet',
      'CANCELLED': 'Annulé'
    };
    return labels[status];
  }

  getStatusClass(status: EventStatus, available: number, total: number): string {
    if (status === 'SOLD_OUT' || available === 0) {
      return 'bg-slate-100 text-slate-800 dark:bg-slate-500/20 dark:text-slate-400';
    }
    if (status === 'CANCELLED') {
      return 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400';
    }
    if (status === 'DRAFT') {
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400';
    }
    // PUBLISHED - check if low stock
    if (available < total * 0.2) {
      return 'bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-400';
    }
    return 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400';
  }

  getProgressColor(status: EventStatus, available: number, total: number): string {
    if (status === 'SOLD_OUT' || available === 0) {
      return 'bg-slate-500';
    }
    if (status === 'CANCELLED') {
      return 'bg-red-500';
    }
    if (available < total * 0.2) {
      return 'bg-orange-500';
    }
    return 'bg-green-500';
  }

  getDisplayStatus(status: EventStatus, available: number): string {
    if (available === 0 || status === 'SOLD_OUT') {
      return 'Complet';
    }
    if (status === 'CANCELLED') {
      return 'Annulé';
    }
    if (status === 'DRAFT') {
      return 'Brouillon';
    }
    if (available < 50) {
      return 'Dernières places';
    }
    return 'Disponible';
  }
}