import { Injectable, inject, signal } from '@angular/core';
import { Observable, of, delay, tap, catchError } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { SalesResponse } from '../models/sales.models';
import { MOCK_SALES_DATA } from '../mocks/sales.mock';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private readonly api = inject(ApiService);

  salesData = signal<SalesResponse | null>(null);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  getSalesData(): Observable<SalesResponse> {
    this.loading.set(true);
    this.error.set(null);

    // Try to fetch from API, fall back to mock data on error
    return this.api.get<SalesResponse>('sales').pipe(
      tap(data => {
        this.salesData.set(data);
        this.loading.set(false);
      }),
      catchError(() => {
        // Fallback to mock data with simulated delay
        return of(MOCK_SALES_DATA).pipe(
          delay(400),
          tap(data => {
            this.salesData.set(data);
            this.loading.set(false);
            this.error.set('Using mock data');
          })
        );
      })
    );
  }
}
