import { inject, Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, finalize, catchError } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { Seat } from '../models/reservation.model';
import { SeatStatus } from '../enums/reservation.enum';
import { EventService } from './event.service';

@Injectable({ providedIn: 'root' })
export class SeatService {
    private apiService = inject(ApiService);
    private eventService = inject(EventService);

    seats = signal<Seat[]>([]);
    loading = this.apiService.loading;
    error = this.apiService.error;

    loadSeatsByEventId(eventId: string): Observable<Seat[]> {
        // Get seats from the event that's already loaded
        const event = this.eventService.currentEvent();
        if (event && event.seats && event.seats.length > 0) {
            this.seats.set(event.seats as Seat[]);
            return of(event.seats as Seat[]);
        }
        return of([]); // Return empty array if no seats found
    }

    // locally
    updateSeatStatus(seatId: string, status: SeatStatus): void {
        this.seats.update(seats =>
            seats.map(s => s.id === seatId ? { ...s, status } : s)
        );
    }

    // locally
    clearSeats(): void {
        this.seats.set([]);
    }
}