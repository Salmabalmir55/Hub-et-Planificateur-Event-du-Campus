export interface Utilisateur {
  id: number;
  nom: string;
  email: string;
  role: 'ORGANISATEUR' | 'ADMIN' | 'ETUDIANT';
}
