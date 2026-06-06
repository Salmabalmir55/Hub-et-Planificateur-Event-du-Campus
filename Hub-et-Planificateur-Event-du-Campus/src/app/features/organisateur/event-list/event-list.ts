import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { EventService } from '../../../core/services/event.service';
import { Evenement } from '../../../core/models/evenement.model';

@Component({
  selector: 'app-categorie-list',
  standalone: true,
  imports: [CommonModule],  // ← IMPORTANT pour les styles
  templateUrl: './event-list.html',
  styleUrls: ['./event-list.css']  // ← Le fichier CSS doit exister
})
export class EventListComponent implements OnInit {
  private authService = inject(AuthService);
  private eventService = inject(EventService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  events: Evenement[] = [];
  filteredEvents: Evenement[] = [];
  activeTab: 'ALL' | 'EN_ATTENTE' | 'VALIDE' | 'TERMINE' = 'ALL';
  isLoading = true;

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (!user?.id) {
      this.isLoading = false;
      return;
    }

    this.eventService.getEvenementsByOrganisateur(user.id).subscribe({
      next: (data) => {
        this.events = data;
        this.applyFilter();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  setTab(tab: 'ALL' | 'EN_ATTENTE' | 'VALIDE' | 'TERMINE'): void {
    this.activeTab = tab;
    this.applyFilter();
  }

  applyFilter(): void {
    if (this.activeTab === 'ALL') {
      this.filteredEvents = this.events;
      return;
    }
    this.filteredEvents = this.events.filter((e) => e.statut === this.activeTab);
    this.cdr.detectChanges();
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  statutLabel(statut?: string): string {
    switch (statut) {
      case 'EN_ATTENTE':
        return 'En attente';
      case 'VALIDE':
        return 'Validé';
      case 'TERMINE':
        return 'Terminé';
      case 'ANNULE':
        return 'Annulé';
      default:
        return statut || '-';
    }
  }

  // Méthode pour modifier
  modifierEvenement(id: number | undefined): void {
    if (id) {
      this.router.navigate(['/organisateur/evenements/modifier', id]);
    }
  }

// Méthode pour voir les participants
  voirParticipants(id: number | undefined): void {
    if (id) {
      this.router.navigate(['/organisateur/evenements', id, 'inscrits']);
    }
  }

// Supprimer un événement
  supprimerEvenement(id: number | undefined): void {
    if (!id) return;
    if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est irréversible.')) {
      this.eventService.deleteEvenement(id).subscribe({
        next: () => {
          this.events = this.events.filter(e => e.id !== id);
          this.applyFilter();
          this.cdr.detectChanges();
          alert('Événement supprimé avec succès !');
        },
        error: (err) => {
          console.error('Erreur lors de la suppression:', err);
          alert('Erreur lors de la suppression. Veuillez réessayer.');
        }
      });
    }
    }
    }
