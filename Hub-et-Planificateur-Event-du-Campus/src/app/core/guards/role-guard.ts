// src/app/core/guards/role-guard.ts

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const requiredRole = route.data?.['role'] as string | undefined;

  console.log('🔐 [Guard] URL demandée:', state.url);
  console.log('🔐 [Guard] Rôle requis:', requiredRole);

  // Vérifier si l'utilisateur est connecté
  if (!auth.isLoggedIn()) {
    console.log('❌ [Guard] Utilisateur non connecté, redirection vers login');
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // Si aucun rôle requis, accès autorisé
  if (!requiredRole) {
    console.log('✅ [Guard] Aucun rôle requis, accès autorisé');
    return true;
  }

  const role = auth.getRole();
  console.log('👤 [Guard] Rôle utilisateur:', role);

  if (!role) {
    console.log('❌ [Guard] Rôle utilisateur non trouvé');
    router.navigate(['/login']);
    return false;
  }

  // Normalisation des rôles (supprimer "ROLE_" pour comparaison)
  let normalizedRole = role;
  let normalizedRequired = requiredRole;

  // Supprimer le préfixe ROLE_ si présent
  if (normalizedRole.startsWith('ROLE_')) {
    normalizedRole = normalizedRole.substring(5);
  }
  if (normalizedRequired.startsWith('ROLE_')) {
    normalizedRequired = normalizedRequired.substring(5);
  }

  // Mettre en majuscules pour comparaison
  normalizedRole = normalizedRole.toUpperCase();
  normalizedRequired = normalizedRequired.toUpperCase();

  console.log('📊 [Guard] Comparaison:', normalizedRole, '===', normalizedRequired);

  const hasAccess = normalizedRole === normalizedRequired;

  if (!hasAccess) {
    console.log('❌ [Guard] Rôle incorrect, redirection vers accueil');
    router.navigate(['/']);
    return false;
  }

  console.log('✅ [Guard] Accès autorisé');
  return true;
};
