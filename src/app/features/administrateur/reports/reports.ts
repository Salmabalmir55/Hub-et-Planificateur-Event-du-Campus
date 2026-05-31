import { Component } from '@angular/core';

@Component({
  selector: 'app-reports',
  standalone: true, // <-- L'ajout indispensable pour que le routage fonctionne
  imports: [],
  templateUrl: './reports.html',
  styleUrl: './reports.scss',
})
export class ReportsComponent { }
