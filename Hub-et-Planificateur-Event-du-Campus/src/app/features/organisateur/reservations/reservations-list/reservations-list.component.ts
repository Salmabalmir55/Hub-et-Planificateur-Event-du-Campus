import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReservationService, Reservation } from '../../../../core/services/reservation.service';

@Component({
  selector: 'app-reservations-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservations-list.component.html',
  styleUrls: ['./reservations-list.component.css']
})
export class ReservationsListComponent implements OnInit {
  reservations: Reservation[] = [];
  filteredReservations: Reservation[] = [];
  loading: boolean = true;
  error: string = '';
  searchTerm: string = '';
  filterStatut: string = 'tous';

  router = inject(Router);
  private reservationService = inject(ReservationService);

  statuts = [
    { value: 'tous', label: 'Toutes', icon: 'fa-list' },
    { value: 'en_attente', label: 'En attente', icon: 'fa-clock' },
    { value: 'confirmee', label: 'Confirmée', icon: 'fa-check-circle' },
    { value: 'annulee', label: 'Annulée', icon: 'fa-times-circle' },
    { value: 'terminee', label: 'Terminée', icon: 'fa-flag-checkered' }
  ];

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.loading = true;
    this.error = '';

    this.reservationService.getAll().subscribe({
      next: (data) => {
        console.log('Réservations chargées:', data);
        this.reservations = Array.isArray(data) ? data : [];
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.error = 'Erreur lors du chargement des réservations';
        this.reservations = [];
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.reservations];

    // Filtre par recherche
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(r =>
        r.titre?.toLowerCase().includes(term) ||
        r.salleNom?.toLowerCase().includes(term) ||
        r.organisateurNom?.toLowerCase().includes(term)
      );
    }

    // Filtre par statut
    if (this.filterStatut !== 'tous') {
      filtered = filtered.filter(r => r.statut === this.filterStatut);
    }

    this.filteredReservations = filtered;
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
    this.applyFilters();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.filterStatut = 'tous';
    this.applyFilters();
  }

  viewReservationDetail(id: number): void {
    this.router.navigate(['/organisateur/reservations', id]);
  }

  navigateToNewReservation(): void {
    this.router.navigate(['/organisateur/reservations/nouvelle']);
  }

  annulerReservation(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      this.reservationService.annuler(id).subscribe({
        next: () => {
          this.loadReservations();
        },
        error: (err) => {
          console.error('Erreur annulation:', err);
          this.error = 'Erreur lors de l\'annulation';
        }
      });
    }
  }

  getStatutClass(statut: string): string {
    const classes: Record<string, string> = {
      'confirmee': 'statut-confirmee',
      'en_attente': 'statut-attente',
      'annulee': 'statut-annulee',
      'terminee': 'statut-terminee'
    };
    return classes[statut] || '';
  }

  getStatutLabel(statut: string): string {
    const labels: Record<string, string> = {
      'confirmee': 'Confirmée',
      'en_attente': 'En attente',
      'annulee': 'Annulée',
      'terminee': 'Terminée'
    };
    return labels[statut] || statut;
  }

  formatDate(date: Date | string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR');
  }
}
