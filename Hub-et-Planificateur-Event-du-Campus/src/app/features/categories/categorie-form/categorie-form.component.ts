// src/app/features/categories/components/categorie-form/categorie-form.component.ts

import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Categorie, CategorieFormData } from '../../../core/models/categorie.model';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-categorie-form',
  standalone: true,  // ← AJOUTER
  imports: [CommonModule],  // ← AJOUTER
  templateUrl: './categorie-form.component.html'
})
export class CategorieFormComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() initialData: Categorie | null = null;
  @Input() title = 'Nouvelle catégorie';
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<CategorieFormData>();

  formData: CategorieFormData = {
    nom: '',
    description: '',
    couleur: '#3B82F6',
    icone: '📁',
    type: '',
    active: true
  };

  loading = false;
  submitted = false;

  couleurs: string[] = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'];
  icones: string[] = ['📁', '🎯', '🎨', '💼', '🎓', '🏆', '🎭', '📚', '⚽', '🎵'];

  types: { value: string; label: string }[] = [
    { value: '', label: 'Non défini' },
    { value: 'PROFESSIONNEL', label: 'Professionnel' },
    { value: 'LOISIR', label: 'Loisir' },
    { value: 'CULTUREL', label: 'Culturel' },
    { value: 'EDUCATIF', label: 'Éducatif' },
    { value: 'AUTRE', label: 'Autre' }
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialData'] && this.initialData) {
      this.formData = {
        nom: this.initialData.nom?.replace('[ARCHIVE] ', '') || '',
        description: this.initialData.description || '',
        couleur: this.initialData.couleur || '#3B82F6',
        icone: this.initialData.icone || '📁',
        type: this.initialData.type || '',
        active: this.initialData.active
      };
    }
  }

  // ========== MÉTHODES AJOUTÉES ==========

  selectCouleur(color: string): void {
    this.formData.couleur = color;
  }

  selectIcone(icon: string): void {
    this.formData.icone = icon;
  }

  save(nom: string, type: string, description: string, couleur: string, active: boolean): void {
    this.submitted = true;

    if (!nom) return;

    this.formData.nom = nom;
    this.formData.type = type;
    this.formData.description = description;
    this.formData.couleur = couleur;
    this.formData.active = active;

    this.loading = true;
    this.submit.emit(this.formData);
  }

  onClose(): void {
    this.close.emit();
  }
}
