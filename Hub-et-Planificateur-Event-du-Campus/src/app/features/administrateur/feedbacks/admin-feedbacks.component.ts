// src/app/features/administrateur/feedbacks/admin-feedbacks.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeedbackService } from '../../../core/services/feedback.service';

// Interface locale
interface FeedbackItem {
  id: number;
  evenementId: number;
  evenementTitre: string;
  utilisateurId: number;
  utilisateurNom: string;
  utilisateurPrenom: string;
  note: number;
  commentaire: string;
  dateCreation: string;
  approuve: boolean;
}

@Component({
  selector: 'app-admin-feedbacks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-feedbacks.component.html',
})
export class AdminFeedbacksComponent implements OnInit {
  private feedbackService = inject(FeedbackService);

  feedbacks: FeedbackItem[] = [];
  filteredFeedbacks: FeedbackItem[] = [];
  loading = false;
  error = '';
  successMessage = '';

  searchTerm = '';
  filterNote: number = 0;
  filterApprouve: string = 'all';

  ngOnInit(): void {
    this.loadFeedbacks();
  }

  loadFeedbacks(): void {
    this.loading = true;
    this.feedbackService.getAllFeedbacks().subscribe({
      next: (data: any) => {
        let feedbacksData = data;
        if (data && data.data) {
          feedbacksData = data.data;
        }
        this.feedbacks = Array.isArray(feedbacksData) ? feedbacksData : [];
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.error = 'Impossible de charger les feedbacks';
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.feedbacks];

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(f =>
        f.evenementTitre?.toLowerCase().includes(term) ||
        f.utilisateurNom?.toLowerCase().includes(term) ||
        f.commentaire?.toLowerCase().includes(term)
      );
    }

    if (this.filterNote > 0) {
      filtered = filtered.filter(f => f.note === this.filterNote);
    }

    if (this.filterApprouve === 'approuve') {
      filtered = filtered.filter(f => f.approuve === true);
    } else if (this.filterApprouve === 'non_approuve') {
      filtered = filtered.filter(f => f.approuve === false);
    }

    this.filteredFeedbacks = filtered;
  }

  onSearch(): void {
    this.applyFilters();
  }

  onFilterNote(note: number): void {
    this.filterNote = this.filterNote === note ? 0 : note;
    this.applyFilters();
  }

  onFilterApprouve(value: string): void {
    this.filterApprouve = value;
    this.applyFilters();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.filterNote = 0;
    this.filterApprouve = 'all';
    this.applyFilters();
  }

  approuverFeedback(id: number): void {
    this.feedbackService.approuverFeedback(id).subscribe({
      next: () => {
        this.successMessage = 'Feedback approuvé avec succès';
        this.loadFeedbacks();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Erreur lors de l\'approbation';
        setTimeout(() => this.error = '', 3000);
      }
    });
  }

  deleteFeedback(id: number): void {
    if (confirm('Supprimer ce feedback ?')) {
      this.feedbackService.deleteFeedback(id).subscribe({
        next: () => {
          this.successMessage = 'Feedback supprimé avec succès';
          this.loadFeedbacks();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          this.error = err.error?.message || 'Erreur lors de la suppression';
          setTimeout(() => this.error = '', 3000);
        }
      });
    }
  }

  getNoteMoyenne(): number {
    if (this.feedbacks.length === 0) return 0;
    const sum = this.feedbacks.reduce((acc, f) => acc + f.note, 0);
    return Math.round((sum / this.feedbacks.length) * 10) / 10;
  }

  // ✅ CORRECTION : Utilisation d'un Record pour l'indexation
  getStatistiques(): {
    total: number;
    approuves: number;
    nonApprouves: number;
    parNote: Record<number, number>
  } {
    const stats = {
      total: this.feedbacks.length,
      approuves: this.feedbacks.filter(f => f.approuve).length,
      nonApprouves: this.feedbacks.filter(f => !f.approuve).length,
      parNote: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<number, number>
    };

    this.feedbacks.forEach(f => {
      const note = f.note;
      if (note >= 1 && note <= 5) {
        stats.parNote[note] = (stats.parNote[note] || 0) + 1;
      }
    });

    return stats;
  }
}
