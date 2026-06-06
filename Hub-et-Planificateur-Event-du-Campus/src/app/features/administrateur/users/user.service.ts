import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';

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

  activerUser(id: number): Observable<unknown> {
    return this.http.put(`${this.apiUrl}/${id}/activer`, {});
  }

  desactiverUser(id: number): Observable<unknown> {
    return this.http.put(`${this.apiUrl}/${id}/desactiver`, {});
  }

  // ✅ Modifie cette méthode pour accepter 2 arguments
  createUser(userData: any, role: string): Observable<any> {
    let endpoint = '';
    if (role === 'ROLE_ETUDIANT') {
      endpoint = `${environment.apiUrl}/auth/register/etudiant`;
    } else if (role === 'ROLE_ORGANISATEUR') {
      endpoint = `${environment.apiUrl}/auth/register/organisateur`;
    } else {
      endpoint = `${environment.apiUrl}/auth/register/admin`;
    }

    console.log('📤 Endpoint:', endpoint);
    console.log('📤 Données:', userData);
    return this.http.post(endpoint, userData);
  }
}
