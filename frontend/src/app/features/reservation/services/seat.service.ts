import { inject, Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, finalize, catchError } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { Seat } from '../models/reservation.model';
import { SeatStatus } from '../enums/reservation.enum';

@Injectable({ providedIn: 'root' })
export class SeatService {
    private apiService = inject(ApiService);
    private authService = inject(AuthService);

    seats = signal<Seat[]>([]);
    loading = this.apiService.loading;
    error = this.apiService.error;

    isAuthenticated = () => !!this.authService.getCurrentUser();

    loadSeatsByEventId(eventId: string): Observable<{ eventId: string; totalSeats: number; seats: Seat[] }> {
        return this.apiService.get<{ eventId: string; totalSeats: number; seats: Seat[] }>(`events/${eventId}/seats`).pipe(
            tap(response => this.seats.set(response.seats)),
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