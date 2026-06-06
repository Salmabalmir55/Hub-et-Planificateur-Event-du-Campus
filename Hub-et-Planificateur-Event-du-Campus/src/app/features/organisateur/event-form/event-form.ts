import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { CategorieService } from '../../../core/services/categorie.service';
import { SalleService, Salle } from '../../../core/services/salle.service';
import { AuthService } from '../../../core/services/auth.service';

interface Categorie {
  id: number;
  nom: string;
  icone?: string;
  icon?: string;
  active: boolean;
}

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './event-form.html',
  styleUrls: ['./event-form.css']
})
export class EventFormComponent implements OnInit {
  event: any = {
    titre: '',
    description: '',
    dateDebut: '',
    dateFin: '',
    capaciteMax: 100,
    categorieId: 0,
    salleId: 0 ,
    ressources: []
  };

  ressourcesList: string[] = [];
  nouvelleRessource: string = '';

  categories: Categorie[] = [];
  salles: Salle[] = [];
  selectedCategorieId: number = 0;
  selectedSalleId: number = 0;
  nouvelleCategorie: string = '';
  showAutreCategorie: boolean = false;

  isEditMode = false;
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  // Injection moderne
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private eventService = inject(EventService);
  private categorieService = inject(CategorieService);
  private salleService = inject(SalleService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.loadCategories();
    this.loadSalles();

    const id = this.route.snapshot.params['id'];
    console.log('📌 ID depuis URL:', id);

    if (id && id !== 'creer' && id !== 'nouveau') {
      this.isEditMode = true;
      this.loadEvent(id);
    } else {
      this.isEditMode = false;
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  loadCategories(): void {
    this.categorieService.getActives().subscribe({
      next: (res) => {
        this.categories = res.data || res;
        console.log('📋 Catégories chargées:', this.categories.length);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Erreur chargement catégories:', err);
      }
    });
  }

  loadSalles(): void {
    // ✅ Utilise getDisponibles() pour n'avoir que les salles disponibles
    this.salleService.getDisponibles().subscribe({
      next: (data) => {
        this.salles = Array.isArray(data) ? data : [];
        console.log('Salles disponibles uniquement:', this.salles.length);
        // Afficher uniquement les salles avec disponible = true
        this.salles = this.salles.filter(salle => salle.disponible === true);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Erreur chargement salles:', err);
      }
    });
  }
// Ajouter ces méthodes avant la dernière accolade }

  ajouterRessource(): void {
    if (this.nouvelleRessource && this.nouvelleRessource.trim()) {
      this.ressourcesList.push(this.nouvelleRessource.trim());
      this.event.ressources = [...this.ressourcesList];
      this.nouvelleRessource = '';
      this.cdr.detectChanges();
    }
  }

  supprimerRessource(index: number): void {
    this.ressourcesList.splice(index, 1);
    this.event.ressources = [...this.ressourcesList];
    this.cdr.detectChanges();
  }

  loadEvent(id: number): void {
    console.log('🔍 loadEvent - ID reçu:', id);
    this.isLoading = true;
    this.cdr.detectChanges();

    this.eventService.getEventById(id).subscribe({
      next: (res) => {
        console.log('✅ Événement reçu:', res);

        this.event = {
          id: res.id,
          titre: res.titre,
          description: res.description || '',
          dateDebut: res.dateDebut ? this.formatDateForInput(res.dateDebut) : '',
          dateFin: res.dateFin ? this.formatDateForInput(res.dateFin) : '',
          capaciteMax: res.capaciteMax || 100,
          categorieId: res.categorieId || 0,
          salleId: res.salleId || 0
        };

        this.selectedCategorieId = res.categorieId || 0;
        this.selectedSalleId = res.salleId || 0;
        this.ressourcesList = [...(res.ressources || [])];
        this.event.ressources = [...this.ressourcesList];
        this.showAutreCategorie = false;
        this.nouvelleCategorie = '';

        console.log('✅ Catégorie sélectionnée ID:', this.selectedCategorieId);
        console.log('✅ Salle sélectionnée ID:', this.selectedSalleId);

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Erreur chargement:', err);
        this.errorMessage = 'Erreur lors du chargement de l\'événement';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  formatDateForInput(dateStr: string): string {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return '';

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch {
      return '';
    }
  }

  formatDateForApi(dateStr: string): string {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return '';

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');

      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    } catch {
      return '';
    }
  }

  onCategorieChange(event: any): void {
    const value = event.target.value;
    if (value === '-1') {
      this.showAutreCategorie = true;
      this.selectedCategorieId = 0;
      this.event.categorieId = 0;
    } else {
      this.showAutreCategorie = false;
      this.selectedCategorieId = parseInt(value);
      this.event.categorieId = parseInt(value);
      this.nouvelleCategorie = '';
    }
    this.cdr.detectChanges();
  }

  // ✅ NOUVEAU : Gérer le changement de salle
  onSalleChange(event: any): void {
    const value = event.target.value;
    this.selectedSalleId = parseInt(value);
    this.event.salleId = this.selectedSalleId;
    this.cdr.detectChanges();
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    // Validation du titre
    if (!this.event.titre?.trim()) {
      this.errorMessage = 'Le titre est requis';
      return;
    }

    // Validation des dates
    if (!this.event.dateDebut || !this.event.dateFin) {
      this.errorMessage = 'Les dates sont requises';
      return;
    }

    // Validation de la catégorie
    let categorieId = this.selectedCategorieId;
    let categorieNom = '';

    if (this.showAutreCategorie) {
      if (!this.nouvelleCategorie.trim()) {
        this.errorMessage = 'Veuillez saisir le nom de la nouvelle catégorie';
        return;
      }
      categorieNom = this.nouvelleCategorie.trim();
      categorieId = 0;
    } else if (!categorieId || categorieId === 0) {
      this.errorMessage = 'Veuillez sélectionner une catégorie';
      return;
    }

    // ✅ NOUVEAU : Validation de la salle
    if (!this.selectedSalleId || this.selectedSalleId === 0) {
      this.errorMessage = 'Veuillez sélectionner une salle';
      return;
    }

    // Validation des dates
    const dateDebut = new Date(this.event.dateDebut);
    const dateFin = new Date(this.event.dateFin);

    if (isNaN(dateDebut.getTime()) || isNaN(dateFin.getTime())) {
      this.errorMessage = 'Les dates sont invalides';
      return;
    }

    if (dateFin <= dateDebut) {
      this.errorMessage = 'La date de fin doit être postérieure à la date de début';
      return;
    }

    this.isSubmitting = true;
    this.cdr.detectChanges();

    const eventData: any = {
      titre: this.event.titre.trim(),
      description: this.event.description || '',
      dateDebut: this.formatDateForApi(this.event.dateDebut),
      dateFin: this.formatDateForApi(this.event.dateFin),
      capaciteMax: this.event.capaciteMax || 100,
      salleId: this.selectedSalleId,
      ressources: this.ressourcesList,  // ← AJOUTER CETTE LIGNE
      organisateurId: this.authService.getUserId() || 1,
      statut: 'EN_ATTENTE'
    };

    // Ajout de la catégorie
    if (categorieNom) {
      eventData.categorieNom = categorieNom;
    } else if (categorieId > 0) {
      eventData.categorieId = categorieId;
    }

    if (this.isEditMode && this.event.id) {
      eventData.id = this.event.id;
      this.eventService.updateEvenement(this.event.id, eventData).subscribe({
        next: () => {
          this.successMessage = '✅ Événement modifié avec succès !';
          this.isSubmitting = false;
          this.cdr.detectChanges();
          setTimeout(() => {
            this.router.navigate(['/organisateur/dashboard']);
          }, 1500);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Erreur lors de la modification';
          this.isSubmitting = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.eventService.createEvenement(eventData).subscribe({
        next: () => {
          this.successMessage = '✅ Événement créé avec succès !';
          if (categorieNom) {
            this.loadCategories();
          }
          this.isSubmitting = false;
          this.cdr.detectChanges();
          setTimeout(() => {
            this.router.navigate(['/organisateur/dashboard']);
          }, 1500);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Erreur lors de la création';
          this.isSubmitting = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/organisateur/dashboard']);
  }
}
