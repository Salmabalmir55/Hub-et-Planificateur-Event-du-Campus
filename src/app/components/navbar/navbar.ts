import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'; // L'import indispensable pour les liens

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink], // On permet à la Navbar d'utiliser les liens
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {}