import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
// 1. Import indispensable pour lire les champs du formulaire (ngModel)
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  // 2. Ne pas oublier d'ajouter FormsModule dans les imports du composant
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  // 3. Injection du Router pour gérer la navigation
  private router = inject(Router);

  // 4. Variables pour stocker les identifiants tapés par l'utilisateur
  email = '';
  password = '';

  // 5. La méthode qui sera appelée quand on soumet le formulaire
  onLogin() {
    console.log('Tentative de connexion avec:', this.email);

    // --- SIMULATION EN ATTENDANT TON VRAI SERVICE BACKEND ---
    // Ici, plus tard, tu appelleras ton AuthService qui communiquera avec ton backend Spring Boot.
    // Pour l'instant, on simule la redirection selon l'email tapé :

    if (this.email === 'etudiant@campus.ma') {
      // Redirection vers l'espace Étudiant
      this.router.navigate(['/catalog']);

    } else if (this.email === 'sanae@campus.ma') {
      // Redirection vers l'espace Organisateur
      this.router.navigate(['/organisateur/dashboard']);

    } else if (this.email === 'admin@campus.ma') {
      // Redirection vers l'espace Administrateur
      this.router.navigate(['/administrateur/users']);

    } else {
      alert('Identifiants incorrects ou utilisateur non reconnu !');
    }
  }
}
