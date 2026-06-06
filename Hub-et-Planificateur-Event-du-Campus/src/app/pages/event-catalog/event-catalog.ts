// src/app/pages/event-catalog/event-catalog.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EventService } from '../../core/services/event.service';
import { ReferenceService } from '../../core/services/reference.service';
import { Evenement } from '../../core/models/evenement.model';
import { Categorie } from '../../core/models/categorie.model';

interface EventItem {
  id: number;
  title: string;
  date: string;
  category: string;
  categoryId?: number;
  price: string;
  lieu: string;
  placesRestantes?: number;
}

@Component({
  selector: 'app-event-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './event-catalog.html',
  styleUrls: ['./event-catalog.css']
})
export class EventCatalogComponent implements OnInit {
  private eventService = inject(EventService);
  private referenceService = inject(ReferenceService);

  searchTerm = '';
  selectedCategory = 'All';
  categories: Categorie[] = [];
  categoryNames: string[] = ['All'];
  private categoryMap = new Map<string, number>();

  events: EventItem[] = [];
  filteredEvents: EventItem[] = [];
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadCategories();
    this.loadEvents();
  }

  loadCategories(): void {
    this.referenceService.getCategories().subscribe({
      next: (cats: Categorie[]) => {
        this.categories = cats;
        this.categoryNames = ['All', ...cats.map((c) => c.nom)];
        cats.forEach((c) => this.categoryMap.set(c.nom, c.id));
      },
      error: (err) => {
        console.error('Erreur chargement catégories:', err);
        this.categoryNames = ['All'];
      }
    });
  }

  // ✅ CORRECTION : Utiliser les valeurs de l'enum StatutEvenement
  loadEvents(): void {
    this.isLoading = true;

    this.eventService.getAllEvenements().subscribe({
      next: (data: Evenement[]) => {
        console.log('📊 Événements reçus:', data.length);

        // Filtrer selon les valeurs possibles de StatutEvenement
        const eventsValides = data.filter(e =>
          e.statut === 'VALIDE' ||      // ✅ Valeur de l'enum
          e.statut === 'EN_COURS' ||    // ✅ Valeur de l'enum
          e.statut === 'EN_ATTENTE'     // ✅ Valeur de l'enum
        );

        console.log('✅ Événements valides:', eventsValides.length);

        this.events = eventsValides.map((e) => this.toEventItem(e));
        this.filterEvents();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Erreur:', err);
        this.errorMessage = 'Impossible de charger les événements. Veuillez réessayer plus tard.';
        this.isLoading = false;
      }
    });
  }

  private toEventItem(e: Evenement): EventItem {
    const dateObj = e.dateDebut ? new Date(e.dateDebut) : new Date();
    const categoryName = this.getCategoryName(e.categorieId);

    return {
      id: e.id!,
      title: e.titre,
      date: dateObj.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      category: categoryName,
      categoryId: e.categorieId,
      price: this.getPriceLabel(e),
      lieu: e.lieu || 'Lieu à définir',
      placesRestantes: e.capaciteMax
    };
  }

  private getCategoryName(categoryId?: number): string {
    if (!categoryId) return 'Non catégorisé';
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.nom : 'Non catégorisé';
  }

  private getPriceLabel(e: Evenement): string {
    const placesRestantes = e.capaciteMax || 0;
    if (placesRestantes === 0) {
      return 'Complet';
    } else if (placesRestantes <= 10) {
      return `Plus que ${placesRestantes} places !`;
    }
    return `${placesRestantes} places disponibles`;
  }

  filterEvents(): void {
    this.filteredEvents = this.events.filter((event) => {
      const matchCategory = this.selectedCategory === 'All' ||
        event.category === this.selectedCategory;
      const matchSearch = event.title.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchCategory && matchSearch;
    });
  }

  setCategory(cat: string): void {
    this.selectedCategory = cat;
    this.filterEvents();
  }
}
