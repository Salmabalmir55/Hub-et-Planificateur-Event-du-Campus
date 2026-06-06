import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserProfileService } from '../../core/services/user-profile.service';
import { Utilisateur } from '../../core/models/utilisateur.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private userProfileService = inject(UserProfileService);
  private router = inject(Router);

  user: any = {
    nom: '',
    prenom: '',
    email: '',
    telephone: ''
  };

  isLoading = true;
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.isLoading = true;

    // Récupérer l'ID utilisateur depuis AuthService
    const userId = this.authService.getUserId();

    console.log('ID Utilisateur récupéré:', userId);
    console.log('Utilisateur complet:', this.authService.getUser());

    if (!userId) {
      console.error('Aucun ID utilisateur trouvé - utilisateur non connecté');
      this.errorMessage = 'Vous devez être connecté pour accéder à votre profil.';
      this.isLoading = false;
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
      return;
    }

    console.log('Chargement du profil pour l\'ID:', userId);

    // Charger le profil depuis l'API
    this.userProfileService.getById(userId).subscribe({
      next: (utilisateur: Utilisateur) => {
        console.log('Profil chargé avec succès:', utilisateur);

        // Mapper les données de l'API vers le formulaire
        this.user = {
          nom: utilisateur.nom || '',
          prenom: utilisateur.prenom || '',
          email: utilisateur.email || '',
          telephone: utilisateur.telephone || ''
        };

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement du profil:', err);

        // Afficher un message d'erreur plus détaillé
        if (err.status === 0) {
          this.errorMessage = 'Impossible de contacter le serveur. Veuillez vérifier votre connexion.';
        } else if (err.status === 404) {
          this.errorMessage = 'Profil utilisateur non trouvé.';
        } else if (err.status === 401) {
          this.errorMessage = 'Session expirée. Veuillez vous reconnecter.';
          setTimeout(() => {
            this.authService.logout();
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.errorMessage = 'Impossible de charger votre profil. Veuillez réessayer.';
        }

        this.isLoading = false;
      }
    });
  }

  updateProfile(): void {
    // Récupérer l'ID utilisateur
    const userId = this.authService.getUserId();

    if (!userId) {
      this.errorMessage = 'Session expirée. Veuillez vous reconnecter.';
      setTimeout(() => this.router.navigate(['/login']), 2000);
      return;
    }

    // Préparer les données à mettre à jour
    const updateData = {
      nom: this.user.nom,
      prenom: this.user.prenom,
      email: this.user.email,
      telephone: this.user.telephone
    };

    console.log('Mise à jour du profil pour ID:', userId, updateData);

    this.userProfileService.update(userId, updateData).subscribe({
      next: (utilisateur: Utilisateur) => {
        console.log('Profil mis à jour avec succès:', utilisateur);
        this.successMessage = 'Profil mis à jour avec succès !';

        // Mettre à jour l'utilisateur dans localStorage via AuthService
        const currentUser = this.authService.getUser();
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            nom: utilisateur.nom,
            prenom: utilisateur.prenom,
            email: utilisateur.email,
            telephone: utilisateur.telephone
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }

        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour:', err);

        if (err.status === 409) {
          this.errorMessage = 'Cet email est déjà utilisé par un autre compte.';
        } else if (err.status === 400) {
          this.errorMessage = 'Données invalides. Veuillez vérifier les champs.';
        } else {
          this.errorMessage = 'Erreur lors de la mise à jour du profil. Veuillez réessayer.';
        }

        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
