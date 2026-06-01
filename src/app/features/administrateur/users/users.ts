import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserService, BackendUser } from './user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class UsersComponent implements OnInit {
  private userService = inject(UserService);

  activeFilter: string = 'Tous';
  users: BackendUser[] = []; // Contiendra la liste brute venant de la BDD via Spring Boot

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => console.error('Erreur lors du chargement des utilisateurs depuis Spring Boot', err)
    });
  }

  // Ce getter filtre la liste brute et traduit dynamiquement les propriétés pour votre gabarit HTML
  get filteredUsers() {
    let list = this.users;

    // 1. Filtrage selon les enums et booléens réels du backend
    if (this.activeFilter === 'Organisateurs') {
      list = this.users.filter(u => u.role === 'ORGANISATEUR');
    } else if (this.activeFilter === 'Étudiants') {
      list = this.users.filter(u => u.role === 'ETUDIANT');
    } else if (this.activeFilter === 'Suspendus') {
      list = this.users.filter(u => !u.actif);
    }

    // 2. Adaptation transparente pour que le HTML existant reçoive ses variables (name, status, initials)
    return list.map(u => ({
      ...u,
      name: `${u.prenom} ${u.nom}`,
      initials: `${u.prenom ? u.prenom[0] : ''}${u.nom ? u.nom[0] : ''}`.toUpperCase() || 'US',
      role: u.role === 'ORGANISATEUR' ? 'Organisateur' : u.role === 'ETUDIANT' ? 'Étudiant' : 'Admin',
      status: u.actif ? 'Actif' : 'Suspendu',
      date: u.dateInscription ? new Date(u.dateInscription).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Non définie'
    }));
  }

  setFilter(filter: string) {
    this.activeFilter = filter;
  }

  toggleMenu(user: any, event: Event) {
    event.stopPropagation();
    const currentState = user.showMenu;
    this.users.forEach(u => (u as any).showMenu = false);
    user.showMenu = !currentState;
  }

  // Aligné avec vos routes PUT d'activation et désactivation du backend
  toggleStatus(user: any) {
    if (user.actif) {
      this.userService.desactiverUser(user.id).subscribe({
        next: () => this.loadUsers(),
        error: () => alert("Erreur lors de la désactivation")
      });
    } else {
      this.userService.activerUser(user.id).subscribe({
        next: () => this.loadUsers(),
        error: () => alert("Erreur lors de l'activation")
      });
    }
  }
}
