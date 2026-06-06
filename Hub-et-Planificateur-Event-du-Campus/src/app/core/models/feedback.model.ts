export interface Feedback {
  id: number;
  evenementId: number;
  evenementTitre?: string;
  etudiantId: number;
  etudiantNom?: string;
  etudiantPrenom?: string;
  note: number;
  commentaire: string;
  approuve: boolean;
  dateCreation: string;
}

export interface FeedbackDTO {
  evenementId: number;
  note: number;
  commentaire: string;
}

export interface FeedbackStats {
  noteMoyenne: number;
  totalFeedbacks: number;
  repartitionNotes: {
    [key: number]: number;
  };
}
