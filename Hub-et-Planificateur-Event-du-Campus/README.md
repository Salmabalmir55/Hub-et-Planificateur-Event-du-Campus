# Hub et Planificateur d'Événements du Campus

Application full-stack : **Angular 21** (frontend) + **Spring Boot 3** (backend) + **MySQL**.

## Prérequis

- **Java 17+**
- **Node.js 20+** et npm
- **MySQL** sur `localhost:3306`
- Base : `planificateur_db` (créée automatiquement si absente)
- Utilisateur par défaut : `root` / mot de passe vide (modifiable dans `src/main/resources/application.properties`)

## Démarrage rapide

### 1. Backend (port 8080)

```bash
cd "C:\Users\SANAE PC\Downloads\Hub-et-Planificateur-Event-du-Campus"
mvn spring-boot:run
```

Vérification : [http://localhost:8080/api/auth/verify](http://localhost:8080/api/auth/verify)

Swagger : [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

### 2. Frontend (port 4200)

```bash
npm install
ng serve
```

Ouvrir : [http://localhost:4200](http://localhost:4200)

## Comptes de test (créés au premier démarrage)

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@campus.com | admin123 |
| Organisateur | organisateur@campus.com | org123 |
| Étudiant | etudiant@campus.com | etu123 |

## Parcours de test

### Étudiant
1. Connexion avec `etudiant@campus.com` / `etu123`
2. **Catalogue** : événements validés
3. **Détail** → **S'inscrire**
4. **Mes inscriptions** : voir / annuler

### Organisateur
1. Connexion avec `organisateur@campus.com` / `org123`
2. **Nouvel événement** : créer (statut « En attente »)
3. **Tableau de bord** : liste et filtres
4. **Participants** : inscrits par événement

### Administrateur
1. Connexion avec `admin@campus.com` / `admin123`
2. **Validations** : approuver / refuser les événements en attente
3. **Utilisateurs** : activer / désactiver
4. **Rapports** : statistiques globales

## Architecture API

- Auth : `/api/auth/*`
- Événements : `/api/evenements/*`
- Inscriptions : `/api/inscriptions/*`
- Admin : `/api/admin/*`
- Utilisateurs : `/api/utilisateurs/*`

Le JWT est envoyé automatiquement par l'intercepteur Angular après connexion.

## Configuration

- API URL frontend : `src/environments/environment.development.ts` → `apiUrl: 'http://localhost:8080/api'`
- Base MySQL : `src/main/resources/application.properties`

## Build production

```bash
mvn clean package -DskipTests
ng build
```
