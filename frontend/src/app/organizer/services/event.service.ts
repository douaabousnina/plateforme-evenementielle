import { Injectable, inject, signal } from '@angular/core';
import { Observable, of, delay, tap, catchError, map } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { EventsResponse, Event } from '../models/event.models';
import { MOCK_EVENTS_DATA } from '../mocks/event.mock';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private readonly api = inject(ApiService);
  
  eventsData = signal<EventsResponse | null>(null);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  getEvents(): Observable<EventsResponse> {
    this.loading.set(true);
    this.error.set(null);

    // Try to fetch from API, fall back to mock data on error
    return this.api.get<any>('events/my-events').pipe(
      map((data) => this.normalizeResponse(data)),
      tap((data) => {
        this.eventsData.set(data);
        this.loading.set(false);
      }),
      catchError(() => {
        // Fallback to mock data with simulated delay
        return of(MOCK_EVENTS_DATA).pipe(
          delay(300),
          tap((data) => {
            this.eventsData.set(data);
            this.loading.set(false);
            this.error.set('Using mock data');
          })
        );
      })
    );
  }

  private normalizeResponse(data: any): EventsResponse {
    const eventsArray = Array.isArray(data) ? data : data?.events ?? [];
    const events: Event[] = eventsArray.map((event: any) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      location: event.location?.venueName || event.location?.city || '—',
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate),
      image: event.coverImage || event.gallery?.[0] || '',
      status: event.status,
      totalSeats: event.totalCapacity ?? 0,
      availableSeats: event.availableCapacity ?? 0,
    }));

    return {
      events,
      total: data?.total ?? events.length,
    };
  }
}