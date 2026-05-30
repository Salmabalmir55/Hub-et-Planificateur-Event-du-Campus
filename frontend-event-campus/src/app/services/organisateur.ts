import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Evenement } from '../models/evenement.model';

@Injectable({
  providedIn: 'root'
})
export class OrganisateurService {
  private apiUrl = 'http://localhost:8080/api/organisateur';

  constructor(private http: HttpClient) { }

  getMesEvenements(): Observable<ApiResponse<Evenement[]>> {
    return this.http.get<ApiResponse<Evenement[]>>(`${this.apiUrl}/mes-evenements`);
  }

  creerEvenement(evenementData: any): Observable<ApiResponse<Evenement>> {
    return this.http.post<ApiResponse<Evenement>>(`${this.apiUrl}/evenements`, evenementData);
  }
}
