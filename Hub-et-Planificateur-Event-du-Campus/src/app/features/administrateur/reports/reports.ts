import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { HttpClient } from '@angular/common/http';

interface Statistiques {
  totalUtilisateurs: number;
  totalEvenements: number;
  evenementsCeMois: number;
  totalInscriptions: number;
  tauxParticipationMoyen: number;
  totalEtudiants: number;
  totalOrganisateurs: number;
  totalAdmins: number;
  evenementsAVenir: number;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './reports.html',
  styleUrls: ['./reports.css']
})
export class ReportsComponent implements OnInit {
  private http = inject(HttpClient);

  stats: Statistiques | null = null;
  isLoading = true;

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.http
      .get<ApiResponse<Statistiques>>(`${environment.apiUrl}/admin/statistiques`)
      .subscribe({
        next: (response) => {
          this.stats = response.data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erreur lors du chargement des statistiques:', err);
          this.isLoading = false;
        }
      });
  }
}
