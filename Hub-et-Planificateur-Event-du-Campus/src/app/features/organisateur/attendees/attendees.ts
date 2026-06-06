import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { InscriptionService } from '../../../core/services/inscription.service';
import { EventService } from '../../../core/services/event.service';
import { Inscription } from '../../../core/models/inscription.model';

interface Participant {
  nom: string;
  email: string;
  dateInscription: string;
  statut: string;
  etudiantId?: number;
  presence?: boolean;
}

@Component({
  selector: 'app-attendees',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './attendees.html',
  styleUrls: ['./attendees.css']
})
export class AttendeesComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private inscriptionService = inject(InscriptionService);
  private eventService = inject(EventService);
  private cdr = inject(ChangeDetectorRef);

  evenementId: number = 0;
  evenementNom: string = '';
  inscrits: Participant[] = [];
  isLoading = true;

  ngOnInit(): void {
    console.log('=== Attendees ngOnInit ===');
    const idParam = this.route.snapshot.paramMap.get('id');
    console.log('idParam:', idParam);
    this.evenementId = idParam ? +idParam : 0;
    console.log('evenementId:', this.evenementId);

    if (!this.evenementId) {
      this.isLoading = false;
      this.cdr.detectChanges();
      return;
    }

    this.loadEventName();
    this.loadInscriptions();
  }

  loadEventName(): void {
    this.eventService.getEventById(this.evenementId).subscribe({
      next: (data) => {
        this.evenementNom = data.titre || `Événement #${this.evenementId}`;
        console.log('Nom événement:', this.evenementNom);
      },
      error: (err) => {
        console.error('Erreur chargement nom:', err);
        this.evenementNom = `Événement #${this.evenementId}`;
      }
    });
  }

  loadInscriptions(): void {
    console.log('Chargement des inscriptions pour evenementId:', this.evenementId);
    this.inscriptionService.getByEvenement(this.evenementId).subscribe({
      next: (data: Inscription[]) => {
        console.log('Inscriptions reçues:', data);
        this.inscrits = data.map((i) => ({
          nom: `${i.etudiantPrenom || ''} ${i.etudiantNom || ''}`.trim() || 'Étudiant',
          email: i.etudiantEmail || i.etudiantMatricule || `ID: ${i.etudiantId}`,
          dateInscription: i.dateInscription
            ? new Date(i.dateInscription).toLocaleDateString('fr-FR')
            : '-',
          statut: this.getStatutLabel(i.statut),
          etudiantId: i.etudiantId,
          presence: i.presence || false
        }));
        this.isLoading = false;
        this.cdr.detectChanges();
        console.log('Participants chargés:', this.inscrits.length);
      },
      error: (err) => {
        console.error('Erreur chargement inscriptions:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getStatutLabel(statut: string): string {
    const statuts: { [key: string]: string } = {
      'CONFIRMEE': 'CONFIRMÉ',
      'EN_ATTENTE': 'EN ATTENTE',
      'ANNULEE': 'ANNULÉ',
      'PRESENTE': 'PRÉSENT'
    };
    return statuts[statut] || statut;
  }

  togglePresence(participant: Participant): void {
    participant.presence = !participant.presence;
    this.cdr.detectChanges();
    console.log('Présence togglée pour', participant.nom, participant.presence);
  }

  exportToCSV(): void {
    console.log('Export CSV');

    const headers = ['Nom Complet', 'Email/Matricule', "Date d'inscription", 'Statut', 'Présence'];

    const rows = this.inscrits.map(p => [
      p.nom,
      p.email,
      p.dateInscription,
      p.statut,
      p.presence ? 'Présent' : 'Absent'
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(';')).join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    const date = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    link.setAttribute('href', url);
    link.setAttribute('download', `participants_${this.evenementNom}_${date}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert('Export CSV terminé !');
  }

  exportToPDF(): void {
    const printWindow = window.open('', '_blank');

    const tableRows = this.inscrits.map(p => `
      <tr>
        <td>${p.nom}</td>
        <td>${p.email}</td>
        <td>${p.dateInscription}</td>
        <td>${p.statut}</td>
        <td>${p.presence ? 'Présent' : 'Absent'}</td>
      </tr>
    `).join('');

    printWindow?.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Participants - ${this.evenementNom}</title>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #4f46e5; text-align: center; }
            .info { text-align: center; margin-bottom: 20px; color: #666; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background-color: #4f46e5; color: white; }
            tr:nth-child(even) { background-color: #f9fafb; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <h1>Liste des participants</h1>
          <div class="info">
            <p><strong>${this.evenementNom}</strong></p>
            <p>Total: ${this.inscrits.length} participant(s)</p>
            <p>Généré le: ${new Date().toLocaleString('fr-FR')}</p>
          </div>
          <table>
            <thead><tr><th>Nom</th><th>Email</th><th>Date inscription</th><th>Statut</th><th>Présence</th></tr></thead>
            <tbody>${tableRows}</tbody>
          </table>
          <div class="footer"><p>Document généré automatiquement</p></div>
          <script>window.onload = function() { window.print(); setTimeout(function() { window.close(); }, 500); };</script>
        </body>
      </html>
    `);
    printWindow?.document.close();
  }
}
