import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';

export interface ReservedSeat {
  seatId: string;
  price: number;
  status: 'LOCKED' | 'SOLD' | 'AVAILABLE';
}

export interface Reservation {
  id: string;
  userId: string;
  eventId: string;
  seats: ReservedSeat[];
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'EXPIRED';
  expiresAt: Date;
  createdAt?: Date;
}

export interface LockSeatsRequest {
  eventId: string;
  seatIds: string[];
}

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private currentReservation = signal<Reservation | null>(null);
  private http: HttpClient;

  reservation = this.currentReservation.asReadonly();
  private reservationSubject = new BehaviorSubject<Reservation | null>(null);
  reservation$ = this.reservationSubject.asObservable();

  constructor(private apiService: ApiService, http: HttpClient) {
    this.http = http;
  }

  /**
   * Lock seats and create a pending reservation
   */
  lockSeats(request: LockSeatsRequest): Observable<Reservation> {
    return this.apiService.post<Reservation>('reservations/lock', request).pipe(
      tap(reservation => {
        this.currentReservation.set(reservation);
        this.reservationSubject.next(reservation);
      })
    );
  }

  /**
   * Confirm a reservation after successful payment
   */
  confirmReservation(reservationId: string): Observable<Reservation> {
    return this.apiService.patch<Reservation>(
      `reservations/${reservationId}/confirm`,
      {}
    ).pipe(
      tap(reservation => {
        this.currentReservation.set(reservation);
        this.reservationSubject.next(reservation);
      })
    );
  }

  /**
   * Cancel a pending reservation
   */
  cancelReservation(reservationId: string): Observable<Reservation> {
    return this.apiService.patch<Reservation>(
      `reservations/${reservationId}/cancel`,
      {}
    ).pipe(
      tap(reservation => {
        this.currentReservation.set(reservation);
        this.reservationSubject.next(reservation);
      })
    );
  }

  /**
   * Get a single reservation by ID
   */
  getReservation(reservationId: string): Observable<Reservation> {
    return this.apiService.get<Reservation>(`reservations/${reservationId}`).pipe(
      tap(reservation => {
        this.currentReservation.set(reservation);
        this.reservationSubject.next(reservation);
      })
    );
  }

  /**
   * Get all reservations for a user
   */
  getUserReservations(userId: string): Observable<Reservation[]> {
    return this.apiService.get<Reservation[]>(`reservations/user/${userId}`);
  }

  /**
   * Clear current reservation
   */
  clearReservation(): void {
    this.currentReservation.set(null);
    this.reservationSubject.next(null);
  }

  /**
   * Get current reservation value
   */
  getCurrentReservation(): Reservation | null {
    return this.currentReservation();
  }
}
