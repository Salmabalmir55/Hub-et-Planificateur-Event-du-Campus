import { Role } from './enums.model';

// Interface de base pour tous les utilisateurs
export interface Utilisateur {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  role: Role;
}

// Les interfaces spécifiques qui héritent de Utilisateur
export interface Administrateur extends Utilisateur {
  niveauAcces: string;
}

export interface Organisateur extends Utilisateur {
  departement: string;
  telephone: string;
  estVerifie: boolean;
}

export interface Etudiant extends Utilisateur {
  matricule: string;
  filiere: string;
  niveau: string;
}
