import { Routes } from '@angular/router';

// Imports des composants Organisateur
import { DashboardComponent as OrgaDashboard } from './features/organisateur/dashboard/dashboard';
import { EventListComponent } from './features/organisateur/event-list/event-list';
import { EventFormComponent } from './features/organisateur/event-form/event-form';
import { AttendeesComponent } from './features/organisateur/attendees/attendees';

// Imports des composants Administrateur
import { ValidationComponent } from './features/administrateur/validation/validation';
import { UsersComponent } from './features/administrateur/users/users';
import { ReportsComponent } from './features/administrateur/reports/reports';

export const routes: Routes = [
  // --- Routes Organisateur ---
  { path: 'organisateur/dashboard', component: OrgaDashboard },
  { path: 'organisateur/evenements', component: EventListComponent },
  { path: 'organisateur/evenements/nouveau', component: EventFormComponent },
  { path: 'organisateur/evenements/modifier/:id', component: EventFormComponent },
  { path: 'organisateur/evenements/:id/inscrits', component: AttendeesComponent },

  // --- Routes Administrateur (Chemins corrigés) ---
  { path: 'administrateur/validation', component: ValidationComponent },
  { path: 'administrateur/users', component: UsersComponent },
  { path: 'administrateur/reports', component: ReportsComponent },

  // Redirection par défaut
  { path: '', redirectTo: 'organisateur/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'organisateur/dashboard' }
];
