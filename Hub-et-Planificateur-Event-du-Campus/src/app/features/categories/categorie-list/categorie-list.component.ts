// src/app/features/categories/categorie-list/categorie-list.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CategorieService } from '../../../core/services/categorie.service';
import { Categorie, CategorieFormData } from '../../../core/models/categorie.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-categorie-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categorie-list.component.html',
  styleUrls: ['./categorie-list.component.css']
})
export class CategorieListComponent implements OnInit {
  categories: Categorie[] = [];
  filteredCategories: Categorie[] = [];
  evenements: any[] = [];
  loading = false;
  error: string | null = null;

  isModalOpen = false;
  editingCategorie: Categorie | null = null;
  filterType: 'all' | 'active' | 'inactive' = 'all';
  searchTerm = '';
  successMessage = '';
  currentPage = 0;
  pageSize = 9;
  totalElements = 0;

  // ✅ Ajouter cette propriété pour vérifier si l'utilisateur est admin
  isAdmin: boolean = false;
  isOrganisateur: boolean = false;
  isEtudiant: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categorieService: CategorieService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.checkUserRole();  // ✅ Vérifier le rôle
    this.loadCategories();
  }

  // ✅ Méthode pour vérifier le rôle de l'utilisateur
  checkUserRole(): void {
    const role = this.authService.getRole();
    this.isAdmin = role === 'ROLE_ADMIN' || role === 'ADMIN';
    this.isOrganisateur = role === 'ROLE_ORGANISATEUR' || role === 'ORGANISATEUR';
    this.isEtudiant = role === 'ROLE_ETUDIANT' || role === 'ETUDIANT';

    console.log('👤 Rôle utilisateur:', role);
    console.log('📋 isAdmin:', this.isAdmin);
  }

  loadCategories(): void {
    this.loading = true;
    this.categorieService.getAll().subscribe({
      next: (response) => {
        this.categories = response.data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Erreur de chargement';
        this.loading = false;
      }
    });
  }

  loadEvenementsByCategorie(id: number): void {
    this.loading = true;
    this.categorieService.getEvenementsByCategorie(id).subscribe({
      next: (res) => {
        this.evenements = res.data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  voirEvenements(categorie: Categorie): void {
    const userRole = this.authService.getRole();
    const timestamp = new Date().getTime();

    let url = '';
    if (userRole === 'ROLE_ADMIN') {
      url = '/administrateur/categorie/' + categorie.id + '/evenements?t=' + timestamp;
    } else if (userRole === 'ROLE_ORGANISATEUR') {
      url = '/organisateur/categorie/' + categorie.id + '/evenements?t=' + timestamp;
    } else {
      url = '/categorie/' + categorie.id + '/evenements?t=' + timestamp;
    }

    console.log('Navigation vers:', url);
    this.router.navigateByUrl(url);
  }

  goToEvent(id: number): void {
    this.router.navigate(['/event', id]);
  }

  back(): void {
    this.router.navigate(['/administrateur/categories']);
  }

  applyFilters(): void {
    let filtered = [...this.categories];

    if (this.filterType === 'active') {
      filtered = filtered.filter(c => c.active);
    } else if (this.filterType === 'inactive') {
      filtered = filtered.filter(c => !c.active);
    }

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(c =>
        c.nom.toLowerCase().includes(term) ||
        c.description?.toLowerCase().includes(term)
      );
    }

    this.totalElements = filtered.length;
    const start = this.currentPage * this.pageSize;
    this.filteredCategories = filtered.slice(start, start + this.pageSize);
  }

  onSearch(): void {
    this.currentPage = 0;
    this.applyFilters();
  }

  onFilterChange(type: 'all' | 'active' | 'inactive'): void {
    this.filterType = type;
    this.currentPage = 0;
    this.applyFilters();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.applyFilters();
  }

  // ✅ Ces méthodes ne sont accessibles que pour l'admin (dans le HTML)
  openCreateModal(): void {
    if (!this.isAdmin) return;
    this.editingCategorie = null;
    this.isModalOpen = true;
  }

  openEditModal(categorie: Categorie): void {
    if (!this.isAdmin) return;
    this.editingCategorie = categorie;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.editingCategorie = null;
  }

  handleSubmit(formData: CategorieFormData): void {
    if (!this.isAdmin) return;

    if (this.editingCategorie) {
      this.categorieService.update(this.editingCategorie.id, formData).subscribe({
        next: () => {
          this.successMessage = 'Catégorie modifiée avec succès !';
          this.loadCategories();
          this.closeModal();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          this.error = err.error?.message || 'Erreur lors de la modification';
          setTimeout(() => this.error = '', 5000);
        }
      });
    } else {
      this.categorieService.create(formData).subscribe({
        next: () => {
          this.successMessage = 'Catégorie créée avec succès !';
          this.loadCategories();
          this.closeModal();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          this.error = err.error?.message || 'Erreur lors de la création';
          setTimeout(() => this.error = '', 5000);
        }
      });
    }
  }

  handleToggleActive(categorie: Categorie): void {
    if (!this.isAdmin) return;

    console.log('Toggle appelé pour:', categorie.nom, 'actif:', categorie.active);

    const action = categorie.active ?
      this.categorieService.desactiver(categorie.id) :
      this.categorieService.activer(categorie.id);

    action.subscribe({
      next: (response) => {
        console.log('Succès:', response);
        this.successMessage = `Catégorie ${categorie.active ? 'désactivée' : 'activée'} avec succès !`;
        this.loadCategories();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.error = err.error?.message || 'Erreur lors de l\'opération';
        setTimeout(() => this.error = '', 5000);
      }
    });
  }

  handleDelete(categorie: Categorie): void {
    if (!this.isAdmin) return;

    if (confirm(`Supprimer la catégorie "${categorie.nom}" ?`)) {
      this.categorieService.delete(categorie.id).subscribe({
        next: () => {
          this.successMessage = `Catégorie "${categorie.nom}" supprimée avec succès !`;
          this.loadCategories();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          this.error = err.error?.message || 'Erreur lors de la suppression';
          setTimeout(() => this.error = '', 5000);
        }
      });
    }
  }

  handleArchive(categorie: Categorie): void {
    if (!this.isAdmin) return;

    if (confirm(`Archiver la catégorie "${categorie.nom}" ?`)) {
      this.categorieService.archiver(categorie.id).subscribe({
        next: () => {
          this.successMessage = `Catégorie "${categorie.nom}" archivée avec succès !`;
          this.loadCategories();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          this.error = err.error?.message || 'Erreur lors de l\'archivage';
          setTimeout(() => this.error = '', 5000);
        }
      });
    }
  }

  getStats(): { total: number; active: number; inactive: number; totalEvents: number } {
    return {
      total: this.categories.length,
      active: this.categories.filter(c => c.active && !c.nom?.startsWith('[ARCHIVE]')).length,
      inactive: this.categories.filter(c => !c.active).length,
      totalEvents: this.categories.reduce((sum, c) => sum + (c.nombreEvenements || 0), 0)
    };
  }

  getTotalPages(): number {
    return Math.ceil(this.totalElements / this.pageSize);
  }

  saveCategorie(nom: string, description: string, couleur: string, icone: string = '📁'): void {
    if (!this.isAdmin) return;
    if (!nom) return;

    const formData: CategorieFormData = {
      nom: nom,
      description: description,
      couleur: couleur,
      icone: icone,
      type: this.editingCategorie?.type || '',
      active: this.editingCategorie?.active ?? true
    };

    this.handleSubmit(formData);
  }
}
