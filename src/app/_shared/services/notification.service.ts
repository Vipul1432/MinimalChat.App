import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  showNotification(title: string, body: string) {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body: body,
        icon: '../../../assets/staticFiles/notification.png'
      });
    }
  }
}
