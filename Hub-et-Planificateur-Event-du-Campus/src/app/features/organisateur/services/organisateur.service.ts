import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { Categorie, Salle } from '../../../core/models/evenement.model';

@Injectable({
  providedIn: 'root'
})
export class OrganisateurService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getCategories(): Observable<Categorie[]> {
    return this.http.get<ApiResponse<Categorie[]>>(`${this.apiUrl}/categories`)
      .pipe(map(response => response.data));
  }

  getSalles(): Observable<Salle[]> {
    return this.http.get<ApiResponse<Salle[]>>(`${this.apiUrl}/salles`)
      .pipe(map(response => response.data));
  }

  createEvent(eventData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/evenements`, eventData);
  }

  updateEvent(id: number, eventData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/evenements/${id}`, eventData);
  }

  getMesEvenements(organisateurId: number): Observable<any[]> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/evenements/organisateur/${organisateurId}`)
      .pipe(map(response => response.data));
  }
}
