import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { LoginDto, RegisterDto, AuthResponse, User } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private apiUrl = 'http://localhost:3000';
  
  // Subject pour gérer l'état de l'utilisateur connecté
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Vérifier si un token existe au chargement
    this.checkAuthStatus();
  }

  /**
   * Connexion de l'utilisateur
   */
  login(loginDto: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginDto)
      .pipe(
        tap(response => this.handleAuthSuccess(response))
      );
  }

  /**
   * Inscription de l'utilisateur
   */
  register(registerDto: RegisterDto): Observable<AuthResponse> {
    // Retirer confirmPassword avant d'envoyer au backend
    const { confirmPassword, ...backendDto } = registerDto;
    
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, backendDto)
      .pipe(
        tap(response => this.handleAuthSuccess(response))
      );
  }

  /**
   * Déconnexion
   */
  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  /**
   * Vérifier si l'utilisateur est connecté
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  /**
   * Récupérer le token d'accès
   */
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  /**
   * Récupérer l'utilisateur actuel depuis le token
   */
  getCurrentUser(): User | null {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.sub,
        email: payload.email,
        role: payload.role
      };
    } catch {
      return null;
    }
  }

  /**
   * Gérer le succès de l'authentification
   */
  private handleAuthSuccess(response: AuthResponse): void {
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    
    const user = this.getCurrentUser();
    this.currentUserSubject.next(user);
    
    // Redirection selon le rôle
    if (user?.role === 'ADMIN') {
      this.router.navigate(['/admin/users']);
    } else if (user?.role === 'ORGANIZER') {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/client/home']);
    }
  }

  /**
   * Vérifier le statut d'authentification au chargement
   */
  private checkAuthStatus(): void {
    const user = this.getCurrentUser();
    this.currentUserSubject.next(user);
  }
}
