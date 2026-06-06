// src/app/features/categories/components/categorie-card/categorie-card.component.ts

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Categorie } from '../../../core/models/categorie.model';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-categorie-card',
  standalone: true,  // ← AJOUTER
  imports: [CommonModule],  // ← AJOUTER
  templateUrl: './categorie-card.component.html',
  styleUrls: ['./categorie-card.component.css']
})
export class CategorieCardComponent {
  @Input() categorie!: Categorie;
  @Output() edit = new EventEmitter<Categorie>();
  @Output() delete = new EventEmitter<Categorie>();
  @Output() toggleActive = new EventEmitter<Categorie>();
  @Output() archive = new EventEmitter<Categorie>();

  getStatusInfo(): { text: string; color: string; bgColor: string } {
    if (!this.categorie.active) {
      return { text: 'Inactive', color: 'text-gray-600', bgColor: 'bg-gray-100' };
    }
    if (this.categorie.nom?.startsWith('[ARCHIVE]')) {
      return { text: 'Archivée', color: 'text-orange-600', bgColor: 'bg-orange-100' };
    }
    return { text: 'Active', color: 'text-green-600', bgColor: 'bg-green-100' };
  }

  getDisplayName(): string {
    return this.categorie.nom?.replace('[ARCHIVE] ', '') || this.categorie.nom;
  }

  getShortDescription(): string {
    const desc = this.categorie.description || 'Aucune description';
    return desc.length > 80 ? desc.substring(0, 80) + '...' : desc;
  }

  onEdit(): void {
    this.edit.emit(this.categorie);
  }

  onDelete(): void {
    if (confirm(`Supprimer la catégorie "${this.getDisplayName()}" ?`)) {
      this.delete.emit(this.categorie);
    }
  }

  onToggleActive(): void {
    const action = this.categorie.active ? 'désactiver' : 'activer';
    if (confirm(`Voulez-vous ${action} la catégorie "${this.getDisplayName()}" ?`)) {
      this.toggleActive.emit(this.categorie);
    }
  }

  onArchive(): void {
    if (confirm(`Archiver la catégorie "${this.getDisplayName()}" ?`)) {
      this.archive.emit(this.categorie);
    }
  }

  isDeletable(): boolean {
    return !this.categorie.nombreEvenements || this.categorie.nombreEvenements === 0;
  }

  getProgressPercentage(): number {
    const maxEvents = 100;
    const events = this.categorie.nombreEvenements || 0;
    return Math.min((events / maxEvents) * 100, 100);
  }
}
