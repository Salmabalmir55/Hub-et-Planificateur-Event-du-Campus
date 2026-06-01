import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Interface calquée exactement sur votre UtilisateurDTO.java backend
export interface BackendUser {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: 'ORGANISATEUR' | 'ETUDIANT' | 'ADMINISTRATEUR';
  actif: boolean;
  dateInscription?: string;
  telephone?: string;
}

// Structure de votre enveloppe ApiResponseDTO du backend
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);

  // URL de votre UtilisateurController Spring Boot
  private apiUrl = 'http://localhost:8080/api/utilisateurs';

  // Récupérer les utilisateurs et extraire directement le tableau contenu dans 'data'
  getUsers(): Observable<BackendUser[]> {
    return this.http.get<ApiResponse<BackendUser[]>>(this.apiUrl).pipe(
      map(response => response.data)
    );
  }

  // Activer un utilisateur (route PUT /{id}/activer)
  activerUser(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/activer`, {});
  }

  // Désactiver un utilisateur (route PUT /{id}/desactiver)
  desactiverUser(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/desactiver`, {});
  }
}
