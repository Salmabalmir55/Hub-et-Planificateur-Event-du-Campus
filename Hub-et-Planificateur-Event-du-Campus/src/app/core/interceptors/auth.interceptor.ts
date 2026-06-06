// src/app/core/interceptors/auth.interceptor.ts

import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('accessToken');

    // ✅ AJOUTER LOGS
    console.log('🔑 Interceptor - URL:', req.url);
    console.log('🔑 Interceptor - Méthode:', req.method);
    console.log('🔑 Interceptor - Token présent:', !!token);
    console.log('🔑 Interceptor - Token:', token ? token.substring(0, 20) + '...' : 'null');

    let authReq = req;
    if (token) {
      authReq = req.clone({
        setHeaders: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('🔑 Interceptor - Header Authorization ajouté');
    } else {
      console.log('🔑 Interceptor - PAS de token, requête sans auth');
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('❌ Interceptor - Erreur status:', error.status);
        console.log('❌ Interceptor - Erreur message:', error.message);

        if (error.status === 401) {
          console.log('❌ Interceptor - 401 Non autorisé, redirection vers login');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
