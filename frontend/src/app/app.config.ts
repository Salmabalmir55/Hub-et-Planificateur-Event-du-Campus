import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';

// Si vous avez généré l'intercepteur JWT, importez-le ici :
// import { jwtInterceptor } from './core/interceptors/jwt.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      // withInterceptors([jwtInterceptor]) // Décommentez plus tard pour la sécurité
    )
  ]
};
