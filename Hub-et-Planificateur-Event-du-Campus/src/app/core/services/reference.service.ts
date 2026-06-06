import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Categorie } from '../models/categorie.model';
import { Salle } from '../models/salle.model';

@Injectable({ providedIn: 'root' })
export class ReferenceService {
  private http = inject(HttpClient);

  getCategories(): Observable<Categorie[]> {
    return this.http
      .get<ApiResponse<Categorie[]>>(`${environment.apiUrl}/categories`)
      .pipe(map((r) => r.data));
  }

  getCategorieById(id: number): Observable<Categorie> {
    return this.http
      .get<ApiResponse<Categorie>>(`${environment.apiUrl}/categories/${id}`)
      .pipe(map((r) => r.data));
  }

  createCategorie(categorie: Partial<Categorie>): Observable<Categorie> {
    return this.http
      .post<ApiResponse<Categorie>>(`${environment.apiUrl}/categories`, categorie)
      .pipe(map((r) => r.data));
  }

  updateCategorie(id: number, categorie: Partial<Categorie>): Observable<Categorie> {
    return this.http
      .put<ApiResponse<Categorie>>(`${environment.apiUrl}/categories/${id}`, categorie)
      .pipe(map((r) => r.data));
  }

  deleteCategorie(id: number): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${environment.apiUrl}/categories/${id}`)
      .pipe(map(() => undefined));
  }

  getSalles(): Observable<Salle[]> {
    return this.http
      .get<ApiResponse<Salle[]>>(`${environment.apiUrl}/salles`)
      .pipe(map((r) => r.data));
  }

  getSalleById(id: number): Observable<Salle> {
    return this.http
      .get<ApiResponse<Salle>>(`${environment.apiUrl}/salles/${id}`)
      .pipe(map((r) => r.data));
  }

  getSallesDisponibles(): Observable<Salle[]> {
    return this.http
      .get<ApiResponse<Salle[]>>(`${environment.apiUrl}/salles/disponibles`)
      .pipe(map((r) => r.data));
  }

  createSalle(salle: Partial<Salle>): Observable<Salle> {
    return this.http
      .post<ApiResponse<Salle>>(`${environment.apiUrl}/salles`, salle)
      .pipe(map((r) => r.data));
  }

  updateSalle(id: number, salle: Partial<Salle>): Observable<Salle> {
    return this.http
      .put<ApiResponse<Salle>>(`${environment.apiUrl}/salles/${id}`, salle)
      .pipe(map((r) => r.data));
  }

  deleteSalle(id: number): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${environment.apiUrl}/salles/${id}`)
      .pipe(map(() => undefined));
  }
}
