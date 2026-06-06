import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { EventService } from '../../../core/services/event.service';
import { Evenement, StatutEvenement } from '../../../core/models/evenement.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private eventService = inject(EventService);
  private router = inject(Router);

  events: Evenement[] = [];
  filteredEvents: Evenement[] = [];
  activeTab: 'ALL' | StatutEvenement = 'ALL';
  isLoading = true;
  apiError = false;
  errorMessage = '';

  stats = {
    total: 0,
    enAttente: 0,
    valides: 0,
    enCours: 0,
    termines: 0,
    annules: 0
  };

  ngOnInit(): void {
    const user = this.authService.getUser();
    console.log('Utilisateur connecté:', user);

    if (!user?.id) {
      console.log('⚠️ Aucun utilisateur connecté');
      this.isLoading = false;
      this.errorMessage = 'Veuillez vous connecter pour voir vos événements.';
      return;
    }

    this.loadEvents(user.id);
  }

  loadEvents(organisateurId: number): void {
    console.log('📡 Chargement des événements pour ID:', organisateurId);
    this.isLoading = true;
    this.apiError = false;
    this.errorMessage = '';

    this.eventService.getEvenementsByOrganisateur(organisateurId).subscribe({
      next: (data) => {
        console.log('✅ Événements reçus de l\'API:', data);
        if (data && data.length > 0) {
          this.events = data;
          this.apiError = false;
        } else {
          this.events = [];
          this.errorMessage = 'Aucun événement trouvé.';
        }
        this.updateStats();
        this.applyFilter();
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('❌ Erreur API:', err);

        if (err.status === 0) {
          this.errorMessage = 'Backend non accessible. Vérifiez que le serveur est démarré.';
        } else if (err.status === 401) {
          this.errorMessage = 'Non authentifié. Veuillez vous reconnecter.';
        } else if (err.status === 403) {
          this.errorMessage = 'Accès non autorisé.';
        } else if (err.status === 404) {
          this.errorMessage = 'API non trouvée.';
        } else {
          this.errorMessage = `Erreur: Impossible de charger les événements.`;
        }

        this.apiError = true;
        this.events = [];
        this.updateStats();
        this.applyFilter();
        this.isLoading = false;
      }
    });
  }

  updateStats(): void {
    this.stats = {
      total: this.events.length,
      enAttente: this.events.filter(e => e.statut === 'EN_ATTENTE').length,
      valides: this.events.filter(e => e.statut === 'VALIDE').length,
      enCours: this.events.filter(e => e.statut === 'EN_COURS').length,
      termines: this.events.filter(e => e.statut === 'TERMINE').length,
      annules: this.events.filter(e => e.statut === 'ANNULE').length
    };
  }

  setTab(tab: 'ALL' | StatutEvenement): void {
    this.activeTab = tab;
    this.applyFilter();
  }

  applyFilter(): void {
    if (this.activeTab === 'ALL') {
      this.filteredEvents = this.events;
    } else {
      this.filteredEvents = this.events.filter((e) => e.statut === this.activeTab);
    }
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return '-';
    }
  }

  statutLabel(statut?: StatutEvenement): string {
    switch (statut) {
      case 'EN_ATTENTE':
        return 'En attente';
      case 'VALIDE':
        return 'Validé';
      case 'EN_COURS':
        return 'En cours';
      case 'TERMINE':
        return 'Terminé';
      case 'ANNULE':
        return 'Annulé';
      default:
        return statut || '-';
    }
  }

  getStatutClass(statut?: StatutEvenement): string {
    switch (statut) {
      case 'EN_ATTENTE':
        return 'dot-pending';
      case 'VALIDE':
        return 'dot-success';
      case 'EN_COURS':
        return 'dot-info';
      case 'TERMINE':
        return 'dot-ended';
      case 'ANNULE':
        return 'dot-danger';
      default:
        return '';
    }
  }

  deleteEvent(id: number | undefined): void {
    if (!id) {
      alert('ID d\'événement invalide');
      return;
    }

    const eventTitle = this.events.find(e => e.id === id)?.titre || 'cet événement';

    if (confirm(`Supprimer définitivement "${eventTitle}" ? Cette action est irréversible.`)) {
      console.log('🗑️ Suppression définitive ID:', id);

      // Appel API pour suppression définitive
      this.eventService.deleteEvenement(id).subscribe({
        next: () => {
          console.log('✅ Événement supprimé définitivement:', id);
          // Supprimer localement aussi pour mise à jour immédiate
          this.events = this.events.filter(e => e.id !== id);
          this.filteredEvents = this.filteredEvents.filter(e => e.id !== id);
          this.updateStats();
          alert(`"${eventTitle}" a été supprimé définitivement`);
        },
        error: (err: any) => {
          console.error('❌ Erreur suppression:', err);

          if (err.status === 403) {
            alert('Vous n\'avez pas les droits pour supprimer cet événement.');
          } else if (err.status === 409) {
            alert('Cet événement a des participants inscrits. Supprimez d\'abord les inscriptions.');
          } else if (err.status === 404) {
            alert('Événement non trouvé.');
          } else if (err.status === 401) {
            alert('Non authentifié. Veuillez vous reconnecter.');
          } else {
            alert('Erreur lors de la suppression définitive. Veuillez réessayer.');

          }
        }
      });
    }
  }

  editEvent(id: number): void {
    this.router.navigate([`/organisateur/evenements/modifier/${id}`]);
  }

  viewAttendees(id: number): void {
    this.router.navigate([`/organisateur/evenements/${id}/inscrits`]);
  }

  retryLoadFromApi(): void {
    const user = this.authService.getUser();
    if (user?.id) {
      this.apiError = false;
      this.loadEvents(user.id);
    }
  }
}
