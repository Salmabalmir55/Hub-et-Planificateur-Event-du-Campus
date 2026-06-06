import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserService, BackendUser } from './user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './users.html',
  styleUrls: ['./users.css']
})
export class UsersComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);

  activeFilter: string = 'Tous';
  users: BackendUser[] = [];
  isLoading = true;

  // Pour le formulaire d'ajout
  showForm = false;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  newUser = {
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    role: 'ROLE_ETUDIANT',
    telephone: '',
    matricule: '',
    filiere: '',
    niveau: ''
  };

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des utilisateurs', err);
        this.isLoading = false;
      }
    });
  }

  addUser() {
    this.showForm = true;
  }

  cancelForm() {
    this.showForm = false;
    this.newUser = {
      nom: '',
      prenom: '',
      email: '',
      motDePasse: '',
      role: 'ROLE_ETUDIANT',
      telephone: '',
      matricule: '',
      filiere: '',
      niveau: ''
    };
    this.errorMessage = '';
    this.successMessage = '';
  }

  onSubmitNewUser() {
    // Validation des champs communs
    if (!this.newUser.nom || !this.newUser.prenom || !this.newUser.email || !this.newUser.motDePasse) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires';
      return;
    }

    // Validation spécifique étudiant
    if (this.newUser.role === 'ROLE_ETUDIANT' && !this.newUser.matricule) {
      this.errorMessage = 'Le matricule est requis pour un étudiant';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    // ✅ Construction correcte des données selon le rôle
    let userToSend: any = {};

    if (this.newUser.role === 'ROLE_ETUDIANT') {
      userToSend = {
        nom: this.newUser.nom,
        prenom: this.newUser.prenom,
        email: this.newUser.email,
        motDePasse: this.newUser.motDePasse,
        telephone: this.newUser.telephone || '',
        matricule: this.newUser.matricule,
        filiere: this.newUser.filiere || '',
        niveau: this.newUser.niveau || ''
      };
    } else if (this.newUser.role === 'ROLE_ORGANISATEUR') {
      userToSend = {
        nom: this.newUser.nom,
        prenom: this.newUser.prenom,
        email: this.newUser.email,
        motDePasse: this.newUser.motDePasse,
        telephone: this.newUser.telephone || '',
        // Champs spécifiques organisateur si besoin
      };
    } else {
      userToSend = {
        nom: this.newUser.nom,
        prenom: this.newUser.prenom,
        email: this.newUser.email,
        motDePasse: this.newUser.motDePasse,
        telephone: this.newUser.telephone || ''
      };
    }

    console.log('📤 Envoi des données:', userToSend);

    this.userService.createUser(userToSend, this.newUser.role).subscribe({
      next: () => {
        this.successMessage = 'Utilisateur créé avec succès !';
        setTimeout(() => {
          this.showForm = false;
          this.loadUsers();
          this.cancelForm();
          this.isSubmitting = false;
        }, 1500);
      },
      error: (err: any) => {
        console.error('Erreur détaillée:', err);
        // Afficher le message d'erreur du backend
        if (err.error && err.error.message) {
          this.errorMessage = err.error.message;
        } else if (err.error && typeof err.error === 'string') {
          this.errorMessage = err.error;
        } else {
          this.errorMessage = 'Erreur lors de la création';
        }
        this.isSubmitting = false;
      }
    });
  }

  get filteredUsers() {
    let list = this.users;

    if (this.activeFilter === 'Organisateurs') {
      list = this.users.filter(u => u.role === 'ROLE_ORGANISATEUR');
    } else if (this.activeFilter === 'Étudiants') {
      list = this.users.filter(u => u.role === 'ROLE_ETUDIANT');
    } else if (this.activeFilter === 'Suspendus') {
      list = this.users.filter(u => !u.actif);
    }

    return list.map(u => ({
      ...u,
      name: `${u.prenom} ${u.nom}`,
      initials: `${u.prenom ? u.prenom[0] : ''}${u.nom ? u.nom[0] : ''}`.toUpperCase() || 'US',
      roleLabel: u.role === 'ROLE_ORGANISATEUR' ? 'Organisateur' : u.role === 'ROLE_ETUDIANT' ? 'Étudiant' : 'Admin',
      statusLabel: u.actif ? 'Actif' : 'Suspendu',
      statusDot: u.actif ? 'dot-success' : 'dot-danger',
      dateInscriptionFormatted: u.dateInscription ? new Date(u.dateInscription).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Non définie'
    }));
  }

  setFilter(filter: string) {
    this.activeFilter = filter;
  }

  toggleStatus(user: any) {
    const action = user.actif
      ? this.userService.desactiverUser(user.id)
      : this.userService.activerUser(user.id);

    action.subscribe({
      next: () => this.loadUsers(),
      error: (err) => {
        console.error('Erreur lors du changement de statut:', err);
        alert('Erreur lors du changement de statut');
      }
    });
  }
}
