import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-attendees',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './attendees.html',
  styleUrls: ['./attendees.scss']
})
export class AttendeesComponent implements OnInit {
  private route = inject(ActivatedRoute);
  evenementId!: string;

  // Simulation de données issues du rapport (Salma, Houda, Kaoutar)
  inscrits = [
    { nom: 'Salma Balmir', email: 'salma.balmir@campus.ma', dateInscription: '28/05/2026', statut: 'CONFIRMÉ' },
    { nom: 'Houda Riyad', email: 'houda.riyad@campus.ma', dateInscription: '29/05/2026', statut: 'CONFIRMÉ' },
    { nom: 'Kaoutar Misbah', email: 'kaoutar.misbah@campus.ma', dateInscription: '30/05/2026', statut: 'EN ATTENTE' }
  ];

  ngOnInit() {
    // Récupère l'ID depuis l'URL (Ex: si l'URL est /organisateur/evenements/1042/inscrits -> id = 1042)
    this.evenementId = this.route.snapshot.paramMap.get('id') || '';
    console.log("Chargement des inscrits pour l'événement ID :", this.evenementId);
  }
}
