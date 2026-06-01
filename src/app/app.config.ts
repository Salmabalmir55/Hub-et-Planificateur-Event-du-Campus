import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';

//

export const appConfig: ApplicationConfig = {
  providers: [
    // 1 ِ)
    provideZoneChangeDetection({ eventCoalescing: true }),

    // 2
    provideRouter(routes),

    // 3
    provideHttpClient(

    )
  ]
};
