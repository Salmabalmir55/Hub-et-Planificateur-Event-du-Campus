// src/app/core/services/categorie.service.ts

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Categorie, CategorieFormData, ApiResponse } from '../models/categorie.model';
import {Evenement} from '../models/evenement.model';

@Injectable({
  providedIn: 'root'
})
export class CategorieService {
  private readonly basePath = '/categories';

  constructor(private apiService: ApiService) {}

  getAll(): Observable<ApiResponse<Categorie[]>> {
    return this.apiService.get<ApiResponse<Categorie[]>>(this.basePath);
  }

  getActives(): Observable<ApiResponse<Categorie[]>> {
    return this.apiService.get<ApiResponse<Categorie[]>>(`${this.basePath}/actives`);
  }

  getById(id: number): Observable<ApiResponse<Categorie>> {
    return this.apiService.get<ApiResponse<Categorie>>(`${this.basePath}/${id}`);
  }

  create(data: CategorieFormData): Observable<ApiResponse<Categorie>> {
    return this.apiService.post<ApiResponse<Categorie>>(this.basePath, data);
  }

  update(id: number, data: Partial<CategorieFormData>): Observable<ApiResponse<Categorie>> {
    return this.apiService.put<ApiResponse<Categorie>>(`${this.basePath}/${id}`, data);
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.apiService.delete<ApiResponse<void>>(`${this.basePath}/${id}`);
  }

  activer(id: number): Observable<ApiResponse<Categorie>> {
    return this.apiService.patch<ApiResponse<Categorie>>(`${this.basePath}/${id}/activer`);
  }

  desactiver(id: number): Observable<ApiResponse<Categorie>> {
    return this.apiService.patch<ApiResponse<Categorie>>(`${this.basePath}/${id}/desactiver`);
  }

  archiver(id: number): Observable<ApiResponse<Categorie>> {
    return this.apiService.post<ApiResponse<Categorie>>(`${this.basePath}/${id}/archiver`, {});
  }

  isSupprimable(id: number): Observable<ApiResponse<boolean>> {
    return this.apiService.get<ApiResponse<boolean>>(`${this.basePath}/${id}/supprimable`);
  }

  getTop(): Observable<ApiResponse<Categorie[]>> {
    return this.apiService.get<ApiResponse<Categorie[]>>(`${this.basePath}/top`);
  }
  getEvenementsByCategorie(id: number): Observable<any> {
    console.log('📡 Appel API:', `${this.basePath}/${id}/evenements`);
    return this.apiService.get(`${this.basePath}/${id}/evenements`);
  }
}
