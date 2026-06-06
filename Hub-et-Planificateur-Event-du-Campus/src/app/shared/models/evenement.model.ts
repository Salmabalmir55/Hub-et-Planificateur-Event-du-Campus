export interface Evenement {
  id?: number;
  titre: string;
  description: string;
  dateDebut: string; // ou Date
  dateFin: string;
  capaciteMax: number;
  statut: 'EN_ATTENTE' | 'APPROUVE' | 'REJETE';
  categorieId: number;
  salleId: number;
  ressourcesIds: number[];
}
