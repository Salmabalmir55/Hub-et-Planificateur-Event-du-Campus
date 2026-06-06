import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {ApiResponse} from '../models/api-response.model';
import {Utilisateur} from '../models/utilisateur.model';

export interface EvenementStats {
  totalEvenements: number;
  evenementsCeMois: number;
  evenementsAVenir: number;
  tauxParticipationMoyen: number;
}
export interface StatistiquesDTO {
  totalUtilisateurs: number;
  totalEtudiants: number;
  totalOrganisateurs: number;
  totalAdmins: number;
  totalEvenements: number;
  evenementsCeMois: number;
  evenementsAVenir: number;
  totalInscriptions: number;
  tauxParticipationMoyen: number;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/admin`;

  // Statistiques
  getStatistiques(): Observable<StatistiquesDTO> {
    return this.http
      .get<ApiResponse<StatistiquesDTO>>(`${this.baseUrl}/statistiques`)
      .pipe(map((r) => r.data));
  }

  // Utilisateurs
  getAllUtilisateurs(): Observable<Utilisateur[]> {
    return this.http
      .get<ApiResponse<Utilisateur[]>>(`${this.baseUrl}/utilisateurs`)
      .pipe(map((r) => r.data));
  }

  deleteUtilisateur(id: number): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.baseUrl}/utilisateurs/${id}`)
      .pipe(map(() => undefined));
  }

  // Événements en attente
  getEvenementsEnAttente(): Observable<any[]> {
    return this.http
      .get<ApiResponse<any[]>>(`${this.baseUrl}/evenements/en-attente`)
      .pipe(map((r) => r.data));
  }

}
