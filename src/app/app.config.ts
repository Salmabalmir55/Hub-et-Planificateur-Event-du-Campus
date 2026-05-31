import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';

// يلا زِدْتُوا الـ Interceptor دْيَال الـ JWT ديروا لِيه الـ Import هُنَا (مَثَلاً):
// import { jwtInterceptor } from './core/interceptors/jwt.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // 1️⃣ تحسين أداء وسرعة التطبيق (من عندك أنتِ)
    provideZoneChangeDetection({ eventCoalescing: true }), 
    
    // 2️⃣ تفعيل الـ Routing والروابط الموحدة
    provideRouter(routes), 
    
    // 3️⃣ تفعيل الـ HTTP Client لِلاِتِّصَال بْالـ Backend (من عند سناء)
    provideHttpClient(
      // withInterceptors([jwtInterceptor]) // تْحْيِيدْ الـ Comment فاش تَبْغِيوْ الـ Securité
    )
  ]
};