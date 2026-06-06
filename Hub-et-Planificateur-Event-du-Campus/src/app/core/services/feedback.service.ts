// src/app/core/services/feedback.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/feedbacks`;

  /**
   * Récupérer tous les feedbacks (admin)
   */
  getAllFeedbacks(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  /**
   * Récupérer les feedbacks d'un événement
   */
  getFeedbacksByEvenement(evenementId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/evenement/${evenementId}`);
  }

  /**
   * Récupérer les feedbacks des événements de l'organisateur connecté
   */
  getFeedbacksByOrganisateur(): Observable<any> {
    return this.http.get(`${this.baseUrl}/organisateur`);
  }

  /**
   * Récupérer les feedbacks de l'étudiant connecté
   */
  getMesFeedbacks(): Observable<any> {
    return this.http.get(`${this.baseUrl}/me`);
  }

  /**
   * Vérifier si l'étudiant peut laisser un avis
   */
  canLeaveFeedback(evenementId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/can-leave/${evenementId}`);
  }

  /**
   * Ajouter un feedback
   */
  addFeedback(feedback: any): Observable<any> {
    return this.http.post(this.baseUrl, feedback);
  }

  /**
   * Approuver un feedback (admin)
   */
  approuverFeedback(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/approuver`, {});
  }

  /**
   * Supprimer un feedback
   */
  deleteFeedback(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
