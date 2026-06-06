export type StatutInscription = 'CONFIRMEE' | 'EN_ATTENTE' | 'ANNULEE' | 'PRESENTE';

export interface Inscription {
  id: number;
  etudiantId: number;
  etudiantNom?: string;
  etudiantPrenom?: string;
  etudiantEmail?: string;
  etudiantMatricule?: string;
  evenementId: number;
  evenementTitre?: string;
  evenementLieu?: string;
  evenementDateDebut?: string;
  statut: StatutInscription;
  dateInscription?: string;
  presence?: boolean;
  datePresence?: string;
}

export interface InscriptionDTO {
  etudiantId: number;
  evenementId: number;
  statut?: StatutInscription;
}

export interface InscriptionStats {
  totalInscriptions: number;
  inscriptionsCeMois: number;
  inscriptionsConfirmees: number;
  inscriptionsEnAttente: number;
  tauxPresence: number;
}

export interface InscriptionRequest {
  etudiantId: number;
  evenementId: number;
}

export interface InscriptionResponse {
  id: number;
  etudiant: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    matricule: string;
  };
  evenement: {
    id: number;
    titre: string;
    lieu: string;
    dateDebut: string;
  };
  statut: StatutInscription;
  dateInscription: string;
  presence: boolean;
}
