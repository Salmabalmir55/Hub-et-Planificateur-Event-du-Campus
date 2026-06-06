import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app'; // يلا عطاكم عليها إيرور حمر، بدلي App بـ AppComponent

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));