import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Salle {
  id: number;
  nom: string;
  capacite: number;
  equipements: string;
  localisation: string;
  disponible: boolean;
  type?: string;
  nombreEvenements?: number;
  dateCreation?: Date | string;
  nombreReservations?: number;
  tauxOccupation?: number;
  reservationsRecentes?: any[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
  timestamp: string;
}

@Injectable({ providedIn: 'root' })
export class SalleService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/salles`;

  getAll(): Observable<Salle[]> {
    return this.http.get<ApiResponse<Salle[]>>(this.baseUrl).pipe(
      map(response => response.data || [])  // ✅ Extraire le tableau de 'data'
    );
  }

  getDisponibles(): Observable<Salle[]> {
    return this.http.get<ApiResponse<Salle[]>>(`${this.baseUrl}/disponibles`).pipe(
      map(response => response.data || [])
    );
  }

  getById(id: number): Observable<Salle> {
    return this.http.get<ApiResponse<Salle>>(`${this.baseUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  create(data: Partial<Salle>): Observable<Salle> {
    return this.http.post<ApiResponse<Salle>>(this.baseUrl, data).pipe(
      map(response => response.data)
    );
  }

  update(id: number, data: Partial<Salle>): Observable<Salle> {
    return this.http.put<ApiResponse<Salle>>(`${this.baseUrl}/${id}`, data).pipe(
      map(response => response.data)
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  activer(id: number): Observable<void> {
    return this.http.patch<ApiResponse<void>>(`${this.baseUrl}/${id}/activer`, {}).pipe(
      map(response => response.data)
    );
  }

  desactiver(id: number): Observable<void> {
    return this.http.patch<ApiResponse<void>>(`${this.baseUrl}/${id}/desactiver`, {}).pipe(
      map(response => response.data)
    );
  }
}
