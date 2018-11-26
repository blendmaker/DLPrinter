import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService extends BehaviorSubject<string> {
  private wsUrl = environment.wsUrl;
  // private wsUrl = 'wss://echo.websocket.org';
  private wsSubject: WebSocketSubject<string>;

  constructor() {
    super('');
    this.wsSubject = new WebSocketSubject(this.wsUrl);
    this.wsSubject.subscribe((data) => console.log(data));
    this.wsSubject.next('ich bin mal ein Test');
    console.log(environment.wsUrl);
    // this.ws = new WebSocket(environment.wsUrl);
  }

  private connect() {
    if (! this.wsSubject || this.wsSubject.closed || this.wsSubject.isStopped) {
      //this.wsSubject.
    }
  }
}
