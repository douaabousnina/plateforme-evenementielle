import { Injectable, signal } from '@angular/core';
import { Observable, of, delay, tap } from 'rxjs';
import { EventsResponse } from '../models/event.models';
import { MOCK_EVENTS_DATA } from '../mocks/event.mock';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  eventsData = signal<EventsResponse | null>(null);
  loading = signal<boolean>(false);

  getEvents(): Observable<EventsResponse> {
    this.loading.set(true);

    return of(MOCK_EVENTS_DATA).pipe(
      delay(300),
      tap(data => {
        this.eventsData.set(data);
        this.loading.set(false);
      })
    );
  }
}