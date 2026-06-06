import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

export interface Reservation {
  id: number;
  titre: string;
  description: string;
  salleNom: string;
  salleId: number;
  dateDebut: Date;
  dateFin: Date;
  statut: 'en_attente' | 'confirmee' | 'annulee' | 'terminee';
  organisateur: string;
  organisateurId: number;
  nombreParticipants: number;
  equipements: string[];
  notes: string;
}

@Component({
  selector: 'app-reservation-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservation-detail.component.html',
  styleUrls: ['./reservation-detail.component.css']
})
export class ReservationDetailComponent implements OnInit {
  reservation: Reservation | null = null;
  loading: boolean = true;
  error: string = '';

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  // private reservationService = inject(ReservationService); // À ajouter quand le service existe

  ngOnInit(): void {
    this.loadReservationDetail();
  }

  loadReservationDetail(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error = 'ID de réservation non trouvé';
      this.loading = false;
      return;
    }

    // ✅ À remplacer par l'appel API réel quand le service ReservationService existe
    // this.reservationService.getById(parseInt(id)).subscribe({
    //   next: (data) => {
    //     this.reservation = data;
    //     this.loading = false;
    //   },
    //   error: (err) => {
    //     console.error('Erreur:', err);
    //     this.error = 'Erreur lors du chargement de la réservation';
    //     this.loading = false;
    //   }
    // });

    // ⚠️ TEMPORAIRE : Simulation API (à remplacer)
    setTimeout(() => {
      this.reservation = {
        id: parseInt(id),
        titre: "Conférence Tech 2024",
        description: "Une conférence sur les dernières technologies",
        salleNom: "Amphithéâtre A",
        salleId: 1,
        dateDebut: new Date(2024, 11, 15, 9, 0),
        dateFin: new Date(2024, 11, 15, 17, 0),
        statut: 'confirmee',
        organisateur: "Jean Dupont",
        organisateurId: 1,
        nombreParticipants: 150,
        equipements: ["Vidéo projecteur", "Micro", "Tableau blanc"],
        notes: "Prévoir une pause café à 10h30"
      };
      this.loading = false;
    }, 500);
  }

  goBack(): void {
    this.router.navigate(['/organisateur/reservations']);
  }

  annulerReservation(): void {
    if (confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      // ✅ Appel API pour annuler
      // this.reservationService.annuler(this.reservation!.id).subscribe({
      //   next: () => {
      //     this.router.navigate(['/organisateur/reservations']);
      //   },
      //   error: (err) => {
      //     console.error('Erreur lors de l\'annulation:', err);
      //     this.error = 'Erreur lors de l\'annulation';
      //   }
      // });

      console.log('Réservation annulée');
      this.router.navigate(['/organisateur/reservations']);
    }
  }

  modifierReservation(): void {
    if (this.reservation) {
      this.router.navigate(['/organisateur/reservations/modifier', this.reservation.id]);
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
