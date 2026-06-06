import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Inscription } from '../models/inscription.model';

@Injectable({ providedIn: 'root' })
export class InscriptionService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/inscriptions`;

  getAllInscriptions(): Observable<Inscription[]> {
    return this.http
      .get<ApiResponse<Inscription[]>>(this.baseUrl)
      .pipe(map((r) => r.data));
  }

  getByEtudiant(etudiantId: number): Observable<Inscription[]> {
    return this.http
      .get<ApiResponse<Inscription[]>>(`${this.baseUrl}/etudiant/${etudiantId}`)
      .pipe(map((r) => r.data));
  }

  getByEvenement(evenementId: number): Observable<Inscription[]> {
    return this.http
      .get<ApiResponse<Inscription[]>>(`${this.baseUrl}/evenement/${evenementId}`)
      .pipe(map((r) => r.data));
  }

  inscrire(etudiantId: number, evenementId: number): Observable<Inscription> {
    const params = `?etudiantId=${etudiantId}&evenementId=${evenementId}`;
    return this.http
      .post<ApiResponse<Inscription>>(`${this.baseUrl}${params}`, {})
      .pipe(map((r) => r.data));
  }

  annuler(id: number): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.baseUrl}/${id}`)
      .pipe(map(() => undefined));
  }

  marquerPresence(id: number): Observable<Inscription> {
    return this.http
      .put<ApiResponse<Inscription>>(`${this.baseUrl}/${id}/presence`, {})
      .pipe(map((r) => r.data));
  }

  isInscrit(etudiantId: number, evenementId: number): Observable<boolean> {
    return this.http
      .get<ApiResponse<boolean>>(`${this.baseUrl}/check?etudiantId=${etudiantId}&evenementId=${evenementId}`)
      .pipe(map((r) => r.data));
  }
}
