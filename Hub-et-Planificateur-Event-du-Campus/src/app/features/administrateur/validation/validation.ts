import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Evenement } from '../../../core/models/evenement.model';
import { AdminEvent } from '../services/admin-event';

@Component({
  selector: 'app-validation',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './validation.html',
  styleUrls: ['./validation.css']
})
export class ValidationComponent implements OnInit {
  private adminEvent = inject(AdminEvent);

  pendingEvents: Evenement[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.loadPendingEvents();
  }

  loadPendingEvents(): void {
    this.adminEvent.getPendingEvents().subscribe({
      next: (data: Evenement[]) => {
        this.pendingEvents = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des événements:', err);
        this.isLoading = false;
      }
    });
  }

  changerStatut(eventId: number, statut: string): void {
    const action = statut === 'VALIDE'
      ? this.adminEvent.validerEvenement(eventId)
      : this.adminEvent.refuserEvenement(eventId);

    action.subscribe({
      next: () => {
        this.loadPendingEvents();
      },
      error: (err: any) => {
        console.error('Erreur lors du changement de statut:', err);
        alert('Erreur lors du traitement de la demande');
      }
    });
  }
}
