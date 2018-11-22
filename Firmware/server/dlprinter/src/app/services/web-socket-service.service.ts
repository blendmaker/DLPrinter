import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketServiceService extends BehaviorSubject<string> {
  private ws: WebSocket;

  constructor(observer) {
    super('');
    this.ws = new WebSocket('ws://' + window.location.host);
  }
}
