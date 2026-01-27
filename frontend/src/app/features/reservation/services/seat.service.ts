import { inject, Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, finalize, catchError } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { Seat } from '../models/reservation.model';
import { SeatStatus } from '../enums/reservation.enum';

@Injectable({ providedIn: 'root' })
export class SeatService {
    private apiService = inject(ApiService);

    seats = signal<Seat[]>([]);
    loading = this.apiService.loading;
    error = this.apiService.error;

    loadSeatsByEventId(eventId: string): Observable<Seat[]> {
        return this.apiService.get<Seat[]>(`reservations/seats/event/${eventId}`).pipe(
            tap(seats => this.seats.set(seats)),
        );
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