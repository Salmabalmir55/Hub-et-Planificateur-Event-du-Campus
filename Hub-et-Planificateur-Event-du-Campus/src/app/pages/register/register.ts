import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  // Propriétés utilisées dans le HTML
  fullName = '';
  email = '';
  password = '';
  role = '';
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  onRegister() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.fullName.trim() || !this.email.trim() || !this.password.trim() || !this.role) {
      this.errorMessage = 'Veuillez remplir tous les champs.';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Le mot de passe doit contenir au moins 6 caractères.';
      return;
    }

    this.isLoading = true;

    const nameParts = this.fullName.trim().split(/\s+/);
    const prenom = nameParts[0] || '';
    const nom = nameParts.length > 1 ? nameParts.slice(1).join(' ') : prenom;

    const payload = {
      nom: nom,
      prenom: prenom,
      email: this.email.trim(),
      motDePasse: this.password,
      telephone: ''
    };

    if (this.role === 'STUDENT') {
      this.authService.registerEtudiant({
        ...payload,
        matricule: 'MAT-' + Math.floor(100000 + Math.random() * 900000),
        filiere: 'Informatique',
        niveau: 1
      }).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.successMessage = 'Inscription réussie en tant qu\'étudiant ! Redirection...';
            setTimeout(() => this.router.navigate(['/login']), 2000);
          } else {
            this.errorMessage = response.message || 'Erreur lors de l\'inscription';
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'Une erreur est survenue.';
        }
      });
    } else if (this.role === 'ORGANIZER') {
      this.authService.registerOrganisateur({
        ...payload,
        departement: 'Administration'
      }).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.successMessage = 'Inscription réussie en tant qu\'organisateur ! Redirection...';
            setTimeout(() => this.router.navigate(['/login']), 2000);
          } else {
            this.errorMessage = response.message || 'Erreur lors de l\'inscription';
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'Une erreur est survenue.';
        }
      });
    }
  }
}
