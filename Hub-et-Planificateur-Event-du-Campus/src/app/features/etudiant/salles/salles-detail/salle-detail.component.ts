import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SalleService, Salle } from '../../../../core/services/salle.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-salle-detail',
  standalone: true,  // ✅ Si standalone
  imports: [CommonModule],  // ✅ AJOUTER CommonModule
  templateUrl: './salle-detail.component.html',
  styleUrls: []
})
export class SalleDetailComponent implements OnInit {
  salle: Salle | null = null;
  loading: boolean = true;
  error: string = '';

  private salleService = inject(SalleService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit(): void {
    this.loadSalleDetails();
  }

  loadSalleDetails(): void {
    this.loading = true;
    this.error = '';

    const salleId = this.route.snapshot.paramMap.get('id');

    if (!salleId) {
      this.error = 'ID de salle non trouvé';
      this.loading = false;
      return;
    }

    this.salleService.getById(parseInt(salleId)).subscribe({
      next: (data) => {
        this.salle = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading salle details:', err);
        this.error = 'Erreur lors du chargement des détails de la salle. Veuillez réessayer.';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/etudiant/salles']);
  }

  reserverSalle(): void {
    if (this.salle && this.salle.disponible) {
      this.router.navigate(['/etudiant/reservations/nouvelle'], {
        queryParams: { salleId: this.salle.id }
      });
    }
  }

  saveSalle(): void {
    if (this.salle) {
      this.salleService.update(this.salle.id, this.salle).subscribe({
        next: () => {
          alert('Salle modifiée avec succès !');
          this.goBack();
        },
        error: (err) => {
          console.error('Erreur lors de la sauvegarde:', err);
          this.error = 'Erreur lors de la sauvegarde de la salle.';
        }
      });
    }
  }
}
