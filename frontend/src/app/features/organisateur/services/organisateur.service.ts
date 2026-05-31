import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evenement } from '../../../shared/models/evenement.model';

@Injectable({
  providedIn: 'root'
})
export class OrganisateurService {
  private http = inject(HttpClient);
  // URL de votre contrôleur Spring Boot (ex: @RequestMapping("/api/organisateur/evenements"))
  private apiUrl = 'http://localhost:8080/api/organisateur/evenements';

  creerEvenement(evenement: Evenement): Observable<Evenement> {
    return this.http.post<Evenement>(this.apiUrl, evenement);
  }

  // Exemple pour récupérer les catégories, salles et ressources pour les sélecteurs du formulaire
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/api/categories');
  }

  getSalles(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/api/salles');
  }
}
