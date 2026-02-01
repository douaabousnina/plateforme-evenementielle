import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../features/auth-users/models/auth.model';

export interface UsersResponse {
  users?: User[];
  total?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminUsersService {
  private apiUrl = `http://localhost:3000/users`;

  constructor(private http: HttpClient) {}

  /**
   * GET all users (Admin only)
   */
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  /**
   * GET user by email (Admin only)
   */
  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/by-email/${email}`);
  }

  /**
   * DELETE user by ID (Admin only)
   */
  deleteUser(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
