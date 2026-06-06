import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SalleService, Salle } from '../../../../core/services/salle.service';
import { CommonModule } from '@angular/common';  // ✅ AJOUTER

@Component({
  selector: 'app-salles-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './salles-list.component.html',
  styleUrls: ['./salles-list.component.css']
})
export class SallesListComponent implements OnInit {
  salles: Salle[] = [];
  loading: boolean = true;
  error: string = '';
  searchTerm: string = '';
  filterDisponible: boolean | null = null;

  private salleService = inject(SalleService);
  private router = inject(Router);

  ngOnInit(): void {
    this.loadSalles();
  }

  loadSalles(): void {
    this.loading = true;
    this.error = '';

    this.salleService.getAll().subscribe({
      next: (data) => {
        this.salles = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading salles:', err);
        this.error = 'Erreur lors du chargement des salles.';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/etudiant/dashboard']);
  }

  viewSalleDetails(id: number): void {
    this.router.navigate(['/etudiant/salles', id]);
  }

  reserverSalle(salle: Salle): void {
    if (salle.disponible) {
      this.router.navigate(['/etudiant/reservations/nouvelle'], {
        queryParams: { salleId: salle.id }
      });
    }
  }

  get filteredSalles(): Salle[] {
    let filtered = this.salles;

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(salle =>
        salle.nom.toLowerCase().includes(term) ||
        salle.localisation?.toLowerCase().includes(term)
      );
    }

    if (this.filterDisponible !== null) {
      filtered = filtered.filter(salle => salle.disponible === this.filterDisponible);
    }

    return filtered;
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.filterDisponible = null;
  }
}
