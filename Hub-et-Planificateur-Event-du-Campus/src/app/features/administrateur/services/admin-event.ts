import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { Evenement } from '../../../core/models/evenement.model';

@Injectable({ providedIn: 'root' })
export class AdminEvent {
  private http = inject(HttpClient);
  private adminUrl = `${environment.apiUrl}/admin`;

  getPendingEvents(): Observable<Evenement[]> {
    return this.http
      .get<ApiResponse<Evenement[]>>(`${this.adminUrl}/evenements/en-attente`)
      .pipe(map((r) => r.data));
  }

  validerEvenement(id: number): Observable<Evenement> {
    return this.http
      .put<ApiResponse<Evenement>>(`${this.adminUrl}/evenements/${id}/valider`, {})
      .pipe(map((r) => r.data));
  }

  refuserEvenement(id: number): Observable<Evenement> {
    return this.http
      .put<ApiResponse<Evenement>>(`${this.adminUrl}/evenements/${id}/refuser`, {})
      .pipe(map((r) => r.data));
  }
}
