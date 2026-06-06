import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../core/models/api-response.model';

export interface BackendUser {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: 'ROLE_ETUDIANT' | 'ROLE_ORGANISATEUR' | 'ROLE_ADMIN';
  actif: boolean;
  dateInscription?: string;
  telephone?: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/utilisateurs`;

  getUsers(): Observable<BackendUser[]> {
    return this.http
      .get<ApiResponse<BackendUser[]>>(this.apiUrl)
      .pipe(map((response) => response.data));
  }

  getUserById(id: number): Observable<BackendUser> {
    return this.http
      .get<ApiResponse<BackendUser>>(`${this.apiUrl}/${id}`)
      .pipe(map((response) => response.data));
  }

  activerUser(id: number): Observable<BackendUser> {
    return this.http
      .put<ApiResponse<BackendUser>>(`${this.apiUrl}/${id}/activer`, {})
      .pipe(map((response) => response.data));
  }

  desactiverUser(id: number): Observable<BackendUser> {
    return this.http
      .put<ApiResponse<BackendUser>>(`${this.apiUrl}/${id}/desactiver`, {})
      .pipe(map((response) => response.data));
  }

  deleteUser(id: number): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.apiUrl}/${id}`)
      .pipe(map(() => undefined));
  }

  updateUser(id: number, data: Partial<BackendUser>): Observable<BackendUser> {
    return this.http
      .put<ApiResponse<BackendUser>>(`${this.apiUrl}/${id}`, data)
      .pipe(map((response) => response.data));
  }
}
