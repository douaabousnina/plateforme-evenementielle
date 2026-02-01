import { Injectable, inject, signal } from '@angular/core';
import { Observable, of, delay, tap, catchError } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { EventsResponse } from '../models/event.models';
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
    return this.api.get<EventsResponse>('events').pipe(
      tap(data => {
        this.eventsData.set(data);
        this.loading.set(false);
      }),
      catchError(() => {
        // Fallback to mock data with simulated delay
        return of(MOCK_EVENTS_DATA).pipe(
          delay(300),
          tap(data => {
            this.eventsData.set(data);
            this.loading.set(false);
            this.error.set('Using mock data');
          })
        );
      })
    );
  }
}