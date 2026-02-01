import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap, catchError } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Event } from '../models/event.model';


@Injectable({ providedIn: 'root' })
export class EventService {
    currentEvent = signal<Event | null>(null);
    loading = signal<boolean>(false);
    error = signal<string | null>(null);
    private readonly apiService = inject(ApiService);

    loadEventById(id: string): Observable<Event> {
        this.loading.set(true);
        this.error.set(null);

        return this.apiService.get<Event>(`events/${id}`).pipe(
            tap({
                next: (event) => {
                    this.currentEvent.set(event);
                    this.loading.set(false);
                },
                error: (err) => {
                    this.error.set(err?.message || 'Event not found');
                    this.loading.set(false);
                }
            })
        );
    }

    loadEventsList(page: number = 1, limit: number = 12, filters?: any): Observable<any> {
        this.loading.set(true);
        this.error.set(null);

        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        if (filters?.search) params.append('search', filters.search);
        if (filters?.category) params.append('category', filters.category);
        if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
        if (filters?.dateTo) params.append('dateTo', filters.dateTo);
        if (filters?.city) params.append('city', filters.city);

        return this.apiService.get<any>(`events?${params.toString()}`).pipe(
            tap({
                next: (response) => {
                    this.loading.set(false);
                },
                error: (err) => {
                    this.error.set(err?.message || 'Failed to load events');
                    this.loading.set(false);
                }
            })
        );
    }

    getFeaturedEvents(limit: number = 6): Observable<Event[]> {
        this.loading.set(true);
        this.error.set(null);

        return this.apiService.get<Event[]>(`events/featured?limit=${limit}`).pipe(
            tap({
                next: () => {
                    this.loading.set(false);
                },
                error: (err) => {
                    this.error.set(err?.message || 'Failed to load featured events');
                    this.loading.set(false);
                }
            })
        );
    }

    getEventSeats(eventId: string): Observable<any> {
        this.loading.set(true);
        this.error.set(null);

        return this.apiService.get<any>(`events/${eventId}/seats`).pipe(
            tap({
                next: () => {
                    this.loading.set(false);
                },
                error: (err) => {
                    this.error.set(err?.message || 'Failed to load event seats');
                    this.loading.set(false);
                }
            })
        );
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
}