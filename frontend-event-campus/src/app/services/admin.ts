import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Evenement } from '../models/evenement.model';
import { Utilisateur } from '../models/utilisateur.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8080/api/admin';

  constructor(private http: HttpClient) { }

  getEvenementsEnAttente(): Observable<ApiResponse<Evenement[]>> {
    return this.http.get<ApiResponse<Evenement[]>>(`${this.apiUrl}/evenements/en-attente`);
  }

  validerEvenement(id: number): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(`${this.apiUrl}/evenements/${id}/valider`, {});
  }

  getAllUtilisateurs(): Observable<ApiResponse<Utilisateur[]>> {
    return this.http.get<ApiResponse<Utilisateur[]>>(`${this.apiUrl}/utilisateurs`);
  }
}
