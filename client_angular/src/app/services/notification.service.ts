import { Injectable } from '@angular/core';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

Pusher.logToConsole = true;
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private echo: Echo;

  constructor() {
    this.echo = new Echo({
      broadcaster: 'pusher',
      key: '26cc3bda74871906ac6e',
      cluster: 'ap2',
      forceTLS: true,
      Pusher: Pusher,
    })
  }

  listenForOrderSuccess(): Observable<any> {
    return new Observable((observer) => {
      this.echo.channel('order-success')
        .listen('.order.success', (data: any) => {
          observer.next(data);  // Emit the data received
        });
    });
  }
}
