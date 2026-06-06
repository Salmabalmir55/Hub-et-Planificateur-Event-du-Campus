export type StatutEvenement = 'EN_ATTENTE' | 'VALIDE' | 'EN_COURS' | 'TERMINE' | 'ANNULE';

export interface Evenement {
  id: number;
  titre: string;
  description?: string;
  dateDebut: string;
  dateFin?: string;
  lieu?: string;
  capaciteMax?: number;
  nombrePlaces?: number;
  imageUrl?: string;
  statut?: StatutEvenement;
  organisateurId?: number;
  organisateurNom?: string;
  categorieId?: number;
  categorieNom?: string;
  salleId?: number
  ressources?: string[];
  salleNom?: string;
  placesRestantes?: number;
  estComplet?: boolean;
  dateCreation?: string;
  dateModification?: string;
}

// Ajouter ces exports
export interface Categorie {
  id: number;
  nom: string;
  description?: string;
  active?: boolean;
}

export interface Salle {
  id: number;
  nom: string;
  capacite?: number;
  localisation?: string;
  disponible?: boolean;
}
