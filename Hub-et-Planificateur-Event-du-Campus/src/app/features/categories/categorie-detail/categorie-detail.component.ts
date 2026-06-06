// src/app/features/categories/categorie-detail/categorie-detail.component.ts

import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CategorieService } from '../../../core/services/categorie.service';
import { AuthService } from '../../../core/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-categorie-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categorie-detail.component.html',
  styleUrls: ['./categorie-detail.component.css']
})
export class CategorieDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private categorieService = inject(CategorieService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);  // ← AJOUTER ICI

  categorie: any = null;
  evenements: any[] = [];
  loading = false;
  error = '';
  userRole: string = '';
  private paramSubscription: Subscription | null = null;
  private currentId: number = 0;

  ngOnInit(): void {
    this.userRole = this.authService.getRole() || '';

    this.paramSubscription = this.route.params.subscribe(params => {
      const id = params['id'];
      console.log('=== CATEGORIE DETAIL ===');
      console.log('ID récupéré:', id);

      if (id) {
        this.currentId = id;
        this.loadAllData(id);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.paramSubscription) {
      this.paramSubscription.unsubscribe();
    }
  }

  loadAllData(id: number): void {
    this.loading = true;
    this.error = '';
    this.categorie = null;
    this.evenements = [];
    this.cdr.detectChanges();  // ← FORCER LA MISE À JOUR

    console.log('Chargement des données pour ID:', id);

    this.categorieService.getById(id).subscribe({
      next: (res) => {
        console.log('✅ Catégorie reçue:', res);
        this.categorie = res.data;
        this.cdr.detectChanges();  // ← FORCER LA MISE À JOUR
        this.loadEvenements(id);
      },
      error: (err) => {
        console.error('❌ Erreur catégorie:', err);
        this.error = err.message || 'Erreur de chargement';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadEvenements(id: number): void {
    console.log('Chargement événements pour ID:', id);

    this.categorieService.getEvenementsByCategorie(id).subscribe({
      next: (res) => {
        console.log('✅ Réponse API brute:', res);

        let events = [];
        if (res && res.data) {
          events = Array.isArray(res.data) ? res.data : [];
        } else if (res && Array.isArray(res)) {
          events = res;
        }

        this.evenements = events;
        console.log('📊 Nombre événements:', this.evenements.length);

        // Afficher le premier événement pour debug
        if (this.evenements.length > 0) {
          console.log('🔍 Premier événement:', JSON.stringify(this.evenements[0], null, 2));
        }

        this.loading = false;
        this.cdr.detectChanges();  // ← FORCER LA MISE À JOUR (TRÈS IMPORTANT)
      },
      error: (err) => {
        console.error('❌ Erreur événements:', err);
        this.evenements = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  goToEvent(id: number): void {
    this.router.navigate(['/event', id]);
  }

  goBack(): void {
    if (this.userRole === 'ROLE_ADMIN') {
      this.router.navigate(['/administrateur/categories']);
    } else if (this.userRole === 'ROLE_ORGANISATEUR') {
      this.router.navigate(['/organisateur/categories']);
    } else {
      this.router.navigate(['/categories']);
    }
  }
}
