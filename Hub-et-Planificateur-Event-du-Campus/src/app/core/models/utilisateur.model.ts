export type Role = 'ROLE_ETUDIANT' | 'ROLE_ORGANISATEUR' | 'ROLE_ADMIN';

export interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  role: Role;
  actif: boolean;
  dateInscription: string;
}

export interface Etudiant extends Utilisateur {
  matricule: string;
  filiere: string;
  niveau: string;
}

export interface Organisateur extends Utilisateur {
  departement: string;
  estVerifie: boolean;
}

export interface Administrateur extends Utilisateur {
  // Propriétés spécifiques admin
}

export interface LoginRequest {
  email: string;
  motDePasse: string;
}

export interface LoginResponse {
  token: string;
  tokenType: string;
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  loginReussi: boolean;
  message: string;
}

export interface RegisterRequest {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  telephone?: string;
  // Pour étudiant
  matricule?: string;
  filiere?: string;
  niveau?: string;
  // Pour organisateur
  departement?: string;
}
