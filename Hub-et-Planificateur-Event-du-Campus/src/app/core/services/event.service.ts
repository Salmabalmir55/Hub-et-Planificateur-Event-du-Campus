import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map , tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Evenement } from '../models/evenement.model';
import {Categorie} from '../models/categorie.model';

@Injectable({ providedIn: 'root' })
export class EventService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/evenements`;

  // Récupérer tous les événements
  getAllEvenements(): Observable<Evenement[]> {
    return this.http.get<ApiResponse<Evenement[]>>(this.apiUrl)
      .pipe(map(response => response.data));
  }

  // Récupérer un événement par ID
  getEventById(id: number): Observable<Evenement> {
    return this.http.get<ApiResponse<Evenement>>(`${this.apiUrl}/${id}`)
      .pipe(map(response => response.data));
  }

  // Récupérer les événements par statut (APPROUVE, EN_ATTENTE, REJETE)
  getEvenementsByStatut(statut: string): Observable<Evenement[]> {
    return this.http.get<ApiResponse<Evenement[]>>(`${this.apiUrl}/statut/${statut}`)
      .pipe(map(response => response.data));
  }

  // Récupérer les événements approuvés (pour le catalogue)
  getEvenementsApprouves(): Observable<Evenement[]> {
    return this.getEvenementsByStatut('APPROUVE');
  }

  // Récupérer les événements en attente (pour admin)
  getEvenementsEnAttente(): Observable<Evenement[]> {
    return this.getEvenementsByStatut('EN_ATTENTE');
  }

  // Récupérer les événements par organisateur
  getEvenementsByOrganisateur(organisateurId: number): Observable<Evenement[]> {
    return this.http.get<ApiResponse<Evenement[]>>(`${this.apiUrl}/organisateur/${organisateurId}`)
      .pipe(map(response => response.data));
  }

  // Récupérer les événements par catégorie
  getEvenementsByCategorie(categorieId: number): Observable<Evenement[]> {
    return this.http.get<ApiResponse<Evenement[]>>(`${this.apiUrl}/categorie/${categorieId}`)
      .pipe(map(response => response.data));
  }

  // Récupérer les événements à venir
  getEvenementsAVenir(): Observable<Evenement[]> {
    return this.http.get<ApiResponse<Evenement[]>>(`${this.apiUrl}/a-venir`)
      .pipe(map(response => response.data));
  }

  // Récupérer les événements passés
  getEvenementsPasses(): Observable<Evenement[]> {
    return this.http.get<ApiResponse<Evenement[]>>(`${this.apiUrl}/passes`)
      .pipe(map(response => response.data));
  }

  // Récupérer les événements en cours
  getEvenementsEnCours(): Observable<Evenement[]> {
    return this.http.get<ApiResponse<Evenement[]>>(`${this.apiUrl}/en-cours`)
      .pipe(map(response => response.data));
  }

  // Créer un événement
  createEvenement(eventData: Partial<Evenement>): Observable<Evenement> {
    return this.http.post<ApiResponse<Evenement>>(this.apiUrl, eventData)
      .pipe(map(response => response.data));
  }

  // Mettre à jour un événement
  updateEvenement(id: number, eventData: Partial<Evenement>): Observable<Evenement> {
    return this.http.put<ApiResponse<Evenement>>(`${this.apiUrl}/${id}`, eventData)
      .pipe(map(response => response.data));
  }

  // Valider un événement (admin)
  validerEvenement(id: number): Observable<Evenement> {
    return this.http.put<ApiResponse<Evenement>>(`${this.apiUrl}/${id}/valider`, {})
      .pipe(map(response => response.data));
  }

  // Refuser un événement (admin)
  refuserEvenement(id: number): Observable<Evenement> {
    return this.http.put<ApiResponse<Evenement>>(`${this.apiUrl}/${id}/refuser`, {})
      .pipe(map(response => response.data));
  }

  // Annuler un événement
  annulerEvenement(id: number): Observable<Evenement> {
    return this.http.put<ApiResponse<Evenement>>(`${this.apiUrl}/${id}/annuler`, {})
      .pipe(map(response => response.data));
  }

// Supprimer un événement (admin ET organisateur)
  deleteEvenement(id: number): Observable<void> {
    console.log('🗑️ DELETE request:', `${this.apiUrl}/${id}`);

    // Récupérer l'utilisateur connecté
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const role = user?.role;

    // Vérifier les droits
    if (role !== 'ROLE_ADMIN' && role !== 'ROLE_ORGANISATEUR' && role !== 'ADMIN' && role !== 'ORGANISATEUR') {
      console.error('❌ Droits insuffisants pour supprimer');
      throw new Error('Vous n\'avez pas les droits pour supprimer un événement');
    }

    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(() => console.log('✅ Supprimé du serveur par:', role)),
        map(() => undefined)
      );
  }

  // Filtrer les événements avec paramètres
  filterEvenements(params: {
    statut?: string;
    categorieId?: number;
    dateDebut?: string;
    dateFin?: string;
    search?: string;
  }): Observable<Evenement[]> {
    let httpParams = new HttpParams();

    if (params.statut) httpParams = httpParams.set('statut', params.statut);
    if (params.categorieId) httpParams = httpParams.set('categorieId', params.categorieId.toString());
    if (params.dateDebut) httpParams = httpParams.set('dateDebut', params.dateDebut);
    if (params.dateFin) httpParams = httpParams.set('dateFin', params.dateFin);
    if (params.search) httpParams = httpParams.set('search', params.search);

    return this.http.get<ApiResponse<Evenement[]>>(`${this.apiUrl}/filter`, { params: httpParams })
      .pipe(map(response => response.data));
  }
  // Récupérer toutes les catégories
  getAllCategories(): Observable<Categorie[]> {
    return this.http.get<ApiResponse<Categorie[]>>(`${this.apiUrl}/categories`)
      .pipe(map(response => response.data));
  }
}
