// src/app/features/etudiant/feedback/feedback-form.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FeedbackService } from '../../../core/services/feedback.service';
import { EventService } from '../../../core/services/event.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-feedback-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feedback-form.html',
  styleUrls: ['./feedback-form.css']
})
export class FeedbackFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private feedbackService = inject(FeedbackService);
  private eventService = inject(EventService);
  private authService = inject(AuthService);

  evenementId: number = 0;
  evenementTitre: string = '';
  note: number = 0;
  commentaire: string = '';
  hoverRating: number = 0;
  stars = [1, 2, 3, 4, 5];

  isLoading: boolean = false;
  canSubmit: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.evenementId = +id;
      this.loadEvent();
      this.checkCanLeaveFeedback();
    } else {
      this.errorMessage = 'ID d\'événement manquant';
    }
  }

  loadEvent(): void {
    this.eventService.getEventById(this.evenementId).subscribe({
      next: (event) => {
        this.evenementTitre = event.titre;
      },
      error: () => {
        this.errorMessage = 'Événement non trouvé';
      }
    });
  }

  checkCanLeaveFeedback(): void {
    this.feedbackService.canLeaveFeedback(this.evenementId).subscribe({
      next: (response: any) => {
        this.canSubmit = typeof response === 'boolean' ? response : response.data;
      },
      error: () => {
        this.canSubmit = false;
        this.errorMessage = 'Vous ne pouvez pas laisser d\'avis pour cet événement.';
      }
    });
  }

  setNote(value: number): void {
    this.note = value;
  }

  onSubmit(): void {
    if (this.note === 0) {
      this.errorMessage = 'Veuillez donner une note';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const feedbackData = {
      evenementId: this.evenementId,
      note: this.note,
      commentaire: this.commentaire
    };

    this.feedbackService.addFeedback(feedbackData).subscribe({
      next: () => {
        this.successMessage = 'Merci pour votre avis !';
        setTimeout(() => {
          this.router.navigate(['/my-enrollments']);
        }, 2000);
      },
      error: (err: any) => {
        this.errorMessage = err.error?.message || 'Erreur lors de l\'envoi';
        this.isLoading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/my-enrollments']);
  }
}
