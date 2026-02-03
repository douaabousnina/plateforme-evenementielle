import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Event } from '../../organizer/models/event.models';

// Backend event structure from NestJS
interface BackendEvent {
  id: string;
  title: string;
  description: string;
  location?: {
    name: string;
    address: string;
  };
  startDate: string | Date;
  endDate: string | Date;
  coverImage?: string;
  status: string;
  totalCapacity: number;
  availableCapacity: number;
  hasSeatingPlan: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AdminEventsService {
  private apiUrl = 'http://localhost:3000/events';

  constructor(private http: HttpClient) {}

  /**
   * GET all events (Admin only)
   */
  getAllEvents(): Observable<Event[]> {
    return this.http.get<BackendEvent[]>(this.apiUrl).pipe(
      map(events => events.map(event => this.mapBackendEventToFrontend(event)))
    );
  }


  /**
   * DELETE event by ID (Admin only)
   */
  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Map backend event structure to frontend Event interface
   */
  private mapBackendEventToFrontend(backendEvent: BackendEvent): Event {
    return {
      id: backendEvent.id,
      title: backendEvent.title,
      description: backendEvent.description,
      location: backendEvent.location?.name || 'N/A',
      startDate: new Date(backendEvent.startDate),
      endDate: new Date(backendEvent.endDate),
      image: backendEvent.coverImage || '',
      status: backendEvent.status as any,
      totalSeats: backendEvent.hasSeatingPlan ? backendEvent.totalCapacity : 0,
      availableSeats: backendEvent.hasSeatingPlan ? backendEvent.availableCapacity : 0
    };
  }
}
