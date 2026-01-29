import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CheckInResponse, ScanLog, Ticket } from '../models/access.model';

@Injectable({
  providedIn: 'root'
})
export class AccessService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/access';

  /**
   * Check in a ticket by scanning QR code
   */
  checkIn(qrData: string, scannedBy: string, location?: string, deviceInfo?: string): Observable<CheckInResponse> {
    return this.http.post<CheckInResponse>(`${this.apiUrl}/check-in`, {
      qrData,
      scannedBy,
      location,
      deviceInfo
    });
  }

  /**
   * Get scan history for an event
   */
  getEventScanHistory(eventId: string): Observable<ScanLog[]> {
    return this.http.get<ScanLog[]>(`${this.apiUrl}/scan-history/event/${eventId}`);
  }

  /**
   * Get scan history for an event (alias)
   */
  getScanHistory(eventId: string): Observable<ScanLog[]> {
    return this.getEventScanHistory(eventId);
  }

  /**
   * Get scan history for a controller
   */
  getControllerScanHistory(controllerId: string): Observable<ScanLog[]> {
    return this.http.get<ScanLog[]>(`${this.apiUrl}/scan-history/controller/${controllerId}`);
  }

  /**
   * Get all scan logs
   */
  getAllScanHistory(): Observable<ScanLog[]> {
    return this.http.get<ScanLog[]>(`${this.apiUrl}/scan-history`);
  }

  /**
   * Get scan statistics for an event
   */
  getScanStats(eventId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats/${eventId}`);
  }

  getAllEventStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }
  /**
   * Get ticket by ID
   */
  getTicket(ticketId: string): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiUrl}/ticket/${ticketId}`);
  }

  /**
   * Get tickets for a user
   */
  getUserTickets(userId: string): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}/tickets/user/${userId}`);
  }

  /**
   * Refresh QR code
   */
  refreshQRCode(ticketId: string): Observable<{ qrCode: string; qrToken: string }> {
    return this.http.post<{ qrCode: string; qrToken: string }>(`${this.apiUrl}/refresh-qr/${ticketId}`, {});
  }
}
