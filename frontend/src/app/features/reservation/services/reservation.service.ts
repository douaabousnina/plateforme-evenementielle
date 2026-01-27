import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { LockSeatsRequest, Reservation } from '../models/reservation.model';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private apiService = inject(ApiService);

  currentReservation = signal<Reservation | null>(null);
  reservations = signal<Reservation[]>([]); // in case of get all
  loading = this.apiService.loading;
  error = this.apiService.error;

  lockSeats(request: LockSeatsRequest): Observable<Reservation> {
    return this.apiService.post<Reservation>('reservations/lock', request).pipe(
      tap(reservation => this.currentReservation.set(reservation)),
    );
  }

  confirmReservation(reservationId: string): Observable<Reservation> {
    return this.apiService.patch<Reservation>(`reservations/${reservationId}/confirm`).pipe(
      tap(reservation => this.currentReservation.set(reservation)),
    );
  }

  cancelReservation(reservationId: string): Observable<Reservation> {
    return this.apiService.patch<Reservation>(`reservations/${reservationId}/cancel`).pipe(
      tap(reservation => this.currentReservation.set(reservation)),
    );
  }

  getReservation(reservationId: string): Observable<Reservation> {
    return this.apiService.get<Reservation>(`reservations/${reservationId}`).pipe(
      tap(reservation => this.currentReservation.set(reservation)),
    );
  }

  getUserReservations(userId: string): Observable<Reservation[]> {
    return this.apiService.get<Reservation[]>(`reservations/user/${userId}`).pipe(
      tap(reservations => this.reservations.set(reservations)),
    );
  }

  clearReservation(): void {
    this.currentReservation.set(null);
  }
}