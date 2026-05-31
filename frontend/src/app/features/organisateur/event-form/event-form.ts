import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrganisateurService } from '../services/organisateur.service';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './event-form.html',
  styleUrls: ['./event-form.scss']
})
export class EventFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private orgaService = inject(OrganisateurService);
  private router = inject(Router);

  eventForm!: FormGroup;

  // Listes pour remplir les menus déroulants
  categories: any[] = [];
  salles: any[] = [];

  ngOnInit(): void {
    // 1. Initialisation du formulaire et des règles de validation
    this.eventForm = this.fb.group({
      titre: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      capaciteMax: [10, [Validators.required, Validators.min(1)]],
      categorieId: ['', Validators.required],
      salleId: ['', Validators.required],
      ressourcesIds: [[]] // Pour une sélection multiple
    });

    // 2. Chargement des données pour les sélecteurs
    this.chargerDonneesSélecteurs();
  }

  chargerDonneesSélecteurs(): void {
    this.orgaService.getCategories().subscribe(data => this.categories = data);
    this.orgaService.getSalles().subscribe(data => this.salles = data);
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      // Le formulaire par défaut aura le statut EN_ATTENTE côté Spring Boot
      this.orgaService.creerEvenement(this.eventForm.value).subscribe({
        next: () => {
          alert('Événement créé avec succès et en attente de validation !');
          this.router.navigate(['/organisateur/evenements']);
        },
        error: (err) => {
          console.error('Erreur lors de la création', err);
          alert('Erreur lors de la création de l\'événement.');
        }
      });
    } else {
      // Marque tous les champs comme touchés pour afficher les erreurs HTML
      this.eventForm.markAllAsTouched();
    }
  }
}
