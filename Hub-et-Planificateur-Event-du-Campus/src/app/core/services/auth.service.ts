import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Utilisateur } from '../models/utilisateur.model';

export interface LoginResponse {
  token: string;
  tokenType: string;
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  loginReussi: boolean;
  message: string;
}

export interface RegisterRequest {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  telephone?: string;
  matricule?: string;
  filiere?: string;
  niveau?: number;
  departement?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/auth`;

  // BehaviorSubject pour suivre l'état de l'utilisateur
  private currentUserSubject = new BehaviorSubject<Utilisateur | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Charger l'utilisateur depuis localStorage au démarrage
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const user = this.getUser();
    if (user) {
      this.currentUserSubject.next(user);
    }
  }

  // VERSION CORRECTE: Utiliser 'motDePasse' comme attendu par le backend
  login(email: string, motDePasse: string): Observable<ApiResponse<LoginResponse>> {
    console.log('📤 Tentative de connexion:', { email });

    return this.http.post<ApiResponse<LoginResponse>>(`${this.baseUrl}/login`, {
      email: email,
      motDePasse: motDePasse  // ← Backend attend 'motDePasse'
    }).pipe(
      tap(response => {
        console.log('📥 Réponse login:', response);
        if (response.success && response.data?.token) {
          localStorage.setItem('token', response.data.token);

          const user: Utilisateur = {
            id: response.data.id,
            nom: response.data.nom,
            prenom: response.data.prenom,
            email: email,
            role: response.data.role as any,
            actif: true,
            dateInscription: new Date().toISOString()
          };

          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSubject.next(user);

          console.log('✅ Connexion réussie pour:', email);
          console.log('Token stocké:', localStorage.getItem('token'));
          console.log('User stocké:', localStorage.getItem('user'));
        } else {
          console.error('❌ Échec connexion:', response.message);
        }
      })
    );
  }

  registerEtudiant(data: RegisterRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/register/etudiant`, data);
  }

  registerOrganisateur(data: RegisterRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/register/organisateur`, data);
  }

  getUser(): Utilisateur | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    console.log('Utilisateur déconnecté');
  }

  getRole(): string | null {
    const user = this.getUser();
    return user ? user.role : null;
  }

  isAdmin(): boolean {
    const role = this.getRole();
    return role === 'ROLE_ADMIN' || role === 'ADMIN';
  }

  isOrganisateur(): boolean {
    const role = this.getRole();
    return role === 'ROLE_ORGANISATEUR' || role === 'ORGANISATEUR';
  }

  isEtudiant(): boolean {
    const role = this.getRole();
    return role === 'ROLE_ETUDIANT' || role === 'ETUDIANT';
  }

  getUserId(): number | null {
    const user = this.getUser();
    return user ? user.id : null;
  }

  getUserEmail(): string | null {
    const user = this.getUser();
    return user ? user.email : null;
  }

  getUserNomComplet(): string | null {
    const user = this.getUser();
    return user ? `${user.prenom} ${user.nom}` : null;
  }

  getUserInitials(): string {
    const user = this.getUser();
    if (!user) return '👤';
    const prenom = user.prenom || '';
    const nom = user.nom || '';
    if (prenom && nom) {
      return (prenom[0] + nom[0]).toUpperCase();
    }
    if (prenom) return prenom.substring(0, 2).toUpperCase();
    if (nom) return nom.substring(0, 2).toUpperCase();
    return '👤';
  }
}
