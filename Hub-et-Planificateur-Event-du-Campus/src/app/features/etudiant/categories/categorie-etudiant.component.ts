// src/app/features/etudiant/categories/categorie-etudiant.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // ← AJOUTER CET IMPORT
import { RouterModule } from '@angular/router';
import { CategorieService } from '../../../core/services/categorie.service';

@Component({
  selector: 'app-categorie-etudiant',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],  // ← AJOUTER FormsModule ICI
  templateUrl: './categorie-etudiant.component.html',
  styleUrls: ['./categorie-etudiant.component.css']
})
export class CategorieEtudiantComponent implements OnInit {
  categories: any[] = [];
  filteredCategories: any[] = [];
  loading = false;
  error = '';
  searchTerm = '';

  constructor(private categorieService: CategorieService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.categorieService.getActives().subscribe({
      next: (res) => {
        this.categories = res.data;
        this.filteredCategories = [...this.categories];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur de chargement';
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredCategories = this.categories.filter(cat =>
      cat.nom.toLowerCase().includes(term) ||
      (cat.description && cat.description.toLowerCase().includes(term))
    );
  }

  getNombreEvenements(cat: any): number {
    return cat.nombreEvenements || 0;
  }
}
