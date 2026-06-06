// src/app/features/organisateur/feedbacks/organisateur-feedbacks.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeedbackService } from '../../../core/services/feedback.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-organisateur-feedbacks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="organisateur-feedbacks-container">
      <div class="page-header">
        <h1>📝 Avis sur mes événements</h1>
        <p class="subtitle">Consultez les retours des étudiants sur vos événements</p>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Chargement des avis...</p>
      </div>

      <!-- Liste des feedbacks -->
      <div *ngIf="!loading && feedbacks.length > 0" class="feedbacks-list">
        <div *ngFor="let feedback of feedbacks" class="feedback-card">
          <div class="feedback-header">
            <div class="feedback-user">
              <div class="user-avatar">{{ (feedback.utilisateurPrenom || feedback.utilisateurNom || 'U').charAt(0) | uppercase }}</div>
              <div>
                <div class="user-name">{{ feedback.utilisateurPrenom }} {{ feedback.utilisateurNom }}</div>
                <div class="event-name">{{ feedback.evenementTitre }}</div>
              </div>
            </div>
            <div class="feedback-meta">
              <div class="feedback-stars">
                <span *ngFor="let s of [1,2,3,4,5]" class="star" [class.filled]="s <= feedback.note">★</span>
              </div>
              <div class="feedback-date">{{ feedback.dateCreation | date:'dd/MM/yyyy' }}</div>
            </div>
          </div>
          <div class="feedback-comment">
            "{{ feedback.commentaire || 'Aucun commentaire' }}"
          </div>
        </div>
      </div>

      <!-- Aucun avis -->
      <div *ngIf="!loading && feedbacks.length === 0" class="empty-state">
        <div class="empty-icon">📭</div>
        <h3>Aucun avis</h3>
        <p>Aucun étudiant n'a encore laissé d'avis sur vos événements.</p>
      </div>
    </div>
  `,
  styles: [`
    .organisateur-feedbacks-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }
    .page-header h1 {
      font-size: 1.75rem;
      font-weight: 800;
      background: linear-gradient(135deg, #0f172a, #4f46e5);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0.5rem;
    }
    .page-header .subtitle {
      color: #64748b;
      margin-bottom: 1.5rem;
    }
    .loading-state {
      text-align: center;
      padding: 3rem;
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #e2e8f0;
      border-top-color: #4f46e5;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 1rem;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .feedbacks-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .feedback-card {
      background: white;
      border-radius: 1rem;
      padding: 1rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      transition: transform 0.2s;
    }
    .feedback-card:hover {
      transform: translateX(4px);
    }
    .feedback-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 0.5rem;
    }
    .feedback-user {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .user-avatar {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #4f46e5, #4338ca);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
    }
    .user-name {
      font-weight: 600;
      color: #0f172a;
    }
    .event-name {
      font-size: 0.75rem;
      color: #4f46e5;
    }
    .feedback-meta {
      text-align: right;
    }
    .feedback-stars {
      display: flex;
      gap: 0.2rem;
      margin-bottom: 0.25rem;
    }
    .star {
      font-size: 1rem;
      color: #cbd5e1;
    }
    .star.filled {
      color: #fbbf24;
    }
    .feedback-date {
      font-size: 0.7rem;
      color: #94a3b8;
    }
    .feedback-comment {
      padding: 0.5rem 0 0.5rem 3rem;
      color: #475569;
      font-style: italic;
      border-left: 3px solid #e2e8f0;
    }
    .empty-state {
      text-align: center;
      padding: 3rem;
      background: white;
      border-radius: 1rem;
    }
    .empty-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }
    @media (max-width: 768px) {
      .organisateur-feedbacks-container { padding: 1rem; }
      .feedback-header { flex-direction: column; align-items: flex-start; }
      .feedback-meta { text-align: left; }
      .feedback-comment { padding-left: 0; border-left: none; border-top: 1px solid #e2e8f0; padding-top: 0.75rem; }
    }
  `]
})
export class OrganisateurFeedbacksComponent implements OnInit {
  private feedbackService = inject(FeedbackService);
  private authService = inject(AuthService);

  feedbacks: any[] = [];
  loading = false;

  ngOnInit(): void {
    this.loadFeedbacks();
  }

  loadFeedbacks(): void {
    this.loading = true;
    this.feedbackService.getFeedbacksByOrganisateur().subscribe({
      next: (data: any) => {
        console.log('Feedbacks reçus:', data);
        // Gérer les différents formats de réponse
        let feedbacksData = data;
        if (data && data.data) {
          feedbacksData = data.data;
        }
        this.feedbacks = Array.isArray(feedbacksData) ? feedbacksData : [];
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Erreur:', err);
        this.feedbacks = [];
        this.loading = false;
      }
    });
  }
}
