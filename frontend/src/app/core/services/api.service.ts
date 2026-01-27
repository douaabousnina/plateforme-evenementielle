import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, finalize, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  // TODO: how to get env 
  private apiUrl = 'http://localhost:3000';
  private http = inject(HttpClient);

  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  private request<T>(observable: Observable<T>): Observable<T> {
    this.loading.set(true);
    this.error.set(null);
    
    return observable.pipe(
      finalize(() => this.loading.set(false)),
      catchError(err => {
        this.error.set('API request failed');
        return throwError(() => err);
      })
    );
  }

  get<T>(endpoint: string, params?: any): Observable<T> {
    return this.request(
      this.http.get<T>(`${this.apiUrl}/${endpoint}`, { params })
    );
  }

  post<T>(endpoint: string, body?: any): Observable<T> {
    return this.request(
      this.http.post<T>(`${this.apiUrl}/${endpoint}`, body)
    );
  }

  patch<T>(endpoint: string, body?: any): Observable<T> {
    return this.request(
      this.http.patch<T>(`${this.apiUrl}/${endpoint}`, body)
    );
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.request(
      this.http.delete<T>(`${this.apiUrl}/${endpoint}`)
    );
  }
}