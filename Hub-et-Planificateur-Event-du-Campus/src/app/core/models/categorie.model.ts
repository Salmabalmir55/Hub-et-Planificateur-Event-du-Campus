// src/app/core/models/categorie.model.ts

export interface Categorie {
  id: number;
  nom: string;
  description: string;
  couleur: string;
  icone: string;
  type?: string;
  active: boolean;
  nombreEvenements?: number;
  nombreEvenementsActifs?: number;
  resume?: string;
  dateCreation?: Date;
  dateModification?: Date;
}

export interface CategorieFormData {
  nom: string;
  description: string;
  couleur: string;
  icone: string;
  type?: string;
  active: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
