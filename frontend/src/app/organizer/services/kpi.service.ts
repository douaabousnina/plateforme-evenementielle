import { Injectable, inject, signal } from '@angular/core';
import { Observable, of, delay, tap, catchError } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { KpiResponse } from '../models/kpi.models';
import { MOCK_KPI_DATA } from '../mocks/kpi.mock';

@Injectable({
  providedIn: 'root'
})
export class KpiService {
  private readonly api = inject(ApiService);

  kpiData = signal<KpiResponse | null>(null);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  getKpis(): Observable<KpiResponse> {
    this.loading.set(true);
    this.error.set(null);

    // Try to fetch from API, fall back to mock data on error
    return this.api.get<KpiResponse>('kpis').pipe(
      tap(data => {
        this.kpiData.set(data);
        this.loading.set(false);
      }),
      catchError(() => {
        // Fallback to mock data with simulated delay
        return of(MOCK_KPI_DATA).pipe(
          delay(500),
          tap(data => {
            this.kpiData.set(data);
            this.loading.set(false);
            this.error.set('Using mock data');
          })
        );
      })
    );
  }
}