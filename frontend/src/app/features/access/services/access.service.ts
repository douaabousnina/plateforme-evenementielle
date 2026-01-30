import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CheckInResponse, ScanLog, Ticket } from '../models/access.model';
import { ApiService } from '../../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AccessService {
  private apiService = inject(ApiService);

  loading = this.apiService.loading;
  error = this.apiService.error;

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
   * Get all tickets for a specific user
   */
  getUserTickets(userId: string): Observable<Ticket[]> {
    return this.apiService.get<Ticket[]>(`access/tickets/user/${userId}`);
  }

  /**
   * Refresh QR code for a ticket
   */
  refreshQRCode(ticketId: string): Observable<{ qrCode: string; qrToken: string }> {
    return this.apiService.post<{ qrCode: string; qrToken: string }>(`access/refresh-qr/${ticketId}`, {});
  }

  /**
   * Get statistics for all events
   */
  getAllEventStats(): Observable<any> {
    return this.apiService.get('scanlog/stats');
  }
}
