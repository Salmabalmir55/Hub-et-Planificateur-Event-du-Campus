import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Utilisateur, RegisterRequest } from '../models/utilisateur.model';

export interface UserProfileUpdate {
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  motDePasse?: string;
}

@Injectable({ providedIn: 'root' })
export class UserProfileService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/utilisateurs`;

  getById(id: number): Observable<Utilisateur> {
    return this.http
      .get<ApiResponse<Utilisateur>>(`${this.baseUrl}/${id}`)
      .pipe(map((r) => r.data));
  }

  getByEmail(email: string): Observable<Utilisateur> {
    return this.http
      .get<ApiResponse<Utilisateur>>(`${this.baseUrl}/email/${email}`)
      .pipe(map((r) => r.data));
  }

  update(id: number, profile: UserProfileUpdate): Observable<Utilisateur> {
    return this.http
      .put<ApiResponse<Utilisateur>>(`${this.baseUrl}/${id}`, profile)
      .pipe(map((r) => r.data));
  }

  updatePassword(id: number, oldPassword: string, newPassword: string): Observable<void> {
    return this.http
      .put<ApiResponse<void>>(`${this.baseUrl}/${id}/password`, { oldPassword, newPassword })
      .pipe(map(() => undefined));
  }

  desactiver(id: number): Observable<void> {
    return this.http
      .put<ApiResponse<void>>(`${this.baseUrl}/${id}/desactiver`, {})
      .pipe(map(() => undefined));
  }

  activer(id: number): Observable<void> {
    return this.http
      .put<ApiResponse<void>>(`${this.baseUrl}/${id}/activer`, {})
      .pipe(map(() => undefined));
  }

  // Méthode pour mettre à jour le profil complet
  updateProfile(id: number, data: Partial<RegisterRequest>): Observable<Utilisateur> {
    return this.http
      .put<ApiResponse<Utilisateur>>(`${this.baseUrl}/${id}/profile`, data)
      .pipe(map((r) => r.data));
  }
}
