import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
// ⚠️ Vérifiez que ce chemin relatif pointe bien vers l'emplacement de votre fichier admin-event.ts
import { AdminEvent, Evenement } from '../services/admin-event';

@Component({
  selector: 'app-validation',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './validation.html',
  styleUrl: './validation.scss',
})
export class ValidationComponent implements OnInit {
  private eventService = inject(AdminEvent);

  pendingEvents: Evenement[] = [];
  isLoading: boolean = true;

  ngOnInit(): void {
    this.loadPendingEvents();
  }

  loadPendingEvents(): void {
    this.isLoading = true;
    this.eventService.getPendingEvents().subscribe({
      next: (events: Evenement[]) => {
        this.pendingEvents = events;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des événements', err);
        this.isLoading = false;
      }
    });
  }

  changerStatut(id: number, statut: 'VALIDE' | 'REFUSE'): void {
    this.eventService.updateEventStatus(id, statut).subscribe({
      next: () => {
        // Supprime l'événement de la liste locale pour mettre à jour l'affichage immédiatement
        this.pendingEvents = this.pendingEvents.filter(e => e.id !== id);
        alert(`L'événement a été ${statut === 'VALIDE' ? 'approuvé' : 'refusé'} avec succès !`);
      },
      error: (err: any) => {
        console.error('Erreur lors de la mise à jour du statut', err);
        alert('Une erreur est survenue lors du traitement.');
      }
    });
  }
}
