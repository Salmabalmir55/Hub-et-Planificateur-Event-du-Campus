export interface Salle {
  id: number;
  nom: string;
  capacite?: number;
  localisation?: string;
  disponible?: boolean;
  equipements?: string[];
}

export interface SalleDTO {
  id?: number;
  nom: string;
  capacite?: number;
  localisation?: string;
  disponible?: boolean;
  equipements?: string;
}export interface Feedback {
  id: number;
  evenementId: number;
  evenementTitre?: string;
  etudiantId: number;
  etudiantNom?: string;
  note: number; // 1-5
  commentaire: string;
  approuve: boolean;
  dateCreation: string;
}

export interface FeedbackDTO {
  evenementId: number;
  note: number;
  commentaire: string;
}
