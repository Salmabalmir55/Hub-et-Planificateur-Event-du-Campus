import { Routes } from '@angular/router';

export const routes: Routes = [
  // 1️⃣ التوجيه الافتراضي (يديك لـ login نيشان فالبدية)
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // 2️⃣ الجزء ديالك أنتِ (Authentification & Étudiant) بـ Lazy Loading
  { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.Login) },
  { path: 'register', loadComponent: () => import('./pages/register/register').then(m => m.Register) },
  { path: 'catalog', loadComponent: () => import('./pages/event-catalog/event-catalog').then(m => m.EventCatalog) },
  { path: 'event/:id', loadComponent: () => import('./pages/event-detail/event-detail').then(m => m.EventDetail) },
  { path: 'my-enrollments', loadComponent: () => import('./pages/my-enrollments/my-enrollments').then(m => m.MyEnrollments) },
  { path: 'profile', loadComponent: () => import('./pages/profile/profile').then(m => m.Profile) },

  // 3️⃣ الجزء د سناء (Espace Organisateur) بـ Lazy Loading
  { path: 'organisateur/dashboard', loadComponent: () => import('./features/organisateur/dashboard/dashboard').then(m => m.DashboardComponent) },
  { path: 'organisateur/evenements', loadComponent: () => import('./features/organisateur/event-list/event-list').then(m => m.EventListComponent) },
  { path: 'organisateur/evenements/nouveau', loadComponent: () => import('./features/organisateur/event-form/event-form').then(m => m.EventFormComponent) },
  { path: 'organisateur/evenements/modifier/:id', loadComponent: () => import('./features/organisateur/event-form/event-form').then(m => m.EventFormComponent) },
  { path: 'organisateur/evenements/:id/inscrits', loadComponent: () => import('./features/organisateur/attendees/attendees').then(m => m.AttendeesComponent) },

  // 4️⃣ الجزء د سناء (Espace Administrateur) بـ Lazy Loading
  { path: 'administrateur/validation', loadComponent: () => import('./features/administrateur/validation/validation').then(m => m.ValidationComponent) },
  { path: 'administrateur/users', loadComponent: () => import('./features/administrateur/users/users').then(m => m.UsersComponent) },
  { path: 'administrateur/reports', loadComponent: () => import('./features/administrateur/reports/reports').then(m => m.ReportsComponent) },

  // 5️⃣ حماية ضد الروابط الغالطة (يرجع ديما لـ login)
  { path: '**', redirectTo: 'login' }
];