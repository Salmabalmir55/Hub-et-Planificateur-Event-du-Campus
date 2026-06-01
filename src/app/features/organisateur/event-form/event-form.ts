import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
// 1. IMPORT OBLIGATOIRE POUR UTILISER [(ngModel)]
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-event-form',
  standalone: true,
  // 2. AJOUTER FormsModule ICI
  imports: [RouterLink, FormsModule],
  templateUrl: './event-form.html',
  styleUrls: ['./event-form.scss']
})
export class EventFormComponent {
  private router = inject(Router);

  // 3. DÉCLARATION DES VARIABLES (Ce qui corrige l'erreur "Property does not exist")
  titre: string = '';
  categorie: string = 'Conférence'; // Valeur par défaut
  capacite: number = 150;
  dateHeure: string = '';
  salle: string = 'Amphi A (500 places)';
  description: string = '';

  // 4. LA MÉTHODE APPELÉE QUAND ON CLIQUE SUR "Soumettre"
  onSubmit() {
    // Pour l'instant, on affiche juste les données dans la console
    console.log('Nouvel événement créé avec :', {
      titre: this.titre,
      categorie: this.categorie,
      capacite: this.capacite,
      dateHeure: this.dateHeure,
      salle: this.salle,
      description: this.description
    });

    // Redirection automatique vers le tableau de bord
    this.router.navigate(['/organisateur/dashboard']);
  }
}
