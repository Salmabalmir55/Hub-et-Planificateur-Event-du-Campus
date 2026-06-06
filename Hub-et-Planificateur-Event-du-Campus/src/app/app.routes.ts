import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [
  // ============================================
  // REDIRECTION PAR DÉFAUT
  // ============================================
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // ============================================
  // ROUTES PUBLIQUES
  // ============================================
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then(m => m.RegisterComponent)
  },

  // ============================================
  // ROUTES ÉTUDIANT
  // ============================================
  {
    path: 'catalog',
    loadComponent: () => import('./pages/event-catalog/event-catalog').then(m => m.EventCatalogComponent),
    canActivate: [roleGuard],
    data: { role: 'ROLE_ETUDIANT' }
  },
  {
    path: 'event/:id',
    loadComponent: () => import('./pages/event-detail/event-detail').then(m => m.EventDetailComponent),
    canActivate: [roleGuard]
  },
  {
    path: 'my-enrollments',
    loadComponent: () => import('./pages/my-enrollments/my-enrollments').then(m => m.MyEnrollmentsComponent),
    canActivate: [roleGuard],
    data: { role: 'ROLE_ETUDIANT' }
  },
  {
    path: 'feedback/:id',
    loadComponent: () => import('./features/etudiant/feedback/feedback-form').then(m => m.FeedbackFormComponent),
    canActivate: [roleGuard],
    data: { role: 'ROLE_ETUDIANT' }
  },
  {
    path: 'categories',
    loadComponent: () => import('./features/categories/categorie-list/categorie-list.component').then(m => m.CategorieListComponent),
    canActivate: [roleGuard],
    data: { role: 'ROLE_ETUDIANT' }
  },
  {
    path: 'categorie/:id/evenements',
    loadComponent: () => import('./features/categories/categorie-detail/categorie-detail.component')
      .then(m => m.CategorieDetailComponent),
    canActivate: [roleGuard]
  },
  {
    path: 'etudiant/salles',
    loadComponent: () => import('./features/etudiant/salles/salles-list/salles-list.component')
      .then(m => m.SallesListComponent),
    canActivate: [roleGuard],
    data: { role: 'ROLE_ETUDIANT' }
  },
  {
    path: 'etudiant/salle/:id',
    loadComponent: () => import('./features/etudiant/salles/salles-detail/salle-detail.component')
      .then(m => m.SalleDetailComponent),
    canActivate: [roleGuard],
    data: { role: 'ROLE_ETUDIANT' }
  },

  // ============================================
  // ROUTES PROFIL
  // ============================================
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile').then(m => m.ProfileComponent),
    canActivate: [roleGuard]
  },

  // ============================================
  // ROUTES ORGANISATEUR
  // ============================================
  {
    path: 'organisateur/dashboard',
    loadComponent: () => import('./features/organisateur/dashboard/dashboard').then(m => m.DashboardComponent),
    canActivate: [roleGuard],
    data: { role: 'ROLE_ORGANISATEUR' }
  },
  {
    path: 'organisateur/evenements',
    loadComponent: () => import('./features/organisateur/dashboard/dashboard').then(m => m.DashboardComponent),
    canActivate: [roleGuard],
    data: { role: 'ROLE_ORGANISATEUR' }
  },
  {
    path: 'organisateur/evenements/creer',
    loadComponent: () => import('./features/organisateur/event-form/event-form').then(m => m.EventFormComponent),
    canActivate: [roleGuard],
    data: { role: 'ROLE_ORGANISATEUR' }
  },
  {
    path: 'organisateur/evenements/modifier/:id',
    loadComponent: () => import('./features/organisateur/event-form/event-form').then(m => m.EventFormComponent),
    canActivate: [roleGuard],
    data: { role: 'ROLE_ORGANISATEUR' }
  },
  {
    path: 'organisateur/evenements/:id/inscrits',
    loadComponent: () => import('./features/organisateur/attendees/attendees').then(m => m.AttendeesComponent),
    canActivate: [roleGuard],
    data: { role: 'ROLE_ORGANISATEUR' }
  },
  {
    path: 'organisateur/categories',
    loadComponent: () => import('./features/categories/categorie-list/categorie-list.component').then(m => m.CategorieListComponent),
    canActivate: [roleGuard],
    data: { role: 'ROLE_ORGANISATEUR' }
  },
  {
    path: 'organisateur/categorie/:id/evenements',
    loadComponent: () => import('./features/categories/categorie-detail/categorie-detail.component').then(m => m.CategorieDetailComponent),
    canActivate: [roleGuard],
    data: { role: 'ROLE_ORGANISATEUR' }
  },
  {
    path: 'organisateur/feedbacks',
    loadComponent: () => import('./features/organisateur/feedbacks/organisateur-feedbacks.component')
      .then(m => m.OrganisateurFeedbacksComponent),
    canActivate: [roleGuard],
    data: { role: 'ROLE_ORGANISATEUR' }
  },



  // ============================================
  // ROUTES ORGANISATEUR - RÉSERVATIONS
  // ============================================
  {
    path: 'organisateur/reservations',
    loadComponent: () => import('./features/organisateur/reservations/reservations-list/reservations-list.component')
      .then(m => m.ReservationsListComponent),
    canActivate: [roleGuard],
    data: { role: 'ROLE_ORGANISATEUR' }
  },

  {
    path: 'organisateur/reservations/:id',
    loadComponent: () => import('./features/organisateur/reservations/reservation-detail/reservation-detail.component')
      .then(m => m.ReservationDetailComponent),
    canActivate: [roleGuard],
    data: { role: 'ROLE_ORGANISATEUR' }
  },

  // ============================================
  // ROUTES ADMINISTRATEUR
  // ============================================
  {
    path: 'administrateur/validation',
    loadComponent: () => import('./features/administrateur/validation/validation').then(m => m.ValidationComponent),
    canActivate: [roleGuard],
    data: { role: 'ROLE_ADMIN' }
  },
  {
    path: 'administrateur/users',
    loadComponent: () => import('./features/administrateur/users/users').then(m => m.UsersComponent),
    canActivate: [roleGuard],
    data: { role: 'ROLE_ADMIN' }
  },
  {
    path: 'administrateur/users/ajouter',
    loadComponent: () => import('./features/administrateur/users/users').then(m => m.UsersComponent),
    canActivate: [roleGuard],
    data: { role: 'ROLE_ADMIN' }
  },
  {
    path: 'administrateur/reports',
    loadComponent: () => import('./features/administrateur/reports/reports').then(m => m.ReportsComponent),
    canActivate: [roleGuard],
    data: { role: 'ROLE_ADMIN' }
  },
  {
    path: 'administrateur/categories',
    loadComponent: () => import('./features/categories/categorie-list/categorie-list.component').then(m => m.CategorieListComponent),
    canActivate: [roleGuard],
    data: { role: 'ROLE_ADMIN' }
  },
  {
    path: 'administrateur/categorie/:id/evenements',
    loadComponent: () => import('./features/categories/categorie-detail/categorie-detail.component').then(m => m.CategorieDetailComponent),
    canActivate: [roleGuard],
    data: { role: 'ROLE_ADMIN' }
  },
  {
    path: 'administrateur/feedbacks',
    loadComponent: () => import('./features/administrateur/feedbacks/admin-feedbacks.component')
      .then(m => m.AdminFeedbacksComponent),
    canActivate: [roleGuard],
    data: { role: 'ROLE_ADMIN' }
  },
  {
    path: 'administrateur/salles',
    loadComponent: () => import('./features/administrateur/salles/salles.component')
      .then(m => m.SallesComponent),
    canActivate: [roleGuard],
    data: { role: 'ROLE_ADMIN' }
  },
  {
    path: 'administrateur/salles/creer',
    loadComponent: () => import('./features/administrateur/salles/salle-form/salle-form.component')
      .then(m => m.SalleFormComponent),
    canActivate: [roleGuard],
    data: { role: 'ROLE_ADMIN' }
  },
  {
    path: 'administrateur/salles/modifier/:id',
    loadComponent: () => import('./features/administrateur/salles/salle-form/salle-form.component')
      .then(m => m.SalleFormComponent),
    canActivate: [roleGuard],
    data: { role: 'ROLE_ADMIN' }
  },
  {
    path: 'administrateur/salle/:id',
    loadComponent: () => import('./features/administrateur/salles/salle-detail/salle-detail.component')
      .then(m => m.SalleDetailComponent),
    canActivate: [roleGuard],
    data: { role: 'ROLE_ADMIN' }
  },

  // ============================================
  // REDIRECTION 404 - TOUJOURS EN DERNIER
  // ============================================
  { path: '**', redirectTo: 'login' }
];
