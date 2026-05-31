import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'catalog', pathMatch: 'full' },
  
  { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.Login) },
  { path: 'register', loadComponent: () => import('./pages/register/register').then(m => m.Register) },
  { path: 'catalog', loadComponent: () => import('./pages/event-catalog/event-catalog').then(m => m.EventCatalog) },
  { path: 'event/:id', loadComponent: () => import('./pages/event-detail/event-detail').then(m => m.EventDetail) },
  { path: 'my-enrollments', loadComponent: () => import('./pages/my-enrollments/my-enrollments').then(m => m.MyEnrollments) },
  { path: 'profile', loadComponent: () => import('./pages/profile/profile').then(m => m.Profile) }
];