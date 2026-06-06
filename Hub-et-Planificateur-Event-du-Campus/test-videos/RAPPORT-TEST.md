# Rapport de test E2E — eCampus

**Date :** 2 juin 2026  
**Outil :** Playwright (enregistrement vidéo 1280×720)  
**Frontend :** http://localhost:4200  
**Backend :** http://localhost:8080  

## Résultat global : SUCCÈS

Toutes les étapes du scénario automatisé se sont terminées sans erreur.

## Scénario exécuté

| # | Étape | Statut |
|---|--------|--------|
| 1 | Ouverture page login | OK |
| 2 | Connexion étudiant (`etudiant@campus.com`) | OK |
| 3 | Catalogue des événements validés | OK |
| 4 | Détail d'un événement | OK |
| 5 | Inscription à l'événement | OK |
| 6 | Page « Mes inscriptions » | OK |
| 7 | Connexion administrateur (`admin@campus.com`) | OK |
| 8 | Validation des événements en attente | OK |
| 9 | Gestion des utilisateurs | OK |
| 10 | Rapports / statistiques | OK |

## Vidéo

Fichier principal : **`demo-test-ecampus.webm`** (dans ce dossier)

## Relancer le test

```powershell
# Terminal 1
.\mvnw.cmd spring-boot:run

# Terminal 2
npx ng serve

# Terminal 3
npm run test:video
```

## Correction appliquée pendant le test

Le mode SSR bloquait le chargement des pages avec appels API. Les routes serveur utilisent maintenant le rendu **client** (`RenderMode.Client`) pour éviter les timeouts.
