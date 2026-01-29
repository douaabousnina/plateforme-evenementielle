import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, tap, catchError } from 'rxjs';
import { KpiResponse } from '../models/kpi.models';
import { MOCK_KPI_DATA } from '../mocks/kpi.mock';

@Injectable({
  providedIn: 'root'
})
export class KpiService {
  private http = inject(HttpClient);
  private apiUrl = '/api/kpis';

  kpiData = signal<KpiResponse | null>(null);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  getKpis(): Observable<KpiResponse> {
    this.loading.set(true);
    this.error.set(null);
    return this.getMockData();
  }

  private getMockData(): Observable<KpiResponse> {
    return of(MOCK_KPI_DATA).pipe(
      delay(500),
      tap(data => {
        this.kpiData.set(data);
        this.loading.set(false);
      }),
      catchError(err => {
        this.error.set('Erreur lors du chargement des mock data');
        this.loading.set(false);
        return of({} as KpiResponse);
      })
    );
  }

  private getApiData(): Observable<KpiResponse> {
    return this.http.get<KpiResponse>(this.apiUrl).pipe(
      tap(data => {
        this.kpiData.set(data);
        this.loading.set(false);
      }),
      catchError(err => {
        this.error.set('Erreur lors du chargement des données');
        this.loading.set(false);
        return of({} as KpiResponse);
      })
    );
  }
}