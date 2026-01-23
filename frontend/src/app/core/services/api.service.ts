import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MockDataService } from './mock-data.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  // Use environment variable or default to localhost
  private apiUrl = this.getApiUrl();
  private useMockData = true; // Set to false to use real backend

  constructor(
    private http: HttpClient,
    private mockDataService: MockDataService
  ) { }

  private getApiUrl(): string {
    // Try to use environment variable if available
    if (typeof window !== 'undefined') {
      const protocol = window.location.protocol;
      const hostname = window.location.hostname;
      // In development, assume backend runs on port 3000
      return `${protocol}//${hostname === 'localhost' ? 'localhost:3000' : hostname}`;
    }
    return 'http://localhost:3000';
  }

  // Generic GET request
  get<T>(endpoint: string, params?: any): Observable<T> {
    // Intercept mock data requests
    if (this.useMockData) {
      if (endpoint === 'events') {
        return of(this.mockDataService.getEvents() as T).pipe(delay(300));
      }
      if (endpoint.startsWith('events/')) {
        const id = endpoint.split('/')[1];
        const event = this.mockDataService.getEventById(id);
        return of(event as T).pipe(delay(200));
      }
      if (endpoint.startsWith('seats/event/')) {
        const eventId = endpoint.replace('seats/event/', '');
        return of(this.mockDataService.getSeatsByEventId(eventId) as T).pipe(delay(400));
      }
      if (endpoint.startsWith('reservations/')) {
        const reservationId = endpoint.replace('reservations/', '');
        const reservation = this.mockDataService.getReservationById(reservationId);
        if (reservation) {
          return of(reservation as T).pipe(delay(300));
        }
        // If not found, let it fall through to real HTTP (which will 404)
      }
    }

    return this.http.get<T>(`${this.apiUrl}/${endpoint}`, { params });
  }

  // Generic POST request
  post<T>(endpoint: string, body?: any): Observable<T> {
    // Intercept mock data requests
    if (this.useMockData) {
      if (endpoint === 'reservations/lock') {
        const reservation = this.mockDataService.createReservation(body.eventId, body.seatIds);
        return of(reservation as T).pipe(delay(500));
      }
      if (endpoint === 'payments/process') {
        const mockPaymentResponse = {
          status: 'success',
          transactionId: `TXN-${Date.now()}`,
          message: 'Payment processed successfully'
        };
        return of(mockPaymentResponse as T).pipe(delay(800));
      }
    }

    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, body);
  }

  // Generic PATCH request
  patch<T>(endpoint: string, body?: any): Observable<T> {
    // Intercept mock data requests
    if (this.useMockData) {
      if (endpoint.startsWith('reservations/')) {
        const reservationId = endpoint.split('/')[1];
        const reservation = this.mockDataService.confirmReservation(reservationId);
        return of(reservation as T).pipe(delay(300));
      }
    }

    return this.http.patch<T>(`${this.apiUrl}/${endpoint}`, body);
  }

  // Generic DELETE request
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}/${endpoint}`);
  }

  // Switch between mock and real backend
  setUseMockData(useMock: boolean): void {
    this.useMockData = useMock;
    console.log(`Switched to ${useMock ? 'mock' : 'real'} backend`);
  }

  isMockDataEnabled(): boolean {
    return this.useMockData;
  }
}

