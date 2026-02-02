import { Injectable, inject, signal } from '@angular/core';
import { Observable, of, delay, tap, catchError, map, switchMap } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { EventsResponse, Event } from '../models/event.models';
import { CreateEventRequest } from '../models/create-event.model';
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

  createEvent(createEventRequest: CreateEventRequest): Observable<any> {
    return of(createEventRequest).pipe(
      // Transform dates and enums
      map((request) => this.transformEventRequest(request)),
      // Log the final payload
      tap((request) => {
        console.log('Final payload being sent:', request);
      }),
      // Send to API
      switchMap((request) => this.api.post('events', request)),
      tap(() => {
        this.error.set(null);
      }),
      catchError((error) => {
        this.error.set('Erreur lors de la création de l\'événement');
        throw error;
      })
    );
  }

  private transformEventRequest(request: CreateEventRequest): CreateEventRequest {
    // Ensure dates are properly formatted
    const combineDateTimeISO = (dateStr: string, timeStr: string): string => {
      if (!dateStr || !timeStr) {
        return new Date().toISOString();
      }
      try {
        const combined = `${dateStr}T${timeStr}:00`;
        return new Date(combined).toISOString();
      } catch (e) {
        return new Date().toISOString();
      }
    };

    // Ensure enums are lowercase
    const toLowercase = (value: string): string => value?.toLowerCase() || '';

    // Filter out empty/undefined optional fields
    const filterOptional = (value: any): any => {
      if (typeof value === 'string') {
        return value && value.trim() ? value : undefined;
      }
      if (Array.isArray(value)) {
        return value && value.length > 0 ? value : undefined;
      }
      return value;
    };

    return {
      ...request,
      type: toLowercase(request.type),
      category: toLowercase(request.category),
      startDate: combineDateTimeISO(request.startDate as any, request.startTime as any),
      startTime: combineDateTimeISO(request.startDate as any, request.startTime as any),
      endDate: combineDateTimeISO(request.endDate as any, request.endTime as any),
      endTime: combineDateTimeISO(request.endDate as any, request.endTime as any),
      coverImage: filterOptional(request.coverImage),
      gallery: filterOptional(request.gallery),
      location: {
        ...request.location,
        type: toLowercase(request.location.type as any)
      }
    };
  }
}