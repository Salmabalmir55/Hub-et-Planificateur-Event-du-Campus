import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Interface calquée sur votre modèle de Base de Données
export interface Evenement {
  id: number;
  titre: string;
  description?: string;
  dateDebut: string;
  dateFin?: string;
  lieu?: string;
  statut: 'EN_ATTENTE' | 'VALIDE' | 'REFUSE';
  capaciteMax?: number;
  organisateurId?: number;
  categorieId?: number;
  salleId?: number;
}

// Interface pour correspondre à l'enveloppe de vos réponses API
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class AdminEvent {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/evenements';

  // Récupère les événements et filtre uniquement ceux en attente
  getPendingEvents(): Observable<Evenement[]> {
    return this.http.get<ApiResponse<Evenement[]>>(this.apiUrl).pipe(
      map(response => response.data.filter(e => e.statut === 'EN_ATTENTE'))
    );
  }

  // Met à jour le statut d'un événement
  updateEventStatus(id: number, statut: 'VALIDE' | 'REFUSE'): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/statut?statut=${statut}`, {});
  }
}
