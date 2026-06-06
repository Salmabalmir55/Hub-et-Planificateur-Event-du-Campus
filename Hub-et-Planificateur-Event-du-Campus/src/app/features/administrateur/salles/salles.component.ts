import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalleService, Salle } from '../../../core/services/salle.service';

@Component({
  selector: 'app-salles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './salles.component.html',
  styleUrls: ['./salles.component.css']
})
export class SallesComponent implements OnInit {
  salles: Salle[] = [];  // ✅ Initialisé comme tableau vide
  filteredSalles: Salle[] = [];
  loading: boolean = true;
  error: string = '';
  searchTerm: string = '';
  filterDisponible: boolean | null = null;

  private router = inject(Router);
  private salleService = inject(SalleService);

  ngOnInit(): void {
    this.loadSalles();
  }

  loadSalles(): void {
    this.loading = true;
    this.error = '';

    this.salleService.getAll().subscribe({
      next: (data) => {
        // ✅ Vérifier si data est un tableau
        if (Array.isArray(data)) {
          this.salles = data;
        } else {
          console.error('La réponse n\'est pas un tableau:', data);
          this.salles = [];
          this.error = 'Format de données invalide';
        }
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.error = 'Erreur lors du chargement des salles';
        this.salles = [];  // ✅ Toujours un tableau
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    // ✅ Vérifier que salles est bien un tableau
    let filtered = this.salles && Array.isArray(this.salles) ? [...this.salles] : [];

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(s =>
        s.nom.toLowerCase().includes(term) ||
        s.localisation.toLowerCase().includes(term) ||
        s.type?.toLowerCase().includes(term)
      );
    }

    if (this.filterDisponible !== null) {
      filtered = filtered.filter(s => s.disponible === this.filterDisponible);
    }

    this.filteredSalles = filtered;
  }

  onSearchChange(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.filterDisponible = null;
    this.applyFilters();
  }

  navigateToCreate(): void {
    this.router.navigate(['/administrateur/salles/creer']);
  }

  navigateToEdit(id: number): void {
    this.router.navigate(['/administrateur/salles/modifier', id]);
  }

  navigateToDetail(id: number): void {
    this.router.navigate(['/administrateur/salle', id]);
  }

  toggleDisponible(salle: Salle): void {
    const action = salle.disponible
      ? this.salleService.desactiver(salle.id)
      : this.salleService.activer(salle.id);

    action.subscribe({
      next: () => {
        this.loadSalles();  // Recharger après modification
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.error = 'Erreur lors du changement de disponibilité';
      }
    });
  }

  supprimerSalle(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette salle ?')) {
      this.salleService.delete(id).subscribe({
        next: () => {
          this.loadSalles();  // Recharger après suppression
        },
        error: (err) => {
          console.error('Erreur lors de la suppression:', err);
          this.error = 'Erreur lors de la suppression';
        }
      });
    }
  }
}
