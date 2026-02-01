import { Injectable, inject, signal } from '@angular/core';
import { Observable, of, delay, tap, catchError } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { AlertsResponse } from '../models/alerts.models';
import { MOCK_ALERTS_DATA } from '../mocks/alert.mock';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {
  private readonly api = inject(ApiService);

  alertsData = signal<AlertsResponse | null>(null);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  getAlerts(): Observable<AlertsResponse> {
    this.loading.set(true);
    this.error.set(null);

    // Try to fetch from API, fall back to mock data on error
    return this.api.get<AlertsResponse>('alerts').pipe(
      tap(data => {
        this.alertsData.set(data);
        this.loading.set(false);
      }),
      catchError(() => {
        // Fallback to mock data with simulated delay
        return of(MOCK_ALERTS_DATA).pipe(
          delay(300),
          tap(data => {
            this.alertsData.set(data);
            this.loading.set(false);
            this.error.set('Using mock data');
          })
        );
      })
    );
  }
}
