import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  onLogin() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Veuillez remplir tous les champs.';
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;

    console.log('1. Tentative connexion avec:', this.email);

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.isLoading = false;

        console.log('2. Réponse reçue:', response);
        console.log('3. Response.success:', response.success);
        console.log('4. Response.data:', response.data);

        if (response.success && response.data) {
          const role = response.data.role;
          console.log('5. Rôle reçu du backend:', role);
          console.log('6. Type du rôle:', typeof role);

          // Redirection basée sur le rôle
          if (role === 'ROLE_ADMIN') {
            console.log('7. Redirection vers ADMIN');
            this.router.navigate(['/administrateur/users']);
          }
          else if (role === 'ROLE_ORGANISATEUR') {
            console.log('7. Redirection vers ORGANISATEUR');
            this.router.navigate(['/organisateur/dashboard']);
          }
          else if (role === 'ROLE_ETUDIANT') {
            console.log('7. Redirection vers ETUDIANT');
            this.router.navigate(['/catalog']);
          }
          else {
            console.log('7. Rôle non reconnu:', role);
            this.errorMessage = 'Rôle non reconnu: ' + role;
          }
        } else {
          console.log('4. Response non valide');
          this.errorMessage = response.message || 'Identifiants incorrects';
        }
      },
      error: (err) => {
        console.log('Erreur:', err);
        this.isLoading = false;
        if (err.status === 401) {
          this.errorMessage = 'Email ou mot de passe incorrect.';
        } else if (err.status === 0) {
          this.errorMessage = 'Impossible de se connecter au serveur. Vérifiez que le backend est démarré.';
        } else {
          this.errorMessage = err.error?.message || 'Une erreur est survenue.';
        }
      }
    });
  }

  socialLogin(provider: string): void {
    console.log(`Connexion avec ${provider} - À implémenter`);
  }
}
