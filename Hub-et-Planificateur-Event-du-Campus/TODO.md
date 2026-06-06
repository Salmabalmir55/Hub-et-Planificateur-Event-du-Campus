# TODO - Test complet scénarios (ajout event orga -> validation admin -> consultation inscrits étudiant)

## Phase A — Préparation (cartographie)
- [ ] Vérifier toutes les routes protégées par `roleGuard` (données depuis `src/app/app.routes.ts`).
- [ ] Lister les rôles et actions attendues pour chaque rôle : étudiant / organisateur / administrateur.

## Phase B — Scénarios end-to-end (avec captures)
- [ ] Scénario 1 (happy path complet) :
  - [ ] Organisateur: inscription + login
  - [ ] Organisateur: créer un event (tous champs)
  - [ ] Admin: login + valider l’event
  - [ ] Étudiant: login + consulter l’event et/ou ses inscriptions / liste inscrits
  - [ ] Prendre captures d’écran pour chaque étape
- [ ] Scénario 2 : accès direct URL sans login (attendu: redirect /login)
- [ ] Scénario 3 : accès route organisateur avec rôle étudiant (attendu: blocage)
- [ ] Scénario 4 : accès route admin avec rôle étudiant/orga (attendu: blocage)
- [ ] Scénario 5 : modification d’event par organisateur (happy path)
- [ ] Scénario 6 : suppression (si feature existe)
- [ ] Scénario 7 : event details page (event validé vs non validé si prévu)
- [ ] Scénario 8 : erreurs API / formulaires invalides (champs vides, dates invalides)

## Phase C — Corrections
- [ ] Relever toutes les erreurs UI/console réseau/erreurs de guard/token
- [ ] Corriger le code (guards/interceptor/features)
- [ ] Re-tester les scénarios principaux et mettre à jour captures/rapport

## Phase D — Rapport final
- [ ] Mettre à jour `RAPPORT_TEST_FINAL.md` et/ou créer `RAPPORT_TEST_COMPLET.md` avec tableau Route x Rôle x Attendu x Observé + captures

