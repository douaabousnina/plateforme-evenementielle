import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CheckInResponse, ScanLog, Ticket } from '../models/access.model';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AccessService {
  private apiService = inject(ApiService);
  private authService = inject(AuthService);

  tickets = signal<Ticket[]>([]);
  loading = this.apiService.loading;
  error = this.apiService.error;

  isAuthenticated = () => !!this.authService.getCurrentUser();
  getCurrentUserId = () => this.authService.getCurrentUser()?.id;

  /**
   * Check in a ticket by scanning QR code
   */
  checkIn(qrData: string, scannedBy: string, location?: string, deviceInfo?: string): Observable<CheckInResponse> {
    return this.apiService.post<CheckInResponse>('access/check-in', {
      qrCode: qrData,
      scannedBy,
      location,
      deviceInfo
    });
  }

  /**
   * Get scan history for an event
   */
  getScanHistory(eventId: string): Observable<ScanLog[]> {
    return this.apiService.get<ScanLog[]>(`scanlog/event/${eventId}`);
  }

  /**
   * Get all tickets for the current user
   */
  getMyTickets(): Observable<Ticket[]> {
    return this.apiService.get<Ticket[]>('access/tickets/user/me').pipe(
      tap(tickets => this.tickets.set(tickets))
    );
  }

  /**
   * Get all tickets for a specific user
   */
  getUserTickets(userId: string): Observable<Ticket[]> {
    return this.apiService.get<Ticket[]>(`access/tickets/user/${userId}`).pipe(
      tap(tickets => this.tickets.set(tickets))
    );
  }

  /**
   * Get all tickets for a specific reservation
   */
  getTicketsByReservation(reservationId: string): Observable<Ticket[]> {
    return this.apiService.get<Ticket[]>(`access/tickets/reservation/${reservationId}`);
  }

  /**
   * Refresh QR code for a ticket
   */
  refreshQRCode(ticketId: string): Observable<{ qrCode: string; qrToken: string }> {
    return this.apiService.post<{ qrCode: string; qrToken: string }>(`access/refresh-qr/${ticketId}`, {});
  }

  /**
   * Generate QR code for a ticket
   */
  generateQRCode(ticketId: string): Observable<{ qrCode: string }> {
    return this.apiService.post<{ qrCode: string }>('access/generate-qr', { ticketId });
  }

  /**
   * Get statistics for all events
   */
  getAllEventStats(): Observable<any> {
    return this.apiService.get('scanlog/stats');
  }

  /**
   * Get statistics for a specific event
   */
  getEventStats(eventId: string): Observable<any> {
    return this.apiService.get(`scanlog/event/${eventId}/stats`);
  }

  /**
   * Clear tickets cache
   */
  clearTickets(): void {
    this.tickets.set([]);
  }
}
