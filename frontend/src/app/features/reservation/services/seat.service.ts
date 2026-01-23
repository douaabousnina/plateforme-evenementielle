import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { Seat } from '../models/reservation.model';

@Injectable({ providedIn: 'root' })
export class SeatService {
    private seatsSignal = signal<Seat[]>([]);
    private loadingSignal = signal<boolean>(false);
    private errorSignal = signal<string | null>(null);

    seats = this.seatsSignal.asReadonly();
    loading = this.loadingSignal.asReadonly();
    error = this.errorSignal.asReadonly();

    constructor(private apiService: ApiService) { }

    /**
     * Fetch available seats for an event
     */
    getSeatsByEventId(eventId: string): Observable<Seat[]> {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);

        return this.apiService.get<Seat[]>(`seats/event/${eventId}`).pipe(
            tap(
                seats => {
                    this.seatsSignal.set(seats);
                    this.loadingSignal.set(false);
                },
                error => {
                    this.errorSignal.set(error?.message || 'Error loading seats');
                    this.loadingSignal.set(false);
                }
            )
        );
    }

    /**
     * Get currently loaded seats
     */
    getCurrentSeats(): Seat[] {
        return this.seatsSignal();
    }

    /**
     * Update seat status locally
     */
    updateSeatStatus(seatId: string, status: string): void {
        this.seatsSignal.update(seats =>
            seats.map(s => s.id === seatId ? { ...s, status: status as any } : s)
        );
    }

    /**
     * Clear seats
     */
    clearSeats(): void {
        this.seatsSignal.set([]);
        this.errorSignal.set(null);
    }
}
