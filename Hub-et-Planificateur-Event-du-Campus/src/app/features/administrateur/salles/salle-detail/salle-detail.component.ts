import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SalleService, Salle } from '../../../../core/services/salle.service';

@Component({
  selector: 'app-salle-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './salle-detail.component.html',
  styleUrls: ['./salle-detail.component.css']
})
export class SalleDetailComponent implements OnInit {
  salle: Salle | null = null;
  loading: boolean = true;  // ✅ Initialisé à true
  error: string = '';

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private salleService = inject(SalleService);

  ngOnInit(): void {
    this.loadSalleDetail();
  }

  loadSalleDetail(): void {
    this.loading = true;
    this.error = '';

    const id = this.route.snapshot.paramMap.get('id');
    console.log('ID récupéré:', id);

    if (!id) {
      this.error = 'ID de salle non trouvé';
      this.loading = false;  // ✅ Important: passer loading à false
      return;
    }

    this.salleService.getById(parseInt(id)).subscribe({
      next: (data) => {
        console.log('Salle chargée:', data);
        this.salle = data;
        this.loading = false;  // ✅ CRUCIAL: passer loading à false
        console.log('loading après:', this.loading);  // ✅ Vérifier
      },
      error: (err) => {
        console.error('Erreur détail:', err);
        this.error = 'Erreur lors du chargement des détails';
        this.loading = false;  // ✅ Important aussi en erreur
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/administrateur/salles']);
  }

  editSalle(): void {
    if (this.salle) {
      this.router.navigate(['/administrateur/salles/modifier', this.salle.id]);
    }
  }

  printSalle(): void {
    window.print();
  }
}
