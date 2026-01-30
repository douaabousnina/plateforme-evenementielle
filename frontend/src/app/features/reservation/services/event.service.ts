import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { Event } from '../models/event.model';

export interface EventFilters {
  type?: string;
  category?: string;
  city?: string;
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface EventStats {
  totalSeats: number;
  availableSeats: number;
  soldSeats: number;
  reservedSeats: number;
  revenue: number;
  occupancyRate: number;
}

export interface SeatStats {
  totalSeats: number;
  available: number;
  locked: number;
  sold: number;
  byCategory: Record<string, { total: number; available: number; sold: number }>;
  bySection: Record<string, { total: number; available: number; sold: number }>;
}

@Injectable({ providedIn: 'root' })
export class EventService {
    private apiService = inject(ApiService);
    private authService = inject(AuthService);

    currentEvent = signal<Event | null>(null);
    events = signal<Event[]>([]);
    loading = this.apiService.loading;
    error = this.apiService.error;

    isOrganizer = () => this.authService.isOrganizer();
    isAdmin = () => this.authService.isAdmin();

    // Public endpoints
    loadEvents(filters?: EventFilters): Observable<Event[]> {
        const params = new URLSearchParams();
        if (filters?.type) params.append('type', filters.type);
        if (filters?.category) params.append('category', filters.category);
        if (filters?.city) params.append('city', filters.city);
        if (filters?.status) params.append('status', filters.status);
        if (filters?.search) params.append('search', filters.search);
        if (filters?.limit) params.append('limit', filters.limit.toString());
        if (filters?.offset) params.append('offset', filters.offset.toString());

        const queryString = params.toString();
        const url = `events${queryString ? '?' + queryString : ''}`;

        return this.apiService.get<Event[]>(url).pipe(
            tap(events => this.events.set(events))
        );
    }

    loadFeaturedEvents(limit: number = 6): Observable<Event[]> {
        return this.apiService.get<Event[]>(`events/featured?limit=${limit}`).pipe(
            tap(events => this.events.set(events))
        );
    }

    loadEventById(id: string): Observable<Event> {
        return this.apiService.get<Event>(`events/${id}`).pipe(
            tap(event => this.currentEvent.set(event))
        );
    }

    // Organizer endpoints
    loadMyEvents(filters?: EventFilters): Observable<Event[]> {
        const params = new URLSearchParams();
        if (filters?.status) params.append('status', filters.status);
        if (filters?.limit) params.append('limit', filters.limit.toString());
        if (filters?.offset) params.append('offset', filters.offset.toString());

        const queryString = params.toString();
        const url = `events/my-events${queryString ? '?' + queryString : ''}`;

        return this.apiService.get<Event[]>(url).pipe(
            tap(events => this.events.set(events))
        );
    }

    createEvent(eventData: Partial<Event>): Observable<Event> {
        return this.apiService.post<Event>('events', eventData);
    }

    updateEvent(id: string, eventData: Partial<Event>): Observable<Event> {
        return this.apiService.patch<Event>(`events/${id}`, eventData).pipe(
            tap(event => {
                if (this.currentEvent()?.id === id) {
                    this.currentEvent.set(event);
                }
            })
        );
    }

    updateEventStatus(id: string, status: string): Observable<Event> {
        return this.apiService.patch<Event>(`events/${id}/status`, { status }).pipe(
            tap(event => {
                if (this.currentEvent()?.id === id) {
                    this.currentEvent.set(event);
                }
            })
        );
    }

    deleteEvent(id: string): Observable<void> {
        return this.apiService.delete<void>(`events/${id}`);
    }

    // Statistics endpoints
    getEventStats(id: string): Observable<EventStats> {
        return this.apiService.get<EventStats>(`events/${id}/stats`);
    }

    getSeatStats(id: string): Observable<SeatStats> {
        return this.apiService.get<SeatStats>(`events/${id}/seats/stats`);
    }

    setCurrentEvent(event: Event): void {
        this.currentEvent.set(event);
    }

    getCurrentEvent(): Event | null {
        return this.currentEvent();
    }

    clearCurrentEvent(): void {
        this.currentEvent.set(null);
    }

    clearEvents(): void {
        this.events.set([]);
    }
}
