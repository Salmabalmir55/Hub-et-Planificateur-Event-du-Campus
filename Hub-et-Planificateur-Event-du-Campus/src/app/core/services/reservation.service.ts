import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Reservation {
  id: number;
  titre: string;
  description?: string;
  salleId: number;
  salleNom?: string;
  evenementId?: number;
  dateDebut: Date | string;
  dateFin: Date | string;
  statut: 'en_attente' | 'confirmee' | 'annulee' | 'terminee';
  organisateurId: number;
  organisateurNom?: string;
  nombreParticipants: number;
  equipements?: string[];
  notes?: string;
  dateCreation?: Date | string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
  timestamp: string;
}

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/reservations`;

  // Récupérer toutes les réservations
  getAll(): Observable<Reservation[]> {
    return this.http.get<ApiResponse<Reservation[]>>(this.baseUrl).pipe(
      map(response => {
        if (response && response.data) {
          return response.data;
        }
        if (Array.isArray(response)) {
          return response;
        }
        return [];
      })
    );
  }

  // Récupérer une réservation par ID
  getById(id: number): Observable<Reservation> {
    return this.http.get<ApiResponse<Reservation>>(`${this.baseUrl}/${id}`).pipe(
      map(response => response.data || response)
    );
  }

  // Créer une réservation
  create(data: Partial<Reservation>): Observable<Reservation> {
    return this.http.post<ApiResponse<Reservation>>(this.baseUrl, data).pipe(
      map(response => response.data || response)
    );
  }

  // Modifier une réservation
  update(id: number, data: Partial<Reservation>): Observable<Reservation> {
    return this.http.put<ApiResponse<Reservation>>(`${this.baseUrl}/${id}`, data).pipe(
      map(response => response.data || response)
    );
  }

  // Annuler une réservation
  annuler(id: number): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/annuler`, {});
  }

  // Confirmer une réservation (admin)
  confirmer(id: number): Observable<Reservation> {
    return this.http.patch<ApiResponse<Reservation>>(`${this.baseUrl}/${id}/confirmer`, {}).pipe(
      map(response => response.data || response)
    );
  }

  // Supprimer une réservation
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Récupérer les réservations par salle
  getBySalleId(salleId: number): Observable<Reservation[]> {
    return this.http.get<ApiResponse<Reservation[]>>(`${this.baseUrl}/salle/${salleId}`).pipe(
      map(response => response.data || [])
    );
  }

  // Récupérer les réservations par organisateur
  getByOrganisateurId(organisateurId: number): Observable<Reservation[]> {
    return this.http.get<ApiResponse<Reservation[]>>(`${this.baseUrl}/organisateur/${organisateurId}`).pipe(
      map(response => response.data || [])
    );
  }

  // Vérifier la disponibilité d'une salle
  checkDisponibilite(salleId: number, dateDebut: string, dateFin: string): Observable<boolean> {
    return this.http.get<ApiResponse<boolean>>(`${this.baseUrl}/disponible`, {
      params: { salleId, dateDebut, dateFin }
    }).pipe(
      map(response => response.data || false)
    );
  }
}
