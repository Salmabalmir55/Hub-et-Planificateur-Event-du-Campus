import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-validation',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './validation.html',
  styleUrl: './validation.scss',
})
export class ValidationComponent { }
