import { StatutEvenement } from './enums.model';
import { Organisateur } from './utilisateur.model';

// Interface pour lire les réponses de ton backend Java (ApiResponseDTO)
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Interface de l'événement
export interface Evenement {
  id?: number;
  titre: string;
  description: string;
  dateDebut: string | Date;
  dateFin: string | Date;
  lieu: string;
  capaciteMax: number;
  statut: StatutEvenement;
  organisateur?: Organisateur;
}
