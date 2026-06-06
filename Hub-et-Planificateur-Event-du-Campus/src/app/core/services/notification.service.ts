// src/app/core/services/notification.service.ts

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Notification {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  title?: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  notifications$ = this.notificationSubject.asObservable();

  success(message: string, title?: string): void {
    this.show({ type: 'success', message, title, duration: 3000 });
  }

  error(message: string, title?: string): void {
    this.show({ type: 'error', message, title, duration: 5000 });
  }

  warning(message: string, title?: string): void {
    this.show({ type: 'warning', message, title, duration: 4000 });
  }

  info(message: string, title?: string): void {
    this.show({ type: 'info', message, title, duration: 3000 });
  }

  private show(notification: Notification): void {
    this.notificationSubject.next(notification);
  }
}
