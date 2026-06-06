// src/app/pages/event-detail/event-detail.ts

import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EventService } from '../../core/services/event.service';
import { InscriptionService } from '../../core/services/inscription.service';
import { AuthService } from '../../core/services/auth.service';
import { FeedbackService } from '../../core/services/feedback.service';
import { Evenement } from '../../core/models/evenement.model';

// Interface Feedback
interface Feedback {
  id: number;
  evenementId: number;
  evenementTitre?: string;
  utilisateurId: number;
  utilisateurNom?: string;
  utilisateurPrenom?: string;
  note: number;
  commentaire: string;
  dateCreation: string;
  approuve: boolean;
}

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './event-detail.html',
  styleUrls: ['./event-detail.css']
})
export class EventDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private eventService = inject(EventService);
  private inscriptionService = inject(InscriptionService);
  private authService = inject(AuthService);
  private feedbackService = inject(FeedbackService);
  private cdr = inject(ChangeDetectorRef);

  eventId: number | null = null;
  isLoading = true;
  errorMessage = '';
  successMessage = '';

  // Propriétés pour les feedbacks
  isPast: boolean = false;
  userHasGivenFeedback: boolean = false;
  feedbacks: Feedback[] = [];
  averageRating: number = 0;
  newRating: number = 0;
  hoverRating: number = 0;
  newComment: string = '';
  isSubmittingFeedback: boolean = false;
  feedbackSuccessMessage: string = '';
  feedbackErrorMessage: string = '';
  stars = [1, 2, 3, 4, 5];
  userRole: string = '';

  event: {
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    imageUrl: string;
    placesRestantes: number;
    capaciteMax: number;
    price: string;
    organizer: string;
    statut: string;
  } = {
    id: 0,
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    imageUrl: '',
    placesRestantes: 0,
    capaciteMax: 0,
    price: 'Gratuit',
    organizer: '',
    statut: ''
  };

  ngOnInit(): void {
    this.userRole = this.authService.getRole() || '';
    console.log('=== EventDetail ngOnInit ===');

    const idParam = this.route.snapshot.paramMap.get('id');
    console.log('idParam:', idParam);
    this.eventId = idParam ? Number(idParam) : null;
    console.log('eventId:', this.eventId);

    if (this.eventId && !isNaN(this.eventId)) {
      this.loadEvent(this.eventId);
      this.loadFeedbacks(this.eventId);
    } else {
      this.isLoading = false;
      this.errorMessage = 'ID d\'événement invalide';
      this.cdr.detectChanges();
    }
  }

  loadEvent(id: number): void {
    console.log('Chargement événement ID:', id);
    this.isLoading = true;
    this.cdr.detectChanges();

    this.eventService.getEventById(id).subscribe({
      next: (e: Evenement) => {
        console.log('Événement reçu:', e);

        if (!e) {
          this.errorMessage = 'Événement non trouvé';
          this.isLoading = false;
          return;
        }

        const debut = e.dateDebut ? new Date(e.dateDebut) : new Date();
        const fin = e.dateFin ? new Date(e.dateFin) : debut;
        const today = new Date();

        this.isPast = fin < today;

        this.event = {
          id: e.id!,
          title: e.titre || 'Sans titre',
          description: e.description || 'Aucune description disponible.',
          date: debut.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }),
          time: `${debut.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - ${fin.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
          location: e.lieu || 'Lieu à définir',
          imageUrl: e.imageUrl || '',
          placesRestantes: e.capaciteMax || 0,
          capaciteMax: e.capaciteMax || 0,
          price: this.getPriceLabel(e),
          organizer: e.organisateurNom || 'Organisateur Campus',
          statut: e.statut || 'EN_ATTENTE'
        };

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur chargement:', err);
        this.errorMessage = 'Impossible de charger les détails de l\'événement.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadFeedbacks(eventId: number): void {
    console.log('Chargement des avis pour ID:', eventId);

    this.feedbackService.getFeedbacksByEvenement(eventId).subscribe({
      next: (response: any) => {
        console.log('Réponse brute feedbacks:', response);

        // ✅ Extraction correcte des données
        let feedbacksData = response;
        if (response && response.data) {
          feedbacksData = response.data;
        }

        this.feedbacks = Array.isArray(feedbacksData) ? feedbacksData : [];
        console.log('Avis chargés:', this.feedbacks.length);

        this.calculateAverageRating();
        this.checkIfUserHasGivenFeedback();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur chargement avis:', err);
        this.feedbacks = [];
        this.cdr.detectChanges();
      }
    });
  }

  calculateAverageRating(): void {
    if (this.feedbacks.length === 0) {
      this.averageRating = 0;
      return;
    }
    const sum = this.feedbacks.reduce((acc, fb) => acc + (fb.note || 0), 0);
    this.averageRating = sum / this.feedbacks.length;
  }

  checkIfUserHasGivenFeedback(): void {
    const userId = this.authService.getUserId();
    if (userId && this.feedbacks.length > 0) {
      this.userHasGivenFeedback = this.feedbacks.some(fb => fb.utilisateurId === userId);
    }
  }

  setRating(rating: number): void {
    this.newRating = rating;
  }

  submitFeedback(): void {
    if (this.newRating === 0) {
      this.feedbackErrorMessage = 'Veuillez sélectionner une note.';
      return;
    }

    this.isSubmittingFeedback = true;
    this.feedbackErrorMessage = '';
    this.feedbackSuccessMessage = '';

    const feedbackData = {
      evenementId: this.eventId!,
      note: this.newRating,
      commentaire: this.newComment || ''
    };

    console.log('Envoi feedback:', feedbackData);

    this.feedbackService.addFeedback(feedbackData).subscribe({
      next: (response: any) => {
        console.log('Feedback créé:', response);
        this.feedbackSuccessMessage = 'Merci pour votre avis !';
        this.userHasGivenFeedback = true;
        this.newRating = 0;
        this.newComment = '';
        this.loadFeedbacks(this.eventId!);

        setTimeout(() => {
          this.feedbackSuccessMessage = '';
          this.cdr.detectChanges();
        }, 3000);

        this.isSubmittingFeedback = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur feedback:', err);
        this.feedbackErrorMessage = err.error?.message || 'Erreur lors de l\'envoi';
        this.isSubmittingFeedback = false;
        this.cdr.detectChanges();
      }
    });
  }

  approuverFeedback(feedbackId: number): void {
    this.feedbackService.approuverFeedback(feedbackId).subscribe({
      next: () => {
        this.successMessage = 'Feedback approuvé avec succès';
        this.loadFeedbacks(this.eventId!);
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erreur lors de l\'approbation';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  private getPriceLabel(e: Evenement): string {
    const placesRestantes = e.capaciteMax || 0;
    if (placesRestantes === 0) {
      return 'Complet';
    } else if (placesRestantes <= 5) {
      return 'Dernières places !';
    }
    return 'Gratuit';
  }

  sinscrireEvenement(): void {
    console.log('Tentative inscription');

    if (!this.authService.isLoggedIn()) {
      this.errorMessage = 'Vous devez être connecté pour vous inscrire.';
      return;
    }

    if (!this.authService.isEtudiant()) {
      this.errorMessage = 'Seuls les étudiants peuvent s\'inscrire.';
      return;
    }

    if (!this.eventId) {
      this.errorMessage = 'ID d\'événement invalide.';
      return;
    }

    if (this.event.placesRestantes <= 0) {
      this.errorMessage = 'Cet événement est complet.';
      return;
    }

    if (this.event.statut !== 'VALIDE') {
      this.errorMessage = 'Cet événement n\'est pas encore validé.';
      return;
    }

    const user = this.authService.getUser();
    if (!user) {
      this.errorMessage = 'Utilisateur non trouvé.';
      return;
    }

    this.inscriptionService.inscrire(user.id, this.eventId).subscribe({
      next: () => {
        this.successMessage = '✅ Inscription réussie !';
        if (this.event.placesRestantes > 0) {
          this.event.placesRestantes--;
        }
        this.cdr.detectChanges();
        setTimeout(() => this.successMessage = '', 5000);
      },
      error: (err) => {
        console.error('Erreur inscription:', err);
        this.errorMessage = err.error?.message || 'Impossible de vous inscrire.';
        setTimeout(() => this.errorMessage = '', 5000);
      }
    });
  }
}
