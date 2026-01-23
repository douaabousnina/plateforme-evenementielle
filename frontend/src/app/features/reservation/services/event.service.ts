import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { Event } from '../models/event.model';

@Injectable({ providedIn: 'root' })
export class EventService {
    private currentEventSignal = signal<Event | null>(null);

    currentEvent = this.currentEventSignal.asReadonly();

    constructor(private apiService: ApiService) { }

    /**
     * Fetch event by ID from backend
     */
    getEventById(id: string): Observable<Event> {
        return this.apiService.get<Event>(`events/${id}`).pipe(
            tap(event => {
                this.currentEventSignal.set(event);
            })
        );
    }

    /**
     * Get all events
     */
    getAllEvents(): Observable<Event[]> {
        return this.apiService.get<Event[]>('events');
    }

    /**
     * Set current event (used internally)
     */
    setCurrentEvent(event: Event): void {
        this.currentEventSignal.set(event);
    }

    /**
     * Get currently loaded event
     */
    getCurrentEvent(): Event | null {
        return this.currentEventSignal();
    }
}