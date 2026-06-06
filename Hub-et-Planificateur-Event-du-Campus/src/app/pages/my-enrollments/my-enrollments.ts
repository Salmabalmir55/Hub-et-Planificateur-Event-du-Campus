import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { InscriptionService } from '../../core/services/inscription.service';
import { AuthService } from '../../core/services/auth.service';
import { FeedbackService } from '../../core/services/feedback.service';
import { Inscription } from '../../core/models/inscription.model';
import { FeedbackDTO } from '../../core/models/feedback.model';

interface InscriptionView {
  id: number;
  eventTitle: string;
  date: string;
  location: string;
  statutInscription: string;
  evenementId: number;
  isPast?: boolean;
  canGiveFeedback?: boolean;
  feedbackGiven?: boolean;
}

interface UserFeedback {
  event: string;
  eventId: number;
  rating: number;
  comment: string;
  date: string;
}

@Component({
  selector: 'app-my-enrollments',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-enrollments.html',
  styleUrls: ['./my-enrollments.css']
})
export class MyEnrollmentsComponent implements OnInit {
  private inscriptionService = inject(InscriptionService);
  private authService = inject(AuthService);
  private feedbackService = inject(FeedbackService);

  showModal = false;
  selectedEventTitle = '';
  selectedEventId = 0;
  mesFeedbacks: UserFeedback[] = [];
  inscriptions: InscriptionView[] = [];
  filteredInscriptions: InscriptionView[] = [];
  isLoading = true;
  errorMessage = '';
  activeFilter: 'all' | 'upcoming' | 'past' = 'all';

  get upcomingCount(): number {
    return this.inscriptions.filter(i => !i.isPast).length;
  }

  get pastCount(): number {
    return this.inscriptions.filter(i => i.isPast).length;
  }

  ngOnInit(): void {
    this.loadInscriptions();
    this.loadSavedFeedbacks();
  }

  loadInscriptions(): void {
    const user = this.authService.getUser();
    if (!user?.id) {
      this.isLoading = false;
      this.errorMessage = 'Vous devez être connecté pour voir vos inscriptions.';
      return;
    }

    this.isLoading = true;
    this.inscriptionService.getByEtudiant(user.id).subscribe({
      next: (data: Inscription[]) => {
        const today = new Date();
        this.inscriptions = data
          .filter((i) => i.statut !== 'ANNULEE')
          .map((i) => {
            const isPast = i.evenementDateDebut ? new Date(i.evenementDateDebut) < today : false;
            const feedbackGiven = this.hasFeedbackGiven(i.evenementId);
            return {
              ...this.toView(i),
              isPast,
              canGiveFeedback: isPast && !feedbackGiven,
              feedbackGiven
            };
          });
        this.applyFilter();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur chargement inscriptions:', err);
        this.errorMessage = 'Impossible de charger vos inscriptions.';
        this.isLoading = false;
      }
    });
  }

  hasFeedbackGiven(evenementId: number): boolean {
    return this.mesFeedbacks.some(f => f.eventId === evenementId);
  }

  applyFilter(): void {
    if (this.activeFilter === 'upcoming') {
      this.filteredInscriptions = this.inscriptions.filter(i => !i.isPast);
    } else if (this.activeFilter === 'past') {
      this.filteredInscriptions = this.inscriptions.filter(i => i.isPast);
    } else {
      this.filteredInscriptions = [...this.inscriptions];
    }
  }

  setFilter(filter: 'all' | 'upcoming' | 'past'): void {
    this.activeFilter = filter;
    this.applyFilter();
  }

  private toView(i: Inscription): InscriptionView {
    const dateObj = i.evenementDateDebut ? new Date(i.evenementDateDebut) : new Date();
    return {
      id: i.id,
      eventTitle: i.evenementTitre || 'Événement sans titre',
      date: dateObj.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }),
      location: i.evenementLieu || 'Lieu à définir',
      statutInscription: i.statut,
      evenementId: i.evenementId,
      isPast: false,
      canGiveFeedback: false,
      feedbackGiven: false
    };
  }

  private loadSavedFeedbacks(): void {
    const saved = localStorage.getItem('userFeedbacks');
    if (saved) {
      try {
        this.mesFeedbacks = JSON.parse(saved);
      } catch (e) {
        console.error('Erreur chargement feedbacks:', e);
        this.mesFeedbacks = [];
      }
    }
  }

  private saveFeedbacks(): void {
    localStorage.setItem('userFeedbacks', JSON.stringify(this.mesFeedbacks));
  }

  ouvrirFeedback(eventTitle: string, eventId: number): void {
    this.selectedEventTitle = eventTitle;
    this.selectedEventId = eventId;
    this.showModal = true;
  }

  // ✅ CORRECTION: Utiliser addFeedback au lieu de create
  recevoirFeedback(feedback: { eventTitle: string; rating: number; comment: string }): void {
    const feedbackDTO: FeedbackDTO = {
      evenementId: this.selectedEventId,
      note: feedback.rating,
      commentaire: feedback.comment || ''
    };

    this.feedbackService.addFeedback(feedbackDTO).subscribe({
      next: (savedFeedback: any) => {
        console.log('Feedback envoyé avec succès:', savedFeedback);

        const newFeedback: UserFeedback = {
          event: feedback.eventTitle,
          eventId: this.selectedEventId,
          rating: feedback.rating,
          comment: feedback.comment || '',
          date: new Date().toISOString()
        };

        const existingIndex = this.mesFeedbacks.findIndex(f => f.eventId === this.selectedEventId);
        if (existingIndex !== -1) {
          this.mesFeedbacks[existingIndex] = newFeedback;
        } else {
          this.mesFeedbacks.unshift(newFeedback);
        }

        this.saveFeedbacks();
        this.showModal = false;
        alert('Merci pour votre avis !');
      },
      error: (err: any) => {
        console.error('Erreur lors de l\'envoi du feedback:', err);
        if (err.status === 401) {
          alert('Veuillez vous reconnecter pour donner votre avis.');
        } else if (err.status === 409) {
          alert('Vous avez déjà donné votre avis pour cet événement.');
        } else {
          alert('Erreur lors de l\'envoi de votre avis. Veuillez réessayer.');
        }
        this.showModal = false;
      }
    });
  }

  annulerInscription(id: number): void {
    if (!confirm('Êtes-vous sûr de vouloir annuler votre inscription à cet événement ?')) {
      return;
    }

    this.inscriptionService.annuler(id).subscribe({
      next: () => {
        this.inscriptions = this.inscriptions.filter((ins) => ins.id !== id);
        this.applyFilter();
        alert('Votre inscription a été annulée avec succès.');
      },
      error: (err: any) => {
        console.error('Erreur annulation:', err);
        alert('Erreur lors de l\'annulation. Veuillez réessayer.');
      }
    });
  }

  getStatutLabel(statut: string): string {
    const statuts: { [key: string]: string } = {
      'CONFIRMEE': 'CONFIRMÉE',
      'EN_ATTENTE': 'EN ATTENTE',
      'PRESENTE': 'PRÉSENTE'
    };
    return statuts[statut] || statut;
  }

  canCancel(statut: string, isPast?: boolean): boolean {
    return statut !== 'ANNULEE' && statut !== 'PRESENTE' && !isPast;
  }

  canGiveFeedback(statut: string, eventId: number, isPast?: boolean): boolean {
    const alreadyFeedback = this.mesFeedbacks.some(f => f.eventId === eventId);
    return statut === 'CONFIRMEE' && !alreadyFeedback && isPast === true;
  }

  getAverageRating(): number {
    if (this.mesFeedbacks.length === 0) return 0;
    const sum = this.mesFeedbacks.reduce((acc, fb) => acc + fb.rating, 0);
    return Math.round(sum / this.mesFeedbacks.length * 10) / 10;
  }
}
