import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoggedIn: boolean = false;
  userRole: string | null = null;
  userName: string = '';
  userInitials: string = '';

  ngOnInit(): void {
    this.updateAuthStatus();

    // Écouter les changements de connexion
    this.authService.currentUser$.subscribe(() => {
      this.updateAuthStatus();
    });
  }

  updateAuthStatus(): void {
    this.isLoggedIn = this.authService.isLoggedIn();

    if (this.isLoggedIn) {
      const user = this.authService.getUser();
      this.userRole = user?.role || null;
      this.userName = `${user?.prenom || ''} ${user?.nom || ''}`.trim() || 'Utilisateur';
      this.userInitials = this.getInitials(this.userName);
    } else {
      this.userRole = null;
      this.userName = '';
      this.userInitials = '';
    }
  }

  getInitials(name: string): string {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
